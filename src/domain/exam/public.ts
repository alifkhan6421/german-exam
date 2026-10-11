import type { ExamContent, Item, ListeningScript, Part, Section, Stimulus } from "./schema";

/**
 * What a student's browser may receive. Answer keys, explanations and listening
 * transcripts are removed unless explicitly allowed.
 */
export interface PublicScript {
  id: string;
  title: string;
  scenario: ListeningScript["scenario"];
  hasApprovedAudio: boolean;
  durationSec: number | null;
  /** Only included in practice review or in clearly labelled development preview. */
  transcript?: { speaker: string; text: string; pauseAfterMs: number; pace: number; gender: string }[];
}

export interface PublicExamContent {
  title: string;
  blueprintKey: string;
  blueprintVersion: string;
  sections: Section[];
  scripts: PublicScript[];
}

export function toPublicContent(
  content: ExamContent,
  opts: { includeTranscripts: boolean },
): PublicExamContent {
  return {
    title: content.title,
    blueprintKey: content.blueprintKey,
    blueprintVersion: content.blueprintVersion,
    sections: content.sections.map((s) => ({
      ...s,
      parts: s.parts.map((p): Part => ({
        ...p,
        stimuli: p.stimuli.map((st): Stimulus => ({ ...st })),
        items: p.items.map((i): Item => ({ ...i })),
      })),
    })),
    scripts: content.scripts.map((sc) => ({
      id: sc.id,
      title: sc.title,
      scenario: sc.scenario,
      hasApprovedAudio: sc.audioStatus === "approved" && !!sc.audioAssetId,
      durationSec: sc.durationSec,
      transcript: opts.includeTranscripts
        ? sc.turns.map((t) => {
            const sp = sc.speakers.find((s) => s.id === t.speakerId);
            return { speaker: sp?.name ?? t.speakerId, text: t.text, pauseAfterMs: t.pauseAfterMs, pace: t.pace, gender: sp?.gender ?? "neutral" };
          })
        : undefined,
    })),
  };
}
