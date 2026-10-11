import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { reviewItem } from "@/server/services/assessment";
import { signedUrl } from "@/server/services/storage";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ActionForm } from "@/components/admin/action-form";
import { AssessmentCard, type AssessmentView } from "@/components/results/assessment-card";
import { humanAssessmentAction } from "@/server/actions/admin";

export default async function AssessItemPage({ params }: { params: Promise<{ attemptId: string; itemId: string }> }) {
  const { attemptId, itemId } = await params;
  const user = await requirePermission("assessment.review");
  const db = await getDb();
  const r = await reviewItem(db, attemptId, itemId).catch(() => null);
  if (!r) notFound();
  if (r.attempt.user_id === user.id) notFound();
  const task = r.item.writing ?? r.item.speaking;
  const mediaUrl = r.media ? await signedUrl("submissions", r.media.storage_path, 900) : null;
  const ai = r.assessments.find((a) => a.source === "ai");
  const words = r.answer?.kind === "text" ? r.answer.text.trim().split(/\s+/).filter(Boolean).length : null;

  return (
    <>
      <PageHeader eyebrow={<Link href="/admin/assessments" className="hover:underline">Assessment queue</Link>} title={`${r.blueprint.officialName} · ${r.part.partId} · Aufgabe ${r.item.number}`} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle>Task</CardTitle></CardHeader>
            <CardContent className="paper-text flex flex-col gap-2 text-sm">
              <p className="whitespace-pre-wrap">{task?.taskDe}</p>
              {r.item.writing?.leitpunkte?.length ? <ul className="list-disc pl-5">{r.item.writing.leitpunkte.map((p) => <li key={p}>{p}</li>)}</ul> : null}
              {r.item.speaking?.cards?.length ? <p>Cards: {r.item.speaking.cards.map((c) => `${c.title}: ${c.body}`).join(" | ")}</p> : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Candidate answer</CardTitle>{words !== null && <CardDescription>{words} words</CardDescription>}</CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              {r.answer?.kind === "text" && <p className="paper-text whitespace-pre-wrap rounded-md bg-ink-50 p-3">{r.answer.text}</p>}
              {mediaUrl && <audio controls src={mediaUrl} className="w-full" />}
              {r.media?.transcript && <p className="text-ink-600"><strong>Transcript:</strong> {r.media.transcript}</p>}
              {!r.answer && <p className="text-ink-500">No answer.</p>}
            </CardContent>
          </Card>
          {r.assessments.map((a) => <AssessmentCard key={a.id} a={{ ...(a as unknown as AssessmentView), rubric_version: r.rubric.version }} />)}
        </div>
        <Card className="h-fit">
          <CardHeader><CardTitle>Your rating</CardTitle><CardDescription>{r.rubric.note}</CardDescription></CardHeader>
          <CardContent>
            <ActionForm action={humanAssessmentAction} fields={{ attemptId, itemId }} label="Save examiner rating" variant="primary">
              {r.rubric.criteria.map((c) => {
                const prev = ai?.criteria.find((x) => x.id === c.id);
                return (
                  <div key={c.id} className="flex flex-col gap-1 rounded-md border border-ink-100 p-3 text-sm">
                    <label className="flex items-center justify-between gap-3 font-medium">
                      {c.label}
                      <select name={`score:${c.id}`} defaultValue={prev ? String(prev.points) : ""} required className="h-9 rounded-md border border-ink-200 px-2">
                        <option value="" disabled>–</option>
                        {Array.from({ length: c.max + 1 }, (_, i) => <option key={i} value={i}>{i} / {c.max}</option>)}
                      </select>
                    </label>
                    <input name={`comment:${c.id}`} placeholder="Comment for the student" className="h-9 rounded-md border border-ink-200 px-2" />
                  </div>
                );
              })}
              <textarea name="summary" placeholder="Overall feedback" className="h-24 rounded-md border border-ink-200 p-2 text-sm" />
            </ActionForm>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
