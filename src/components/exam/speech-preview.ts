"use client";

/**
 * Development-only fallback when no approved recording exists: reads the script with the
 * browser's German speech synthesis. Always shown to the user as a preview voice.
 */
export function speakPreview(turns: { text: string; gender: string; pauseAfterMs: number; pace: number }[], onEnd: () => void) {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
  if (!synth) {
    onEnd();
    return () => {};
  }
  synth.cancel();
  const voices = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith("de"));
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const next = (i: number) => {
    if (cancelled) return;
    if (i >= turns.length) return onEnd();
    const t = turns[i];
    const u = new SpeechSynthesisUtterance(t.text);
    u.lang = "de-DE";
    const female = voices.find((v) => /female|anna|petra|helena|katja|marlene|vicki/i.test(v.name));
    const male = voices.find((v) => /male|markus|hans|yannick|stefan|conrad/i.test(v.name) && !/female/i.test(v.name));
    u.voice = (t.gender === "female" ? female : t.gender === "male" ? male : undefined) ?? voices[i % Math.max(1, voices.length)] ?? null;
    u.pitch = t.gender === "female" ? 1.15 : t.gender === "male" ? 0.85 : 1;
    u.rate = 0.92 * t.pace;
    u.onend = () => {
      timer = setTimeout(() => next(i + 1), t.pauseAfterMs);
    };
    synth.speak(u);
  };
  next(0);
  return () => {
    cancelled = true;
    if (timer) clearTimeout(timer);
    synth.cancel();
  };
}
