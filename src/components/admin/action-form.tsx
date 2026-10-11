"use client";

import { useActionState } from "react";
import type { FormState } from "@/server/actions/auth";
import { Button, type ButtonProps } from "@/components/ui/button";

type Action = (state: FormState, form: FormData) => Promise<FormState>;

/** A one-button form for an admin server action, with inline result and optional confirmation. */
export function ActionForm({
  action, fields, label, pendingLabel, variant = "secondary", size = "sm", confirm, children, className,
}: {
  action: Action;
  fields?: Record<string, string>;
  label: string;
  pendingLabel?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  confirm?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form
      action={formAction}
      className={className ?? "flex flex-col gap-2"}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {Object.entries(fields ?? {}).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      {children}
      <Button type="submit" variant={variant} size={size} disabled={pending} className="self-start">{pending ? pendingLabel ?? "Working…" : label}</Button>
      {state?.error && <p className="whitespace-pre-wrap text-xs text-danger-600" role="alert">{state.error}</p>}
      {state?.message && <p className="text-xs text-success-600">{state.message}</p>}
    </form>
  );
}
