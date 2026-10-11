import "server-only";
import { randomUUID } from "node:crypto";
import type { Blueprint } from "@/domain/blueprints";
import {
  advance as advanceState,
  canAnswer,
  canPlay,
  createAttemptState,
  currentSectionIds,
  reconcile,
  remainingMs,
  submit as submitState,
  pause as pauseState,
  resume as resumeState,
  type AttemptMode,
  type AttemptState,
} from "@/domain/attempt/state";
import { canAccessExam } from "@/domain/entitlements";
import { toPublicContent, type PublicExamContent } from "@/domain/exam/public";
import { AnswerValueSchema, ExamContentSchema, allItems, findItem, type AnswerValue, type ExamContent } from "@/domain/exam/schema";
import { isCorrect, scoreAttempt, type AssessmentInput, type ResultSummary } from "@/domain/scoring/score";
import { config } from "../config";
import type { Db } from "../db";
import type { CurrentUser } from "../auth/session";
import { getEntitlements } from "./entitlements";
import { DomainError, blueprintOrThrow, getExam, isBlueprintConfirmed, publishedContent } from "./exams";
import { putObject, signedUrl } from "./storage";

export interface AttemptRow {
  id: string;
  user_id: string;
  exam_id: string;
  exam_version_id: string;
  blueprint_key: string;
  blueprint_version: string;
  mode: AttemptMode;
  section_ids: string[];
  state: AttemptState;
  status: "in_progress" | "submitted";
  play_counts: Record<string, number>;
  checked_items: string[];
  result: ResultSummary | null;
  scoring_version: string | null;
  started_at: string;
  submitted_at: string | null;
}

async function event(db: Db, attemptId: string, type: string, payload: Record<string, unknown> = {}) {
  await db.query(`insert into attempt_events (attempt_id, type, payload) values ($1, $2, $3::jsonb)`, [attemptId, type, JSON.stringify(payload)]);
}

async function loadRow(db: Db, attemptId: string, userId: string) {
  const row = await db.one<AttemptRow>(`select * from attempts where id = $1`, [attemptId]);
  if (!row || row.user_id !== userId) throw new DomainError("Attempt not found", 404);
  return row;
}

async function versionFor(db: Db, row: Pick<AttemptRow, "exam_version_id">) {
  const v = await db.one<{ content: unknown; blueprint_key: string; blueprint_version: string }>(
    `select content, blueprint_key, blueprint_version from exam_versions where id = $1`,
    [row.exam_version_id],
  );
  if (!v) throw new DomainError("Exam version missing", 500);
  return { content: ExamContentSchema.parse(v.content), blueprint: blueprintOrThrow(v.blueprint_key, v.blueprint_version) };
}

function speakingExtraSeconds(content: ExamContent, bp: Blueprint): Record<string, number> {
  const extra: Record<string, number> = {};
  for (const s of bp.sections.filter((x) => x.skill === "speaking")) {
    const sec = content.sections.find((x) => x.sectionId === s.id);
    const prep = Math.max(0, ...(sec?.parts.flatMap((p) => p.items.map((i) => i.speaking?.prepSeconds ?? 0)) ?? [0]));
    extra[s.id] = prep;
  }
  return extra;
}

/* ---------------------------------------------------------------------------------------- */
/* Start / resume                                                                             */
/* ---------------------------------------------------------------------------------------- */

