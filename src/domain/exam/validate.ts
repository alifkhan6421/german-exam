import { blueprintReadiness, type Blueprint, type BlueprintPart, type Fact } from "../blueprints";
import { ExamContentSchema, allItems, type ExamContent, type Item, type Part } from "./schema";

export type Severity = "critical" | "warning" | "info";

export interface ValidationIssue {
  severity: Severity;
  code: string;
  message: string;
  /** Location, e.g. "hoeren/hoeren-1/item h1-3". */
  where?: string;
}

export interface ValidationReport {
  ok: boolean; // no critical issues
  issues: ValidationIssue[];
  counts: Record<Severity, number>;
  checkedAt: string;
}

export interface ValidateOptions {
  /** Administrator has confirmed this blueprint version's unverified facts. */
  blueprintConfirmed: boolean;
  /**
   * Development only: listening scripts without approved audio are downgraded to a
   * warning so the exam can be demonstrated with browser speech. Ignored in production.
   */
  allowDevPreviewAudio: boolean;
  /** Other exams' content on the same track, for duplication checks. */
  siblings?: { title: string; content: ExamContent }[];
}

const OBJECTIVE = new Set(["mc", "true_false", "ab", "matching", "gap_select", "short_text"]);

export function isObjective(item: Pick<Item, "type">) {
  return OBJECTIVE.has(item.type);
}

function factMismatch<T>(
  issues: ValidationIssue[],
  fact: Fact<T | null> | undefined,
  actual: T,
  code: string,
  label: string,
  where: string,
) {
  if (!fact || fact.value === null || fact.value === undefined) return;
  if (fact.value === actual) return;
  issues.push({
    severity: fact.status === "verified" ? "critical" : "warning",
    code,
    message: `${label}: expected ${String(fact.value)} (${fact.status === "verified" ? "official" : "unverified blueprint value"}), found ${String(actual)}.`,
    where,
  });
}

