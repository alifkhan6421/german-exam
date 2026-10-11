import Link from "next/link";
import { requirePermission } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { reviewQueue } from "@/server/services/assessment";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Assessments" };

export default async function AssessmentsPage() {
  await requirePermission("assessment.review");
  const queue = await reviewQueue(await getDb());
  return (
    <>
      <PageHeader title="Assessment queue" description="Writing and speaking answers without an examiner review, oldest first. Examiner scores replace provisional AI scores." />
      {queue.length === 0 ? <EmptyState title="Nothing to review" /> : (
        <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
          <Table>
            <thead><tr><Th>Submitted</Th><Th>Exam</Th><Th>Task</Th><Th className="hidden md:table-cell">Student</Th><Th>AI</Th><Th /></tr></thead>
            <tbody>
              {queue.map((q) => (
                <tr key={`${q.attempt_id}:${q.item_id}`}>
                  <Td className="text-xs">{formatDateTime(q.submitted_at)}</Td>
                  <Td>{q.exam_title}</Td>
                  <Td><Badge tone={q.kind === "writing" ? "brand" : "telc"}>{q.kind}</Badge> {q.item_id}</Td>
                  <Td className="hidden md:table-cell text-xs">{q.student_email}</Td>
                  <Td>{q.has_ai ? <Badge tone="brand">provisional</Badge> : "—"}</Td>
                  <Td className="text-right"><Link className="text-brand-700 hover:underline" href={`/admin/assessments/${q.attempt_id}/${q.item_id}`}>Review</Link></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}
