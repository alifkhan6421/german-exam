import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { can } from "@/domain/roles";
import { ExamContentSchema } from "@/domain/exam/schema";
import { requirePermission } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { blueprintOrThrow, getExam, getVersion } from "@/server/services/exams";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { ActionForm } from "@/components/admin/action-form";
import { JsonEditor } from "@/components/admin/json-editor";
import { ValidationReportView } from "@/components/admin/validation-report";
import { EXAM_STATUS_LABEL, EXAM_STATUS_TONE } from "@/components/admin/status";
import { createDraftAction, publishAction, reviewAction, submitReviewAction, validateAction } from "@/server/actions/admin";
import { formatDateTime } from "@/lib/utils";

export default async function VersionPage({ params }: { params: Promise<{ id: string; versionId: string }> }) {
  const { id, versionId } = await params;
  const user = await requirePermission("exam.review");
  const db = await getDb();
  const [exam, v] = await Promise.all([getExam(db, id).catch(() => undefined), getVersion(db, versionId).catch(() => undefined)]);
  if (!exam || !v || v.exam_id !== id) notFound();
  const bp = blueprintOrThrow(v.blueprint_key, v.blueprint_version);
  const parsed = ExamContentSchema.safeParse(v.content);
  const reviews = await db.query<{ decision: string; comments: string | null; created_at: string; email: string | null }>(
    `select r.decision, r.comments, r.created_at, p.email from review_decisions r left join profiles p on p.id = r.reviewer_id where r.exam_version_id = $1 order by r.created_at desc`,
    [v.id],
  );
  const canEdit = can(user.role, "exam.edit");
  const editable = canEdit && !v.locked;
  const generatedBy = v.status === "generated" || (await db.one(`select 1 from audit_log where entity_id = $1 and action = 'ai.generation_applied' and details->>'versionId' = $2`, [id, v.id]));

  return (
    <>
      <PageHeader
        eyebrow={<><Link href="/admin/exams" className="hover:underline">Exams</Link> / <Link href={`/admin/exams/${id}`} className="hover:underline">{exam.title}</Link></>}
        title={`Version ${v.version}`}
        description={<span className="flex flex-wrap items-center gap-2"><Badge tone={EXAM_STATUS_TONE[v.status]}>{EXAM_STATUS_LABEL[v.status]}</Badge>{v.locked && <Badge>locked</Badge>}<span>Blueprint {bp.key}@{bp.version}</span></span>}
        actions={<Link href={`/admin/exams/${id}/versions/${v.id}/preview`} className="inline-flex h-10 items-center gap-2 rounded-md border border-ink-200 bg-white px-4 text-sm font-medium hover:bg-ink-50"><Eye className="h-4 w-4" />Preview as student</Link>}
      />
      {generatedBy && (
        <Alert tone="info" className="mb-4" title="Contains AI-generated content">
          A human reviewer must read every task, check answers and listen to the audio before approval. Nothing generated is published automatically.
        </Alert>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <Card>
            <CardHeader><CardTitle>Validation</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <ValidationReportView report={v.validation} />
              {canEdit && <ActionForm action={validateAction} fields={{ versionId: v.id }} label="Run validation" />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>{editable ? "Edit the JSON and save. Saving re-runs validation." : "This version is locked. Create a new version to make changes."}</CardDescription>
            </CardHeader>
            <CardContent>
              {!parsed.success && <Alert tone="danger" className="mb-3">Stored content does not match the schema.</Alert>}
              <JsonEditor versionId={v.id} initial={JSON.stringify(v.content, null, 2)} readOnly={!editable} />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle>Workflow</CardTitle><CardDescription>Draft → Generated → Validated → In review → Approved → Published</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-4">
              {canEdit && ["draft", "generated", "validated"].includes(v.status) && (
                <ActionForm action={submitReviewAction} fields={{ versionId: v.id }} label="Send for review" variant="primary" confirm="This locks the version. Continue?" />
              )}
              {can(user.role, "exam.review") && v.status === "in_review" && (
                <ActionForm action={reviewAction} fields={{ versionId: v.id }} label="Record decision" variant="primary">
                  <select name="decision" className="h-9 rounded-md border border-ink-200 px-2 text-sm" defaultValue="">
                    <option value="" disabled>Decision…</option>
                    <option value="approve">Approve</option>
                    <option value="request_changes">Request changes</option>
                    <option value="reject">Reject</option>
                  </select>
                  <textarea name="comments" placeholder="Comments (required unless approving)" className="h-24 rounded-md border border-ink-200 p-2 text-sm" />
                  <label className="flex items-start gap-2 text-xs text-ink-600"><input type="checkbox" required className="mt-0.5" />I read every task, checked the answer key and listened to the recordings.</label>
                </ActionForm>
              )}
              {can(user.role, "exam.publish") && v.status === "approved" && (
                <ActionForm action={publishAction} fields={{ versionId: v.id }} label="Publish" variant="primary" confirm="Publish this version to students?" />
              )}
              {canEdit && v.locked && <ActionForm action={createDraftAction} fields={{ examId: id }} label="Create new version from latest" />}
              {v.status === "published" && <p className="text-sm text-success-600">Live since {formatDateTime(v.published_at!)}.</p>}
            </CardContent>
          </Card>
          {parsed.success && (
            <Card>
              <CardHeader><CardTitle>Structure</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                {parsed.data.sections.map((s) => (
                  <div key={s.sectionId}>
                    <p className="font-medium">{bp.sections.find((b) => b.id === s.sectionId)?.titleDe ?? s.sectionId}</p>
                    <ul className="ml-3 text-ink-600">{s.parts.map((p) => <li key={p.partId}>{p.partId}: {p.items.length} items, {p.stimuli.length} stimuli</li>)}</ul>
                  </div>
                ))}
                {parsed.data.scripts.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Listening scripts</p>
                    <ul className="ml-3 flex flex-col gap-1">
                      {parsed.data.scripts.map((sc) => (
                        <li key={sc.id} className="flex items-center justify-between gap-2">
                          {can(user.role, "audio.produce") ? <Link className="text-brand-700 hover:underline" href={`/admin/audio/${v.id}/${sc.id}`}>{sc.title || sc.id}</Link> : <span>{sc.title || sc.id}</span>}
                          <Badge tone={sc.audioStatus === "approved" ? "success" : sc.audioStatus === "generated" ? "warning" : "neutral"}>{sc.audioStatus}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader><CardTitle>Review history</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              {reviews.length === 0 ? <p className="text-ink-500">No decisions yet.</p> : reviews.map((r, i) => (
                <div key={i} className="border-l-2 border-ink-200 pl-3">
                  <p className="font-medium">{r.decision.replace("_", " ")} · {r.email ?? "deleted user"}</p>
                  <p className="text-xs text-ink-500">{formatDateTime(r.created_at)}</p>
                  {r.comments && <p className="mt-1 whitespace-pre-wrap">{r.comments}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
