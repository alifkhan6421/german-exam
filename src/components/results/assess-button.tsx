"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssessButton({ attemptId, itemId, kind }: { attemptId: string; itemId: string; kind: "writing" | "speaking" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/attempts/${attemptId}/assess`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "AI feedback failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI feedback failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex flex-col items-end gap-1">
      <Button size="sm" variant="secondary" onClick={run} disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {busy ? (kind === "speaking" ? "Transcribing and assessing…" : "Assessing…") : "Get AI feedback"}
      </Button>
      {error && <p className="max-w-xs text-right text-xs text-danger-600" role="alert">{error}</p>}
    </div>
  );
}
