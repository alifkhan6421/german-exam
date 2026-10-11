import { z } from "zod";

/**
 * Exam content is stored as an immutable, schema-validated document per exam version
 * (`exam_versions.content`). Attempts reference the version they were taken on, so
 * later edits never change what a student saw or how they were scored.
 */

export const SCHEMA_VERSION = 1 as const;

export const ItemTypeSchema = z.enum([
  "mc",
  "true_false",
  "ab",
  "matching",
  "gap_select",
  "short_text",
  "writing",
  "speaking",
]);

export const OptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1), // "a", "b", "Richtig" …
  text: z.string(),
});
export type Option = z.infer<typeof OptionSchema>;

export const StimulusKindSchema = z.enum([
  "text",
  "email",
  "note",
  "notice",
  "ad",
  "form",
  "table",
  "audio",
  "card",
  "image",
  "gap_text",
]);

export const StimulusSchema = z.object({
  id: z.string().min(1),
  kind: StimulusKindSchema,
  /** Label shown on the paper, e.g. "a" for an ad in a pool or "Text 1". */
  label: z.string().optional(),
  title: z.string().optional(),
  /**
   * Body in a small markdown subset (paragraphs, **bold**, line breaks, "- " lists,
   * "| a | b |" tables). For gap texts, gaps are written as [[itemId]].
   */
  body: z.string().default(""),
  /** For images: a description used for alt text and illustration briefs. */
  imageAlt: z.string().optional(),
  imageAssetId: z.string().optional(),
  /** For audio stimuli. */
  scriptId: z.string().optional(),
});
export type Stimulus = z.infer<typeof StimulusSchema>;

export const ScenarioSchema = z.enum([
  "railway_station",
  "supermarket",
  "telephone",
  "restaurant",
  "airport",
  "doctor",
  "workplace",
  "education",
  "accommodation",
  "public_office",
  "radio",
  "family",
  "street",
  "shop",
  "other",
]);
export type Scenario = z.infer<typeof ScenarioSchema>;

export const SpeakerSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  role: z.string(), // "Kassiererin", "Durchsage", …
  gender: z.enum(["female", "male", "neutral"]).default("neutral"),
  age: z.enum(["child", "young", "adult", "senior"]).default("adult"),
  accent: z.string().default("standard"),
  /** Provider voice id once cast in the audio studio. */
  voiceId: z.string().optional(),
  style: z.string().optional(),
});

export const TurnSchema = z.object({
  id: z.string().min(1),
  speakerId: z.string().min(1),
  text: z.string().min(1),
  pauseAfterMs: z.number().int().min(0).max(10000).default(400),
  /** 0.7–1.2 speaking rate multiplier. */
  pace: z.number().min(0.7).max(1.2).default(1),
});

export const EnvironmentSchema = z.object({
  preset: ScenarioSchema,
  /** 0 = silent, 1 = loud. Validated to stay low enough to keep speech intelligible. */
  ambienceLevel: z.number().min(0).max(1).default(0.15),
  telephoneFilter: z.boolean().default(false),
  publicAddress: z.boolean().default(false),
  reverb: z.number().min(0).max(1).default(0),
  ambiencePrompt: z.string().optional(),
});

export const AudioStatusSchema = z.enum(["none", "generated", "approved"]);

export const ListeningScriptSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  scenario: ScenarioSchema,
  environment: EnvironmentSchema,
  speakers: z.array(SpeakerSchema).min(1),
  turns: z.array(TurnSchema).min(1),
  /** Approved, pre-generated audio for students. */
  audioAssetId: z.string().nullable().default(null),
  audioStatus: AudioStatusSchema.default("none"),
  durationSec: z.number().nullable().default(null),
});
export type ListeningScript = z.infer<typeof ListeningScriptSchema>;

