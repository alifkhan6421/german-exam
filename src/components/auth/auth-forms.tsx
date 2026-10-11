"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Alert } from "@/components/ui/alert";

export function LoginForm({ next, devUsers }: { next?: string; devUsers?: { email: string; password: string; role: string }[] }) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? ""} />
      {state?.error && <Alert tone="danger">{state.error}</Alert>}
      <Field label="Email" htmlFor="email"><Input id="email" name="email" type="email" autoComplete="email" required /></Field>
      <Field label="Password" htmlFor="password"><Input id="password" name="password" type="password" autoComplete="current-password" required /></Field>
      <Button type="submit" disabled={pending}>{pending ? "Signing in…" : "Log in"}</Button>
      <p className="text-center text-sm text-ink-500">No account yet? <Link className="text-brand-700 hover:underline" href="/register">Create one</Link></p>
      {devUsers && (
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          <p className="mb-1 font-semibold">Development accounts</p>
          <ul className="space-y-0.5 font-mono">
            {devUsers.map((u) => <li key={u.email}>{u.email} / {u.password} <span className="font-sans text-amber-700">({u.role})</span></li>)}
          </ul>
        </div>
      )}
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, undefined);
  return (
    <form action={action} className="flex flex-col gap-4">
      {state?.error && <Alert tone="danger">{state.error}</Alert>}
      {state?.message && <Alert tone="success">{state.message}</Alert>}
      <Field label="Name" htmlFor="displayName"><Input id="displayName" name="displayName" autoComplete="name" /></Field>
      <Field label="Email" htmlFor="email"><Input id="email" name="email" type="email" autoComplete="email" required /></Field>
      <Field label="Password" htmlFor="password" hint="At least 10 characters."><Input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required /></Field>
      <label className="flex items-start gap-2 text-sm text-ink-600">
        <input type="checkbox" name="acceptTerms" className="mt-1" required />
        <span>I accept the <Link href="/legal/terms" className="text-brand-700 underline">terms</Link> and have read the <Link href="/legal/privacy" className="text-brand-700 underline">privacy notice</Link>. I understand this is independent practice and not an official exam.</span>
      </label>
      <Button type="submit" disabled={pending}>{pending ? "Creating account…" : "Create free account"}</Button>
      <p className="text-center text-sm text-ink-500">Already registered? <Link className="text-brand-700 hover:underline" href="/login">Log in</Link></p>
    </form>
  );
}
