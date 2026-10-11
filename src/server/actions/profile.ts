"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { BLUEPRINTS } from "@/domain/blueprints";
import { requireUser } from "../auth/session";
import { getDb } from "../db";
import type { FormState } from "./auth";

const ProfileInput = z.object({
  displayName: z.string().max(80).optional(),
  targetTrack: z.enum(BLUEPRINTS.map((b) => b.key) as [string, ...string[]]).optional(),
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  locale: z.enum(["en", "de"]).optional(),
  aiConsent: z.string().optional(),
  retentionDays: z.coerce.number().int().min(1).max(730).optional(),
});

export async function saveProfileAction(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = ProfileInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check the form." };
  const d = parsed.data;
  const consent = d.aiConsent === "on";
  const db = await getDb();
  await db.query(
    `update profiles set display_name = coalesce($2, display_name), target_track = coalesce($3, target_track), exam_date = $4,
       locale = coalesce($5, locale), ai_processing_consent = $6, recording_retention_days = coalesce($7, recording_retention_days),
       onboarded_at = coalesce(onboarded_at, now()), updated_at = now() where id = $1`,
    [user.id, d.displayName || null, d.targetTrack ?? null, d.examDate || null, d.locale ?? null, consent, d.retentionDays ?? null],
  );
  if (consent !== user.aiConsent) await db.query(`insert into consents (user_id, kind, granted) values ($1, 'ai_processing', $2)`, [user.id, consent]);
  revalidatePath("/", "layout");
  if (form.get("from") === "onboarding") redirect("/dashboard");
  return { ok: true, message: "Saved." };
}
