"use client";

import { useRef, useState } from "react";
import { ActionForm } from "./action-form";
import { saveContentAction } from "@/server/actions/admin";

export function JsonEditor({ versionId, initial, readOnly }: { versionId: string; initial: string; readOnly: boolean }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);
  function format() {
    if (!ref.current) return;
    try {
      ref.current.value = JSON.stringify(JSON.parse(ref.current.value), null, 2);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }
  const area = (
    <textarea
      ref={ref}
      name="content"
      defaultValue={initial}
      readOnly={readOnly}
      spellCheck={false}
      aria-label="Exam content JSON"
      className="h-[32rem] w-full rounded-md border border-ink-200 bg-ink-900 p-3 font-mono text-xs leading-relaxed text-ink-100"
    />
  );
  if (readOnly) return area;
  return (
    <ActionForm action={saveContentAction} fields={{ versionId }} label="Save and validate" variant="primary" size="md">
      {area}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={format} className="text-sm text-brand-700 underline">Format JSON</button>
        <input name="note" placeholder="Change note (optional)" className="h-9 flex-1 rounded-md border border-ink-200 px-2 text-sm" />
      </div>
      {error && <p className="text-xs text-danger-600">{error}</p>}
    </ActionForm>
  );
}
