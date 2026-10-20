import type { ExamContentInput } from "@/domain/exam/schema";

/**
 * telc A1 (Start Deutsch 1) — Übungstest 5 (original content).
 *
 * Themes: work, school and learning (office, internship, German course, kindergarten,
 * school, appointments with colleagues). All texts, scripts and tasks are original and
 * written for this platform; they follow the published task formats only.
 */

const RF = [
  { id: "r", label: "Richtig", text: "Richtig" },
  { id: "f", label: "Falsch", text: "Falsch" },
];

const AB = [
  { id: "a", label: "a", text: "Anzeige a" },
  { id: "b", label: "b", text: "Anzeige b" },
];

export const telcA1Mock5: ExamContentInput = {
  schemaVersion: 1,
  blueprintKey: "telc-a1-sd1",
  blueprintVersion: "2026.10.2",
  title: "telc A1 — Übungstest 5",
  themes: ["Arbeit", "Büro", "Praktikum", "Deutschkurs", "Kindergarten", "Schule"],
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
            prompt: "In welchem Stock ist das Büro von Frau Lindqvist?",
            stimulusIds: ["h-a0"],
            options: [
              { id: "a", label: "a", text: "Im dritten Stock" },
              { id: "b", label: "b", text: "Im vierten Stock" },
              { id: "c", label: "c", text: "Im fünften Stock" },
            ],
            answer: "c",
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
            { id: "h1", number: 1, type: "mc", stimulusIds: ["h-a1"], prompt: "Wann ist die Besprechung?", options: [{ id: "a", label: "a", text: "Am Dienstag um 9 Uhr" }, { id: "b", label: "b", text: "Am Dienstag um 11 Uhr" }, { id: "c", label: "c", text: "Am Montag um 11 Uhr" }] },
            { id: "h2", number: 2, type: "mc", stimulusIds: ["h-a2"], prompt: "Wann holt Herr Demir seine Tochter heute ab?", options: [{ id: "a", label: "a", text: "Um halb vier" }, { id: "b", label: "b", text: "Um vier Uhr" }, { id: "c", label: "c", text: "Um fünf Uhr" }] },
            { id: "h3", number: 3, type: "mc", stimulusIds: ["h-a3"], prompt: "Was sollen die Kursteilnehmer bis Donnerstag machen?", options: [{ id: "a", label: "a", text: "Seite 24 lesen" }, { id: "b", label: "b", text: "Einen Text schreiben" }, { id: "c", label: "c", text: "Neue Wörter lernen" }] },
            { id: "h4", number: 4, type: "mc", stimulusIds: ["h-a4"], prompt: "Wie lange dauert Jonas’ Praktikum?", options: [{ id: "a", label: "a", text: "Zwei Wochen" }, { id: "b", label: "b", text: "Drei Wochen" }, { id: "c", label: "c", text: "Drei Monate" }] },
            { id: "h5", number: 5, type: "mc", stimulusIds: ["h-a5"], prompt: "Was braucht Lukas morgen in der Schule?", options: [{ id: "a", label: "a", text: "Farben" }, { id: "b", label: "b", text: "Turnschuhe" }, { id: "c", label: "c", text: "Ein Lineal" }] },
            { id: "h6", number: 6, type: "mc", stimulusIds: ["h-a6"], prompt: "Wo essen die Kolleginnen heute zu Mittag?", options: [{ id: "a", label: "a", text: "In der Kantine" }, { id: "b", label: "b", text: "Beim Italiener" }, { id: "c", label: "c", text: "Im Büro" }] },
          ],
        },
        {
          partId: "hoeren-2",
          instructionsDe:
            "Sie hören Durchsagen. Sie hören jeden Text einmal. Kreuzen Sie an: Richtig oder Falsch. Lesen Sie zuerst das Beispiel.",
          example: { prompt: "Die sechste Stunde ist heute frei.", stimulusIds: ["h-a7b"], options: RF, answer: "r" },
          stimuli: [
            { id: "h-a7b", kind: "audio", title: "Beispiel", scriptId: "sc-h7b", body: "" },
            { id: "h-a7", kind: "audio", title: "Durchsage 7", scriptId: "sc-h7", body: "" },
            { id: "h-a8", kind: "audio", title: "Durchsage 8", scriptId: "sc-h8", body: "" },
            { id: "h-a9", kind: "audio", title: "Durchsage 9", scriptId: "sc-h9", body: "" },
            { id: "h-a10", kind: "audio", title: "Durchsage 10", scriptId: "sc-h10", body: "" },
          ],
          items: [
            { id: "h7", number: 7, type: "true_false", stimulusIds: ["h-a7"], prompt: "Der Englischkurs ist heute in Raum 7.", options: RF },
            { id: "h8", number: 8, type: "true_false", stimulusIds: ["h-a8"], prompt: "Morgen um 9 Uhr kann man den Aufzug nicht benutzen.", options: RF },
            { id: "h9", number: 9, type: "true_false", stimulusIds: ["h-a9"], prompt: "Der Zug nach Freiburg fährt heute von Gleis 2.", options: RF },
            { id: "h10", number: 10, type: "true_false", stimulusIds: ["h-a10"], prompt: "Die Bibliothek öffnet morgen um 9 Uhr.", options: RF },
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
            { id: "h11", number: 11, type: "mc", stimulusIds: ["h-a11"], prompt: "Wann ist der Termin mit der Firma Kessler?", options: [{ id: "a", label: "a", text: "Am Donnerstag um 10 Uhr" }, { id: "b", label: "b", text: "Am Freitag um 9 Uhr" }, { id: "c", label: "c", text: "Am Freitag um 10 Uhr" }] },
            { id: "h12", number: 12, type: "mc", stimulusIds: ["h-a12"], prompt: "Wann soll Frau Haddad ihren Sohn abholen?", options: [{ id: "a", label: "a", text: "Um 13 Uhr" }, { id: "b", label: "b", text: "Um 15 Uhr" }, { id: "c", label: "c", text: "Um 16 Uhr" }] },
            { id: "h13", number: 13, type: "mc", stimulusIds: ["h-a13"], prompt: "Was soll Herr Moreno am ersten Kurstag mitbringen?", options: [{ id: "a", label: "a", text: "Ein Kursbuch" }, { id: "b", label: "b", text: "Ein Passfoto" }, { id: "c", label: "c", text: "Die Kursgebühr" }] },
            { id: "h14", number: 14, type: "mc", stimulusIds: ["h-a14"], prompt: "Warum ruft Timo an?", options: [{ id: "a", label: "a", text: "Er hat eine neue Arbeit." }, { id: "b", label: "b", text: "Er möchte ins Restaurant gehen." }, { id: "c", label: "c", text: "Er möchte mit Paula üben." }] },
            { id: "h15", number: 15, type: "mc", stimulusIds: ["h-a15"], prompt: "Wohin soll Herr Lindner am Montag zuerst gehen?", options: [{ id: "a", label: "a", text: "Ins Personalbüro" }, { id: "b", label: "b", text: "Zum Empfang" }, { id: "c", label: "c", text: "In die Kantine" }] },
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
          instructionsDe: "Lesen Sie die zwei Texte. Sind die Aussagen 1–5 richtig oder falsch? Kreuzen Sie an. Lesen Sie zuerst das Beispiel.",
          example: { prompt: "Der Deutschkurs endet am Freitag.", stimulusIds: ["l-t1"], options: RF, answer: "r" },
          stimuli: [
            {
              id: "l-t1",
              kind: "email",
              title: "Text 1",
              body:
                "**Von:** yusuf.arslan@webpost.de\n**An:** Kurs Deutsch A1\n**Betreff:** Unser letzter Kurstag\n\nLiebe Kursteilnehmerinnen und Kursteilnehmer,\n\nam Freitag ist unser letzter Kurstag. Nach dem Unterricht machen wir eine kleine Feier. Sie beginnt um 12 Uhr im Kursraum. Bitte bringt etwas zu essen mit. Die Getränke kauft Frau Brandt, unsere Lehrerin.\n\nDer neue Kurs beginnt am 2. September. Wer macht mit?\n\nViele Grüße\nYusuf",
            },
            {
              id: "l-t2",
              kind: "note",
              title: "Text 2",
              body:
                "Hallo Elif,\n\nich bin heute ab 14 Uhr beim Zahnarzt. Kannst du bitte um 15 Uhr Herrn Becker anrufen? Seine Telefonnummer liegt auf meinem Schreibtisch. Die Briefe für die Post sind schon fertig. Sie liegen neben dem Drucker.\n\nDanke!\nJan",
            },
          ],
          items: [
            { id: "l1", number: 1, type: "true_false", stimulusIds: ["l-t1"], prompt: "Die Feier ist am Abend.", options: RF },
            { id: "l2", number: 2, type: "true_false", stimulusIds: ["l-t1"], prompt: "Die Kursteilnehmer sollen Essen mitbringen.", options: RF },
            { id: "l3", number: 3, type: "true_false", stimulusIds: ["l-t1"], prompt: "Yusuf kauft die Getränke.", options: RF },
            { id: "l4", number: 4, type: "true_false", stimulusIds: ["l-t2"], prompt: "Elif soll Herrn Becker eine E-Mail schreiben.", options: RF },
            { id: "l5", number: 5, type: "true_false", stimulusIds: ["l-t2"], prompt: "Jan ist am Nachmittag nicht im Büro.", options: RF },
          ],
        },
        {
          partId: "lesen-2",
          instructionsDe:
            "Lesen Sie die Aufgaben 6–10 und die Texte. Welche Anzeige ist interessant für Sie? Kreuzen Sie an: a oder b. Lesen Sie zuerst das Beispiel.",
          example: {
            prompt: "Ihr Sohn ist drei Jahre alt. Sie suchen einen Platz im Kindergarten.",
            stimulusIds: ["l-ad0a", "l-ad0b"],
            options: AB,
            answer: "a",
          },
          stimuli: [
            { id: "l-ad0a", kind: "ad", label: "Beispiel a", body: "**Kita Regenbogen**\nWir haben noch Plätze frei!\nFür Kinder von 1 bis 6 Jahren.\nMo–Fr 7–17 Uhr" },
            { id: "l-ad0b", kind: "ad", label: "Beispiel b", body: "**Grundschule am Park**\nAnmeldung für die erste Klasse\nbis 31. Januar im Sekretariat" },
            { id: "l-ad6a", kind: "ad", label: "6 a", body: "**Sprachschule Wortwerk**\nDeutsch A1 am Abend\nMontag bis Donnerstag, 18–20 Uhr" },
            { id: "l-ad6b", kind: "ad", label: "6 b", body: "**VHS Nord**\nDeutsch A1 am Wochenende\nsamstags 9–13 Uhr, 10 Termine" },
            { id: "l-ad7a", kind: "ad", label: "7 a", body: "**Hotel Seeblick**\nPraktikum im Sommer!\nRezeption oder Küche, Juli und August.\nBewerbung an info@hotel-seeblick.de" },
            { id: "l-ad7b", kind: "ad", label: "7 b", body: "**Hotel am Markt**\nWir suchen einen Koch oder eine Köchin.\nVollzeit, ab sofort." },
            { id: "l-ad8a", kind: "ad", label: "8 a", body: "**Büromarkt Schmidt**\nNeue Drucker ab 89 Euro!\nLieferung in fünf Tagen." },
            { id: "l-ad8b", kind: "ad", label: "8 b", body: "**PC-Hilfe Kowalski**\nWir reparieren Computer und Drucker.\nSchnell: noch am gleichen Tag!\nTel. 0621 448 072" },
            { id: "l-ad9a", kind: "ad", label: "9 a", body: "**Nachhilfe**\nStudentin hilft in Mathe und Physik.\nKlasse 5 bis 10, 15 Euro pro Stunde.\nTel. 0151 902 336" },
            { id: "l-ad9b", kind: "ad", label: "9 b", body: "**Musikschule Klangfarbe**\nKlavier und Gitarre für Kinder.\nDie erste Stunde ist gratis." },
            { id: "l-ad10a", kind: "ad", label: "10 a", body: "**Bäckerei Hansen**\nWir suchen eine Verkäuferin.\nArbeitszeit: 14–19 Uhr" },
            { id: "l-ad10b", kind: "ad", label: "10 b", body: "**Arztpraxis Dr. Vogel**\nWir suchen Hilfe am Empfang.\nArbeitszeit: Mo–Fr 8–12 Uhr" },
          ],
          items: [
            { id: "l6", number: 6, type: "ab", stimulusIds: ["l-ad6a", "l-ad6b"], prompt: "Sie möchten am Samstag Deutsch lernen.", options: AB },
            { id: "l7", number: 7, type: "ab", stimulusIds: ["l-ad7a", "l-ad7b"], prompt: "Sie möchten in den Sommerferien ein Praktikum in einem Hotel machen.", options: AB },
            { id: "l8", number: 8, type: "ab", stimulusIds: ["l-ad8a", "l-ad8b"], prompt: "Der Drucker im Büro ist kaputt. Sie brauchen heute noch Hilfe.", options: AB },
            { id: "l9", number: 9, type: "ab", stimulusIds: ["l-ad9a", "l-ad9b"], prompt: "Ihre Tochter ist in Klasse 7. Sie braucht Hilfe in Mathematik.", options: AB },
            { id: "l10", number: 10, type: "ab", stimulusIds: ["l-ad10a", "l-ad10b"], prompt: "Sie suchen eine Arbeit am Vormittag.", options: AB },
          ],
        },
        {
          partId: "lesen-3",
          instructionsDe: "Lesen Sie die Texte und die Aufgaben 11–15. Kreuzen Sie an: Richtig oder Falsch. Lesen Sie zuerst das Beispiel.",
          example: { prompt: "Am Kindergarten: Die Kinder sollen bis 9 Uhr da sein.", stimulusIds: ["l-s0"], options: RF, answer: "r" },
          stimuli: [
            { id: "l-s0", kind: "notice", label: "Beispiel", title: "An der Tür eines Kindergartens", body: "**Kita Sonnenschein**\nLiebe Eltern,\nbitte bringen Sie Ihr Kind bis 9 Uhr." },
            { id: "l-s11", kind: "notice", label: "11", title: "An der Schultür", body: "**Elternabend Klasse 4b**\nDienstag, 18 Uhr\nim Musikraum, 1. Stock" },
            { id: "l-s12", kind: "notice", label: "12", title: "An der Post", body: "**Post – Filiale Ringstraße**\nBis 15. Mai geschlossen.\nPakete bitte im Kiosk am Bahnhof abgeben." },
            { id: "l-s13", kind: "notice", label: "13", title: "Am Bahnhof", body: "**Reisezentrum**\nMo–Fr 6–20 Uhr\nSa und So 8–14 Uhr\nFahrkarten gibt es auch am Automaten." },
            { id: "l-s14", kind: "notice", label: "14", title: "Am Restaurant", body: "**Restaurant Lindenhof**\nMittagessen für Berufstätige\nMo–Fr 11:30–14 Uhr\nMenü mit Getränk: 9,50 €" },
            { id: "l-s15", kind: "notice", label: "15", title: "An der Bushaltestelle", body: "**Haltestelle Gewerbepark**\nLinie 14\nIn den Schulferien fährt der Bus nur einmal pro Stunde." },
          ],
          items: [
            { id: "l11", number: 11, type: "true_false", stimulusIds: ["l-s11"], prompt: "In der Schule: Der Elternabend ist am Abend.", options: RF },
            { id: "l12", number: 12, type: "true_false", stimulusIds: ["l-s12"], prompt: "An der Post: Bis zum 15. Mai kann man hier Pakete abgeben.", options: RF },
            { id: "l13", number: 13, type: "true_false", stimulusIds: ["l-s13"], prompt: "Am Bahnhof: Am Sonntag um 16 Uhr ist das Reisezentrum offen.", options: RF },
            { id: "l14", number: 14, type: "true_false", stimulusIds: ["l-s14"], prompt: "Im Restaurant: Das Mittagessen mit Getränk kostet 9,50 €.", options: RF },
            { id: "l15", number: 15, type: "true_false", stimulusIds: ["l-s15"], prompt: "An der Bushaltestelle: In den Ferien fährt kein Bus.", options: RF },
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
            "Ihr Kollege Tomasz Wisniewski möchte an der Volkshochschule einen Abendkurs machen. Lesen Sie den Text. Im Formular fehlen fünf Informationen. Schreiben Sie die fünf fehlenden Informationen in das Formular.",
          stimuli: [
            {
              id: "s-t1",
              kind: "text",
              title: "Tomasz",
              body:
                "Tomasz Wisniewski ist 34 Jahre alt. Er kommt aus Polen. Er wohnt in der Bergstraße 7, 69115 Heidelberg. Er arbeitet als Elektriker. Seine Handynummer ist 0162 774 391. Tomasz möchte am Abend einen Computerkurs machen. Er hat nur am Dienstag Zeit. Er bezahlt den Kurs mit Überweisung.",
            },
            {
              id: "s-form",
              kind: "form",
              title: "Volkshochschule Heidelberg – Anmeldung Abendkurs",
              body:
                "| Feld | Eintrag |\n| --- | --- |\n| Name, Vorname | Wisniewski, Tomasz |\n| Alter | 34 |\n| Herkunftsland | (1) |\n| Straße, Hausnummer | Bergstraße 7 |\n| PLZ, Wohnort | 69115 Heidelberg |\n| Telefon | (2) |\n| Beruf | (3) |\n| Kurs | (4) |\n| Kurstag | (5) |\n| Zahlung | Überweisung |",
            },
          ],
          items: [
            { id: "s1", number: 1, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Herkunftsland", prompt: "(1) Herkunftsland" },
            { id: "s2", number: 2, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Telefon", prompt: "(2) Telefon" },
            { id: "s3", number: 3, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Beruf", prompt: "(3) Beruf" },
            { id: "s4", number: 4, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Kurs", prompt: "(4) Kurs" },
            { id: "s5", number: 5, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Kurstag", prompt: "(5) Kurstag" },
          ],
        },
        {
          partId: "schreiben-2",
          instructionsDe:
            "Sie beginnen nächsten Monat ein Praktikum bei der Firma Holzmann. Sie haben noch Fragen. Schreiben Sie eine E-Mail an Frau Ritter im Personalbüro.",
          stimuli: [],
          items: [
            {
              id: "s6",
              number: 6,
              type: "writing",
              prompt: "E-Mail an Frau Ritter, Firma Holzmann",
              writing: {
                taskDe:
                  "Schreiben Sie zu jedem Punkt ein bis zwei Sätze auf den Antwortbogen (circa 30 Wörter). Schreiben Sie auch eine Anrede und einen Gruß.",
                leitpunkte: [
                  "Wann beginnt die Arbeit am ersten Tag?",
                  "Was müssen Sie mitbringen?",
                  "Gibt es eine Kantine?",
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
                  "Stellen Sie sich mit den Stichwörtern vor. Buchstabieren Sie danach ein Wort und nennen Sie eine Zahl. Die Prüferin fragt.",
                cards: [{ title: "Stichwörter", body: "Name? Alter? Land? Wohnort? Sprachen? Beruf? Hobby?" }],
                partnerTurns: [
                  "Hallo, schön, dass Sie da sind. Erzählen Sie bitte etwas über sich.",
                  "Vielen Dank. Wie heißt Ihre Stadt? Buchstabieren Sie bitte den Namen.",
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
            "Sie bekommen zwei Karten mit einem Thema und einem Wort. Stellen Sie eine Frage zu Ihrer Karte. Ihre Partnerin / Ihr Partner antwortet. Runde 1: Thema „Arbeit“. Runde 2: Thema „Schule“.",
          stimuli: [
            { id: "p-c2a", kind: "card", label: "Thema 1", title: "Thema: Arbeit", body: "**Kollegen** · **Pause** · **Arbeitszeit** · **Büro** · **Urlaub** · **Chef**" },
            { id: "p-c2b", kind: "card", label: "Thema 2", title: "Thema: Schule", body: "**Lehrer** · **Hausaufgaben** · **Lieblingsfach** · **Ferien** · **Prüfung** · **Schulweg**" },
          ],
          items: [
            {
              id: "p2",
              number: 2,
              type: "speaking",
              stimulusIds: ["p-c2a", "p-c2b"],
              prompt: "Um Informationen bitten und Informationen geben",
              speaking: {
                taskDe:
                  "Sie ziehen in jeder Runde eine Karte. Stellen Sie zu Ihrer Karte eine Frage. Antworten Sie auch auf die Frage Ihrer Partnerin / Ihres Partners.",
                cards: [
                  { title: "Thema: Arbeit", body: "Kollegen" },
                  { title: "Thema: Arbeit", body: "Pause" },
                  { title: "Thema: Arbeit", body: "Arbeitszeit" },
                  { title: "Thema: Arbeit", body: "Büro" },
                  { title: "Thema: Arbeit", body: "Urlaub" },
                  { title: "Thema: Arbeit", body: "Chef" },
                  { title: "Thema: Schule", body: "Lehrer" },
                  { title: "Thema: Schule", body: "Hausaufgaben" },
                  { title: "Thema: Schule", body: "Lieblingsfach" },
                  { title: "Thema: Schule", body: "Ferien" },
                  { title: "Thema: Schule", body: "Prüfung" },
                  { title: "Thema: Schule", body: "Schulweg" },
                ],
                partnerTurns: [
                  "Runde 1, Thema Arbeit. Ihre Karte: Pause. Bitte fragen Sie.",
                  "(Partner antwortet) Meine Pause ist um zwölf Uhr. Ich esse dann in der Kantine. – Meine Karte ist Kollegen: Wie viele Kollegen hast du?",
                  "Danke. Runde 2, Thema Schule. Ihre Karte: Lieblingsfach.",
                  "(Partner antwortet) Mein Lieblingsfach war Biologie. – Meine Karte ist Schulweg: Wie bist du zur Schule gefahren?",
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
            { id: "p-c3a", kind: "card", label: "Karte 1", title: "Handlungskarte", body: "Bild: ein Kugelschreiber", imageAlt: "Ein blauer Kugelschreiber" },
            { id: "p-c3b", kind: "card", label: "Karte 2", title: "Handlungskarte", body: "Bild: ein Kalender", imageAlt: "Ein Wandkalender mit einem markierten Termin" },
          ],
          items: [
            {
              id: "p3",
              number: 3,
              type: "speaking",
              stimulusIds: ["p-c3a", "p-c3b"],
              prompt: "Bitten formulieren und darauf reagieren",
              speaking: {
                taskDe:
                  "Formulieren Sie zu jeder Karte eine Bitte. Reagieren Sie auch auf zwei Bitten Ihrer Partnerin / Ihres Partners.",
                cards: [
                  { title: "Handlungskarte 1", body: "Bild: ein Kugelschreiber" },
                  { title: "Handlungskarte 2", body: "Bild: ein Kalender" },
                ],
                partnerTurns: [
                  "Bitte formulieren Sie eine Bitte zu Karte 1.",
                  "(Partnerin reagiert) Ja, klar, hier ist er. – Meine Karte: ein Drucker. Kannst du bitte den Brief für mich drucken?",
                  "Danke. Jetzt bitte Karte 2.",
                  "(Partnerin reagiert) Gern. Wir haben am Mittwoch Zeit. – Meine Karte: eine Tasse Kaffee. Bringst du mir bitte einen Kaffee mit?",
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
      id: "sc-h0", title: "Beispiel – Am Empfang einer Firma", scenario: "workplace",
      environment: { preset: "workplace", ambienceLevel: 0.1, ambiencePrompt: "office lobby, quiet keyboard typing, distant phone" },
      speakers: [{ id: "b", name: "Besucher", role: "Besucher", gender: "male" }, { id: "e", name: "Empfang", role: "Empfangsdame", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "b", text: "Guten Morgen. Ich habe einen Termin bei Frau Lindqvist." },
        { id: "t2", speakerId: "e", text: "Guten Morgen. Frau Lindqvist ist im fünften Stock, Zimmer neun." },
        { id: "t3", speakerId: "b", text: "Im fünften Stock. Gibt es hier einen Aufzug?" },
        { id: "t4", speakerId: "e", text: "Ja, da links. Bitte schön." },
      ],
    },
    {
      id: "sc-h1", title: "Im Büro", scenario: "workplace",
      environment: { preset: "workplace", ambienceLevel: 0.1, ambiencePrompt: "small open office, soft keyboard typing" },
      speakers: [{ id: "m", name: "Markus", role: "Kollege", gender: "male" }, { id: "s", name: "Sandra", role: "Kollegin", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "m", text: "Sandra, ist die Besprechung am Montag?" },
        { id: "t2", speakerId: "s", text: "Nein, nicht am Montag. Sie ist am Dienstag." },
        { id: "t3", speakerId: "m", text: "Am Dienstag um neun Uhr?" },
        { id: "t4", speakerId: "s", text: "Nein, um elf Uhr. Um neun hat der Chef einen Termin." },
        { id: "t5", speakerId: "m", text: "Gut, also Dienstag um elf. Danke!" },
      ],
    },
    {
      id: "sc-h2", title: "Im Kindergarten", scenario: "education",
      environment: { preset: "education", ambienceLevel: 0.15, ambiencePrompt: "kindergarten hallway, children playing in the distance" },
      speakers: [{ id: "e", name: "Erzieherin", role: "Erzieherin", gender: "female" }, { id: "d", name: "Herr Demir", role: "Vater", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "e", text: "Herr Demir, heute schließen wir schon um vier Uhr." },
        { id: "t2", speakerId: "d", text: "Oh! Normalerweise hole ich Mia um fünf ab." },
        { id: "t3", speakerId: "e", text: "Ja, ich weiß. Aber heute geht das leider nicht." },
        { id: "t4", speakerId: "d", text: "Kein Problem. Dann komme ich heute um halb vier." },
        { id: "t5", speakerId: "e", text: "Super, danke!" },
      ],
    },
    {
      id: "sc-h3", title: "Im Deutschkurs", scenario: "education",
      environment: { preset: "education", ambienceLevel: 0.08, reverb: 0.15, ambiencePrompt: "classroom, chairs moving, quiet" },
      speakers: [{ id: "l", name: "Frau Brandt", role: "Lehrerin", gender: "female" }, { id: "t", name: "Teilnehmer", role: "Kursteilnehmer", gender: "male", age: "young" }],
      turns: [
        { id: "t1", speakerId: "l", text: "So, das ist alles für heute. Die Hausaufgaben für Donnerstag sind an der Tafel." },
        { id: "t2", speakerId: "t", text: "Sollen wir Seite vierundzwanzig lesen?" },
        { id: "t3", speakerId: "l", text: "Nein, die Seite lesen wir zusammen im Kurs. Bitte schreiben Sie einen kurzen Text über Ihre Familie." },
        { id: "t4", speakerId: "t", text: "Einen Text. Okay. Bis Donnerstag!" },
      ],
    },
    {
      id: "sc-h4", title: "Das Praktikum", scenario: "street",
      environment: { preset: "street", ambienceLevel: 0.12, ambiencePrompt: "quiet street, a few passing bicycles" },
      speakers: [{ id: "n", name: "Nina", role: "Freundin", gender: "female", age: "young" }, { id: "j", name: "Jonas", role: "Freund", gender: "male", age: "young" }],
      turns: [
        { id: "t1", speakerId: "n", text: "Jonas, wann beginnt dein Praktikum?" },
        { id: "t2", speakerId: "j", text: "Im Mai. Ich arbeite in einem Reisebüro." },
        { id: "t3", speakerId: "n", text: "Toll! Und wie lange? Zwei Wochen?" },
        { id: "t4", speakerId: "j", text: "Zuerst wollte ich zwei Wochen machen. Aber jetzt mache ich drei Monate." },
        { id: "t5", speakerId: "n", text: "Drei Monate? Super!" },
      ],
    },
    {
      id: "sc-h5", title: "Zu Hause am Abend", scenario: "family",
      environment: { preset: "family", ambienceLevel: 0.08, ambiencePrompt: "quiet kitchen in the evening" },
      speakers: [{ id: "m", name: "Mutter", role: "Mutter", gender: "female" }, { id: "l", name: "Lukas", role: "Sohn", gender: "male", age: "child" }],
      turns: [
        { id: "t1", speakerId: "m", text: "Lukas, hast du morgen Sport? Brauchst du deine Turnschuhe?" },
        { id: "t2", speakerId: "l", text: "Nein, Sport haben wir am Freitag. Morgen haben wir Mathe. Ich brauche ein Lineal." },
        { id: "t3", speakerId: "m", text: "Und deine Farben für Kunst?" },
        { id: "t4", speakerId: "l", text: "Die sind schon in der Schule." },
      ],
    },
    {
      id: "sc-h6", title: "Mittagspause", scenario: "workplace",
      environment: { preset: "workplace", ambienceLevel: 0.1 },
      speakers: [{ id: "a", name: "Anja", role: "Kollegin", gender: "female" }, { id: "b", name: "Birgit", role: "Kollegin", gender: "female", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "a", text: "Birgit, gehen wir heute zum Italiener?" },
        { id: "t2", speakerId: "b", text: "Heute nicht. Ich habe nur eine halbe Stunde Pause. Gehen wir in die Kantine?" },
        { id: "t3", speakerId: "a", text: "Okay. Im Büro essen finde ich nicht so schön." },
        { id: "t4", speakerId: "b", text: "Ich auch nicht. Also Kantine, um zwölf Uhr." },
      ],
    },
    {
      id: "sc-h7b", title: "Beispiel – Durchsage in der Schule", scenario: "education",
      environment: { preset: "education", ambienceLevel: 0.12, publicAddress: true, reverb: 0.3, ambiencePrompt: "school corridor, students talking" },
      speakers: [{ id: "d", name: "Durchsage", role: "Schulsekretariat", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Schülerinnen und Schüler! Heute fällt die sechste Stunde aus. Der Unterricht endet heute schon um zwölf Uhr fünfzehn." },
      ],
    },
    {
      id: "sc-h7", title: "Durchsage in der Volkshochschule", scenario: "education",
      environment: { preset: "education", ambienceLevel: 0.1, publicAddress: true, reverb: 0.3 },
      speakers: [{ id: "d", name: "Durchsage", role: "VHS-Büro", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Eine Information für den Englischkurs: Ihr Kurs ist heute nicht in Raum sieben. Er ist heute in Raum fünfzehn, im ersten Stock. Danke." },
      ],
    },
    {
      id: "sc-h8", title: "Durchsage im Bürogebäude", scenario: "workplace",
      environment: { preset: "workplace", ambienceLevel: 0.1, publicAddress: true, reverb: 0.25 },
      speakers: [{ id: "d", name: "Durchsage", role: "Hausmeister", gender: "male", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Mitarbeiterinnen und Mitarbeiter! Morgen von acht bis zehn Uhr arbeitet ein Techniker am Aufzug. Bitte nehmen Sie dann die Treppe. Vielen Dank." },
      ],
    },
    {
      id: "sc-h9", title: "Durchsage am Bahnhof", scenario: "railway_station",
      environment: { preset: "railway_station", ambienceLevel: 0.2, publicAddress: true, reverb: 0.35, ambiencePrompt: "busy morning platform, commuters" },
      speakers: [{ id: "d", name: "Durchsage", role: "Bahnhofsansage", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Achtung, bitte! Der Regionalzug nach Freiburg, Abfahrt sieben Uhr zweiundvierzig, fährt heute nicht von Gleis zwei. Er fährt heute von Gleis fünf.", pace: 0.95 },
      ],
    },
    {
      id: "sc-h10", title: "Durchsage in der Stadtbibliothek", scenario: "public_office",
      environment: { preset: "public_office", ambienceLevel: 0.08, publicAddress: true, reverb: 0.3 },
      speakers: [{ id: "d", name: "Durchsage", role: "Bibliothek", gender: "female", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Besucherinnen und Besucher! Die Bibliothek schließt heute schon um sechzehn Uhr. Morgen sind wir wieder ab neun Uhr für Sie da." },
      ],
    },
    {
      id: "sc-h11", title: "Nachricht von Herrn Brenner", scenario: "workplace",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "b", name: "Herr Brenner", role: "Kollege", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "b", text: "Hallo Frau Nowak, hier ist Brenner. Unser Termin mit der Firma Kessler ist nicht am Donnerstag. Er ist am Freitag um zehn Uhr. Bitte bringen Sie die Präsentation mit. Danke!" },
      ],
    },
    {
      id: "sc-h12", title: "Nachricht vom Kindergarten", scenario: "education",
      environment: { preset: "telephone", ambienceLevel: 0.05, telephoneFilter: true },
      speakers: [{ id: "k", name: "Kindergarten Sonnenblume", role: "Erzieherin", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "k", text: "Guten Tag, Frau Haddad, hier ist der Kindergarten Sonnenblume. Karim hat ein bisschen Fieber. Er schläft jetzt. Sie holen ihn normalerweise um vier Uhr ab. Bitte kommen Sie heute schon um eins. Danke!" },
      ],
    },
    {
      id: "sc-h13", title: "Nachricht von der Sprachschule", scenario: "education",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "s", name: "Sprachschule Lingo", role: "Sekretariat", gender: "female", age: "young" }],
      turns: [
        { id: "t1", speakerId: "s", text: "Guten Tag, Herr Moreno, hier ist die Sprachschule Lingo. Ihr Deutschkurs beginnt am dritten März. Das Kursbuch bekommen Sie bei uns. Den Kurs haben Sie schon bezahlt. Bitte bringen Sie am ersten Tag ein Passfoto mit. Auf Wiederhören!" },
      ],
    },
    {
      id: "sc-h14", title: "Nachricht von Timo", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.05, telephoneFilter: true },
      speakers: [{ id: "t", name: "Timo", role: "Freund", gender: "male", age: "young" }],
      turns: [
        { id: "t1", speakerId: "t", text: "Hi Paula, hier ist Timo. Morgen habe ich ein Vorstellungsgespräch. Ich bin so nervös! Kannst du heute Abend zu mir kommen? Wir können das Gespräch zusammen üben. Ich koche auch Spaghetti. Ruf mich bitte an!" },
      ],
    },
    {
      id: "sc-h15", title: "Nachricht vom Personalbüro", scenario: "workplace",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "g", name: "Frau Graf", role: "Personalbüro", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "g", text: "Guten Tag, Herr Lindner, hier ist Graf vom Personalbüro. Ihr erster Arbeitstag ist am Montag. Sie beginnen um halb acht. Mein Büro ist im dritten Stock. Aber bitte gehen Sie zuerst zum Empfang im Erdgeschoss. Dort bekommen Sie Ihre Karte für die Tür. Bis Montag!" },
      ],
    },
  ],

  /* ==================================================================================== */
  /* ANSWER KEY                                                                           */
  /* ==================================================================================== */
  answerKey: {
    h1: { correct: ["b"], explanation: "Die Besprechung ist nicht am Montag, sondern am Dienstag. Um neun hat der Chef einen Termin, also um elf.", evidence: "Nein, um elf Uhr." },
    h2: { correct: ["a"], explanation: "Normalerweise kommt er um fünf. Heute schließt der Kindergarten um vier. Er kommt um halb vier.", evidence: "Dann komme ich heute um halb vier." },
    h3: { correct: ["b"], explanation: "Seite 24 lesen sie zusammen im Kurs. Die Hausaufgabe ist ein Text über die Familie.", evidence: "Bitte schreiben Sie einen kurzen Text über Ihre Familie." },
    h4: { correct: ["c"], explanation: "Zuerst wollte Jonas zwei Wochen machen. Jetzt macht er drei Monate.", evidence: "Aber jetzt mache ich drei Monate." },
    h5: { correct: ["c"], explanation: "Sport ist erst am Freitag, die Farben sind schon in der Schule. Für Mathe braucht er ein Lineal.", evidence: "Ich brauche ein Lineal." },
    h6: { correct: ["a"], explanation: "Birgit hat nur eine halbe Stunde Pause. Sie gehen nicht zum Italiener und essen nicht im Büro, sondern in der Kantine.", evidence: "Also Kantine, um zwölf Uhr." },
    h7: { correct: ["f"], explanation: "Der Kurs ist heute nicht in Raum 7, sondern in Raum 15.", evidence: "Er ist heute in Raum fünfzehn" },
    h8: { correct: ["r"], explanation: "Morgen von 8 bis 10 Uhr arbeitet ein Techniker am Aufzug. Man soll die Treppe nehmen.", evidence: "Bitte nehmen Sie dann die Treppe." },
    h9: { correct: ["f"], explanation: "Der Zug fährt heute nicht von Gleis 2, sondern von Gleis 5.", evidence: "Er fährt heute von Gleis fünf." },
    h10: { correct: ["r"], explanation: "Heute schließt die Bibliothek um 16 Uhr. Morgen öffnet sie um 9 Uhr.", evidence: "Morgen sind wir wieder ab neun Uhr für Sie da." },
    h11: { correct: ["c"], explanation: "Der Termin ist nicht am Donnerstag, sondern am Freitag um zehn Uhr.", evidence: "Er ist am Freitag um zehn Uhr." },
    h12: { correct: ["a"], explanation: "Normalerweise holt sie Karim um vier ab. Heute soll sie schon um eins kommen, also um 13 Uhr.", evidence: "Bitte kommen Sie heute schon um eins." },
    h13: { correct: ["b"], explanation: "Das Buch bekommt er in der Schule, bezahlt hat er schon. Er soll ein Passfoto mitbringen.", evidence: "Bitte bringen Sie am ersten Tag ein Passfoto mit." },
    h14: { correct: ["c"], explanation: "Timo hat morgen ein Vorstellungsgespräch und möchte mit Paula üben. Er kocht zu Hause.", evidence: "Wir können das Gespräch zusammen üben." },
    h15: { correct: ["b"], explanation: "Das Personalbüro ist im dritten Stock, aber zuerst soll er zum Empfang gehen.", evidence: "Aber bitte gehen Sie zuerst zum Empfang im Erdgeschoss." },
    l1: { correct: ["f"], explanation: "Die Feier beginnt um 12 Uhr, also mittags.", evidence: "Sie beginnt um 12 Uhr im Kursraum." },
    l2: { correct: ["r"], explanation: "Yusuf bittet alle, etwas zu essen mitzubringen.", evidence: "Bitte bringt etwas zu essen mit." },
    l3: { correct: ["f"], explanation: "Die Getränke kauft die Lehrerin, Frau Brandt.", evidence: "Die Getränke kauft Frau Brandt, unsere Lehrerin." },
    l4: { correct: ["f"], explanation: "Elif soll Herrn Becker anrufen, nicht schreiben.", evidence: "Kannst du bitte um 15 Uhr Herrn Becker anrufen?" },
    l5: { correct: ["r"], explanation: "Jan ist ab 14 Uhr beim Zahnarzt.", evidence: "ich bin heute ab 14 Uhr beim Zahnarzt" },
    l6: { correct: ["b"], explanation: "Der VHS-Kurs ist samstags. Die Sprachschule hat nur Kurse von Montag bis Donnerstag.", evidence: "samstags 9–13 Uhr" },
    l7: { correct: ["a"], explanation: "Das Hotel Seeblick bietet ein Praktikum im Sommer. Das Hotel am Markt sucht einen Koch in Vollzeit.", evidence: "Praktikum im Sommer!" },
    l8: { correct: ["b"], explanation: "PC-Hilfe Kowalski repariert Drucker noch am gleichen Tag. Der Büromarkt verkauft neue Drucker mit Lieferung in fünf Tagen.", evidence: "noch am gleichen Tag!" },
    l9: { correct: ["a"], explanation: "Die Studentin hilft in Mathe für Klasse 5 bis 10. Die Musikschule bietet nur Klavier und Gitarre.", evidence: "Studentin hilft in Mathe und Physik." },
    l10: { correct: ["b"], explanation: "Die Arbeit in der Arztpraxis ist von 8 bis 12 Uhr. Die Bäckerei sucht jemanden für den Nachmittag.", evidence: "Arbeitszeit: Mo–Fr 8–12 Uhr" },
    l11: { correct: ["r"], explanation: "Der Elternabend beginnt um 18 Uhr.", evidence: "Dienstag, 18 Uhr" },
    l12: { correct: ["f"], explanation: "Die Filiale ist bis 15. Mai geschlossen. Pakete gibt man im Kiosk am Bahnhof ab.", evidence: "Bis 15. Mai geschlossen." },
    l13: { correct: ["f"], explanation: "Am Sonntag ist das Reisezentrum nur von 8 bis 14 Uhr offen.", evidence: "Sa und So 8–14 Uhr" },
    l14: { correct: ["r"], explanation: "Das Menü mit Getränk kostet 9,50 €.", evidence: "Menü mit Getränk: 9,50 €" },
    l15: { correct: ["f"], explanation: "In den Ferien fährt der Bus, aber nur einmal pro Stunde.", evidence: "fährt der Bus nur einmal pro Stunde" },
    s1: { correct: ["Polen"], explanation: "Tomasz kommt aus Polen." },
    s2: { correct: ["0162 774 391", "0162774391", "0162 774391", "0162/774391", "0162-774391"], explanation: "Seine Handynummer ist 0162 774 391." },
    s3: { correct: ["Elektriker", "Er ist Elektriker", "Elektriker von Beruf"], explanation: "Tomasz arbeitet als Elektriker." },
    s4: { correct: ["Computerkurs", "Computer", "Computerkurs am Abend", "Computer-Kurs", "PC-Kurs"], explanation: "Tomasz möchte einen Computerkurs machen." },
    s5: { correct: ["Dienstag", "dienstags", "am Dienstag", "Dienstagabend", "Di"], explanation: "Tomasz hat nur am Dienstag Zeit." },
    s6: { correct: [], explanation: "Bewertet werden die drei Inhaltspunkte (je 0 / 1,5 / 3 Punkte) und die Textsorte mit Anrede und Gruß (0 / 0,5 / 1 Punkt)." },
    p1: { correct: [] },
    p2: { correct: [] },
    p3: { correct: [] },
  },
};
