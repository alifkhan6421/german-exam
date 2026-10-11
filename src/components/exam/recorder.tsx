"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, RotateCcw, Loader2, Volume2 } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { speakPreview } from "./speech-preview";

type Phase = "idle" | "checking" | "denied" | "prep" | "recording" | "uploading" | "done" | "error";

/**
 * Speaking task recorder: microphone check → preparation countdown → speaking countdown →
 * upload. The scripted partner/examiner lines are spoken with a labelled preview voice.
 */
export function Recorder({
  attemptId,
  itemId,
  prepSeconds,
  responseSeconds,
  partnerTurns,
  mode,
  hasRecording,
  disabled,
  onSaved,
}: {
  attemptId: string;
  itemId: string;
  prepSeconds: number;
  responseSeconds: number;
  partnerTurns: string[];
  mode: "exam" | "practice";
  hasRecording: boolean;
  disabled?: boolean;
  onSaved: (mediaId: string, durationSec: number) => void;
}) {
  const [phase, setPhase] = useState<Phase>(hasRecording ? "done" : "idle");
  const [left, setLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [turn, setTurn] = useState(0);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => () => cleanup(), []);

  function cleanup() {
    if (timer.current) clearInterval(timer.current);
    if (raf.current) cancelAnimationFrame(raf.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  function countdown(seconds: number, onZero: () => void) {
    if (timer.current) clearInterval(timer.current);
    const end = Date.now() + seconds * 1000;
    setLeft(seconds * 1000);
    timer.current = setInterval(() => {
      const ms = end - Date.now();
      setLeft(Math.max(0, ms));
      if (ms <= 0) {
        clearInterval(timer.current!);
        onZero();
      }
    }, 250);
  }

  async function begin() {
    setError(null);
    setPhase("checking");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      streamRef.current = stream;
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        setLevel(Math.min(1, data.reduce((a, b) => a + b, 0) / data.length / 80));
        raf.current = requestAnimationFrame(tick);
      };
      tick();
      if (prepSeconds > 0) {
        setPhase("prep");
        countdown(prepSeconds, startRecording);
      } else startRecording();
    } catch {
      setPhase("denied");
    }
  }

  function startRecording() {
    const stream = streamRef.current;
    if (!stream) return;
    chunks.current = [];
    const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg", "audio/mp4"].find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
    // ~48 kbit/s keeps even long answers well under serverless upload limits (about 6 KB per second).
    const rec = new MediaRecorder(stream, { ...(mime ? { mimeType: mime } : {}), audioBitsPerSecond: 48_000 });
    recRef.current = rec;
    rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
    rec.onstop = upload;
    rec.start(1000);
    startedAt.current = Date.now();
    setTurn(0);
    setPhase("recording");
    if (partnerTurns.length) speakPartner(0);
    countdown(responseSeconds, stop);
  }

  function speakPartner(i: number) {
    const line = partnerTurns[i];
    if (!line) return;
    setTurn(i);
    speakPreview([{ text: line.replace(/^\([^)]*\)\s*/, ""), gender: "female", pauseAfterMs: 0, pace: 1 }], () => {});
  }

  function stop() {
    if (recRef.current?.state === "recording") recRef.current.stop();
    if (timer.current) clearInterval(timer.current);
  }

  async function upload() {
    setPhase("uploading");
    const durationSec = Math.round((Date.now() - startedAt.current) / 1000);
    const blob = new Blob(chunks.current, { type: recRef.current?.mimeType || "audio/webm" });
    cleanup();
    setLocalUrl(URL.createObjectURL(blob));
    const form = new FormData();
    form.set("file", blob, "answer.webm");
    form.set("itemId", itemId);
    form.set("durationSec", String(durationSec));
    try {
      const res = await fetch(`/api/attempts/${attemptId}/recordings`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onSaved(data.mediaId, durationSec);
      setPhase("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setPhase("error");
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-ink-200 bg-white p-4">
      {phase === "idle" && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-ink-600">
            {prepSeconds > 0 ? `You get ${Math.round(prepSeconds / 60)} min preparation, then ` : "There is no preparation time. "}
            you have about {Math.round(responseSeconds / 60) || 1} min to speak. Recording stops automatically.
          </p>
          <button type="button" disabled={disabled} onClick={begin} className="inline-flex w-fit items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">
            <Mic className="h-4 w-4" /> Check microphone and start
          </button>
        </div>
      )}
      {phase === "checking" && <p className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Waiting for microphone permission…</p>}
      {phase === "denied" && (
        <p className="text-sm text-danger-600" role="alert">Microphone access was blocked. Allow microphone access in your browser settings and try again.
          <button type="button" className="ml-2 underline" onClick={() => setPhase("idle")}>Retry</button></p>
      )}
      {phase === "prep" && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Vorbereitung — prepare your answer</p>
          <span className="font-mono text-lg" aria-live="polite">{formatDuration(left)}</span>
          <button type="button" onClick={() => { if (timer.current) clearInterval(timer.current); startRecording(); }} className="text-sm text-brand-700 underline">Start speaking now</button>
        </div>
      )}
      {phase === "recording" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-danger-600"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-danger-600" /> Recording</span>
            <span className="font-mono text-lg" aria-live="polite">{formatDuration(left)}</span>
            <button type="button" onClick={stop} className="inline-flex items-center gap-1.5 rounded-md bg-ink-900 px-3 py-1.5 text-xs font-medium text-white"><Square className="h-3 w-3" /> Finish</button>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded bg-ink-100" aria-hidden><div className="h-full bg-success-600 transition-all" style={{ width: `${level * 100}%` }} /></div>
          {partnerTurns.length > 0 && (
            <div className="rounded-md bg-telc-50 p-3 text-sm">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-telc-700"><Volume2 className="h-3.5 w-3.5" /> Scripted exam partner (simulation)</p>
              <p className="text-ink-800">{partnerTurns[turn]}</p>
              {turn + 1 < partnerTurns.length && (
                <button type="button" onClick={() => speakPartner(turn + 1)} className="mt-2 text-xs font-medium text-telc-700 underline">Next partner turn</button>
              )}
            </div>
          )}
        </div>
      )}
      {phase === "uploading" && <p className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Saving your recording…</p>}
      {(phase === "done" || phase === "error") && (
        <div className="flex flex-col gap-2">
          {phase === "done" && <p className="text-sm font-medium text-success-600">Recording saved.</p>}
          {error && <p className="text-sm text-danger-600" role="alert">{error}</p>}
          {localUrl && <audio controls src={localUrl} className="w-full" />}
          {(mode === "practice" || phase === "error") && (
            <button type="button" disabled={disabled} onClick={() => { setLocalUrl(null); setPhase("idle"); }} className="inline-flex w-fit items-center gap-1.5 text-sm text-brand-700 underline disabled:opacity-40">
              <RotateCcw className="h-3.5 w-3.5" /> Record again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
