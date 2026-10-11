import "server-only";
import { NextResponse } from "next/server";
import type { Permission } from "@/domain/roles";
import { apiUser, type CurrentUser } from "./auth/session";
import { getDb, type Db } from "./db";
import { DomainError } from "./services/exams";
import { rateLimit } from "./services/rate-limit";

/** Wrap an API handler: authentication, permission check, rate limit and error mapping. */
export function handler<C>(
  fn: (ctx: { user: CurrentUser; db: Db; req: Request; params: C }) => Promise<unknown>,
  opts: { permission?: Permission; limit?: { key: string; max: number; windowMs: number } } = {},
) {
  return async (req: Request, context: { params: Promise<C> }) => {
    try {
      const user = await apiUser(opts.permission);
      if (!user) return NextResponse.json({ error: opts.permission ? "Forbidden" : "Not signed in" }, { status: opts.permission ? 403 : 401 });
      if (opts.limit) {
        const rl = rateLimit(`${opts.limit.key}:${user.id}`, opts.limit.max, opts.limit.windowMs);
        if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } });
      }
      const db = await getDb();
      const out = await fn({ user, db, req, params: await context.params });
      if (out instanceof Response) return out;
      return NextResponse.json(out ?? { ok: true }, { headers: { "Cache-Control": "no-store" } });
    } catch (e) {
      if (e instanceof DomainError) return NextResponse.json({ error: e.message }, { status: e.status });
      console.error("[api]", req.method, new URL(req.url).pathname, e instanceof Error ? e.message : e);
      return NextResponse.json({ error: "Something went wrong. Your saved answers are safe." }, { status: 500 });
    }
  };
}

export async function jsonBody<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new DomainError("Invalid JSON body.");
  }
}
