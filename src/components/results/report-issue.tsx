"use client";

import { useActionState, useState } from "react";
import { Flag } from "lucide-react";
import { reportIssueAction } from "@/server/actions/attempts";

export function ReportIssue({ attemptId, itemId }: { attemptId: string; itemId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(reportIssueAction, undefined);
  if (state?.ok) return <p className="text-xs text-success-600">{state.message}</p>;
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1 self-start text-xs text-ink-500 hover:text-ink-800"><Flag className="h-3 w-3" />Report a problem</button>;
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="attemptId" value={attemptId} />
      <input type="hidden" name="itemId" value={itemId} />
      <textarea name="message" required className="h-20 rounded-md border border-ink-200 p-2 text-sm" placeholder="What is wrong with this question, answer or recording?" />
      <div className="flex gap-2">
        <button disabled={pending} className="rounded-md bg-ink-900 px-3 py-1 text-xs font-medium text-white">{pending ? "Sending…" : "Send report"}</button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-ink-500">Cancel</button>
      </div>
      {state?.error && <p className="text-xs text-danger-600">{state.error}</p>}
    </form>
  );
}
