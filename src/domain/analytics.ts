import { getBlueprint, type Skill } from "./blueprints";
import type { ResultSummary } from "./scoring/score";

export interface AttemptForStats {
  id: string;
  title: string;
  trackKey: string;
  startedAt: string;
  submittedAt: string | null;
  result: ResultSummary | null;
}

export const SKILL_LABELS: Record<Skill, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
  language_elements: "Language elements",
};

/** Percentage per completed section, oldest first, for trend charts. */
export function skillTimeline(attempts: AttemptForStats[]) {
  const points: { date: string; attemptId: string; skill: Skill; percent: number; provisional: boolean }[] = [];
  for (const a of [...attempts].filter((x) => x.result).sort((x, y) => (x.submittedAt ?? x.startedAt).localeCompare(y.submittedAt ?? y.startedAt))) {
    for (const s of a.result!.sections) {
      if (!s.attempted || !s.complete || s.scaledPoints === null || !s.scaledMax) continue;
      points.push({ date: a.submittedAt ?? a.startedAt, attemptId: a.id, skill: s.skill, percent: Math.round((s.scaledPoints / s.scaledMax) * 100), provisional: s.provisional });
    }
  }
  return points;
}

export function skillAverages(attempts: AttemptForStats[]) {
  const t = skillTimeline(attempts);
  const by = new Map<Skill, number[]>();
  for (const p of t) by.set(p.skill, [...(by.get(p.skill) ?? []), p.percent]);
  return [...by.entries()].map(([skill, values]) => ({
    skill,
    label: SKILL_LABELS[skill],
    average: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    latest: values[values.length - 1],
    count: values.length,
  }));
}

export function averageScore(attempts: AttemptForStats[]): number | null {
  const t = skillTimeline(attempts);
  if (!t.length) return null;
  return Math.round(t.reduce((n, p) => n + p.percent, 0) / t.length);
}

/** Accuracy per blueprint part on objective items, used for targeted recommendations. */
export function partAccuracy(attempts: AttemptForStats[]) {
  const acc = new Map<string, { trackKey: string; sectionId: string; partId: string; correct: number; total: number }>();
  for (const a of attempts) {
    if (!a.result) continue;
    for (const i of a.result.items) {
      if (i.correct === null) continue;
      const key = `${a.trackKey}:${i.partId}`;
      const cur = acc.get(key) ?? { trackKey: a.trackKey, sectionId: i.sectionId, partId: i.partId, correct: 0, total: 0 };
      cur.total++;
      if (i.correct) cur.correct++;
      acc.set(key, cur);
    }
  }
  return [...acc.values()].map((v) => ({ ...v, percent: Math.round((v.correct / v.total) * 100) }));
}

export function recommendations(attempts: AttemptForStats[]): string[] {
  const parts = partAccuracy(attempts).filter((p) => p.total >= 3);
  if (parts.length === 0) return [];
  const out: string[] = [];
  const skills = skillAverages(attempts).sort((a, b) => b.average - a.average);
  const weak = [...parts].sort((a, b) => a.percent - b.percent).filter((p) => p.percent < 70).slice(0, 2);
  const describe = (p: (typeof parts)[number]) => {
    const bp = getBlueprint(p.trackKey);
    const part = bp?.sections.find((s) => s.id === p.sectionId)?.parts.find((x) => x.id === p.partId);
    return part ? `${part.titleDe} (${part.descriptionEn.replace(/\.$/, "").toLowerCase()})` : p.partId;
  };
  if (skills.length && weak.length) {
    const best = skills[0];
    out.push(`You performed well in ${best.label.toLowerCase()} (${best.average}%), but you should practise ${weak.map(describe).join(" and ")}.`);
  } else if (weak.length) {
    out.push(`Focus next on ${weak.map(describe).join(" and ")}.`);
  }
  for (const s of skills.filter((x) => x.average < 60)) {
    out.push(`${s.label} is below the 60% mark on average (${s.average}%). Try section practice in ${s.label.toLowerCase()} before your next full simulation.`);
  }
  if (out.length === 0) out.push("Strong results so far. Take a full timed simulation to check your stamina across all modules.");
  return out;
}
