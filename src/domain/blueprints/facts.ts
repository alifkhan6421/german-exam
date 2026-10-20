import type { BlueprintSource, Fact } from "./types";

export const VERIFIED_AT = "2026-10-11";

/** A fact read from an official source. */
export function v<T>(value: T, sourceId: string, note?: string): Fact<T> {
  return { value, status: "verified", sourceId, note };
}

/**
 * A working assumption that has NOT been verified against an official source.
 * Content may be drafted against it, but exams depending on it cannot be published
 * until an administrator confirms the blueprint.
 */
export function u<T>(value: T, note: string): Fact<T> {
  return { value, status: "unverified", note };
}

export const SOURCES = {
  goetheA1Page: {
    id: "goetheA1Page",
    title: "Goethe-Zertifikat A1: Start Deutsch 1 — exam page",
    url: "https://www.goethe.de/ins/de/en/prf/gzsd1.cfm",
    retrievedAt: VERIFIED_AT,
  },
  goetheA1Rules: {
    id: "goetheA1Rules",
    title: "Durchführungsbestimmungen Goethe-Zertifikat A1: Start Deutsch 1",
    url: "https://www.goethe.de/pro/relaunch/prf/en/Durchfuehrungsbestimmungen_A1_Start_Deutsch_1.pdf",
    retrievedAt: VERIFIED_AT,
  },
  goetheA1Spec: {
    id: "goetheA1Spec",
    title: "Start Deutsch 1 — Prüfungsziele, Testbeschreibung",
    url: "https://www.goethe.de/pro/relaunch/prf/en/Pruefungsziele_Testbeschreibung_A1_SD1.pdf",
    retrievedAt: VERIFIED_AT,
  },
  goetheA2Page: {
    id: "goetheA2Page",
    title: "Goethe-Zertifikat A2 — exam page",
    url: "https://www.goethe.de/ins/de/en/prf/gzsd2.cfm",
    retrievedAt: VERIFIED_AT,
  },
  goetheA2Rules: {
    id: "goetheA2Rules",
    title: "Durchführungsbestimmungen Goethe-Zertifikat A2",
    url: "https://www.goethe.de/pro/relaunch/prf/en/Durchfuehrungsbestimmungen_A2.pdf",
    retrievedAt: VERIFIED_AT,
  },
  goetheB1Page: {
    id: "goetheB1Page",
    title: "Goethe-Zertifikat B1 — exam page",
    url: "https://www.goethe.de/ins/de/en/prf/gzb1.cfm",
    retrievedAt: VERIFIED_AT,
  },
  goetheB1Rules: {
    id: "goetheB1Rules",
    title: "Durchführungsbestimmungen Goethe-Zertifikat B1 (1 Sept 2025)",
    url: "https://www.goethe.de/pro/relaunch/prf/en/Durchfuehrungsbestimmungen_B1.pdf",
    retrievedAt: VERIFIED_AT,
  },
  goetheB2Page: {
    id: "goetheB2Page",
    title: "Goethe-Zertifikat B2 — exam page",
    url: "https://www.goethe.de/ins/de/en/prf/gzb2.cfm",
    retrievedAt: VERIFIED_AT,
  },
  goetheB2Rules: {
    id: "goetheB2Rules",
    title: "Durchführungsbestimmungen Goethe-Zertifikat B2 (1 Sept 2025)",
    url: "https://www.goethe.de/pro/relaunch/prf/en/Durchfuehrungsbestimmungen_B2.pdf",
    retrievedAt: VERIFIED_AT,
  },
  telcA1Page: {
    id: "telcA1Page",
    title: "Start Deutsch 1 / telc Deutsch A1 — exam page",
    url: "https://www.telc.net/en/language-examinations/certificate-exams/german/start-german1-telc-german-a1/",
    retrievedAt: VERIFIED_AT,
  },
  telcA1Uebungstest1: {
    id: "telcA1Uebungstest1",
    title: "telc Start Deutsch 1 — Übungstest 1 (11. Auflage 2021)",
    url: "https://shop.telc.net/media/catalog/product/file//2/0/20210103_5070-b00-010106_web_1.pdf",
    retrievedAt: "2026-10-20",
  },
  telcA2Page: {
    id: "telcA2Page",
    title: "Start Deutsch 2 / telc Deutsch A2 — exam page",
    url: "https://www.telc.net/en/language-examinations/certificate-exams/german/start-german-2-telc-german-a2/",
    retrievedAt: VERIFIED_AT,
  },
  telcB1Page: {
    id: "telcB1Page",
    title: "Zertifikat Deutsch / telc Deutsch B1 — exam page",
    url: "https://www.telc.net/en/language-examinations/certificate-exams/german/certificate-german-telc-german-b1/",
    retrievedAt: VERIFIED_AT,
  },
  telcB2Page: {
    id: "telcB2Page",
    title: "telc Deutsch B2 — exam page",
    url: "https://www.telc.net/en/language-examinations/certificate-exams/german/telc-german-b2/",
    retrievedAt: VERIFIED_AT,
  },
  telcB2Handbook: {
    id: "telcB2Handbook",
    title: "telc Deutsch B2 — Handbuch",
    url: "https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_B2_Handbuch.pdf",
    retrievedAt: VERIFIED_AT,
  },
  telcB2Tips: {
    id: "telcB2Tips",
    title: "telc Deutsch B2 — Tipps zur Prüfungsvorbereitung",
    url: "https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_B2_tipps_zur_Pruefungsvorbereitung.pdf",
    retrievedAt: VERIFIED_AT,
  },
} satisfies Record<string, BlueprintSource>;

export type SourceId = keyof typeof SOURCES;

export function sources(...ids: SourceId[]): BlueprintSource[] {
  return ids.map((id) => SOURCES[id]);
}

/** telc Start Deutsch 1 Prädikate (54/48/42/36 of 60 points), expressed as percentages. */
export const TELC_A1_GRADE_BANDS = [
  { min: 90, max: 100, labelDe: "sehr gut" },
  { min: 80, max: 89, labelDe: "gut" },
  { min: 70, max: 79, labelDe: "befriedigend" },
  { min: 60, max: 69, labelDe: "ausreichend" },
  { min: 0, max: 59, labelDe: "teilgenommen" },
];

export const GOETHE_GRADE_BANDS = [
  { min: 90, max: 100, labelDe: "sehr gut" },
  { min: 80, max: 89, labelDe: "gut" },
  { min: 70, max: 79, labelDe: "befriedigend" },
  { min: 60, max: 69, labelDe: "ausreichend" },
  { min: 0, max: 59, labelDe: "nicht bestanden" },
];
