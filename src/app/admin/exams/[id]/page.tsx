import Link from "next/link";
import { notFound } from "next/navigation";
import { can } from "@/domain/roles";
import { getBlueprint } from "@/domain/blueprints";
import { requirePermission } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { blueprintStatus, getExam, listExams, listVersions } from "@/server/services/exams";
import { listJobs } from "@/server/services/generator";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Table, Td, Th } from "@/components/ui/table";
import { ActionForm } from "@/components/admin/action-form";
import { EXAM_STATUS_LABEL, EXAM_STATUS_TONE } from "@/components/admin/status";
import { archiveAction, createDraftAction, duplicateAction, setAccessTierAction, unpublishAction } from "@/server/actions/admin";
import { formatDateTime } from "@/lib/utils";

export default async function AdminExam({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requirePermission("exam.review");
  const db = await getDb();
  const exam = await getExam(db, id).catch(() => undefined);
  if (!exam) notFound();
  const bp = getBlueprint(exam.track_key)!;
  const [versions, bpStatus, siblings, jobs] = await Promise.all([listVersions(db, id), blueprintStatus(db, bp), listExams(db, exam.track_key), listJobs(db, id, 10)]);
  const canEdit = can(user.role, "exam.edit");
  const canPublish = can(user.role, "exam.publish");
  const sources = siblings.filter((s) => s.id !== id && s.current_version_id);

  return (
    <>
      <PageHeader
        eyebrow={<Link href="/admin/exams" className="hover:underline">Exams</Link>}
        title={exam.title}
        description={<span className="flex flex-wrap items-center gap-2"><Badge tone={EXAM_STATUS_TONE[exam.status]}>{EXAM_STATUS_LABEL[exam.status]}</Badge><span>{bp.officialName}</span><span>· {exam.access_tier}</span></span>}
        actions={<>
          {canEdit && <ActionForm action={createDraftAction} fields={{ examId: id }} label="New version" variant="primary" size="md" />}
          {can(user.role, "ai.generate") && <Link href={`/admin/generator?exam=${id}`} className="inline-flex h-10 items-center rounded-md border border-ink-200 bg-white px-4 text-sm font-medium hover:bg-ink-50">AI generator</Link>}
        </>}
      />
      {!bpStatus.readiness.fullyVerified && (
        <Alert tone="warning" className="mb-4" title="Blueprint not confirmed">
          {bpStatus.readiness.unverified.length} values of this exam format are not verified from official sources. Publishing is blocked until an administrator confirms the blueprint. <Link className="underline" href={`/admin/blueprints#${bp.key}`}>Review blueprint</Link>
        </Alert>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Versions</CardTitle><CardDescription>Versions are immutable once in review. Students keep the version they started with.</CardDescription></CardHeader>
          <CardContent className="p-0">
            {versions.length === 0 ? <p className="p-5 text-sm text-ink-500">No content yet. Create a version (blueprint skeleton) or use the AI generator.</p> : (
              <Table>
                <thead><tr><Th>Version</Th><Th>Status</Th><Th className="hidden md:table-cell">Validation</Th><Th className="hidden md:table-cell">Updated</Th><Th /></tr></thead>
                <tbody>
                  {versions.map((v) => (
                    <tr key={v.id}>
                      <Td className="font-medium">v{v.version}{v.id === exam.published_version_id && <Badge tone="success" className="ml-2">live</Badge>}{v.id === exam.current_version_id && v.id !== exam.published_version_id && <Badge className="ml-2">current</Badge>}</Td>
                      <Td><Badge tone={EXAM_STATUS_TONE[v.status]}>{EXAM_STATUS_LABEL[v.status]}</Badge>{v.locked && <span className="ml-2 text-xs text-ink-500">locked</span>}</Td>
                      <Td className="hidden md:table-cell text-xs">{v.validation ? `${v.validation.counts.critical} critical · ${v.validation.counts.warning} warnings` : "not run"}</Td>
                      <Td className="hidden md:table-cell text-xs">{formatDateTime(v.updated_at)}</Td>
                      <Td className="text-right"><Link className="text-brand-700 hover:underline" href={`/admin/exams/${id}/versions/${v.id}`}>Open</Link></Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          {canPublish && (
            <Card>
              <CardHeader><CardTitle>Availability</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-3">
                <ActionForm action={setAccessTierAction} fields={{ examId: id, tier: exam.access_tier === "free" ? "premium" : "free" }} label={exam.access_tier === "free" ? "Make premium" : "Make free"} />
                {exam.status === "published" && <ActionForm action={unpublishAction} fields={{ examId: id }} label="Unpublish" confirm="Students will no longer be able to start this exam. Continue?" />}
                {exam.status !== "archived" && <ActionForm action={archiveAction} fields={{ examId: id }} label="Archive" variant="danger" confirm="Archive this exam?" />}
              </CardContent>
            </Card>
          )}
          {canEdit && sources.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Copy from another mock</CardTitle><CardDescription>Creates a new draft here. Audio is not copied; the similarity check will flag overlap.</CardDescription></CardHeader>
              <CardContent>
                <ActionForm action={duplicateAction} fields={{ toExamId: id }} label="Copy as draft">
                  <select name="fromExamId" className="h-9 rounded-md border border-ink-200 px-2 text-sm">
                    {sources.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </ActionForm>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader><CardTitle>Recent AI generations</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              {jobs.length === 0 ? <p className="text-ink-500">None.</p> : jobs.map((j) => (
                <Link key={j.id} href={`/admin/generator/${j.id}`} className="flex justify-between hover:underline">
                  <span>{j.scope} {[j.target.partId, j.target.itemId].filter(Boolean).join(" / ")}</span>
                  <Badge tone={j.status === "succeeded" ? "success" : j.status === "failed" ? "danger" : "warning"}>{j.status}</Badge>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
