import "server-only";
import { randomUUID } from "node:crypto";
import { BLUEPRINTS, blueprintReadiness, getBlueprint, type Blueprint } from "@/domain/blueprints";
import { ExamContentSchema, type ExamContent } from "@/domain/exam/schema";
import { validateExam, type ValidationReport } from "@/domain/exam/validate";
import { config } from "../config";
import type { Db } from "../db";
import { audit } from "./audit";

export type ExamStatus = "draft" | "generated" | "validated" | "in_review" | "approved" | "published" | "archived";
export type VersionStatus = ExamStatus | "superseded";

export interface TrackRow {
  key: string;
  provider: "goethe" | "telc";
  level: string;
  title: string;
  variant: string;
  sort: number;
}

export interface ExamRow {
  id: string;
  track_key: string;
  mock_number: number;
  title: string;
  access_tier: "free" | "premium";
  status: ExamStatus;
  current_version_id: string | null;
  published_version_id: string | null;
  updated_at: string;
}

export interface VersionRow {
  id: string;
  exam_id: string;
  version: number;
  blueprint_key: string;
  blueprint_version: string;
  content: unknown;
  status: VersionStatus;
  validation: ValidationReport | null;
  locked: boolean;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  published_at: string | null;
}

export class DomainError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/* ---------------------------------------------------------------------------------------- */
/* Catalogue                                                                                  */
/* ---------------------------------------------------------------------------------------- */

export async function listTracks(db: Db): Promise<TrackRow[]> {
  return db.query<TrackRow>(`select key, provider, level, title, variant, sort from exam_tracks where active order by sort`);
}

export async function getTrack(db: Db, key: string) {
  return db.one<TrackRow>(`select key, provider, level, title, variant, sort from exam_tracks where key = $1`, [key]);
}

export async function trackFor(db: Db, provider: string, level: string) {
  return db.one<TrackRow>(`select key, provider, level, title, variant, sort from exam_tracks where provider = $1 and level = $2 and active`, [provider, level.toUpperCase()]);
}

export async function listExams(db: Db, trackKey?: string): Promise<ExamRow[]> {
  return trackKey
    ? db.query<ExamRow>(`select * from exams where track_key = $1 order by mock_number`, [trackKey])
    : db.query<ExamRow>(`select * from exams order by track_key, mock_number`);
}

export async function getExam(db: Db, id: string) {
  return db.one<ExamRow>(`select * from exams where id = $1`, [id]);
}

export async function getVersion(db: Db, id: string) {
  return db.one<VersionRow>(`select * from exam_versions where id = $1`, [id]);
}

export async function listVersions(db: Db, examId: string) {
  return db.query<VersionRow>(`select * from exam_versions where exam_id = $1 order by version desc`, [examId]);
}

export async function isBlueprintConfirmed(db: Db, key: string, version: string) {
  return !!(await db.one(`select 1 from blueprint_confirmations where blueprint_key = $1 and version = $2`, [key, version]));
}

export function blueprintOrThrow(key: string, version: string): Blueprint {
  const bp = getBlueprint(key, version);
  if (!bp) throw new DomainError(`Unknown blueprint ${key}@${version}`);
  return bp;
}

/** Published version content for students. Callers must strip it with toPublicContent(). */
export async function publishedContent(db: Db, examId: string) {
  const row = await db.one<{ id: string; content: unknown; blueprint_key: string; blueprint_version: string }>(
    `select v.id, v.content, v.blueprint_key, v.blueprint_version from exams e join exam_versions v on v.id = e.published_version_id
     where e.id = $1 and e.status = 'published'`,
    [examId],
  );
  if (!row) return null;
  return { versionId: row.id, content: ExamContentSchema.parse(row.content), blueprint: blueprintOrThrow(row.blueprint_key, row.blueprint_version) };
}

