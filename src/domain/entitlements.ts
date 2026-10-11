import { z } from "zod";

/** Plan entitlements, editable by administrators. */
export const EntitlementsSchema = z.object({
  /** Track keys whose premium exams the plan unlocks, or ["*"] for all. Only meaningful with premiumExams. */
  tracks: z.array(z.string()).default(["*"]),
  premiumExams: z.boolean().default(false),
  fullSimulation: z.boolean().default(true),
  sectionPractice: z.boolean().default(true),
  explanations: z.boolean().default(false),
  /** AI writing/speaking evaluations per calendar month (fair use). 0 disables. */
  aiWritingPerMonth: z.number().int().min(0).default(0),
  aiSpeakingPerMonth: z.number().int().min(0).default(0),
  /** Attempts per exam per month in practice mode; null = unlimited. */
  practiceRetriesPerExam: z.number().int().min(0).nullable().default(null),
  progressAnalytics: z.enum(["basic", "full"]).default("basic"),
});
export type Entitlements = z.infer<typeof EntitlementsSchema>;

export const FREE_ENTITLEMENTS: Entitlements = EntitlementsSchema.parse({
  tracks: ["*"],
  premiumExams: false,
  fullSimulation: true,
  sectionPractice: true,
  explanations: false,
  aiWritingPerMonth: 1,
  aiSpeakingPerMonth: 1,
  practiceRetriesPerExam: 2,
  progressAnalytics: "basic",
});

export const ACTIVE_STATUSES = new Set(["active", "trialing"]);
/** Stripe keeps access during dunning; we follow Stripe's status, which turns to unpaid/canceled when retries fail. */
export const GRACE_STATUSES = new Set(["past_due"]);

export interface SubscriptionLike {
  status: string;
  current_period_end: string | Date | null;
  entitlements: Entitlements;
}

/** Merge the free plan with every subscription that currently grants access. */
export function effectiveEntitlements(subs: SubscriptionLike[], now: Date, base: Entitlements = FREE_ENTITLEMENTS): Entitlements {
  let e: Entitlements = { ...base, tracks: base.premiumExams ? base.tracks : [] };
  for (const s of subs) {
    const periodOk = !s.current_period_end || new Date(s.current_period_end).getTime() > now.getTime();
    if (!(ACTIVE_STATUSES.has(s.status) || GRACE_STATUSES.has(s.status)) || !periodOk) continue;
    const p = s.entitlements;
    e = {
      tracks: !p.premiumExams ? e.tracks : e.tracks.includes("*") || p.tracks.includes("*") ? ["*"] : Array.from(new Set([...e.tracks, ...p.tracks])),
      premiumExams: e.premiumExams || p.premiumExams,
      fullSimulation: e.fullSimulation || p.fullSimulation,
      sectionPractice: e.sectionPractice || p.sectionPractice,
      explanations: e.explanations || p.explanations,
      aiWritingPerMonth: Math.max(e.aiWritingPerMonth, p.aiWritingPerMonth),
      aiSpeakingPerMonth: Math.max(e.aiSpeakingPerMonth, p.aiSpeakingPerMonth),
      practiceRetriesPerExam:
        e.practiceRetriesPerExam === null || p.practiceRetriesPerExam === null ? null : Math.max(e.practiceRetriesPerExam, p.practiceRetriesPerExam),
      progressAnalytics: e.progressAnalytics === "full" || p.progressAnalytics === "full" ? "full" : "basic",
    };
  }
  return e;
}

export function canAccessExam(e: Entitlements, exam: { access_tier: string; track_key: string }): { ok: boolean; reason?: string } {
  if (exam.access_tier === "free") return { ok: true };
  if (!e.premiumExams) return { ok: false, reason: "This mock exam is part of Premium." };
  if (!e.tracks.includes("*") && !e.tracks.includes(exam.track_key)) return { ok: false, reason: "Your plan does not include this exam track." };
  return { ok: true };
}
