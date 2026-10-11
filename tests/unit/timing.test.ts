import { describe, expect, it } from "vitest";
import { getBlueprint } from "@/domain/blueprints";
import { advance, canAnswer, canPlay, createAttemptState, pause, reconcile, remainingMs, resume, SAVE_GRACE_MS } from "@/domain/attempt/state";

const t0 = new Date("2026-10-11T10:00:00Z");
const at = (ms: number) => new Date(t0.getTime() + ms);

describe("attempt timing", () => {
  const telcB2 = getBlueprint("telc-b2")!;

  it("times telc B2 Leseverstehen and Sprachbausteine together (90 minutes)", () => {
    const s = createAttemptState({ blueprint: telcB2, mode: "exam", sectionIds: telcB2.sections.map((x) => x.id), now: t0 });
    expect(s.groups[0].sectionIds).toEqual(["leseverstehen", "sprachbausteine"]);
    expect(s.groups[0].seconds).toBe(90 * 60);
    expect(remainingMs(s, at(60_000))).toBe(89 * 60_000);
  });

  it("closes an expired group, opens the next at the deadline and rejects late saves after the grace period", () => {
    const s = createAttemptState({ blueprint: telcB2, mode: "exam", sectionIds: telcB2.sections.map((x) => x.id), now: t0 });
    const deadline = 90 * 60_000;
    const { state, events } = reconcile(s, at(deadline + 2_000));
    expect(events).toContain("expired:lv-sb");
    expect(state.currentGroup).toBe(1);
    expect(state.groups[1].startedAt).toBe(at(deadline).toISOString());
    expect(canAnswer(state, "leseverstehen", at(deadline + SAVE_GRACE_MS - 1)).ok).toBe(true);
    expect(canAnswer(state, "leseverstehen", at(deadline + SAVE_GRACE_MS + 1)).ok).toBe(false);
  });

  it("auto-submits when the last group expires, even after a long disconnect", () => {
    const a1 = getBlueprint("goethe-a1-sd1")!;
    const s = createAttemptState({ blueprint: a1, mode: "exam", sectionIds: ["hoeren"], now: t0 });
    const { state } = reconcile(s, at(10 * 3600_000));
    expect(state.status).toBe("submitted");
    expect(state.submitReason).toBe("expired");
    expect(state.reconnects).toBe(1);
  });

  it("does not reopen a closed section in exam mode", () => {
    const a1 = getBlueprint("goethe-a1-sd1")!;
    const s = advance(createAttemptState({ blueprint: a1, mode: "exam", sectionIds: ["hoeren", "lesen"], now: t0 }), at(1000));
    expect(canAnswer(s, "hoeren", at(2000))).toEqual({ ok: false, reason: "This section is closed." });
    expect(canAnswer(s, "lesen", at(2000)).ok).toBe(true);
  });

  it("freezes the countdown while a practice attempt is paused", () => {
    const a1 = getBlueprint("goethe-a1-sd1")!;
    let s = createAttemptState({ blueprint: a1, mode: "practice", sectionIds: ["lesen"], now: t0 });
    const total = s.groups[0].seconds! * 1000;
    s = pause(s, at(60_000));
    expect(remainingMs(s, at(10 * 60_000))).toBe(total - 60_000);
    s = resume(s, at(10 * 60_000));
    expect(remainingMs(s, at(10 * 60_000))).toBe(total - 60_000);
    expect(() => pause(createAttemptState({ blueprint: a1, mode: "exam", sectionIds: ["lesen"], now: t0 }), t0)).toThrow();
  });

  it("limits playback only in exam mode", () => {
    expect(canPlay({ mode: "exam", plays: 1, allowed: 1 }).ok).toBe(false);
    expect(canPlay({ mode: "exam", plays: 1, allowed: 2 }).ok).toBe(true);
    expect(canPlay({ mode: "practice", plays: 5, allowed: 1 }).ok).toBe(true);
  });
});
