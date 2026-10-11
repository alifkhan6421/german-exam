import { notFound } from "next/navigation";
import { toPublicContent } from "@/domain/exam/public";
import type { AttemptState } from "@/domain/attempt/state";
import { requirePermission } from "@/server/auth/session";
import { config } from "@/server/config";
import { getDb } from "@/server/db";
import { getExam, versionContent } from "@/server/services/exams";
import type { AttemptView } from "@/server/services/attempts";
import { Simulator } from "@/components/exam/simulator";

export const metadata = { title: "Preview" };

/** Read-only student view of any version (all sections open, untimed, nothing is saved). */
export default async function PreviewPage({ params }: { params: Promise<{ id: string; versionId: string }> }) {
  const { id, versionId } = await params;
  await requirePermission("exam.review");
  const db = await getDb();
  const [exam, v] = await Promise.all([getExam(db, id).catch(() => undefined), versionContent(db, versionId).catch(() => null)]);
  if (!exam || !v || v.row.exam_id !== id) notFound();
  const now = new Date().toISOString();
  const sections = [...v.blueprint.sections].sort((a, b) => a.order - b.order);
  const sectionIds = sections.map((s) => s.id).filter((sid) => v.content.sections.some((s) => s.sectionId === sid));
  const state: AttemptState = {
    mode: "practice",
    groups: [{ groupId: "preview", sectionIds, seconds: null, startedAt: now, deadlineAt: null, closedAt: null, closedReason: null, usedMsBeforePause: 0 }],
    currentGroup: 0,
    status: "in_progress",
    pausedAt: null,
    submittedAt: null,
    submitReason: null,
    reconnects: 0,
    lastSeenAt: now,
  };
  const view: AttemptView = {
    id: "preview",
    examId: id,
    examTitle: `${exam.title} · v${v.row.version}`,
    trackKey: v.blueprint.key,
    mode: "practice",
    status: "in_progress",
    state,
    serverNow: now,
    remainingMs: null,
    currentSectionIds: sectionIds,
    sections: sections.filter((s) => sectionIds.includes(s.id)).map((s) => ({ id: s.id, titleDe: s.titleDe, titleEn: s.titleEn, skill: s.skill, parts: s.parts.map((p) => ({ id: p.id, titleDe: p.titleDe, playbacks: p.playbacks?.value ?? null })) })),
    content: toPublicContent(v.content, { includeTranscripts: false }),
    answers: {},
    playCounts: {},
    checkedItems: [],
    devPreviewAudio: config.allowDevPreviewAudio,
  };
  return <div className="-mx-4 -my-6 sm:-mx-8"><Simulator initial={view} preview /></div>;
}
