import { goetheA1 } from "./goethe-a1";
import { goetheA2, goetheB1, goetheB2 } from "./goethe-a2-b1-b2";
import { telcA1, telcA2, telcB1, telcB2 } from "./telc";
import type { Blueprint, BlueprintPart, BlueprintSection, CefrLevel, Fact, Provider } from "./types";

export * from "./types";

export const BLUEPRINTS: Blueprint[] = [goetheA1, goetheA2, goetheB1, goetheB2, telcA1, telcA2, telcB1, telcB2];

export function getBlueprint(key: string, version?: string): Blueprint | undefined {
  return BLUEPRINTS.find((b) => b.key === key && (!version || b.version === version));
}

export function blueprintFor(provider: Provider, level: CefrLevel): Blueprint | undefined {
  return BLUEPRINTS.find((b) => b.provider === provider && b.level === level);
}

export interface UnverifiedFact {
  path: string;
  value: unknown;
  note?: string;
}

function isFact(x: unknown): x is Fact<unknown> {
  return !!x && typeof x === "object" && "status" in x && "value" in x &&
    ((x as Fact<unknown>).status === "verified" || (x as Fact<unknown>).status === "unverified");
}

/** Every unverified fact in a blueprint, with a readable path. */
export function unverifiedFacts(bp: Blueprint): UnverifiedFact[] {
  const out: UnverifiedFact[] = [];
  const walk = (node: unknown, path: string) => {
    if (isFact(node)) {
      if (node.status === "unverified") out.push({ path, value: node.value, note: node.note });
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((child, i) => {
        const label = child && typeof child === "object" && "id" in child ? String((child as { id: string }).id) : String(i);
        walk(child, `${path}[${label}]`);
      });
      return;
    }
    if (node && typeof node === "object") {
      for (const [k, child] of Object.entries(node)) walk(child, path ? `${path}.${k}` : k);
    }
  };
  walk(bp, "");
  return out;
}

export interface BlueprintReadiness {
  unverified: UnverifiedFact[];
  /** True when nothing in the blueprint needs confirmation. */
  fullyVerified: boolean;
  /** Pass estimates are only shown when the pass rule and section maxima are verified. */
  passEstimateAllowed: boolean;
}

export function blueprintReadiness(bp: Blueprint, confirmed = false): BlueprintReadiness {
  const unverified = unverifiedFacts(bp);
  const scoringVerified =
    bp.scoring.passRule.status === "verified" &&
    bp.scoring.passRule.value !== null &&
    bp.sections.every((s) => s.scaledMax.status === "verified" && s.rawMax.status === "verified");
  return {
    unverified,
    fullyVerified: unverified.length === 0 || confirmed,
    passEstimateAllowed: scoringVerified || confirmed,
  };
}

export function allParts(bp: Blueprint): { section: BlueprintSection; part: BlueprintPart }[] {
  return bp.sections.flatMap((section) => section.parts.map((part) => ({ section, part })));
}

/** Section durations resolved to seconds, honouring shared time groups. */
export function sectionTimeBudgets(bp: Blueprint): { groupId: string; sectionIds: string[]; seconds: number | null }[] {
  const groups: { groupId: string; sectionIds: string[]; seconds: number | null }[] = [];
  const seen = new Set<string>();
  for (const s of [...bp.sections].sort((a, b) => a.order - b.order)) {
    if (s.timeGroupId) {
      if (seen.has(s.timeGroupId)) continue;
      seen.add(s.timeGroupId);
      const g = bp.timeGroups.find((t) => t.id === s.timeGroupId);
      groups.push({ groupId: s.timeGroupId, sectionIds: g?.sectionIds ?? [s.id], seconds: g?.minutes.value ? g.minutes.value * 60 : null });
    } else {
      groups.push({ groupId: s.id, sectionIds: [s.id], seconds: s.durationMinutes.value ? s.durationMinutes.value * 60 : null });
    }
  }
  return groups;
}
