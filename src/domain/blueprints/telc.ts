import { proposedPart, proposedWriting, speakingSpec } from "./builders";
import { sources, TELC_A1_GRADE_BANDS, u, v, VERIFIED_AT } from "./facts";
import type { Blueprint, BlueprintSection } from "./types";

const PAGE_ONLY =
  "The official exam page states the number of parts and durations only; item counts, points and playback rules need confirmation from the telc handbook or Übungstest.";

/* ------------------------------------------------------------------------------------------ */
/* telc Deutsch B2 — the best-documented telc track (handbook + tips booklet)                  */
/* ------------------------------------------------------------------------------------------ */

const H = "telcB2Handbook";
const T = "telcB2Tips";
const P2 = "telcB2Page";

const telcWritingCriteria = [
  "I Berücksichtigung der Leitpunkte (A/B/C/D = 5/3/1/0)",
  "II Kommunikative Gestaltung (A/B/C/D = 5/3/1/0)",
  "III Formale Richtigkeit (A/B/C/D = 5/3/1/0)",
];

export const telcB2: Blueprint = {
  key: "telc-b2",
  version: "2026.10.1",
  provider: "telc",
  level: "B2",
  officialName: "telc Deutsch B2",
  variant: "Allgemeinsprache",
  verifiedAt: VERIFIED_AT,
  sources: sources("telcB2Page", "telcB2Handbook", "telcB2Tips"),
  moduleIndependence: v("Can be taken as a partial examination.", P2),
  speakingFormat: v("Pair examination with 20 minutes preparation time.", P2),
  specialRules: [
    v("Written exam without break.", P2),
    v("Each listening text is played once; the recording is not paused.", T, "Hörverstehen"),
    v("If the test version number is not transferred to the answer sheet, the writing task receives zero points.", T),
    v("Speaking Teil 1 topic is chosen from seven and prepared beforehand.", H, "S. 44"),
  ],
  timeGroups: [
    { id: "lv-sb", sectionIds: ["leseverstehen", "sprachbausteine"], minutes: v(90, H, "S. 34"), labelDe: "Leseverstehen und Sprachbausteine" },
  ],
  sections: [
    {
      id: "leseverstehen", skill: "reading", titleDe: "Leseverstehen", titleEn: "Reading", order: 1, component: "written",
      durationMinutes: v(null, H, "Timed together with Sprachbausteine (90 min)"), timeGroupId: "lv-sb",
      rawMax: v(75, H, "S. 34–37"), scaledMax: v(75, H, "S. 34"), weightPercent: v(25, H, "S. 35"),
      parts: [
        { id: "leseverstehen-1", number: 1, titleDe: "Leseverstehen Teil 1 — Globalverstehen", descriptionEn: "Match 5 texts to 10 headlines.", instructionsDe: "Lesen Sie zuerst die zehn Überschriften. Lesen Sie dann die fünf Texte und entscheiden Sie, welche Überschrift (a–j) am besten zu welchem Text (1–5) passt.", itemType: v("matching", H, "S. 35"), itemCount: v(5, H, "S. 35: Items 1–5"), optionPoolSize: v(10, H, "S. 35"), pointsPerItem: v(5, H, "S. 35"), textTypes: v(["Zeitungsmeldungen", "Kurzartikel"], H, "S. 35"), approxMinutes: v(15, T) },
        { id: "leseverstehen-2", number: 2, titleDe: "Leseverstehen Teil 2 — Detailverstehen", descriptionEn: "Longer text, five 3-option multiple-choice items.", instructionsDe: "Lesen Sie zuerst den Text und lösen Sie dann die Aufgaben 6–10. Welche Antwort (a, b oder c) ist jeweils richtig?", itemType: v("mc", H, "S. 36"), itemCount: v(5, H, "S. 36: Items 6–10"), optionsPerItem: v(3, H, "S. 36"), pointsPerItem: v(5, H, "S. 36"), textTypes: v(["Zeitungs- oder Zeitschriftenartikel"], H, "S. 36"), approxMinutes: v(20, T) },
        { id: "leseverstehen-3", number: 3, titleDe: "Leseverstehen Teil 3 — Selektives Verstehen", descriptionEn: "Match 10 situations to 12 ads; some situations may have no match.", instructionsDe: "Lesen Sie zuerst die zehn Situationen (11–20) und dann die zwölf Anzeigen (a–l). Welche Anzeige passt zu welcher Situation? Sie können jede Anzeige nur einmal verwenden. Für eine Situation gibt es keine passende Anzeige; markieren Sie dann x.", itemType: v("matching", H, "S. 37"), itemCount: v(10, H, "S. 37: Items 11–20"), optionPoolSize: v(12, H, "S. 37"), pointsPerItem: v(2.5, H, "S. 37"), textTypes: v(["Anzeigen"], H, "S. 37"), approxMinutes: v(20, T) },
      ],
    },
    {
      id: "sprachbausteine", skill: "language_elements", titleDe: "Sprachbausteine", titleEn: "Language elements", order: 2, component: "written",
      durationMinutes: v(null, H, "Timed together with Leseverstehen (90 min)"), timeGroupId: "lv-sb",
      rawMax: v(30, H, "S. 38–39"), scaledMax: v(30, H, "S. 34"), weightPercent: v(10, H, "S. 38"),
      parts: [
        { id: "sprachbausteine-1", number: 1, titleDe: "Sprachbausteine Teil 1", descriptionEn: "Gap text (letter), grammar; 3-option choice per gap.", instructionsDe: "Lesen Sie den folgenden Text und entscheiden Sie, welches Wort (a, b oder c) in die jeweilige Lücke (21–30) passt.", itemType: v("gap_select", H, "S. 38"), itemCount: v(10, H, "S. 38: Items 21–30"), optionsPerItem: v(3, H, "S. 38"), pointsPerItem: v(1.5, H, "S. 38"), textTypes: v(["Brief", "E-Mail"], H, "S. 38"), approxMinutes: v(15, T) },
        { id: "sprachbausteine-2", number: 2, titleDe: "Sprachbausteine Teil 2", descriptionEn: "Gap text, lexis; word box with 15 words for 10 gaps.", instructionsDe: "Lesen Sie den folgenden Text und entscheiden Sie, welches Wort (a–o) in welche Lücke (31–40) passt. Sie können jedes Wort nur einmal verwenden. Nicht alle Wörter passen in den Text.", itemType: v("gap_select", H, "S. 39"), itemCount: v(10, H, "S. 39: Items 31–40"), optionPoolSize: v(15, H, "S. 39"), pointsPerItem: v(1.5, H, "S. 39"), textTypes: v(["Sachtext"], H, "S. 39"), approxMinutes: v(20, T) },
      ],
    },
    {
      id: "hoerverstehen", skill: "listening", titleDe: "Hörverstehen", titleEn: "Listening", order: 3, component: "written",
      durationMinutes: v(20, H, "S. 34: ca. 20 Minuten"),
      rawMax: v(75, H, "S. 40–42"), scaledMax: v(75, H, "S. 34"), weightPercent: v(25, H, "S. 40"),
      parts: [
        { id: "hoerverstehen-1", number: 1, titleDe: "Hörverstehen Teil 1 — Globalverstehen", descriptionEn: "Six short radio news items; five true/false statements.", instructionsDe: "Sie hören nun fünf kurze Texte. Dazu sollen Sie fünf Aufgaben lösen. Sie hören diese Texte nur einmal. Entscheiden Sie beim Hören, ob die Aussagen richtig oder falsch sind.", itemType: v("true_false", H, "S. 40"), itemCount: v(5, H, "S. 40: Items 41–45"), pointsPerItem: v(5, H, "S. 40"), textTypes: v(["Radionachrichten"], H, "S. 40"), playbacks: v(1, T), approxMinutes: v(5, T) },
        { id: "hoerverstehen-2", number: 2, titleDe: "Hörverstehen Teil 2 — Detailverstehen", descriptionEn: "Radio interview; ten true/false statements.", instructionsDe: "Sie hören nun ein Interview. Dazu sollen Sie zehn Aufgaben lösen. Sie hören das Interview nur einmal. Entscheiden Sie beim Hören, ob die Aussagen richtig oder falsch sind.", itemType: v("true_false", H, "S. 41"), itemCount: v(10, H, "S. 41: Items 46–55"), pointsPerItem: v(2.5, H, "S. 41"), textTypes: v(["Radiointerview"], H, "S. 41"), playbacks: v(1, T), approxMinutes: v(7, T) },
        { id: "hoerverstehen-3", number: 3, titleDe: "Hörverstehen Teil 3 — Selektives Verstehen", descriptionEn: "Five announcements / functional texts; true/false.", instructionsDe: "Sie hören nun fünf kurze Texte. Dazu sollen Sie fünf Aufgaben lösen. Sie hören jeden Text nur einmal. Entscheiden Sie beim Hören, ob die Aussagen richtig oder falsch sind.", itemType: v("true_false", H, "S. 42"), itemCount: v(5, H, "S. 42: Items 56–60"), pointsPerItem: v(5, H, "S. 42"), textTypes: v(["Ansagen", "Durchsagen", "Anrufbeantworter"], H, "S. 42"), playbacks: v(1, T), approxMinutes: v(6, T) },
      ],
    },
    {
      id: "schriftlicher-ausdruck", skill: "writing", titleDe: "Schriftlicher Ausdruck", titleEn: "Writing", order: 4, component: "written",
      durationMinutes: v(30, H, "S. 34"),
      rawMax: v(15, T, "3 criteria × max 5"), scaledMax: v(45, H, "S. 43"), scaleFactor: v(3, T), weightPercent: v(15, H, "S. 43"),
      parts: [
        { id: "schriftlicher-ausdruck-1", number: 1, titleDe: "Schriftlicher Ausdruck", descriptionEn: "Half-formal e-mail replying to an advertisement; choose one of two tasks; minimum 150 words.", instructionsDe: "Wählen Sie Aufgabe A oder Aufgabe B. Schreiben Sie eine E-Mail (mindestens 150 Wörter). Behandeln Sie darin drei der vier Leitpunkte oder zwei Leitpunkte und einen eigenen Aspekt.", itemType: v("writing", H, "S. 43"), itemCount: v(1, H, "S. 43"), textTypes: v(["Halbformelle E-Mail"], H, "S. 43"), writing: { minWords: v(150, H, "S. 43"), taskChoice: v(2, H, "S. 43: eine aus einer Auswahl von zwei"), criteria: v(telcWritingCriteria, T), maxRawPoints: v(15, T) } },
      ],
    },
    {
      id: "muendlicher-ausdruck", skill: "speaking", titleDe: "Mündlicher Ausdruck", titleEn: "Speaking", order: 5, component: "oral",
      durationMinutes: v(15, H, "S. 34: ca. 15 Min. (+ 20 Min. Vorbereitung)"),
      rawMax: v(75, H, "S. 44–46"), scaledMax: v(75, T), weightPercent: v(25, H, "S. 44"),
      parts: [
        { id: "muendlicher-ausdruck-1", number: 1, titleDe: "Mündlicher Ausdruck Teil 1 — Über Erfahrungen sprechen", descriptionEn: "Report on a topic chosen from seven (prepared beforehand), then respond to your partner.", instructionsDe: "Berichten Sie Ihrer Partnerin / Ihrem Partner über das Thema, das Sie gewählt haben. Hören Sie dann zu und stellen Sie Fragen.", itemType: v("speaking", H, "S. 44"), itemCount: v(1, H, "S. 44"), textTypes: v(["Themenliste"], H, "S. 44"), speaking: speakingSpec({ format: v("monologue_and_interaction", H, "S. 44"), prepSeconds: v(1200, P2, "20 minutes preparation for the oral exam"), responseSeconds: v(300, H, "S. 44: ca. 5 Min."), maxRawPoints: v(25, H, "S. 44") }) },
        { id: "muendlicher-ausdruck-2", number: 2, titleDe: "Mündlicher Ausdruck Teil 2 — Diskussion", descriptionEn: "Discuss the main points of a shared text and exchange opinions.", instructionsDe: "Sie haben beide denselben Text gelesen. Diskutieren Sie die wichtigsten Aussagen und tauschen Sie Ihre Meinungen aus.", itemType: v("speaking", H, "S. 45"), itemCount: v(1, H, "S. 45"), textTypes: v(["Zeitungstext"], H, "S. 45"), speaking: speakingSpec({ format: v("interaction", H, "S. 45"), prepSeconds: v(1200, P2), responseSeconds: v(300, H, "S. 45: ca. 5 Min."), maxRawPoints: v(25, H, "S. 45") }) },
        { id: "muendlicher-ausdruck-3", number: 3, titleDe: "Mündlicher Ausdruck Teil 3 — Gemeinsam etwas planen", descriptionEn: "Plan something together based on a short situation.", instructionsDe: "Planen Sie gemeinsam mit Ihrer Partnerin / Ihrem Partner. Machen Sie Vorschläge, reagieren Sie auf die Vorschläge und einigen Sie sich.", itemType: v("speaking", H, "S. 46"), itemCount: v(1, H, "S. 46"), textTypes: v(["Situationsbeschreibung"], H, "S. 46"), speaking: speakingSpec({ format: v("interaction", H, "S. 46"), prepSeconds: v(1200, P2), responseSeconds: v(300, H, "S. 46: ca. 5 Min."), maxRawPoints: v(25, H, "S. 46") }) },
      ],
    },
  ],
  scoring: {
    reporting: v("total", T, "300 points overall"),
    totalMax: v(300, T),
    passRule: u(
      { kind: "components_percent_min", writtenPercent: 60, oralPercent: 60 },
      "Pass requirement is not stated in the handbook or tips booklet read. Commonly reported as 60% in each of the written and oral exams — needs administrator confirmation.",
    ),
    rounding: u("round_total", "Rounding rule not stated in the sources read."),
  },
  adminNotes: [
    "Handbook table lists 'Vorbereitungszeit 20 Min.' beside Schriftlicher Ausdruck; the tips booklet clarifies the preparation time applies to the oral exam.",
    "Pass threshold must be confirmed before practice pass estimates are shown.",
  ],
};