export async function versionContent(db: Db, versionId: string) {
  const row = await getVersion(db, versionId);
  if (!row) return null;
  return { row, content: ExamContentSchema.parse(row.content), blueprint: blueprintOrThrow(row.blueprint_key, row.blueprint_version) };
}

/* ---------------------------------------------------------------------------------------- */
/* Administration lifecycle: Draft → Generated → Validated → In review → Approved → Published */
/* ---------------------------------------------------------------------------------------- */

async function siblingsFor(db: Db, examId: string, trackKey: string) {
  const rows = await db.query<{ title: string; content: unknown }>(
    `select e.title, v.content from exams e join exam_versions v on v.id = coalesce(e.published_version_id, e.current_version_id)
     where e.track_key = $1 and e.id <> $2`,
    [trackKey, examId],
  );
  return rows.flatMap((r) => {
    const p = ExamContentSchema.safeParse(r.content);
    return p.success ? [{ title: r.title, content: p.data }] : [];
  });
}

export async function runValidation(db: Db, examId: string, content: unknown, bp: Blueprint): Promise<ValidationReport> {
  const exam = await getExam(db, examId);
  if (!exam) throw new DomainError("Exam not found", 404);
  return validateExam(content, bp, {
    blueprintConfirmed: await isBlueprintConfirmed(db, bp.key, bp.version),
    allowDevPreviewAudio: config.allowDevPreviewAudio,
    siblings: await siblingsFor(db, examId, exam.track_key),
  });
}

/** Create a new editable version. Defaults to a copy of the latest version, or a blueprint skeleton. */
export async function createDraftVersion(
  db: Db,
  args: { examId: string; actorId: string; content?: unknown; status?: "draft" | "generated"; note?: string },
): Promise<VersionRow> {
  const exam = await getExam(db, args.examId);
  if (!exam) throw new DomainError("Exam not found", 404);
  const bp = BLUEPRINTS.find((b) => b.key === exam.track_key);
  if (!bp) throw new DomainError("No blueprint for this track");
  return db.tx(async (tx) => {
    const latest = await tx.one<VersionRow>(`select * from exam_versions where exam_id = $1 order by version desc limit 1`, [exam.id]);
    const content = args.content ?? latest?.content ?? skeletonContent(bp, exam.title);
    const id = randomUUID();
    const next = (latest?.version ?? 0) + 1;
    await tx.query(
      `insert into exam_versions (id, exam_id, version, blueprint_key, blueprint_version, content, status, created_by)
       values ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)`,
      [id, exam.id, next, bp.key, bp.version, JSON.stringify(content), args.status ?? "draft", args.actorId],
    );
    await tx.query(`update exams set current_version_id = $1, status = case when status = 'published' then status else $2 end, updated_at = now() where id = $3`, [id, args.status ?? "draft", exam.id]);
    await audit(tx, { actorId: args.actorId, action: "exam.version_created", entityType: "exam", entityId: exam.id, details: { version: next, from: latest?.version ?? null, note: args.note } });
    return (await tx.one<VersionRow>(`select * from exam_versions where id = $1`, [id]))!;
  });
}