export async function startAttempt(
  db: Db,
  user: CurrentUser,
  args: { examId: string; mode: AttemptMode; sectionIds?: string[]; timed?: boolean },
  now = new Date(),
): Promise<{ attemptId: string; resumed: boolean }> {
  const exam = await getExam(db, args.examId);
  if (!exam || exam.status !== "published") throw new DomainError("This exam is not available.", 404);
  const ent = await getEntitlements(db, user.id, now);
  const access = canAccessExam(ent, exam);
  if (!access.ok) throw new DomainError(access.reason!, 402);
  const published = await publishedContent(db, exam.id);
  if (!published) throw new DomainError("This exam is not available.", 404);
  const allSections = [...published.blueprint.sections].sort((a, b) => a.order - b.order).map((s) => s.id);
  const sectionIds = args.sectionIds?.length ? allSections.filter((id) => args.sectionIds!.includes(id)) : allSections;
  if (sectionIds.length === 0) throw new DomainError("Choose at least one section.");
  const isFull = sectionIds.length === allSections.length;
  if (isFull && !ent.fullSimulation) throw new DomainError("Full exam simulation is not included in your plan.", 402);
  if (!isFull && !ent.sectionPractice) throw new DomainError("Section practice is not included in your plan.", 402);
  if (args.mode === "exam" && !isFull) {
    // Section-level exam mode is allowed: modules are timed exactly as in the blueprint.
  }

  // Resume an unfinished attempt with the same scope instead of creating a duplicate.
  const open = await db.query<AttemptRow>(
    `select * from attempts where user_id = $1 and exam_id = $2 and mode = $3 and status = 'in_progress' order by started_at desc`,
    [user.id, exam.id, args.mode],
  );
  const same = open.find((a) => a.section_ids.join() === sectionIds.join());
  if (same) {
    const view = await reconcileAndPersist(db, same, now);
    if (view.status === "in_progress") return { attemptId: same.id, resumed: true };
  }

  if (ent.practiceRetriesPerExam !== null) {
    const used = await db.one<{ n: number }>(
      `select count(*)::int as n from attempts where user_id = $1 and exam_id = $2 and started_at >= date_trunc('month', now())`,
      [user.id, exam.id],
    );
    if ((used?.n ?? 0) >= ent.practiceRetriesPerExam) {
      throw new DomainError(`Your plan includes ${ent.practiceRetriesPerExam} attempts per exam each month. Upgrade for unlimited retries.`, 402);
    }
  }

  const state = createAttemptState({
    blueprint: published.blueprint,
    mode: args.mode,
    sectionIds,
    extraSeconds: speakingExtraSeconds(published.content, published.blueprint),
    timed: args.mode === "exam" ? true : (args.timed ?? true),
    now,
  });
  const id = randomUUID();
  await db.query(
    `insert into attempts (id, user_id, exam_id, exam_version_id, blueprint_key, blueprint_version, mode, section_ids, state, started_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)`,
    [id, user.id, exam.id, published.versionId, published.blueprint.key, published.blueprint.version, args.mode, sectionIds, JSON.stringify(state), now.toISOString()],
  );
  await event(db, id, "started", { mode: args.mode, sectionIds });
  return { attemptId: id, resumed: false };
}

/* ---------------------------------------------------------------------------------------- */
/* Load with server-side timing                                                               */
/* ---------------------------------------------------------------------------------------- */

async function reconcileAndPersist(db: Db, row: AttemptRow, now: Date): Promise<AttemptRow> {
  const { state, events } = reconcile(row.state, now);
  if (events.length === 0 && state.lastSeenAt === row.state.lastSeenAt) return row;
  await db.query(`update attempts set state = $1::jsonb, updated_at = now() where id = $2`, [JSON.stringify(state), row.id]);
  for (const e of events) await event(db, row.id, e);
  const updated = { ...row, state };
  if (state.status === "submitted" && row.status !== "submitted") return finalize(db, updated);
  return updated;
}

export interface AttemptView {
  id: string;
  examId: string;
  examTitle: string;
  trackKey: string;
  mode: AttemptMode;
  status: "in_progress" | "submitted";
  state: AttemptState;
  serverNow: string;
  remainingMs: number | null;
  currentSectionIds: string[];
  sections: { id: string; titleDe: string; titleEn: string; skill: string; parts: { id: string; titleDe: string; playbacks: number | null }[] }[];
  content: PublicExamContent;
  answers: Record<string, AnswerValue>;
  playCounts: Record<string, number>;
  checkedItems: string[];
  devPreviewAudio: boolean;
}

