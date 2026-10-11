"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Play, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  versionId: string;
  scriptId: string;
  turns: { id: string; url: string | null; pauseAfterMs: number }[];
  ambienceUrl: string | null;
  environment: { ambienceLevel: number; telephoneFilter: boolean; publicAddress: boolean; reverb: number };
}

/** Safety cap: ambience never exceeds this gain relative to speech (validator also caps ambienceLevel at 0.5). */
const MAX_AMBIENCE_GAIN = 0.25;
const LEAD_IN = 0.8;
const TAIL = 1.0;

function encodeWav(buf: AudioBuffer): Blob {
  const ch = buf.numberOfChannels;
  const len = buf.length * ch * 2 + 44;
  const out = new DataView(new ArrayBuffer(len));
  const w = (o: number, s: string) => [...s].forEach((c, i) => out.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF"); out.setUint32(4, len - 8, true); w(8, "WAVE"); w(12, "fmt ");
  out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, ch, true);
  out.setUint32(24, buf.sampleRate, true); out.setUint32(28, buf.sampleRate * ch * 2, true);
  out.setUint16(32, ch * 2, true); out.setUint16(34, 16, true); w(36, "data"); out.setUint32(40, len - 44, true);
  const data = Array.from({ length: ch }, (_, c) => buf.getChannelData(c));
  let o = 44;
  for (let i = 0; i < buf.length; i++) for (let c = 0; c < ch; c++) {
    const s = Math.max(-1, Math.min(1, data[c][i]));
    out.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    o += 2;
  }
  return new Blob([out], { type: "audio/wav" });
}

function impulse(ctx: BaseAudioContext, seconds: number) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  }
  return ir;
}

