"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, CloudOff, Expand, Loader2, Pause, Play, Shrink, XCircle } from "lucide-react";
import type { AttemptView } from "@/server/services/attempts";
import type { AnswerValue, Item, Option, Part, Stimulus } from "@/domain/exam/schema";
import { cn, formatDuration } from "@/lib/utils";
import { api, ApiError } from "./api";
import { AudioPlayer } from "./audio-player";
import { Recorder } from "./recorder";
import { TextStimulus } from "./text-stimulus";

type SaveState = "saving" | "saved" | "error" | "locked";
type CheckResult = { correct: boolean; correctAnswers: string[]; explanation: string | null; evidence: string | null; explanationsLocked: boolean };

const OBJECTIVE = new Set(["mc", "true_false", "ab", "matching", "gap_select", "short_text"]);

function isAnswered(v: AnswerValue | undefined) {
  if (!v) return false;
  if (v.kind === "choice") return !!v.optionId;
  if (v.kind === "text") return v.text.trim().length > 0;
  return !!v.mediaId;
}

function wordCount(s: string) {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

export function Simulator({ initial, preview = false }: { initial: AttemptView; preview?: boolean }) {
  const router = useRouter();
  const [view, setView] = useState(initial);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(initial.answers);
  const [saves, setSaves] = useState<Record<string, SaveState>>({});
  const [offset, setOffset] = useState(() => new Date(initial.serverNow).getTime() - Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [active, setActive] = useState<string | null>(null);
  const [tab, setTab] = useState<"paper" | "answers">("paper");
  const [confirm, setConfirm] = useState<null | "advance" | "submit">(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [online, setOnline] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [checks, setChecks] = useState<Record<string, CheckResult>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const pendingKey = `gep:pending:${initial.id}`;
  const warned = useRef<Set<string>>(new Set());

  const exam = view.mode === "exam";
  const group = view.state.groups[view.state.currentGroup];
  const isLastGroup = view.state.currentGroup === view.state.groups.length - 1;
  const deadline = group?.deadlineAt ? new Date(group.deadlineAt).getTime() : null;
  const remaining = view.state.pausedAt
    ? view.remainingMs
    : deadline !== null
      ? Math.max(0, deadline - (now + offset))
      : null;

  const currentSections = useMemo(
    () => view.content.sections.filter((s) => view.currentSectionIds.includes(s.sectionId)),
    [view.content.sections, view.currentSectionIds],
  );
  const currentItems = useMemo(() => currentSections.flatMap((s) => s.parts.flatMap((p) => p.items)), [currentSections]);
  const answeredCount = currentItems.filter((i) => isAnswered(answers[i.id])).length;
  const sectionMeta = (id: string) => view.sections.find((s) => s.id === id);

  /* ------------------------------ server sync ------------------------------ */

  const refresh = useCallback(async () => {
    if (preview) return;
    try {
      const v = await api<AttemptView>(`/api/attempts/${view.id}`);
      setOffset(new Date(v.serverNow).getTime() - Date.now());
      setView(v);
      setAnswers((a) => ({ ...v.answers, ...pickPending(a) }));
      if (v.status === "submitted" && !preview) router.replace(`/attempts/${v.id}/results`);
      return v;
    } catch {
      setOnline(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.id, preview, router]);

  function pickPending(local: Record<string, AnswerValue>) {
    try {
      const pending = JSON.parse(localStorage.getItem(pendingKey) ?? "{}") as Record<string, AnswerValue>;
      return Object.fromEntries(Object.keys(pending).map((k) => [k, local[k] ?? pending[k]]));
    } catch {
      return {};
    }
  }

  const persist = useCallback(
    async (itemId: string, value: AnswerValue | null) => {
      if (preview) return;
      setSaves((s) => ({ ...s, [itemId]: "saving" }));
      try {
        if (value === null) await api(`/api/attempts/${view.id}/answers?itemId=${encodeURIComponent(itemId)}`, { method: "DELETE" });
        else await api(`/api/attempts/${view.id}/answers`, { method: "PUT", json: { itemId, value } });
        setSaves((s) => ({ ...s, [itemId]: "saved" }));
        setOnline(true);
        const pending = JSON.parse(localStorage.getItem(pendingKey) ?? "{}");
        delete pending[itemId];
        localStorage.setItem(pendingKey, JSON.stringify(pending));
      } catch (e) {
        if (e instanceof ApiError && e.status === 409) {
          setSaves((s) => ({ ...s, [itemId]: "locked" }));
          setNotice(e.message);
          void refresh();
        } else {
          setSaves((s) => ({ ...s, [itemId]: "error" }));
          setOnline(false);
        }
      }
    },
    [view.id, pendingKey, refresh, preview],
  );

  function setAnswer(itemId: string, value: AnswerValue | null, debounceMs = 0) {
    setAnswers((a) => {
      const next = { ...a };
      if (value === null) delete next[itemId];
      else next[itemId] = value;
      return next;
    });
    if (preview) return;
    if (value) {
      const pending = JSON.parse(localStorage.getItem(pendingKey) ?? "{}");
      pending[itemId] = value;
      localStorage.setItem(pendingKey, JSON.stringify(pending));
    }
    clearTimeout(timers.current[itemId]);
    timers.current[itemId] = setTimeout(() => void persist(itemId, value), debounceMs);
  }

  // Retry unsaved answers when the connection returns, and periodically.
  useEffect(() => {
    if (preview) return;
    const flush = async () => {
      const pending = JSON.parse(localStorage.getItem(pendingKey) ?? "{}") as Record<string, AnswerValue>;
      for (const [itemId, value] of Object.entries(pending)) await persist(itemId, value);
    };
    const onOnline = () => {
      setOnline(true);
      void refresh().then(flush);
    };
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    const id = setInterval(() => {
      if (Object.values(saves).includes("error")) void flush();
    }, 5000);
    void flush();
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      clearInterval(id);
    };
  }, [persist, refresh, pendingKey, saves, preview]);

  // Clock tick; resync with the server on expiry and every minute.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    const sync = setInterval(() => void refresh(), 60_000);
    return () => {
      clearInterval(id);
      clearInterval(sync);
    };
  }, [refresh]);

  useEffect(() => {
    if (remaining === null || preview) return;
    for (const [key, ms, msg] of [
      ["5", 5 * 60_000, "5 minutes left in this part of the exam."],
      ["1", 60_000, "1 minute left. Your answers are saved automatically."],
    ] as const) {
      const k = `${view.state.currentGroup}:${key}`;
      if (remaining <= ms && remaining > 0 && !warned.current.has(k)) {
        warned.current.add(k);
        setNotice(msg);
      }
    }
    if (remaining === 0) {
      const k = `${view.state.currentGroup}:expired`;
      if (!warned.current.has(k)) {
        warned.current.add(k);
        setNotice(`Time is up for ${view.currentSectionIds.map((id) => sectionMeta(id)?.titleDe).join(" & ")}. Your answers were saved.`);
        void refresh();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, view.state.currentGroup]);

  // Warn before leaving with unsaved answers.
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (Object.values(saves).some((s) => s === "saving" || s === "error")) e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [saves]);

  useEffect(() => {
    const h = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  /* ------------------------------ actions ------------------------------ */

  async function doAdvance() {
    setBusy(true);
    try {
      if (preview) {
        setView((v) => {
          const next = Math.min(v.state.currentGroup + 1, v.state.groups.length - 1);
          return { ...v, state: { ...v.state, currentGroup: next }, currentSectionIds: v.state.groups[next].sectionIds };
        });
      } else {
        await api(`/api/attempts/${view.id}/advance`, { method: "POST" });
        await refresh();
      }
      setConfirm(null);
      window.scrollTo({ top: 0 });
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not continue.");
    } finally {
      setBusy(false);
    }
  }

  async function doSubmit() {
    setBusy(true);
    try {
      await api(`/api/attempts/${view.id}/submit`, { method: "POST" });
      localStorage.removeItem(pendingKey);
      router.replace(`/attempts/${view.id}/results`);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not submit.");
      setBusy(false);
    }
  }

  async function togglePause() {
    try {
      await api(`/api/attempts/${view.id}/pause`, { method: "POST", json: { paused: !view.state.pausedAt } });
      await refresh();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not pause.");
    }
  }

  async function check(itemId: string) {
    try {
      const r = await api<CheckResult>(`/api/attempts/${view.id}/check`, { method: "POST", json: { itemId } });
      setChecks((c) => ({ ...c, [itemId]: r }));
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not check the answer.");
    }
  }

  function goTo(itemId: string) {
    setActive(itemId);
    setTab("paper");
    requestAnimationFrame(() => {
      document.getElementById(`q-${itemId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      document.getElementById(`a-${itemId}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  const activeIndex = currentItems.findIndex((i) => i.id === active);
  const step = (d: number) => {
    const next = currentItems[Math.max(0, Math.min(currentItems.length - 1, (activeIndex < 0 ? 0 : activeIndex) + d))];
    if (next) goTo(next.id);
  };

  const pendingSaves = Object.values(saves).filter((s) => s === "saving").length;
  const failedSaves = Object.values(saves).filter((s) => s === "error").length;
  const lowTime = remaining !== null && remaining <= 5 * 60_000;
  const veryLowTime = remaining !== null && remaining <= 60_000;
  const sectionTitle = view.currentSectionIds.map((id) => sectionMeta(id)?.titleDe).join(" · ");
  const writingOrSpeaking = currentItems.some((i) => i.type === "writing" || i.type === "speaking");

  /* ------------------------------ render ------------------------------ */

  return (
    <div className="flex h-dvh flex-col bg-ink-100">
      {/* Top examination bar */}
      <header className="z-20 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink-800 bg-ink-900 px-3 py-2 text-white sm:px-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-xs text-ink-300">{view.examTitle}{preview ? " · Admin preview" : ""}{!exam ? " · Practice" : ""}</span>
          <span className="truncate text-sm font-semibold">{sectionTitle}</span>
        </div>
        <ol className="hidden items-center gap-1 text-xs md:flex" aria-label="Sections">
          {view.state.groups.map((g, i) => (
            <li key={g.groupId} className={cn("rounded px-2 py-1", i === view.state.currentGroup ? "bg-white text-ink-900" : g.closedAt ? "text-ink-400 line-through" : "text-ink-300")}>
              {g.sectionIds.map((id) => sectionMeta(id)?.titleDe).join(" + ")}
            </li>
          ))}
        </ol>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-ink-300 sm:inline" aria-live="polite">{answeredCount}/{currentItems.length} answered</span>
          {remaining !== null && (
            <span
              role="timer"
              aria-label="Time remaining"
              className={cn("rounded-md px-2.5 py-1 font-mono text-base tabular-nums", veryLowTime ? "bg-danger-600" : lowTime ? "bg-warning-600" : "bg-ink-800")}
            >
              {view.state.pausedAt ? "Paused" : formatDuration(remaining)}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-ink-300" aria-live="polite">
            {!online || failedSaves ? <><CloudOff className="h-3.5 w-3.5 text-amber-300" /> Offline — retrying</> : pendingSaves ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving</> : <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> Saved</>}
          </span>
          {!exam && !preview && (
            <button type="button" onClick={togglePause} className="rounded-md p-1.5 hover:bg-ink-800" aria-label={view.state.pausedAt ? "Resume" : "Pause"}>
              {view.state.pausedAt ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => (fullscreen ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {})}
            className="hidden rounded-md p-1.5 hover:bg-ink-800 sm:block"
            aria-label={fullscreen ? "Exit full screen" : "Full screen"}
          >
            {fullscreen ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          </button>
          {isLastGroup ? (
            <button type="button" disabled={preview || busy} onClick={() => setConfirm("submit")} className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-ink-900 hover:bg-emerald-400 disabled:opacity-50">
              Submit
            </button>
          ) : (
            <button type="button" disabled={busy} onClick={() => setConfirm("advance")} className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-ink-900 hover:bg-ink-100 disabled:opacity-50">
              Next section
            </button>
          )}
        </div>
      </header>

      {/* Question navigation */}
      <nav className="flex items-center gap-2 overflow-x-auto border-b border-ink-200 bg-white px-3 py-1.5" aria-label="Questions">
        <button type="button" onClick={() => step(-1)} className="rounded p-1 text-ink-500 hover:bg-ink-100" aria-label="Previous question"><ChevronLeft className="h-4 w-4" /></button>
        {currentItems.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => goTo(i.id)}
            aria-label={`Question ${i.number}${isAnswered(answers[i.id]) ? ", answered" : ", unanswered"}`}
            aria-current={active === i.id}
            className={cn(
              "h-7 min-w-7 rounded px-1.5 text-xs font-medium ring-1 ring-inset",
              isAnswered(answers[i.id]) ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-ink-700 ring-ink-200",
              active === i.id && "outline-2 outline-offset-1 outline-amber-500",
            )}
          >
            {i.number}
          </button>
        ))}
        <button type="button" onClick={() => step(1)} className="rounded p-1 text-ink-500 hover:bg-ink-100" aria-label="Next question"><ChevronRight className="h-4 w-4" /></button>
      </nav>

      {notice && (
        <div role="alert" className="flex items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" />{notice}</span>
          <button type="button" className="text-xs underline" onClick={() => setNotice(null)}>Dismiss</button>
        </div>
      )}
      {view.devPreviewAudio && currentSections.some((s) => sectionMeta(s.sectionId)?.skill === "listening") && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-xs text-amber-900">
          Development build: recordings are read by your browser&apos;s preview voice, not the produced exam audio.
        </div>
      )}

      {/* Mobile switcher */}
      <div className="flex border-b border-ink-200 bg-white lg:hidden" role="tablist">
        {(["paper", "answers"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} type="button" onClick={() => setTab(t)} className={cn("flex-1 py-2 text-sm font-medium", tab === t ? "border-b-2 border-brand-600 text-brand-700" : "text-ink-500")}>
            {t === "paper" ? "Exam paper" : `Answer sheet (${answeredCount}/${currentItems.length})`}
          </button>
        ))}
      </div>

      {view.state.pausedAt ? (
        <div className="grid flex-1 place-items-center p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <p className="text-lg font-semibold">Practice paused</p>
            <p className="text-sm text-ink-500">The paper is hidden while the timer is stopped.</p>
            <button type="button" onClick={togglePause} className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white">Resume</button>
          </div>
        </div>
      ) : (
        <div className={cn("grid min-h-0 flex-1 gap-0 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,1fr)]", writingOrSpeaking && "lg:grid-cols-[minmax(0,1fr)_minmax(420px,1fr)]")}>
          {/* Left: examination paper */}
          <section aria-label="Exam paper" className={cn("paper min-h-0 overflow-y-auto border-r border-ink-200 px-4 py-6 sm:px-8", tab !== "paper" && "hidden lg:block")}>
            <div className="mx-auto flex max-w-3xl flex-col gap-10">
              {currentSections.map((s) => (
                <div key={s.sectionId} className="flex flex-col gap-8">
                  <h2 className="border-b-2 border-ink-900 pb-1 text-2xl font-bold tracking-tight">{sectionMeta(s.sectionId)?.titleDe}</h2>
                  {s.parts.map((p) => (
                    <PaperPart
                      key={p.partId}
                      part={p}
                      title={sectionMeta(s.sectionId)?.parts.find((x) => x.id === p.partId)?.titleDe ?? p.partId}
                      listening={sectionMeta(s.sectionId)?.skill === "listening"}
                      allowed={sectionMeta(s.sectionId)?.parts.find((x) => x.id === p.partId)?.playbacks ?? null}
                      view={view}
                      active={active}
                      onSelect={(id) => setActive(id)}
                      preview={preview}
                    />
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Right: answer sheet */}
          <section aria-label="Answer sheet" className={cn("min-h-0 overflow-y-auto bg-white px-4 py-6 sm:px-6", tab !== "answers" && "hidden lg:block")}>
            <div className="mx-auto flex max-w-xl flex-col gap-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Antwortbogen</h2>
              {currentSections.map((s) =>
                s.parts.map((p) => (
                  <fieldset key={p.partId} className="flex flex-col gap-2">
                    <legend className="mb-2 text-sm font-semibold text-ink-800">{sectionMeta(s.sectionId)?.parts.find((x) => x.id === p.partId)?.titleDe}</legend>
                    {p.items.map((item) => (
                      <AnswerRow
                        key={item.id}
                        item={item}
                        part={p}
                        value={answers[item.id]}
                        save={saves[item.id]}
                        active={active === item.id}
                        onFocus={() => setActive(item.id)}
                        onNumber={() => goTo(item.id)}
                        onChange={(v, debounce) => setAnswer(item.id, v, debounce)}
                        view={view}
                        locked={view.checkedItems.includes(item.id) || !!checks[item.id]}
                        check={!exam && !preview && OBJECTIVE.has(item.type) ? () => check(item.id) : undefined}
                        checkResult={checks[item.id]}
                        preview={preview}
                      />
                    ))}
                  </fieldset>
                )),
              )}
              <div className="sticky bottom-0 -mx-4 border-t border-ink-100 bg-white px-4 py-3 sm:-mx-6 sm:px-6">
                {isLastGroup ? (
                  <button type="button" disabled={preview || busy} onClick={() => setConfirm("submit")} className="w-full rounded-lg bg-success-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Submit {exam ? "exam" : "practice"}</button>
                ) : (
                  <button type="button" disabled={busy} onClick={() => setConfirm("advance")} className="w-full rounded-lg bg-ink-900 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Finish {sectionTitle} and continue</button>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {confirm && (
        <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="fixed inset-0 z-50 grid place-items-center bg-ink-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 id="confirm-title" className="text-lg font-semibold">{confirm === "submit" ? `Submit your ${exam ? "exam" : "practice"}?` : `Finish ${sectionTitle}?`}</h2>
            <p className="mt-2 text-sm text-ink-600">
              {currentItems.length - answeredCount > 0 ? `You have ${currentItems.length - answeredCount} unanswered question${currentItems.length - answeredCount === 1 ? "" : "s"} in this part. ` : "All questions in this part are answered. "}
              {confirm === "submit" ? "After submitting you cannot change any answers." : exam ? "You cannot return to this section after continuing." : "You will move on to the next section."}
            </p>
            {pendingSaves > 0 && <p className="mt-2 text-sm text-amber-700">Some answers are still saving…</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirm(null)} className="rounded-md px-4 py-2 text-sm ring-1 ring-ink-200">Back to the exam</button>
              <button type="button" disabled={busy || pendingSaves > 0} onClick={confirm === "submit" ? doSubmit : doAdvance} className="rounded-md bg-ink-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                {busy ? "Please wait…" : confirm === "submit" ? "Submit" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================================= */
/* Paper                                                                              */
/* ================================================================================= */

function StimulusView({ st, view, listening, allowed, preview }: { st: Stimulus; view: AttemptView; listening: boolean; allowed: number | null; preview: boolean }) {
  if (st.kind === "audio") {
    return (
      <AudioPlayer
        attemptId={view.id}
        stimulusId={st.id}
        title={st.title}
        mode={view.mode}
        allowed={listening ? allowed : null}
        initialPlays={view.playCounts[st.id] ?? 0}
        disabled={preview}
      />
    );
  }
  return <TextStimulus st={st} />;
}

function PaperPart({
  part,
  title,
  listening,
  allowed,
  view,
  active,
  onSelect,
  preview,
}: {
  part: Part;
  title: string;
  listening: boolean;
  allowed: number | null;
  view: AttemptView;
  active: string | null;
  onSelect: (id: string) => void;
  preview: boolean;
}) {
  const refCount = new Map<string, number>();
  for (const i of part.items) for (const id of i.stimulusIds) refCount.set(id, (refCount.get(id) ?? 0) + 1);
  const exampleIds = new Set(part.example?.stimulusIds ?? []);
  const shared = part.stimuli.filter((s) => !exampleIds.has(s.id) && (refCount.get(s.id) ?? 0) !== 1);
  const own = (item: Item) => item.stimulusIds.map((id) => part.stimuli.find((s) => s.id === id)).filter((s): s is Stimulus => !!s && refCount.get(s.id) === 1);
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="rounded-md bg-ink-900/[0.04] p-3 text-[15px] leading-relaxed text-ink-800">{part.instructionsDe}</p>
      {part.example && (
        <div className="flex flex-col gap-2 rounded-lg border border-dashed border-ink-300 p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">Beispiel</span>
          {part.example.stimulusIds.map((id) => part.stimuli.find((s) => s.id === id)).filter(Boolean).map((st) => (
            <StimulusView key={st!.id} st={st!} view={view} listening={listening} allowed={allowed} preview={preview} />
          ))}
          <p className="font-medium">0 &nbsp; {part.example.prompt}</p>
          {part.example.options && (
            <p className="flex flex-wrap gap-3 text-sm">
              {part.example.options.map((o) => (
                <span key={o.id} className={cn("rounded px-2 py-0.5", o.id === part.example!.answer ? "bg-ink-900 text-white" : "ring-1 ring-ink-200")}>{o.label}{o.text !== o.label ? ` ${o.text}` : ""}</span>
              ))}
            </p>
          )}
        </div>
      )}
      {shared.length > 0 && (
        <div className={cn("grid gap-3", shared.length > 1 && shared.every((s) => s.kind === "notice" || s.kind === "ad" || s.kind === "card") && "sm:grid-cols-2")}>
          {shared.map((st) => <StimulusView key={st.id} st={st} view={view} listening={listening} allowed={allowed} preview={preview} />)}
        </div>
      )}
      {part.optionPool && (
        <div className="rounded-lg border border-paper-line bg-white p-3">
          <ul className="grid gap-1 text-sm sm:grid-cols-2">
            {part.optionPool.map((o) => <li key={o.id}><strong>{o.label}</strong> {o.text}</li>)}
          </ul>
        </div>
      )}
      <ol className="flex flex-col gap-5">
        {part.items.map((item) => {
          const mine = own(item);
          return (
            <li
              key={item.id}
              id={`q-${item.id}`}
              onClick={() => onSelect(item.id)}
              className={cn("scroll-mt-24 rounded-lg p-2 transition-colors", active === item.id && "bg-amber-50 ring-1 ring-amber-300")}
            >
              {mine.length > 0 && (
                <div className={cn("mb-2 grid gap-3", mine.length === 2 && mine.every((s) => s.kind === "ad") && "sm:grid-cols-2")}>
                  {mine.map((st) => <StimulusView key={st.id} st={st} view={view} listening={listening} allowed={allowed} preview={preview} />)}
                </div>
              )}
              {item.type === "writing" && item.writing ? (
                <div className="flex flex-col gap-2">
                  <p className="font-semibold">{item.prompt}</p>
                  <p>{item.writing.taskDe}</p>
                  {item.writing.leitpunkte.length > 0 && <ul className="list-disc pl-5">{item.writing.leitpunkte.map((l) => <li key={l}>{l}</li>)}</ul>}
                </div>
              ) : item.type === "speaking" && item.speaking ? (
                <div className="flex flex-col gap-2">
                  <p className="font-semibold">{item.prompt}</p>
                  <p>{item.speaking.taskDe}</p>
                  {item.speaking.cards.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {item.speaking.cards.map((c, i) => (
                        <div key={i} className="rounded-lg border-2 border-dashed border-telc-600/40 bg-white p-3 text-center"><p className="text-xs uppercase text-ink-500">{c.title}</p><p className="text-lg font-semibold">{c.body}</p></div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="flex gap-3 text-[15px]">
                  <span className="font-semibold tabular-nums">{item.number}</span>
                  <span className="flex flex-col gap-1.5">
                    <span>{item.prompt}{item.fieldLabel && !item.prompt ? item.fieldLabel : ""}</span>
                    {item.options && item.type !== "true_false" && item.type !== "ab" && (
                      <span className="flex flex-col gap-0.5 text-ink-700">{item.options.map((o) => <span key={o.id}><strong>{o.label}</strong>&nbsp; {o.text}</span>)}</span>
                    )}
                  </span>
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ================================================================================= */
/* Answer sheet                                                                       */
/* ================================================================================= */

function AnswerRow({
  item,
  part,
  value,
  save,
  active,
  onFocus,
  onNumber,
  onChange,
  view,
  locked,
  check,
  checkResult,
  preview,
}: {
  item: Item;
  part: Part;
  value: AnswerValue | undefined;
  save: SaveState | undefined;
  active: boolean;
  onFocus: () => void;
  onNumber: () => void;
  onChange: (v: AnswerValue | null, debounceMs?: number) => void;
  view: AttemptView;
  locked: boolean;
  check?: () => void;
  checkResult?: CheckResult;
  preview: boolean;
}) {
  const options: Option[] = item.options ?? part.optionPool ?? [];
  const chosen = value?.kind === "choice" ? value.optionId : undefined;
  const disabled = locked;
  return (
    <div id={`a-${item.id}`} onFocusCapture={onFocus} className={cn("flex flex-col gap-2 rounded-lg border p-2.5", active ? "border-amber-400 bg-amber-50/60" : "border-ink-100")}>
      <div className="flex items-start gap-3">
        <button type="button" onClick={onNumber} className="mt-0.5 h-7 min-w-7 rounded bg-ink-100 px-1.5 text-xs font-semibold text-ink-800 hover:bg-ink-200" aria-label={`Show question ${item.number} on the paper`}>
          {item.number}
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {(item.type === "mc" || item.type === "true_false" || item.type === "ab") && (
            <div role="radiogroup" aria-label={`Question ${item.number}`} className="flex flex-wrap gap-2">
              {options.map((o) => (
                <label key={o.id} className={cn("flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm ring-1 ring-inset", chosen === o.id ? "bg-brand-600 text-white ring-brand-600" : "bg-white ring-ink-200 hover:ring-ink-400", disabled && "cursor-default opacity-80")}>
                  <input type="radio" className="sr-only" name={`ans-${item.id}`} value={o.id} checked={chosen === o.id} disabled={disabled} onChange={() => onChange({ kind: "choice", optionId: o.id })} />
                  <span className="font-semibold">{o.label}</span>
                  {item.type === "mc" && <span className="max-w-[16rem] truncate opacity-90">{o.text}</span>}
                </label>
              ))}
              {chosen && !disabled && <button type="button" onClick={() => onChange(null)} className="text-xs text-ink-500 underline">clear</button>}
            </div>
          )}
          {(item.type === "matching" || item.type === "gap_select") && (
            <select
              aria-label={`Answer for question ${item.number}`}
              value={chosen ?? ""}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value ? { kind: "choice", optionId: e.target.value } : null)}
              className="h-9 rounded-md border border-ink-200 bg-white px-2 text-sm"
            >
              <option value="">—</option>
              {options.map((o) => <option key={o.id} value={o.id}>{o.label}{o.text && o.text !== o.label ? ` — ${o.text.slice(0, 60)}` : ""}</option>)}
            </select>
          )}
          {item.type === "short_text" && (
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-ink-600">{item.fieldLabel ?? item.prompt}</span>
              <input
                className="h-9 rounded-md border border-ink-200 px-2"
                value={value?.kind === "text" ? value.text : ""}
                disabled={disabled}
                autoComplete="off"
                spellCheck={false}
                onChange={(e) => onChange(e.target.value ? { kind: "text", text: e.target.value } : null, 700)}
              />
            </label>
          )}
          {item.type === "writing" && (
            <WritingEditor item={item} value={value?.kind === "text" ? value.text : ""} onChange={(t) => onChange(t ? { kind: "text", text: t } : null, 900)} />
          )}
          {item.type === "speaking" && item.speaking && (
            <Recorder
              attemptId={view.id}
              itemId={item.id}
              prepSeconds={item.speaking.prepSeconds}
              responseSeconds={item.speaking.responseSeconds}
              partnerTurns={item.speaking.partnerTurns}
              mode={view.mode}
              hasRecording={value?.kind === "recording"}
              disabled={preview}
              onSaved={(mediaId, durationSec) => onChange({ kind: "recording", mediaId, durationSec })}
            />
          )}
          {check && value && !checkResult && !locked && (
            <button type="button" onClick={check} className="w-fit text-xs font-medium text-brand-700 underline">Check answer</button>
          )}
          {checkResult && (
            <div className={cn("rounded-md p-2 text-sm", checkResult.correct ? "bg-success-50 text-green-900" : "bg-danger-50 text-red-900")}>
              <p className="flex items-center gap-1.5 font-medium">{checkResult.correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}{checkResult.correct ? "Correct" : `Not quite — correct: ${checkResult.correctAnswers.map((c) => options.find((o) => o.id === c)?.label ?? c).join(" / ")}`}</p>
              {checkResult.explanation && <p className="mt-1">{checkResult.explanation}</p>}
              {checkResult.explanationsLocked && <p className="mt-1 text-xs opacity-80">Explanations are included in Premium.</p>}
            </div>
          )}
        </div>
        <span className="mt-1.5 w-3 shrink-0" aria-hidden>
          {save === "saving" ? <Loader2 className="h-3 w-3 animate-spin text-ink-400" /> : save === "error" ? <CloudOff className="h-3 w-3 text-amber-600" /> : null}
        </span>
      </div>
    </div>
  );
}

function WritingEditor({ item, value, onChange }: { item: Item; value: string; onChange: (t: string) => void }) {
  const [text, setText] = useState(value);
  const words = wordCount(text);
  const target = item.writing?.minWords ?? item.writing?.approxWords;
  const isMin = !!item.writing?.minWords;
  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        aria-label={`Your text for task ${item.number}`}
        className="min-h-64 w-full resize-y rounded-md border border-ink-200 bg-paper p-3 font-serif text-[15px] leading-7 focus:border-brand-500 focus:outline-none"
        value={text}
        lang="de"
        spellCheck={false}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value);
        }}
      />
      <div className="flex justify-between text-xs text-ink-500">
        <span>Spell check is off, as in the exam.</span>
        <span className={cn(target && (isMin ? words < target : words < target * 0.7) && "text-amber-700")}>
          {words} words{target ? ` · ${isMin ? "minimum" : "about"} ${target}` : ""}
        </span>
      </div>
    </div>
  );
}
