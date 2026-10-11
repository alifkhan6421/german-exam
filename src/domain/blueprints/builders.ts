import { u, v } from "./facts";
import type { BlueprintPart, Fact, ItemType, SpeakingSpec, WritingSpec } from "./types";

/**
 * Proposed part structure for parts whose per-part details are not stated in the
 * sources read. Everything is marked unverified; only the module totals are verified.
 */
export function proposedPart(opts: {
  sectionId: string;
  number: number;
  titleDe: string;
  descriptionEn: string;
  instructionsDe: string;
  itemType: ItemType;
  itemCount: number;
  textTypes: string[];
  optionsPerItem?: number;
  optionPoolSize?: number;
  playbacks?: number;
  pointsPerItem?: Fact<number | null>;
  writing?: WritingSpec;
  speaking?: SpeakingSpec;
  note?: string;
}): BlueprintPart {
  const why = opts.note ?? "Per-part detail not stated in the official sources read; confirm against a current Modellsatz.";
  return {
    id: `${opts.sectionId}-${opts.number}`,
    number: opts.number,
    titleDe: opts.titleDe,
    descriptionEn: opts.descriptionEn,
    instructionsDe: opts.instructionsDe,
    itemType: u(opts.itemType, why),
    itemCount: u(opts.itemCount, why),
    optionsPerItem: opts.optionsPerItem === undefined ? undefined : u(opts.optionsPerItem, why),
    optionPoolSize: opts.optionPoolSize === undefined ? undefined : u(opts.optionPoolSize, why),
    playbacks: opts.playbacks === undefined ? undefined : u(opts.playbacks, why),
    pointsPerItem: opts.pointsPerItem,
    textTypes: u(opts.textTypes, why),
    writing: opts.writing,
    speaking: opts.speaking,
  };
}

export function proposedWriting(opts: {
  approxWords?: number;
  minWords?: number;
  criteria: string[];
  maxRawPoints: number | null;
  taskChoice?: number;
}): WritingSpec {
  const why = "Writing task details not stated in the sources read.";
  return {
    approxWords: opts.approxWords === undefined ? undefined : u(opts.approxWords, why),
    minWords: opts.minWords === undefined ? undefined : u(opts.minWords, why),
    taskChoice: opts.taskChoice === undefined ? undefined : u(opts.taskChoice, why),
    criteria: u(opts.criteria, why),
    maxRawPoints: u(opts.maxRawPoints, why),
  };
}

export function speakingSpec(opts: {
  format: Fact<SpeakingSpec["format"]["value"]>;
  prepSeconds: Fact<number | null>;
  responseSeconds: Fact<number | null>;
  maxRawPoints: Fact<number | null>;
}): SpeakingSpec {
  return opts;
}

export { u, v };
