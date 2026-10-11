import { Check } from "lucide-react";
import { EntitlementsSchema } from "@/domain/entitlements";
import { getDb } from "@/server/db";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Pricing" };
export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const db = await getDb();
  const plans = await db.query<{ id: string; name: string; description: string; billing_interval: string; price_cents: number; currency: string; entitlements: unknown }>(
    `select id, name, description, billing_interval, price_cents, currency, entitlements from plans where active order by sort`,
  );
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Simple plans for serious preparation</h1>
        <p className="mt-2 text-ink-600">Start free with a complete mock exam. Upgrade when you want the full catalogue.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const e = EntitlementsSchema.parse(p.entitlements);
          const featured = p.id === "premium_annual";
          const lines = [
            e.premiumExams ? "All published mock exams in your scope" : "Goethe A1 Übungstest 1 (complete)",
            e.fullSimulation ? "Full exam simulation" : null,
            e.sectionPractice ? "Section practice" : null,
            e.explanations ? "Answer explanations and transcripts" : "Correct answers after submission",
            `AI writing feedback: ${e.aiWritingPerMonth} per month`,
            `AI speaking feedback: ${e.aiSpeakingPerMonth} per month`,
            e.practiceRetriesPerExam === null ? "Unlimited retries" : `${e.practiceRetriesPerExam} attempts per exam per month`,
            e.progressAnalytics === "full" ? "Full progress analytics" : "Basic progress overview",
          ].filter(Boolean) as string[];
          return (
            <div key={p.id} className={`flex flex-col rounded-2xl border bg-white p-6 ${featured ? "border-brand-500 shadow-lg shadow-brand-600/10" : "border-ink-200"}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{p.name}</h2>
                {featured && <Badge tone="brand">Best value</Badge>}
              </div>
              <p className="mt-1 text-sm text-ink-500">{p.description}</p>
              <p className="mt-5 text-3xl font-semibold">
                {p.price_cents === 0 ? "Free" : formatPrice(p.price_cents, p.currency)}
                {p.billing_interval !== "none" && <span className="text-base font-normal text-ink-500"> / {p.billing_interval === "month" ? "month" : "year"}</span>}
              </p>
              <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm">
                {lines.map((l) => <li key={l} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success-600" aria-hidden />{l}</li>)}
              </ul>
              <ButtonLink className="mt-6" variant={featured ? "primary" : "secondary"} href={p.id === "free" ? "/register" : `/settings/billing?plan=${p.id}`}>
                {p.id === "free" ? "Start free" : `Choose ${p.name}`}
              </ButtonLink>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-center text-xs text-ink-500">Prices include VAT where applicable. Cancel any time in the billing portal; access continues until the end of the paid period. AI feedback is subject to fair-use limits.</p>
    </div>
  );
}