export async function getAttemptView(db: Db, userId: string, attemptId: string, now = new Date()): Promise<AttemptView> {
  let row = await loadRow(db, attemptId, userId);
  row = await reconcileAndPersist(db, row, now);
  const { content, blueprint } = await versionFor(db, row);
  const exam = await getExam(db, row.exam_id);
  const answers = await loadAnswers(db, row.id);
  const scoped: ExamContent = { ...content, sections: content.sections.filter((s) => row.section_ids.includes(s.sectionId)) };
  const devPreviewAudio = config.allowDevPreviewAudio && content.scripts.some((s) => s.audioStatus !== "approved");
  return {
    id: row.id,
    examId: row.exam_id,
    examTitle: exam?.title ?? content.title,
    trackKey: row.blueprint_key,
    mode: row.mode,
    status: row.state.status,
    state: row.state,
    serverNow: now.toISOString(),
    remainingMs: remainingMs(row.state, now),
    currentSectionIds: currentSectionIds(row.state),
    sections: [...blueprint.sections]
      .sort((a, b) => a.order - b.order)
      .filter((s) => row.section_ids.includes(s.id))
      .map((s) => ({ id: s.id, titleDe: s.titleDe, titleEn: s.titleEn, skill: s.skill, parts: s.parts.map((p) => ({ id: p.id, titleDe: p.titleDe, playbacks: p.playbacks?.value ?? null })) })),
    // Transcripts are only released through the playback endpoint (dev preview) or after submission.
    content: toPublicContent(scoped, { includeTranscripts: false }),
    answers,
    playCounts: row.play_counts ?? {},
    checkedItems: row.checked_items ?? [],
    devPreviewAudio,
  };
}

async function loadAnswers(db: Db, attemptId: string): Promise<Record<string, AnswerValue>> {
  const rows = await db.query<{ item_id: string; value: unknown }>(`select item_id, value from attempt_answers where attempt_id = $1`, [attemptId]);
  const out: Record<string, AnswerValue> = {};
  for (const r of rows) {
    const p = AnswerValueSchema.safeParse(r.value);
    if (p.success) out[r.item_id] = p.data;
  }
  return out;
}

/* ---------------------------------------------------------------------------------------- */
/* Answers, playback, recordings                                                              */
/* ---------------------------------------------------------------------------------------- */

export async function saveAnswer(db: Db, userId: string, attemptId: string, itemId: string, rawValue: unknown, now = new Date()) {
  let row = await loadRow(db, attemptId, userId);
  row = await reconcileAndPersist(db, row, now);
  const { content } = await versionFor(db, row);
  const found = findItem(content, itemId);
  if (!found || !row.section_ids.includes(found.section.sectionId)) throw new DomainError("Unknown question.", 404);
  const gate = canAnswer(row.state, found.section.sectionId, now);
  if (!gate.ok) throw new DomainError(gate.reason!, 409);
  if (row.checked_items?.includes(itemId)) throw new DomainError("You already checked this answer.", 409);
  const parsed = AnswerValueSchema.safeParse(rawValue);
  if (!parsed.success) throw new DomainError("Invalid answer.");
  const value = parsed.data;
  const { item, part } = found;
  const objectiveChoice = ["mc", "true_false", "ab", "matching", "gap_select"].includes(item.type);
  if (objectiveChoice) {
    const options = item.options ?? part.optionPool ?? [];
    if (value.kind !== "choice" || !options.some((o) => o.id === value.optionId)) throw new DomainError("Invalid option.");
  } else if (item.type === "short_text" || item.type === "writing") {
    if (value.kind !== "text") throw new DomainError("Expected text.");
  } else if (item.type === "speaking") {
    if (value.kind !== "recording") throw new DomainError("Expected a recording.");
    const media = await db.one(`select 1 from submission_media where id = $1 and attempt_id = $2 and item_id = $3`, [value.mediaId, row.id, itemId]);
    if (!media) throw new DomainError("Recording not found.");
  }
  await db.query(
    `insert into attempt_answers (attempt_id, item_id, value, updated_at) values ($1, $2, $3::jsonb, now())
     on conflict (attempt_id, item_id) do update set value = excluded.value, updated_at = now()`,
    [row.id, itemId, JSON.stringify(value)],
  );
  return { savedAt: now.toISOString() };
}

