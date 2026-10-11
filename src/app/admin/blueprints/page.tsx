import { BLUEPRINTS, unverifiedFacts } from "@/domain/blueprints";
import { can } from "@/domain/roles";
import { requirePermission } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { blueprintStatus } from "@/server/services/exams";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionForm } from "@/components/admin/action-form";
import { confirmBlueprintAction } from "@/server/actions/admin";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Blueprints" };

export default async function BlueprintsPage() {
  const user = await requirePermission("admin.access");
  const db = await getDb();
  const rows = await Promise.all(BLUEPRINTS.map(async (bp) => ({ bp, status: await blueprintStatus(db, bp), unverified: unverifiedFacts(bp) })));
  return (
    <>
      <PageHeader
        title="Exam blueprints"
        description="Exam formats are versioned in code. Values marked verified come from the providers' public documents (sources below). Unverified values are our working structure and must be checked by an administrator before exams on that blueprint can be published, and before pass estimates are shown."
      />
      <div className="flex flex-col gap-6">
        {rows.map(({ bp, status, unverified }) => (
          <Card key={bp.key} id={bp.key}>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2">
                {bp.officialName}
                <Badge tone={bp.provider === "goethe" ? "goethe" : "telc"}>{bp.key}@{bp.version}</Badge>
                {status.readiness.fullyVerified ? <Badge tone="success">{status.confirmations.length ? "confirmed" : "verified"}</Badge> : <Badge tone="warning">{unverified.length} unverified</Badge>}
              </CardTitle>
              <CardDescription>
                {bp.variant} · {bp.sections.length} modules · scoring: {bp.scoring.reporting.value}, pass rule {bp.scoring.passRule.value ? JSON.stringify(bp.scoring.passRule.value) : "not specified"} ({bp.scoring.passRule.status}) · researched {bp.verifiedAt}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm">
              <div className="grid gap-2 md:grid-cols-2">
                {[...bp.sections].sort((a, b) => a.order - b.order).map((s) => (
                  <div key={s.id} className="rounded-md border border-ink-100 p-3">
                    <p className="font-medium">{s.titleDe} <span className="font-normal text-ink-500">· {s.durationMinutes.value ?? "?"} min{s.durationMinutes.status === "verified" ? "" : " (unverified)"} · max {s.scaledMax.value ?? "?"}</span></p>
                    <ul className="mt-1 text-ink-600">
                      {s.parts.map((p) => <li key={p.id}>{p.titleDe}: {p.itemCount.value ?? "?"} × {p.itemType.value}{p.itemCount.status === "verified" ? "" : " *"}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              {unverified.length > 0 && (
                <details>
                  <summary className="cursor-pointer font-medium">Unverified values ({unverified.length})</summary>
                  <ul className="mt-2 max-h-64 overflow-y-auto font-mono text-xs">
                    {unverified.map((u) => <li key={u.path} className="border-b border-ink-100 py-1">{u.path} = {JSON.stringify(u.value)}{u.note ? <span className="font-sans text-ink-500"> · {u.note}</span> : null}</li>)}
                  </ul>
                </details>
              )}
              <details>
                <summary className="cursor-pointer font-medium">Sources ({bp.sources.length})</summary>
                <ul className="mt-2 flex flex-col gap-1">
                  {bp.sources.map((s) => <li key={s.id}><a className="text-brand-700 underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a> <span className="text-ink-500">(read {s.retrievedAt})</span></li>)}
                </ul>
              </details>
              {status.confirmations.length > 0 && (
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Confirmations</p>
                  {status.confirmations.map((c, i) => <p key={i} className="text-ink-600">{formatDateTime(c.created_at)} · {c.email ?? "system"}: {c.note}</p>)}
                </div>
              )}
              {can(user.role, "blueprint.confirm") && unverified.length > 0 && (
                <ActionForm action={confirmBlueprintAction} fields={{ key: bp.key, version: bp.version }} label="Confirm blueprint">
                  <textarea name="note" className="h-20 rounded-md border border-ink-200 p-2" placeholder="What did you check, against which official document and date?" />
                  <label className="flex items-start gap-2 text-xs text-ink-600"><input type="checkbox" name="checked" className="mt-0.5" />I checked every unverified value above against current official documents, or accept them as a practice structure that will be labelled as such.</label>
                </ActionForm>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
