"use client";

import { useActionState } from "react";
import { deleteAccountAction } from "@/server/actions/privacy";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

export function DeleteAccountForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(deleteAccountAction, undefined);
  return (
    <form action={action} className="flex flex-col gap-3">
      <Field label={`Type ${email} to confirm`} htmlFor="confirm"><Input id="confirm" name="confirm" autoComplete="off" /></Field>
      {state?.error && <p className="text-sm text-danger-600" role="alert">{state.error}</p>}
      <Button type="submit" variant="danger" disabled={pending} className="self-start">{pending ? "Deleting…" : "Delete my account permanently"}</Button>
    </form>
  );
}