/** Practice mode only: reveal whether a saved objective answer is correct, then lock it. */
export async function checkAnswer(db: Db, user: CurrentUser, attemptId: string, itemId: string, now = new Date()) {
  let row = await loadRow(db, attemptId, user.id);
  if (row.mode !== "practice") throw new DomainError("Answers are not revealed in exam mode.", 403);
  row = await reconcileAndPersist(db, row, now);
  const { content } = await versionFor(db, row);
  const found = findItem(content, itemId);
  if (!found || !row.section_ids.includes(found.section.sectionId)) throw new DomainError("Unknown question.", 404);
  if (!["mc", "true_false", "ab", "matching", "gap_select", "short_text"].includes(found.item.type)) throw new DomainError("Only objective questions can be checked.");
  const answers = await loadAnswers(db, row.id);
  if (!answers[itemId]) throw new DomainError("Answer the question first.");
  const key = content.answerKey[itemId];
  const ent = await getEntitlements(db, user.id);
  await db.query(`update attempts set checked_items = array_append(checked_items, $1) where id = $2 and not ($1 = any(checked_items))`, [itemId, row.id]);
  await event(db, row.id, "checked", { itemId });
  return {
    correct: isCorrect(found.item, answers[itemId], key?.correct ?? []),
    correctAnswers: key?.correct ?? [],
    explanation: ent.explanations ? key?.explanation ?? null : null,
    evidence: ent.explanations ? key?.evidence ?? null : null,
    explanationsLocked: !ent.explanations,
  };
}

export async function clearAnswer(db: Db, userId: string, attemptId: string, itemId: string, now = new Date()) {
  let row = await loadRow(db, attemptId, userId);
  row = await reconcileAndPersist(db, row, now);
  const { content } = await versionFor(db, row);
  const found = findItem(content, itemId);
  if (!found) throw new DomainError("Unknown question.", 404);
  const gate = canAnswer(row.state, found.section.sectionId, now);
  if (!gate.ok) throw new DomainError(gate.reason!, 409);
  if (row.checked_items?.includes(itemId)) throw new DomainError("You already checked this answer.", 409);
  await db.query(`delete from attempt_answers where attempt_id = $1 and item_id = $2`, [row.id, itemId]);
}

export async function requestPlayback(db: Db, userId: string, attemptId: string, stimulusId: string, now = new Date()) {
  let row = await loadRow(db, attemptId, userId);
  row = await reconcileAndPersist(db, row, now);
  const { content, blueprint } = await versionFor(db, row);
  let sectionId: string | undefined;
  let partId: string | undefined;
  let scriptId: string | undefined;
  for (const s of content.sections) for (const p of s.parts) {
    const st = [...p.stimuli].find((x) => x.id === stimulusId);
    if (st) { sectionId = s.sectionId; partId = p.partId; scriptId = st.scriptId; }
  }
  // Worked examples are part of the instructions; they also follow the part's playback rule.
  if (!sectionId || !scriptId) throw new DomainError("Unknown recording.", 404);
  const gate = canAnswer(row.state, sectionId, now);
  if (!gate.ok) throw new DomainError(gate.reason!, 409);
  const allowed = blueprint.sections.find((s) => s.id === sectionId)?.parts.find((p) => p.id === partId)?.playbacks?.value ?? null;
  const plays = row.play_counts?.[stimulusId] ?? 0;
  const ok = canPlay({ mode: row.mode, plays, allowed });
  if (!ok.ok) throw new DomainError(ok.reason!, 409);
  const counts = { ...(row.play_counts ?? {}), [stimulusId]: plays + 1 };
  await db.query(`update attempts set play_counts = $1::jsonb where id = $2`, [JSON.stringify(counts), row.id]);
  await event(db, row.id, "audio_play", { stimulusId, play: plays + 1 });
  const script = content.scripts.find((s) => s.id === scriptId)!;
  if (script.audioStatus === "approved" && script.audioAssetId) {
    const asset = await db.one<{ storage_path: string }>(`select storage_path from audio_assets where id = $1 and status = 'approved'`, [script.audioAssetId]);
    if (asset) return { playsUsed: plays + 1, allowed, url: await signedUrl("exam-media", asset.storage_path, 900), preview: null };
  }
  if (!config.allowDevPreviewAudio) throw new DomainError("Audio is not available for this recording.", 503);
  const transcript = toPublicContent({ ...content, sections: [] }, { includeTranscripts: true }).scripts.find((s) => s.id === scriptId)?.transcript ?? [];
  return { playsUsed: plays + 1, allowed, url: null, preview: { label: "Development preview voice — not production audio", transcript } };
}

