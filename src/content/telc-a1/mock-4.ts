import type { ExamContentInput } from "@/domain/exam/schema";

/**
 * telc Deutsch A1 / Start Deutsch 1 — Übungstest 4 (original content).
 *
 * Theme: health and everyday services (doctor's appointments, pharmacy, health insurance,
 * hairdresser, post office, bank). All texts, scripts and tasks are original and written
 * for this platform; they follow the published task formats only.
 */

const RF = [
  { id: "r", label: "Richtig", text: "Richtig" },
  { id: "f", label: "Falsch", text: "Falsch" },
];

const AB = [
  { id: "a", label: "a", text: "Anzeige a" },
  { id: "b", label: "b", text: "Anzeige b" },
];

export const telcA1Mock4: ExamContentInput = {
  schemaVersion: 1,
  blueprintKey: "telc-a1-sd1",
  blueprintVersion: "2026.10.2",
  title: "telc A1 — Übungstest 4",
  themes: ["Gesundheit", "Arzttermin", "Apotheke", "Krankenkasse", "Friseur", "Post", "Bank"],
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
            prompt: "Wie viel kostet der Hustensaft?",
            stimulusIds: ["h4-a0"],
            options: [
              { id: "a", label: "a", text: "4,80 Euro" },
              { id: "b", label: "b", text: "8,40 Euro" },
              { id: "c", label: "c", text: "8,90 Euro" },
            ],
            answer: "b",
          },
          stimuli: [
            { id: "h4-a0", kind: "audio", title: "Beispiel", scriptId: "sc4-h0", body: "" },
            { id: "h4-a1", kind: "audio", title: "Gespräch 1", scriptId: "sc4-h1", body: "" },
            { id: "h4-a2", kind: "audio", title: "Gespräch 2", scriptId: "sc4-h2", body: "" },
            { id: "h4-a3", kind: "audio", title: "Gespräch 3", scriptId: "sc4-h3", body: "" },
            { id: "h4-a4", kind: "audio", title: "Gespräch 4", scriptId: "sc4-h4", body: "" },
            { id: "h4-a5", kind: "audio", title: "Gespräch 5", scriptId: "sc4-h5", body: "" },
            { id: "h4-a6", kind: "audio", title: "Gespräch 6", scriptId: "sc4-h6", body: "" },
          ],
          items: [
            { id: "h1", number: 1, type: "mc", stimulusIds: ["h4-a1"], prompt: "Wann soll Herr Brückner wieder in die Praxis kommen?", options: [{ id: "a", label: "a", text: "In einer Woche" }, { id: "b", label: "b", text: "In drei Tagen" }, { id: "c", label: "c", text: "In zwei Wochen" }] },
            { id: "h2", number: 2, type: "mc", stimulusIds: ["h4-a2"], prompt: "Was macht die Friseurin heute?", options: [{ id: "a", label: "a", text: "Sie schneidet die Haare kurz." }, { id: "b", label: "b", text: "Sie macht die Haare rot." }, { id: "c", label: "c", text: "Sie wäscht nur die Haare." }] },
            { id: "h3", number: 3, type: "mc", stimulusIds: ["h4-a3"], prompt: "Wie viele Briefmarken kauft die Frau?", options: [{ id: "a", label: "a", text: "5" }, { id: "b", label: "b", text: "10" }, { id: "c", label: "c", text: "20" }] },
            { id: "h4", number: 4, type: "mc", stimulusIds: ["h4-a4"], prompt: "Wo ist der Geldautomat?", options: [{ id: "a", label: "a", text: "Neben der Tür" }, { id: "b", label: "b", text: "Im ersten Stock" }, { id: "c", label: "c", text: "Hinten rechts" }] },
            { id: "h5", number: 5, type: "mc", stimulusIds: ["h4-a5"], prompt: "Was braucht die Krankenkasse von Frau Mendes?", options: [{ id: "a", label: "a", text: "Ein Foto" }, { id: "b", label: "b", text: "Ihren Pass" }, { id: "c", label: "c", text: "Einen Brief vom Arzt" }] },
            { id: "h6", number: 6, type: "mc", stimulusIds: ["h4-a6"], prompt: "Wann hat Frau Okafor am Freitag ihren Termin?", options: [{ id: "a", label: "a", text: "Um 8:30 Uhr" }, { id: "b", label: "b", text: "Um 9:15 Uhr" }, { id: "c", label: "c", text: "Um 10:00 Uhr" }] },
          ],
        },
        {
          partId: "hoeren-2",
          instructionsDe:
            "Sie hören Durchsagen. Sie hören jeden Text einmal. Kreuzen Sie an: Richtig oder Falsch. Lesen Sie zuerst das Beispiel.",
          example: {
            prompt: "Die Apotheke ist im Erdgeschoss.",
            stimulusIds: ["h4-a6x"],
            options: RF,
            answer: "r",
          },
          stimuli: [
            { id: "h4-a6x", kind: "audio", title: "Beispiel", scriptId: "sc4-h6x", body: "" },
            { id: "h4-a7", kind: "audio", title: "Durchsage 7", scriptId: "sc4-h7", body: "" },
            { id: "h4-a8", kind: "audio", title: "Durchsage 8", scriptId: "sc4-h8", body: "" },
            { id: "h4-a9", kind: "audio", title: "Durchsage 9", scriptId: "sc4-h9", body: "" },
            { id: "h4-a10", kind: "audio", title: "Durchsage 10", scriptId: "sc4-h10", body: "" },
          ],
          items: [
            { id: "h7", number: 7, type: "true_false", stimulusIds: ["h4-a7"], prompt: "Schalter 3 ist jetzt geöffnet.", options: RF },
            { id: "h8", number: 8, type: "true_false", stimulusIds: ["h4-a8"], prompt: "Der Friseur ist im ersten Stock.", options: RF },
            { id: "h9", number: 9, type: "true_false", stimulusIds: ["h4-a9"], prompt: "Der Bus zum Krankenhaus fährt heute von Haltestelle A.", options: RF },
            { id: "h10", number: 10, type: "true_false", stimulusIds: ["h4-a10"], prompt: "Die Besuchszeit ist heute um 20 Uhr zu Ende.", options: RF },
          ],
        },
        {
          partId: "hoeren-3",
          instructionsDe: "Sie hören Ansagen am Telefon. Sie hören jeden Text zweimal. Kreuzen Sie an: a, b oder c.",
          stimuli: [
            { id: "h4-a11", kind: "audio", title: "Ansage 11", scriptId: "sc4-h11", body: "" },
            { id: "h4-a12", kind: "audio", title: "Ansage 12", scriptId: "sc4-h12", body: "" },
            { id: "h4-a13", kind: "audio", title: "Ansage 13", scriptId: "sc4-h13", body: "" },
            { id: "h4-a14", kind: "audio", title: "Ansage 14", scriptId: "sc4-h14", body: "" },
            { id: "h4-a15", kind: "audio", title: "Ansage 15", scriptId: "sc4-h15", body: "" },
          ],
          items: [
            { id: "h11", number: 11, type: "mc", stimulusIds: ["h4-a11"], prompt: "Wann kann Herr Demir das Rezept abholen?", options: [{ id: "a", label: "a", text: "Heute" }, { id: "b", label: "b", text: "Morgen" }, { id: "c", label: "c", text: "Am Montag" }] },
            { id: "h12", number: 12, type: "mc", stimulusIds: ["h4-a12"], prompt: "Was soll Frau Hansen in die Apotheke mitbringen?", options: [{ id: "a", label: "a", text: "Ihre Versichertenkarte" }, { id: "b", label: "b", text: "Ihren Pass" }, { id: "c", label: "c", text: "Das Rezept" }] },
            { id: "h13", number: 13, type: "mc", stimulusIds: ["h4-a13"], prompt: "Wann soll Herr Kowalski zum Friseur kommen?", options: [{ id: "a", label: "a", text: "Am Freitag um 15 Uhr" }, { id: "b", label: "b", text: "Am Donnerstag um 15 Uhr" }, { id: "c", label: "c", text: "Am Freitag um 17 Uhr" }] },
            { id: "h14", number: 14, type: "mc", stimulusIds: ["h4-a14"], prompt: "Wo kann Frau Nowak ihre neue Bankkarte abholen?", options: [{ id: "a", label: "a", text: "In der Filiale am Bahnhof" }, { id: "b", label: "b", text: "Bei der Post" }, { id: "c", label: "c", text: "In der Filiale am Marktplatz" }] },
            { id: "h15", number: 15, type: "mc", stimulusIds: ["h4-a15"], prompt: "Was soll Jana für Tobias kaufen?", options: [{ id: "a", label: "a", text: "Nasenspray" }, { id: "b", label: "b", text: "Halstabletten" }, { id: "c", label: "c", text: "Tee" }] },
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
          instructionsDe:
            "Lesen Sie die zwei Texte. Sind die Aussagen 1–5 richtig oder falsch? Kreuzen Sie an. Lesen Sie zuerst das Beispiel.",
          example: { prompt: "Mirela war heute beim Arzt.", stimulusIds: ["l4-t1"], options: RF, answer: "r" },
          stimuli: [
            {
              id: "l4-t1",
              kind: "email",
              title: "Text 1",
              body:
                "**Von:** mirela.popescu@postnetz.de\n**An:** ines.wagner@postnetz.de\n**Betreff:** Deutschkurs\n\nLiebe Ines,\n\nich war heute beim Arzt. Ich habe eine Grippe. Ich muss bis Freitag zu Hause bleiben. Am Mittwoch kann ich nicht in den Deutschkurs kommen.\n\nKannst du mir bitte die Hausaufgaben schicken? Bitte ruf mich nicht an. Ich schlafe sehr viel. Schreib mir lieber eine Nachricht.\n\nLiebe Grüße\nMirela",
            },
            {
              id: "l4-t2",
              kind: "note",
              title: "Text 2",
              body:
                "Lieber Emil,\n\nich bin bei der Bank und dann beim Friseur. Um 17 Uhr bin ich wieder zu Hause. Dein Termin beim Zahnarzt ist morgen um 9 Uhr. Er ist nicht heute! Bitte ruf Oma an. Sie hat heute Geburtstag.\n\nPapa",
            },
          ],
          items: [
            { id: "l1", number: 1, type: "true_false", stimulusIds: ["l4-t1"], prompt: "Mirela muss bis Freitag zu Hause bleiben.", options: RF },
            { id: "l2", number: 2, type: "true_false", stimulusIds: ["l4-t1"], prompt: "Mirela geht am Mittwoch in den Deutschkurs.", options: RF },
            { id: "l3", number: 3, type: "true_false", stimulusIds: ["l4-t1"], prompt: "Ines soll Mirela anrufen.", options: RF },
            { id: "l4", number: 4, type: "true_false", stimulusIds: ["l4-t2"], prompt: "Emils Vater ist um 17 Uhr wieder zu Hause.", options: RF },
            { id: "l5", number: 5, type: "true_false", stimulusIds: ["l4-t2"], prompt: "Emil hat heute einen Termin beim Zahnarzt.", options: RF },
          ],
        },
        {
          partId: "lesen-2",
          instructionsDe:
            "Lesen Sie die Aufgaben 6–10 und die Texte. Welche Anzeige ist interessant für Sie? Kreuzen Sie an: a oder b. Lesen Sie zuerst das Beispiel.",
          example: {
            prompt: "Sie möchten am Montag Ihre Haare schneiden lassen.",
            stimulusIds: ["l4-ad0a", "l4-ad0b"],
            options: AB,
            answer: "a",
          },
          stimuli: [
            { id: "l4-ad0a", kind: "ad", label: "Beispiel a", body: "**Friseur Kamm & Schere**\nDamen, Herren, Kinder\nMontag bis Freitag 9–18 Uhr" },
            { id: "l4-ad0b", kind: "ad", label: "Beispiel b", body: "**Salon Lockenwerk**\nDienstag bis Samstag 8–17 Uhr\nMontag geschlossen" },
            { id: "l4-ad6a", kind: "ad", label: "6 a", body: "**Postfiliale Lindenplatz**\nBriefe, Pakete, Briefmarken\nMo–Fr 9–18 Uhr" },
            { id: "l4-ad6b", kind: "ad", label: "6 b", body: "**GeldExpress**\nSchicken Sie Geld ins Ausland!\nIn 10 Minuten bei Ihrer Familie – in über 100 Länder." },
            { id: "l4-ad7a", kind: "ad", label: "7 a", body: "**Zahnarztpraxis Dr. Sommer**\nSchmerzen? Kommen Sie ohne Termin!\nJeden Tag 8–10 Uhr" },
            { id: "l4-ad7b", kind: "ad", label: "7 b", body: "**Zahnarzt Dr. Winter**\nTermine nur online.\nNächster freier Termin: in vier Wochen" },
            { id: "l4-ad8a", kind: "ad", label: "8 a", body: "**Postfiliale Bahnhofstraße**\nPakete abholen und abgeben\nMontag bis Freitag 9–18 Uhr" },
            { id: "l4-ad8b", kind: "ad", label: "8 b", body: "**Kiosk Sonnenblick – Paketshop**\nPakete abholen und abgeben\nMontag bis Samstag 7–20 Uhr" },
            { id: "l4-ad9a", kind: "ad", label: "9 a", body: "**Bank am Ring**\nEin Konto für Sie!\nBeratung auf Deutsch, Englisch, Türkisch und Arabisch" },
            { id: "l4-ad9b", kind: "ad", label: "9 b", body: "**OnlineKonto 24**\nIhr Konto in 5 Minuten!\nAlle Informationen nur auf Deutsch" },
            { id: "l4-ad10a", kind: "ad", label: "10 a", body: "**FC Grünwiese**\nFußball für Erwachsene\nTraining dienstags 19 Uhr\nNeue Spieler willkommen!" },
            { id: "l4-ad10b", kind: "ad", label: "10 b", body: "**Krankenkasse VitaPlus**\nKurs: Gymnastik für den Rücken\nDonnerstag 18 Uhr\nFür Mitglieder kostenlos" },
          ],
          items: [
            { id: "l6", number: 6, type: "ab", stimulusIds: ["l4-ad6a", "l4-ad6b"], prompt: "Sie möchten Geld zu Ihrer Familie in die Türkei schicken.", options: AB },
            { id: "l7", number: 7, type: "ab", stimulusIds: ["l4-ad7a", "l4-ad7b"], prompt: "Sie haben Zahnschmerzen und brauchen schnell einen Arzt.", options: AB },
            { id: "l8", number: 8, type: "ab", stimulusIds: ["l4-ad8a", "l4-ad8b"], prompt: "Sie möchten am Samstag ein Paket abholen.", options: AB },
            { id: "l9", number: 9, type: "ab", stimulusIds: ["l4-ad9a", "l4-ad9b"], prompt: "Sie möchten ein Bankkonto. Sie sprechen Englisch, aber nur wenig Deutsch.", options: AB },
            { id: "l10", number: 10, type: "ab", stimulusIds: ["l4-ad10a", "l4-ad10b"], prompt: "Sie haben oft Rückenschmerzen und möchten etwas für Ihren Rücken tun.", options: AB },
          ],
        },
        {
          partId: "lesen-3",
          instructionsDe:
            "Lesen Sie die Texte und die Aufgaben 11–15. Kreuzen Sie an: Richtig oder Falsch. Lesen Sie zuerst das Beispiel.",
          example: { prompt: "An der Apotheke: Die Apotheke ist heute bis 22 Uhr offen.", stimulusIds: ["l4-s0"], options: RF, answer: "r" },
          stimuli: [
            { id: "l4-s0", kind: "notice", label: "Beispiel", title: "An der Tür der Apotheke", body: "**Rosen-Apotheke**\nHeute Notdienst bis 22 Uhr.\nBitte klingeln Sie." },
            { id: "l4-s11", kind: "notice", label: "11", title: "In der Post", body: "**Schalter 2: nur Pakete**\nBriefmarken gibt es am Automaten oder an Schalter 1." },
            { id: "l4-s12", kind: "notice", label: "12", title: "An der Tür einer Arztpraxis", body: "**Praxis Dr. Ahmadi**\nBitte gehen Sie zuerst zur Anmeldung.\nBringen Sie Ihre Versichertenkarte mit." },
            { id: "l4-s13", kind: "notice", label: "13", title: "An der Tür einer Bank", body: "**Stadtbank Lindenau**\nAm 3. Oktober ist unsere Filiale geschlossen.\nDie Geldautomaten sind 24 Stunden für Sie da." },
            { id: "l4-s14", kind: "notice", label: "14", title: "An der Bushaltestelle „Klinikum“", body: "**Linie 7**\nMo–Fr bis 20 Uhr: alle 10 Minuten\nAb 20 Uhr: alle 30 Minuten" },
            { id: "l4-s15", kind: "notice", label: "15", title: "Am Fenster eines Friseursalons", body: "**Salon Haarmonie**\nMontag bis Mittwoch: Kommen Sie ohne Termin!\nDonnerstag bis Samstag: nur mit Termin" },
          ],
          items: [
            { id: "l11", number: 11, type: "true_false", stimulusIds: ["l4-s11"], prompt: "An Schalter 2 kann man Briefmarken kaufen.", options: RF },
            { id: "l12", number: 12, type: "true_false", stimulusIds: ["l4-s12"], prompt: "In der Praxis soll man zuerst zur Anmeldung gehen.", options: RF },
            { id: "l13", number: 13, type: "true_false", stimulusIds: ["l4-s13"], prompt: "Am 3. Oktober kann man hier kein Geld holen.", options: RF },
            { id: "l14", number: 14, type: "true_false", stimulusIds: ["l4-s14"], prompt: "Um 21 Uhr fährt der Bus nur alle 30 Minuten.", options: RF },
            { id: "l15", number: 15, type: "true_false", stimulusIds: ["l4-s15"], prompt: "Am Dienstag kann man ohne Termin zum Friseur gehen.", options: RF },
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
            "Ihr Freund Nikolaos Papadakis ist neu in Freiburg. Er geht heute zum ersten Mal in die Praxis Dr. Reuter. Im Formular fehlen fünf Informationen. Lesen Sie den Text. Schreiben Sie die fünf fehlenden Informationen in das Formular.",
          stimuli: [
            {
              id: "s4-t1",
              kind: "text",
              title: "Nikolaos",
              body:
                "Nikolaos Papadakis kommt aus Griechenland. Er ist 34 Jahre alt. Er wohnt in der Kastanienallee 9, 79104 Freiburg. Er ist Koch von Beruf. Seine Handynummer ist 0172 5538914. Nikolaos ist bei der Krankenkasse VitaPlus. Er hat seit drei Tagen Rückenschmerzen. Er hat keine Allergien.",
            },
            {
              id: "s4-form",
              kind: "form",
              title: "Praxis Dr. Reuter – Neue Patienten",
              body:
                "| Feld | Eintrag |\n| --- | --- |\n| Name, Vorname | Papadakis, Nikolaos |\n| Herkunftsland | Griechenland |\n| Alter | (1) |\n| Straße, Hausnummer | Kastanienallee 9 |\n| PLZ, Wohnort | 79104 Freiburg |\n| Telefon (Handy) | (2) |\n| Beruf | Koch |\n| Krankenkasse | (3) |\n| Grund für den Besuch | (4) |\n| Allergien | (5) |",
            },
          ],
          items: [
            { id: "s1", number: 1, type: "short_text", stimulusIds: ["s4-t1", "s4-form"], fieldLabel: "Alter", prompt: "(1) Alter" },
            { id: "s2", number: 2, type: "short_text", stimulusIds: ["s4-t1", "s4-form"], fieldLabel: "Telefon (Handy)", prompt: "(2) Telefon (Handy)" },
            { id: "s3", number: 3, type: "short_text", stimulusIds: ["s4-t1", "s4-form"], fieldLabel: "Krankenkasse", prompt: "(3) Krankenkasse" },
            { id: "s4", number: 4, type: "short_text", stimulusIds: ["s4-t1", "s4-form"], fieldLabel: "Grund für den Besuch", prompt: "(4) Grund für den Besuch" },
            { id: "s5", number: 5, type: "short_text", stimulusIds: ["s4-t1", "s4-form"], fieldLabel: "Allergien", prompt: "(5) Allergien" },
          ],
        },
        {
          partId: "schreiben-2",
          instructionsDe:
            "Sie wohnen neu in der Stadt und brauchen eine Hausärztin. Schreiben Sie eine E-Mail an die Praxis Dr. Brenner. Schreiben Sie zu jedem Punkt ein bis zwei Sätze (circa 30 Wörter). Schreiben Sie auch eine Anrede und einen Gruß.",
          stimuli: [],
          items: [
            {
              id: "s6",
              number: 6,
              type: "writing",
              prompt: "E-Mail an die Praxis Dr. Brenner",
              writing: {
                taskDe:
                  "Schreiben Sie zu jedem Punkt ein bis zwei Sätze auf den Antwortbogen (circa 30 Wörter). Schreiben Sie auch eine Anrede und einen Gruß.",
                leitpunkte: [
                  "Sie möchten einen Termin.",
                  "Was haben Sie?",
                  "Wann haben Sie Zeit?",
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
            { id: "p4-c1", kind: "card", title: "Stichwörter", body: "Name? · Alter? · Land? · Wohnort? · Sprachen? · Beruf? · Hobby?" },
          ],
          items: [
            {
              id: "p1",
              number: 1,
              type: "speaking",
              stimulusIds: ["p4-c1"],
              prompt: "Sich vorstellen",
              speaking: {
                taskDe:
                  "Stellen Sie sich mit den Stichwörtern vor. Buchstabieren Sie dann ein Wort und nennen Sie eine Zahl.",
                cards: [{ title: "Stichwörter", body: "Name? Alter? Land? Wohnort? Sprachen? Beruf? Hobby?" }],
                partnerTurns: [
                  "Hallo und willkommen. Bitte erzählen Sie etwas über sich.",
                  "Vielen Dank. Wie schreibt man Ihren Vornamen? Buchstabieren Sie bitte.",
                  "Gut. Und wie ist Ihre Hausnummer?",
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
            "Sie bekommen zwei Karten mit einem Thema und einem Wort. Stellen Sie eine Frage zu Ihrer Karte. Ihre Partnerin / Ihr Partner antwortet. Zuerst Thema „Gesundheit“, dann Thema „Kleidung“.",
          stimuli: [
            { id: "p4-g1", kind: "card", label: "Gesundheit 1", title: "Thema: Gesundheit", body: "**Arzt**" },
            { id: "p4-g2", kind: "card", label: "Gesundheit 2", title: "Thema: Gesundheit", body: "**Sport**" },
            { id: "p4-g3", kind: "card", label: "Gesundheit 3", title: "Thema: Gesundheit", body: "**Schlafen**" },
            { id: "p4-g4", kind: "card", label: "Gesundheit 4", title: "Thema: Gesundheit", body: "**Apotheke**" },
            { id: "p4-g5", kind: "card", label: "Gesundheit 5", title: "Thema: Gesundheit", body: "**Zähne**" },
            { id: "p4-g6", kind: "card", label: "Gesundheit 6", title: "Thema: Gesundheit", body: "**Obst**" },
            { id: "p4-k1", kind: "card", label: "Kleidung 1", title: "Thema: Kleidung", body: "**Schuhe**" },
            { id: "p4-k2", kind: "card", label: "Kleidung 2", title: "Thema: Kleidung", body: "**Farbe**" },
            { id: "p4-k3", kind: "card", label: "Kleidung 3", title: "Thema: Kleidung", body: "**Jacke**" },
            { id: "p4-k4", kind: "card", label: "Kleidung 4", title: "Thema: Kleidung", body: "**Größe**" },
            { id: "p4-k5", kind: "card", label: "Kleidung 5", title: "Thema: Kleidung", body: "**Winter**" },
            { id: "p4-k6", kind: "card", label: "Kleidung 6", title: "Thema: Kleidung", body: "**Hose**" },
          ],
          items: [
            {
              id: "p2",
              number: 2,
              type: "speaking",
              stimulusIds: ["p4-g1", "p4-g2", "p4-g3", "p4-g4", "p4-g5", "p4-g6", "p4-k1", "p4-k2", "p4-k3", "p4-k4", "p4-k5", "p4-k6"],
              prompt: "Um Informationen bitten und Informationen geben",
              speaking: {
                taskDe:
                  "Sie ziehen eine Karte zum Thema „Gesundheit“ und eine Karte zum Thema „Kleidung“. Stellen Sie zu jeder Karte eine Frage. Antworten Sie auch auf die zwei Fragen Ihrer Partnerin / Ihres Partners.",
                cards: [
                  { title: "Thema: Gesundheit", body: "Arzt" },
                  { title: "Thema: Gesundheit", body: "Sport" },
                  { title: "Thema: Gesundheit", body: "Schlafen" },
                  { title: "Thema: Gesundheit", body: "Apotheke" },
                  { title: "Thema: Gesundheit", body: "Zähne" },
                  { title: "Thema: Gesundheit", body: "Obst" },
                  { title: "Thema: Kleidung", body: "Schuhe" },
                  { title: "Thema: Kleidung", body: "Farbe" },
                  { title: "Thema: Kleidung", body: "Jacke" },
                  { title: "Thema: Kleidung", body: "Größe" },
                  { title: "Thema: Kleidung", body: "Winter" },
                  { title: "Thema: Kleidung", body: "Hose" },
                ],
                partnerTurns: [
                  "Wir beginnen mit dem Thema Gesundheit. Ihre Karte: Sport. Bitte fragen Sie.",
                  "(Partner antwortet) Ich gehe zweimal pro Woche schwimmen. – Meine Karte ist Schlafen: Wie lange schläfst du in der Nacht?",
                  "Danke. Jetzt das Thema Kleidung. Ihre Karte: Farbe. Bitte fragen Sie.",
                  "(Partnerin antwortet) Meine Lieblingsfarbe ist Grün. – Meine Karte ist Schuhe: Wo kaufst du deine Schuhe?",
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
            "Sie bekommen zwei Karten. Formulieren Sie eine Bitte zu Ihrer Karte. Ihre Partnerin / Ihr Partner reagiert. Reagieren Sie auch auf die Bitten Ihrer Partnerin / Ihres Partners.",
          stimuli: [
            { id: "p4-h1", kind: "card", label: "Karte 1", title: "Handlungskarte", body: "Bild: ein Glas Wasser", imageAlt: "Ein volles Glas Wasser" },
            { id: "p4-h2", kind: "card", label: "Karte 2", title: "Handlungskarte", body: "Bild: eine Uhr", imageAlt: "Eine Armbanduhr" },
            { id: "p4-h3", kind: "card", label: "Karte 3", title: "Handlungskarte", body: "Bild: ein Regenschirm", imageAlt: "Ein geschlossener Regenschirm" },
            { id: "p4-h4", kind: "card", label: "Karte 4", title: "Handlungskarte", body: "Bild: eine Packung Tabletten", imageAlt: "Eine kleine Packung Kopfschmerztabletten" },
            { id: "p4-h5", kind: "card", label: "Karte 5", title: "Handlungskarte", body: "Bild: ein Handy", imageAlt: "Ein Smartphone" },
            { id: "p4-h6", kind: "card", label: "Karte 6", title: "Handlungskarte", body: "Bild: eine Lampe", imageAlt: "Eine Tischlampe, ausgeschaltet" },
          ],
          items: [
            {
              id: "p3",
              number: 3,
              type: "speaking",
              stimulusIds: ["p4-h1", "p4-h2", "p4-h3", "p4-h4", "p4-h5", "p4-h6"],
              prompt: "Bitten formulieren und darauf reagieren",
              speaking: {
                taskDe:
                  "Formulieren Sie zu jeder Karte eine Bitte. Reagieren Sie auch auf zwei Bitten Ihrer Partnerin / Ihres Partners.",
                cards: [
                  { title: "Karte 1", body: "Bild: ein Glas Wasser" },
                  { title: "Karte 2", body: "Bild: eine Uhr" },
                  { title: "Karte 3", body: "Bild: ein Regenschirm" },
                  { title: "Karte 4", body: "Bild: eine Packung Tabletten" },
                  { title: "Karte 5", body: "Bild: ein Handy" },
                  { title: "Karte 6", body: "Bild: eine Lampe" },
                ],
                partnerTurns: [
                  "Ihre erste Karte zeigt ein Glas Wasser. Bitte formulieren Sie eine Bitte.",
                  "(Partnerin reagiert) Ja, natürlich, hier bitte. – Meine Karte ist die Uhr: Wie spät ist es, bitte?",
                  "Danke. Ihre zweite Karte zeigt einen Regenschirm.",
                  "(Partner reagiert) Tut mir leid, ich brauche ihn heute selbst. – Meine Karte ist die Lampe: Kannst du bitte das Licht anmachen?",
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
      id: "sc4-h0", title: "Beispiel – In der Apotheke", scenario: "shop",
      environment: { preset: "shop", ambienceLevel: 0.1, ambiencePrompt: "small pharmacy, door bell, quiet" },
      speakers: [{ id: "k", name: "Kunde", role: "Kunde", gender: "male" }, { id: "a", name: "Apothekerin", role: "Apothekerin", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "k", text: "Guten Tag. Ich habe Husten. Haben Sie einen Hustensaft?", pauseAfterMs: 500 },
        { id: "t2", speakerId: "a", text: "Ja, hier. Den nehmen Sie dreimal am Tag." },
        { id: "t3", speakerId: "k", text: "Gut. Was kostet er?" },
        { id: "t4", speakerId: "a", text: "Das macht acht Euro vierzig, bitte." },
      ],
    },
    {
      id: "sc4-h1", title: "Beim Arzt", scenario: "doctor",
      environment: { preset: "doctor", ambienceLevel: 0.08 },
      speakers: [{ id: "b", name: "Herr Brückner", role: "Patient", gender: "male", age: "senior" }, { id: "d", name: "Ärztin", role: "Ärztin", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "So, Herr Brückner. Nehmen Sie die Tabletten drei Tage lang, morgens und abends." },
        { id: "t2", speakerId: "b", text: "Drei Tage, gut. Soll ich nächste Woche wiederkommen?" },
        { id: "t3", speakerId: "d", text: "Nein, nicht nächste Woche. Kommen Sie bitte in zwei Wochen wieder." },
        { id: "t4", speakerId: "b", text: "In zwei Wochen. Danke, Frau Doktor." },
      ],
    },
    {
      id: "sc4-h2", title: "Beim Friseur", scenario: "shop",
      environment: { preset: "shop", ambienceLevel: 0.12, ambiencePrompt: "hair salon, hair dryer far away, soft radio" },
      speakers: [{ id: "k", name: "Kundin", role: "Kundin", gender: "female", age: "young" }, { id: "f", name: "Friseurin", role: "Friseurin", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "k", text: "Hallo! Ich möchte heute eine neue Farbe. Rot, bitte." },
        { id: "t2", speakerId: "f", text: "Rot geht heute leider nicht. Das dauert zwei Stunden. Ich habe nur eine halbe Stunde Zeit." },
        { id: "t3", speakerId: "k", text: "Schade. Dann bitte nur schneiden. Ganz kurz." },
        { id: "t4", speakerId: "f", text: "Gut. Soll ich die Haare zuerst waschen?" },
        { id: "t5", speakerId: "k", text: "Nein, danke. Ich habe sie heute Morgen gewaschen." },
      ],
    },
    {
      id: "sc4-h3", title: "In der Post", scenario: "public_office",
      environment: { preset: "public_office", ambienceLevel: 0.1, ambiencePrompt: "post office counter, quiet queue" },
      speakers: [{ id: "k", name: "Kundin", role: "Kundin", gender: "female", age: "senior" }, { id: "m", name: "Mitarbeiter", role: "Post", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "k", text: "Guten Tag. Ich möchte Briefmarken. Zwanzig Stück, bitte." },
        { id: "t2", speakerId: "m", text: "Für Briefe in Deutschland? Eine Briefmarke kostet fünfundneunzig Cent." },
        { id: "t3", speakerId: "k", text: "Oh, das ist teuer. Dann nehme ich nur zehn." },
        { id: "t4", speakerId: "m", text: "Zehn Briefmarken. Das macht neun Euro fünfzig." },
      ],
    },
    {
      id: "sc4-h4", title: "In der Bank", scenario: "public_office",
      environment: { preset: "public_office", ambienceLevel: 0.08, reverb: 0.15 },
      speakers: [{ id: "k", name: "Kunde", role: "Kunde", gender: "male", age: "young" }, { id: "m", name: "Mitarbeiterin", role: "Bank", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "k", text: "Entschuldigung, wo ist hier der Geldautomat? Neben der Tür?" },
        { id: "t2", speakerId: "m", text: "Nein, neben der Tür ist der Drucker für die Kontoauszüge. Der Geldautomat ist hinten rechts." },
        { id: "t3", speakerId: "k", text: "Hinten rechts, danke. Und wo ist die Beratung?" },
        { id: "t4", speakerId: "m", text: "Die Beratung ist im ersten Stock." },
      ],
    },
    {
      id: "sc4-h5", title: "Bei der Krankenkasse", scenario: "public_office",
      environment: { preset: "public_office", ambienceLevel: 0.08 },
      speakers: [{ id: "f", name: "Frau Mendes", role: "Kundin", gender: "female" }, { id: "m", name: "Mitarbeiter", role: "Krankenkasse", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "f", text: "Guten Tag. Meine Versichertenkarte ist kaputt. Ich brauche eine neue." },
        { id: "t2", speakerId: "m", text: "Kein Problem, Frau Mendes. Haben Sie ein Foto von sich?" },
        { id: "t3", speakerId: "f", text: "Ein Foto? Nein. Aber hier ist mein Pass." },
        { id: "t4", speakerId: "m", text: "Den Pass brauche ich nicht. Ich brauche nur ein Foto. Sie können es auch online schicken." },
      ],
    },
    {
      id: "sc4-h6", title: "An der Anmeldung", scenario: "doctor",
      environment: { preset: "doctor", ambienceLevel: 0.1, ambiencePrompt: "doctor's waiting room, quiet phone ringing far away" },
      speakers: [{ id: "a", name: "Anmeldung", role: "Medizinischer Fachangestellter", gender: "male" }, { id: "o", name: "Frau Okafor", role: "Patientin", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "a", text: "Sie brauchen einen neuen Termin, Frau Okafor? Am Freitag um acht Uhr dreißig ist frei." },
        { id: "t2", speakerId: "o", text: "Um acht Uhr dreißig bringe ich meine Tochter zur Schule. Geht es etwas später?" },
        { id: "t3", speakerId: "a", text: "Um neun Uhr fünfzehn oder um zehn Uhr." },
        { id: "t4", speakerId: "o", text: "Um zehn Uhr arbeite ich schon. Dann nehme ich neun Uhr fünfzehn." },
        { id: "t5", speakerId: "a", text: "Gut, Freitag um neun Uhr fünfzehn." },
      ],
    },
    {
      id: "sc4-h6x", title: "Beispiel – Durchsage im Ärztehaus", scenario: "doctor",
      environment: { preset: "doctor", ambienceLevel: 0.12, publicAddress: true, reverb: 0.25 },
      speakers: [{ id: "d", name: "Durchsage", role: "Ärztehaus", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Patientinnen und Patienten! Die Apotheke im Erdgeschoss hat heute bis zwanzig Uhr geöffnet. Vielen Dank.", pace: 0.95 },
      ],
    },
    {
      id: "sc4-h7", title: "Durchsage in der Post", scenario: "public_office",
      environment: { preset: "public_office", ambienceLevel: 0.15, publicAddress: true, reverb: 0.2 },
      speakers: [{ id: "d", name: "Durchsage", role: "Postfiliale", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Kundinnen und Kunden! Schalter drei ist jetzt geschlossen. Bitte gehen Sie zu Schalter eins oder zwei. Danke!", pace: 0.95 },
      ],
    },
    {
      id: "sc4-h8", title: "Durchsage im Einkaufszentrum", scenario: "shop",
      environment: { preset: "shop", ambienceLevel: 0.18, publicAddress: true, reverb: 0.3, ambiencePrompt: "shopping centre hall, footsteps, soft music" },
      speakers: [{ id: "d", name: "Durchsage", role: "Einkaufszentrum", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Besucher! Heute bei Salon Bella im ersten Stock: Haare schneiden für nur zwölf Euro. Kommen Sie ohne Termin!" },
      ],
    },
    {
      id: "sc4-h9", title: "Durchsage am Busbahnhof", scenario: "street",
      environment: { preset: "street", ambienceLevel: 0.2, publicAddress: true, reverb: 0.3, ambiencePrompt: "bus station, buses idling, light traffic" },
      speakers: [{ id: "d", name: "Durchsage", role: "Busbahnhof", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Achtung, bitte! Die Linie zwölf zum Krankenhaus fährt heute nicht von Haltestelle A. Sie fährt von Haltestelle D. Ich wiederhole: Haltestelle D.", pace: 0.95 },
      ],
    },
    {
      id: "sc4-h10", title: "Durchsage im Krankenhaus", scenario: "doctor",
      environment: { preset: "doctor", ambienceLevel: 0.1, publicAddress: true, reverb: 0.3 },
      speakers: [{ id: "d", name: "Durchsage", role: "Krankenhaus", gender: "female", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Besucherinnen und Besucher! Die Besuchszeit endet heute um zwanzig Uhr. Das ist in fünfzehn Minuten. Vielen Dank." },
      ],
    },
    {
      id: "sc4-h11", title: "Nachricht aus der Praxis", scenario: "doctor",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "p", name: "Praxis Dr. Lindqvist", role: "Praxis", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "p", text: "Guten Tag, Herr Demir. Hier ist die Praxis Doktor Lindqvist. Ihr Rezept ist fertig. Heute ist die Praxis schon zu. Sie können das Rezept morgen ab acht Uhr abholen. Auf Wiederhören!" },
      ],
    },
    {
      id: "sc4-h12", title: "Nachricht von der Apotheke", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "a", name: "Löwen-Apotheke", role: "Apotheker", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "a", text: "Hallo Frau Hansen, hier ist die Löwen-Apotheke. Ihr Medikament ist jetzt da. Bitte bringen Sie das Rezept mit. Ihre Versichertenkarte brauchen wir nicht. Bis bald!" },
      ],
    },
    {
      id: "sc4-h13", title: "Nachricht vom Friseur", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.05, telephoneFilter: true },
      speakers: [{ id: "f", name: "Salon Schnittpunkt", role: "Friseurin", gender: "female", age: "young" }],
      turns: [
        { id: "t1", speakerId: "f", text: "Guten Tag, Herr Kowalski. Hier ist der Salon Schnittpunkt. Ihr Termin am Donnerstag um fünfzehn Uhr geht leider nicht. Frau Berger ist krank. Kommen Sie bitte am Freitag um fünfzehn Uhr. Um siebzehn Uhr ist leider schon alles voll. Danke!" },
      ],
    },
    {
      id: "sc4-h14", title: "Nachricht von der Bank", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "b", name: "Herr Albrecht", role: "Stadtbank Lindenau", gender: "male", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "b", text: "Guten Tag, Frau Nowak. Hier ist Albrecht von der Stadtbank Lindenau. Ihre neue Bankkarte ist da. Bitte kommen Sie in die Filiale am Marktplatz, nicht in die Filiale am Bahnhof. Bringen Sie bitte Ihren Ausweis mit." },
      ],
    },
    {
      id: "sc4-h15", title: "Nachricht von Tobias", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.05, telephoneFilter: true },
      speakers: [{ id: "t", name: "Tobias", role: "Freund", gender: "male", age: "young" }],
      turns: [
        { id: "t1", speakerId: "t", text: "Hallo Jana, hier ist Tobias. Ich bin krank und komme heute nicht zum Sport. Mein Hals tut weh. Kannst du mir bitte Halstabletten aus der Apotheke mitbringen? Nasenspray und Tee habe ich noch. Danke!" },
      ],
    },
  ],

  /* ==================================================================================== */
  /* ANSWER KEY                                                                           */
  /* ==================================================================================== */
  answerKey: {
    h1: { correct: ["c"], explanation: "Die Tabletten nimmt er drei Tage lang. Nächste Woche soll er nicht kommen, sondern in zwei Wochen.", evidence: "Kommen Sie bitte in zwei Wochen wieder." },
    h2: { correct: ["a"], explanation: "Rot geht heute nicht, und waschen möchte die Frau nicht. Die Friseurin schneidet die Haare ganz kurz.", evidence: "Dann bitte nur schneiden. Ganz kurz." },
    h3: { correct: ["b"], explanation: "Die Frau möchte zuerst zwanzig Briefmarken, nimmt dann aber nur zehn.", evidence: "Dann nehme ich nur zehn." },
    h4: { correct: ["c"], explanation: "Neben der Tür ist der Drucker für Kontoauszüge, im ersten Stock die Beratung. Der Geldautomat ist hinten rechts.", evidence: "Der Geldautomat ist hinten rechts." },
    h5: { correct: ["a"], explanation: "Der Mitarbeiter braucht nur ein Foto, nicht den Pass.", evidence: "Ich brauche nur ein Foto." },
    h6: { correct: ["b"], explanation: "Um 8:30 Uhr bringt sie ihre Tochter zur Schule, um 10 Uhr arbeitet sie. Sie nimmt 9:15 Uhr.", evidence: "Dann nehme ich neun Uhr fünfzehn." },
    h7: { correct: ["f"], explanation: "Schalter 3 ist jetzt geschlossen. Man soll zu Schalter 1 oder 2 gehen.", evidence: "Schalter drei ist jetzt geschlossen." },
    h8: { correct: ["r"], explanation: "Der Salon Bella ist im ersten Stock.", evidence: "Salon Bella im ersten Stock" },
    h9: { correct: ["f"], explanation: "Der Bus zum Krankenhaus fährt heute von Haltestelle D, nicht von A.", evidence: "fährt heute nicht von Haltestelle A. Sie fährt von Haltestelle D." },
    h10: { correct: ["r"], explanation: "Die Besuchszeit endet heute um 20 Uhr.", evidence: "Die Besuchszeit endet heute um zwanzig Uhr." },
    h11: { correct: ["b"], explanation: "Heute ist die Praxis schon zu. Herr Demir kann das Rezept morgen ab acht Uhr abholen.", evidence: "Sie können das Rezept morgen ab acht Uhr abholen." },
    h12: { correct: ["c"], explanation: "Frau Hansen soll das Rezept mitbringen. Die Versichertenkarte braucht die Apotheke nicht.", evidence: "Bitte bringen Sie das Rezept mit." },
    h13: { correct: ["a"], explanation: "Donnerstag geht nicht, um 17 Uhr ist alles voll. Er soll am Freitag um 15 Uhr kommen.", evidence: "Kommen Sie bitte am Freitag um fünfzehn Uhr." },
    h14: { correct: ["c"], explanation: "Sie soll in die Filiale am Marktplatz kommen, nicht in die Filiale am Bahnhof.", evidence: "Bitte kommen Sie in die Filiale am Marktplatz" },
    h15: { correct: ["b"], explanation: "Nasenspray und Tee hat Tobias noch. Jana soll Halstabletten mitbringen.", evidence: "Kannst du mir bitte Halstabletten aus der Apotheke mitbringen?" },
    l1: { correct: ["r"], explanation: "Mirela hat eine Grippe und muss bis Freitag zu Hause bleiben.", evidence: "Ich muss bis Freitag zu Hause bleiben." },
    l2: { correct: ["f"], explanation: "Am Mittwoch kann Mirela nicht in den Deutschkurs kommen.", evidence: "Am Mittwoch kann ich nicht in den Deutschkurs kommen." },
    l3: { correct: ["f"], explanation: "Ines soll nicht anrufen, sondern eine Nachricht schreiben.", evidence: "Bitte ruf mich nicht an. … Schreib mir lieber eine Nachricht." },
    l4: { correct: ["r"], explanation: "Der Vater schreibt: Um 17 Uhr bin ich wieder zu Hause.", evidence: "Um 17 Uhr bin ich wieder zu Hause." },
    l5: { correct: ["f"], explanation: "Der Termin beim Zahnarzt ist morgen, nicht heute.", evidence: "Dein Termin beim Zahnarzt ist morgen um 9 Uhr. Er ist nicht heute!" },
    l6: { correct: ["b"], explanation: "GeldExpress schickt Geld ins Ausland. Die Post hat nur Briefe, Pakete und Briefmarken.", evidence: "Schicken Sie Geld ins Ausland!" },
    l7: { correct: ["a"], explanation: "Bei Dr. Sommer kann man mit Schmerzen ohne Termin kommen. Bei Dr. Winter wartet man vier Wochen.", evidence: "Schmerzen? Kommen Sie ohne Termin!" },
    l8: { correct: ["b"], explanation: "Der Paketshop im Kiosk ist auch am Samstag offen. Die Postfiliale ist nur Montag bis Freitag offen.", evidence: "Montag bis Samstag 7–20 Uhr" },
    l9: { correct: ["a"], explanation: "Die Bank am Ring berät auch auf Englisch. Das Online-Konto gibt es nur auf Deutsch.", evidence: "Beratung auf Deutsch, Englisch, Türkisch und Arabisch" },
    l10: { correct: ["b"], explanation: "Die Krankenkasse hat einen Kurs für den Rücken. Der Fußballverein bietet nur Fußball an.", evidence: "Kurs: Gymnastik für den Rücken" },
    l11: { correct: ["f"], explanation: "Schalter 2 ist nur für Pakete. Briefmarken gibt es am Automaten oder an Schalter 1.", evidence: "Schalter 2: nur Pakete" },
    l12: { correct: ["r"], explanation: "Patienten sollen zuerst zur Anmeldung gehen.", evidence: "Bitte gehen Sie zuerst zur Anmeldung." },
    l13: { correct: ["f"], explanation: "Die Filiale ist geschlossen, aber die Geldautomaten sind 24 Stunden da.", evidence: "Die Geldautomaten sind 24 Stunden für Sie da." },
    l14: { correct: ["r"], explanation: "Ab 20 Uhr fährt die Linie 7 nur alle 30 Minuten.", evidence: "Ab 20 Uhr: alle 30 Minuten" },
    l15: { correct: ["r"], explanation: "Von Montag bis Mittwoch kann man ohne Termin kommen. Dienstag gehört dazu.", evidence: "Montag bis Mittwoch: Kommen Sie ohne Termin!" },
    s1: { correct: ["34", "34 Jahre", "34 Jahre alt", "vierunddreißig", "vierunddreissig"], explanation: "Nikolaos ist 34 Jahre alt.", evidence: "Er ist 34 Jahre alt." },
    s2: { correct: ["0172 5538914", "01725538914", "0172/5538914", "0172-5538914", "0172 553 8914", "0172 5538 914"], explanation: "Seine Handynummer ist 0172 5538914.", evidence: "Seine Handynummer ist 0172 5538914." },
    s3: { correct: ["VitaPlus", "Vita Plus", "Vitaplus", "Krankenkasse VitaPlus"], explanation: "Nikolaos ist bei der Krankenkasse VitaPlus.", evidence: "Nikolaos ist bei der Krankenkasse VitaPlus." },
    s4: { correct: ["Rückenschmerzen", "Rueckenschmerzen", "Rücken", "Schmerzen im Rücken", "Rückenschmerzen seit drei Tagen", "Rückenschmerzen seit 3 Tagen"], explanation: "Er hat seit drei Tagen Rückenschmerzen.", evidence: "Er hat seit drei Tagen Rückenschmerzen." },
    s5: { correct: ["keine", "nein", "keine Allergien", "keine Allergie", "-"], explanation: "Nikolaos hat keine Allergien.", evidence: "Er hat keine Allergien." },
    s6: { correct: [], explanation: "Bewertet werden die drei Inhaltspunkte (je 0 / 1,5 / 3 Punkte) und die Textsorte mit Anrede und Gruß (0 / 0,5 / 1 Punkt)." },
    p1: { correct: [], explanation: "Bewertet werden Vorstellen, Buchstabieren und Zahl (je max. 1 Punkt)." },
    p2: { correct: [], explanation: "Pro Karte: Frage max. 2 Punkte, Antwort max. 1 Punkt." },
    p3: { correct: [], explanation: "Pro Karte: Bitte max. 2 Punkte, Reaktion max. 1 Punkt." },
  },
};
