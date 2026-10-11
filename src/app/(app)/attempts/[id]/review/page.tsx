import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Lock, X } from "lucide-react";
import type { AnswerValue, Item, Option, Part } from "@/domain/exam/schema";
import { requireUser } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { getReview } from "@/server/services/attempts";
import { DomainError } from "@/server/services/exams";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { TextStimulus } from "@/components/exam/text-stimulus";
import { AssessmentCard, type AssessmentView } from "@/components/results/assessment-card";
import { cn } from "@/lib/utils";

export const metadata = { title: "Review" };

function optionsFor(item: Item, part: Part): Option[] {
  return item.options ?? part.optionPool ?? [];
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const db = await getDb();
  let r;
  try {
    r = await getReview(db, user, id);
  } catch (e) {
    if (e instanceof DomainError) notFound();
    throw e;
  }
  const { content, blueprint, answers, answerKey, attempt } = r;
  const results = new Map(attempt.result!.items.map((i) => [i.itemId, i]));
  const assessments = r.assessments as unknown as (AssessmentView & { item_id: string })[];
  const scripts = new Map(content.scripts.map((s) => [s.id, s]));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow={<Link href={`/attempts/${id}/results`} className="inline-flex items-center gap-1 hover:underline"><ArrowLeft className="h-3.5 w-3.5" />Results</Link>}
        title={`Answer review — ${r.exam?.title ?? ""}`}
        description="Your answers, the correct solutions, explanations and listening transcripts."
      />
      {r.explanationsLocked && (
        <div className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white p-3 text-sm">
          <Lock className="h-4 w-4 text-ink-500" /> Explanations are part of Premium. <Link href="/pricing" className="text-brand-700 underline">See plans</Link>
        </div>
      )}
      {content.sections.map((section) => {
        const bs = blueprint.sections.find((s) => s.id === section.sectionId);
        return (
          <section key={section.sectionId} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{bs?.titleDe ?? section.sectionId}</h2>
            {section.parts.map((part) => {
              const bpPart = bs?.parts.find((p) => p.id === part.partId);
              const audio = part.stimuli.filter((s) => s.kind === "audio");
              const printed = part.stimuli.filter((s) => s.kind !== "audio");
              return (
                <div key={part.partId} className="paper flex flex-col gap-4 rounded-xl p-5">
                  <div>
                    <h3 className="font-semibold">{bpPart?.titleDe ?? part.partId}</h3>
                    <p className="paper-text text-sm text-ink-600">{part.instructionsDe}</p>
                  </div>
                  {printed.length > 0 && (
                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium text-ink-700">Show texts ({printed.length})</summary>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">{printed.map((st) => <TextStimulus key={st.id} st={st} />)}</div>
                    </details>
                  )}
                  {audio.length > 0 && (
                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium text-ink-700">Show transcripts ({audio.length})</summary>
                      <div className="mt-3 flex flex-col gap-3">
                        {audio.map((st) => {
                          const sc = st.scriptId ? scripts.get(st.scriptId) : undefined;
                          return (
                            <div key={st.id} className="rounded-lg border border-paper-line bg-white p-3">
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">{st.title ?? sc?.title}</p>
                              {sc?.transcript?.map((t, i) => <p key={i} className="paper-text"><strong>{t.speaker}:</strong> {t.text}</p>) ?? <p className="text-ink-500">No transcript.</p>}
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  )}
                  <ol className="flex flex-col gap-3">
                    {part.items.map((item) => (
                      <ReviewItem
                        key={item.id}
                        item={item}
                        part={part}
                        answer={answers[item.id]}
                        result={results.get(item.id)}
                        keyEntry={answerKey[item.id]}
                        assessments={assessments.filter((a) => a.item_id === item.id)}
                        mediaUrls={r.mediaUrls}
                      />
                    ))}
                  </ol>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}

function ReviewItem({
  item, part, answer, result, keyEntry, assessments, mediaUrls,
}: {
  item: Item;
  part: Part;
  answer: AnswerValue | undefined;
  result: { correct: boolean | null; points: number | null; maxPoints: number | null } | undefined;
  keyEntry: { correct: string[]; explanation?: string; evidence?: string } | undefined;
  assessments: (AssessmentView & { item_id: string })[];
  mediaUrls: Record<string, { url: string; transcript: string | null }>;
}) {
  const opts = optionsFor(item, part);
  const label = (oid: string) => {
    const o = opts.find((x) => x.id === oid);
    return o ? `${o.label}${o.text && o.text !== o.label ? ` — ${o.text}` : ""}` : oid;
  };
  const hasHuman = assessments.some((a) => a.source === "human");
  return (
    <li className="flex flex-col gap-2 rounded-lg bg-white p-3 ring-1 ring-paper-line">
      <div className="flex items-start justify-between gap-3">
        <p className="paper-text"><span className="mr-2 font-semibold">{item.number}.</span>{item.prompt || item.fieldLabel || item.writing?.taskDe || item.speaking?.taskDe}</p>
        {result?.correct === true && <Badge tone="success"><Check className="h-3 w-3" />Correct</Badge>}
        {result?.correct === false && <Badge tone="danger"><X className="h-3 w-3" />{answer ? "Incorrect" : "Not answered"}</Badge>}
      </div>
      {(item.type === "writing" || item.type === "speaking") ? (
        <div className="flex flex-col gap-2 text-sm">
          {answer?.kind === "text" && <p className="paper-text whitespace-pre-wrap rounded-md bg-ink-50 p-3">{answer.text}</p>}
          {answer?.kind === "recording" && mediaUrls[answer.mediaId] && (
            <div className="flex flex-col gap-1">
              <audio controls src={mediaUrls[answer.mediaId].url} className="w-full" />
              {mediaUrls[answer.mediaId].transcript && <p className="text-ink-600"><span className="font-medium">Transcript:</span> {mediaUrls[answer.mediaId].transcript}</p>}
            </div>
          )}
          {!answer && <p className="text-ink-500">Not answered.</p>}
          {assessments.length === 0 && answer && <p className="text-ink-500">Not assessed yet.</p>}
          {assessments.map((a) => <AssessmentCard key={a.id} a={a} superseded={a.source === "ai" && hasHuman} />)}
        </div>
      ) : (
        <div className="grid gap-1 text-sm sm:grid-cols-2">
          <p>
            <span className="text-ink-500">Your answer: </span>
            <span className={cn("font-medium", result?.correct ? "text-success-600" : "text-danger-600")}>
              {!answer ? "—" : answer.kind === "choice" ? label(answer.optionId) : answer.kind === "text" ? answer.text : "—"}
            </span>
          </p>
          <p><span className="text-ink-500">Correct: </span><span className="font-medium">{keyEntry?.correct.map((c) => (item.type === "short_text" ? c : label(c))).join(" / ") || "—"}</span></p>
          {keyEntry?.explanation && <p className="sm:col-span-2 text-ink-700">{keyEntry.explanation}</p>}
          {keyEntry?.evidence && <p className="sm:col-span-2 text-ink-500 italic">„{keyEntry.evidence}“</p>}
        </div>
      )}
    </li>
  );
}