export async function saveDraftContent(db: Db, args: { versionId: string; actorId: string; content: unknown; note?: string }) {
  const v = await getVersion(db, args.versionId);
  if (!v) throw new DomainError("Version not found", 404);
  if (v.locked) throw new DomainError("This version is locked. Create a new version to make changes.", 409);
  const parsed = ExamContentSchema.safeParse(args.content);
  if (!parsed.success) throw new DomainError(`Content does not match the exam schema: ${parsed.error.issues.slice(0, 3).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
  await db.query(`update exam_versions set content = $1::jsonb, status = 'draft', validation = null, updated_at = now() where id = $2`, [JSON.stringify(parsed.data), v.id]);
  await db.query(`update exams set status = case when status = 'published' then status else 'draft' end, updated_at = now() where id = $1`, [v.exam_id]);
  await audit(db, { actorId: args.actorId, action: "exam.edited", entityType: "exam", entityId: v.exam_id, details: { version: v.version, note: args.note } });
}

export async function validateVersion(db: Db, args: { versionId: string; actorId: string }): Promise<ValidationReport> {
  const v = await getVersion(db, args.versionId);
  if (!v) throw new DomainError("Version not found", 404);
  const bp = blueprintOrThrow(v.blueprint_key, v.blueprint_version);
  const report = await runValidation(db, v.exam_id, v.content, bp);
  const status = v.locked ? v.status : report.ok ? "validated" : "draft";
  await db.query(`update exam_versions set validation = $1::jsonb, status = $2, updated_at = now() where id = $3`, [JSON.stringify(report), status, v.id]);
  if (!v.locked) await db.query(`update exams set status = case when status = 'published' then status else $1 end where id = $2`, [status, v.exam_id]);
  await audit(db, { actorId: args.actorId, action: "exam.validated", entityType: "exam", entityId: v.exam_id, details: { version: v.version, ok: report.ok, counts: report.counts } });
  return report;
}

export async function submitForReview(db: Db, args: { versionId: string; actorId: string }) {
  const report = await validateVersion(db, args);
  if (!report.ok) throw new DomainError("Fix the critical validation issues before sending this exam for review.", 409);
  const v = (await getVersion(db, args.versionId))!;
  await db.query(`update exam_versions set status = 'in_review', locked = true, updated_at = now() where id = $1`, [v.id]);
  await db.query(`update exams set status = case when status = 'published' then status else 'in_review' end where id = $1`, [v.exam_id]);
  await audit(db, { actorId: args.actorId, action: "exam.submitted_for_review", entityType: "exam", entityId: v.exam_id, details: { version: v.version } });
}

export async function reviewVersion(db: Db, args: { versionId: string; actorId: string; decision: "approve" | "request_changes" | "reject"; comments?: string }) {
  const v = await getVersion(db, args.versionId);
  if (!v) throw new DomainError("Version not found", 404);
  if (v.status !== "in_review") throw new DomainError("Only versions in review can receive a review decision.", 409);
  await db.tx(async (tx) => {
    await tx.query(`insert into review_decisions (exam_version_id, reviewer_id, decision, comments) values ($1, $2, $3, $4)`, [v.id, args.actorId, args.decision, args.comments ?? null]);
    if (args.decision === "approve") {
      await tx.query(`update exam_versions set status = 'approved', approved_by = $1, approved_at = now(), updated_at = now() where id = $2`, [args.actorId, v.id]);
      await tx.query(`update exams set status = case when status = 'published' then status else 'approved' end where id = $1`, [v.exam_id]);
    } else {
      // Unlock for edits; the review history stays attached to this version.
      await tx.query(`update exam_versions set status = 'draft', locked = false, updated_at = now() where id = $1`, [v.id]);
      await tx.query(`update exams set status = case when status = 'published' then status else 'draft' end where id = $1`, [v.exam_id]);
    }
    await audit(tx, { actorId: args.actorId, action: `exam.review_${args.decision}`, entityType: "exam", entityId: v.exam_id, details: { version: v.version, comments: args.comments } });
  });
}

/**
 * Publish an approved version. Re-validates against current data (critical issues block),
 * supersedes the previously published version and keeps it intact for existing attempts.
 */
export async function publishVersion(db: Db, args: { versionId: string; actorId: string }) {
  const v = await getVersion(db, args.versionId);
  if (!v) throw new DomainError("Version not found", 404);
  if (v.status !== "approved") throw new DomainError("Only approved versions can be published.", 409);
  const bp = blueprintOrThrow(v.blueprint_key, v.blueprint_version);
  const report = await runValidation(db, v.exam_id, v.content, bp);
  if (!report.ok) {
    await db.query(`update exam_versions set validation = $1::jsonb where id = $2`, [JSON.stringify(report), v.id]);
    throw new DomainError(`Publication blocked: ${report.issues.filter((i) => i.severity === "critical").map((i) => i.message).slice(0, 3).join(" ")}`, 409);
  }
  await db.tx(async (tx) => {
    await tx.query(`update exam_versions set status = 'superseded' where exam_id = $1 and status = 'published'`, [v.exam_id]);
    await tx.query(`update exam_versions set status = 'published', locked = true, published_at = now(), validation = $1::jsonb where id = $2`, [JSON.stringify(report), v.id]);
    await tx.query(`update exams set status = 'published', published_version_id = $1, current_version_id = $1, updated_at = now() where id = $2`, [v.id, v.exam_id]);
    await audit(tx, { actorId: args.actorId, action: "exam.published", entityType: "exam", entityId: v.exam_id, details: { version: v.version } });
  });
}

export async function unpublishExam(db: Db, args: { examId: string; actorId: string }) {
  await db.query(`update exams set status = 'approved', published_version_id = null, updated_at = now() where id = $1 and status = 'published'`, [args.examId]);
  await db.query(`update exam_versions set status = 'approved' where exam_id = $1 and status = 'published'`, [args.examId]);
  await audit(db, { actorId: args.actorId, action: "exam.unpublished", entityType: "exam", entityId: args.examId });
}

export async function archiveExam(db: Db, args: { examId: string; actorId: string }) {
  await db.query(`update exams set status = 'archived', published_version_id = null, updated_at = now() where id = $1`, [args.examId]);
  await db.query(`update exam_versions set status = 'archived' where exam_id = $1 and status in ('published', 'approved')`, [args.examId]);
  await audit(db, { actorId: args.actorId, action: "exam.archived", entityType: "exam", entityId: args.examId });
}

/** Copy the latest content of one exam into another slot of the same track as a new draft. */
export async function duplicateExam(db: Db, args: { fromExamId: string; toExamId: string; actorId: string }) {
  const from = await getExam(db, args.fromExamId);
  const to = await getExam(db, args.toExamId);
  if (!from || !to) throw new DomainError("Exam not found", 404);
  if (from.track_key !== to.track_key) throw new DomainError("Exams can only be duplicated within the same track.");
  const src = from.current_version_id ? await getVersion(db, from.current_version_id) : undefined;
  if (!src) throw new DomainError("Source exam has no content.");
  const content = ExamContentSchema.parse(src.content);
  // Clear approved audio: recordings belong to the source exam's scripts.
  const copy: ExamContent = {
    ...content,
    title: to.title,
    scripts: content.scripts.map((s) => ({ ...s, audioAssetId: null, audioStatus: "none", durationSec: null })),
  };
  const v = await createDraftVersion(db, { examId: to.id, actorId: args.actorId, content: copy, note: `Duplicated from ${from.title}` });
  await audit(db, { actorId: args.actorId, action: "exam.duplicated", entityType: "exam", entityId: to.id, details: { from: from.id } });
  return v;
}

export async function confirmBlueprint(db: Db, args: { key: string; version: string; actorId: string; note: string }) {
  if (!args.note.trim()) throw new DomainError("Describe what was checked and against which source.");
  await db.query(`insert into blueprint_confirmations (blueprint_key, version, confirmed_by, note) values ($1, $2, $3, $4)`, [args.key, args.version, args.actorId, args.note.trim()]);
  await audit(db, { actorId: args.actorId, action: "blueprint.confirmed", entityType: "blueprint", entityId: `${args.key}@${args.version}`, details: { note: args.note } });
}

export async function blueprintStatus(db: Db, bp: Blueprint) {
  const confirmations = await db.query<{ note: string; created_at: string; confirmed_by: string | null; email: string | null }>(
    `select c.note, c.created_at, c.confirmed_by, p.email from blueprint_confirmations c left join profiles p on p.id = c.confirmed_by
     where c.blueprint_key = $1 and c.version = $2 order by c.created_at desc`,
    [bp.key, bp.version],
  );
  return { confirmations, readiness: blueprintReadiness(bp, confirmations.length > 0) };
}

/* ---------------------------------------------------------------------------------------- */
/* Skeleton content from a blueprint (structure only — no invented exam text)                  */
/* ---------------------------------------------------------------------------------------- */

export function skeletonContent(bp: Blueprint, title: string): ExamContent {
  let counter = 0;
  const sections = [...bp.sections].sort((a, b) => a.order - b.order).map((s) => {
    let number = 0;
    return {
      sectionId: s.id,
      parts: s.parts.map((p) => {
        const n = p.itemCount.value ?? 1;
        const type = p.itemType.value;
        const stimuli = s.skill === "listening"
          ? Array.from({ length: n }, (_, i) => ({ id: `${p.id}-audio-${i + 1}`, kind: "audio" as const, title: `Audio ${i + 1}`, scriptId: `${p.id}-script-${i + 1}`, body: "" }))
          : [{ id: `${p.id}-text-1`, kind: "text" as const, title: "Text", body: "[Text hier einfügen]" }];
        const items = Array.from({ length: n }, (_, i) => {
          number++;
          counter++;
          const optCount = p.optionsPerItem?.value ?? (type === "true_false" ? 2 : 3);
          const letters = "abcdefghijklmnop";
          return {
            id: `${s.id}-${counter}`,
            number,
            type,
            stimulusIds: s.skill === "listening" ? [`${p.id}-audio-${i + 1}`] : [`${p.id}-text-1`],
            prompt: type === "writing" || type === "speaking" ? p.titleDe : "[Aufgabe]",
            options:
              type === "true_false" ? [{ id: "r", label: "Richtig", text: "Richtig" }, { id: "f", label: "Falsch", text: "Falsch" }]
              : type === "mc" || type === "ab" ? Array.from({ length: optCount }, (_, k) => ({ id: letters[k], label: letters[k], text: `[Option ${letters[k]}]` }))
              : undefined,
            writing: type === "writing" ? { taskDe: p.instructionsDe, leitpunkte: [], approxWords: p.writing?.approxWords?.value ?? undefined, minWords: p.writing?.minWords?.value ?? undefined } : undefined,
            speaking: type === "speaking" ? { taskDe: p.instructionsDe, cards: [], partnerTurns: [], prepSeconds: p.speaking?.prepSeconds.value ?? 0, responseSeconds: p.speaking?.responseSeconds.value ?? 60 } : undefined,
          };
        });
        const pool = (type === "matching" || type === "gap_select") && p.optionPoolSize?.value
          ? Array.from({ length: p.optionPoolSize.value }, (_, k) => ({ id: "abcdefghijklmnop"[k], label: "abcdefghijklmnop"[k], text: `[Option ${"abcdefghijklmnop"[k]}]` }))
          : undefined;
        return { partId: p.id, instructionsDe: p.instructionsDe, stimuli, items, optionPool: pool };
      }),
    };
  });
  const scripts = sections.flatMap((s) => s.parts.flatMap((p) => p.stimuli.filter((st) => st.kind === "audio").map((st) => ({
    id: st.scriptId!,
    title: st.title ?? "Audio",
    scenario: "other" as const,
    environment: { preset: "other" as const, ambienceLevel: 0.1, telephoneFilter: false, publicAddress: false, reverb: 0 },
    speakers: [{ id: "s1", name: "Sprecher 1", role: "Sprecher", gender: "neutral" as const, age: "adult" as const, accent: "standard" }],
    turns: [{ id: "t1", speakerId: "s1", text: "[Skript hier einfügen]", pauseAfterMs: 400, pace: 1 }],
    audioAssetId: null,
    audioStatus: "none" as const,
    durationSec: null,
  }))));
  return ExamContentSchema.parse({
    schemaVersion: 1,
    blueprintKey: bp.key,
    blueprintVersion: bp.version,
    title,
    themes: [],
    sections,
    scripts,
    answerKey: {},
  });
}
