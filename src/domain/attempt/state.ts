import { sectionTimeBudgets, type Blueprint } from "../blueprints";

/**
 * Server-authoritative attempt timing.
 *
 * An attempt is a sequence of timed groups (a section, or several sections sharing one
 * countdown such as telc "Leseverstehen + Sprachbausteine"). Only the current group is
 * open. In exam mode, a group closes when its deadline passes or the student moves on,
 * and closed groups cannot be reopened. All functions are pure; callers persist the result.
 */

export type AttemptMode = "exam" | "practice";

export interface GroupState {
  groupId: string;
  sectionIds: string[];
  /** Null = untimed (practice without timer, or unknown official duration). */
  seconds: number | null;
  startedAt: string | null;
  deadlineAt: string | null;
  closedAt: string | null;
  closedReason: "advanced" | "expired" | "submitted" | null;
  /** Practice mode only: time already used before the current pause. */
  usedMsBeforePause: number;
}

export interface AttemptState {
  mode: AttemptMode;
  groups: GroupState[];
  currentGroup: number;
  status: "in_progress" | "submitted";
  pausedAt: string | null;
  submittedAt: string | null;
  submitReason: "manual" | "expired" | null;
  /** Number of times the client reconnected after a gap (for integrity review). */
  reconnects: number;
  lastSeenAt: string;
}

/** Answers arriving this long after a deadline are still accepted (network latency). */
export const SAVE_GRACE_MS = 10_000;
/** Speaking sections get the longest preparation time on top of the speaking time. */

export function createAttemptState(args: {
  blueprint: Blueprint;
  mode: AttemptMode;
  sectionIds: string[];
  /** Extra seconds per section, e.g. speaking preparation time. */
  extraSeconds?: Record<string, number>;
  timed?: boolean;
  now: Date;
}): AttemptState {
  const budgets = sectionTimeBudgets(args.blueprint).filter((g) => g.sectionIds.some((id) => args.sectionIds.includes(id)));
  const groups: GroupState[] = budgets.map((g) => {
    const extra = g.sectionIds.reduce((n, id) => n + (args.extraSeconds?.[id] ?? 0), 0);
    const timed = args.timed ?? true;
    return {
      groupId: g.groupId,
      sectionIds: g.sectionIds.filter((id) => args.sectionIds.includes(id)),
      seconds: timed && g.seconds !== null ? g.seconds + extra : null,
      startedAt: null,
      deadlineAt: null,
      closedAt: null,
      closedReason: null,
      usedMsBeforePause: 0,
    };
  });
  if (groups.length === 0) throw new Error("Attempt has no sections");
  return openGroup(
    {
      mode: args.mode,
      groups,
      currentGroup: 0,
      status: "in_progress",
      pausedAt: null,
      submittedAt: null,
      submitReason: null,
      reconnects: 0,
      lastSeenAt: args.now.toISOString(),
    },
    0,
    args.now,
  );
}

function openGroup(state: AttemptState, index: number, now: Date): AttemptState {
  const groups = state.groups.map((g, i) => {
    if (i !== index) return g;
    return {
      ...g,
      startedAt: now.toISOString(),
      deadlineAt: g.seconds === null ? null : new Date(now.getTime() + g.seconds * 1000).toISOString(),
    };
  });
  return { ...state, groups, currentGroup: index };
}

function closeGroup(state: AttemptState, index: number, at: Date, reason: GroupState["closedReason"]): AttemptState {
  return {
    ...state,
    groups: state.groups.map((g, i) => (i === index && !g.closedAt ? { ...g, closedAt: at.toISOString(), closedReason: reason } : g)),
  };
}

/**
 * Apply any deadlines that passed since the last request. When a group expires the next
 * one opens at the moment of expiry, so time does not silently accrue during a disconnect
 * beyond what the real exam would allow. The last group expiring submits the attempt.
 */
export function reconcile(state: AttemptState, now: Date): { state: AttemptState; events: string[] } {
  const events: string[] = [];
  let s = state;
  if (s.status === "submitted" || s.pausedAt) return { state: s, events };
  // Loop because several groups may have expired while the student was offline.
  for (let guard = 0; guard < s.groups.length + 1; guard++) {
    const g = s.groups[s.currentGroup];
    if (!g.deadlineAt) break;
    const deadline = new Date(g.deadlineAt);
    if (now.getTime() < deadline.getTime()) break;
    s = closeGroup(s, s.currentGroup, deadline, "expired");
    events.push(`expired:${g.groupId}`);
    if (s.currentGroup + 1 < s.groups.length) {
      s = openGroup(s, s.currentGroup + 1, deadline);
      events.push(`opened:${s.groups[s.currentGroup].groupId}`);
    } else {
      s = { ...s, status: "submitted", submittedAt: deadline.toISOString(), submitReason: "expired" };
      events.push("submitted:expired");
      break;
    }
  }
  const gap = now.getTime() - new Date(s.lastSeenAt).getTime();
  if (gap > 30_000) {
    s = { ...s, reconnects: s.reconnects + 1 };
    events.push("reconnected");
  }
  return { state: { ...s, lastSeenAt: now.toISOString() }, events };
}

