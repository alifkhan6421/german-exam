import { proposedPart, proposedWriting, speakingSpec } from "./builders";
import { GOETHE_GRADE_BANDS, sources, u, v, VERIFIED_AT } from "./facts";
import type { Blueprint } from "./types";

const UNSPLIT = "Module total is verified; the per-part breakdown is not stated in the sources read.";

/* ------------------------------------------------------------------------------------------ */
/* Goethe-Zertifikat A2                                                                        */
/* ------------------------------------------------------------------------------------------ */

const A2 = "goetheA2Rules";

export const goetheA2: Blueprint = {
  key: "goethe-a2",
  version: "2026.10.1",
  provider: "goethe",
  level: "A2",
  officialName: "Goethe-Zertifikat A2",
  variant: "Erwachsene",
  verifiedAt: VERIFIED_AT,
  sources: sources("goetheA2Page", "goetheA2Rules"),
  moduleIndependence: v(
    "Written and oral parts are both compulsory. Partial resits (oral, or entire written part) only in exceptional cases within one year.",
    A2,
    "§1.1, §7",
  ),
  speakingFormat: v("Pair exam (individual in exceptional cases), no preparation time.", A2, "§1.4, §3.2"),
  specialRules: [
    v("No preparation time for Sprechen.", A2, "§1.4"),
    v("Writing texts are written directly on the answer sheet.", A2, "§2"),
  ],
  timeGroups: [],
  sections: [
    {
      id: "lesen",
      skill: "reading",
      titleDe: "Lesen",
      titleEn: "Reading",
      order: 1,
      component: "written",
      durationMinutes: v(30, A2, "§1.4"),
      rawMax: v(20, A2, "§4.1: 20 items"),
      scaledMax: v(25, A2, "§4.1: × 1.25"),
      scaleFactor: v(1.25, A2, "§4.1"),
      parts: [
        proposedPart({ sectionId: "lesen", number: 1, titleDe: "Lesen Teil 1", descriptionEn: "Short newspaper article; multiple choice.", instructionsDe: "Lesen Sie den Text aus der Zeitung. Wählen Sie für die Aufgaben 1 bis 5 die richtige Lösung a, b oder c.", itemType: "mc", itemCount: 5, optionsPerItem: 3, textTypes: ["Zeitungsartikel"], note: UNSPLIT }),
        proposedPart({ sectionId: "lesen", number: 2, titleDe: "Lesen Teil 2", descriptionEn: "Information board / directory; multiple choice.", instructionsDe: "Lesen Sie die Aufgaben 6 bis 10 und den Text. Wo finden Sie die Informationen? Wählen Sie die richtige Lösung a, b oder c.", itemType: "mc", itemCount: 5, optionsPerItem: 3, textTypes: ["Informationstafel", "Wegweiser"], note: UNSPLIT }),
        proposedPart({ sectionId: "lesen", number: 3, titleDe: "Lesen Teil 3", descriptionEn: "Personal e-mail; multiple choice.", instructionsDe: "Lesen Sie die E-Mail. Wählen Sie für die Aufgaben 11 bis 15 die richtige Lösung a, b oder c.", itemType: "mc", itemCount: 5, optionsPerItem: 3, textTypes: ["E-Mail"], note: UNSPLIT }),
        proposedPart({ sectionId: "lesen", number: 4, titleDe: "Lesen Teil 4", descriptionEn: "Ads matched to people's needs.", instructionsDe: "Sechs Personen suchen im Internet nach Informationen. Lesen Sie die Aufgaben 16 bis 20 und die Anzeigen a bis f. Welche Anzeige passt zu welcher Person?", itemType: "matching", itemCount: 5, optionPoolSize: 6, textTypes: ["Anzeigen"], note: UNSPLIT }),
      ],
    },
    {
      id: "hoeren",
      skill: "listening",
      titleDe: "Hören",
      titleEn: "Listening",
      order: 2,
      component: "written",
      durationMinutes: v(30, A2, "§1.4: ca. 30 Minuten"),
      rawMax: v(20, A2, "§4.2: 20 items"),
      scaledMax: v(25, A2, "§4.2: × 1.25"),
      scaleFactor: v(1.25, A2, "§4.2"),
      parts: [
        proposedPart({ sectionId: "hoeren", number: 1, titleDe: "Hören Teil 1", descriptionEn: "Short radio/phone texts; multiple choice.", instructionsDe: "Sie hören fünf kurze Texte. Sie hören jeden Text zweimal. Wählen Sie für die Aufgaben 1 bis 5 die richtige Lösung a, b oder c.", itemType: "mc", itemCount: 5, optionsPerItem: 3, playbacks: 2, textTypes: ["Radiodurchsage", "Telefonansage"], note: UNSPLIT }),
        proposedPart({ sectionId: "hoeren", number: 2, titleDe: "Hören Teil 2", descriptionEn: "Conversation; assign pictures/options to people or days.", instructionsDe: "Sie hören ein Gespräch. Sie hören den Text einmal. Wählen Sie für die Aufgaben 6 bis 10 ein passendes Bild aus a bis i.", itemType: "matching", itemCount: 5, optionPoolSize: 9, playbacks: 1, textTypes: ["Gespräch"], note: UNSPLIT }),
        proposedPart({ sectionId: "hoeren", number: 3, titleDe: "Hören Teil 3", descriptionEn: "Short everyday conversations; picture-supported multiple choice.", instructionsDe: "Sie hören fünf kurze Gespräche. Sie hören jeden Text einmal. Wählen Sie für die Aufgaben 11 bis 15 die richtige Lösung a, b oder c.", itemType: "mc", itemCount: 5, optionsPerItem: 3, playbacks: 1, textTypes: ["Alltagsgespräch"], note: UNSPLIT }),
        proposedPart({ sectionId: "hoeren", number: 4, titleDe: "Hören Teil 4", descriptionEn: "Radio interview; true/false (ja/nein).", instructionsDe: "Sie hören ein Interview. Sie hören den Text zweimal. Wählen Sie für die Aufgaben 16 bis 20 Ja oder Nein.", itemType: "true_false", itemCount: 5, playbacks: 2, textTypes: ["Radiointerview"], note: UNSPLIT }),
      ],
    },
    {
      id: "schreiben",
      skill: "writing",
      titleDe: "Schreiben",
      titleEn: "Writing",
      order: 3,
      component: "written",
      durationMinutes: v(30, A2, "§1.4"),
      rawMax: v(20, A2, "§4.3"),
      scaledMax: v(25, A2, "§4.3: × 1.25"),
      scaleFactor: v(1.25, A2, "§4.3"),
      parts: [
        proposedPart({ sectionId: "schreiben", number: 1, titleDe: "Schreiben Teil 1", descriptionEn: "Short informal message (e.g. SMS).", instructionsDe: "Schreiben Sie eine SMS. Schreiben Sie zu jedem Punkt ein bis zwei Sätze (circa 20–30 Wörter).", itemType: "writing", itemCount: 1, textTypes: ["SMS", "Kurznachricht"], writing: proposedWriting({ approxWords: 25, criteria: ["Erfüllung der Aufgabenstellung", "Kommunikative Gestaltung", "Formale Richtigkeit"], maxRawPoints: 10 }) }),
        proposedPart({ sectionId: "schreiben", number: 2, titleDe: "Schreiben Teil 2", descriptionEn: "Short semi-formal e-mail.", instructionsDe: "Schreiben Sie eine E-Mail. Schreiben Sie zu jedem Punkt ein bis zwei Sätze (circa 30–40 Wörter). Vergessen Sie nicht Anrede und Gruß.", itemType: "writing", itemCount: 1, textTypes: ["E-Mail"], writing: proposedWriting({ approxWords: 35, criteria: ["Erfüllung der Aufgabenstellung", "Kommunikative Gestaltung", "Formale Richtigkeit"], maxRawPoints: 10 }) }),
      ],
    },
    {
      id: "sprechen",
      skill: "speaking",
      titleDe: "Sprechen",
      titleEn: "Speaking",
      order: 4,
      component: "oral",
      durationMinutes: v(15, A2, "§1.4: pair exam 15 min (individual 10 min)"),
      rawMax: v(25, A2, "§5"),
      scaledMax: v(25, A2, "§5"),
      parts: [
        { id: "sprechen-1", number: 1, titleDe: "Sprechen Teil 1 — Fragen stellen und beantworten", descriptionEn: "Ask four questions using keyword cards and answer your partner's questions.", instructionsDe: "Sie bekommen vier Karten. Stellen Sie mit den Wörtern Fragen und antworten Sie auf die Fragen Ihrer Partnerin / Ihres Partners.", itemType: v("speaking", A2, "§3"), itemCount: v(1, A2, "§3"), textTypes: v(["Stichwortkarten"], A2, "§3"), speaking: speakingSpec({ format: v("interaction", A2, "§3"), prepSeconds: v(0, A2, "§1.4"), responseSeconds: v(180, A2, "§3: ca. 3 Minuten"), maxRawPoints: u(null, UNSPLIT) }) },
        { id: "sprechen-2", number: 2, titleDe: "Sprechen Teil 2 — Über sich sprechen", descriptionEn: "Talk about yourself using keywords, then answer one or two examiner questions.", instructionsDe: "Sie bekommen eine Karte mit einer Frage und Stichpunkten. Erzählen Sie über sich.", itemType: v("speaking", A2, "§3"), itemCount: v(1, A2, "§3"), textTypes: v(["Aufgabenkarte"], A2, "§3"), speaking: speakingSpec({ format: v("monologue_and_interaction", A2, "§3"), prepSeconds: v(0, A2, "§1.4"), responseSeconds: v(180, A2, "§3: ca. 3 Minuten pro Teilnehmendem"), maxRawPoints: u(null, UNSPLIT) }) },
        { id: "sprechen-3", number: 3, titleDe: "Sprechen Teil 3 — Gemeinsam etwas planen", descriptionEn: "Plan something together: ask, suggest and respond.", instructionsDe: "Sie möchten zusammen etwas planen. Finden Sie einen Termin. Machen Sie Vorschläge und reagieren Sie auf die Vorschläge Ihrer Partnerin / Ihres Partners.", itemType: v("speaking", A2, "§3"), itemCount: v(1, A2, "§3"), textTypes: v(["Terminkalender"], A2, "§3"), speaking: speakingSpec({ format: v("interaction", A2, "§3"), prepSeconds: v(0, A2, "§1.4"), responseSeconds: v(300, A2, "§3: ca. 5 Minuten"), maxRawPoints: u(null, UNSPLIT) }) },
      ],
    },
  ],
  scoring: {
    reporting: v("total", A2, "§6"),
    totalMax: v(100, A2, "§6.3"),
    passRule: v({ kind: "total_and_components_min", minTotal: 60, minWritten: 45, minOral: 15 }, A2, "§6.3"),
    rounding: v("round_total", A2, "§6.1"),
    gradeBands: v(GOETHE_GRADE_BANDS, A2, "§6.2"),
  },
  adminNotes: ["Per-part item counts, task types and playback counts must be confirmed from a current Goethe A2 Modellsatz."],
};

