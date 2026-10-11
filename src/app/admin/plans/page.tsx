import { requirePermission } from "@/server/auth/session";
import { config } from "@/server/config";
import { getDb } from "@/server/db";
import { listPlans } from "@/server/services/billing";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ActionForm } from "@/components/admin/action-form";
import { updatePlanAction } from "@/server/actions/admin";

export const metadata = { title: "Plans" };

const input = "h-9 rounded-md border border-ink-200 px-2 text-sm";

export default async function PlansPage() {
  await requirePermission("plans.edit");
  const plans = await listPlans(await getDb(), true);
  return (
    <>
      <PageHeader title="Plans and entitlements" description="What each plan unlocks. Prices shown to students come from here; the amount charged comes from the Stripe price, so keep them identical." />
      {!config.stripe.configured && <Alert tone="warning" className="mb-4">Stripe is not configured: paid plans use the development simulator.</Alert>}
      <div className="grid gap-4 xl:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.id}>
            <CardHeader><CardTitle>{p.name} <span className="text-sm font-normal text-ink-500">({p.id}, {p.billing_interval})</span></CardTitle></CardHeader>
            <CardContent>
              <ActionForm action={updatePlanAction} fields={{ id: p.id }} label="Save plan" variant="primary">
                <label className="flex flex-col gap-1 text-sm">Name<input name="name" defaultValue={p.name} className={input} /></label>
                <label className="flex flex-col gap-1 text-sm">Description<input name="description" defaultValue={p.description} className={input} /></label>
                <label className="flex flex-col gap-1 text-sm">Price ({p.currency.toUpperCase()})<input name="price" type="number" step="0.01" min={0} defaultValue={(p.price_cents / 100).toFixed(2)} className={input} disabled={p.billing_interval === "none"} /></label>
                {p.billing_interval === "none" && <input type="hidden" name="price" value="0" />}
                <label className="flex flex-col gap-1 text-sm">Stripe price id<input name="stripePriceId" defaultValue={p.stripe_price_id ?? ""} placeholder="price_…" className={input} disabled={p.billing_interval === "none"} /></label>
                <label className="flex flex-col gap-1 text-sm">Entitlements (JSON)<textarea name="entitlements" defaultValue={JSON.stringify(p.entitlements, null, 2)} className="h-56 rounded-md border border-ink-200 p-2 font-mono text-xs" /></label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={p.active} />Active</label>
              </ActionForm>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
