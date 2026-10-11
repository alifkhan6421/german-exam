import type { ValidationReport } from "@/domain/exam/validate";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

const TONE = { critical: "danger", warning: "warning", info: "neutral" } as const;

export function ValidationReportView({ report }: { report: ValidationReport | null }) {
  if (!report) return <p className="text-sm text-ink-500">Validation has not been run on this version.</p>;
  const order = { critical: 0, warning: 1, info: 2 };
  const issues = [...report.issues].sort((a, b) => order[a.severity] - order[b.severity]);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge tone={report.ok ? "success" : "danger"}>{report.ok ? "No critical issues" : "Blocked"}</Badge>
        <span>{report.counts.critical} critical · {report.counts.warning} warnings · {report.counts.info} notes</span>
        <span className="text-xs text-ink-500">checked {formatDateTime(report.checkedAt)}</span>
      </div>
      {issues.length > 0 && (
        <ul className="flex max-h-96 flex-col divide-y divide-ink-100 overflow-y-auto rounded-lg border border-ink-200 bg-white text-sm">
          {issues.map((i, n) => (
            <li key={n} className="flex gap-3 px-3 py-2">
              <Badge tone={TONE[i.severity]} className="h-fit shrink-0">{i.severity}</Badge>
              <div className="min-w-0">
                <p>{i.message}</p>
                <p className="text-xs text-ink-500">{i.code}{i.where ? ` · ${i.where}` : ""}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