/* ------------------------------------------------------------------------------------------ */
/* Goethe-Zertifikat B1                                                                        */
/* ------------------------------------------------------------------------------------------ */

const B1 = "goetheB1Rules";

export const goetheB1: Blueprint = {
  key: "goethe-b1",
  version: "2026.10.1",
  provider: "goethe",
  level: "B1",
  officialName: "Goethe-Zertifikat B1",
  variant: "Erwachsene",
  verifiedAt: VERIFIED_AT,
  sources: sources("goetheB1Page", "goetheB1Rules"),
  moduleIndependence: v("The four modules may be taken individually or in combination.", B1, "§1.1, §1.3"),
  speakingFormat: v("Pair exam (individual in exceptional cases), 15 minutes preparation.", B1, "§1.4"),
  specialRules: [
    v("Sprechen Teil 2 offers a choice of two topics.", B1, "§1.2"),
    v("Brief notes from the preparation time may be used in Sprechen.", B1, "§3.2"),
  ],
  timeGroups: [],
  sections: [
    {
      id: "lesen", skill: "reading", titleDe: "Lesen", titleEn: "Reading", order: 1, component: "written",
      durationMinutes: v(65, B1, "§1.4"), rawMax: v(30, B1, "§4.1"), scaledMax: v(100, B1, "§4.1"), scaleFactor: v(3.33, B1, "§4.1"),
      parts: [
        proposedPart({ sectionId: "lesen", number: 1, titleDe: "Lesen Teil 1", descriptionEn: "Blog post; true/false.", instructionsDe: "Lesen Sie den Text und die Aufgaben 1 bis 6 dazu. Wählen Sie: Sind die Aussagen Richtig oder Falsch?", itemType: "true_false", itemCount: 6, textTypes: ["Blogeintrag"], note: UNSPLIT }),
        proposedPart({ sectionId: "lesen", number: 2, titleDe: "Lesen Teil 2", descriptionEn: "Two press articles; multiple choice.", instructionsDe: "Lesen Sie die Texte und die Aufgaben 7 bis 12 dazu. Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c.", itemType: "mc", itemCount: 6, optionsPerItem: 3, textTypes: ["Zeitungsartikel"], note: UNSPLIT }),
        proposedPart({ sectionId: "lesen", number: 3, titleDe: "Lesen Teil 3", descriptionEn: "Ads matched to situations (one situation may have no match).", instructionsDe: "Lesen Sie die Situationen 13 bis 19 und die Anzeigen a bis j. Wählen Sie: Welche Anzeige passt zu welcher Situation? Für eine Aufgabe gibt es keine passende Anzeige.", itemType: "matching", itemCount: 7, optionPoolSize: 10, textTypes: ["Anzeigen"], note: UNSPLIT }),
        proposedPart({ sectionId: "lesen", number: 4, titleDe: "Lesen Teil 4", descriptionEn: "Readers' opinions; for or against (ja/nein).", instructionsDe: "Lesen Sie die Texte 20 bis 26. Wählen Sie: Ist die Person für ein Verbot?", itemType: "true_false", itemCount: 7, textTypes: ["Leserbriefe", "Kommentare"], note: UNSPLIT }),
        proposedPart({ sectionId: "lesen", number: 5, titleDe: "Lesen Teil 5", descriptionEn: "Rules/regulations; multiple choice.", instructionsDe: "Lesen Sie die Aufgaben 27 bis 30 und den Text dazu. Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c.", itemType: "mc", itemCount: 4, optionsPerItem: 3, textTypes: ["Hausordnung", "Anleitung"], note: UNSPLIT }),
      ],
    },
    {
      id: "hoeren", skill: "listening", titleDe: "Hören", titleEn: "Listening", order: 2, component: "written",
      durationMinutes: v(40, B1, "§1.4: ca. 40 Minuten"), rawMax: v(30, B1, "§4.2"), scaledMax: v(100, B1, "§4.2"), scaleFactor: v(3.33, B1, "§4.2"),
      parts: [
        proposedPart({ sectionId: "hoeren", number: 1, titleDe: "Hören Teil 1", descriptionEn: "Five short texts, two items each.", instructionsDe: "Sie hören nun fünf kurze Texte. Sie hören jeden Text zweimal. Zu jedem Text lösen Sie zwei Aufgaben.", itemType: "mc", itemCount: 10, optionsPerItem: 3, playbacks: 2, textTypes: ["Ansage", "Durchsage", "Nachricht"], note: UNSPLIT }),
        proposedPart({ sectionId: "hoeren", number: 2, titleDe: "Hören Teil 2", descriptionEn: "Guided tour / talk; multiple choice.", instructionsDe: "Sie hören einen Text. Sie hören den Text einmal. Dazu lösen Sie fünf Aufgaben.", itemType: "mc", itemCount: 5, optionsPerItem: 3, playbacks: 1, textTypes: ["Führung", "Vortrag"], note: UNSPLIT }),
        proposedPart({ sectionId: "hoeren", number: 3, titleDe: "Hören Teil 3", descriptionEn: "Informal conversation; true/false.", instructionsDe: "Sie hören ein Gespräch. Sie hören das Gespräch einmal. Dazu lösen Sie sieben Aufgaben.", itemType: "true_false", itemCount: 7, playbacks: 1, textTypes: ["Gespräch"], note: UNSPLIT }),
        proposedPart({ sectionId: "hoeren", number: 4, titleDe: "Hören Teil 4", descriptionEn: "Radio discussion; assign statements to speakers.", instructionsDe: "Sie hören eine Diskussion. Sie hören die Diskussion zweimal. Dazu lösen Sie acht Aufgaben. Wer sagt was?", itemType: "matching", itemCount: 8, optionPoolSize: 3, playbacks: 2, textTypes: ["Radiodiskussion"], note: UNSPLIT }),
      ],
    },
    {
      id: "schreiben", skill: "writing", titleDe: "Schreiben", titleEn: "Writing", order: 3, component: "written",
      durationMinutes: v(60, B1, "§1.4"), rawMax: v(100, B1, "§4.3"), scaledMax: v(100, B1, "§4.3"),
      parts: [
        proposedPart({ sectionId: "schreiben", number: 1, titleDe: "Schreiben Teil 1", descriptionEn: "Personal e-mail, about 80 words.", instructionsDe: "Schreiben Sie eine E-Mail (circa 80 Wörter). Schreiben Sie etwas zu allen drei Punkten.", itemType: "writing", itemCount: 1, textTypes: ["Persönliche E-Mail"], writing: proposedWriting({ approxWords: 80, criteria: ["Erfüllung", "Kohärenz", "Wortschatz", "Strukturen"], maxRawPoints: 40 }) }),
        proposedPart({ sectionId: "schreiben", number: 2, titleDe: "Schreiben Teil 2", descriptionEn: "Forum post giving an opinion, about 80 words.", instructionsDe: "Sie haben im Fernsehen eine Diskussionssendung gesehen. Im Online-Gästebuch der Sendung schreiben Sie Ihre Meinung (circa 80 Wörter).", itemType: "writing", itemCount: 1, textTypes: ["Forumsbeitrag"], writing: proposedWriting({ approxWords: 80, criteria: ["Erfüllung", "Kohärenz", "Wortschatz", "Strukturen"], maxRawPoints: 40 }) }),
        proposedPart({ sectionId: "schreiben", number: 3, titleDe: "Schreiben Teil 3", descriptionEn: "Formal message, about 40 words.", instructionsDe: "Schreiben Sie eine Nachricht (circa 40 Wörter). Vergessen Sie nicht die Anrede und den Gruß am Schluss.", itemType: "writing", itemCount: 1, textTypes: ["Formelle E-Mail"], writing: proposedWriting({ approxWords: 40, criteria: ["Erfüllung", "Kohärenz", "Wortschatz", "Strukturen"], maxRawPoints: 20 }) }),
      ],
    },
    {
      id: "sprechen", skill: "speaking", titleDe: "Sprechen", titleEn: "Speaking", order: 4, component: "oral",
      durationMinutes: v(15, B1, "§1.4 (+15 min preparation)"), rawMax: v(100, B1, "§5"), scaledMax: v(100, B1, "§5"),
      parts: [
        { id: "sprechen-1", number: 1, titleDe: "Sprechen Teil 1 — Gemeinsam etwas planen", descriptionEn: "Plan something together with your partner.", instructionsDe: "Sie möchten zusammen etwas planen. Sprechen Sie über die Punkte und finden Sie eine gemeinsame Lösung.", itemType: v("speaking", B1, "§3"), itemCount: v(1, B1, "§3"), textTypes: v(["Planungsaufgabe"], B1, "§3"), speaking: speakingSpec({ format: v("interaction", B1, "§3"), prepSeconds: v(900, B1, "§1.4: 15 Minuten Vorbereitung (gesamt)"), responseSeconds: v(180, B1, "§3: ca. 2–3 Minuten"), maxRawPoints: u(null, UNSPLIT) }) },
        { id: "sprechen-2", number: 2, titleDe: "Sprechen Teil 2 — Ein Thema präsentieren", descriptionEn: "Present a topic (choice of two) in structured slides.", instructionsDe: "Sie sollen Ihren Zuhörern ein aktuelles Thema präsentieren. Wählen Sie eines der beiden Themen.", itemType: v("speaking", B1, "§1.2, §3"), itemCount: v(1, B1, "§3"), textTypes: v(["Präsentationsfolien"], B1, "§1.2"), speaking: speakingSpec({ format: v("monologue", B1, "§3"), prepSeconds: v(900, B1, "§1.4"), responseSeconds: v(240, B1, "§3: ca. 3–4 Minuten"), maxRawPoints: u(null, UNSPLIT) }) },
        { id: "sprechen-3", number: 3, titleDe: "Sprechen Teil 3 — Über ein Thema sprechen", descriptionEn: "Respond to feedback and questions on your presentation; ask your partner a question.", instructionsDe: "Reagieren Sie auf die Rückmeldung und Fragen der Prüfenden und Ihrer Partnerin / Ihres Partners.", itemType: v("speaking", B1, "§3"), itemCount: v(1, B1, "§3"), textTypes: v(["Gespräch"], B1, "§3"), speaking: speakingSpec({ format: v("interaction", B1, "§3"), prepSeconds: v(0, B1, "§3"), responseSeconds: v(120, B1, "§3: ca. 1–2 Minuten"), maxRawPoints: u(null, UNSPLIT) }) },
      ],
    },
  ],
  scoring: {
    reporting: v("per_module", B1, "§6.1"),
    totalMax: v(null, B1, "§6: no combined total; each module 100 points"),
    passRule: v({ kind: "per_section_min", minPerSection: 60 }, B1, "§6.3"),
    rounding: v("round_each_section", B1, "§4.1–4.3"),
    gradeBands: v(GOETHE_GRADE_BANDS, B1, "§6.2"),
  },
  adminNotes: ["Per-part item counts, task types and playback counts must be confirmed from a current Goethe B1 Modellsatz."],
};

