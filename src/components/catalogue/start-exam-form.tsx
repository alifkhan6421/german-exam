"use client";

import { useActionState, useState } from "react";
import { startAttemptAction } from "@/server/actions/attempts";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";

export function StartExamForm({
  examId,
  sections,
  defaultMode,
  canPractice,
}: {
  examId: string;
  sections: { id: string; titleDe: string; titleEn: string; minutes: string }[];
  defaultMode: "exam" | "practice";
  canPractice: boolean;
}) {
  const [state, action, pending] = useActionState(startAttemptAction, undefined);
  const [mode, setMode] = useState<"exam" | "practice">(defaultMode);
  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="examId" value={examId} />
      {state?.error && (
        <Alert tone="warning">
          {state.error} {state.error.toLowerCase().includes("premium") || state.error.toLowerCase().includes("plan") ? <Link className="underline" href="/settings/billing">See plans</Link> : null}
        </Alert>
      )}
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Mode</legend>
        {[
          { v: "exam" as const, t: "Full Exam Simulation", d: "Strict conditions: official order and timing, no answers or hints, closed modules cannot be reopened, automatic submission." },
          { v: "practice" as const, t: "Section Practice", d: "Choose sections, pause if needed, and see explanations and transcripts after you finish." },
        ].map((o) => (
          <label key={o.v} className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-4 ${mode === o.v ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500" : "border-ink-200 bg-white"} ${o.v === "practice" && !canPractice ? "opacity-50" : ""}`}>
            <span className="flex items-center gap-2 font-semibold"><input type="radio" name="mode" value={o.v} checked={mode === o.v} onChange={() => setMode(o.v)} disabled={o.v === "practice" && !canPractice} />{o.t}</span>
            <span className="text-sm text-ink-600">{o.d}</span>
          </label>
        ))}
      </fieldset>
      {mode === "practice" && (
        <div className="flex flex-col gap-3 rounded-xl border border-ink-200 bg-white p-4">
          <p className="text-sm font-medium">Sections</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {sections.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="sections" value={s.id} defaultChecked />
                <span>{s.titleDe} <span className="text-ink-500">· {s.titleEn} · {s.minutes}</span></span>
              </label>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="timed" defaultChecked /> Use the official time limits</label>
        </div>
      )}
      <Button type="submit" size="lg" disabled={pending} className="self-start">{pending ? "Preparing…" : mode === "exam" ? "Start exam" : "Start practice"}</Button>
    </form>
  );
}
