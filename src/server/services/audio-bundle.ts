import "server-only";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { ExamContentSchema } from "@/domain/exam/schema";
import type { CurrentUser } from "../auth/session";
import type { Db } from "../db";
import { audit } from "./audit";
import { DomainError, getVersion } from "./exams";
import { putObject } from "./storage";

/**
 * Finished listening mixes produced outside the app (ElevenLabs speech, mixed offline) and
 * committed under content/audio/<track>-mock-<n>/. Importing uploads them as unapproved
 * final assets on the exam's current version, exactly like a studio upload: a reviewer still
 * has to listen to and approve each one before students can hear it.
 */

const ROOT = path.join(process.cwd(), "content", "audio");

interface BundleEntry {
  scriptId: string;
  file: string;
  durationSec: number;
  voices: Record<string, string>;
}

interface BundleManifest {
  trackKey: string;
  mockNumber: number;
  tts: { provider: "elevenlabs"; model: string };
  mixer: string;
  entries: BundleEntry[];
}

export async function listAudioBundles(): Promise<(BundleManifest & { dir: string })[]> {
  const dirs = await fs.readdir(ROOT).catch(() => [] as string[]);
  const out: (BundleManifest & { dir: string })[] = [];
  for (const dir of dirs) {
    const raw = await fs.readFile(path.join(ROOT, dir, "manifest.json"), "utf8").catch(() => null);
    if (raw) out.push({ ...(JSON.parse(raw) as BundleManifest), dir });
  }
  return out;
}

export async function importAudioBundle(db: Db, actor: CurrentUser, dir: string) {
  const bundle = (await listAudioBundles()).find((b) => b.dir === dir);
  if (!bundle) throw new DomainError("Audio bundle not found.", 404);
  const exam = await db.one<{ id: string; current_version_id: string }>(
    `select id, current_version_id from exams where track_key = $1 and mock_number = $2`,
    [bundle.trackKey, bundle.mockNumber],
  );
  if (!exam) throw new DomainError("Exam for this audio bundle not found.", 404);
  const version = await getVersion(db, exam.current_version_id);
  if (!version) throw new DomainError("Version not found", 404);
  const scripts = new Set(ExamContentSchema.parse(version.content).scripts.map((s) => s.id));

  let imported = 0;
  let skipped = 0;
  for (const e of bundle.entries) {
    if (!scripts.has(e.scriptId)) throw new DomainError(`Script ${e.scriptId} is not in the current version.`, 409);
    const data = await fs.readFile(path.join(ROOT, dir, e.file));
    const hash = createHash("sha256").update(data).digest("hex");
    const seen = await db.one(
      `select 1 from audio_assets where kind = 'final' and production->>'bundleHash' = $1
         and exam_version_id in (select id from exam_versions where exam_id = $2)`,
      [hash, exam.id],
    );
    if (seen) { skipped++; continue; }
    const id = randomUUID();
    const storagePath = `exams/${version.id}/${e.scriptId}/final-${id}.mp3`;
    await putObject("exam-media", storagePath, data, "audio/mpeg");
    const production = { source: "bundle", bundle: dir, bundleHash: hash, tts: bundle.tts, voices: e.voices, mixer: bundle.mixer };
    await db.query(
      `insert into audio_assets (id, exam_version_id, script_id, kind, storage_path, mime, duration_sec, provider, production, created_by)
       values ($1, $2, $3, 'final', $4, 'audio/mpeg', $5, 'elevenlabs', $6::jsonb, $7)`,
      [id, version.id, e.scriptId, storagePath, e.durationSec, JSON.stringify(production), actor.id],
    );
    imported++;
  }
  await audit(db, { actorId: actor.id, action: "audio.bundle_imported", entityType: "exam_version", entityId: version.id, details: { bundle: dir, imported, skipped } });
  return { imported, skipped };
}
