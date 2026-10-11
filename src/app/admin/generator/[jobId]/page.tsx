import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { getJob } from "@/server/services/generator";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ActionForm } from "@/components/admin/action-form";
import { ValidationReportView } from "@/components/admin/validation-report";
import { applyGenerationAction } from "@/server/actions/admin";

export default async function JobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  await requirePermission("ai.generate");
  const job = await getJob(await getDb(), jobId).catch(() => undefined);
  if (!job) notFound();
  return (
    <>
      <PageHeader
        eyebrow={<Link href="/admin/generator" className="hover:underline">AI generator</Link>}
        title={`Generation: ${job.scope}`}
        description={<span className="flex flex-wrap gap-2"><Badge tone={job.status === "succeeded" ? "success" : job.status === "failed" ? "danger" : "warning"}>{job.status}</Badge>{job.model}{job.usage ? ` · ${String(job.usage.inputTokens)} in / ${String(job.usage.outputTokens)} out tokens` : ""}</span>}
      />
      {job.error && <Alert tone="danger" className="mb-4" title="Generation failed">{job.error}</Alert>}
      {job.status === "succeeded" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Card>
              <CardHeader><CardTitle>Validation of the merged exam</CardTitle><CardDescription>Critical issues must be fixed in the editor (or by regenerating) before the version can be sent for review.</CardDescription></CardHeader>
              <CardContent><ValidationReportView report={job.validation} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Generated JSON</CardTitle></CardHeader>
              <CardContent><pre className="max-h-[36rem] overflow-auto rounded-md bg-ink-900 p-3 text-xs text-ink-100">{JSON.stringify(job.output?.raw, null, 2)}</pre></CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Next step</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              {job.target.appliedVersionId ? (
                <p>Saved as a version. <Link className="text-brand-700 underline" href={`/admin/exams/${job.exam_id}/versions/${job.target.appliedVersionId}`}>Open it</Link></p>
              ) : (
                <>
                  <p>Saving creates a new version with status &quot;AI generated&quot;. It still has to be validated, reviewed by a person and approved before anyone can publish it.</p>
                  <ActionForm action={applyGenerationAction} fields={{ jobId: job.id }} label="Save as new version" variant="primary" />
                </>
              )}
              <details>
                <summary className="cursor-pointer text-ink-600">Prompt metadata</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs">{job.prompt}</pre>
              </details>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
