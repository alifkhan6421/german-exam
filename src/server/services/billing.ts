import "server-only";
import Stripe from "stripe";
import type { CurrentUser } from "../auth/session";
import { config } from "../config";
import type { Db } from "../db";
import { audit } from "./audit";
import { DomainError } from "./exams";

/**
 * Stripe Billing. Access is granted only from subscription state written by verified
 * webhooks (or, in development without Stripe keys, by the clearly labelled simulator).
 * The browser's return from Checkout never grants anything by itself.
 */
let stripeClient: Stripe | null = null;
export function stripe() {
  if (!config.stripe.configured) throw new DomainError("Payments are not configured on this server.", 503);
  stripeClient ??= new Stripe(config.stripe.secretKey!);
  return stripeClient;
}

export interface PlanRow {
  id: string;
  name: string;
  description: string;
  billing_interval: "none" | "month" | "year";
  price_cents: number;
  currency: string;
  stripe_price_id: string | null;
  entitlements: Record<string, unknown>;
  active: boolean;
  sort: number;
}

export async function listPlans(db: Db, includeInactive = false) {
  return db.query<PlanRow>(`select * from plans ${includeInactive ? "" : "where active"} order by sort, price_cents`);
}

export function billingMode(): "stripe" | "simulated" | "unavailable" {
  if (config.stripe.configured) return "stripe";
  return config.allowSimulatedBilling ? "simulated" : "unavailable";
}

async function paidPlan(db: Db, planId: string) {
  const plan = await db.one<PlanRow>(`select * from plans where id = $1 and active`, [planId]);
  if (!plan || plan.billing_interval === "none") throw new DomainError("Unknown plan.", 404);
  return plan;
}

async function activeSubscription(db: Db, userId: string) {
  return db.one<{ id: string; plan_id: string; source: string }>(
    `select id, plan_id, source from subscriptions where user_id = $1 and status in ('active', 'trialing', 'past_due') order by created_at desc limit 1`,
    [userId],
  );
}

/* ---------------------------------------------------------------------------------------- */
/* Stripe Checkout and Customer Portal                                                        */
/* ---------------------------------------------------------------------------------------- */

async function customerFor(db: Db, user: CurrentUser) {
  const existing = await db.one<{ stripe_customer_id: string }>(`select stripe_customer_id from billing_customers where user_id = $1`, [user.id]);
  if (existing) return existing.stripe_customer_id;
  const customer = await stripe().customers.create({ email: user.email, name: user.displayName, metadata: { userId: user.id } });
  await db.query(`insert into billing_customers (user_id, stripe_customer_id) values ($1, $2) on conflict (user_id) do nothing`, [user.id, customer.id]);
  const row = await db.one<{ stripe_customer_id: string }>(`select stripe_customer_id from billing_customers where user_id = $1`, [user.id]);
  return row!.stripe_customer_id;
}

export async function createCheckout(db: Db, user: CurrentUser, planId: string): Promise<string> {
  const plan = await paidPlan(db, planId);
  if (await activeSubscription(db, user.id)) throw new DomainError("You already have an active subscription. Manage it from the billing portal.", 409);
  if (!plan.stripe_price_id) throw new DomainError("This plan has no Stripe price configured yet.", 503);
  const customer = await customerFor(db, user);
  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    customer,
    client_reference_id: user.id,
    line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
    customer_update: { address: "auto" },
    subscription_data: { metadata: { userId: user.id, planId: plan.id } },
    metadata: { userId: user.id, planId: plan.id },
    success_url: `${config.appUrl}/settings/billing?checkout=success`,
    cancel_url: `${config.appUrl}/settings/billing?checkout=cancelled`,
  });
  if (!session.url) throw new DomainError("Stripe did not return a checkout URL.", 502);
  return session.url;
}

export async function createPortal(db: Db, user: CurrentUser): Promise<string> {
  const row = await db.one<{ stripe_customer_id: string }>(`select stripe_customer_id from billing_customers where user_id = $1`, [user.id]);
  if (!row) throw new DomainError("No billing account yet.", 404);
  const session = await stripe().billingPortal.sessions.create({ customer: row.stripe_customer_id, return_url: `${config.appUrl}/settings/billing` });
  return session.url;
}

/* ---------------------------------------------------------------------------------------- */
/* Webhooks                                                                                   */
/* ---------------------------------------------------------------------------------------- */

export function verifyWebhook(rawBody: string, signature: string | null): Stripe.Event {
  if (!config.stripe.webhookSecret) throw new DomainError("Webhooks are not configured.", 503);
  if (!signature) throw new DomainError("Missing Stripe signature.", 400);
  try {
    return Stripe.webhooks.constructEvent(rawBody, signature, config.stripe.webhookSecret);
  } catch {
    throw new DomainError("Invalid Stripe signature.", 400);
  }
}

type SubLike = Pick<Stripe.Subscription, "id" | "status" | "customer" | "metadata" | "cancel_at_period_end" | "items">;

async function userForCustomer(db: Db, customerId: string, metadataUserId?: string) {
  const row = await db.one<{ user_id: string }>(`select user_id from billing_customers where stripe_customer_id = $1`, [customerId]);
  if (row) return row.user_id;
  if (metadataUserId) {
    const p = await db.one<{ id: string }>(`select id from profiles where id = $1`, [metadataUserId]);
    if (p) {
      await db.query(`insert into billing_customers (user_id, stripe_customer_id) values ($1, $2) on conflict do nothing`, [p.id, customerId]);
      return p.id;
    }
  }
  return null;
}

