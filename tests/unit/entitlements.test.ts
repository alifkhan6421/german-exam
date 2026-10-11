import { describe, expect, it } from "vitest";
import { canAccessExam, effectiveEntitlements, EntitlementsSchema, FREE_ENTITLEMENTS } from "@/domain/entitlements";

const premiumGoetheA1 = EntitlementsSchema.parse({ tracks: ["goethe-a1-sd1"], premiumExams: true, explanations: true });
const now = new Date("2026-10-11T12:00:00Z");

describe("entitlements", () => {
  it("free users can open free exams only", () => {
    const e = effectiveEntitlements([], now);
    expect(canAccessExam(e, { access_tier: "free", track_key: "telc-b2" }).ok).toBe(true);
    expect(canAccessExam(e, { access_tier: "premium", track_key: "goethe-a1-sd1" }).ok).toBe(false);
  });

  it("an active track-scoped plan unlocks only its track", () => {
    const e = effectiveEntitlements([{ status: "active", current_period_end: "2026-11-11T00:00:00Z", entitlements: premiumGoetheA1 }], now);
    expect(canAccessExam(e, { access_tier: "premium", track_key: "goethe-a1-sd1" }).ok).toBe(true);
    expect(canAccessExam(e, { access_tier: "premium", track_key: "telc-b2" }).ok).toBe(false);
  });

  it("canceled, unpaid or expired subscriptions grant nothing", () => {
    for (const status of ["canceled", "unpaid", "incomplete"]) {
      const e = effectiveEntitlements([{ status, current_period_end: "2026-11-11T00:00:00Z", entitlements: premiumGoetheA1 }], now);
      expect(e.premiumExams).toBe(false);
    }
    const expired = effectiveEntitlements([{ status: "active", current_period_end: "2026-10-01T00:00:00Z", entitlements: premiumGoetheA1 }], now);
    expect(expired.premiumExams).toBe(false);
  });

  it("keeps the free baseline quotas", () => {
    expect(effectiveEntitlements([], now).aiWritingPerMonth).toBe(FREE_ENTITLEMENTS.aiWritingPerMonth);
  });
});
