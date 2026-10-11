import { blueprintReadiness, type Blueprint, type BlueprintPart, type BlueprintSection, type PassRule } from "../blueprints";
import { allItems, type AnswerValue, type ExamContent, type Item } from "../exam/schema";
import { isObjective } from "../exam/validate";

export const SCORING_VERSION = "score-2026.10.1";

export interface AssessmentInput {
  itemId: string;
  source: "ai" | "human";
  /** Points awarded on the assessment's own scale. */
  total: number;
  max: number;
}

export type RubricStatus = "none" | "unanswered" | "pending" | "provisional_ai" | "human_reviewed" | "unscoreable";

export interface ItemResult {
  itemId: string;
  number: number;
  sectionId: string;
  partId: string;
  type: Item["type"];
  answered: boolean;
  /** null for rubric-scored items. */
  correct: boolean | null;
  points: number | null;
  maxPoints: number | null;
  rubricStatus?: RubricStatus;
}

export interface SectionResult {
  sectionId: string;
  titleDe: string;
  skill: BlueprintSection["skill"];
  component: BlueprintSection["component"];
  objective: { correct: number; incorrect: number; unanswered: number; points: number; max: number };
  rubric: { points: number; max: number; status: RubricStatus };
  rawPoints: number;
  rawMax: number | null;
  scaledPoints: number | null;
  scaledMax: number | null;
  /** All points determined (objective + assessed). */
  complete: boolean;
  /** Includes an AI estimate that no human has reviewed. */
  provisional: boolean;
  /** Section was not part of this attempt (section practice). */
  attempted: boolean;
}

export interface ResultSummary {
  scoringVersion: string;
  blueprintKey: string;
  blueprintVersion: string;
  items: ItemResult[];
  sections: SectionResult[];
  total: { points: number; max: number } | null;
  pass: { estimate: boolean | null; reason: string };
  grade: string | null;
}

/** Normalise free-text answers for deterministic comparison. */
export function normaliseText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFC")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[.,;:!?"'()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

export function isCorrect(item: Item, value: AnswerValue | undefined, correct: string[]): boolean {
  if (!value) return false;
  if (item.type === "short_text") {
    if (value.kind !== "text") return false;
    const given = normaliseText(value.text);
    if (!given) return false;
    return correct.some((c) => {
      const want = normaliseText(c);
      if (want === given) return true;
      // Numbers such as phone numbers or postcodes: compare digits only.
      const wd = digitsOnly(c);
      return wd.length >= 3 && wd.length === digitsOnly(value.text).length && wd === digitsOnly(value.text) && /^[\d\s/+-]+$/.test(value.text.trim());
    });
  }
  if (value.kind !== "choice") return false;
  return correct.length === 1 && correct[0] === value.optionId;
}

