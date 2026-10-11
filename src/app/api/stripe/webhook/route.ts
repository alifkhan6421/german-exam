import { NextResponse } from "next/server";
import { getDb } from "@/server/db";
import { DomainError } from "@/server/services/exams";
import { handleStripeEvent, verifyWebhook } from "@/server/services/billing";

export const runtime = "nodejs";

/** Stripe webhook: signature-verified, idempotent (stripe_events), the only path that grants paid access. */
export async function POST(req: Request) {
  const raw = await req.text();
  try {
    const event = verifyWebhook(raw, req.headers.get("stripe-signature"));
    const processed = await handleStripeEvent(await getDb(), event);
    return NextResponse.json({ received: true, duplicate: !processed });
  } catch (e) {
    if (e instanceof DomainError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error("[stripe webhook]", e);
    // 500 makes Stripe retry later.
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