/* ------------------------------------------------------------------------------------------ */
/* Zertifikat Deutsch / telc Deutsch B1                                                        */
/* ------------------------------------------------------------------------------------------ */

const P1 = "telcB1Page";

function telcB1Sections(): BlueprintSection[] {
  // Same subtest architecture as telc B2 (verified from the B1 exam page: 3/2/3/1/3 parts),
  // but item counts and points are taken from the B2 handbook as a proposal only.
  const b2 = telcB2.sections;
  return b2.map((s) => ({
    ...s,
    durationMinutes:
      s.id === "hoerverstehen"
        ? v(30, P1, "ca. 30 Minuten")
        : s.id === "schriftlicher-ausdruck"
          ? v(30, P1)
          : s.id === "muendlicher-ausdruck"
            ? v(15, P1, "ca. 15 Minuten, 20 Minuten Vorbereitung")
            : v(null, P1, "Timed with the 90-minute written block"),
    rawMax: u(s.rawMax.value, PAGE_ONLY),
    scaledMax: u(s.scaledMax.value, PAGE_ONLY),
    scaleFactor: s.scaleFactor ? u(s.scaleFactor.value, PAGE_ONLY) : undefined,
    weightPercent: s.weightPercent ? u(s.weightPercent.value, PAGE_ONLY) : undefined,
    parts: s.parts.map((p) => ({
      ...p,
      titleDe: p.titleDe,
      itemType: u(p.itemType.value, "Page states multiple choice or matching for receptive parts; per-part type needs confirmation."),
      itemCount: u(p.itemCount.value, PAGE_ONLY),
      optionsPerItem: p.optionsPerItem ? u(p.optionsPerItem.value, PAGE_ONLY) : undefined,
      optionPoolSize: p.optionPoolSize ? u(p.optionPoolSize.value, PAGE_ONLY) : undefined,
      pointsPerItem: p.pointsPerItem ? u(p.pointsPerItem.value, PAGE_ONLY) : undefined,
      textTypes: u(p.textTypes.value, PAGE_ONLY),
      playbacks: p.playbacks ? u(p.playbacks.value, PAGE_ONLY) : undefined,
      approxMinutes: undefined,
      writing: p.writing
        ? proposedWriting({ minWords: 150, criteria: telcWritingCriteria, maxRawPoints: 15, taskChoice: 2 })
        : undefined,
      speaking: p.speaking
        ? speakingSpec({
            format: u(p.speaking.format.value, PAGE_ONLY),
            prepSeconds: v(1200, P1, "20 Minuten Vorbereitung"),
            responseSeconds: u(p.speaking.responseSeconds.value, PAGE_ONLY),
            maxRawPoints: u(p.speaking.maxRawPoints.value, PAGE_ONLY),
          })
        : undefined,
    })),
  }));
}

