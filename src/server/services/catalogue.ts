import "server-only";
import { getBlueprint, sectionTimeBudgets } from "@/domain/blueprints";
import { canAccessExam, type Entitlements } from "@/domain/entitlements";
import type { ResultSummary } from "@/domain/scoring/score";
import type { Db } from "../db";
import { getEntitlements } from "./entitlements";
import { listExams, type ExamRow, type TrackRow } from "./exams";

export type CatalogueStatus = "not_started" | "in_progress" | "completed" | "locked" | "unavailable";

export interface CatalogueEntry {
  exam: ExamRow;
  status: CatalogueStatus;
  lockedReason?: string;
  inProgressAttemptId?: string;
  lastResultAttemptId?: string;
  lastScorePercent?: number | null;
  attempts: number;
  durationMinutes: number | null;
  sectionCount: number;
  difficulty: string;
}

export function trackSummary(trackKey: string) {
  const bp = getBlueprint(trackKey);
  if (!bp) return { durationMinutes: null, sectionCount: 0 };
  const budgets = sectionTimeBudgets(bp);
  const total = budgets.every((b) => b.seconds !== null) ? budgets.reduce((n, b) => n + (b.seconds ?? 0), 0) / 60 : null;
  return { durationMinutes: total, sectionCount: bp.sections.length, blueprint: bp };
}

export function resultPercent(result: ResultSummary | null): number | null {
  if (!result) return null;
  if (result.total) return Math.round((result.total.points / result.total.max) * 100);
  const done = result.sections.filter((s) => s.attempted && s.complete && s.scaledMax);
  if (!done.length) return null;
  return Math.round((done.reduce((n, s) => n + (s.scaledPoints ?? 0), 0) / done.reduce((n, s) => n + (s.scaledMax ?? 0), 0)) * 100);
}

export async function catalogueForUser(db: Db, userId: string, track: TrackRow, ent?: Entitlements): Promise<CatalogueEntry[]> {
  const e = ent ?? (await getEntitlements(db, userId));
  const exams = await listExams(db, track.key);
  const attempts = await db.query<{ id: string; exam_id: string; status: string; result: ResultSummary | null; started_at: string }>(
    `select id, exam_id, status, result, started_at from attempts where user_id = $1 and exam_id = any($2::uuid[]) order by started_at desc`,
    [userId, exams.map((x) => x.id)],
  );
  const summary = trackSummary(track.key);
  return exams.filter((x) => x.status !== "archived").map((exam) => {
    const mine = attempts.filter((a) => a.exam_id === exam.id);
    const inProgress = mine.find((a) => a.status === "in_progress");
    const lastDone = mine.find((a) => a.status === "submitted");
    const access = canAccessExam(e, exam);
    let status: CatalogueStatus;
    if (exam.status !== "published") status = "unavailable";
    else if (!access.ok) status = "locked";
    else if (inProgress) status = "in_progress";
    else if (lastDone) status = "completed";
    else status = "not_started";
    return {
      exam,
      status,
      lockedReason: access.ok ? undefined : access.reason,
      inProgressAttemptId: inProgress?.id,
      lastResultAttemptId: lastDone?.id,
      lastScorePercent: lastDone ? resultPercent(lastDone.result) : undefined,
      attempts: mine.length,
      durationMinutes: summary.durationMinutes,
      sectionCount: summary.sectionCount,
      difficulty: `${track.level} · ${exam.mock_number <= 2 ? "standard" : exam.mock_number <= 4 ? "standard+" : "challenging"}`,
    };
  });
}
