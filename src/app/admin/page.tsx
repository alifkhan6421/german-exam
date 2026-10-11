import Link from "next/link";
import { BLUEPRINTS, blueprintReadiness } from "@/domain/blueprints";
import { requirePermission } from "@/server/auth/session";
import { serviceStatuses } from "@/server/config";
import { getDb } from "@/server/db";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Overview" };

export default async function AdminHome() {
  await requirePermission("admin.access");
  const db = await getDb();
  const [counts] = await db.query<Record<string, string>>(`
    select
      (select count(*) from profiles where role = 'student') as students,
      (select count(*) from profiles where created_at > now() - interval '30 days') as new_users,
      (select count(*) from subscriptions where status in ('active','trialing','past_due') and source = 'stripe') as paying,
      (select count(*) from subscriptions where status in ('active','trialing') and source <> 'stripe') as other_subs,
      (select count(*) from attempts where started_at > now() - interval '30 days') as attempts_30,
      (select count(*) from attempts where status = 'submitted' and submitted_at > now() - interval '30 days') as completed_30,
      (select count(*) from exams where status = 'published') as published,
      (select count(*) from exams) as exams_total,
      (select count(*) from exam_versions where status = 'in_review') as in_review,
      (select count(*) from issue_reports where status = 'open') as open_reports,
      (select coalesce(sum(amount_cents),0) from payments where status = 'paid' and source = 'stripe' and created_at > now() - interval '30 days') as revenue_30
  `);
  const confirmed = await db.query<{ blueprint_key: string; version: string }>(`select distinct blueprint_key, version from blueprint_confirmations`);
  const unconfirmed = BLUEPRINTS.filter((bp) => {
    const r = blueprintReadiness(bp, confirmed.some((c) => c.blueprint_key === bp.key && c.version === bp.version));
    return !r.fullyVerified;
  });
  const stats = [
    { label: "Students", value: counts.students, sub: `${counts.new_users} new in 30 days` },
    { label: "Paying subscriptions", value: counts.paying, sub: `${counts.other_subs} manual or simulated` },
    { label: "Attempts (30 days)", value: counts.attempts_30, sub: `${counts.completed_30} completed` },
    { label: "Revenue (30 days)", value: `€${(Number(counts.revenue_30) / 100).toFixed(2)}`, sub: "Stripe invoices paid" },
    { label: "Published exams", value: `${counts.published} / ${counts.exams_total}`, sub: `${counts.in_review} version(s) in review` },
    { label: "Open issue reports", value: counts.open_reports, sub: <Link className="underline" href="/admin/reports">Review</Link> },
  ];
  return (
    <>
      <PageHeader title="Overview" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}><CardContent className="flex flex-col gap-1 pt-5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-500">{s.label}</span>
            <span className="text-2xl font-semibold tabular-nums">{s.value}</span>
            <span className="text-xs text-ink-500">{s.sub}</span>
          </CardContent></Card>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Services</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            {serviceStatuses().map((s) => (
              <div key={s.name} className="flex items-start justify-between gap-3">
                <div><p className="font-medium">{s.name}</p><p className="text-ink-500">{s.detail}</p></div>
                <Badge tone={s.mode === "live" ? "success" : s.mode === "development" ? "warning" : "danger"}>{s.mode}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Blueprints needing confirmation</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {unconfirmed.length === 0 ? <p className="text-ink-500">All blueprints are verified or confirmed.</p> : unconfirmed.map((bp) => (
              <Link key={bp.key} href={`/admin/blueprints#${bp.key}`} className="flex justify-between hover:underline">
                <span>{bp.officialName}</span><Badge tone="warning">unconfirmed</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
