import "server-only";
import { randomUUID } from "node:crypto";
import { ExamContentSchema, type ExamContent, type ListeningScript } from "@/domain/exam/schema";
import type { CurrentUser } from "../auth/session";
import { config } from "../config";
import type { Db } from "../db";
import { audit } from "./audit";
import { createDraftVersion, DomainError, getVersion, saveDraftContent } from "./exams";
import { putObject, signedUrl, supabaseAdmin } from "./storage";

/**
 * Listening audio production.
 *
 * 1. Cast a voice per speaker (stored in the script as speaker.voiceId).
 * 2. Generate one TTS clip per turn and an ambience bed with ElevenLabs.
 * 3. Mix in the browser studio (pauses, ambience level, telephone/PA filters) and upload the
 *    final file.
 * 4. A reviewer listens and approves; approval links the asset to the script in a new or
 *    current draft version. Students only ever receive approved, pre-generated audio.
 */

const XI = "https://api.elevenlabs.io/v1";

function xiKey() {
  if (!config.elevenlabs.configured) throw new DomainError("ElevenLabs is not configured on this server (ELEVENLABS_API_KEY is missing).", 503);
  return config.elevenlabs.apiKey!;
}

export interface AudioAssetRow {
  id: string;
  exam_version_id: string | null;
  script_id: string;
  kind: "turn" | "ambience" | "final";
  turn_id: string | null;
  storage_path: string;
  mime: string;
  duration_sec: string | null;
  provider: string;
  status: "generated" | "approved" | "rejected";
  production: Record<string, unknown>;
  created_at: string;
}

async function loadScript(db: Db, versionId: string, scriptId: string) {
  const v = await getVersion(db, versionId);
  if (!v) throw new DomainError("Version not found", 404);
  const content = ExamContentSchema.parse(v.content);
  const script = content.scripts.find((s) => s.id === scriptId);
  if (!script) throw new DomainError("Script not found", 404);
  return { version: v, content, script };
}

export async function listVoices(): Promise<{ id: string; name: string; labels: Record<string, string> }[]> {
  const res = await fetch(`${XI}/voices`, { headers: { "xi-api-key": xiKey() } });
  if (!res.ok) throw new DomainError(`ElevenLabs voices failed (${res.status}).`, 502);
  const data = (await res.json()) as { voices: { voice_id: string; name: string; labels?: Record<string, string> }[] };
  return data.voices.map((v) => ({ id: v.voice_id, name: v.name, labels: v.labels ?? {} }));
}

/** Store voice casting in the editable version (creates a new draft if the version is locked). */
export async function castVoices(db: Db, actor: CurrentUser, versionId: string, scriptId: string, voices: Record<string, string>) {
  const { version, content } = await loadScript(db, versionId, scriptId);
  const next: ExamContent = structuredClone(content);
  const s = next.scripts.find((x) => x.id === scriptId)!;
  s.speakers = s.speakers.map((sp) => (voices[sp.id] ? { ...sp, voiceId: voices[sp.id] } : sp));
  return writeContent(db, actor, version, next, `Voice casting for ${scriptId}`);
}

async function writeContent(db: Db, actor: CurrentUser, version: { id: string; exam_id: string; locked: boolean }, content: ExamContent, note: string) {
  if (version.locked) {
    const v = await createDraftVersion(db, { examId: version.exam_id, actorId: actor.id, content, note });
    return v.id;
  }
  await saveDraftContent(db, { versionId: version.id, actorId: actor.id, content, note });
  return version.id;
}

