"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn, signOut, signUp } from "../auth/session";
import { rateLimit } from "../services/rate-limit";
import { headers } from "next/headers";

export type FormState = { error?: string; ok?: boolean; message?: string } | undefined;

async function clientKey() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

export async function loginAction(_: FormState, form: FormData): Promise<FormState> {
  const rl = rateLimit(`login:${await clientKey()}`, 10, 60_000);
  if (!rl.ok) return { error: `Too many attempts. Try again in ${rl.retryAfterSec} seconds.` };
  const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Enter your email and password." };
  const res = await signIn(parsed.data.email, parsed.data.password);
  if (!res.ok) return { error: res.error };
  const next = String(form.get("next") ?? "");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
}

export async function registerAction(_: FormState, form: FormData): Promise<FormState> {
  const rl = rateLimit(`register:${await clientKey()}`, 5, 60_000);
  if (!rl.ok) return { error: `Too many attempts. Try again in ${rl.retryAfterSec} seconds.` };
  const parsed = z
    .object({ email: z.string().email(), password: z.string(), displayName: z.string().max(80).default(""), acceptTerms: z.string().optional() })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check your details." };
  const res = await signUp({ ...parsed.data, acceptTerms: parsed.data.acceptTerms === "on" });
  if (!res.ok) return { error: res.error };
  redirect("/onboarding");
}

export async function logoutAction() {
  await signOut();
  redirect("/");
}