export function StudioMixer({ versionId, scriptId, turns, ambienceUrl, environment }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | "mix" | "upload">(null);
  const [mixUrl, setMixUrl] = useState<string | null>(null);
  const [mixBlob, setMixBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [ambience, setAmbience] = useState(Math.min(environment.ambienceLevel, 0.5));
  const [error, setError] = useState<string | null>(null);
  const ready = turns.every((t) => t.url);

  async function mix() {
    setBusy("mix");
    setError(null);
    try {
      const decodeCtx = new AudioContext();
      const decode = async (url: string) => decodeCtx.decodeAudioData(await (await fetch(url)).arrayBuffer());
      const clips = await Promise.all(turns.map((t) => decode(t.url!)));
      const amb = ambienceUrl ? await decode(ambienceUrl) : null;
      const sr = 44100;
      const total = LEAD_IN + clips.reduce((n, c, i) => n + c.duration + turns[i].pauseAfterMs / 1000, 0) + TAIL;
      const ctx = new OfflineAudioContext(2, Math.ceil(total * sr), sr);

      // Speech bus with optional telephone band-pass / PA reverb.
      const speech = ctx.createGain();
      if (environment.telephoneFilter) {
        const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 300;
        const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3400;
        speech.connect(hp); hp.connect(lp); lp.connect(ctx.destination);
      } else {
        speech.connect(ctx.destination);
      }
      if (environment.publicAddress || environment.reverb > 0) {
        const conv = ctx.createConvolver(); conv.buffer = impulse(ctx, environment.publicAddress ? 1.8 : 0.8);
        const wet = ctx.createGain(); wet.gain.value = Math.min(0.35, environment.publicAddress ? 0.3 : environment.reverb * 0.3);
        speech.connect(conv); conv.connect(wet); wet.connect(ctx.destination);
      }

      let t = LEAD_IN;
      clips.forEach((c, i) => {
        const src = ctx.createBufferSource(); src.buffer = c; src.connect(speech); src.start(t);
        t += c.duration + turns[i].pauseAfterMs / 1000;
      });
      if (amb) {
        const src = ctx.createBufferSource(); src.buffer = amb; src.loop = true;
        const g = ctx.createGain();
        const level = Math.min(MAX_AMBIENCE_GAIN, ambience * 0.5);
        g.gain.setValueAtTime(0, 0);
        g.gain.linearRampToValueAtTime(level, 0.6);
        g.gain.setValueAtTime(level, Math.max(0.6, total - 0.8));
        g.gain.linearRampToValueAtTime(0, total);
        src.connect(g); g.connect(ctx.destination); src.start(0);
      }
      const rendered = await ctx.startRendering();
      // Normalise peaks to -1 dBFS.
      let peak = 0;
      for (let c = 0; c < rendered.numberOfChannels; c++) for (const v of rendered.getChannelData(c)) peak = Math.max(peak, Math.abs(v));
      if (peak > 0) {
        const k = 0.89 / peak;
        for (let c = 0; c < rendered.numberOfChannels; c++) { const d = rendered.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] *= k; }
      }
      const blob = encodeWav(rendered);
      if (mixUrl) URL.revokeObjectURL(mixUrl);
      setMixBlob(blob);
      setMixUrl(URL.createObjectURL(blob));
      setDuration(Math.round(rendered.duration * 10) / 10);
      await decodeCtx.close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Mixing failed");
    } finally {
      setBusy(null);
    }
  }

  async function upload(blob: Blob, provider: "studio_mix" | "upload", seconds: number) {
    setBusy("upload");
    setError(null);
    try {
      const mime = blob.type || "audio/wav";
      const meta = {
        versionId,
        scriptId,
        mime,
        durationSec: seconds,
        provider,
        production: { ...environment, ambienceGain: Math.min(MAX_AMBIENCE_GAIN, ambience * 0.5), turns: turns.length, mixedAt: new Date().toISOString() },
      };
      const post = async (body: BodyInit, json: boolean) => {
        const res = await fetch("/api/admin/audio/final", { method: "POST", body, headers: json ? { "content-type": "application/json" } : undefined });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        return data;
      };
      const prep = await post(JSON.stringify({ step: "prepare", versionId, scriptId, mime, bytes: blob.size }), true);
      if (prep.direct) {
        // Development storage: send the file through the app server.
        const form = new FormData();
        form.set("file", blob, provider === "upload" ? "upload" : "mix.wav");
        for (const [k, v] of Object.entries(meta)) form.set(k, typeof v === "object" ? JSON.stringify(v) : String(v));
        await post(form, false);
      } else {
        // Supabase: upload straight to private storage with the one-time token, then record it.
        const { createClient } = await import("@supabase/supabase-js");
        const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
        const { error } = await sb.storage.from("exam-media").uploadToSignedUrl(prep.path, prep.token, blob, { contentType: mime });
        if (error) throw new Error(`Upload to storage failed: ${error.message}`);
        await post(JSON.stringify({ step: "complete", assetId: prep.assetId, ...meta }), true);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  }

  async function uploadFile(file: File) {
    const seconds = await new Promise<number>((resolve) => {
      const a = new Audio(URL.createObjectURL(file));
      a.onloadedmetadata = () => resolve(Math.round(a.duration * 10) / 10);
      a.onerror = () => resolve(0);
    });
    await upload(file, "upload", seconds);
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span>Ambience level: {Math.round(ambience * 100)}% <span className="text-ink-500">(gain capped at {MAX_AMBIENCE_GAIN} so speech stays clear)</span></span>
        <input type="range" min={0} max={0.5} step={0.01} value={ambience} onChange={(e) => setAmbience(Number(e.target.value))} />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button onClick={mix} disabled={!ready || busy !== null}>{busy === "mix" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}Render mix</Button>
        {mixBlob && <Button variant="primary" onClick={() => upload(mixBlob, "studio_mix", duration)} disabled={busy !== null}>{busy === "upload" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}Save mix for review</Button>}
      </div>
      {!ready && <p className="text-sm text-ink-500">Generate all speech clips first.</p>}
      {mixUrl && <div className="flex flex-col gap-1"><audio controls src={mixUrl} className="w-full" /><span className="text-xs text-ink-500">{duration} s · WAV</span></div>}
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Or upload a finished recording (e.g. from a studio session)</span>
        <input type="file" accept="audio/*" disabled={busy !== null} onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])} />
      </label>
      {error && <p className="text-sm text-danger-600" role="alert">{error}</p>}
    </div>
  );
}
