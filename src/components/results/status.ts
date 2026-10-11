import type { RubricStatus } from "@/domain/scoring/score";

export const RUBRIC_STATUS: Record<RubricStatus, { label: string; tone: "neutral" | "brand" | "success" | "warning" | "danger" }> = {
  none: { label: "Scored automatically", tone: "success" },
  unanswered: { label: "Not answered", tone: "neutral" },
  pending: { label: "Awaiting assessment", tone: "warning" },
  provisional_ai: { label: "Provisional AI score", tone: "brand" },
  human_reviewed: { label: "Reviewed by an examiner", tone: "success" },
  unscoreable: { label: "Scoring not configured", tone: "danger" },
};
