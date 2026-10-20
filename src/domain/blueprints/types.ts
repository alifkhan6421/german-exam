/**
 * Versioned examination blueprints.
 *
 * Every factual claim about an official exam is wrapped in a `Fact`, which records
 * whether it was verified against an official source or still needs an administrator
 * to confirm it. Nothing unverified may silently drive scoring or pass estimates:
 * see `blueprintReadiness()` in ./readiness.ts.
 */

export type Provider = "goethe" | "telc";
export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type Skill = "listening" | "reading" | "writing" | "speaking" | "language_elements";

export type FactStatus = "verified" | "unverified";

export interface Fact<T> {
  value: T;
  status: FactStatus;
  /** Key into `Blueprint.sources`. Required when status is "verified". */
  sourceId?: string;
  /** Section/page reference inside the source, or the reason it is unverified. */
  note?: string;
}

/** Item/answer formats the simulator can render and score. */
export type ItemType =
  | "mc" // single choice a/b/c (or more)
  | "true_false" // richtig / falsch
  | "ab" // choose between two texts/ads (Goethe A1 Lesen Teil 2 style)
  | "matching" // assign one option from a shared pool (headlines, ads, people)
  | "gap_select" // gap text with per-gap options or shared word box
  | "short_text" // form field, scored against accepted answers
  | "writing" // free text, rubric-assessed
  | "speaking"; // recorded response, rubric-assessed

export interface BlueprintSource {
  id: string;
  title: string;
  url: string;
  /** ISO date the source was read. */
  retrievedAt: string;
}

export interface WritingSpec {
  approxWords?: Fact<number | null>;
  minWords?: Fact<number | null>;
  /** Choice of tasks, e.g. telc B2: one of two. */
  taskChoice?: Fact<number | null>;
  criteria: Fact<string[]>;
  maxRawPoints: Fact<number | null>;
}

export interface SpeakingSpec {
  format: Fact<"monologue" | "interaction" | "monologue_and_interaction">;
  prepSeconds: Fact<number | null>;
  /** Approximate speaking time per candidate for this part. */
  responseSeconds: Fact<number | null>;
  maxRawPoints: Fact<number | null>;
}

export interface BlueprintPart {
  id: string; // e.g. "hoeren-1"
  number: number;
  titleDe: string;
  descriptionEn: string;
  /** Candidate instructions (German) used as default for generated content. */
  instructionsDe: string;
  itemType: Fact<ItemType>;
  itemCount: Fact<number | null>;
  pointsPerItem?: Fact<number | null>;
  /** How many options each item offers (e.g. 3 for a/b/c). */
  optionsPerItem?: Fact<number | null>;
  /** For matching tasks: size of the option pool (e.g. 10 headlines for 5 texts). */
  optionPoolSize?: Fact<number | null>;
  textTypes: Fact<string[]>;
  /** Listening only: how often the recording is played. */
  playbacks?: Fact<number | null>;
  approxMinutes?: Fact<number | null>;
  writing?: WritingSpec;
  speaking?: SpeakingSpec;
}

export interface BlueprintSection {
  id: string; // e.g. "hoeren"
  skill: Skill;
  titleDe: string;
  titleEn: string;
  order: number;
  /** Minutes for this section when it is timed on its own. Null when timed in a group. */
  durationMinutes: Fact<number | null>;
  /** Sections sharing a time group are worked in one combined countdown. */
  timeGroupId?: string;
  /** Raw points as scored by items/criteria. */
  rawMax: Fact<number | null>;
  /** Reported points after scaling (e.g. 15 raw → 25 reported). */
  scaledMax: Fact<number | null>;
  /** Multiplier from raw to reported points, when the source states one. */
  scaleFactor?: Fact<number | null>;
  /** Weight of this section in the overall result, as a percentage. */
  weightPercent?: Fact<number | null>;
  parts: BlueprintPart[];
  /** Written or oral component, used by pass rules such as "≥45 written". */
  component: "written" | "oral";
}

export interface TimeGroup {
  id: string;
  sectionIds: string[];
  minutes: Fact<number | null>;
  labelDe: string;
}

export type PassRule =
  | { kind: "total_min"; minTotal: number }
  | {
      kind: "total_and_components_min";
      minTotal: number;
      minWritten: number;
      minOral: number;
    }
  | { kind: "per_section_min"; minPerSection: number }
  | {
      kind: "components_percent_min";
      writtenPercent: number;
      oralPercent: number;
    };

export interface ScoringModel {
  /** "total": one combined score. "per_module": each module reported and passed separately. */
  reporting: Fact<"total" | "per_module">;
  totalMax: Fact<number | null>;
  passRule: Fact<PassRule | null>;
  /** Rounding behaviour applied after scaling. */
  rounding: Fact<"round_total" | "round_each_section" | "half_points">;
  gradeBands?: Fact<{ min: number; max: number; labelDe: string }[]>;
}

export interface Blueprint {
  /** Stable key for the exam variant, e.g. "goethe-a1-sd1". */
  key: string;
  version: string;
  provider: Provider;
  level: CefrLevel;
  officialName: string;
  variant: string;
  /** Written sections are taken in a fixed order without breaks where the source says so. */
  sections: BlueprintSection[];
  timeGroups: TimeGroup[];
  scoring: ScoringModel;
  moduleIndependence: Fact<string>;
  speakingFormat: Fact<string>;
  specialRules: Fact<string>[];
  sources: BlueprintSource[];
  verifiedAt: string;
  /** Human-readable notes for administrators. */
  adminNotes: string[];
}