/* ------------------------------------------------------------------------------------------ */
/* Goethe-Zertifikat B2                                                                        */
/* ------------------------------------------------------------------------------------------ */

const B2 = "goetheB2Rules";

export const goetheB2: Blueprint = {
  key: "goethe-b2",
  version: "2026.10.1",
  provider: "goethe",
  level: "B2",
  officialName: "Goethe-Zertifikat B2",
  variant: "Erwachsene",
  verifiedAt: VERIFIED_AT,
  sources: sources("goetheB2Page", "goetheB2Rules"),
  moduleIndependence: v("Modules can be taken individually or in conjunction with one another.", B2, "§1.3"),
  speakingFormat: v("Pair exam (individual in exceptional cases), 15 minutes preparation.", B2, "§1.4"),
  specialRules: [
    v("Sprechen Teil 1 offers a choice of two topics.", B2, "§1.2"),
    v("About 5 minutes for transferring answers in Lesen and Hören.", B2, "§2"),
  ],
  timeGroups: [],
  sections: [
    {
      id: "lesen", skill: "reading", titleDe: "Lesen", titleEn: "Reading", order: 1, component: "written",
      durationMinutes: v(65, B2, "§1.4"), rawMax: v(30, B2, "§4.1"), scaledMax: v(100, B2, "§4.1"), scaleFactor: v(3.33, B2, "§4.1"),
      parts: [
        proposedPart({ sectionId: "lesen", number: 1, titleDe: "Lesen Teil 1", descriptionEn: "Four short texts; assign statements to authors.", instructionsDe: "Lesen Sie die Texte. Zu welchem Text passen die Aussagen? Die Texte können mehrmals gewählt werden.", itemType: "matching", itemCount: 9, optionPoolSize: 4, textTypes: ["Erfahrungsberichte", "Forumsbeiträge"], note: UNSPLIT }),
        proposedPart({ sectionId: "lesen", number: 2, titleDe: "Lesen Teil 2", descriptionEn: "Magazine article; multiple choice.", instructionsDe: "Lesen Sie den Text. Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c.", itemType: "mc", itemCount: 6, optionsPerItem: 3, textTypes: ["Zeitschriftenartikel"], note: UNSPLIT }),
        proposedPart({ sectionId: "lesen", number: 3, titleDe: "Lesen Teil 3", descriptionEn: "Article with removed sentences; fill gaps from a pool.", instructionsDe: "Lesen Sie den Text. Welcher Satz passt in welche Lücke? Zwei Sätze passen nicht.", itemType: "gap_select", itemCount: 6, optionPoolSize: 8, textTypes: ["Zeitungsartikel"], note: UNSPLIT }),
        proposedPart({ sectionId: "lesen", number: 4, titleDe: "Lesen Teil 4", descriptionEn: "Readers' comments; assign headlines/statements.", instructionsDe: "Lesen Sie die Kommentare. Welche Überschrift passt zu welchem Kommentar? Eine Überschrift passt nicht.", itemType: "matching", itemCount: 6, optionPoolSize: 7, textTypes: ["Leserkommentare"], note: UNSPLIT }),
        proposedPart({ sectionId: "lesen", number: 5, titleDe: "Lesen Teil 5", descriptionEn: "Regulations; assign headings to paragraphs.", instructionsDe: "Lesen Sie den Text. Welche Überschrift passt zu welchem Abschnitt?", itemType: "matching", itemCount: 3, optionPoolSize: 5, textTypes: ["Regelwerk", "Hausordnung"], note: UNSPLIT }),
      ],
    },
    {
      id: "hoeren", skill: "listening", titleDe: "Hören", titleEn: "Listening", order: 2, component: "written",
      durationMinutes: v(40, B2, "§1.4: ca. 40 Minuten"), rawMax: v(30, B2, "§4.2"), scaledMax: v(100, B2, "§4.2"), scaleFactor: v(3.33, B2, "§4.2"),
      parts: [
        proposedPart({ sectionId: "hoeren", number: 1, titleDe: "Hören Teil 1", descriptionEn: "Five short texts, two items each.", instructionsDe: "Sie hören fünf Texte. Sie hören jeden Text einmal. Zu jedem Text lösen Sie zwei Aufgaben.", itemType: "mc", itemCount: 10, optionsPerItem: 3, playbacks: 1, textTypes: ["Radiobeitrag", "Ansage"], note: UNSPLIT }),
        proposedPart({ sectionId: "hoeren", number: 2, titleDe: "Hören Teil 2", descriptionEn: "Radio interview; multiple choice.", instructionsDe: "Sie hören ein Interview. Sie hören den Text zweimal. Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c.", itemType: "mc", itemCount: 6, optionsPerItem: 3, playbacks: 2, textTypes: ["Interview"], note: UNSPLIT }),
        proposedPart({ sectionId: "hoeren", number: 3, titleDe: "Hören Teil 3", descriptionEn: "Talk show; who says what.", instructionsDe: "Sie hören eine Diskussion. Sie hören den Text einmal. Wer sagt was?", itemType: "matching", itemCount: 6, optionPoolSize: 3, playbacks: 1, textTypes: ["Talkshow"], note: UNSPLIT }),
        proposedPart({ sectionId: "hoeren", number: 4, titleDe: "Hören Teil 4", descriptionEn: "Lecture; multiple choice.", instructionsDe: "Sie hören einen Vortrag. Sie hören den Text zweimal. Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c.", itemType: "mc", itemCount: 8, optionsPerItem: 3, playbacks: 2, textTypes: ["Vortrag"], note: UNSPLIT }),
      ],
    },
    {
      id: "schreiben", skill: "writing", titleDe: "Schreiben", titleEn: "Writing", order: 3, component: "written",
      durationMinutes: v(75, B2, "§1.4"), rawMax: v(100, B2, "§4.3"), scaledMax: v(100, B2, "§4.3"),
      parts: [
        { id: "schreiben-1", number: 1, titleDe: "Schreiben Teil 1 — Forumsbeitrag", descriptionEn: "Forum post giving and justifying your opinion on a social issue.", instructionsDe: "Sie schreiben einen Forumsbeitrag zu einem aktuellen Thema. Begründen Sie Ihre Meinung.", itemType: v("writing", "goetheB2Page"), itemCount: v(1, "goetheB2Page"), textTypes: v(["Forumsbeitrag"], "goetheB2Page"), writing: proposedWriting({ approxWords: 150, criteria: ["Erfüllung", "Kohärenz", "Wortschatz", "Strukturen"], maxRawPoints: null }) },
        { id: "schreiben-2", number: 2, titleDe: "Schreiben Teil 2 — Formelle Nachricht", descriptionEn: "Formal message in a professional context.", instructionsDe: "Schreiben Sie eine formelle Nachricht im beruflichen Kontext.", itemType: v("writing", "goetheB2Page"), itemCount: v(1, "goetheB2Page"), textTypes: v(["Formelle Nachricht"], "goetheB2Page"), writing: proposedWriting({ approxWords: 100, criteria: ["Erfüllung", "Kohärenz", "Wortschatz", "Strukturen"], maxRawPoints: null }) },
      ],
    },
    {
      id: "sprechen", skill: "speaking", titleDe: "Sprechen", titleEn: "Speaking", order: 4, component: "oral",
      durationMinutes: v(15, B2, "§1.4 (+15 min preparation)"), rawMax: v(100, B2, "§5"), scaledMax: v(100, B2, "§5"),
      parts: [
        { id: "sprechen-1", number: 1, titleDe: "Sprechen Teil 1 — Vortrag halten", descriptionEn: "Short presentation on one of two topics, followed by questions.", instructionsDe: "Wählen Sie ein Thema und halten Sie einen kurzen Vortrag. Beantworten Sie danach Fragen.", itemType: v("speaking", B2, "§3.3"), itemCount: v(1, B2, "§3.3"), textTypes: v(["Themenblatt"], B2, "§1.2"), speaking: speakingSpec({ format: v("monologue_and_interaction", B2, "§3.3"), prepSeconds: v(900, B2, "§1.4"), responseSeconds: v(240, B2, "§3: ca. 4 Minuten pro Teilnehmendem"), maxRawPoints: u(null, UNSPLIT) }) },
        { id: "sprechen-2", number: 2, titleDe: "Sprechen Teil 2 — Diskussion führen", descriptionEn: "Joint discussion of a controversial topic.", instructionsDe: "Diskutieren Sie mit Ihrer Partnerin / Ihrem Partner über ein kontroverses Thema. Tauschen Sie Argumente aus.", itemType: v("speaking", B2, "§3.3"), itemCount: v(1, B2, "§3.3"), textTypes: v(["Diskussionsthema"], B2, "§3.3"), speaking: speakingSpec({ format: v("interaction", B2, "§3.3"), prepSeconds: v(900, B2, "§1.4"), responseSeconds: v(300, B2, "§3: ca. 5 Minuten für beide"), maxRawPoints: u(null, UNSPLIT) }) },
      ],
    },
  ],
  scoring: {
    reporting: v("per_module", B2, "§6.1"),
    totalMax: v(null, B2, "§6: no combined total"),
    passRule: v({ kind: "per_section_min", minPerSection: 60 }, B2, "§6.3"),
    rounding: v("round_each_section", B2, "§4–5"),
    gradeBands: v(GOETHE_GRADE_BANDS, B2, "§6.2"),
  },
  adminNotes: ["Per-part item counts, task types, playback counts and writing word counts must be confirmed from a current Goethe B2 Modellsatz."],
};
