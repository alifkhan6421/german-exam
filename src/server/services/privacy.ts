import "server-only";
import type { CurrentUser } from "../auth/session";
import { config } from "../config";
import type { Db } from "../db";
import { audit } from "./audit";
import { stripe } from "./billing";
import { deleteObject, supabaseAdmin } from "./storage";

/** GDPR Art. 15/20: everything we hold about the user, as JSON. */
export async function exportUserData(db: Db, userId: string) {
  const q = (sql: string) => db.query(sql, [userId]);
  const [profile, consents, attempts, answers, assessments, media, subscriptions, payments, usage, reports] = await Promise.all([
    db.one(`select id, email, display_name, role, locale, target_track, exam_date, ai_processing_consent, recording_retention_days, created_at from profiles where id = $1`, [userId]),
    q(`select kind, granted, at from consents where user_id = $1 order by at`),
    q(`select a.id, e.title, a.mode, a.status, a.section_ids, a.started_at, a.submitted_at, a.result from attempts a join exams e on e.id = a.exam_id where a.user_id = $1 order by a.started_at`),
    q(`select ans.attempt_id, ans.item_id, ans.value, ans.updated_at from attempt_answers ans join attempts a on a.id = ans.attempt_id where a.user_id = $1`),
    q(`select x.attempt_id, x.item_id, x.kind, x.source, x.rubric_version, x.evaluator_version, x.criteria, x.total, x.max, x.feedback, x.created_at from assessments x join attempts a on a.id = x.attempt_id where a.user_id = $1`),
    q(`select id, attempt_id, item_id, mime, bytes, duration_sec, transcript, retention_until, created_at from submission_media where user_id = $1`),
    q(`select plan_id, status, source, current_period_end, cancel_at_period_end, created_at from subscriptions where user_id = $1`),
    q(`select amount_cents, currency, status, source, created_at from payments where user_id = $1`),
    q(`select period, kind, count from usage_counters where user_id = $1`),
    q(`select item_id, message, status, created_at from issue_reports where user_id = $1`),
  ]);
  return {
    exportedAt: new Date().toISOString(),
    note: "Audio recordings are not embedded. They can be downloaded from the answer review until their retention date.",
    profile, consents, attempts, answers, assessments, recordings: media, subscriptions, payments, usage, issueReports: reports,
  };
}

/**
 * GDPR Art. 17: delete the account. Recordings are removed from storage, Stripe
 * subscriptions are cancelled, and personal rows cascade. Payment records are kept without
 * the user link because accounting law requires them.
 */
export async function deleteAccount(db: Db, user: CurrentUser) {
  const media = await db.query<{ storage_path: string }>(`select storage_path from submission_media where user_id = $1`, [user.id]);
  for (const m of media) await deleteObject("submissions", m.storage_path).catch(() => undefined);
  const subs = await db.query<{ stripe_subscription_id: string }>(
    `select stripe_subscription_id from subscriptions where user_id = $1 and source = 'stripe' and status in ('active', 'trialing', 'past_due') and stripe_subscription_id is not null`,
    [user.id],
  );
  for (const s of subs) await stripe().subscriptions.cancel(s.stripe_subscription_id);
  await audit(db, { actorId: null, action: "privacy.account_deleted", entityType: "user", entityId: user.id, details: { recordings: media.length } });
  if (config.backend === "supabase") {
    const sb = await supabaseAdmin();
    const { error } = await sb.auth.admin.deleteUser(user.id); // cascades to profiles
    if (error) throw error;
  } else {
    await db.query(`delete from profiles where id = $1`, [user.id]);
  }
}

/** Delete recordings whose retention period has passed. Run daily (see vercel.json). */
export async function purgeExpiredRecordings(db: Db, now = new Date()) {
  const expired = await db.query<{ id: string; storage_path: string }>(`select id, storage_path from submission_media where retention_until < $1`, [now.toISOString()]);
  for (const m of expired) {
    await deleteObject("submissions", m.storage_path).catch(() => undefined);
    await db.query(`delete from submission_media where id = $1`, [m.id]);
  }
  return { deleted: expired.length };
}
