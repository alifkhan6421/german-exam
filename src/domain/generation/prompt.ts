import type { Blueprint, BlueprintPart, BlueprintSection, Fact } from "../blueprints";
import type { ExamContent } from "../exam/schema";
import type { GenerationScope, GenerationTarget } from "./merge";

/**
 * Prompt construction for the AI exam generator. Pure functions so they can be unit-tested
 * and reviewed. Output is always validated against the content schema and the blueprint and
 * lands in a new version with status "generated"; it is never published automatically.
 */

export const PROMPT_VERSION = "gen-prompt-2026.10.1";

const SCHEMA_GUIDE = `
JSON types (TypeScript notation):
Option = { id: string; label: string; text: string }                      // label "a"/"b"/"c", "Richtig"/"Falsch", "a"–"j" for pools
Stimulus = { id: string; kind: "text"|"email"|"note"|"notice"|"ad"|"form"|"table"|"audio"|"card"|"image"|"gap_text";
             label?: string; title?: string; body: string; imageAlt?: string; scriptId?: string }
  // body uses a small markdown subset: paragraphs, **bold**, line breaks, "- " lists, "| a | b |" tables.
  // gap_text bodies mark gaps as [[<itemId>]]. kind "audio" has empty body and a scriptId. kind "image" has imageAlt (an illustration brief).
Item = { id: string; number: number; type: "mc"|"true_false"|"ab"|"matching"|"gap_select"|"short_text"|"writing"|"speaking";
         stimulusIds: string[]; prompt: string; options?: Option[]; fieldLabel?: string;
         writing?: { taskDe: string; leitpunkte: string[]; approxWords?: number; minWords?: number;
                     alternatives?: { id: string; label: string; taskDe: string; leitpunkte: string[] }[] };
         speaking?: { taskDe: string; cards: { title: string; body: string }[]; partnerTurns: string[]; prepSeconds: number; responseSeconds: number } }
Part = { partId: string; instructionsDe: string; stimuli: Stimulus[]; items: Item[]; optionPool?: Option[];
         example?: { prompt: string; stimulusIds: string[]; options?: Option[]; answer: string } }
Section = { sectionId: string; parts: Part[] }
ListeningScript = { id: string; title: string;
  scenario: "railway_station"|"supermarket"|"telephone"|"restaurant"|"airport"|"doctor"|"workplace"|"education"|"accommodation"|"public_office"|"radio"|"family"|"street"|"shop"|"other";
  environment: { preset: <scenario>; ambienceLevel: number /* 0–0.3, speech must stay clearly intelligible */; telephoneFilter: boolean; publicAddress: boolean; reverb: number; ambiencePrompt?: string /* English sound-effect description */ };
  speakers: { id: string; name: string; role: string; gender: "female"|"male"|"neutral"; age: "child"|"young"|"adult"|"senior"; accent: string }[];
  turns: { id: string; speakerId: string; text: string; pauseAfterMs: number; pace: number /* 0.7–1.2 */ }[];
  audioAssetId: null; audioStatus: "none"; durationSec: null }
AnswerKey = { [itemId: string]: { correct: string[] /* option ids, or accepted strings for short_text, [] for writing/speaking */; explanation: string /* English */; evidence: string /* quote from the text or transcript */ } }
ExamContent = { schemaVersion: 1; blueprintKey: string; blueprintVersion: string; title: string; themes: string[];
                sections: Section[]; scripts: ListeningScript[]; answerKey: AnswerKey }`;

const OUTPUT_SHAPE: Record<GenerationScope, string> = {
  exam: "ExamContent",
  section: "{ section: Section; scripts: ListeningScript[]; answerKey: AnswerKey }",
  part: "{ part: Part; scripts: ListeningScript[]; answerKey: AnswerKey }",
  item: "{ item: Item; stimuli: Stimulus[] /* only stimuli owned by this item, else [] */; scripts: ListeningScript[]; answerKey: AnswerKey }",
  passage: "{ stimulus: Stimulus; scripts: ListeningScript[]; answerKey: AnswerKey /* only entries whose answers change */ }",
};

function fact<T>(f: Fact<T> | undefined) {
  if (!f) return undefined;
  return f.value === null ? "not specified" : `${JSON.stringify(f.value)}${f.status === "verified" ? "" : " (proposed)"}`;
}

