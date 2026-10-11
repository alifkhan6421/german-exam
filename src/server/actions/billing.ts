"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "../auth/session";
import { getDb } from "../db";
import { billingMode, createCheckout, createPortal, simulateCancel, simulateCheckout } from "../services/billing";
import { DomainError } from "../services/exams";
import type { FormState } from "./auth";

export async function checkoutAction(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const planId = String(form.get("planId") ?? "");
  const db = await getDb();
  let url: string;
  try {
    if (billingMode() === "simulated") {
      await simulateCheckout(db, user, planId);
      url = "/settings/billing?checkout=simulated";
    } else {
      url = await createCheckout(db, user, planId);
    }
  } catch (e) {
    if (e instanceof DomainError) return { error: e.message };
    throw e;
  }
  revalidatePath("/", "layout");
  redirect(url);
}

export async function portalAction(): Promise<FormState> {
  const user = await requireUser();
  let url: string;
  try {
    url = await createPortal(await getDb(), user);
  } catch (e) {
    if (e instanceof DomainError) return { error: e.message };
    throw e;
  }
  redirect(url);
}

export async function simulateCancelAction(): Promise<FormState> {
  const user = await requireUser();
  try {
    await simulateCancel(await getDb(), user);
  } catch (e) {
    if (e instanceof DomainError) return { error: e.message };
    throw e;
  }
  revalidatePath("/", "layout");
  return { ok: true, message: "Simulated subscription cancelled." };
}
