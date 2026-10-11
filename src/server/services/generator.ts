import "server-only";
import { goetheA1Mock1 } from "@/content/goethe-a1/mock-1";
import { ExamContentSchema, type ExamContent } from "@/domain/exam/schema";
import { validateExam, type ValidationReport } from "@/domain/exam/validate";
import { mergeGenerated, type GenerationScope, type GenerationTarget } from "@/domain/generation/merge";
import { buildGenerationPrompt } from "@/domain/generation/prompt";
import type { CurrentUser } from "../auth/session";
import { config } from "../config";
import type { Db } from "../db";
import { audit } from "./audit";
import { blueprintOrThrow, createDraftVersion, DomainError, getExam, getVersion, isBlueprintConfirmed, skeletonContent } from "./exams";
import { extractJson, generateText } from "./llm";
import { getBlueprint } from "@/domain/blueprints";

export interface GenerationJob {
  id: string;
  scope: GenerationScope;
  track_key: string;
  exam_id: string | null;
  exam_version_id: string | null;
  target: GenerationTarget & { appliedVersionId?: string };
  prompt: string;
  status: "queued" | "running" | "succeeded" | "failed";
  provider: string | null;
  model: string | null;
  output: { raw?: unknown; candidate?: ExamContent } | null;
  validation: ValidationReport | null;
  error: string | null;
  usage: Record<string, unknown> | null;
  created_at: string;
  finished_at: string | null;
}

const EXAMPLE = ExamContentSchema.parse(goetheA1Mock1);

/** A short, structurally representative example: one part (and its scripts/keys) of the given skill. */
function formatExample(skill: "listening" | "other") {
  const section = EXAMPLE.sections.find((s) => (skill === "listening" ? s.sectionId === "hoeren" : s.sectionId === "lesen"))!;
  const part = section.parts[0];
  const scriptIds = new Set(part.stimuli.flatMap((s) => (s.scriptId ? [s.scriptId] : [])));
  return {
    part,
    scripts: EXAMPLE.scripts.filter((s) => scriptIds.has(s.id)).slice(0, 2),
    answerKey: Object.fromEntries(part.items.map((i) => [i.id, EXAMPLE.answerKey[i.id]])),
  };
}

async function baseContent(db: Db, examId: string) {
  const exam = await getExam(db, examId);
  if (!exam) throw new DomainError("Exam not found", 404);
  const bp = getBlueprint(exam.track_key);
  if (!bp) throw new DomainError("No blueprint for this track");
  const v = exam.current_version_id ? await getVersion(db, exam.current_version_id) : undefined;
  const parsed = v ? ExamContentSchema.safeParse(v.content) : undefined;
  return { exam, bp, version: v, content: parsed?.success ? parsed.data : skeletonContent(bp, exam.title) };
}

export async function runGeneration(db: Db, actor: CurrentUser, args: { examId: string; scope: GenerationScope; target: GenerationTarget; brief: string }) {
  if (!config.llm.configured) throw new DomainError("AI generation is not configured on this server (ANTHROPIC_API_KEY is missing).", 503);
  const { exam, bp, version, content } = await baseContent(db, args.examId);
  const section = bp.sections.find((s) => s.id === args.target.sectionId);
  const others = await db.query<{ content: { themes?: string[] } }>(
    `select v.content from exams e join exam_versions v on v.id = e.current_version_id where e.track_key = $1 and e.id <> $2`,
    [exam.track_key, exam.id],
  );
  const avoidThemes = [...new Set(others.flatMap((o) => o.content?.themes ?? []))];
  const prompt = buildGenerationPrompt({
    blueprint: bp,
    scope: args.scope,
    target: args.target,
    base: content,
    brief: args.brief,
    formatExample: formatExample(section?.skill === "listening" ? "listening" : "other"),
    avoidThemes,
  });
  const job = (await db.one<{ id: string }>(
    `insert into generation_jobs (scope, track_key, exam_id, exam_version_id, target, prompt, status, provider, model, created_by)
     values ($1, $2, $3, $4, $5::jsonb, $6, 'running', 'anthropic', $7, $8) returning id`,
    [args.scope, exam.track_key, exam.id, version?.id ?? null, JSON.stringify(args.target), `${prompt.promptVersion}\n\n${args.brief}`, config.llm.generationModel, actor.id],
  ))!;
  await audit(db, { actorId: actor.id, action: "ai.generation_started", entityType: "exam", entityId: exam.id, details: { jobId: job.id, scope: args.scope, target: args.target } });
  try {
    const { text, usage } = await generateText({ system: prompt.system, user: prompt.user });
    const raw = extractJson(text);
    const candidate = mergeGenerated(content, args.scope, args.target, raw);
    const validation = validateExam(candidate, blueprintOrThrow(bp.key, bp.version), {
      blueprintConfirmed: await isBlueprintConfirmed(db, bp.key, bp.version),
      allowDevPreviewAudio: config.allowDevPreviewAudio,
    });
    await db.query(
      `update generation_jobs set status = 'succeeded', output = $1::jsonb, validation = $2::jsonb, usage = $3::jsonb, model = $4, finished_at = now() where id = $5`,
      [JSON.stringify({ raw, candidate }), JSON.stringify(validation), JSON.stringify(usage), usage.model, job.id],
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await db.query(`update generation_jobs set status = 'failed', error = $1, finished_at = now() where id = $2`, [message.slice(0, 4000), job.id]);
  }
  return job.id;
}

/** Save a successful generation as a new version with status "generated". Never publishes. */
export async function applyGeneration(db: Db, actor: CurrentUser, jobId: string) {
  const job = await db.one<GenerationJob>(`select * from generation_jobs where id = $1`, [jobId]);
  if (!job || job.status !== "succeeded" || !job.output?.candidate || !job.exam_id) throw new DomainError("This generation cannot be applied.", 409);
  if (job.target.appliedVersionId) throw new DomainError("This generation was already saved as a version.", 409);
  const exam = await getExam(db, job.exam_id);
  if (exam?.current_version_id !== job.exam_version_id) {
    throw new DomainError("The exam changed after this generation ran. Run the generation again so nothing is overwritten.", 409);
  }
  const v = await createDraftVersion(db, { examId: job.exam_id, actorId: actor.id, content: job.output.candidate, status: "generated", note: `AI generation ${job.scope} (job ${job.id})` });
  await db.query(`update generation_jobs set target = target || $1::jsonb where id = $2`, [JSON.stringify({ appliedVersionId: v.id }), job.id]);
  await audit(db, { actorId: actor.id, action: "ai.generation_applied", entityType: "exam", entityId: job.exam_id, details: { jobId, versionId: v.id } });
  return v;
}

export async function listJobs(db: Db, examId?: string, limit = 30) {
  return db.query<GenerationJob & { exam_title: string | null; email: string | null }>(
    `select j.*, e.title as exam_title, p.email from generation_jobs j left join exams e on e.id = j.exam_id left join profiles p on p.id = j.created_by
     ${examId ? "where j.exam_id = $2" : ""} order by j.created_at desc limit $1`,
    examId ? [limit, examId] : [limit],
  );
}

export async function getJob(db: Db, id: string) {
  return db.one<GenerationJob>(`select * from generation_jobs where id = $1`, [id]);
}
