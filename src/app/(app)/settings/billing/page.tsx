import { Check } from "lucide-react";
import { EntitlementsSchema } from "@/domain/entitlements";
import { requireUser } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { billingMode, listPlans, paymentHistory } from "@/server/services/billing";
import { currentPeriod, getEntitlements, userSubscriptions } from "@/server/services/entitlements";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import { CheckoutButton, PortalButton, SimulatedCancelButton } from "@/components/billing/billing-forms";
import { formatDate, formatDateTime, formatPrice } from "@/lib/utils";

export const metadata = { title: "Subscription" };

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ checkout?: string; plan?: string }> }) {
  const user = await requireUser();
  const { checkout, plan: wanted } = await searchParams;
  const db = await getDb();
  const [plans, subs, ent, payments, usage] = await Promise.all([
    listPlans(db),
    userSubscriptions(db, user.id),
    getEntitlements(db, user.id),
    paymentHistory(db, user.id),
    db.query<{ kind: string; count: number }>(`select kind, count from usage_counters where user_id = $1 and period = $2`, [user.id, currentPeriod()]),
  ]);
  const mode = billingMode();
  const active = subs.find((s) => ["active", "trialing", "past_due"].includes(s.status));
  const used = (k: string) => usage.find((u) => u.kind === k)?.count ?? 0;
  const hasStripeCustomer = !!(await db.one(`select 1 from billing_customers where user_id = $1`, [user.id]));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Subscription" description="Your plan, AI feedback allowance and invoices." />
      {mode === "simulated" && (
        <Alert tone="warning" title="Simulated payments">
          Stripe is not configured on this development server. Choosing a plan creates a simulated subscription marked &quot;dev_simulated&quot;. No money moves and this mode is disabled in production.
        </Alert>
      )}
      {mode === "unavailable" && <Alert tone="danger">Payments are temporarily unavailable.</Alert>}
      {checkout === "success" && (
        <Alert tone="success" title="Thank you!">Your payment is being confirmed by Stripe. Premium access appears as soon as Stripe notifies us, usually within a few seconds. Refresh this page if it hasn&apos;t updated yet.</Alert>
      )}
      {checkout === "simulated" && <Alert tone="success">Simulated subscription activated.</Alert>}
      {checkout === "cancelled" && <Alert tone="info">Checkout was cancelled. Nothing was charged.</Alert>}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Current plan</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {active ? (
              <>
                <p className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                  {active.planName}
                  <Badge tone={active.status === "past_due" ? "warning" : "success"}>{active.status === "past_due" ? "Payment problem" : "Active"}</Badge>
                  {active.source === "dev_simulated" && <Badge tone="warning">Simulated</Badge>}
                </p>
                {active.currentPeriodEnd && <p className="text-sm text-ink-600">{active.cancelAtPeriodEnd ? "Ends" : "Renews"} on {formatDate(active.currentPeriodEnd)}</p>}
                {active.status === "past_due" && <Alert tone="warning">Your last payment failed. Update your payment method to keep Premium access.</Alert>}
              </>
            ) : (
              <p className="text-lg font-semibold">Free</p>
            )}
            <div className="flex flex-wrap gap-2">
              {mode === "stripe" && hasStripeCustomer && <PortalButton />}
              {active?.source === "dev_simulated" && <SimulatedCancelButton />}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>This month</CardTitle><CardDescription>AI feedback allowance resets on the 1st.</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p>AI writing feedback: <strong>{used("ai_writing")} / {ent.aiWritingPerMonth}</strong></p>
            <p>AI speaking feedback: <strong>{used("ai_speaking")} / {ent.aiSpeakingPerMonth}</strong></p>
            <p>Premium mock exams: <strong>{ent.premiumExams ? "included" : "not included"}</strong></p>
            <p>Explanations: <strong>{ent.explanations ? "included" : "not included"}</strong></p>
          </CardContent>
        </Card>
      </div>

      {!active && mode !== "unavailable" && (
        <section className="grid gap-4 md:grid-cols-2">
          {plans.filter((p) => p.billing_interval !== "none").map((p) => {
            const e = EntitlementsSchema.parse(p.entitlements);
            return (
              <Card key={p.id} className={wanted === p.id ? "ring-2 ring-brand-500" : ""}>
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                  <CardDescription>{p.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-2xl font-semibold">{formatPrice(p.price_cents, p.currency)}<span className="text-sm font-normal text-ink-500"> / {p.billing_interval === "year" ? "year" : "month"}</span></p>
                  <ul className="flex flex-col gap-1 text-sm">
                    {[e.premiumExams && "All published mock exams", e.explanations && "Explanations and transcripts", `${e.aiWritingPerMonth} AI writing / ${e.aiSpeakingPerMonth} AI speaking feedback per month`].filter(Boolean).map((l) => (
                      <li key={String(l)} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-success-600" />{l}</li>
                    ))}
                  </ul>
                  <CheckoutButton planId={p.id} label={`Choose ${p.name}`} simulated={mode === "simulated"} featured={wanted === p.id} />
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      <Card>
        <CardHeader><CardTitle>Payment history</CardTitle></CardHeader>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <p className="p-5 text-sm text-ink-500">No payments yet.</p>
          ) : (
            <Table>
              <thead><tr><Th>Date</Th><Th>Amount</Th><Th>Status</Th><Th className="text-right">Invoice</Th></tr></thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <Td>{formatDateTime(p.created_at)}</Td>
                    <Td>{formatPrice(p.amount_cents, p.currency)}</Td>
                    <Td>{p.status}{p.source === "dev_simulated" && <Badge tone="warning" className="ml-2">Simulated</Badge>}</Td>
                    <Td className="text-right">{p.hosted_invoice_url ? <a className="text-brand-700 underline" href={p.hosted_invoice_url} target="_blank" rel="noreferrer">View</a> : "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
