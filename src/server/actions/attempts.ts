"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "../auth/session";
import { getDb } from "../db";
import { startAttempt } from "../services/attempts";
import { DomainError } from "../services/exams";
import type { FormState } from "./auth";

export async function startAttemptAction(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = z
    .object({ examId: z.string().uuid(), mode: z.enum(["exam", "practice"]), timed: z.string().optional() })
    .safeParse({ examId: form.get("examId"), mode: form.get("mode"), timed: form.get("timed") ?? undefined });
  if (!parsed.success) return { error: "Invalid request." };
  const sectionIds = form.getAll("sections").map(String);
  let id: string;
  try {
    const res = await startAttempt(await getDb(), user, {
      examId: parsed.data.examId,
      mode: parsed.data.mode,
      sectionIds: parsed.data.mode === "exam" && form.get("scope") !== "sections" ? undefined : sectionIds,
      timed: parsed.data.timed === "on",
    });
    id = res.attemptId;
  } catch (e) {
    if (e instanceof DomainError) return { error: e.message };
    throw e;
  }
  redirect(`/attempts/${id}`);
}

export async function reportIssueAction(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const message = String(form.get("message") ?? "").trim().slice(0, 2000);
  if (message.length < 5) return { error: "Please describe the problem." };
  const db = await getDb();
  const attempt = await db.one<{ exam_version_id: string }>(`select exam_version_id from attempts where id = $1 and user_id = $2`, [String(form.get("attemptId")), user.id]);
  if (!attempt) return { error: "Attempt not found." };
  await db.query(`insert into issue_reports (user_id, exam_version_id, item_id, message) values ($1, $2, $3, $4)`, [user.id, attempt.exam_version_id, String(form.get("itemId") ?? "") || null, message]);
  return { ok: true, message: "Thanks — our content team will check it." };
}