export const WritingTaskSchema = z.object({
  taskDe: z.string().min(1),
  leitpunkte: z.array(z.string()).default([]),
  approxWords: z.number().int().positive().optional(),
  minWords: z.number().int().positive().optional(),
  /** Task alternatives when the candidate chooses one (telc B2: A or B). */
  alternatives: z.array(z.object({ id: z.string(), label: z.string(), taskDe: z.string(), leitpunkte: z.array(z.string()) })).optional(),
});

export const SpeakingTaskSchema = z.object({
  taskDe: z.string().min(1),
  cards: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
  /**
   * Lines spoken by the simulated partner/examiner. Used verbatim in scripted mode and
   * as guidance for the AI partner when an LLM is configured.
   */
  partnerTurns: z.array(z.string()).default([]),
  prepSeconds: z.number().int().min(0).default(0),
  responseSeconds: z.number().int().positive(),
});

export const ItemSchema = z.object({
  id: z.string().min(1),
  /** Number as printed on the paper/answer sheet. */
  number: z.number().int().positive(),
  type: ItemTypeSchema,
  stimulusIds: z.array(z.string()).default([]),
  prompt: z.string().default(""),
  options: z.array(OptionSchema).optional(),
  points: z.number().positive().optional(),
  fieldLabel: z.string().optional(),
  writing: WritingTaskSchema.optional(),
  speaking: SpeakingTaskSchema.optional(),
});
export type Item = z.infer<typeof ItemSchema>;

export const ExampleSchema = z.object({
  prompt: z.string(),
  stimulusIds: z.array(z.string()).default([]),
  options: z.array(OptionSchema).optional(),
  answer: z.string(),
});

export const PartSchema = z.object({
  partId: z.string().min(1),
  instructionsDe: z.string().min(1),
  stimuli: z.array(StimulusSchema).default([]),
  items: z.array(ItemSchema).min(1),
  /** Shared option pool for matching/gap tasks (e.g. headlines a–j). */
  optionPool: z.array(OptionSchema).optional(),
  example: ExampleSchema.optional(),
});
export type Part = z.infer<typeof PartSchema>;

export const SectionSchema = z.object({
  sectionId: z.string().min(1),
  parts: z.array(PartSchema).min(1),
});
export type Section = z.infer<typeof SectionSchema>;

export const AnswerKeyEntrySchema = z.object({
  /** Option ids, or accepted strings for short_text. Empty for rubric-scored items. */
  correct: z.array(z.string()).default([]),
  explanation: z.string().optional(),
  /** Quote or reference showing where the answer is found in the stimulus. */
  evidence: z.string().optional(),
});
export type AnswerKeyEntry = z.infer<typeof AnswerKeyEntrySchema>;

export const ExamContentSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  blueprintKey: z.string(),
  blueprintVersion: z.string(),
  title: z.string(),
  themes: z.array(z.string()).default([]),
  sections: z.array(SectionSchema).min(1),
  scripts: z.array(ListeningScriptSchema).default([]),
  answerKey: z.record(z.string(), AnswerKeyEntrySchema),
});
export type ExamContent = z.infer<typeof ExamContentSchema>;
export type ExamContentInput = z.input<typeof ExamContentSchema>;

/** Values a student can submit for one item. */
export const AnswerValueSchema = z.union([
  z.object({ kind: z.literal("choice"), optionId: z.string().max(64) }),
  z.object({ kind: z.literal("text"), text: z.string().max(20000) }),
  z.object({ kind: z.literal("recording"), mediaId: z.string().max(128), durationSec: z.number().min(0).max(3600) }),
]);
export type AnswerValue = z.infer<typeof AnswerValueSchema>;

export function allItems(content: ExamContent): { section: Section; part: Part; item: Item }[] {
  return content.sections.flatMap((section) =>
    section.parts.flatMap((part) => part.items.map((item) => ({ section, part, item }))),
  );
}

export function findItem(content: ExamContent, itemId: string) {
  return allItems(content).find((x) => x.item.id === itemId);
}
