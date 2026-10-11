"use client";

import { useActionState } from "react";
import { checkoutAction, portalAction, simulateCancelAction } from "@/server/actions/billing";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ planId, label, simulated, featured }: { planId: string; label: string; simulated: boolean; featured?: boolean }) {
  const [state, action, pending] = useActionState(checkoutAction, undefined);
  return (
    <form action={action} className="flex flex-col gap-1">
      <input type="hidden" name="planId" value={planId} />
      <Button type="submit" variant={featured ? "primary" : "secondary"} disabled={pending}>
        {pending ? "Redirecting…" : simulated ? `${label} (simulated)` : label}
      </Button>
      {state?.error && <p className="text-xs text-danger-600" role="alert">{state.error}</p>}
    </form>
  );
}

export function PortalButton() {
  const [state, action, pending] = useActionState(portalAction, undefined);
  return (
    <form action={action} className="flex flex-col gap-1">
      <Button type="submit" variant="secondary" disabled={pending}>{pending ? "Opening…" : "Manage subscription and invoices"}</Button>
      {state?.error && <p className="text-xs text-danger-600" role="alert">{state.error}</p>}
    </form>
  );
}

export function SimulatedCancelButton() {
  const [state, action, pending] = useActionState(simulateCancelAction, undefined);
  return (
    <form action={action} className="flex flex-col gap-1">
      <Button type="submit" variant="secondary" disabled={pending}>Cancel simulated subscription</Button>
      {state?.error && <p className="text-xs text-danger-600" role="alert">{state.error}</p>}
      {state?.message && <p className="text-xs text-success-600">{state.message}</p>}
    </form>
  );
}