export const telcB1: Blueprint = {
  key: "telc-b1",
  version: "2026.10.1",
  provider: "telc",
  level: "B1",
  officialName: "Zertifikat Deutsch / telc Deutsch B1",
  variant: "Allgemeinsprache",
  verifiedAt: VERIFIED_AT,
  sources: sources("telcB1Page"),
  moduleIndependence: u("Not stated on the exam page read.", PAGE_ONLY),
  speakingFormat: v("Pair examination with 20 minutes preparation time.", P1),
  specialRules: [v("Written exam without break.", P1)],
  timeGroups: [
    { id: "lv-sb", sectionIds: ["leseverstehen", "sprachbausteine"], minutes: v(90, P1, "90 min listed for the reading block; grouping with Sprachbausteine follows the B2 handbook"), labelDe: "Leseverstehen und Sprachbausteine" },
  ],
  sections: telcB1Sections(),
  scoring: {
    reporting: u("total", PAGE_ONLY),
    totalMax: u(300, PAGE_ONLY),
    passRule: u({ kind: "components_percent_min", writtenPercent: 60, oralPercent: 60 }, PAGE_ONLY),
    rounding: u("round_total", PAGE_ONLY),
  },
  adminNotes: [
    "Structure (3 Leseverstehen, 2 Sprachbausteine, 3 Hörverstehen, 1 Schriftlicher Ausdruck, 3 Mündlicher Ausdruck) is verified; item counts and points are proposed from telc B2 and must be checked against the telc B1 Übungstest.",
  ],
};

