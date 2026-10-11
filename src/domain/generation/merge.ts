import { z } from "zod";
import {
  AnswerKeyEntrySchema, ExamContentSchema, ItemSchema, ListeningScriptSchema, PartSchema, SectionSchema, StimulusSchema,
  type ExamContent,
} from "../exam/schema";

export const GENERATION_SCOPES = ["exam", "section", "part", "item", "passage"] as const;
export type GenerationScope = (typeof GENERATION_SCOPES)[number];

export interface GenerationTarget {
  sectionId?: string;
  partId?: string;
  itemId?: string;
  stimulusId?: string;
}

const Scripts = z.array(ListeningScriptSchema).default([]);
const Key = z.record(z.string(), AnswerKeyEntrySchema).default({});

/** Shape the model must return for each scope. */
export const GENERATION_OUTPUT: Record<GenerationScope, z.ZodTypeAny> = {
  exam: ExamContentSchema,
  section: z.object({ section: SectionSchema, scripts: Scripts, answerKey: Key }),
  part: z.object({ part: PartSchema, scripts: Scripts, answerKey: Key }),
  item: z.object({ item: ItemSchema, stimuli: z.array(StimulusSchema).default([]), scripts: Scripts, answerKey: Key }),
  passage: z.object({ stimulus: StimulusSchema, scripts: Scripts, answerKey: Key }),
};

function replaceScripts(content: ExamContent, removedIds: string[], added: ExamContent["scripts"]) {
  const addedIds = new Set(added.map((s) => s.id));
  return [...content.scripts.filter((s) => !removedIds.includes(s.id) && !addedIds.has(s.id)), ...added];
}

/**
 * Merge a generated fragment into existing content. Returns a new object; the input is not
 * modified. Scripts referenced only by the replaced fragment are dropped; answer-key entries
 * for replaced items are replaced. Throws on shape mismatch or unknown targets.
 */
export function mergeGenerated(base: ExamContent, scope: GenerationScope, target: GenerationTarget, raw: unknown): ExamContent {
  const parsed = GENERATION_OUTPUT[scope].safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Generated JSON does not match the ${scope} schema: ${parsed.error.issues.slice(0, 5).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
  }
  if (scope === "exam") {
    const c = parsed.data as ExamContent;
    return { ...c, blueprintKey: base.blueprintKey, blueprintVersion: base.blueprintVersion, title: base.title };
  }
  const out: ExamContent = structuredClone(base);
  const frag = parsed.data as { scripts: ExamContent["scripts"]; answerKey: ExamContent["answerKey"] } & Record<string, unknown>;
  const sIdx = out.sections.findIndex((s) => s.sectionId === target.sectionId);
  if (sIdx < 0) throw new Error(`Unknown section "${target.sectionId}".`);
  const section = out.sections[sIdx];

  const scriptIdsOf = (stimuli: { scriptId?: string }[]) => stimuli.flatMap((s) => (s.scriptId ? [s.scriptId] : []));

  if (scope === "section") {
    const next = frag.section as ExamContent["sections"][number];
    if (next.sectionId !== section.sectionId) throw new Error("Generated section id does not match the target.");
    const oldItems = section.parts.flatMap((p) => p.items.map((i) => i.id));
    out.sections[sIdx] = next;
    out.scripts = replaceScripts(out, section.parts.flatMap((p) => scriptIdsOf(p.stimuli)), frag.scripts);
    for (const id of oldItems) delete out.answerKey[id];
    Object.assign(out.answerKey, frag.answerKey);
    return out;
  }

  const pIdx = section.parts.findIndex((p) => p.partId === target.partId);
  if (pIdx < 0) throw new Error(`Unknown part "${target.partId}".`);
  const part = section.parts[pIdx];

  if (scope === "part") {
    const next = frag.part as ExamContent["sections"][number]["parts"][number];
    if (next.partId !== part.partId) throw new Error("Generated part id does not match the target.");
    section.parts[pIdx] = next;
    out.scripts = replaceScripts(out, scriptIdsOf(part.stimuli), frag.scripts);
    for (const i of part.items) delete out.answerKey[i.id];
    Object.assign(out.answerKey, frag.answerKey);
    return out;
  }

  if (scope === "item") {
    const iIdx = part.items.findIndex((i) => i.id === target.itemId);
    if (iIdx < 0) throw new Error(`Unknown item "${target.itemId}".`);
    const old = part.items[iIdx];
    const next = { ...(frag.item as typeof old), id: old.id, number: old.number };
    // Stimuli used only by this item (e.g. its own recording) are replaced by the generated ones.
    const own = part.stimuli.filter((st) => old.stimulusIds.includes(st.id) && !part.items.some((o) => o.id !== old.id && o.stimulusIds.includes(st.id)));
    const newStimuli = (frag.stimuli as typeof part.stimuli) ?? [];
    if (newStimuli.length) {
      const ownIds = new Set(own.map((st) => st.id));
      const at = part.stimuli.findIndex((st) => ownIds.has(st.id));
      part.stimuli = part.stimuli.filter((st) => !ownIds.has(st.id));
      part.stimuli.splice(at < 0 ? part.stimuli.length : at, 0, ...newStimuli);
      out.scripts = replaceScripts(out, scriptIdsOf(own), frag.scripts);
    } else {
      out.scripts = replaceScripts(out, [], frag.scripts);
    }
    part.items[iIdx] = next;
    const genId = (frag.item as { id: string }).id;
    out.answerKey[old.id] = frag.answerKey[old.id] ?? frag.answerKey[genId] ?? out.answerKey[old.id];
    return out;
  }

  // passage
  const stIdx = part.stimuli.findIndex((s) => s.id === target.stimulusId);
  if (stIdx < 0) throw new Error(`Unknown stimulus "${target.stimulusId}".`);
  const old = part.stimuli[stIdx];
  const next = { ...(frag.stimulus as typeof old), id: old.id };
  part.stimuli[stIdx] = next;
  out.scripts = replaceScripts(out, old.scriptId ? [old.scriptId] : [], frag.scripts);
  Object.assign(out.answerKey, frag.answerKey);
  return out;
}
