import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenCheck, RotateCcw } from "lucide-react";
import { getBlueprint } from "@/domain/blueprints";
import { requireUser } from "@/server/auth/session";
import { config } from "@/server/config";
import { getDb } from "@/server/db";
import { getReview } from "@/server/services/attempts";
import { DomainError, getTrack } from "@/server/services/exams";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Table, Td, Th } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { AssessButton } from "@/components/results/assess-button";
import { RUBRIC_STATUS } from "@/components/results/status";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Results" };

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const db = await getDb();
  let review;
  try {
    review = await getReview(db, user, id);
  } catch (e) {
    if (e instanceof DomainError) notFound();
    throw e;
  }
  const { attempt, exam, blueprint } = review;
  const result = attempt.result!;
  const track = exam ? await getTrack(db, exam.track_key) : undefined;
  const bp = getBlueprint(blueprint.key, blueprint.version) ?? blueprint;
  const attempted = result.sections.filter((s) => s.attempted);
  const anyProvisional = attempted.some((s) => s.provisional);
  const anyPending = attempted.some((s) => !s.complete);
  const rubricItems = result.items.filter((i) => i.correct === null);
  const itemInfo = new Map(review.content.sections.flatMap((s) => s.parts.flatMap((p) => p.items.map((item) => [item.id, { item }] as const))));
  const aiByItem = new Set(review.assessments.filter((a) => a.source === "ai").map((a) => a.item_id));
  const examHref = track ? `/exams/${track.provider}/${track.level.toLowerCase()}/${exam!.mock_number}` : "/exams";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={<Link href="/dashboard" className="inline-flex items-center gap-1 hover:underline"><ArrowLeft className="h-3.5 w-3.5" />Dashboard</Link>}
        title={`Results — ${exam?.title ?? "Mock exam"}`}
        description={<>{attempt.mode === "exam" ? "Full simulation" : "Practice mode"} · submitted {formatDateTime(attempt.submitted_at!)}{attempt.state.submitReason === "expired" ? " automatically when time ran out" : ""}</>}
        actions={<>
          <ButtonLink href={`/attempts/${id}/review`} variant="primary"><BookOpenCheck className="h-4 w-4" />Review answers</ButtonLink>
          <ButtonLink href={examHref} variant="secondary"><RotateCcw className="h-4 w-4" />Try again</ButtonLink>
        </>}
      />

      <Alert tone="info">
        This is a practice estimate calculated by Prüfungsklar. It is not an official result and does not predict your result in the real examination.
      </Alert>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader><CardTitle>Overall</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {result.total ? (
              <>
                <p className="text-4xl font-semibold tabular-nums">{result.total.points}<span className="text-lg text-ink-400"> / {result.total.max}</span></p>
                <Progress value={(result.total.points / result.total.max) * 100} />
              </>
            ) : (
              <p className="text-sm text-ink-600">
                {anyPending ? "The total appears once all writing and speaking answers are assessed." : bp.scoring.reporting.value === "total" ? "A total is only shown for a complete exam." : "This exam reports each module separately."}
              </p>
            )}
            {result.grade && <p className="text-sm">Practice grade band: <strong>{result.grade}</strong></p>}
            <div className="rounded-md bg-ink-50 p-3 text-sm">
              {result.pass.estimate === null ? (
                <p className="text-ink-600">{result.pass.reason}</p>
              ) : (
                <p>
                  <Badge tone={result.pass.estimate ? "success" : "danger"}>{result.pass.estimate ? "Pass level reached" : "Below pass level"}</Badge>
                  <span className="mt-1 block text-ink-600">{result.pass.reason}</span>
                </p>
              )}
            </div>
            {anyProvisional && <p className="text-xs text-ink-500">Includes provisional AI scores. An examiner&apos;s review replaces them.</p>}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>By module</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <thead><tr><Th>Module</Th><Th className="hidden sm:table-cell">Objective items</Th><Th className="text-right">Points</Th><Th className="hidden md:table-cell">Status</Th></tr></thead>
              <tbody>
                {attempted.map((s) => {
                  const pct = s.scaledPoints !== null && s.scaledMax ? Math.round((s.scaledPoints / s.scaledMax) * 100) : null;
                  const st = RUBRIC_STATUS[s.rubric.status];
                  return (
                    <tr key={s.sectionId}>
                      <Td><span className="font-medium">{s.titleDe}</span></Td>
                      <Td className="hidden sm:table-cell text-sm text-ink-600">
                        {s.objective.max > 0 ? `${s.objective.correct} correct · ${s.objective.incorrect} wrong · ${s.objective.unanswered} blank` : "—"}
                      </Td>
                      <Td className="text-right tabular-nums">
                        {s.scaledPoints !== null ? <>{s.scaledPoints}{s.scaledMax !== null && <span className="text-ink-400"> / {s.scaledMax}</span>}{pct !== null && <span className="ml-2 text-xs text-ink-500">{pct}%</span>}</> : <span className="text-ink-400">pending</span>}
                      </Td>
                      <Td className="hidden md:table-cell"><Badge tone={st.tone}>{st.label}</Badge></Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {rubricItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Writing and speaking</CardTitle>
            <CardDescription>
              These answers are rated with a practice rubric. AI feedback is provisional; an examiner can review it.
              {!user.aiConsent && <> To use AI feedback, turn on AI processing in <Link className="text-brand-700 underline" href="/settings">Settings</Link>.</>}
              {!config.llm.configured && <> AI feedback is not configured on this server, so answers wait for an examiner.</>}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-ink-100">
            {rubricItems.map((i) => {
              const info = itemInfo.get(i.itemId);
              const partTitle = bp.sections.find((s) => s.id === i.sectionId)?.parts.find((p) => p.id === i.partId)?.titleDe ?? i.partId;
              const st = RUBRIC_STATUS[i.rubricStatus!];
              const canRequest = i.answered && !aiByItem.has(i.itemId) && i.rubricStatus === "pending" && user.aiConsent && config.llm.configured;
              return (
                <div key={i.itemId} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">{partTitle} · Aufgabe {i.number}</span>
                    <span className="text-sm text-ink-500 line-clamp-1">{info?.item.writing?.taskDe ?? info?.item.speaking?.taskDe ?? info?.item.prompt}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={st.tone}>{st.label}</Badge>
                    {i.points !== null && i.maxPoints !== null && <span className="tabular-nums text-sm">{i.points} / {i.maxPoints}</span>}
                    {canRequest && <AssessButton attemptId={id} itemId={i.itemId} kind={i.type === "speaking" ? "speaking" : "writing"} />}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