/* ------------------------------------------------------------------------------------------ */
/* Start Deutsch 1 / telc Deutsch A1                                                           */
/* ------------------------------------------------------------------------------------------ */

const PA1 = "telcA1Page";
const UT = "telcA1Uebungstest1";

export const telcA1: Blueprint = {
  key: "telc-a1-sd1",
  version: "2026.10.2",
  provider: "telc",
  level: "A1",
  officialName: "Start Deutsch 1 / telc Deutsch A1",
  variant: "Erwachsene",
  verifiedAt: "2026-10-20",
  sources: sources("telcA1Page", "telcA1Uebungstest1"),
  moduleIndependence: v("Cannot be taken as a partial examination.", PA1),
  speakingFormat: v("Oral exam usually with 4 test takers, no preparation time.", PA1),
  specialRules: [
    v("No break in the written exam.", PA1),
    v("Hören Teil 1 and 2 and every Lesen part start with a worked example (Beispiel); Hören Teil 3 has none.", UT, "S. 8–19"),
  ],
  timeGroups: [
    { id: "lesen-schreiben", sectionIds: ["lesen", "schreiben"], minutes: v(45, PA1, "Lesen und Schreiben 45 Minuten"), labelDe: "Lesen und Schreiben" },
  ],
  sections: [
    {
      id: "hoeren", skill: "listening", titleDe: "Hören", titleEn: "Listening", order: 1, component: "written",
      durationMinutes: v(20, PA1, "ca. 20 Minuten"), rawMax: v(15, UT, "Testformat S. 5: Hören 15 Punkte"), scaledMax: v(15, UT, "Ergebnisblatt M10: Punkte /15, no conversion"),
      parts: [
        {
          id: "hoeren-1", number: 1, titleDe: "Hören Teil 1",
          descriptionEn: "Six short everyday conversations; three-option multiple choice, heard twice.",
          instructionsDe: "Sie hören kurze Gespräche. Sie hören jeden Text zweimal. Kreuzen Sie an: a, b oder c.",
          itemType: v("mc", UT, "S. 8–9: a, b oder c"), optionsPerItem: v(3, UT, "S. 8–9"),
          itemCount: v(6, UT, "S. 8–9: Aufgaben 1–6"), pointsPerItem: v(1, UT, "Derived: 15 items, 15 points"),
          textTypes: v(["Alltagsgespräch"], UT, "S. 8–9"), playbacks: v(2, UT, "S. 8: Sie hören jeden Text zweimal."),
        },
        {
          id: "hoeren-2", number: 2, titleDe: "Hören Teil 2",
          descriptionEn: "Four public announcements; true/false, heard once.",
          instructionsDe: "Sie hören Durchsagen. Sie hören jeden Text einmal. Kreuzen Sie an: Richtig oder Falsch.",
          itemType: v("true_false", UT, "S. 10: Richtig (+) oder falsch (–)"),
          itemCount: v(4, UT, "S. 10: Aufgaben 7–10"), pointsPerItem: v(1, UT, "Derived: 15 items, 15 points"),
          textTypes: v(["Durchsage"], UT, "S. 10"), playbacks: v(1, UT, "S. 10: Sie hören jeden Text einmal."),
        },
        {
          id: "hoeren-3", number: 3, titleDe: "Hören Teil 3",
          descriptionEn: "Five telephone messages; three-option multiple choice, heard twice, no example.",
          instructionsDe: "Sie hören Ansagen am Telefon. Sie hören jeden Text zweimal. Kreuzen Sie an: a, b oder c.",
          itemType: v("mc", UT, "S. 11: a, b oder c"), optionsPerItem: v(3, UT, "S. 11"),
          itemCount: v(5, UT, "S. 11: Aufgaben 11–15"), pointsPerItem: v(1, UT, "Derived: 15 items, 15 points"),
          textTypes: v(["Telefonansage"], UT, "S. 11"), playbacks: v(2, UT, "S. 11: Sie hören jeden Text zweimal."),
        },
      ],
    },
    {
      id: "lesen", skill: "reading", titleDe: "Lesen", titleEn: "Reading", order: 2, component: "written",
      durationMinutes: v(25, UT, "S. 13: ca. 25 Minuten"), timeGroupId: "lesen-schreiben", rawMax: v(15, UT, "Ergebnisblatt M10: Punkte /15"), scaledMax: v(15, UT, "Ergebnisblatt M10: Punkte /15, no conversion"),
      parts: [
        {
          id: "lesen-1", number: 1, titleDe: "Lesen Teil 1",
          descriptionEn: "Two short texts (note, invitation or e-mail); five true/false statements.",
          instructionsDe: "Lesen Sie die zwei Texte. Sind die Aussagen 1–5 richtig oder falsch? Kreuzen Sie an.",
          itemType: v("true_false", UT, "S. 14–15"), itemCount: v(5, UT, "S. 14–15: Aussagen 1–5"),
          pointsPerItem: v(1, UT, "Derived: 15 items, 15 points"), textTypes: v(["Notiz", "Einladung", "E-Mail"], UT, "S. 14–15"),
        },
        {
          id: "lesen-2", number: 2, titleDe: "Lesen Teil 2",
          descriptionEn: "Five situations, each with two ads or web snippets; choose the useful one (a or b).",
          instructionsDe: "Lesen Sie die Aufgaben 6–10 und die Texte. Welche Anzeige ist interessant für Sie? Kreuzen Sie an: a oder b.",
          itemType: v("ab", UT, "S. 16–17"), optionsPerItem: v(2, UT, "S. 16–17: zwei Anzeigen pro Aufgabe"),
          itemCount: v(5, UT, "S. 16–17: Aufgaben 6–10"), pointsPerItem: v(1, UT, "Derived: 15 items, 15 points"),
          textTypes: v(["Anzeige", "Webseite"], UT, "S. 16–17"),
        },
        {
          id: "lesen-3", number: 3, titleDe: "Lesen Teil 3",
          descriptionEn: "Five short signs or notices (school, post office, station, restaurant, bus stop); true/false.",
          instructionsDe: "Lesen Sie die Texte und die Aufgaben 11–15. Kreuzen Sie an: Richtig oder Falsch.",
          itemType: v("true_false", UT, "S. 18–19"), itemCount: v(5, UT, "S. 18–19: Aufgaben 11–15"),
          pointsPerItem: v(1, UT, "Derived: 15 items, 15 points"), textTypes: v(["Schild", "Aushang"], UT, "S. 18–19"),
        },
      ],
    },
    {
      id: "schreiben", skill: "writing", titleDe: "Schreiben", titleEn: "Writing", order: 3, component: "written",
      durationMinutes: v(20, UT, "S. 13: ca. 20 Minuten"), timeGroupId: "lesen-schreiben", rawMax: v(15, UT, "Ergebnisblatt M10: Punkte /15 (Teil 1 5 + Teil 2 10)"), scaledMax: v(15, UT, "Ergebnisblatt M10: Punkte /15, no conversion"),
      parts: [
        {
          id: "schreiben-1", number: 1, titleDe: "Schreiben Teil 1",
          descriptionEn: "Read a short text and fill in the five missing fields of a partly completed form.",
          instructionsDe: "Lesen Sie den Text. Schreiben Sie die fünf fehlenden Informationen in das Formular.",
          itemType: v("short_text", UT, "S. 20"), itemCount: v(5, UT, "S. 20: fünf fehlende Informationen"),
          pointsPerItem: v(1, UT, "Derived: Schreiben 15 − Teil 2 max. 10 = 5 for five fields"), textTypes: v(["Formular"], UT, "S. 20"),
        },
        {
          id: "schreiben-2", number: 2, titleDe: "Schreiben Teil 2",
          descriptionEn: "Short message covering three guiding points, one to two sentences each (about 30 words), with greeting and closing.",
          instructionsDe: "Schreiben Sie zu jedem Punkt ein bis zwei Sätze (circa 30 Wörter). Schreiben Sie auch eine Anrede und einen Gruß.",
          itemType: v("writing", UT, "S. 21"), itemCount: v(1, UT, "S. 21"), textTypes: v(["Kurzmitteilung", "E-Mail"], UT, "S. 21"),
          writing: {
            approxWords: v(30, UT, "S. 21: circa 30 Wörter"),
            criteria: v(
              ["Inhaltspunkt 1 (0 / 1,5 / 3)", "Inhaltspunkt 2 (0 / 1,5 / 3)", "Inhaltspunkt 3 (0 / 1,5 / 3)", "Kommunikative Gestaltung: Anrede, Gruß (0 / 0,5 / 1)"],
              UT,
              "Bewertung Schreiben Teil 2",
            ),
            maxRawPoints: v(10, UT, "Es können maximal 10 Punkte vergeben werden."),
          },
        },
      ],
    },
    {
      id: "sprechen", skill: "speaking", titleDe: "Sprechen", titleEn: "Speaking", order: 4, component: "oral",
      durationMinutes: v(15, PA1, "ca. 15 Minuten"), rawMax: v(15, UT, "M10: Punkte /15 (3 + 6 + 6)"), scaledMax: v(15, UT, "M10: Punkte /15, no conversion"),
      parts: [
        {
          id: "sprechen-1", number: 1, titleDe: "Sprechen Teil 1 — Sich vorstellen",
          descriptionEn: "Introduce yourself with seven keywords, spell a word and say a number.",
          instructionsDe: "Stellen Sie sich vor. Sprechen Sie über: Name, Alter, Land, Wohnort, Sprachen, Beruf, Hobby. Buchstabieren Sie dann ein Wort und nennen Sie eine Zahl.",
          itemType: v("speaking", UT, "S. 24"), itemCount: v(1, UT, "S. 24"), textTypes: v(["Stichwortliste"], UT, "S. 24"),
          speaking: speakingSpec({ format: v("monologue", UT, "S. 24"), prepSeconds: v(0, PA1, "No preparation time"), responseSeconds: u(60, "ca. 3 Minuten for the whole group; time per candidate is not stated."), maxRawPoints: v(3, UT, "M10: Vorstellen, Buchstabieren, Zahlen je max. 1") }),
        },
        {
          id: "sprechen-2", number: 2, titleDe: "Sprechen Teil 2 — Um Informationen bitten und Informationen geben",
          descriptionEn: "Two themes with word cards; ask two questions and answer two questions.",
          instructionsDe: "Sie bekommen zwei Karten mit einem Thema und einem Wort. Stellen Sie eine Frage zu Ihrer Karte. Ihre Partnerin / Ihr Partner antwortet.",
          itemType: v("speaking", UT, "S. 25"), itemCount: v(1, UT, "S. 25"), textTypes: v(["Wortkarte (Thema + Wort)"], UT, "S. 25: zwei Themen, je sechs Karten"),
          speaking: speakingSpec({ format: v("interaction", UT, "S. 25"), prepSeconds: v(0, PA1, "No preparation time"), responseSeconds: u(60, "ca. 4 Minuten for the whole group; time per candidate is not stated."), maxRawPoints: v(6, UT, "M10: Frage max. 2, Antwort max. 1, zweimal") }),
        },
        {
          id: "sprechen-3", number: 3, titleDe: "Sprechen Teil 3 — Bitten formulieren und darauf reagieren",
          descriptionEn: "With action cards, make two requests and react to two requests.",
          instructionsDe: "Sie bekommen zwei Karten. Formulieren Sie eine Bitte zu Ihrer Karte. Ihre Partnerin / Ihr Partner reagiert.",
          itemType: v("speaking", UT, "S. 26"), itemCount: v(1, UT, "S. 26"), textTypes: u(["Handlungskarte (Bild)"], "Handlungskarten are verified; that they show pictures is not visible in the text version read."),
          speaking: speakingSpec({ format: v("interaction", UT, "S. 26"), prepSeconds: v(0, PA1, "No preparation time"), responseSeconds: u(60, "ca. 4 Minuten for the whole group; time per candidate is not stated."), maxRawPoints: v(6, UT, "M10: Bitte max. 2, Reaktion max. 1, zweimal") }),
        },
      ],
    },
  ],
  scoring: {
    reporting: v("total", UT, "Testformat S. 5: Gesamt 60"),
    totalMax: v(60, UT, "Testformat S. 5: Gesamt 60"),
    passRule: u({ kind: "total_min", minTotal: 36 }, "The Übungstest lists Prädikate (ausreichend from 36 points, below that 'teilgenommen') but states no explicit pass rule; confirm from the telc Prüfungsordnung."),
    rounding: v("half_points", UT, "Bands use half points, e.g. 48–53,5"),
    gradeBands: v(TELC_A1_GRADE_BANDS, UT, "S. 5: 54–60 sehr gut, 48–53,5 gut, 42–47,5 befriedigend, 36–41,5 ausreichend, 0–35,5 teilgenommen"),
  },
  adminNotes: [
    "Item counts, playbacks and points come from the telc Start Deutsch 1 Übungstest 1 (2021). Points per objective item (1) are derived from the 15-point section totals.",
    "Pass rule is not stated explicitly; it is inferred from the lowest passing Prädikat (ausreichend, 36 of 60).",
  ],
};

