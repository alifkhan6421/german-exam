"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EntitlementsSchema } from "@/domain/entitlements";
import { GENERATION_SCOPES, type GenerationScope } from "@/domain/generation/merge";
import { ROLES, type Permission, type Role } from "@/domain/roles";
import { requirePermission, type CurrentUser } from "../auth/session";
import { getDb, type Db } from "../db";
import { audit } from "../services/audit";
import { approveAudio, castVoices, generateAmbience, generateTurns, rejectAudio } from "../services/audio";
import { submitHumanAssessment } from "../services/assessment";
import {
  archiveExam, confirmBlueprint, createDraftVersion, DomainError, duplicateExam, publishVersion, reviewVersion, saveDraftContent,
  submitForReview, unpublishExam, validateVersion,
} from "../services/exams";
import { applyGeneration, runGeneration } from "../services/generator";
import type { FormState } from "./auth";

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

async function run(permission: Permission, fn: (db: Db, user: CurrentUser) => Promise<FormState | void>, revalidate = "/admin"): Promise<FormState> {
  const user = await requirePermission(permission);
  const db = await getDb();
  try {
    const out = await fn(db, user);
    revalidatePath(revalidate, "layout");
    return out ?? { ok: true, message: "Done." };
  } catch (e) {
    if (e instanceof DomainError) return { error: e.message };
    if (e instanceof Error && /redirect/i.test(e.message)) throw e;
    console.error("[admin action]", e);
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

/* Exams ------------------------------------------------------------------------------------ */

export async function createDraftAction(_: FormState, f: FormData): Promise<FormState> {
  let id = "";
  const res = await run("exam.edit", async (db, u) => {
    const v = await createDraftVersion(db, { examId: s(f, "examId"), actorId: u.id, note: "Manual new version" });
    id = v.id;
  });
  if (res?.error) return res;
  redirect(`/admin/exams/${s(f, "examId")}/versions/${id}`);
}

export async function saveContentAction(_: FormState, f: FormData): Promise<FormState> {
  return run("exam.edit", async (db, u) => {
    let content: unknown;
    try {
      content = JSON.parse(s(f, "content"));
    } catch (e) {
      throw new DomainError(`Invalid JSON: ${e instanceof Error ? e.message : ""}`);
    }
    await saveDraftContent(db, { versionId: s(f, "versionId"), actorId: u.id, content, note: s(f, "note") || undefined });
    const report = await validateVersion(db, { versionId: s(f, "versionId"), actorId: u.id });
    return { ok: true, message: `Saved. Validation: ${report.counts.critical} critical, ${report.counts.warning} warnings.` };
  });
}

export async function validateAction(_: FormState, f: FormData): Promise<FormState> {
  return run("exam.edit", async (db, u) => {
    const r = await validateVersion(db, { versionId: s(f, "versionId"), actorId: u.id });
    return { ok: true, message: r.ok ? "No critical issues." : `${r.counts.critical} critical issue(s).` };
  });
}

export async function submitReviewAction(_: FormState, f: FormData): Promise<FormState> {
  return run("exam.edit", async (db, u) => {
    await submitForReview(db, { versionId: s(f, "versionId"), actorId: u.id });
    return { ok: true, message: "Sent for review. The version is now locked." };
  });
}

export async function reviewAction(_: FormState, f: FormData): Promise<FormState> {
  return run("exam.review", async (db, u) => {
    const decision = s(f, "decision") as "approve" | "request_changes" | "reject";
    if (!["approve", "request_changes", "reject"].includes(decision)) throw new DomainError("Choose a decision.");
    if (decision !== "approve" && !s(f, "comments")) throw new DomainError("Explain what needs to change.");
    await reviewVersion(db, { versionId: s(f, "versionId"), actorId: u.id, decision, comments: s(f, "comments") || undefined });
    return { ok: true, message: decision === "approve" ? "Approved." : "Returned to draft." };
  });
}

export async function publishAction(_: FormState, f: FormData): Promise<FormState> {
  return run("exam.publish", async (db, u) => {
    await publishVersion(db, { versionId: s(f, "versionId"), actorId: u.id });
    return { ok: true, message: "Published. Students now see this version; existing attempts keep theirs." };
  });
}

export async function unpublishAction(_: FormState, f: FormData): Promise<FormState> {
  return run("exam.publish", async (db, u) => unpublishExam(db, { examId: s(f, "examId"), actorId: u.id }));
}

export async function archiveAction(_: FormState, f: FormData): Promise<FormState> {
  return run("exam.publish", async (db, u) => archiveExam(db, { examId: s(f, "examId"), actorId: u.id }));
}

export async function duplicateAction(_: FormState, f: FormData): Promise<FormState> {
  return run("exam.edit", async (db, u) => {
    await duplicateExam(db, { fromExamId: s(f, "fromExamId"), toExamId: s(f, "toExamId"), actorId: u.id });
    return { ok: true, message: "Copied as a new draft. Audio was not copied." };
  });
}

export async function setAccessTierAction(_: FormState, f: FormData): Promise<FormState> {
  return run("exam.publish", async (db, u) => {
    const tier = s(f, "tier") === "free" ? "free" : "premium";
    await db.query(`update exams set access_tier = $1, updated_at = now() where id = $2`, [tier, s(f, "examId")]);
    await audit(db, { actorId: u.id, action: "exam.access_tier", entityType: "exam", entityId: s(f, "examId"), details: { tier } });
  });
}

/* Blueprints ------------------------------------------------------------------------------- */

export async function confirmBlueprintAction(_: FormState, f: FormData): Promise<FormState> {
  return run("blueprint.confirm", async (db, u) => {
    if (f.get("checked") !== "on") throw new DomainError("Confirm that you checked the unverified values against the official documents.");
    await confirmBlueprint(db, { key: s(f, "key"), version: s(f, "version"), actorId: u.id, note: s(f, "note") });
    return { ok: true, message: "Blueprint confirmed." };
  });
}

/* AI generation ---------------------------------------------------------------------------- */

export async function generateAction(_: FormState, f: FormData): Promise<FormState> {
  let jobId = "";
  const res = await run("ai.generate", async (db, u) => {
    const scope = s(f, "scope") as GenerationScope;
    if (!GENERATION_SCOPES.includes(scope)) throw new DomainError("Choose a scope.");
    const target = { sectionId: s(f, "sectionId") || undefined, partId: s(f, "partId") || undefined, itemId: s(f, "itemId") || undefined, stimulusId: s(f, "stimulusId") || undefined };
    if (scope !== "exam" && !target.sectionId) throw new DomainError("Choose a section.");
    if (["part", "item", "passage"].includes(scope) && !target.partId) throw new DomainError("Choose a part.");
    if (scope === "item" && !target.itemId) throw new DomainError("Choose an item.");
    if (scope === "passage" && !target.stimulusId) throw new DomainError("Choose a text or recording.");
    jobId = await runGeneration(db, u, { examId: s(f, "examId"), scope, target, brief: s(f, "brief") });
  });
  if (res?.error) return res;
  redirect(`/admin/generator/${jobId}`);
}

export async function applyGenerationAction(_: FormState, f: FormData): Promise<FormState> {
  let to = "";
  const res = await run("ai.generate", async (db, u) => {
    const v = await applyGeneration(db, u, s(f, "jobId"));
    to = `/admin/exams/${v.exam_id}/versions/${v.id}`;
  });
  if (res?.error) return res;
  redirect(to);
}

/* Audio ------------------------------------------------------------------------------------ */

export async function castVoicesAction(_: FormState, f: FormData): Promise<FormState> {
  let to = "";
  const res = await run("audio.produce", async (db, u) => {
    const voices: Record<string, string> = {};
    for (const [k, v] of f.entries()) if (k.startsWith("voice:") && String(v).trim()) voices[k.slice(6)] = String(v).trim();
    const versionId = await castVoices(db, u, s(f, "versionId"), s(f, "scriptId"), voices);
    to = `/admin/audio/${versionId}/${s(f, "scriptId")}`;
  });
  if (res?.error) return res;
  redirect(to);
}

export async function generateTurnsAction(_: FormState, f: FormData): Promise<FormState> {
  return run("audio.produce", async (db, u) => {
    const ids = await generateTurns(db, u, s(f, "versionId"), s(f, "scriptId"));
    return { ok: true, message: `Generated ${ids.length} clips.` };
  });
}

export async function generateAmbienceAction(_: FormState, f: FormData): Promise<FormState> {
  return run("audio.produce", async (db, u) => {
    await generateAmbience(db, u, s(f, "versionId"), s(f, "scriptId"));
    return { ok: true, message: "Ambience generated." };
  });
}

export async function approveAudioAction(_: FormState, f: FormData): Promise<FormState> {
  return run("exam.review", async (db, u) => {
    const versionId = await approveAudio(db, u, s(f, "assetId"));
    return { ok: true, message: `Approved and linked in version ${versionId.slice(0, 8)}. Re-validate and send the version for review.` };
  });
}

export async function rejectAudioAction(_: FormState, f: FormData): Promise<FormState> {
  return run("exam.review", async (db, u) => rejectAudio(db, u, s(f, "assetId")));
}

/* Assessments ------------------------------------------------------------------------------ */

export async function humanAssessmentAction(_: FormState, f: FormData): Promise<FormState> {
  return run("assessment.review", async (db, u) => {
    const scores: Record<string, number> = {};
    const comments: Record<string, string> = {};
    for (const [k, v] of f.entries()) {
      if (k.startsWith("score:")) scores[k.slice(6)] = Number(v);
      if (k.startsWith("comment:")) comments[k.slice(8)] = String(v);
    }
    await submitHumanAssessment(db, u, { attemptId: s(f, "attemptId"), itemId: s(f, "itemId"), scores, comments, summary: s(f, "summary") });
    return { ok: true, message: "Assessment saved. The student's result was updated." };
  });
}

/* Plans, users, reports -------------------------------------------------------------------- */

export async function updatePlanAction(_: FormState, f: FormData): Promise<FormState> {
  return run("plans.edit", async (db, u) => {
    let ent: unknown;
    try {
      ent = JSON.parse(s(f, "entitlements"));
    } catch {
      throw new DomainError("Entitlements must be valid JSON.");
    }
    const parsed = EntitlementsSchema.safeParse(ent);
    if (!parsed.success) throw new DomainError(`Invalid entitlements: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
    const price = Math.round(Number(s(f, "price")) * 100);
    if (!Number.isFinite(price) || price < 0) throw new DomainError("Invalid price.");
    await db.query(
      `update plans set name = $2, description = $3, price_cents = $4, stripe_price_id = $5, entitlements = $6::jsonb, active = $7, updated_at = now() where id = $1`,
      [s(f, "id"), s(f, "name"), s(f, "description"), price, s(f, "stripePriceId") || null, JSON.stringify(parsed.data), f.get("active") === "on"],
    );
    await audit(db, { actorId: u.id, action: "plan.updated", entityType: "plan", entityId: s(f, "id"), details: { price, entitlements: parsed.data } });
    return { ok: true, message: "Plan saved. The displayed price must match the Stripe price." };
  }, "/");
}

export async function setRoleAction(_: FormState, f: FormData): Promise<FormState> {
  return run("users.manage", async (db, u) => {
    const role = s(f, "role") as Role;
    if (!ROLES.includes(role)) throw new DomainError("Unknown role.");
    if (s(f, "userId") === u.id) throw new DomainError("You cannot change your own role.");
    await db.query(`update profiles set role = $1, updated_at = now() where id = $2`, [role, s(f, "userId")]);
    await audit(db, { actorId: u.id, action: "user.role_changed", entityType: "user", entityId: s(f, "userId"), details: { role } });
  });
}

export async function grantManualAction(_: FormState, f: FormData): Promise<FormState> {
  return run("users.manage", async (db, u) => {
    const days = Number(s(f, "days"));
    if (!Number.isInteger(days) || days < 1 || days > 366) throw new DomainError("Days must be between 1 and 366.");
    const reason = s(f, "reason");
    if (!reason) throw new DomainError("Give a reason (e.g. support case number).");
    const end = new Date(Date.now() + days * 86400_000).toISOString();
    await db.query(`insert into subscriptions (user_id, plan_id, status, source, current_period_end) values ($1, $2, 'active', 'manual', $3)`, [s(f, "userId"), s(f, "planId"), end]);
    await audit(db, { actorId: u.id, action: "user.manual_access", entityType: "user", entityId: s(f, "userId"), details: { planId: s(f, "planId"), days, reason } });
    return { ok: true, message: `Granted until ${end.slice(0, 10)}.` };
  });
}

export async function resolveReportAction(_: FormState, f: FormData): Promise<FormState> {
  return run("reports.view", async (db, u) => {
    const status = s(f, "status") === "dismissed" ? "dismissed" : "resolved";
    await db.query(`update issue_reports set status = $1 where id = $2`, [status, s(f, "id")]);
    await audit(db, { actorId: u.id, action: `report.${status}`, entityType: "issue_report", entityId: s(f, "id") });
  });
}
