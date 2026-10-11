import { requirePermission } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ActionForm } from "@/components/admin/action-form";
import { resolveReportAction } from "@/server/actions/admin";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Issue reports" };

export default async function ReportsPage() {
  await requirePermission("reports.view");
  const rows = await (await getDb()).query<{ id: string; item_id: string | null; message: string; status: string; created_at: string; email: string | null; title: string | null; exam_id: string | null; version_id: string | null; version: number | null }>(
    `select r.id, r.item_id, r.message, r.status, r.created_at, p.email, e.title, e.id as exam_id, v.id as version_id, v.version
     from issue_reports r left join profiles p on p.id = r.user_id left join exam_versions v on v.id = r.exam_version_id left join exams e on e.id = v.exam_id
     order by (r.status = 'open') desc, r.created_at desc limit 200`,
  );
  return (
    <>
      <PageHeader title="Issue reports" description="Problems students reported on questions, answers or recordings." />
      {rows.length === 0 ? <EmptyState title="No reports" /> : (
        <div className="flex flex-col gap-3">
          {rows.map((r) => (
            <Card key={r.id}><CardContent className="flex flex-col gap-2 pt-5 text-sm sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-1">
                <p className="flex flex-wrap items-center gap-2">
                  <Badge tone={r.status === "open" ? "warning" : "neutral"}>{r.status}</Badge>
                  {r.exam_id ? <Link className="text-brand-700 hover:underline" href={`/admin/exams/${r.exam_id}/versions/${r.version_id}`}>{r.title} v{r.version}</Link> : "—"}
                  {r.item_id && <span className="text-ink-500">item {r.item_id}</span>}
                </p>
                <p className="whitespace-pre-wrap">{r.message}</p>
                <p className="text-xs text-ink-500">{formatDateTime(r.created_at)} · {r.email ?? "deleted user"}</p>
              </div>
              {r.status === "open" && (
                <div className="flex gap-2">
                  <ActionForm action={resolveReportAction} fields={{ id: r.id, status: "resolved" }} label="Resolved" />
                  <ActionForm action={resolveReportAction} fields={{ id: r.id, status: "dismissed" }} label="Dismiss" />
                </div>
              )}
            </CardContent></Card>
          ))}
        </div>
      )}
    </>
  );
}