/* ------------------------------------------------------------------------------------------ */
/* Start Deutsch 2 / telc Deutsch A2                                                           */
/* ------------------------------------------------------------------------------------------ */

const PA2 = "telcA2Page";

export const telcA2: Blueprint = {
  key: "telc-a2-sd2",
  version: "2026.10.1",
  provider: "telc",
  level: "A2",
  officialName: "Start Deutsch 2 / telc Deutsch A2",
  variant: "Erwachsene",
  verifiedAt: VERIFIED_AT,
  sources: sources("telcA2Page"),
  moduleIndependence: v("Cannot be taken as a partial examination.", PA2),
  speakingFormat: v("Oral exam usually with 2 test takers, no preparation time.", PA2),
  specialRules: [v("No break in the written exam.", PA2)],
  timeGroups: [
    { id: "lesen-schreiben", sectionIds: ["lesen", "schreiben"], minutes: u(50, "Page lists 50 min for Lesen and no separate time for Schreiben; combined grouping unconfirmed."), labelDe: "Lesen und Schreiben" },
  ],
  sections: [
    {
      id: "hoeren", skill: "listening", titleDe: "Hören", titleEn: "Listening", order: 1, component: "written",
      durationMinutes: v(20, PA2, "ca. 20 Minuten"), rawMax: u(null, PAGE_ONLY), scaledMax: u(null, PAGE_ONLY),
      parts: [1, 2, 3].map((n) => proposedPart({ sectionId: "hoeren", number: n, titleDe: `Hören Teil ${n}`, descriptionEn: "Listening task (format to confirm).", instructionsDe: "Hören Sie und lösen Sie die Aufgaben.", itemType: n === 2 ? "true_false" : "mc", itemCount: 5, optionsPerItem: n === 2 ? undefined : 3, playbacks: 2, textTypes: ["Gespräch", "Durchsage"], note: PAGE_ONLY })),
    },
    {
      id: "lesen", skill: "reading", titleDe: "Lesen", titleEn: "Reading", order: 2, component: "written",
      durationMinutes: v(null, PA2), timeGroupId: "lesen-schreiben", rawMax: u(null, PAGE_ONLY), scaledMax: u(null, PAGE_ONLY),
      parts: [1, 2, 3].map((n) => proposedPart({ sectionId: "lesen", number: n, titleDe: `Lesen Teil ${n}`, descriptionEn: "Reading task (format to confirm).", instructionsDe: "Lesen Sie die Texte und lösen Sie die Aufgaben.", itemType: n === 3 ? "matching" : "mc", itemCount: 5, optionsPerItem: n === 3 ? undefined : 3, optionPoolSize: n === 3 ? 6 : undefined, textTypes: ["Zeitungstext", "Anzeigen", "Informationstafel"], note: PAGE_ONLY })),
    },
    {
      id: "schreiben", skill: "writing", titleDe: "Schreiben", titleEn: "Writing", order: 3, component: "written",
      durationMinutes: v(null, PA2), timeGroupId: "lesen-schreiben", rawMax: u(null, PAGE_ONLY), scaledMax: u(null, PAGE_ONLY),
      parts: [
        proposedPart({ sectionId: "schreiben", number: 1, titleDe: "Schreiben Teil 1", descriptionEn: "Complete a form or short text.", instructionsDe: "Ergänzen Sie die fehlenden Informationen.", itemType: "short_text", itemCount: 5, textTypes: ["Formular"], note: PAGE_ONLY }),
        proposedPart({ sectionId: "schreiben", number: 2, titleDe: "Schreiben Teil 2", descriptionEn: "Short personal or semi-formal message.", instructionsDe: "Schreiben Sie eine Nachricht zu allen Punkten.", itemType: "writing", itemCount: 1, textTypes: ["E-Mail", "Brief"], writing: proposedWriting({ approxWords: 40, criteria: ["Inhaltspunkte", "Kommunikative Gestaltung", "Formale Richtigkeit"], maxRawPoints: null }) }),
      ],
    },
    {
      id: "sprechen", skill: "speaking", titleDe: "Sprechen", titleEn: "Speaking", order: 4, component: "oral",
      durationMinutes: v(15, PA2, "ca. 15 Minuten"), rawMax: u(null, PAGE_ONLY), scaledMax: u(null, PAGE_ONLY),
      parts: [1, 2, 3].map((n) => ({
        id: `sprechen-${n}`, number: n, titleDe: `Sprechen Teil ${n}`,
        descriptionEn: ["Ask and answer questions about yourself.", "Talk about your life.", "Plan something together."][n - 1],
        instructionsDe: ["Stellen Sie Fragen und antworten Sie.", "Erzählen Sie von sich.", "Planen Sie gemeinsam etwas."][n - 1],
        itemType: v("speaking" as const, PA2), itemCount: u(1, PAGE_ONLY), textTypes: u(["Karte"], PAGE_ONLY),
        speaking: speakingSpec({ format: u(n === 2 ? "monologue" : "interaction", PAGE_ONLY), prepSeconds: v(0, PA2, "No preparation time"), responseSeconds: u(180, PAGE_ONLY), maxRawPoints: u(null, PAGE_ONLY) }),
      })),
    },
  ],
  scoring: {
    reporting: u("total", PAGE_ONLY),
    totalMax: u(null, PAGE_ONLY),
    passRule: u(null, PAGE_ONLY),
    rounding: u("round_total", PAGE_ONLY),
  },
  adminNotes: ["Only parts and durations are verified. Confirm task formats, items, points and pass rule from the telc A2 Übungstest before publication."],
};
