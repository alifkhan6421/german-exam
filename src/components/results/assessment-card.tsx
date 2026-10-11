import { Badge } from "@/components/ui/badge";

export interface AssessmentView {
  id: string;
  source: "ai" | "human";
  evaluator_version: string;
  rubric_version: string;
  criteria: { id: string; label: string; points: number; max: number; comment?: string }[];
  total: number;
  max: number;
  feedback: Record<string, unknown>;
  created_at: string;
}

type Annotation = { excerpt: string; issue: string; suggestion: string };

/** Rubric feedback. AI results are labelled provisional; examiner results are labelled as such. */
export function AssessmentCard({ a, superseded }: { a: AssessmentView; superseded?: boolean }) {
  const f = a.feedback as {
    summary?: string; strengths?: string[]; improvements?: string[]; annotations?: Annotation[]; improvedVersion?: string;
    taskPointsCovered?: { point: string; covered: boolean }[]; wordCount?: number; rubricNote?: string;
  };
  return (
    <div className={`flex flex-col gap-3 rounded-lg border p-4 ${a.source === "ai" ? "border-brand-200 bg-brand-50/40" : "border-green-200 bg-success-50/40"} ${superseded ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {a.source === "ai" ? <Badge tone="brand">AI feedback · provisional</Badge> : <Badge tone="success">Examiner review</Badge>}
          {superseded && <Badge>Replaced by examiner review</Badge>}
        </div>
        <span className="text-sm font-semibold tabular-nums">{a.total} / {a.max} rubric points</span>
      </div>
      {f.summary && <p className="text-sm">{f.summary}</p>}
      <table className="w-full text-sm">
        <tbody>
          {a.criteria.map((c) => (
            <tr key={c.id} className="border-t border-ink-100 align-top">
              <td className="py-1.5 pr-3 font-medium">{c.label}</td>
              <td className="py-1.5 pr-3 tabular-nums whitespace-nowrap">{c.points} / {c.max}</td>
              <td className="py-1.5 text-ink-600">{c.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {f.taskPointsCovered && f.taskPointsCovered.length > 0 && (
        <div className="text-sm">
          <p className="font-medium">Task points</p>
          <ul className="mt-1 flex flex-col gap-0.5">
            {f.taskPointsCovered.map((p, i) => <li key={i}>{p.covered ? "✓" : "✗"} {p.point}</li>)}
          </ul>
        </div>
      )}
      {(f.strengths?.length || f.improvements?.length) ? (
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          {f.strengths?.length ? <div><p className="font-medium">What went well</p><ul className="mt-1 list-disc pl-5">{f.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div> : null}
          {f.improvements?.length ? <div><p className="font-medium">What to improve</p><ul className="mt-1 list-disc pl-5">{f.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul></div> : null}
        </div>
      ) : null}
      {f.annotations && f.annotations.length > 0 && (
        <div className="text-sm">
          <p className="font-medium">Corrections</p>
          <ul className="mt-1 flex flex-col gap-1.5">
            {f.annotations.map((n, i) => (
              <li key={i}><span className="rounded bg-danger-50 px-1 line-through decoration-danger-600/60">{n.excerpt}</span> → <span className="rounded bg-success-50 px-1">{n.suggestion}</span> <span className="text-ink-500">({n.issue})</span></li>
            ))}
          </ul>
        </div>
      )}
      {f.improvedVersion && (
        <details className="text-sm">
          <summary className="cursor-pointer font-medium">Improved version</summary>
          <p className="paper-text mt-2 whitespace-pre-wrap rounded-md bg-white p-3">{f.improvedVersion}</p>
        </details>
      )}
      <p className="text-xs text-ink-500">
        {f.rubricNote ?? "Practice rubric."} {a.source === "ai" ? `Evaluator: ${a.evaluator_version}.` : ""} Rubric {a.rubric_version}.
      </p>
    </div>
  );
}