const MAX_RECORDING_BYTES = 15 * 1024 * 1024;

export async function uploadRecording(
  db: Db,
  user: CurrentUser,
  attemptId: string,
  itemId: string,
  file: { data: Buffer; mime: string; durationSec: number },
  now = new Date(),
) {
  if (file.data.length > MAX_RECORDING_BYTES) throw new DomainError("Recording is too large.", 413);
  if (!/^audio\/(webm|ogg|mp4|mpeg|wav|x-wav|aac)/.test(file.mime)) throw new DomainError("Unsupported audio format.", 415);
  let row = await loadRow(db, attemptId, user.id);
  row = await reconcileAndPersist(db, row, now);
  const { content } = await versionFor(db, row);
  const found = findItem(content, itemId);
  if (!found || found.item.type !== "speaking") throw new DomainError("Unknown speaking task.", 404);
  const gate = canAnswer(row.state, found.section.sectionId, now);
  if (!gate.ok) throw new DomainError(gate.reason!, 409);
  const id = randomUUID();
  const ext = file.mime.includes("ogg") ? "ogg" : file.mime.includes("mp4") || file.mime.includes("aac") ? "m4a" : file.mime.includes("wav") ? "wav" : file.mime.includes("mpeg") ? "mp3" : "webm";
  const storagePath = `${user.id}/${row.id}/${itemId}-${id}.${ext}`;
  await putObject("submissions", storagePath, file.data, file.mime);
  const retention = new Date(now.getTime() + user.recordingRetentionDays * 86400_000);
  await db.query(
    `insert into submission_media (id, attempt_id, user_id, item_id, storage_path, mime, bytes, duration_sec, retention_until) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, row.id, user.id, itemId, storagePath, file.mime, file.data.length, file.durationSec, retention.toISOString()],
  );
  await saveAnswer(db, user.id, attemptId, itemId, { kind: "recording", mediaId: id, durationSec: file.durationSec }, now);
  return { mediaId: id };
}

/* ---------------------------------------------------------------------------------------- */
/* Section transitions, pause, submit                                                         */
/* ---------------------------------------------------------------------------------------- */

export async function advanceSection(db: Db, userId: string, attemptId: string, now = new Date()) {
  let row = await loadRow(db, attemptId, userId);
  row = await reconcileAndPersist(db, row, now);
  if (row.state.status === "submitted") return row;
  const state = advanceState(row.state, now);
  await db.query(`update attempts set state = $1::jsonb, updated_at = now() where id = $2`, [JSON.stringify(state), row.id]);
  await event(db, row.id, "section_advanced", { from: row.state.groups[row.state.currentGroup].groupId });
  const updated = { ...row, state };
  return state.status === "submitted" ? finalize(db, updated) : updated;
}

export async function submitAttempt(db: Db, userId: string, attemptId: string, now = new Date()) {
  let row = await loadRow(db, attemptId, userId);
  row = await reconcileAndPersist(db, row, now);
  if (row.status === "submitted") return row;
  const state = submitState(row.state, now);
  await event(db, row.id, "submitted", { reason: "manual" });
  return finalize(db, { ...row, state });
}

export async function setPaused(db: Db, userId: string, attemptId: string, paused: boolean, now = new Date()) {
  let row = await loadRow(db, attemptId, userId);
  if (row.mode !== "practice") throw new DomainError("Pausing is only available in practice mode.", 409);
  row = await reconcileAndPersist(db, row, now);
  const state = paused ? pauseState(row.state, now) : resumeState(row.state, now);
  await db.query(`update attempts set state = $1::jsonb where id = $2`, [JSON.stringify(state), row.id]);
  await event(db, row.id, paused ? "paused" : "resumed");
}

/** Score deterministically and store the result. Rubric items stay pending until assessed. */
export async function finalize(db: Db, row: AttemptRow): Promise<AttemptRow> {
  const result = await computeResult(db, row);
  const submittedAt = row.state.submittedAt ?? new Date().toISOString();
  await db.query(
    `update attempts set state = $1::jsonb, status = 'submitted', submitted_at = $2, result = $3::jsonb, scoring_version = $4, updated_at = now() where id = $5`,
    [JSON.stringify(row.state), submittedAt, JSON.stringify(result), result.scoringVersion, row.id],
  );
  return { ...row, status: "submitted", submitted_at: submittedAt, result, scoring_version: result.scoringVersion };
}

export async function computeResult(db: Db, row: AttemptRow): Promise<ResultSummary> {
  const { content, blueprint } = await versionFor(db, row);
  const answers = await loadAnswers(db, row.id);
  const assessments = await db.query<{ item_id: string; source: "ai" | "human"; total: string | number; max: string | number }>(
    `select item_id, source, total, max from assessments where attempt_id = $1 order by created_at`,
    [row.id],
  );
  const inputs: AssessmentInput[] = assessments.map((a) => ({ itemId: a.item_id, source: a.source, total: Number(a.total), max: Number(a.max) }));
  return scoreAttempt({
    content,
    blueprint,
    answers,
    assessments: inputs,
    sectionIds: row.section_ids,
    blueprintConfirmed: await isBlueprintConfirmed(db, blueprint.key, blueprint.version),
  });
}

/** Re-score after a new assessment (AI or human). */
export async function rescore(db: Db, attemptId: string) {
  const row = await db.one<AttemptRow>(`select * from attempts where id = $1`, [attemptId]);
  if (!row || row.status !== "submitted") return;
  const result = await computeResult(db, row);
  await db.query(`update attempts set result = $1::jsonb, scoring_version = $2 where id = $3`, [JSON.stringify(result), result.scoringVersion, attemptId]);
}

/* ---------------------------------------------------------------------------------------- */
/* Results & review                                                                           */
/* ---------------------------------------------------------------------------------------- */

export async function getReview(db: Db, user: CurrentUser, attemptId: string) {
  const row = await loadRow(db, attemptId, user.id);
  if (row.status !== "submitted") throw new DomainError("Results are available after submission.", 409);
  const { content, blueprint } = await versionFor(db, row);
  const ent = await getEntitlements(db, user.id);
  const answers = await loadAnswers(db, row.id);
  const assessments = await db.query<{
    id: string; item_id: string; kind: string; source: "ai" | "human"; rubric_version: string; evaluator_version: string;
    criteria: { id: string; label: string; points: number; max: number; comment?: string }[]; total: string; max: string; feedback: Record<string, unknown>; created_at: string;
  }>(`select * from assessments where attempt_id = $1 order by created_at`, [row.id]);
  const media = await db.query<{ id: string; item_id: string; storage_path: string; transcript: string | null; duration_sec: string | null }>(
    `select id, item_id, storage_path, transcript, duration_sec from submission_media where attempt_id = $1`,
    [row.id],
  );
  const mediaUrls: Record<string, { url: string; transcript: string | null }> = {};
  for (const m of media) mediaUrls[m.id] = { url: await signedUrl("submissions", m.storage_path, 900), transcript: m.transcript };
  const exam = await getExam(db, row.exam_id);
  const scoped: ExamContent = { ...content, sections: content.sections.filter((s) => row.section_ids.includes(s.sectionId)) };
  return {
    attempt: row,
    exam,
    blueprint,
    content: toPublicContent(scoped, { includeTranscripts: true }),
    answerKey: Object.fromEntries(
      allItems(scoped).map(({ item }) => {
        const k = content.answerKey[item.id];
        return [item.id, { correct: k?.correct ?? [], explanation: ent.explanations ? k?.explanation : undefined, evidence: ent.explanations ? k?.evidence : undefined }];
      }),
    ),
    explanationsLocked: !ent.explanations,
    answers,
    assessments: assessments.map((a) => ({ ...a, total: Number(a.total), max: Number(a.max) })),
    mediaUrls,
  };
}

export async function listUserAttempts(db: Db, userId: string, limit = 50) {
  return db.query<{
    id: string; exam_id: string; title: string; track_key: string; mode: AttemptMode; status: string; started_at: string;
    submitted_at: string | null; result: ResultSummary | null; section_ids: string[];
  }>(
    `select a.id, a.exam_id, e.title, e.track_key, a.mode, a.status, a.started_at, a.submitted_at, a.result, a.section_ids
     from attempts a join exams e on e.id = a.exam_id where a.user_id = $1 order by a.started_at desc limit $2`,
    [userId, limit],
  );
}
