import { randomUUID } from "node:crypto";
import { BLUEPRINTS, getBlueprint } from "@/domain/blueprints";
import { ExamContentSchema } from "@/domain/exam/schema";
import { validateExam } from "@/domain/exam/validate";
import { EntitlementsSchema, FREE_ENTITLEMENTS } from "@/domain/entitlements";
import { goetheA1Mock1 } from "@/content/goethe-a1/mock-1";
import { hashPassword } from "../auth/password";
import type { Db } from "./index";

export const DEV_USERS = [
  { email: "admin@example.com", password: "admin-dev-123", role: "super_admin", name: "Dev Admin" },
  { email: "editor@example.com", password: "editor-dev-123", role: "content_admin", name: "Dev Content Admin" },
  { email: "examiner@example.com", password: "examiner-dev-123", role: "examiner", name: "Dev Examiner" },
  { email: "student@example.com", password: "student-dev-123", role: "student", name: "Dev Student" },
] as const;

const TRACK_TITLES: Record<string, string> = {
  "goethe-a1-sd1": "Goethe-Zertifikat A1: Start Deutsch 1",
  "goethe-a2": "Goethe-Zertifikat A2",
  "goethe-b1": "Goethe-Zertifikat B1",
  "goethe-b2": "Goethe-Zertifikat B2",
  "telc-a1-sd1": "Start Deutsch 1 / telc Deutsch A1",
  "telc-a2-sd2": "Start Deutsch 2 / telc Deutsch A2",
  "telc-b1": "Zertifikat Deutsch / telc Deutsch B1",
  "telc-b2": "telc Deutsch B2",
};

/**
 * Idempotent reference data: blueprints, tracks, plans and the 40 mock exam slots.
 * With `dev: true` it also creates development users and publishes Goethe A1 Mock 1
 * (development preview audio, blueprint confirmed by the seed and labelled as such).
 */
export async function seed(db: Db, opts: { dev: boolean }) {
  for (const bp of BLUEPRINTS) {
    await db.query(
      `insert into blueprint_versions (blueprint_key, version, definition) values ($1, $2, $3::jsonb)
       on conflict (blueprint_key, version) do update set definition = excluded.definition`,
      [bp.key, bp.version, JSON.stringify(bp)],
    );
  }
  let sort = 0;
  for (const bp of BLUEPRINTS) {
    await db.query(
      `insert into exam_tracks (key, provider, level, title, variant, sort) values ($1, $2, $3, $4, $5, $6)
       on conflict (key) do update set title = excluded.title, variant = excluded.variant, sort = excluded.sort`,
      [bp.key, bp.provider, bp.level, TRACK_TITLES[bp.key] ?? bp.officialName, bp.variant, sort++],
    );
  }

  const premium = EntitlementsSchema.parse({
    tracks: ["*"],
    premiumExams: true,
    explanations: true,
    aiWritingPerMonth: 30,
    aiSpeakingPerMonth: 30,
    practiceRetriesPerExam: null,
    progressAnalytics: "full",
  });
  const plans = [
    { id: "free", name: "Free", description: "Dashboard, one complete demonstration exam and limited practice.", interval: "none", price: 0, ent: FREE_ENTITLEMENTS, sort: 0 },
    { id: "premium_monthly", name: "Premium Monthly", description: "All published mock exams, full simulations, explanations and AI feedback within fair-use limits.", interval: "month", price: 1990, ent: premium, sort: 1 },
    { id: "premium_annual", name: "Premium Annual", description: "Everything in Premium, billed yearly.", interval: "year", price: 14900, ent: premium, sort: 2 },
  ];
  for (const p of plans) {
    // Do not overwrite prices/entitlements an administrator has edited.
    await db.query(
      `insert into plans (id, name, description, billing_interval, price_cents, entitlements, sort)
       values ($1, $2, $3, $4, $5, $6::jsonb, $7) on conflict (id) do nothing`,
      [p.id, p.name, p.description, p.interval, p.price, JSON.stringify(p.ent), p.sort],
    );
  }

  // Five mock exam slots per track (drafts without content until produced).
  for (const bp of BLUEPRINTS) {
    for (let n = 1; n <= 5; n++) {
      await db.query(
        `insert into exams (track_key, mock_number, title, access_tier) values ($1, $2, $3, $4)
         on conflict (track_key, mock_number) do nothing`,
        [bp.key, n, `${TRACK_TITLES[bp.key]} — Übungstest ${n}`, bp.key === "goethe-a1-sd1" && n === 1 ? "free" : "premium"],
      );
    }
  }

  if (!opts.dev) return;

  const ids: Record<string, string> = {};
  for (const u of DEV_USERS) {
    const existing = await db.one<{ id: string }>(`select id from profiles where email = $1`, [u.email]);
    const id = existing?.id ?? randomUUID();
    ids[u.email] = id;
    if (!existing) {
      await db.query(`insert into profiles (id, email, display_name, role, onboarded_at, target_track) values ($1, $2, $3, $4, now(), 'goethe-a1-sd1')`, [id, u.email, u.name, u.role]);
      await db.query(`insert into dev_credentials (user_id, password_hash) values ($1, $2)`, [id, hashPassword(u.password)]);
    }
  }

  const bp = getBlueprint("goethe-a1-sd1")!;
  const confirmed = await db.one(`select 1 from blueprint_confirmations where blueprint_key = $1 and version = $2`, [bp.key, bp.version]);
  if (!confirmed) {
    await db.query(
      `insert into blueprint_confirmations (blueprint_key, version, confirmed_by, note) values ($1, $2, $3, $4)`,
      [bp.key, bp.version, ids["admin@example.com"], "DEVELOPMENT SEED: auto-confirmed so the demo exam can be published. An administrator must review the unverified Hören item split before production."],
    );
  }

  const exam = await db.one<{ id: string; published_version_id: string | null }>(
    `select id, published_version_id from exams where track_key = $1 and mock_number = 1`,
    [bp.key],
  );
  if (exam && !exam.published_version_id) {
    const content = ExamContentSchema.parse(goetheA1Mock1);
    const report = validateExam(content, bp, { blueprintConfirmed: true, allowDevPreviewAudio: true });
    if (!report.ok) throw new Error(`Seed exam failed validation: ${JSON.stringify(report.issues.filter((i) => i.severity === "critical"))}`);
    const versionId = randomUUID();
    await db.tx(async (tx) => {
      await tx.query(
        `insert into exam_versions (id, exam_id, version, blueprint_key, blueprint_version, content, status, validation, locked, created_by, approved_by, approved_at, published_at)
         values ($1, $2, 1, $3, $4, $5::jsonb, 'published', $6::jsonb, true, $7, $7, now(), now())`,
        [versionId, exam.id, bp.key, bp.version, JSON.stringify(content), JSON.stringify(report), ids["admin@example.com"]],
      );
      await tx.query(`update exams set status = 'published', current_version_id = $1, published_version_id = $1, updated_at = now() where id = $2`, [versionId, exam.id]);
      await tx.query(
        `insert into audit_log (actor_id, action, entity_type, entity_id, details) values ($1, 'exam.published', 'exam', $2, $3::jsonb)`,
        [ids["admin@example.com"], exam.id, JSON.stringify({ version: 1, note: "Development seed (preview audio)" })],
      );
    });
  }
}