async function tts(text: string, voiceId: string, pace: number): Promise<Buffer> {
  const res = await fetch(`${XI}/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": xiKey(), "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text,
      model_id: config.elevenlabs.ttsModel,
      language_code: "de",
      voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.15, speed: Math.max(0.7, Math.min(1.2, pace)) },
    }),
  });
  if (!res.ok) throw new DomainError(`ElevenLabs text-to-speech failed (${res.status}): ${(await res.text()).slice(0, 200)}`, 502);
  return Buffer.from(await res.arrayBuffer());
}

export async function generateTurns(db: Db, actor: CurrentUser, versionId: string, scriptId: string) {
  const { script } = await loadScript(db, versionId, scriptId);
  const missing = script.speakers.filter((s) => !s.voiceId);
  if (missing.length) throw new DomainError(`Cast a voice for: ${missing.map((s) => s.name).join(", ")}.`, 409);
  const created: string[] = [];
  for (const turn of script.turns) {
    const sp = script.speakers.find((s) => s.id === turn.speakerId)!;
    const audio = await tts(turn.text, sp.voiceId!, turn.pace);
    const id = randomUUID();
    const path = `exams/${versionId}/${scriptId}/turns/${turn.id}-${id}.mp3`;
    await putObject("exam-media", path, audio, "audio/mpeg");
    await db.query(
      `insert into audio_assets (id, exam_version_id, script_id, kind, turn_id, storage_path, mime, provider, production, created_by)
       values ($1, $2, $3, 'turn', $4, $5, 'audio/mpeg', 'elevenlabs', $6::jsonb, $7)`,
      [id, versionId, scriptId, turn.id, path, JSON.stringify({ voiceId: sp.voiceId, model: config.elevenlabs.ttsModel, text: turn.text, pace: turn.pace }), actor.id],
    );
    created.push(id);
  }
  await audit(db, { actorId: actor.id, action: "audio.turns_generated", entityType: "exam_version", entityId: versionId, details: { scriptId, turns: created.length } });
  return created;
}

export async function generateAmbience(db: Db, actor: CurrentUser, versionId: string, scriptId: string) {
  const { script } = await loadScript(db, versionId, scriptId);
  const prompt = script.environment.ambiencePrompt ?? defaultAmbiencePrompt(script);
  const res = await fetch(`${XI}/sound-generation`, {
    method: "POST",
    headers: { "xi-api-key": xiKey(), "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text: prompt, duration_seconds: 22, prompt_influence: 0.4 }),
  });
  if (!res.ok) throw new DomainError(`ElevenLabs sound generation failed (${res.status}).`, 502);
  const id = randomUUID();
  const path = `exams/${versionId}/${scriptId}/ambience-${id}.mp3`;
  await putObject("exam-media", path, Buffer.from(await res.arrayBuffer()), "audio/mpeg");
  await db.query(
    `insert into audio_assets (id, exam_version_id, script_id, kind, storage_path, mime, provider, production, created_by)
     values ($1, $2, $3, 'ambience', $4, 'audio/mpeg', 'elevenlabs', $5::jsonb, $6)`,
    [id, versionId, scriptId, path, JSON.stringify({ prompt }), actor.id],
  );
  await audit(db, { actorId: actor.id, action: "audio.ambience_generated", entityType: "exam_version", entityId: versionId, details: { scriptId } });
  return id;
}

export function defaultAmbiencePrompt(script: ListeningScript) {
  const map: Record<string, string> = {
    railway_station: "Quiet ambience of a German railway station hall, distant footsteps and rolling suitcases, no announcements, no speech",
    supermarket: "Soft supermarket ambience, distant checkout beeps and trolleys, no speech",
    telephone: "Very quiet room tone, no speech",
    restaurant: "Quiet café ambience, cutlery and cups clinking softly, no intelligible speech",
    airport: "Airport terminal ambience, soft hum and distant footsteps, no announcements, no speech",
    doctor: "Quiet waiting room ambience, faint ticking clock, no speech",
    workplace: "Calm office ambience, soft keyboard typing, no speech",
    education: "Quiet classroom ambience, chairs moving softly, no speech",
    accommodation: "Quiet hotel lobby ambience, no speech",
    public_office: "Quiet public office waiting area, a printer in the distance, no speech",
    radio: "Clean silence, no ambience",
    family: "Quiet living room ambience, no speech",
    street: "Light city street ambience, distant traffic, no speech",
    shop: "Small shop ambience, door bell once in the distance, no speech",
    other: "Quiet indoor room tone, no speech",
  };
  return map[script.scenario] ?? map.other;
}

const MAX_FINAL_BYTES = 25 * 1024 * 1024;

const FINAL_MIME = /^audio\/(wav|x-wav|mpeg|mp4|ogg|webm|aac)/;

function finalPath(versionId: string, scriptId: string, assetId: string, mime: string) {
  const ext = mime.includes("wav") ? "wav" : mime.includes("mpeg") ? "mp3" : mime.includes("ogg") ? "ogg" : mime.includes("webm") ? "webm" : "m4a";
  return `exams/${versionId}/${scriptId}/final-${assetId}.${ext}`;
}

type FinalMeta = { versionId: string; scriptId: string; mime: string; durationSec: number; production: Record<string, unknown>; provider: "studio_mix" | "upload" };

async function recordFinal(db: Db, actor: CurrentUser, id: string, path: string, args: FinalMeta) {
  await db.query(
    `insert into audio_assets (id, exam_version_id, script_id, kind, storage_path, mime, duration_sec, provider, production, created_by)
     values ($1, $2, $3, 'final', $4, $5, $6, $7, $8::jsonb, $9)`,
    [id, args.versionId, args.scriptId, path, args.mime, args.durationSec, args.provider, JSON.stringify(args.production), actor.id],
  );
  await audit(db, { actorId: actor.id, action: "audio.final_uploaded", entityType: "exam_version", entityId: args.versionId, details: { scriptId: args.scriptId, assetId: id } });
  return id;
}

/** Upload through the app server (development storage). */
export async function uploadFinal(db: Db, actor: CurrentUser, args: FinalMeta & { data: Buffer }) {
  await loadScript(db, args.versionId, args.scriptId);
  if (args.data.length > MAX_FINAL_BYTES) throw new DomainError("Audio file is too large.", 413);
  if (!FINAL_MIME.test(args.mime)) throw new DomainError("Unsupported audio format.", 415);
  const id = randomUUID();
  const path = finalPath(args.versionId, args.scriptId, id, args.mime);
  await putObject("exam-media", path, args.data, args.mime);
  return recordFinal(db, actor, id, path, args);
}

/**
 * Supabase: the browser uploads the file straight to private storage with a one-time signed
 * upload token, because serverless request bodies are limited to a few MB.
 * Returns null when storage is local (development), in which case uploadFinal is used.
 */
export async function prepareFinalUpload(db: Db, args: { versionId: string; scriptId: string; mime: string; bytes: number }) {
  if (config.backend !== "supabase") return null;
  await loadScript(db, args.versionId, args.scriptId);
  if (!(args.bytes > 0) || args.bytes > MAX_FINAL_BYTES) throw new DomainError("Audio file is too large.", 413);
  if (!FINAL_MIME.test(args.mime)) throw new DomainError("Unsupported audio format.", 415);
  const assetId = randomUUID();
  const path = finalPath(args.versionId, args.scriptId, assetId, args.mime);
  const sb = await supabaseAdmin();
  const { data, error } = await sb.storage.from("exam-media").createSignedUploadUrl(path);
  if (error || !data) throw new DomainError("Could not prepare the upload.", 502);
  return { assetId, path: data.path, token: data.token };
}

/** Record a file the browser uploaded with prepareFinalUpload, after checking it really exists. */
export async function completeFinalUpload(db: Db, actor: CurrentUser, args: FinalMeta & { assetId: string }) {
  if (config.backend !== "supabase") throw new DomainError("Direct uploads need Supabase storage.", 400);
  if (!/^[0-9a-f-]{36}$/i.test(args.assetId)) throw new DomainError("Invalid asset id.");
  await loadScript(db, args.versionId, args.scriptId);
  if (await db.one(`select 1 from audio_assets where id = $1`, [args.assetId])) throw new DomainError("Upload already recorded.", 409);
  const path = finalPath(args.versionId, args.scriptId, args.assetId, args.mime);
  const sb = await supabaseAdmin();
  const { data, error } = await sb.storage.from("exam-media").info(path);
  if (error || !data) throw new DomainError("The uploaded file was not found.", 400);
  if ((data.size ?? 0) > MAX_FINAL_BYTES) {
    await sb.storage.from("exam-media").remove([path]);
    throw new DomainError("Audio file is too large.", 413);
  }
  return recordFinal(db, actor, args.assetId, path, args);
}

/** Approve a final mix and link it to the script. Returns the version id that now holds it. */
export async function approveAudio(db: Db, actor: CurrentUser, assetId: string) {
  const asset = await db.one<AudioAssetRow>(`select * from audio_assets where id = $1`, [assetId]);
  if (!asset || asset.kind !== "final" || !asset.exam_version_id) throw new DomainError("Only final mixes can be approved.", 400);
  const { version, content } = await loadScript(db, asset.exam_version_id, asset.script_id);
  // Approve against the exam's current version so newer edits are not lost.
  const exam = await db.one<{ current_version_id: string }>(`select current_version_id from exams where id = $1`, [version.exam_id]);
  const current = exam?.current_version_id && exam.current_version_id !== version.id ? await getVersion(db, exam.current_version_id) : version;
  const base = current ? ExamContentSchema.parse(current.content) : content;
  const next: ExamContent = structuredClone(base);
  const s = next.scripts.find((x) => x.id === asset.script_id);
  if (!s) throw new DomainError("The script no longer exists in the current version.", 409);
  s.audioAssetId = asset.id;
  s.audioStatus = "approved";
  s.durationSec = asset.duration_sec ? Number(asset.duration_sec) : null;
  await db.query(`update audio_assets set status = 'approved', approved_by = $1 where id = $2`, [actor.id, asset.id]);
  await db.query(`update audio_assets set status = 'rejected' where script_id = $1 and exam_version_id = $2 and kind = 'final' and id <> $3 and status = 'approved'`, [asset.script_id, asset.exam_version_id, asset.id]);
  const versionId = await writeContent(db, actor, current ?? version, next, `Approved audio for ${asset.script_id}`);
  await audit(db, { actorId: actor.id, action: "audio.approved", entityType: "exam", entityId: version.exam_id, details: { assetId, scriptId: asset.script_id, versionId } });
  return versionId;
}

export async function rejectAudio(db: Db, actor: CurrentUser, assetId: string) {
  await db.query(`update audio_assets set status = 'rejected' where id = $1 and status = 'generated'`, [assetId]);
  await audit(db, { actorId: actor.id, action: "audio.rejected", entityType: "audio_asset", entityId: assetId });
}

/** Everything the studio needs for one script: turns, ambience and mixes with signed URLs. */
export async function studioScript(db: Db, versionId: string, scriptId: string) {
  const { version, script } = await loadScript(db, versionId, scriptId);
  const assets = await db.query<AudioAssetRow>(
    `select * from audio_assets where script_id = $1 and exam_version_id in (select id from exam_versions where exam_id = $2) order by created_at desc`,
    [scriptId, version.exam_id],
  );
  const withUrls = await Promise.all(assets.map(async (a) => ({ ...a, url: await signedUrl("exam-media", a.storage_path, 3600) })));
  const latestTurn = new Map<string, (typeof withUrls)[number]>();
  for (const a of withUrls) if (a.kind === "turn" && a.turn_id && a.exam_version_id === versionId && !latestTurn.has(a.turn_id)) latestTurn.set(a.turn_id, a);
  return {
    version,
    script,
    turns: script.turns.map((t) => ({ turn: t, asset: latestTurn.get(t.id) ?? null })),
    ambience: withUrls.find((a) => a.kind === "ambience" && a.exam_version_id === versionId) ?? null,
    finals: withUrls.filter((a) => a.kind === "final"),
  };
}