function describePart(p: BlueprintPart) {
  const lines = [
    `  - Part "${p.id}" (${p.titleDe}): ${p.descriptionEn}`,
    `    Default instructions: ${p.instructionsDe}`,
    `    itemType ${fact(p.itemType)}, itemCount ${fact(p.itemCount)}`,
  ];
  if (p.optionsPerItem) lines.push(`    optionsPerItem ${fact(p.optionsPerItem)}`);
  if (p.optionPoolSize) lines.push(`    optionPoolSize ${fact(p.optionPoolSize)}`);
  if (p.textTypes) lines.push(`    text types ${fact(p.textTypes)}`);
  if (p.playbacks) lines.push(`    recordings are played ${fact(p.playbacks)} time(s)`);
  if (p.writing) lines.push(`    writing: approxWords ${fact(p.writing.approxWords)}, minWords ${fact(p.writing.minWords)}, criteria ${fact(p.writing.criteria)}`);
  if (p.speaking) lines.push(`    speaking: format ${fact(p.speaking.format)}, prepSeconds ${fact(p.speaking.prepSeconds)}, responseSeconds ${fact(p.speaking.responseSeconds)}`);
  return lines.join("\n");
}

function describeSection(s: BlueprintSection) {
  return [`- Section "${s.id}" (${s.titleDe}, skill ${s.skill}, ${s.durationMinutes.value ?? "?"} min):`, ...s.parts.map(describePart)].join("\n");
}

export function buildGenerationPrompt(args: {
  blueprint: Blueprint;
  scope: GenerationScope;
  target: GenerationTarget;
  base: ExamContent;
  brief: string;
  formatExample: unknown;
  avoidThemes: string[];
}) {
  const { blueprint: bp, scope, target, base } = args;
  const sections = scope === "exam" ? bp.sections : bp.sections.filter((s) => s.id === target.sectionId);
  const section = base.sections.find((s) => s.sectionId === target.sectionId);
  const part = section?.parts.find((p) => p.partId === target.partId);

  const system = [
    `You write original practice material for the German exam "${bp.officialName}" (CEFR ${bp.level}, ${bp.provider === "goethe" ? "Goethe-Institut" : "telc"} format).`,
    "Rules:",
    "- Every text, dialogue, name, place and situation must be newly invented. Never copy or paraphrase official sample papers or published textbooks.",
    "- Do not use real company names, brands, celebrities or real private persons. Fictional names and generic places are fine.",
    `- Vocabulary, sentence length and topics must fit CEFR ${bp.level}. Use standard German spelling (ß, ä, ö, ü).`,
    "- Follow the blueprint structure exactly: section and part ids, number of items, item types, options per item. Items are numbered consecutively within a section as on the official answer sheet.",
    "- Each objective item has exactly one defensible correct answer. Distractors must be plausible but clearly wrong from the text or recording.",
    "- Every answer key entry has an English explanation and the evidence (a short quote) from the text or transcript.",
    "- Listening: write natural spoken German with realistic turn-taking and fillers appropriate to the level. Set ambienceLevel between 0 and 0.3 so speech stays intelligible.",
    "- Instructions to candidates (instructionsDe, taskDe) are in German; explanations are in English.",
    "- Return one JSON object in a ```json code fence and nothing else.",
  ].join("\n");

  const user = [
    `## Task\nGenerate the ${scope}${scope === "exam" ? "" : ` for ${[target.sectionId, target.partId, target.itemId ?? target.stimulusId].filter(Boolean).join(" / ")}`}.`,
    `Return: ${OUTPUT_SHAPE[scope]}`,
    "",
    "## Blueprint (values marked (proposed) are our working structure; follow them anyway)",
    describeSections(sections),
    "",
    "## Schema",
    SCHEMA_GUIDE,
    "",
    "## Format example (structure only; do not reuse its topics or wording)",
    "```json",
    JSON.stringify(args.formatExample, null, 1).slice(0, 6000),
    "```",
    args.avoidThemes.length ? `\n## Themes already used in this track (choose different ones)\n${args.avoidThemes.join(", ")}` : "",
    scope === "item" || scope === "passage"
      ? `\n## Current part (keep everything else consistent with it)\n\`\`\`json\n${JSON.stringify(part, null, 1)}\n\`\`\``
      : "",
    scope !== "exam" ? `\nExam metadata: blueprintKey "${base.blueprintKey}", blueprintVersion "${base.blueprintVersion}", title "${base.title}". Use ids that are unique within the exam (prefix new ids with the part id).` : "",
    args.brief.trim() ? `\n## Editor's brief\n${args.brief.trim()}` : "",
  ].join("\n");

  return { system, user, promptVersion: PROMPT_VERSION };
}

function describeSections(sections: BlueprintSection[]) {
  return sections.map(describeSection).join("\n");
}
