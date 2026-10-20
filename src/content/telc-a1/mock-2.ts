import type { ExamContentInput } from "@/domain/exam/schema";

/**
 * telc A1 (Start Deutsch 1) — Übungstest 2 (original content).
 *
 * Theme: Reisen und Verkehr — Hotel, Bahn, Flughafen, Bus, Stadtbesichtigung, Fahrrad mieten.
 * All texts, scripts and tasks are original and written for this platform; they follow
 * the published task formats only.
 */

const RF = [
  { id: "r", label: "Richtig", text: "Richtig" },
  { id: "f", label: "Falsch", text: "Falsch" },
];

const AB = [
  { id: "a", label: "a", text: "Anzeige a" },
  { id: "b", label: "b", text: "Anzeige b" },
];

export const telcA1Mock2: ExamContentInput = {
  schemaVersion: 1,
  blueprintKey: "telc-a1-sd1",
  blueprintVersion: "2026.10.2",
  title: "telc A1 — Übungstest 2",
  themes: ["Reisen", "Verkehr", "Hotel", "Bahn", "Flughafen", "Stadtbesichtigung", "Fahrrad mieten"],
  sections: [
    /* ================================================================================== */
    /* HÖREN                                                                              */
    /* ================================================================================== */
    {
      sectionId: "hoeren",
      parts: [
        {
          partId: "hoeren-1",
          instructionsDe:
            "Sie hören kurze Gespräche. Sie hören jeden Text zweimal. Kreuzen Sie an: a, b oder c. Lesen Sie zuerst das Beispiel.",
          example: {
            prompt: "Ab wann gibt es im Hotel Frühstück?",
            stimulusIds: ["h-a0"],
            options: [
              { id: "a", label: "a", text: "Ab 6 Uhr" },
              { id: "b", label: "b", text: "Ab 7 Uhr" },
              { id: "c", label: "c", text: "Ab 10 Uhr" },
            ],
            answer: "b",
          },
          stimuli: [
            { id: "h-a0", kind: "audio", title: "Beispiel", scriptId: "sc-h0", body: "" },
            { id: "h-a1", kind: "audio", title: "Gespräch 1", scriptId: "sc-h1", body: "" },
            { id: "h-a2", kind: "audio", title: "Gespräch 2", scriptId: "sc-h2", body: "" },
            { id: "h-a3", kind: "audio", title: "Gespräch 3", scriptId: "sc-h3", body: "" },
            { id: "h-a4", kind: "audio", title: "Gespräch 4", scriptId: "sc-h4", body: "" },
            { id: "h-a5", kind: "audio", title: "Gespräch 5", scriptId: "sc-h5", body: "" },
            { id: "h-a6", kind: "audio", title: "Gespräch 6", scriptId: "sc-h6", body: "" },
          ],
          items: [
            { id: "h1", number: 1, type: "mc", stimulusIds: ["h-a1"], prompt: "Von welchem Gleis fährt der Zug nach Freiburg?", options: [{ id: "a", label: "a", text: "Von Gleis 3" }, { id: "b", label: "b", text: "Von Gleis 5" }, { id: "c", label: "c", text: "Von Gleis 8" }] },
            { id: "h2", number: 2, type: "mc", stimulusIds: ["h-a2"], prompt: "Was nimmt die Frau mit ins Flugzeug?", options: [{ id: "a", label: "a", text: "Eine Tasche" }, { id: "b", label: "b", text: "Einen Koffer" }, { id: "c", label: "c", text: "Einen Rucksack" }] },
            { id: "h3", number: 3, type: "mc", stimulusIds: ["h-a3"], prompt: "Wie viel kostet die Fahrkarte?", options: [{ id: "a", label: "a", text: "2,20 Euro" }, { id: "b", label: "b", text: "2,80 Euro" }, { id: "c", label: "c", text: "3,80 Euro" }] },
            { id: "h4", number: 4, type: "mc", stimulusIds: ["h-a4"], prompt: "Wo beginnt die Stadtführung?", options: [{ id: "a", label: "a", text: "Am Rathaus" }, { id: "b", label: "b", text: "Am Dom" }, { id: "c", label: "c", text: "Am Bahnhof" }] },
            { id: "h5", number: 5, type: "mc", stimulusIds: ["h-a5"], prompt: "Wie lange mietet der Mann das Fahrrad?", options: [{ id: "a", label: "a", text: "Einen Tag" }, { id: "b", label: "b", text: "Zwei Tage" }, { id: "c", label: "c", text: "Drei Tage" }] },
            { id: "h6", number: 6, type: "mc", stimulusIds: ["h-a6"], prompt: "Wann kommt das Taxi?", options: [{ id: "a", label: "a", text: "Um 9:30 Uhr" }, { id: "b", label: "b", text: "Um 9:00 Uhr" }, { id: "c", label: "c", text: "Um 12:00 Uhr" }] },
          ],
        },
        {
          partId: "hoeren-2",
          instructionsDe:
            "Sie hören Durchsagen. Sie hören jeden Text einmal. Kreuzen Sie an: Richtig oder Falsch. Lesen Sie zuerst das Beispiel.",
          example: { prompt: "Der Zug nach Köln fährt heute von Gleis 12.", stimulusIds: ["h-ab"], options: RF, answer: "r" },
          stimuli: [
            { id: "h-ab", kind: "audio", title: "Beispiel", scriptId: "sc-hb", body: "" },
            { id: "h-a7", kind: "audio", title: "Durchsage 7", scriptId: "sc-h7", body: "" },
            { id: "h-a8", kind: "audio", title: "Durchsage 8", scriptId: "sc-h8", body: "" },
            { id: "h-a9", kind: "audio", title: "Durchsage 9", scriptId: "sc-h9", body: "" },
            { id: "h-a10", kind: "audio", title: "Durchsage 10", scriptId: "sc-h10", body: "" },
          ],
          items: [
            { id: "h7", number: 7, type: "true_false", stimulusIds: ["h-a7"], prompt: "Das Flugzeug nach Lissabon fliegt pünktlich ab.", options: RF },
            { id: "h8", number: 8, type: "true_false", stimulusIds: ["h-a8"], prompt: "Ab Schillerplatz fahren die Fahrgäste mit dem Bus weiter.", options: RF },
            { id: "h9", number: 9, type: "true_false", stimulusIds: ["h-a9"], prompt: "Im Wagen 9 bekommt man Kaffee.", options: RF },
            { id: "h10", number: 10, type: "true_false", stimulusIds: ["h-a10"], prompt: "Die Stadtrundfahrt dauert eine Stunde.", options: RF },
          ],
        },
        {
          partId: "hoeren-3",
          instructionsDe: "Sie hören Ansagen am Telefon. Sie hören jeden Text zweimal. Kreuzen Sie an: a, b oder c.",
          stimuli: [
            { id: "h-a11", kind: "audio", title: "Ansage 11", scriptId: "sc-h11", body: "" },
            { id: "h-a12", kind: "audio", title: "Ansage 12", scriptId: "sc-h12", body: "" },
            { id: "h-a13", kind: "audio", title: "Ansage 13", scriptId: "sc-h13", body: "" },
            { id: "h-a14", kind: "audio", title: "Ansage 14", scriptId: "sc-h14", body: "" },
            { id: "h-a15", kind: "audio", title: "Ansage 15", scriptId: "sc-h15", body: "" },
          ],
          items: [
            { id: "h11", number: 11, type: "mc", stimulusIds: ["h-a11"], prompt: "Wo kann Herr Lindqvist sein Auto parken?", options: [{ id: "a", label: "a", text: "In der Garage am Markt" }, { id: "b", label: "b", text: "Vor dem Hotel" }, { id: "c", label: "c", text: "Am Bahnhof" }] },
            { id: "h12", number: 12, type: "mc", stimulusIds: ["h-a12"], prompt: "Wo wartet Olek auf Jana?", options: [{ id: "a", label: "a", text: "Auf dem Parkplatz" }, { id: "b", label: "b", text: "Am Schalter" }, { id: "c", label: "c", text: "Im Café am Ausgang" }] },
            { id: "h13", number: 13, type: "mc", stimulusIds: ["h-a13"], prompt: "Was soll Frau Haddad mitbringen?", options: [{ id: "a", label: "a", text: "Einen Helm" }, { id: "b", label: "b", text: "Ihren Ausweis" }, { id: "c", label: "c", text: "Ein Fahrradschloss" }] },
            { id: "h14", number: 14, type: "mc", stimulusIds: ["h-a14"], prompt: "Wann kann Frau Okafor die Tickets abholen?", options: [{ id: "a", label: "a", text: "Am Montag" }, { id: "b", label: "b", text: "Am Dienstag" }, { id: "c", label: "c", text: "Am Mittwoch" }] },
            { id: "h15", number: 15, type: "mc", stimulusIds: ["h-a15"], prompt: "Wie fahren Mira und Luca an den See?", options: [{ id: "a", label: "a", text: "Mit dem Zug" }, { id: "b", label: "b", text: "Mit dem Auto" }, { id: "c", label: "c", text: "Mit dem Fahrrad" }] },
          ],
        },
      ],
    },

    /* ================================================================================== */
    /* LESEN                                                                              */
    /* ================================================================================== */
    {
      sectionId: "lesen",
      parts: [
        {
          partId: "lesen-1",
          instructionsDe: "Lesen Sie die zwei Texte. Sind die Aussagen 1–5 richtig oder falsch? Kreuzen Sie an.",
          example: { prompt: "Paula fährt mit dem Zug nach Hamburg.", stimulusIds: ["l-t1"], options: RF, answer: "r" },
          stimuli: [
            {
              id: "l-t1",
              kind: "email",
              title: "Text 1",
              body:
                "**Von:** paula.wenz@postfach.de\n**An:** dana.held@postfach.de\n**Betreff:** Besuch in Hamburg\n\nLiebe Dana,\n\nnächste Woche besuche ich dich in Hamburg! Ich komme am Donnerstag mit dem Zug. Er ist um 17:45 Uhr am Hauptbahnhof. Kannst du mich dort abholen?\n\nEin Hotel brauche ich nicht. Ich schlafe doch bei dir, oder? Ich bleibe bis Sonntag. Am Freitag möchte ich mit dir eine Hafenrundfahrt machen. Am Samstag besuche ich meine Tante.\n\nBis bald!\nPaula",
            },
            {
              id: "l-t2",
              kind: "note",
              title: "Text 2",
              body:
                "Liebe Gäste,\n\nherzlich willkommen in unserer Ferienwohnung! Unsere zwei Fahrräder stehen im Keller. Sie können sie gern benutzen. Der Schlüssel hängt neben der Tür. Bitte bringen Sie die Fahrräder am Abend zurück in den Keller.\n\nBrötchen gibt es beim Bäcker an der Ecke, schon ab 6:30 Uhr. Am letzten Tag werfen Sie den Wohnungsschlüssel bitte in den Briefkasten.\n\nSchönen Urlaub!\nFamilie Brandauer",
            },
          ],
          items: [
            { id: "l1", number: 1, type: "true_false", stimulusIds: ["l-t1"], prompt: "Paula kommt am Freitag in Hamburg an.", options: RF },
            { id: "l2", number: 2, type: "true_false", stimulusIds: ["l-t1"], prompt: "Paula möchte in einem Hotel schlafen.", options: RF },
            { id: "l3", number: 3, type: "true_false", stimulusIds: ["l-t1"], prompt: "Paula besucht am Samstag ihre Tante.", options: RF },
            { id: "l4", number: 4, type: "true_false", stimulusIds: ["l-t2"], prompt: "Die Gäste dürfen die Fahrräder benutzen.", options: RF },
            { id: "l5", number: 5, type: "true_false", stimulusIds: ["l-t2"], prompt: "Am letzten Tag sollen die Gäste den Schlüssel in der Küche lassen.", options: RF },
          ],
        },
        {
          partId: "lesen-2",
          instructionsDe:
            "Lesen Sie die Aufgaben 6–10 und die Texte. Welche Anzeige ist interessant für Sie? Kreuzen Sie an: a oder b.",
          example: {
            prompt: "Sie sind am Wochenende in Heidelberg und möchten ein Fahrrad mieten.",
            stimulusIds: ["l-ad0a", "l-ad0b"],
            options: AB,
            answer: "a",
          },
          stimuli: [
            { id: "l-ad0a", kind: "ad", label: "Beispiel a", body: "**Radverleih am Neckar**\nFahrräder und E-Bikes für einen Tag oder eine Woche\nTäglich 9–19 Uhr, auch am Wochenende" },
            { id: "l-ad0b", kind: "ad", label: "Beispiel b", body: "**Fahrradladen Kettenblatt**\nNeue Fahrräder für Kinder und Erwachsene\nMo–Fr 10–18 Uhr" },
            { id: "l-ad6a", kind: "ad", label: "6 a", body: "**Taxi Blitz**\nVom Flughafen in die Stadt – 24 Stunden am Tag\nPreis ins Zentrum: circa 55 €" },
            { id: "l-ad6b", kind: "ad", label: "6 b", body: "**S-Bahn S5**\nVom Flughafen direkt ins Zentrum\nAlle 20 Minuten, Fahrkarte nur 4,40 €" },
            { id: "l-ad7a", kind: "ad", label: "7 a", body: "**Pension Waldblick**\nRuhige Zimmer mit Frühstück\nHunde sind bei uns willkommen!" },
            { id: "l-ad7b", kind: "ad", label: "7 b", body: "**Hotel Zentral**\nModerne Zimmer in der Altstadt, mit Fitnessraum\nBitte keine Tiere." },
            { id: "l-ad8a", kind: "ad", label: "8 a", body: "**Stadtführung am Abend**\nJeden Freitag um 20 Uhr\nAuf Deutsch und Englisch\nTreffpunkt: Marktbrunnen" },
            { id: "l-ad8b", kind: "ad", label: "8 b", body: "**Stadtführung für Familien**\nJeden Samstag um 10 Uhr\nNur auf Deutsch\nTreffpunkt: Schlosstor" },
            { id: "l-ad9a", kind: "ad", label: "9 a", body: "**Fernbus Nord**\nTäglich nach Hamburg, Bremen und Hannover\nTickets ab 12 €" },
            { id: "l-ad9b", kind: "ad", label: "9 b", body: "**Reisebus Ost**\nMontag, Mittwoch und Freitag nach Prag und Wien\nAbfahrt: Busbahnhof, 7 Uhr" },
            { id: "l-ad10a", kind: "ad", label: "10 a", body: "**Gepäck im Bahnhof**\nSchließfächer für Koffer und Taschen\nJeden Tag, 24 Stunden" },
            { id: "l-ad10b", kind: "ad", label: "10 b", body: "**Fundbüro der Bahn**\nSie haben etwas im Zug verloren?\nRufen Sie uns an: 0431 58 27 90" },
          ],
          items: [
            { id: "l6", number: 6, type: "ab", stimulusIds: ["l-ad6a", "l-ad6b"], prompt: "Sie kommen am Flughafen an und möchten billig in die Stadt fahren.", options: AB },
            { id: "l7", number: 7, type: "ab", stimulusIds: ["l-ad7a", "l-ad7b"], prompt: "Sie reisen mit Ihrem Hund und suchen ein Zimmer.", options: AB },
            { id: "l8", number: 8, type: "ab", stimulusIds: ["l-ad8a", "l-ad8b"], prompt: "Ihr Freund spricht nur Englisch. Sie möchten zusammen eine Stadtführung machen.", options: AB },
            { id: "l9", number: 9, type: "ab", stimulusIds: ["l-ad9a", "l-ad9b"], prompt: "Sie möchten mit dem Bus nach Prag fahren.", options: AB },
            { id: "l10", number: 10, type: "ab", stimulusIds: ["l-ad10a", "l-ad10b"], prompt: "Sie haben Ihren Koffer im Zug vergessen.", options: AB },
          ],
        },
        {
          partId: "lesen-3",
          instructionsDe: "Lesen Sie die Texte und die Aufgaben 11–15. Kreuzen Sie an: Richtig oder Falsch.",
          example: { prompt: "Im Hotel: Am Abreisetag muss man bis 11 Uhr aus dem Zimmer gehen.", stimulusIds: ["l-s0"], options: RF, answer: "r" },
          stimuli: [
            { id: "l-s0", kind: "notice", label: "Beispiel", title: "An der Rezeption im Hotel", body: "**Hotel Lindenhof**\nBitte verlassen Sie Ihr Zimmer am Abreisetag bis 11 Uhr." },
            { id: "l-s11", kind: "notice", label: "11", title: "An der Tür der Sprachschule", body: "**Sprachschule Wortwerk**\nDas Sekretariat ist jetzt im 1. Stock, neben der Bibliothek." },
            { id: "l-s12", kind: "notice", label: "12", title: "An der Post", body: "**Postfiliale Am Ring**\nSamstag nur 9–12 Uhr geöffnet.\nPakete abholen: auch am Paketautomaten, 24 Stunden." },
            { id: "l-s13", kind: "notice", label: "13", title: "Am Bahnhof", body: "**Hauptbahnhof**\nDas Reisezentrum ist heute geschlossen.\nFahrkarten bekommen Sie am Automaten." },
            { id: "l-s14", kind: "notice", label: "14", title: "Am Restaurant", body: "**Restaurant Zum Anker**\nMontag Ruhetag\nDienstag–Sonntag 11:30–22 Uhr" },
            { id: "l-s15", kind: "notice", label: "15", title: "An der Bushaltestelle", body: "**Haltestelle Brunnenstraße**\nAb 22 Uhr fährt hier der Nachtbus N7.\nJede halbe Stunde bis 4 Uhr." },
          ],
          items: [
            { id: "l11", number: 11, type: "true_false", stimulusIds: ["l-s11"], prompt: "Das Sekretariat ist im ersten Stock.", options: RF },
            { id: "l12", number: 12, type: "true_false", stimulusIds: ["l-s12"], prompt: "Am Samstagnachmittag ist die Post geöffnet.", options: RF },
            { id: "l13", number: 13, type: "true_false", stimulusIds: ["l-s13"], prompt: "Heute kann man am Automaten eine Fahrkarte kaufen.", options: RF },
            { id: "l14", number: 14, type: "true_false", stimulusIds: ["l-s14"], prompt: "Am Montag kann man im Restaurant essen.", options: RF },
            { id: "l15", number: 15, type: "true_false", stimulusIds: ["l-s15"], prompt: "Nach 22 Uhr fährt hier ein Bus.", options: RF },
          ],
        },
      ],
    },

    /* ================================================================================== */
    /* SCHREIBEN                                                                          */
    /* ================================================================================== */
    {
      sectionId: "schreiben",
      parts: [
        {
          partId: "schreiben-1",
          instructionsDe:
            "Ihr Freund Kenji Mori macht Urlaub in Lübeck. Er möchte ein Fahrrad mieten. Lesen Sie den Text. Schreiben Sie die fünf fehlenden Informationen in das Formular.",
          stimuli: [
            {
              id: "s-t1",
              kind: "text",
              title: "Kenji",
              body:
                "Kenji Mori kommt aus Japan. Er ist 34 Jahre alt. Er macht zwei Wochen Urlaub in Lübeck. Er wohnt im Hotel Am Hafen, Hafenstraße 9. Kenji möchte ein E-Bike mieten. Er braucht es vom 12. bis 15. Mai. Er hat keinen Helm und möchte einen Helm mieten. Kenji bezahlt bar.",
            },
            {
              id: "s-form",
              kind: "form",
              title: "Radverleih Trave – Mietvertrag",
              body:
                "| Feld | Eintrag |\n| --- | --- |\n| Name, Vorname | Mori, Kenji |\n| Herkunftsland | (1) |\n| Alter | 34 |\n| Adresse in Lübeck | Hotel Am Hafen, Hafenstraße 9 |\n| Fahrrad (normales Fahrrad / E-Bike) | (2) |\n| Mietzeit (von – bis) | (3) |\n| Helm (ja / nein) | (4) |\n| Zahlungsart (bar / Karte) | (5) |",
            },
          ],
          items: [
            { id: "s1", number: 1, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Herkunftsland", prompt: "(1) Herkunftsland" },
            { id: "s2", number: 2, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Fahrrad", prompt: "(2) Fahrrad (normales Fahrrad / E-Bike)" },
            { id: "s3", number: 3, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Mietzeit (von – bis)", prompt: "(3) Mietzeit (von – bis)" },
            { id: "s4", number: 4, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Helm", prompt: "(4) Helm (ja / nein)" },
            { id: "s5", number: 5, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Zahlungsart", prompt: "(5) Zahlungsart (bar / Karte)" },
          ],
        },
        {
          partId: "schreiben-2",
          instructionsDe:
            "Sie machen Urlaub in Konstanz. Am Samstag möchten Sie mit Ihrer Freundin Ines eine Fahrradtour um den See machen. Schreiben Sie Ines eine Nachricht.",
          stimuli: [],
          items: [
            {
              id: "s6",
              number: 6,
              type: "writing",
              prompt: "Nachricht an Ines",
              writing: {
                taskDe:
                  "Schreiben Sie zu jedem Punkt ein bis zwei Sätze (circa 30 Wörter). Schreiben Sie auch eine Anrede und einen Gruß.",
                leitpunkte: [
                  "Fahrradtour am Samstag: Wann?",
                  "Wo treffen Sie sich?",
                  "Was soll Ines mitbringen?",
                ],
                approxWords: 30,
              },
            },
          ],
        },
      ],
    },

    /* ================================================================================== */
    /* SPRECHEN                                                                           */
    /* ================================================================================== */
    {
      sectionId: "sprechen",
      parts: [
        {
          partId: "sprechen-1",
          instructionsDe:
            "Stellen Sie sich vor. Sprechen Sie über: Name, Alter, Land, Wohnort, Sprachen, Beruf, Hobby. Buchstabieren Sie dann ein Wort und nennen Sie eine Zahl.",
          stimuli: [
            { id: "p-c1", kind: "card", title: "Stichwörter", body: "Name? · Alter? · Land? · Wohnort? · Sprachen? · Beruf? · Hobby?" },
          ],
          items: [
            {
              id: "p1",
              number: 1,
              type: "speaking",
              stimulusIds: ["p-c1"],
              prompt: "Sich vorstellen",
              speaking: {
                taskDe:
                  "Stellen Sie sich mit den Stichwörtern vor. Buchstabieren Sie danach Ihren Vornamen und nennen Sie Ihre Hausnummer und Postleitzahl.",
                cards: [{ title: "Stichwörter", body: "Name? Alter? Land? Wohnort? Sprachen? Beruf? Hobby?" }],
                partnerTurns: [
                  "Hallo und willkommen. Wer sind Sie? Erzählen Sie bitte etwas über sich.",
                  "Vielen Dank. Wie schreibt man Ihren Vornamen? Buchstabieren Sie bitte.",
                  "Gut. Und wie ist Ihre Adresse? Nennen Sie bitte die Hausnummer und die Postleitzahl.",
                ],
                prepSeconds: 0,
                responseSeconds: 60,
              },
            },
          ],
        },
        {
          partId: "sprechen-2",
          instructionsDe:
            "Sie bekommen zwei Karten mit einem Thema und einem Wort. Stellen Sie eine Frage zu Ihrer Karte. Ihre Partnerin / Ihr Partner antwortet. Runde 1: Thema „Reisen“. Runde 2: Thema „Verkehr“.",
          stimuli: [
            { id: "p-c2r1", kind: "card", label: "Reisen 1", title: "Thema: Reisen", body: "**Koffer**" },
            { id: "p-c2r2", kind: "card", label: "Reisen 2", title: "Thema: Reisen", body: "**Hotel**" },
            { id: "p-c2r3", kind: "card", label: "Reisen 3", title: "Thema: Reisen", body: "**Urlaub**" },
            { id: "p-c2r4", kind: "card", label: "Reisen 4", title: "Thema: Reisen", body: "**Flugzeug**" },
            { id: "p-c2r5", kind: "card", label: "Reisen 5", title: "Thema: Reisen", body: "**Sommer**" },
            { id: "p-c2r6", kind: "card", label: "Reisen 6", title: "Thema: Reisen", body: "**Foto**" },
            { id: "p-c2v1", kind: "card", label: "Verkehr 1", title: "Thema: Verkehr", body: "**Fahrrad**" },
            { id: "p-c2v2", kind: "card", label: "Verkehr 2", title: "Thema: Verkehr", body: "**Bus**" },
            { id: "p-c2v3", kind: "card", label: "Verkehr 3", title: "Thema: Verkehr", body: "**Auto**" },
            { id: "p-c2v4", kind: "card", label: "Verkehr 4", title: "Thema: Verkehr", body: "**Fahrkarte**" },
            { id: "p-c2v5", kind: "card", label: "Verkehr 5", title: "Thema: Verkehr", body: "**Haltestelle**" },
            { id: "p-c2v6", kind: "card", label: "Verkehr 6", title: "Thema: Verkehr", body: "**Taxi**" },
          ],
          items: [
            {
              id: "p2",
              number: 2,
              type: "speaking",
              stimulusIds: ["p-c2r1", "p-c2r2", "p-c2r3", "p-c2r4", "p-c2r5", "p-c2r6", "p-c2v1", "p-c2v2", "p-c2v3", "p-c2v4", "p-c2v5", "p-c2v6"],
              prompt: "Um Informationen bitten und Informationen geben",
              speaking: {
                taskDe:
                  "Sie ziehen in jeder Runde eine Karte. Stellen Sie zu jeder Karte eine Frage. Antworten Sie auch auf die Fragen Ihrer Partnerin / Ihres Partners.",
                cards: [
                  { title: "Thema: Reisen", body: "Koffer" },
                  { title: "Thema: Reisen", body: "Hotel" },
                  { title: "Thema: Reisen", body: "Urlaub" },
                  { title: "Thema: Reisen", body: "Flugzeug" },
                  { title: "Thema: Reisen", body: "Sommer" },
                  { title: "Thema: Reisen", body: "Foto" },
                  { title: "Thema: Verkehr", body: "Fahrrad" },
                  { title: "Thema: Verkehr", body: "Bus" },
                  { title: "Thema: Verkehr", body: "Auto" },
                  { title: "Thema: Verkehr", body: "Fahrkarte" },
                  { title: "Thema: Verkehr", body: "Haltestelle" },
                  { title: "Thema: Verkehr", body: "Taxi" },
                ],
                partnerTurns: [
                  "Runde 1, Thema Reisen. Ihre Karte: Urlaub. Bitte stellen Sie mir eine Frage.",
                  "(Partner antwortet) Im Urlaub fahre ich gern ans Meer. – Jetzt frage ich: Fliegst du gern mit dem Flugzeug?",
                  "Danke. Runde 2, Thema Verkehr. Ihre Karte: Fahrrad.",
                  "(Partner antwortet) Ja, ich habe ein Fahrrad. Ich fahre jeden Tag zur Arbeit. – Meine Frage: Wo ist bei dir die nächste Haltestelle?",
                ],
                prepSeconds: 0,
                responseSeconds: 60,
              },
            },
          ],
        },
        {
          partId: "sprechen-3",
          instructionsDe:
            "Sie bekommen zwei Karten. Formulieren Sie eine Bitte zu Ihrer Karte. Ihre Partnerin / Ihr Partner reagiert.",
          stimuli: [
            { id: "p-c3a", kind: "card", label: "Karte 1", title: "Handlungskarte", body: "Bild: ein Stadtplan", imageAlt: "Ein gefalteter Stadtplan" },
            { id: "p-c3b", kind: "card", label: "Karte 2", title: "Handlungskarte", body: "Bild: ein schwerer Koffer", imageAlt: "Ein großer, schwerer Koffer" },
            { id: "p-c3c", kind: "card", label: "Karte 3", title: "Handlungskarte", body: "Bild: ein Fahrplan", imageAlt: "Ein Fahrplan an einer Bushaltestelle" },
            { id: "p-c3d", kind: "card", label: "Karte 4", title: "Handlungskarte", body: "Bild: eine Luftpumpe", imageAlt: "Eine Luftpumpe für ein Fahrrad" },
            { id: "p-c3e", kind: "card", label: "Karte 5", title: "Handlungskarte", body: "Bild: ein Fotoapparat", imageAlt: "Ein Fotoapparat" },
            { id: "p-c3f", kind: "card", label: "Karte 6", title: "Handlungskarte", body: "Bild: ein Telefon", imageAlt: "Ein Handy" },
          ],
          items: [
            {
              id: "p3",
              number: 3,
              type: "speaking",
              stimulusIds: ["p-c3a", "p-c3b", "p-c3c", "p-c3d", "p-c3e", "p-c3f"],
              prompt: "Bitten formulieren und darauf reagieren",
              speaking: {
                taskDe:
                  "Formulieren Sie zu zwei Karten eine Bitte. Reagieren Sie auch auf zwei Bitten Ihrer Partnerin / Ihres Partners.",
                cards: [
                  { title: "Karte 1", body: "Bild: ein Stadtplan" },
                  { title: "Karte 2", body: "Bild: ein schwerer Koffer" },
                  { title: "Karte 3", body: "Bild: ein Fahrplan" },
                  { title: "Karte 4", body: "Bild: eine Luftpumpe" },
                  { title: "Karte 5", body: "Bild: ein Fotoapparat" },
                  { title: "Karte 6", body: "Bild: ein Telefon" },
                ],
                partnerTurns: [
                  "Ihre erste Karte zeigt einen Stadtplan. Bitte formulieren Sie eine Bitte.",
                  "(Partnerin reagiert) Ja, klar. Hier ist mein Stadtplan. – Jetzt meine Bitte: Kannst du bitte ein Foto von mir machen?",
                  "Danke. Ihre zweite Karte zeigt einen schweren Koffer.",
                  "(Partnerin reagiert) Natürlich, ich helfe dir gern. – Meine Bitte: Kannst du mir bitte deine Luftpumpe geben?",
                ],
                prepSeconds: 0,
                responseSeconds: 60,
              },
            },
          ],
        },
      ],
    },
  ],

  /* ==================================================================================== */
  /* LISTENING SCRIPTS                                                                    */
  /* ==================================================================================== */
  scripts: [
    {
      id: "sc-h0", title: "Beispiel – An der Hotelrezeption", scenario: "accommodation",
      environment: { preset: "accommodation", ambienceLevel: 0.1, ambiencePrompt: "quiet hotel lobby, soft footsteps" },
      speakers: [{ id: "g", name: "Herr Brenner", role: "Gast", gender: "male" }, { id: "r", name: "Rezeptionistin", role: "Hotel", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "g", text: "Entschuldigung, wann gibt es morgen Frühstück?" },
        { id: "t2", speakerId: "r", text: "Das Frühstück gibt es von sieben bis zehn Uhr. Im Restaurant im Erdgeschoss." },
        { id: "t3", speakerId: "g", text: "Ab sieben Uhr. Sehr gut, danke!", pauseAfterMs: 800 },
      ],
    },
    {
      id: "sc-h1", title: "Am Bahnsteig", scenario: "railway_station",
      environment: { preset: "railway_station", ambienceLevel: 0.15, reverb: 0.25, ambiencePrompt: "railway platform, distant train, soft crowd" },
      speakers: [{ id: "f", name: "Reisende", role: "Reisende", gender: "female" }, { id: "m", name: "Bahnmitarbeiter", role: "Bahn", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "f", text: "Entschuldigung, fährt der Zug nach Freiburg von Gleis drei?" },
        { id: "t2", speakerId: "m", text: "Nein, heute nicht. Von Gleis drei fährt der Zug nach Basel." },
        { id: "t3", speakerId: "f", text: "Und der Zug nach Freiburg?" },
        { id: "t4", speakerId: "m", text: "Der fährt heute von Gleis acht. Gehen Sie die Treppe hoch." },
        { id: "t5", speakerId: "f", text: "Gleis acht. Vielen Dank!" },
      ],
    },
    {
      id: "sc-h2", title: "Am Flughafen", scenario: "airport",
      environment: { preset: "airport", ambienceLevel: 0.15, reverb: 0.3, ambiencePrompt: "airport check-in hall, rolling suitcases" },
      speakers: [{ id: "m", name: "Mitarbeiter", role: "Check-in", gender: "male" }, { id: "f", name: "Frau Novák", role: "Fluggast", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "m", text: "Guten Morgen. Ihren Pass, bitte. Wie viele Koffer haben Sie?" },
        { id: "t2", speakerId: "f", text: "Ich habe einen Koffer und eine kleine Tasche." },
        { id: "t3", speakerId: "m", text: "Den Koffer stellen Sie bitte hier hin. Die Tasche können Sie mit ins Flugzeug nehmen." },
        { id: "t4", speakerId: "f", text: "Prima, die Tasche nehme ich mit. Danke!" },
      ],
    },
    {
      id: "sc-h3", title: "Im Bus", scenario: "street",
      environment: { preset: "street", ambienceLevel: 0.15, ambiencePrompt: "inside a city bus, engine hum, door chime" },
      speakers: [{ id: "m", name: "Fahrgast", role: "Fahrgast", gender: "male", age: "senior" }, { id: "b", name: "Busfahrerin", role: "Busfahrerin", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "m", text: "Guten Tag. Eine Fahrkarte in die Stadt, bitte. Das sind zwei Euro zwanzig, oder?" },
        { id: "t2", speakerId: "b", text: "Nein, seit Januar kostet die Fahrkarte zwei Euro achtzig." },
        { id: "t3", speakerId: "m", text: "Zwei Euro achtzig. Hier, bitte." },
        { id: "t4", speakerId: "b", text: "Danke. Gute Fahrt!" },
      ],
    },
    {
      id: "sc-h4", title: "Auf der Straße", scenario: "street",
      environment: { preset: "street", ambienceLevel: 0.15, ambiencePrompt: "old town square, light traffic, birds" },
      speakers: [{ id: "t", name: "Tourist", role: "Tourist", gender: "male", age: "young" }, { id: "f", name: "Passantin", role: "Passantin", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "t", text: "Entschuldigung, beginnt die Stadtführung hier am Bahnhof?" },
        { id: "t2", speakerId: "f", text: "Nein, die Stadtführung beginnt am Rathaus. Um elf Uhr." },
        { id: "t3", speakerId: "t", text: "Am Rathaus. Und geht sie auch zum Dom?" },
        { id: "t4", speakerId: "f", text: "Ja, am Ende sehen Sie den Dom. Das Rathaus ist dort, nur fünf Minuten zu Fuß." },
      ],
    },
    {
      id: "sc-h5", title: "Im Fahrradverleih", scenario: "shop",
      environment: { preset: "shop", ambienceLevel: 0.1, ambiencePrompt: "small bike rental shop, tools clinking" },
      speakers: [{ id: "k", name: "Kunde", role: "Kunde", gender: "male" }, { id: "v", name: "Verkäuferin", role: "Fahrradverleih", gender: "female", age: "young" }],
      turns: [
        { id: "t1", speakerId: "k", text: "Hallo. Ich möchte ein Fahrrad mieten." },
        { id: "t2", speakerId: "v", text: "Gern. Für einen Tag?" },
        { id: "t3", speakerId: "k", text: "Nein, für drei Tage. Von Freitag bis Sonntag." },
        { id: "t4", speakerId: "v", text: "Drei Tage, gut. Das kostet dreißig Euro." },
      ],
    },
    {
      id: "sc-h6", title: "An der Rezeption", scenario: "accommodation",
      environment: { preset: "accommodation", ambienceLevel: 0.1 },
      speakers: [{ id: "g", name: "Frau Sørensen", role: "Gast", gender: "female" }, { id: "r", name: "Rezeptionist", role: "Hotel", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "g", text: "Guten Abend. Können Sie mir bitte für morgen ein Taxi bestellen? Mein Flug geht um zwölf Uhr." },
        { id: "t2", speakerId: "r", text: "Gern. Ist halb zehn gut?" },
        { id: "t3", speakerId: "g", text: "Halb zehn ist zu spät. Lieber um neun Uhr, bitte." },
        { id: "t4", speakerId: "r", text: "Kein Problem. Das Taxi kommt um neun Uhr." },
      ],
    },
    {
      id: "sc-hb", title: "Beispiel – Durchsage am Bahnhof", scenario: "railway_station",
      environment: { preset: "railway_station", ambienceLevel: 0.2, publicAddress: true, reverb: 0.35, ambiencePrompt: "large station hall, distant trains" },
      speakers: [{ id: "d", name: "Durchsage", role: "Bahnhofsansage", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Achtung, bitte! Der Intercity nach Köln fährt heute von Gleis zwölf. Ich wiederhole: Gleis zwölf.", pace: 0.95 },
      ],
    },
    {
      id: "sc-h7", title: "Durchsage am Flughafen", scenario: "airport",
      environment: { preset: "airport", ambienceLevel: 0.18, publicAddress: true, reverb: 0.4, ambiencePrompt: "airport terminal, soft crowd" },
      speakers: [{ id: "d", name: "Durchsage", role: "Flughafendurchsage", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Information für die Fluggäste nach Lissabon. Ihr Flug hat leider eine Stunde Verspätung. Die neue Abflugzeit ist fünfzehn Uhr vierzig. Vielen Dank.", pace: 0.95 },
      ],
    },
    {
      id: "sc-h8", title: "Durchsage in der Straßenbahn", scenario: "street",
      environment: { preset: "street", ambienceLevel: 0.15, publicAddress: true, reverb: 0.15, ambiencePrompt: "inside a tram, rails rattling softly" },
      speakers: [{ id: "d", name: "Durchsage", role: "Fahrgastinformation", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Fahrgäste, die Linie drei fährt heute nur bis zum Schillerplatz. Dort ist eine Baustelle. Bitte fahren Sie ab Schillerplatz mit dem Bus vierzig weiter." },
      ],
    },
    {
      id: "sc-h9", title: "Durchsage im Zug", scenario: "railway_station",
      environment: { preset: "railway_station", ambienceLevel: 0.15, publicAddress: true, reverb: 0.1, ambiencePrompt: "inside a moving train, soft rail noise" },
      speakers: [{ id: "d", name: "Durchsage", role: "Zugbegleiterin", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Fahrgäste, bald sind wir in Augsburg. Unser Restaurant ist heute leider geschlossen. Kaffee und Brötchen bekommen Sie in Wagen neun." },
      ],
    },
    {
      id: "sc-h10", title: "Durchsage im Stadtrundfahrt-Bus", scenario: "street",
      environment: { preset: "street", ambienceLevel: 0.15, publicAddress: true, reverb: 0.1, ambiencePrompt: "tour bus waiting, engine idling" },
      speakers: [{ id: "d", name: "Durchsage", role: "Reiseleiter", gender: "male", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Herzlich willkommen! Unsere Stadtrundfahrt beginnt in fünf Minuten. Die Fahrt dauert zwei Stunden. Am Schloss machen wir eine Pause." },
      ],
    },
    {
      id: "sc-h11", title: "Nachricht vom Hotel", scenario: "accommodation",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "h", name: "Hotel Seeblick", role: "Rezeption", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "h", text: "Guten Tag, Herr Lindqvist, hier ist das Hotel Seeblick. Sie kommen am Freitag zu uns. Leider ist unser Parkplatz vor dem Hotel geschlossen. Bitte parken Sie in der Garage am Markt. Sie ist gleich neben dem Hotel. Auf Wiederhören!" },
      ],
    },
    {
      id: "sc-h12", title: "Nachricht von Olek", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.05, telephoneFilter: true },
      speakers: [{ id: "o", name: "Olek", role: "Freund", gender: "male", age: "young" }],
      turns: [
        { id: "t1", speakerId: "o", text: "Hallo Jana, hier ist Olek. Ich hole dich morgen am Flughafen ab. Dein Flugzeug kommt um vierzehn Uhr an. Der Parkplatz ist sehr weit weg. Darum warte ich im Café am Ausgang. Bis morgen!" },
      ],
    },
    {
      id: "sc-h13", title: "Nachricht vom Fahrradverleih", scenario: "shop",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "v", name: "Fahrradverleih Speiche", role: "Mitarbeiter", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "v", text: "Guten Tag, Frau Haddad, hier ist der Fahrradverleih Speiche. Sie möchten am Samstag zwei Fahrräder mieten. Das geht. Bitte bringen Sie Ihren Ausweis mit. Helme und Schlösser haben wir hier. Vielen Dank!" },
      ],
    },
    {
      id: "sc-h14", title: "Nachricht vom Reisebüro", scenario: "public_office",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "r", name: "Reisebüro Fernweh", role: "Reisebüro", gender: "female", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "r", text: "Guten Tag, Frau Okafor, hier ist das Reisebüro Fernweh. Ihre Bahntickets nach Wien sind da. Am Montag und am Dienstag ist unser Büro geschlossen. Sie können die Tickets ab Mittwoch abholen. Auf Wiederhören!" },
      ],
    },
    {
      id: "sc-h15", title: "Nachricht von Mira", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.05, telephoneFilter: true },
      speakers: [{ id: "m", name: "Mira", role: "Freundin", gender: "female", age: "young" }],
      turns: [
        { id: "t1", speakerId: "m", text: "Hi Luca, hier ist Mira. Wir fahren am Sonntag nicht mit dem Auto an den See. Das Auto ist kaputt. Wir nehmen den Zug um neun Uhr. Wir treffen uns am Bahnhof. Tschüss!" },
      ],
    },
  ],

  /* ==================================================================================== */
  /* ANSWER KEY                                                                           */
  /* ==================================================================================== */
  answerKey: {
    h1: { correct: ["c"], explanation: "Von Gleis 3 fährt der Zug nach Basel. Der Zug nach Freiburg fährt heute von Gleis 8.", evidence: "Der fährt heute von Gleis acht." },
    h2: { correct: ["a"], explanation: "Den Koffer gibt sie am Schalter ab. Die Tasche nimmt sie mit ins Flugzeug.", evidence: "Prima, die Tasche nehme ich mit." },
    h3: { correct: ["b"], explanation: "Der Mann denkt, die Karte kostet 2,20 Euro. Aber seit Januar kostet sie 2,80 Euro.", evidence: "seit Januar kostet die Fahrkarte zwei Euro achtzig" },
    h4: { correct: ["a"], explanation: "Die Führung beginnt nicht am Bahnhof, sondern am Rathaus. Den Dom sieht man am Ende.", evidence: "die Stadtführung beginnt am Rathaus" },
    h5: { correct: ["c"], explanation: "Er mietet das Fahrrad nicht für einen Tag, sondern für drei Tage.", evidence: "Nein, für drei Tage. Von Freitag bis Sonntag." },
    h6: { correct: ["b"], explanation: "Halb zehn ist zu spät. Das Taxi kommt um neun Uhr. Um zwölf Uhr geht der Flug.", evidence: "Das Taxi kommt um neun Uhr." },
    h7: { correct: ["f"], explanation: "Der Flug nach Lissabon hat eine Stunde Verspätung.", evidence: "Ihr Flug hat leider eine Stunde Verspätung." },
    h8: { correct: ["r"], explanation: "Die Linie 3 fährt nur bis Schillerplatz. Dann fährt man mit dem Bus 40 weiter.", evidence: "Bitte fahren Sie ab Schillerplatz mit dem Bus vierzig weiter." },
    h9: { correct: ["r"], explanation: "Das Restaurant ist geschlossen, aber in Wagen 9 gibt es Kaffee und Brötchen.", evidence: "Kaffee und Brötchen bekommen Sie in Wagen neun." },
    h10: { correct: ["f"], explanation: "Die Stadtrundfahrt dauert zwei Stunden, nicht eine Stunde.", evidence: "Die Fahrt dauert zwei Stunden." },
    h11: { correct: ["a"], explanation: "Der Parkplatz vor dem Hotel ist geschlossen. Herr Lindqvist soll in der Garage am Markt parken.", evidence: "Bitte parken Sie in der Garage am Markt." },
    h12: { correct: ["c"], explanation: "Der Parkplatz ist weit weg. Darum wartet Olek im Café am Ausgang.", evidence: "Darum warte ich im Café am Ausgang." },
    h13: { correct: ["b"], explanation: "Frau Haddad soll ihren Ausweis mitbringen. Helme und Schlösser hat der Verleih.", evidence: "Bitte bringen Sie Ihren Ausweis mit." },
    h14: { correct: ["c"], explanation: "Am Montag und Dienstag ist das Büro geschlossen. Ab Mittwoch kann sie die Tickets abholen.", evidence: "Sie können die Tickets ab Mittwoch abholen." },
    h15: { correct: ["a"], explanation: "Das Auto ist kaputt. Sie nehmen den Zug um neun Uhr.", evidence: "Wir nehmen den Zug um neun Uhr." },
    l1: { correct: ["f"], explanation: "Paula kommt am Donnerstag an, nicht am Freitag.", evidence: "Ich komme am Donnerstag mit dem Zug." },
    l2: { correct: ["f"], explanation: "Paula braucht kein Hotel. Sie schläft bei Dana.", evidence: "Ein Hotel brauche ich nicht." },
    l3: { correct: ["r"], explanation: "Am Samstag besucht Paula ihre Tante.", evidence: "Am Samstag besuche ich meine Tante." },
    l4: { correct: ["r"], explanation: "Die Gäste können die zwei Fahrräder aus dem Keller benutzen.", evidence: "Sie können sie gern benutzen." },
    l5: { correct: ["f"], explanation: "Am letzten Tag kommt der Schlüssel in den Briefkasten.", evidence: "werfen Sie den Wohnungsschlüssel bitte in den Briefkasten" },
    l6: { correct: ["b"], explanation: "Die S-Bahn kostet nur 4,40 €. Das Taxi kostet circa 55 €.", evidence: "Fahrkarte nur 4,40 €" },
    l7: { correct: ["a"], explanation: "In der Pension Waldblick sind Hunde willkommen. Das Hotel Zentral möchte keine Tiere.", evidence: "Hunde sind bei uns willkommen!" },
    l8: { correct: ["a"], explanation: "Die Führung am Abend ist auch auf Englisch. Die Familienführung ist nur auf Deutsch.", evidence: "Auf Deutsch und Englisch" },
    l9: { correct: ["b"], explanation: "Der Reisebus Ost fährt nach Prag. Der Fernbus Nord fährt nur nach Hamburg, Bremen und Hannover.", evidence: "nach Prag und Wien" },
    l10: { correct: ["b"], explanation: "Für vergessene Sachen im Zug ist das Fundbüro da. Die Schließfächer sind für Gepäck.", evidence: "Sie haben etwas im Zug verloren?" },
    l11: { correct: ["r"], explanation: "Das Sekretariat ist jetzt im 1. Stock.", evidence: "Das Sekretariat ist jetzt im 1. Stock" },
    l12: { correct: ["f"], explanation: "Am Samstag ist die Post nur von 9 bis 12 Uhr geöffnet, also nicht am Nachmittag.", evidence: "Samstag nur 9–12 Uhr geöffnet." },
    l13: { correct: ["r"], explanation: "Das Reisezentrum ist geschlossen, aber am Automaten gibt es Fahrkarten.", evidence: "Fahrkarten bekommen Sie am Automaten." },
    l14: { correct: ["f"], explanation: "Am Montag ist Ruhetag. Das Restaurant ist geschlossen.", evidence: "Montag Ruhetag" },
    l15: { correct: ["r"], explanation: "Ab 22 Uhr fährt der Nachtbus N7 jede halbe Stunde.", evidence: "Ab 22 Uhr fährt hier der Nachtbus N7." },
    s1: { correct: ["Japan", "aus Japan"], explanation: "Kenji kommt aus Japan." },
    s2: { correct: ["E-Bike", "Ebike", "E Bike", "ein E-Bike", "Elektrofahrrad", "Elektro-Fahrrad"], explanation: "Kenji möchte ein E-Bike mieten." },
    s3: {
      correct: [
        "12.–15. Mai", "12.-15. Mai", "12. – 15. Mai", "12. - 15. Mai", "12. bis 15. Mai", "vom 12. bis 15. Mai", "vom 12. bis zum 15. Mai",
        "12. Mai – 15. Mai", "12. Mai - 15. Mai", "12. Mai bis 15. Mai", "12.5.–15.5.", "12.5.-15.5.", "12.05.–15.05.", "12.05.-15.05.", "12.5. bis 15.5.", "12.05. bis 15.05.",
      ],
      explanation: "Kenji braucht das E-Bike vom 12. bis 15. Mai.",
    },
    s4: { correct: ["ja", "Ja", "ja, mit Helm", "mit Helm", "ein Helm"], explanation: "Kenji hat keinen Helm und möchte einen Helm mieten." },
    s5: { correct: ["bar", "Bar", "in bar", "Bargeld", "bar bezahlen"], explanation: "Kenji bezahlt bar." },
    s6: { correct: [], explanation: "Bewertet werden die drei Inhaltspunkte (je 0 / 1,5 / 3 Punkte) und die Textsorte mit Anrede und Gruß (0 / 0,5 / 1 Punkt)." },
    p1: { correct: [] },
    p2: { correct: [] },
    p3: { correct: [] },
  },
};
