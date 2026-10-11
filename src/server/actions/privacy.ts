"use server";

import { redirect } from "next/navigation";
import { requireUser, signOut } from "../auth/session";
import { getDb } from "../db";
import { deleteAccount } from "../services/privacy";
import type { FormState } from "./auth";

export async function deleteAccountAction(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  if (String(form.get("confirm") ?? "").trim().toLowerCase() !== user.email.toLowerCase()) {
    return { error: "Type your e-mail address exactly to confirm." };
  }
  await deleteAccount(await getDb(), user);
  await signOut();
  redirect("/?deleted=1");
}
