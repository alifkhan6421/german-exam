import { can, ROLES, ROLE_LABELS } from "@/domain/roles";
import { requirePermission } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ActionForm } from "@/components/admin/action-form";
import { grantManualAction, setRoleAction } from "@/server/actions/admin";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Users" };

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const me = await requirePermission("users.view");
  const { q } = await searchParams;
  const db = await getDb();
  const users = await db.query<{ id: string; email: string; display_name: string | null; role: string; created_at: string; attempts: string; plan: string | null; sub_source: string | null; sub_end: string | null }>(
    `select p.id, p.email, p.display_name, p.role, p.created_at,
       (select count(*) from attempts a where a.user_id = p.id) as attempts,
       s.plan_id as plan, s.source as sub_source, s.current_period_end as sub_end
     from profiles p
     left join lateral (select plan_id, source, current_period_end from subscriptions where user_id = p.id and status in ('active','trialing','past_due') order by created_at desc limit 1) s on true
     where ($1::text is null or p.email ilike '%' || $1 || '%' or p.display_name ilike '%' || $1 || '%')
     order by p.created_at desc limit 100`,
    [q?.trim() || null],
  );
  const plans = await db.query<{ id: string; name: string }>(`select id, name from plans where billing_interval <> 'none' order by sort`);
  const manage = can(me.role, "users.manage");
  return (
    <>
      <PageHeader title="Users" description="Support view. Role changes and manual access are recorded in the audit log." />
      <form className="mb-4"><input name="q" defaultValue={q} placeholder="Search e-mail or name" className="h-10 w-full max-w-sm rounded-md border border-ink-200 px-3 text-sm" /></form>
      <div className="flex flex-col gap-3">
        {users.map((u) => (
          <Card key={u.id}><CardContent className="flex flex-col gap-3 pt-5 text-sm lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-1">
              <p className="font-medium">{u.display_name ?? u.email} <span className="font-normal text-ink-500">{u.email}</span></p>
              <p className="flex flex-wrap gap-2 text-xs text-ink-500">
                <Badge tone={u.role === "student" ? "neutral" : "telc"}>{ROLE_LABELS[u.role as keyof typeof ROLE_LABELS]}</Badge>
                {u.plan ? <Badge tone="success">{u.plan}{u.sub_source !== "stripe" ? ` (${u.sub_source})` : ""}{u.sub_end ? ` until ${formatDate(u.sub_end)}` : ""}</Badge> : <Badge>free</Badge>}
                <span>{u.attempts} attempts · joined {formatDate(u.created_at)}</span>
              </p>
            </div>
            {manage && u.id !== me.id && (
              <div className="flex flex-wrap gap-4">
                <ActionForm action={setRoleAction} fields={{ userId: u.id }} label="Set role" className="flex items-end gap-2">
                  <select name="role" defaultValue={u.role} className="h-8 rounded-md border border-ink-200 px-2 text-xs">
                    {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                </ActionForm>
                <ActionForm action={grantManualAction} fields={{ userId: u.id }} label="Grant access" className="flex flex-wrap items-end gap-2">
                  <select name="planId" className="h-8 rounded-md border border-ink-200 px-2 text-xs">{plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                  <input name="days" type="number" min={1} max={366} defaultValue={30} className="h-8 w-16 rounded-md border border-ink-200 px-2 text-xs" aria-label="Days" />
                  <input name="reason" placeholder="Reason" className="h-8 w-32 rounded-md border border-ink-200 px-2 text-xs" />
                </ActionForm>
              </div>
            )}
          </CardContent></Card>
        ))}
      </div>
    </>
  );
}
