import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { can, type Permission, type Role } from "@/domain/roles";
import { config } from "../config";
import { getDb } from "../db";
import { verifyPassword, hashPassword } from "./password";

export interface CurrentUser {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  locale: "en" | "de";
  targetTrack: string | null;
  examDate: string | null;
  onboarded: boolean;
  aiConsent: boolean;
  recordingRetentionDays: number;
}

const DEV_COOKIE = "gep_dev_session";
const SESSION_DAYS = 14;

function tokenHash(token: string) {
  return createHash("sha256").update(token + config.dev.sessionSecret).digest("hex");
}

type ProfileRow = {
  id: string;
  email: string;
  display_name: string | null;
  role: Role;
  locale: "en" | "de";
  target_track: string | null;
  exam_date: string | Date | null;
  onboarded_at: string | null;
  ai_processing_consent: boolean;
  recording_retention_days: number;
};

function toUser(r: ProfileRow): CurrentUser {
  return {
    id: r.id,
    email: r.email,
    displayName: r.display_name ?? r.email.split("@")[0],
    role: r.role,
    locale: r.locale,
    targetTrack: r.target_track,
    examDate: r.exam_date ? new Date(r.exam_date).toISOString().slice(0, 10) : null,
    onboarded: !!r.onboarded_at,
    aiConsent: r.ai_processing_consent,
    recordingRetentionDays: r.recording_retention_days,
  };
}

export async function loadProfile(id: string): Promise<CurrentUser | null> {
  const db = await getDb();
  const r = await db.one<ProfileRow>(`select * from profiles where id = $1 and deletion_requested_at is null`, [id]);
  return r ? toUser(r) : null;
}

export async function supabaseServer() {
  const { createServerClient } = await import("@supabase/ssr");
  const store = await cookies();
  return createServerClient(config.supabase.url!, config.supabase.anonKey!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const c of list) store.set(c.name, c.value, c.options);
        } catch {
          // Called from a Server Component: middleware refreshes the session instead.
        }
      },
    },
  });
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (config.backend === "supabase") {
    const sb = await supabaseServer();
    const { data } = await sb.auth.getUser();
    if (!data.user) return null;
    return loadProfile(data.user.id);
  }
  const store = await cookies();
  const token = store.get(DEV_COOKIE)?.value;
  if (!token) return null;
  const db = await getDb();
  const row = await db.one<{ user_id: string }>(`select user_id from dev_sessions where token_hash = $1 and expires_at > now()`, [tokenHash(token)]);
  return row ? loadProfile(row.user_id) : null;
}

export async function requireUser(): Promise<CurrentUser> {
  const u = await getCurrentUser();
  if (!u) redirect("/login");
  return u;
}

export async function requirePermission(permission: Permission): Promise<CurrentUser> {
  const u = await requireUser();
  if (!can(u.role, permission)) redirect("/dashboard?denied=1");
  return u;
}

/** For API routes: returns the user or null without redirecting. */
export async function apiUser(permission?: Permission): Promise<CurrentUser | null> {
  const u = await getCurrentUser();
  if (!u) return null;
  if (permission && !can(u.role, permission)) return null;
  return u;
}

export type AuthResult = { ok: true; confirmEmail?: boolean } | { ok: false; error: string };

export async function signIn(email: string, password: string): Promise<AuthResult> {
  email = email.trim().toLowerCase();
  if (config.backend === "supabase") {
    const sb = await supabaseServer();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    return error ? { ok: false, error: "Email or password is incorrect." } : { ok: true };
  }
  const db = await getDb();
  const row = await db.one<{ user_id: string; password_hash: string }>(
    `select c.user_id, c.password_hash from dev_credentials c join profiles p on p.id = c.user_id where p.email = $1 and p.deletion_requested_at is null`,
    [email],
  );
  if (!row || !verifyPassword(password, row.password_hash)) return { ok: false, error: "Email or password is incorrect." };
  await startDevSession(row.user_id);
  return { ok: true };
}

async function startDevSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const db = await getDb();
  await db.query(`insert into dev_sessions (token_hash, user_id, expires_at) values ($1, $2, now() + interval '${SESSION_DAYS} days')`, [tokenHash(token), userId]);
  const store = await cookies();
  store.set(DEV_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: config.isProduction, path: "/", maxAge: SESSION_DAYS * 86400 });
}

export async function signUp(input: { email: string; password: string; displayName: string; acceptTerms: boolean }): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  if (!input.acceptTerms) return { ok: false, error: "Please accept the terms and privacy notice." };
  if (input.password.length < 10) return { ok: false, error: "Use at least 10 characters for your password." };
  if (config.backend === "supabase") {
    const sb = await supabaseServer();
    const { data, error } = await sb.auth.signUp({
      email,
      password: input.password,
      options: { data: { display_name: input.displayName }, emailRedirectTo: `${config.appUrl}/auth/callback?next=/onboarding` },
    });
    if (error) return { ok: false, error: error.message };
    if (data.user) {
      const db = await getDb();
      await db.query(`insert into consents (user_id, kind, granted) values ($1, 'terms', true), ($1, 'privacy', true)`, [data.user.id]);
    }
    // With email confirmation enabled in Supabase Auth there is no session until the link is clicked.
    return { ok: true, confirmEmail: !data.session };
  }
  const db = await getDb();
  const exists = await db.one(`select 1 from profiles where email = $1`, [email]);
  if (exists) return { ok: false, error: "An account with this email already exists." };
  const id = crypto.randomUUID();
  await db.tx(async (tx) => {
    await tx.query(`insert into profiles (id, email, display_name) values ($1, $2, $3)`, [id, email, input.displayName.trim() || null]);
    await tx.query(`insert into dev_credentials (user_id, password_hash) values ($1, $2)`, [id, hashPassword(input.password)]);
    await tx.query(`insert into consents (user_id, kind, granted) values ($1, 'terms', true), ($1, 'privacy', true)`, [id]);
  });
  await startDevSession(id);
  return { ok: true };
}

export async function signOut() {
  if (config.backend === "supabase") {
    const sb = await supabaseServer();
    await sb.auth.signOut();
    return;
  }
  const store = await cookies();
  const token = store.get(DEV_COOKIE)?.value;
  if (token) {
    const db = await getDb();
    await db.query(`delete from dev_sessions where token_hash = $1`, [tokenHash(token)]);
  }
  store.delete(DEV_COOKIE);
}