export async function upsertStripeSubscription(db: Db, sub: SubLike) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const userId = await userForCustomer(db, customerId, sub.metadata?.userId);
  if (!userId) {
    console.warn("[stripe] subscription for unknown customer", customerId);
    return;
  }
  const item = sub.items.data[0];
  const priceId = item?.price?.id;
  const plan = priceId ? await db.one<{ id: string }>(`select id from plans where stripe_price_id = $1`, [priceId]) : undefined;
  const planId = plan?.id ?? sub.metadata?.planId;
  if (!planId || !(await db.one(`select 1 from plans where id = $1`, [planId]))) {
    console.warn("[stripe] subscription with unknown price", priceId);
    return;
  }
  const periodEnd = item?.current_period_end ? new Date(item.current_period_end * 1000).toISOString() : null;
  await db.query(
    `insert into subscriptions (user_id, plan_id, status, source, stripe_customer_id, stripe_subscription_id, current_period_end, cancel_at_period_end)
     values ($1, $2, $3, 'stripe', $4, $5, $6, $7)
     on conflict (stripe_subscription_id) do update set plan_id = excluded.plan_id, status = excluded.status,
       current_period_end = excluded.current_period_end, cancel_at_period_end = excluded.cancel_at_period_end, updated_at = now()`,
    [userId, planId, sub.status, customerId, sub.id, periodEnd, sub.cancel_at_period_end],
  );
  await audit(db, { actorId: null, action: "billing.subscription_sync", entityType: "subscription", entityId: sub.id, details: { userId, planId, status: sub.status } });
}

async function recordInvoice(db: Db, invoice: Stripe.Invoice) {
  const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  const userId = customerId ? await userForCustomer(db, customerId) : null;
  await db.query(
    `insert into payments (user_id, stripe_invoice_id, amount_cents, currency, status, hosted_invoice_url, source)
     values ($1, $2, $3, $4, $5, $6, 'stripe')
     on conflict (stripe_invoice_id) do update set status = excluded.status, amount_cents = excluded.amount_cents, hosted_invoice_url = excluded.hosted_invoice_url`,
    [userId, invoice.id, invoice.status === "paid" ? invoice.amount_paid : invoice.amount_due, invoice.currency, invoice.status ?? "unknown", invoice.hosted_invoice_url ?? null],
  );
}

/**
 * Process a verified event exactly once. `fetchSubscription` is injectable for tests.
 * Returns false when the event was already processed.
 */
export async function handleStripeEvent(
  db: Db,
  event: Stripe.Event,
  fetchSubscription: (id: string) => Promise<SubLike> = (id) => stripe().subscriptions.retrieve(id),
): Promise<boolean> {
  return db.tx(async (tx) => {
    const fresh = await tx.one(`insert into stripe_events (id, type) values ($1, $2) on conflict (id) do nothing returning id`, [event.id, event.type]);
    if (!fresh) return false;
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object;
        if (s.mode === "subscription" && s.subscription) {
          const subId = typeof s.subscription === "string" ? s.subscription : s.subscription.id;
          const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id;
          if (customerId && s.client_reference_id) await userForCustomer(tx, customerId, s.client_reference_id);
          await upsertStripeSubscription(tx, await fetchSubscription(subId));
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
        await upsertStripeSubscription(tx, event.data.object);
        break;
      case "invoice.paid":
      case "invoice.payment_failed":
      case "invoice.finalized":
        await recordInvoice(tx, event.data.object);
        break;
      default:
        break;
    }
    return true;
  });
}

/* ---------------------------------------------------------------------------------------- */
/* Development simulator (never available when APP_ENV=production or Stripe is configured)   */
/* ---------------------------------------------------------------------------------------- */

function assertSimulated() {
  if (billingMode() !== "simulated") throw new DomainError("Simulated billing is not available.", 403);
}

export async function simulateCheckout(db: Db, user: CurrentUser, planId: string) {
  assertSimulated();
  const plan = await paidPlan(db, planId);
  if (await activeSubscription(db, user.id)) throw new DomainError("You already have an active subscription.", 409);
  const end = new Date();
  if (plan.billing_interval === "year") end.setFullYear(end.getFullYear() + 1);
  else end.setMonth(end.getMonth() + 1);
  await db.query(
    `insert into subscriptions (user_id, plan_id, status, source, current_period_end) values ($1, $2, 'active', 'dev_simulated', $3)`,
    [user.id, plan.id, end.toISOString()],
  );
  await db.query(
    `insert into payments (user_id, amount_cents, currency, status, source) values ($1, $2, $3, 'paid', 'dev_simulated')`,
    [user.id, plan.price_cents, plan.currency],
  );
  await audit(db, { actorId: user.id, action: "billing.simulated_checkout", entityType: "plan", entityId: plan.id });
}

export async function simulateCancel(db: Db, user: CurrentUser) {
  assertSimulated();
  await db.query(`update subscriptions set status = 'canceled', updated_at = now() where user_id = $1 and source = 'dev_simulated' and status in ('active', 'trialing', 'past_due')`, [user.id]);
  await audit(db, { actorId: user.id, action: "billing.simulated_cancel", entityType: "user", entityId: user.id });
}

export async function paymentHistory(db: Db, userId: string) {
  return db.query<{ id: string; amount_cents: number; currency: string; status: string; hosted_invoice_url: string | null; source: string; created_at: string }>(
    `select id, amount_cents, currency, status, hosted_invoice_url, source, created_at from payments where user_id = $1 order by created_at desc limit 50`,
    [userId],
  );
}