export function validateExam(raw: unknown, bp: Blueprint, opts: ValidateOptions): ValidationReport {
  const issues: ValidationIssue[] = [];
  const parsed = ExamContentSchema.safeParse(raw);
  if (!parsed.success) {
    for (const e of parsed.error.issues.slice(0, 50)) {
      issues.push({ severity: "critical", code: "schema", message: e.message, where: e.path.join(".") });
    }
    return finish(issues);
  }
  const content = parsed.data;

  if (content.blueprintKey !== bp.key || content.blueprintVersion !== bp.version) {
    issues.push({
      severity: "critical",
      code: "blueprint_mismatch",
      message: `Content targets ${content.blueprintKey}@${content.blueprintVersion} but is being validated against ${bp.key}@${bp.version}.`,
    });
  }

  const readiness = blueprintReadiness(bp, opts.blueprintConfirmed);
  if (!readiness.fullyVerified) {
    issues.push({
      severity: "critical",
      code: "blueprint_unconfirmed",
      message: `Blueprint ${bp.key}@${bp.version} has ${readiness.unverified.length} unverified facts. An administrator must confirm the blueprint before exams on it can be published.`,
    });
  }

  // ---- Structure: sections and parts in blueprint order --------------------------------
  const bpSections = [...bp.sections].sort((a, b) => a.order - b.order);
  const contentSectionIds = content.sections.map((s) => s.sectionId);
  for (const s of bpSections) {
    if (!contentSectionIds.includes(s.id)) {
      issues.push({ severity: "critical", code: "missing_section", message: `Section "${s.titleDe}" is missing.`, where: s.id });
    }
  }
  for (const id of contentSectionIds) {
    if (!bpSections.some((s) => s.id === id)) {
      issues.push({ severity: "critical", code: "unknown_section", message: `Section "${id}" is not part of the blueprint.`, where: id });
    }
  }
  const orderInContent = contentSectionIds.filter((id) => bpSections.some((s) => s.id === id));
  const expectedOrder = bpSections.map((s) => s.id).filter((id) => orderInContent.includes(id));
  if (orderInContent.join() !== expectedOrder.join()) {
    issues.push({ severity: "critical", code: "section_order", message: `Sections must follow the blueprint order: ${expectedOrder.join(" → ")}.` });
  }

  // ---- Global uniqueness -------------------------------------------------------------
  const itemIds = new Set<string>();
  const stimulusIds = new Set<string>();
  const numbersBySection = new Map<string, number[]>();
  for (const { section, part, item } of allItems(content)) {
    if (itemIds.has(item.id)) issues.push({ severity: "critical", code: "duplicate_item_id", message: `Duplicate item id ${item.id}.`, where: `${section.sectionId}/${part.partId}` });
    itemIds.add(item.id);
    numbersBySection.set(section.sectionId, [...(numbersBySection.get(section.sectionId) ?? []), item.number]);
  }
  for (const s of content.sections) for (const p of s.parts) for (const st of p.stimuli) {
    if (stimulusIds.has(st.id)) issues.push({ severity: "critical", code: "duplicate_stimulus_id", message: `Duplicate stimulus id ${st.id}.`, where: `${s.sectionId}/${p.partId}` });
    stimulusIds.add(st.id);
  }
  for (const [sectionId, nums] of numbersBySection) {
    const sorted = [...nums].sort((a, b) => a - b);
    const contiguous = sorted.every((n, i) => i === 0 || n === sorted[i - 1] + 1);
    if (new Set(nums).size !== nums.length || !contiguous) {
      issues.push({ severity: "warning", code: "item_numbering", message: `Item numbers in ${sectionId} should be unique and consecutive (found ${nums.join(", ")}).`, where: sectionId });
    }
  }

  // ---- Per part ------------------------------------------------------------------------
  for (const section of content.sections) {
    const bpSection = bp.sections.find((s) => s.id === section.sectionId);
    if (!bpSection) continue;
    for (const bpPart of bpSection.parts) {
      if (!section.parts.some((p) => p.partId === bpPart.id)) {
        issues.push({ severity: "critical", code: "missing_part", message: `${bpPart.titleDe} is missing.`, where: `${section.sectionId}/${bpPart.id}` });
      }
    }
    const partOrder = section.parts.map((p) => p.partId);
    const bpPartOrder = bpSection.parts.map((p) => p.id).filter((id) => partOrder.includes(id));
    if (partOrder.filter((id) => bpPartOrder.includes(id)).join() !== bpPartOrder.join()) {
      issues.push({ severity: "critical", code: "part_order", message: `Parts in ${bpSection.titleDe} must follow the blueprint order.`, where: section.sectionId });
    }
    for (const part of section.parts) {
      const bpPart = bpSection.parts.find((p) => p.id === part.partId);
      const where = `${section.sectionId}/${part.partId}`;
      if (!bpPart) {
        issues.push({ severity: "critical", code: "unknown_part", message: `Part ${part.partId} is not in the blueprint.`, where });
        continue;
      }
      validatePart(issues, content, part, bpPart, bpSection.skill, where, opts);
    }
  }

  // ---- Answer key ---------------------------------------------------------------------
  for (const key of Object.keys(content.answerKey)) {
    if (!itemIds.has(key)) issues.push({ severity: "warning", code: "orphan_key", message: `Answer key entry ${key} has no matching item.` });
  }

  // ---- Listening scripts ---------------------------------------------------------------
  const usedScripts = new Set<string>();
  for (const s of content.sections) for (const p of s.parts) for (const st of p.stimuli) if (st.scriptId) usedScripts.add(st.scriptId);
  for (const script of content.scripts) {
    const where = `script ${script.id}`;
    if (!usedScripts.has(script.id)) issues.push({ severity: "warning", code: "unused_script", message: `Listening script "${script.title}" is not used by any audio stimulus.`, where });
    for (const t of script.turns) {
      if (!script.speakers.some((sp) => sp.id === t.speakerId)) {
        issues.push({ severity: "critical", code: "script_speaker", message: `Turn ${t.id} references unknown speaker ${t.speakerId}.`, where });
      }
    }
    if (script.environment.ambienceLevel > 0.5) {
      issues.push({ severity: "critical", code: "ambience_too_loud", message: `Ambience level ${script.environment.ambienceLevel} risks making required information unintelligible (max 0.5).`, where });
    } else if (script.environment.ambienceLevel > 0.3) {
      issues.push({ severity: "warning", code: "ambience_loud", message: `Ambience level ${script.environment.ambienceLevel} is high; check intelligibility.`, where });
    }
    if (script.audioStatus !== "approved" || !script.audioAssetId) {
      issues.push({
        severity: opts.allowDevPreviewAudio ? "warning" : "critical",
        code: "audio_not_approved",
        message: opts.allowDevPreviewAudio
          ? `"${script.title}" has no approved audio. Development preview speech will be used; this exam is not launch-ready.`
          : `"${script.title}" has no approved audio recording.`,
        where,
      });
    }
  }

  // ---- Diversity against sibling exams ---------------------------------------------------
  for (const sib of opts.siblings ?? []) {
    const sim = contentSimilarity(content, sib.content);
    if (sim >= 0.5) {
      issues.push({ severity: "critical", code: "too_similar", message: `Content overlaps ${Math.round(sim * 100)}% with "${sib.title}". Tests must be meaningfully different.` });
    } else if (sim >= 0.3) {
      issues.push({ severity: "warning", code: "similar", message: `Content overlaps ${Math.round(sim * 100)}% with "${sib.title}".` });
    }
  }

  return finish(issues);
}