function itemMax(item: Item, bpPart: BlueprintPart | undefined): number | null {
  if (item.points) return item.points;
  if (isObjective(item)) return bpPart?.pointsPerItem?.value ?? 1;
  if (item.type === "writing") return bpPart?.writing?.maxRawPoints.value ?? null;
  if (item.type === "speaking") return bpPart?.speaking?.maxRawPoints.value ?? null;
  return null;
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export function scoreAttempt(args: {
  content: ExamContent;
  blueprint: Blueprint;
  answers: Record<string, AnswerValue>;
  assessments: AssessmentInput[];
  /** Section ids included in the attempt. Defaults to all. */
  sectionIds?: string[];
  blueprintConfirmed?: boolean;
}): ResultSummary {
  const { content, blueprint: bp, answers } = args;
  const included = new Set(args.sectionIds ?? content.sections.map((s) => s.sectionId));
  // Human review overrides AI; latest of each kind wins (array order = chronological).
  const byItem = new Map<string, AssessmentInput>();
  for (const a of args.assessments) {
    const prev = byItem.get(a.itemId);
    if (!prev || a.source === "human" || prev.source === "ai") byItem.set(a.itemId, a);
  }

  const items: ItemResult[] = [];
  for (const { section, part, item } of allItems(content)) {
    if (!included.has(section.sectionId)) continue;
    const bpPart = bp.sections.find((s) => s.id === section.sectionId)?.parts.find((p) => p.id === part.partId);
    const max = itemMax(item, bpPart);
    const value = answers[item.id];
    const answered =
      !!value && (value.kind === "choice" ? !!value.optionId : value.kind === "text" ? value.text.trim().length > 0 : !!value.mediaId);
    if (isObjective(item)) {
      const ok = isCorrect(item, value, content.answerKey[item.id]?.correct ?? []);
      items.push({ itemId: item.id, number: item.number, sectionId: section.sectionId, partId: part.partId, type: item.type, answered, correct: ok, points: ok ? (max ?? 1) : 0, maxPoints: max });
    } else {
      const a = byItem.get(item.id);
      let status: RubricStatus;
      let points: number | null = null;
      if (max === null) status = "unscoreable";
      else if (!answered) {
        status = "unanswered"; // nothing to assess: 0 points is deterministic
        points = 0;
      } else if (!a) status = "pending";
      else {
        status = a.source === "human" ? "human_reviewed" : "provisional_ai";
        points = a.max > 0 ? round1((a.total / a.max) * max) : 0;
      }
      items.push({ itemId: item.id, number: item.number, sectionId: section.sectionId, partId: part.partId, type: item.type, answered, correct: null, points, maxPoints: max, rubricStatus: status });
    }
  }

  const sections: SectionResult[] = [...bp.sections].sort((a, b) => a.order - b.order).map((s) => {
    const its = items.filter((i) => i.sectionId === s.id);
    const obj = its.filter((i) => i.correct !== null);
    const rub = its.filter((i) => i.correct === null);
    const objective = {
      correct: obj.filter((i) => i.correct).length,
      incorrect: obj.filter((i) => i.answered && !i.correct).length,
      unanswered: obj.filter((i) => !i.answered).length,
      points: obj.reduce((n, i) => n + (i.points ?? 0), 0),
      max: obj.reduce((n, i) => n + (i.maxPoints ?? 0), 0),
    };
    const statuses = rub.map((i) => i.rubricStatus!);
    const rubricStatus: RubricStatus =
      rub.length === 0 ? "none"
      : statuses.includes("unscoreable") ? "unscoreable"
      : statuses.includes("pending") ? "pending"
      : statuses.includes("provisional_ai") ? "provisional_ai"
      : statuses.includes("human_reviewed") ? "human_reviewed"
      : "unanswered";
    const rubric = {
      points: rub.reduce((n, i) => n + (i.points ?? 0), 0),
      max: rub.reduce((n, i) => n + (i.maxPoints ?? 0), 0),
      status: rubricStatus,
    };
    const rawPoints = round1(objective.points + rubric.points);
    const rawMax = s.rawMax.value;
    const complete = its.length > 0 && rubricStatus !== "pending" && rubricStatus !== "unscoreable";
    let scaledPoints: number | null = null;
    const scaledMax = s.scaledMax.value ?? rawMax;
    if (complete) {
      if (s.scaleFactor?.value) scaledPoints = rawPoints * s.scaleFactor.value;
      else if (rawMax && s.scaledMax.value) scaledPoints = (rawPoints * s.scaledMax.value) / rawMax;
      else scaledPoints = rawPoints;
      scaledPoints = bp.scoring.rounding.value === "round_each_section" ? Math.round(scaledPoints) : Math.round(scaledPoints * 100) / 100;
      if (scaledMax !== null) scaledPoints = Math.min(scaledPoints, scaledMax);
    }
    return {
      sectionId: s.id,
      titleDe: s.titleDe,
      skill: s.skill,
      component: s.component,
      objective,
      rubric,
      rawPoints,
      rawMax,
      scaledPoints,
      scaledMax,
      complete,
      provisional: rubricStatus === "provisional_ai",
      attempted: included.has(s.id),
    };
  });

  const attempted = sections.filter((s) => s.attempted);
  const allSectionsAttempted = attempted.length === sections.length;
  const allComplete = attempted.every((s) => s.complete);
  const readiness = blueprintReadiness(bp, args.blueprintConfirmed);
  const rule = bp.scoring.passRule.value;

  let total: ResultSummary["total"] = null;
  if (bp.scoring.reporting.value === "total" && allSectionsAttempted && allComplete && bp.scoring.totalMax.value) {
    const sum = attempted.reduce((n, s) => n + (s.scaledPoints ?? 0), 0);
    total = { points: Math.min(Math.round(sum), bp.scoring.totalMax.value), max: bp.scoring.totalMax.value };
  }

  let pass: ResultSummary["pass"];
  if (!readiness.passEstimateAllowed || !rule) {
    pass = { estimate: null, reason: "The official pass rule for this exam is not verified, so no pass estimate is shown." };
  } else if (!allComplete) {
    pass = { estimate: null, reason: "Some answers are still awaiting assessment." };
  } else {
    pass = evaluatePass(rule, sections, total, allSectionsAttempted);
  }
  if (pass.estimate !== null && attempted.some((s) => s.provisional)) {
    pass = { ...pass, reason: `${pass.reason} Includes provisional AI-assessed scores.` };
  }

  let grade: string | null = null;
  const bands = bp.scoring.gradeBands?.value;
  if (bands && total) {
    const pct = (total.points / total.max) * 100;
    grade = bands.find((b) => pct >= b.min && pct <= b.max + 0.999)?.labelDe ?? null;
  }

  return { scoringVersion: SCORING_VERSION, blueprintKey: bp.key, blueprintVersion: bp.version, items, sections, total, pass, grade };
}

function evaluatePass(rule: PassRule, sections: SectionResult[], total: ResultSummary["total"], full: boolean): ResultSummary["pass"] {
  const attempted = sections.filter((s) => s.attempted);
  const sum = (component: "written" | "oral") =>
    attempted.filter((s) => s.component === component).reduce((n, s) => n + (s.scaledPoints ?? 0), 0);
  const max = (component: "written" | "oral") =>
    attempted.filter((s) => s.component === component).reduce((n, s) => n + (s.scaledMax ?? 0), 0);
  switch (rule.kind) {
    case "per_section_min": {
      const failed = attempted.filter((s) => (s.scaledPoints ?? 0) < rule.minPerSection);
      return failed.length === 0
        ? { estimate: true, reason: `Every attempted module reached at least ${rule.minPerSection} points.` }
        : { estimate: false, reason: `Below ${rule.minPerSection} points in: ${failed.map((s) => s.titleDe).join(", ")}.` };
    }
    case "total_min":
      if (!full || !total) return { estimate: null, reason: "A pass estimate needs the full exam, including all modules." };
      return total.points >= rule.minTotal
        ? { estimate: true, reason: `${total.points} of ${total.max} points (pass mark ${rule.minTotal}).` }
        : { estimate: false, reason: `${total.points} of ${total.max} points; the pass mark is ${rule.minTotal}.` };
    case "total_and_components_min": {
      if (!full || !total) return { estimate: null, reason: "A pass estimate needs the full exam, including all modules." };
      const w = Math.round(sum("written"));
      const o = Math.round(sum("oral"));
      const ok = total.points >= rule.minTotal && w >= rule.minWritten && o >= rule.minOral;
      return {
        estimate: ok,
        reason: `Total ${total.points}/${total.max} (min ${rule.minTotal}), written ${w} (min ${rule.minWritten}), oral ${o} (min ${rule.minOral}).`,
      };
    }
    case "components_percent_min": {
      if (!full) return { estimate: null, reason: "A pass estimate needs the full exam, including all modules." };
      const wp = (sum("written") / Math.max(1, max("written"))) * 100;
      const op = (sum("oral") / Math.max(1, max("oral"))) * 100;
      const ok = wp >= rule.writtenPercent && op >= rule.oralPercent;
      return { estimate: ok, reason: `Written ${wp.toFixed(0)}% (min ${rule.writtenPercent}%), oral ${op.toFixed(0)}% (min ${rule.oralPercent}%).` };
    }
  }
}
