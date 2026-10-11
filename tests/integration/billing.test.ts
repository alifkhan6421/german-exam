import { beforeAll, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";
});

import Stripe from "stripe";
import { createTestDb, setDbForTests, type Db } from "@/server/db";
import { handleStripeEvent, verifyWebhook } from "@/server/services/billing";
import { getEntitlements } from "@/server/services/entitlements";

let db: Db;
let userId: string;

const sub = (status: Stripe.Subscription.Status) =>
  ({
    id: "sub_123",
    status,
    customer: "cus_123",
    metadata: { userId, planId: "premium_monthly" },
    cancel_at_period_end: false,
    items: { data: [{ price: { id: "price_monthly" }, current_period_end: Math.floor(Date.now() / 1000) + 30 * 86400 }] },
  }) as unknown as Stripe.Subscription;

const event = (id: string, type: string, object: unknown) => ({ id, type, data: { object } }) as unknown as Stripe.Event;

beforeAll(async () => {
  db = await createTestDb();
  setDbForTests(db);
  userId = (await db.one<{ id: string }>(`select id from profiles where email = 'student@example.com'`))!.id;
  await db.query(`update plans set stripe_price_id = 'price_monthly' where id = 'premium_monthly'`);
});

describe("Stripe webhooks", () => {
  it("rejects payloads without a valid signature", () => {
    const payload = JSON.stringify({ id: "evt_x", type: "invoice.paid", data: { object: {} } });
    expect(() => verifyWebhook(payload, null)).toThrow(/Missing/);
    expect(() => verifyWebhook(payload, "t=1,v1=bad")).toThrow(/Invalid/);
    const header = Stripe.webhooks.generateTestHeaderString({ payload, secret: "whsec_test_secret" });
    expect(verifyWebhook(payload, header).id).toBe("evt_x");
  });

  it("grants premium only after a verified checkout event, exactly once", async () => {
    expect((await getEntitlements(db, userId)).premiumExams).toBe(false);
    const checkout = event("evt_checkout", "checkout.session.completed", { mode: "subscription", subscription: "sub_123", customer: "cus_123", client_reference_id: userId });
    expect(await handleStripeEvent(db, checkout, async () => sub("active"))).toBe(true);
    expect((await getEntitlements(db, userId)).premiumExams).toBe(true);
    expect(await handleStripeEvent(db, checkout, async () => sub("active"))).toBe(false); // replay ignored
    const rows = await db.query(`select * from subscriptions where user_id = $1`, [userId]);
    expect(rows).toHaveLength(1);
  });

  it("keeps access during past_due and removes it when the subscription is cancelled", async () => {
    await handleStripeEvent(db, event("evt_upd", "customer.subscription.updated", sub("past_due")));
    expect((await getEntitlements(db, userId)).premiumExams).toBe(true);
    await handleStripeEvent(db, event("evt_del", "customer.subscription.deleted", sub("canceled")));
    expect((await getEntitlements(db, userId)).premiumExams).toBe(false);
  });

  it("records invoices for the payment history", async () => {
    await handleStripeEvent(db, event("evt_inv", "invoice.paid", { id: "in_1", customer: "cus_123", status: "paid", amount_paid: 1990, amount_due: 1990, currency: "eur", hosted_invoice_url: "https://invoice.stripe.com/i/1" }));
    const p = await db.one<{ amount_cents: number; status: string }>(`select amount_cents, status from payments where stripe_invoice_id = 'in_1'`);
    expect(p).toEqual({ amount_cents: 1990, status: "paid" });
  });
});