function validatePart(
  issues: ValidationIssue[],
  content: ExamContent,
  part: Part,
  bpPart: BlueprintPart,
  skill: string,
  where: string,
  opts: ValidateOptions,
) {
  void opts;
  factMismatch(issues, bpPart.itemCount, part.items.length, "item_count", `${bpPart.titleDe} item count`, where);
  const stimIds = new Set(part.stimuli.map((s) => s.id));

  for (const item of part.items) {
    const iw = `${where}/item ${item.number}`;
    factMismatch(issues, bpPart.itemType, item.type, "item_type", `${bpPart.titleDe} item type`, iw);
    for (const sid of item.stimulusIds) {
      if (!stimIds.has(sid)) issues.push({ severity: "critical", code: "missing_stimulus", message: `Item ${item.number} references missing stimulus ${sid}.`, where: iw });
    }

    const key = content.answerKey[item.id];
    if (isObjective(item)) {
      const options = item.options ?? part.optionPool ?? [];
      if (item.type === "mc" || item.type === "ab" || item.type === "true_false") {
        if (!item.options?.length) issues.push({ severity: "critical", code: "missing_options", message: `Item ${item.number} has no options.`, where: iw });
        if (bpPart.optionsPerItem && item.options) {
          factMismatch(issues, bpPart.optionsPerItem, item.options.length, "option_count", `Item ${item.number} options`, iw);
        }
      }
      if ((item.type === "matching" || item.type === "gap_select") && !item.options?.length && !part.optionPool?.length) {
        issues.push({ severity: "critical", code: "missing_pool", message: `Item ${item.number} needs options or a shared option pool.`, where: iw });
      }
      if (bpPart.optionPoolSize && part.optionPool) {
        factMismatch(issues, bpPart.optionPoolSize, part.optionPool.length, "pool_size", `${bpPart.titleDe} option pool`, where);
      }
      const texts = options.map((o) => o.text.trim().toLowerCase()).filter(Boolean);
      if (new Set(texts).size !== texts.length) issues.push({ severity: "critical", code: "duplicate_options", message: `Item ${item.number} has duplicate option texts.`, where: iw });

      if (!key || key.correct.length === 0) {
        issues.push({ severity: "critical", code: "missing_key", message: `Item ${item.number} has no answer key.`, where: iw });
      } else if (item.type !== "short_text") {
        if (key.correct.length !== 1) issues.push({ severity: "critical", code: "ambiguous_key", message: `Item ${item.number} must have exactly one correct option.`, where: iw });
        for (const c of key.correct) {
          if (!options.some((o) => o.id === c)) issues.push({ severity: "critical", code: "key_reference", message: `Answer key for item ${item.number} points to unknown option "${c}".`, where: iw });
        }
      }
      if (key && !key.explanation) issues.push({ severity: "info", code: "missing_explanation", message: `Item ${item.number} has no explanation for practice review.`, where: iw });
    }

    if (item.type === "writing") {
      if (!item.writing) issues.push({ severity: "critical", code: "missing_writing_task", message: `Writing item ${item.number} has no task.`, where: iw });
      else {
        const spec = bpPart.writing;
        if (spec?.approxWords) factMismatch(issues, spec.approxWords, item.writing.approxWords ?? null, "word_target", "Approximate word count", iw);
        if (spec?.minWords) factMismatch(issues, spec.minWords, item.writing.minWords ?? null, "word_minimum", "Minimum word count", iw);
      }
    }
    if (item.type === "speaking") {
      if (!item.speaking) issues.push({ severity: "critical", code: "missing_speaking_task", message: `Speaking item ${item.number} has no task.`, where: iw });
      else if (bpPart.speaking) {
        factMismatch(issues, bpPart.speaking.prepSeconds, item.speaking.prepSeconds, "prep_time", "Preparation time (s)", iw);
      }
    }

    if (skill === "listening") {
      const audio = item.stimulusIds.map((id) => part.stimuli.find((s) => s.id === id)).filter((s) => s?.kind === "audio");
      if (audio.length === 0) issues.push({ severity: "critical", code: "listening_no_audio", message: `Listening item ${item.number} is not linked to an audio stimulus.`, where: iw });
      for (const a of audio) {
        if (!a?.scriptId || !content.scripts.some((sc) => sc.id === a.scriptId)) {
          issues.push({ severity: "critical", code: "missing_script", message: `Audio stimulus ${a?.id} has no listening script.`, where: iw });
        }
      }
    }
  }

  // Gap texts must reference every gap item exactly once.
  for (const st of part.stimuli.filter((s) => s.kind === "gap_text")) {
    const refs = [...st.body.matchAll(/\[\[([^\]]+)\]\]/g)].map((m) => m[1]);
    for (const item of part.items) {
      const n = refs.filter((r) => r === item.id).length;
      if (n !== 1) issues.push({ severity: "critical", code: "gap_reference", message: `Gap text ${st.id} must contain [[${item.id}]] exactly once (found ${n}).`, where });
    }
  }

  // CEFR heuristic: sentence length for reading/listening stimuli.
  const levelMax: Record<string, number> = { A1: 12, A2: 16, B1: 24, B2: 32 };
  const maxAvg = levelMax[content.blueprintKey.includes("a1") ? "A1" : content.blueprintKey.includes("a2") ? "A2" : content.blueprintKey.includes("b1") ? "B1" : "B2"];
  for (const st of part.stimuli) {
    const text = st.body.replace(/\[\[[^\]]+\]\]/g, "___");
    const sentences = text.split(/[.!?]+\s/).filter((s) => s.trim().split(/\s+/).length > 2);
    if (sentences.length < 2) continue;
    const avg = sentences.reduce((n, s) => n + s.trim().split(/\s+/).length, 0) / sentences.length;
    if (avg > maxAvg) {
      issues.push({ severity: "warning", code: "cefr_sentence_length", message: `Stimulus ${st.id} averages ${avg.toFixed(1)} words per sentence, high for this level (≤ ${maxAvg}).`, where });
    }
  }
}