export function currentSectionIds(state: AttemptState): string[] {
  return state.groups[state.currentGroup]?.sectionIds ?? [];
}

/** Whether an answer for an item in `sectionId` may be saved now. */
export function canAnswer(state: AttemptState, sectionId: string, now: Date): { ok: boolean; reason?: string } {
  if (state.status === "submitted") return { ok: false, reason: "Attempt already submitted." };
  if (state.pausedAt) return { ok: false, reason: "Attempt is paused." };
  const idx = state.groups.findIndex((g) => g.sectionIds.includes(sectionId));
  if (idx === -1) return { ok: false, reason: "Section is not part of this attempt." };
  const g = state.groups[idx];
  if (idx !== state.currentGroup) {
    // Grace: a save for the group that just expired is accepted if it arrives within the grace window.
    if (g.closedReason === "expired" && g.closedAt && now.getTime() - new Date(g.closedAt).getTime() <= SAVE_GRACE_MS) return { ok: true };
    if (state.mode === "practice" && idx < state.currentGroup) return { ok: false, reason: "Section already finished." };
    return { ok: false, reason: idx < state.currentGroup ? "This section is closed." : "This section has not started yet." };
  }
  if (g.deadlineAt && now.getTime() > new Date(g.deadlineAt).getTime() + SAVE_GRACE_MS) return { ok: false, reason: "Time is up for this section." };
  return { ok: true };
}

/** Move to the next timed group (student finished early). Submits after the last group. */
export function advance(state: AttemptState, now: Date): AttemptState {
  if (state.status === "submitted") return state;
  let s = closeGroup(state, state.currentGroup, now, "advanced");
  if (s.currentGroup + 1 < s.groups.length) s = openGroup(s, s.currentGroup + 1, now);
  else s = { ...s, status: "submitted", submittedAt: now.toISOString(), submitReason: "manual" };
  return s;
}

export function submit(state: AttemptState, now: Date): AttemptState {
  if (state.status === "submitted") return state;
  const s = closeGroup(state, state.currentGroup, now, "submitted");
  return { ...s, status: "submitted", submittedAt: now.toISOString(), submitReason: "manual" };
}

/** Practice mode only: pausing freezes the countdown. */
export function pause(state: AttemptState, now: Date): AttemptState {
  if (state.mode !== "practice") throw new Error("Pausing is only available in practice mode");
  if (state.pausedAt || state.status === "submitted") return state;
  const g = state.groups[state.currentGroup];
  const used = g.startedAt ? now.getTime() - new Date(g.startedAt).getTime() : 0;
  const groups = state.groups.map((x, i) => (i === state.currentGroup ? { ...x, usedMsBeforePause: x.usedMsBeforePause + used } : x));
  return { ...state, groups, pausedAt: now.toISOString() };
}

export function resume(state: AttemptState, now: Date): AttemptState {
  if (!state.pausedAt) return state;
  const groups = state.groups.map((g, i) => {
    if (i !== state.currentGroup || g.seconds === null) return i === state.currentGroup ? { ...g, startedAt: now.toISOString() } : g;
    const remaining = g.seconds * 1000 - g.usedMsBeforePause;
    return { ...g, startedAt: now.toISOString(), deadlineAt: new Date(now.getTime() + Math.max(0, remaining)).toISOString() };
  });
  return { ...state, groups, pausedAt: null, lastSeenAt: now.toISOString() };
}

export function remainingMs(state: AttemptState, now: Date): number | null {
  const g = state.groups[state.currentGroup];
  if (!g?.deadlineAt) return null;
  if (state.pausedAt) return g.seconds !== null ? g.seconds * 1000 - g.usedMsBeforePause : null;
  return Math.max(0, new Date(g.deadlineAt).getTime() - now.getTime());
}

/** Listening playback limit: exam mode follows the blueprint; practice allows replays after the first full play. */
export function canPlay(args: { mode: AttemptMode; plays: number; allowed: number | null }): { ok: boolean; reason?: string } {
  if (args.mode === "practice") return { ok: true };
  if (args.allowed === null) return { ok: true };
  if (args.plays >= args.allowed) {
    return { ok: false, reason: args.allowed === 1 ? "This recording is played once." : `This recording is played ${args.allowed} times.` };
  }
  return { ok: true };
}
