import "server-only";
import { EntitlementsSchema, effectiveEntitlements, type Entitlements } from "@/domain/entitlements";
import type { Db } from "../db";

export interface SubscriptionView {
  id: string;
  planId: string;
  planName: string;
  status: string;
  source: "stripe" | "dev_simulated" | "manual";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export async function userSubscriptions(db: Db, userId: string): Promise<(SubscriptionView & { entitlements: Entitlements })[]> {
  const rows = await db.query<{
    id: string; plan_id: string; name: string; status: string; source: SubscriptionView["source"];
    current_period_end: string | null; cancel_at_period_end: boolean; entitlements: unknown;
  }>(
    `select s.id, s.plan_id, p.name, s.status, s.source, s.current_period_end, s.cancel_at_period_end, p.entitlements
     from subscriptions s join plans p on p.id = s.plan_id where s.user_id = $1 order by s.created_at desc`,
    [userId],
  );
  return rows.map((r) => ({
    id: r.id,
    planId: r.plan_id,
    planName: r.name,
    status: r.status,
    source: r.source,
    currentPeriodEnd: r.current_period_end ? new Date(r.current_period_end).toISOString() : null,
    cancelAtPeriodEnd: r.cancel_at_period_end,
    entitlements: EntitlementsSchema.parse(r.entitlements),
  }));
}

/** Server-side source of truth for what a user may access, derived only from stored billing state. */
export async function getEntitlements(db: Db, userId: string, now = new Date()): Promise<Entitlements> {
  const subs = await userSubscriptions(db, userId);
  const free = await db.one<{ entitlements: unknown }>(`select entitlements from plans where id = 'free'`);
  const base = free ? EntitlementsSchema.parse(free.entitlements) : undefined;
  const fromSubs = subs.map((s) => ({ status: s.status, current_period_end: s.currentPeriodEnd, entitlements: s.entitlements }));
  // Administrators can edit the free plan; it is the baseline every account receives.
  return effectiveEntitlements(fromSubs, now, base);
}

export function currentPeriod(now = new Date()) {
  return now.toISOString().slice(0, 7);
}

/** Atomically consume one unit of a monthly AI quota. Returns false when exhausted. */
export async function consumeQuota(db: Db, userId: string, kind: "ai_writing" | "ai_speaking", limit: number): Promise<boolean> {
  if (limit <= 0) return false;
  const row = await db.one<{ count: number }>(
    `insert into usage_counters (user_id, period, kind, count) values ($1, $2, $3, 1)
     on conflict (user_id, period, kind) do update set count = usage_counters.count + 1
     where usage_counters.count < $4
     returning count`,
    [userId, currentPeriod(), kind, limit],
  );
  return !!row;
}
