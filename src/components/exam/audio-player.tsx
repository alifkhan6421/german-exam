"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, Loader2, Play } from "lucide-react";
import { api } from "./api";
import { speakPreview } from "./speech-preview";

type PlayResponse = {
  playsUsed: number;
  allowed: number | null;
  url: string | null;
  preview: { label: string; transcript: { text: string; gender: string; pauseAfterMs: number; pace: number }[] } | null;
};

export function AudioPlayer({
  attemptId,
  stimulusId,
  title,
  mode,
  allowed,
  initialPlays,
  disabled,
  onPlaybackChange,
}: {
  attemptId: string;
  stimulusId: string;
  title?: string;
  mode: "exam" | "practice";
  allowed: number | null;
  initialPlays: number;
  disabled?: boolean;
  onPlaybackChange?: (playing: boolean) => void;
}) {
  const [plays, setPlays] = useState(initialPlays);
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const [error, setError] = useState<string | null>(null);
  const [previewLabel, setPreviewLabel] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => () => {
    stopRef.current?.();
    audioRef.current?.pause();
  }, []);

  const exhausted = mode === "exam" && allowed !== null && plays >= allowed;

  async function play() {
    setError(null);
    setState("loading");
    try {
      const r = await api<PlayResponse>(`/api/attempts/${attemptId}/play`, { method: "POST", json: { stimulusId } });
      setPlays(r.playsUsed);
      setState("playing");
      onPlaybackChange?.(true);
      const done = () => {
        setState("idle");
        onPlaybackChange?.(false);
      };
      if (r.url) {
        const a = new Audio(r.url);
        audioRef.current = a;
        a.onended = done;
        a.onerror = () => {
          setError("The recording could not be played. Check your connection.");
          done();
        };
        await a.play();
      } else if (r.preview) {
        setPreviewLabel(r.preview.label);
        stopRef.current = speakPreview(r.preview.transcript, done);
      } else done();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Playback failed");
      setState("idle");
    }
  }

  const label = allowed === null ? "" : mode === "exam" ? `${plays} of ${allowed} played` : `${plays} play${plays === 1 ? "" : "s"}`;
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-ink-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-medium text-ink-800"><Headphones className="h-4 w-4 text-ink-500" aria-hidden />{title ?? "Recording"}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-500" aria-live="polite">{label}</span>
          <button
            type="button"
            onClick={play}
            disabled={disabled || exhausted || state !== "idle"}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-ink-900 px-3 text-xs font-medium text-white disabled:opacity-40"
            aria-label={`Play ${title ?? "recording"}`}
          >
            {state === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            {state === "playing" ? "Playing…" : exhausted ? "Played" : "Play"}
          </button>
        </div>
      </div>
      {mode === "exam" && state === "playing" && <p className="text-xs text-ink-500">Recordings cannot be paused or rewound in exam mode.</p>}
      {previewLabel && <p className="text-xs text-amber-700">{previewLabel}</p>}
      {error && <p className="text-xs text-danger-600" role="alert">{error}</p>}
    </div>
  );
}