function finish(issues: ValidationIssue[]): ValidationReport {
  const counts = { critical: 0, warning: 0, info: 0 } as Record<Severity, number>;
  for (const i of issues) counts[i.severity]++;
  return { ok: counts.critical === 0, issues, counts, checkedAt: new Date().toISOString() };
}

/* ---------------------------------------------------------------------------------------- */
/* Similarity: word-trigram Jaccard over stimuli, prompts and scripts                         */
/* ---------------------------------------------------------------------------------------- */

export function contentText(content: ExamContent): string {
  const parts: string[] = [];
  for (const s of content.sections) for (const p of s.parts) {
    for (const st of p.stimuli) parts.push(st.body);
    for (const i of p.items) parts.push(i.prompt, ...(i.options ?? []).map((o) => o.text), i.writing?.taskDe ?? "", i.speaking?.taskDe ?? "");
  }
  for (const sc of content.scripts) for (const t of sc.turns) parts.push(t.text);
  return parts.join(" ");
}

function shingles(text: string, n = 3): Set<string> {
  const words = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + n <= words.length; i++) out.add(words.slice(i, i + n).join(" "));
  return out;
}

export function textSimilarity(a: string, b: string): number {
  const A = shingles(a);
  const B = shingles(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const s of A) if (B.has(s)) inter++;
  return inter / (A.size + B.size - inter);
}

export function contentSimilarity(a: ExamContent, b: ExamContent): number {
  return textSimilarity(contentText(a), contentText(b));
}
