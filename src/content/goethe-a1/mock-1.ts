import type { ExamContentInput } from "@/domain/exam/schema";

/**
 * Goethe A1 — Übungstest 1 (original content).
 *
 * Everyday themes: shopping, public transport, appointments, invitations, housing.
 * All texts, scripts and tasks are original and written for this platform; they follow
 * the published task formats only.
 */

const RF = [
  { id: "r", label: "Richtig", text: "Richtig" },
  { id: "f", label: "Falsch", text: "Falsch" },
];

export const goetheA1Mock1: ExamContentInput = {
  schemaVersion: 1,
  blueprintKey: "goethe-a1-sd1",
  blueprintVersion: "2026.10.1",
  title: "Goethe A1 — Übungstest 1",
  themes: ["Einkaufen", "Verkehr", "Termine", "Einladungen", "Wohnen"],
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
            "Sie hören sechs kurze Gespräche. Sie hören jeden Text zweimal. Kreuzen Sie an: a, b oder c. Lesen Sie zuerst das Beispiel.",
          example: {
            prompt: "Welche Zimmernummer hat Frau Weber?",
            stimulusIds: ["h-a0"],
            options: [
              { id: "a", label: "a", text: "12" },
              { id: "b", label: "b", text: "21" },
              { id: "c", label: "c", text: "22" },
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
            { id: "h1", number: 1, type: "mc", stimulusIds: ["h-a1"], prompt: "Wo findet die Frau die Eier?", options: [{ id: "a", label: "a", text: "Neben dem Brot" }, { id: "b", label: "b", text: "Bei der Milch" }, { id: "c", label: "c", text: "An der Kasse" }] },
            { id: "h2", number: 2, type: "mc", stimulusIds: ["h-a2"], prompt: "Wann fährt der Zug nach Hamburg?", options: [{ id: "a", label: "a", text: "Um 10:15 Uhr" }, { id: "b", label: "b", text: "Um 10:50 Uhr" }, { id: "c", label: "c", text: "Um 11:05 Uhr" }] },
            { id: "h3", number: 3, type: "mc", stimulusIds: ["h-a3"], prompt: "Wann hat Herr Novak einen Termin?", options: [{ id: "a", label: "a", text: "Am Montag" }, { id: "b", label: "b", text: "Am Mittwoch" }, { id: "c", label: "c", text: "Am Donnerstag" }] },
            { id: "h4", number: 4, type: "mc", stimulusIds: ["h-a4"], prompt: "Was trinkt der Mann?", options: [{ id: "a", label: "a", text: "Kaffee" }, { id: "b", label: "b", text: "Tee" }, { id: "c", label: "c", text: "Wasser" }] },
            { id: "h5", number: 5, type: "mc", stimulusIds: ["h-a5"], prompt: "Wie viele Zimmer hat Leas neue Wohnung?", options: [{ id: "a", label: "a", text: "Zwei Zimmer" }, { id: "b", label: "b", text: "Drei Zimmer" }, { id: "c", label: "c", text: "Vier Zimmer" }] },
            { id: "h6", number: 6, type: "mc", stimulusIds: ["h-a6"], prompt: "Wie viel kostet die Jacke heute?", options: [{ id: "a", label: "a", text: "29 Euro" }, { id: "b", label: "b", text: "39 Euro" }, { id: "c", label: "c", text: "49 Euro" }] },
          ],
        },
        {
          partId: "hoeren-2",
          instructionsDe: "Sie hören vier Durchsagen. Sie hören jeden Text einmal. Kreuzen Sie an: Richtig oder Falsch.",
          stimuli: [
            { id: "h-a7", kind: "audio", title: "Durchsage 7", scriptId: "sc-h7", body: "" },
            { id: "h-a8", kind: "audio", title: "Durchsage 8", scriptId: "sc-h8", body: "" },
            { id: "h-a9", kind: "audio", title: "Durchsage 9", scriptId: "sc-h9", body: "" },
            { id: "h-a10", kind: "audio", title: "Durchsage 10", scriptId: "sc-h10", body: "" },
          ],
          items: [
            { id: "h7", number: 7, type: "true_false", stimulusIds: ["h-a7"], prompt: "Der Zug nach Leipzig fährt pünktlich ab.", options: RF },
            { id: "h8", number: 8, type: "true_false", stimulusIds: ["h-a8"], prompt: "Die T-Shirts kosten heute fünf Euro.", options: RF },
            { id: "h9", number: 9, type: "true_false", stimulusIds: ["h-a9"], prompt: "Die Fluggäste nach Wien sollen zum Ausgang B 21 gehen.", options: RF },
            { id: "h10", number: 10, type: "true_false", stimulusIds: ["h-a10"], prompt: "Der Supermarkt schließt bald.", options: RF },
          ],
        },
        {
          partId: "hoeren-3",
          instructionsDe: "Sie hören fünf Ansagen am Telefon. Sie hören jeden Text zweimal. Kreuzen Sie an: a, b oder c.",
          stimuli: [
            { id: "h-a11", kind: "audio", title: "Ansage 11", scriptId: "sc-h11", body: "" },
            { id: "h-a12", kind: "audio", title: "Ansage 12", scriptId: "sc-h12", body: "" },
            { id: "h-a13", kind: "audio", title: "Ansage 13", scriptId: "sc-h13", body: "" },
            { id: "h-a14", kind: "audio", title: "Ansage 14", scriptId: "sc-h14", body: "" },
            { id: "h-a15", kind: "audio", title: "Ansage 15", scriptId: "sc-h15", body: "" },
          ],
          items: [
            { id: "h11", number: 11, type: "mc", stimulusIds: ["h-a11"], prompt: "Wann treffen sich Sara und Tim?", options: [{ id: "a", label: "a", text: "Um 19:00 Uhr" }, { id: "b", label: "b", text: "Um 19:30 Uhr" }, { id: "c", label: "c", text: "Um 20:30 Uhr" }] },
            { id: "h12", number: 12, type: "mc", stimulusIds: ["h-a12"], prompt: "Was soll Frau Kaya machen?", options: [{ id: "a", label: "a", text: "Morgen um zehn Uhr kommen" }, { id: "b", label: "b", text: "Die Praxis anrufen" }, { id: "c", label: "c", text: "Eine E-Mail schreiben" }] },
            { id: "h13", number: 13, type: "mc", stimulusIds: ["h-a13"], prompt: "Was repariert der Techniker?", options: [{ id: "a", label: "a", text: "Die Heizung" }, { id: "b", label: "b", text: "Das Fenster" }, { id: "c", label: "c", text: "Die Dusche" }] },
            { id: "h14", number: 14, type: "mc", stimulusIds: ["h-a14"], prompt: "Bis wann kann man das Fahrrad am Samstag abholen?", options: [{ id: "a", label: "a", text: "Bis 14 Uhr" }, { id: "b", label: "b", text: "Bis 16 Uhr" }, { id: "c", label: "c", text: "Bis 18 Uhr" }] },
            { id: "h15", number: 15, type: "mc", stimulusIds: ["h-a15"], prompt: "Was soll Maria mitbringen?", options: [{ id: "a", label: "a", text: "Getränke" }, { id: "b", label: "b", text: "Kuchen" }, { id: "c", label: "c", text: "Salat" }] },
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
          instructionsDe: "Lesen Sie die zwei Texte und die Aufgaben 1 bis 5. Kreuzen Sie an: Richtig oder Falsch.",
          example: { prompt: "Anna wohnt jetzt in der Lindenstraße.", stimulusIds: ["l-t1"], options: RF, answer: "r" },
          stimuli: [
            {
              id: "l-t1",
              kind: "email",
              title: "Text 1",
              body:
                "**Von:** anna.berg@mailpost.de\n**An:** julia.k@mailpost.de\n**Betreff:** Party am Samstag\n\nLiebe Julia,\n\nam Samstag habe ich Geburtstag und ich mache eine kleine Party. Die Party beginnt um 19 Uhr bei mir zu Hause. Meine neue Adresse ist Lindenstraße 14, zweiter Stock.\n\nKommst du? Du musst nichts mitbringen, ich koche für alle. Bitte schreib mir bis Donnerstag.\n\nViele Grüße\nAnna",
            },
            {
              id: "l-t2",
              kind: "note",
              title: "Text 2",
              body:
                "Hallo Marco,\n\nich bin beim Arzt und komme erst um 15 Uhr nach Hause. Kannst du bitte im Supermarkt Milch, Brot und Äpfel kaufen? Das Geld liegt auf dem Küchentisch. Bitte bring auch den Müll nach unten.\n\nDanke!\nMama",
            },
          ],
          items: [
            { id: "l1", number: 1, type: "true_false", stimulusIds: ["l-t1"], prompt: "Anna feiert am Samstag ihren Geburtstag.", options: RF },
            { id: "l2", number: 2, type: "true_false", stimulusIds: ["l-t1"], prompt: "Julia soll Essen mitbringen.", options: RF },
            { id: "l3", number: 3, type: "true_false", stimulusIds: ["l-t1"], prompt: "Julia soll bis Donnerstag antworten.", options: RF },
            { id: "l4", number: 4, type: "true_false", stimulusIds: ["l-t2"], prompt: "Marco soll Milch, Brot und Käse kaufen.", options: RF },
            { id: "l5", number: 5, type: "true_false", stimulusIds: ["l-t2"], prompt: "Das Geld ist in der Küche.", options: RF },
          ],
        },
        {
          partId: "lesen-2",
          instructionsDe:
            "Lesen Sie die Texte und die Aufgaben 6 bis 10. Wo finden Sie Informationen? Kreuzen Sie an: a oder b.",
          example: {
            prompt: "Sie möchten am Sonntag frische Brötchen kaufen.",
            stimulusIds: ["l-ad0a", "l-ad0b"],
            options: [{ id: "a", label: "a", text: "Anzeige a" }, { id: "b", label: "b", text: "Anzeige b" }],
            answer: "a",
          },
          stimuli: [
            { id: "l-ad0a", kind: "ad", label: "Beispiel a", body: "**Bäckerei Krume**\nFrische Brötchen jeden Tag!\nMo–Sa 6–18 Uhr, **So 7–11 Uhr**" },
            { id: "l-ad0b", kind: "ad", label: "Beispiel b", body: "**FrischMarkt**\nObst, Gemüse, Brot\nMo–Sa 8–20 Uhr" },
            { id: "l-ad6a", kind: "ad", label: "6 a", body: "**Wochenend-Ticket**\nSamstag und Sonntag mit allen Regionalzügen durch ganz Deutschland – nur 29 €!" },
            { id: "l-ad6b", kind: "ad", label: "6 b", body: "**ICE Sprinter Berlin–München**\nMontag bis Freitag in nur 4 Stunden. Tickets ab 59 €." },
            { id: "l-ad7a", kind: "ad", label: "7 a", body: "**3-Zimmer-Wohnung am Stadtrand**\n80 m², mit Garten, ruhig, 900 € warm.\nTel. 0157 448 210" },
            { id: "l-ad7b", kind: "ad", label: "7 b", body: "**2-Zimmer-Wohnung im Zentrum**\n55 m², 3. Stock, Balkon, 750 € warm.\nTel. 0176 203 551" },
            { id: "l-ad8a", kind: "ad", label: "8 a", body: "**Volkshochschule**\nDeutsch A1 für Berufstätige\nmontags und mittwochs, 18:30–20:00 Uhr" },
            { id: "l-ad8b", kind: "ad", label: "8 b", body: "**Sprachschule Lingua**\nDeutsch A1 intensiv\nMontag bis Freitag, 9:00–12:00 Uhr" },
            { id: "l-ad9a", kind: "ad", label: "9 a", body: "**Kinderarztpraxis Dr. Seidel**\nSprechzeiten: Mo–Fr 8–12 Uhr und 15–18 Uhr" },
            { id: "l-ad9b", kind: "ad", label: "9 b", body: "**Ärztlicher Bereitschaftsdienst**\nAm Wochenende und an Feiertagen für Erwachsene und Kinder.\nTelefon 116 117" },
            { id: "l-ad10a", kind: "ad", label: "10 a", body: "**Fahrradwerkstatt Kurbel**\nWir reparieren Ihr Fahrrad – schnell und günstig." },
            { id: "l-ad10b", kind: "ad", label: "10 b", body: "**Flohmarkt im Hof**\nSamstag 10–16 Uhr\nKleidung, Bücher, Spielzeug und gebrauchte Fahrräder" },
          ],
          items: [
            { id: "l6", number: 6, type: "ab", stimulusIds: ["l-ad6a", "l-ad6b"], prompt: "Sie möchten am Wochenende mit dem Zug fahren und wenig bezahlen.", options: [{ id: "a", label: "a", text: "Anzeige a" }, { id: "b", label: "b", text: "Anzeige b" }] },
            { id: "l7", number: 7, type: "ab", stimulusIds: ["l-ad7a", "l-ad7b"], prompt: "Sie suchen eine Wohnung mit Balkon im Stadtzentrum.", options: [{ id: "a", label: "a", text: "Anzeige a" }, { id: "b", label: "b", text: "Anzeige b" }] },
            { id: "l8", number: 8, type: "ab", stimulusIds: ["l-ad8a", "l-ad8b"], prompt: "Sie arbeiten tagsüber und möchten am Abend Deutsch lernen.", options: [{ id: "a", label: "a", text: "Anzeige a" }, { id: "b", label: "b", text: "Anzeige b" }] },
            { id: "l9", number: 9, type: "ab", stimulusIds: ["l-ad9a", "l-ad9b"], prompt: "Ihr Kind ist am Sonntag krank. Sie brauchen einen Arzt.", options: [{ id: "a", label: "a", text: "Anzeige a" }, { id: "b", label: "b", text: "Anzeige b" }] },
            { id: "l10", number: 10, type: "ab", stimulusIds: ["l-ad10a", "l-ad10b"], prompt: "Sie möchten ein gebrauchtes Fahrrad kaufen.", options: [{ id: "a", label: "a", text: "Anzeige a" }, { id: "b", label: "b", text: "Anzeige b" }] },
          ],
        },
        {
          partId: "lesen-3",
          instructionsDe: "Lesen Sie die Texte und die Aufgaben 11 bis 15. Kreuzen Sie an: Richtig oder Falsch.",
          example: { prompt: "An der Bäckerei: Die Bäckerei öffnet um 6 Uhr.", stimulusIds: ["l-s0"], options: RF, answer: "r" },
          stimuli: [
            { id: "l-s0", kind: "notice", label: "Beispiel", title: "An der Tür der Bäckerei", body: "**Bäckerei Krume**\nFür Sie da ab 6 Uhr!" },
            { id: "l-s11", kind: "notice", label: "11", title: "An der Tür einer Arztpraxis", body: "**Praxis Dr. Hoffmann**\nVom 4. bis 15. August Urlaub.\nVertretung: Dr. Yilmaz, Bahnhofstraße 8" },
            { id: "l-s12", kind: "notice", label: "12", title: "Am Hallenbad", body: "**Hallenbad Nord – Öffnungszeiten**\nMontag: geschlossen\nDienstag–Freitag: 7–21 Uhr\nSamstag und Sonntag: 9–18 Uhr" },
            { id: "l-s13", kind: "notice", label: "13", title: "An der Bushaltestelle Rathaus", body: "**Linie 5**\nVom 1. bis 30. Juni hält der Bus hier nicht.\nBitte gehen Sie zur Haltestelle Marktplatz." },
            { id: "l-s14", kind: "notice", label: "14", title: "In der Stadtbibliothek", body: "**Rückgabe**\nBücher bitte hier zurückgeben.\nNach 18 Uhr: Rückgabe im Briefkasten am Eingang." },
            { id: "l-s15", kind: "notice", label: "15", title: "Im Supermarkt", body: "**Kasse 3**\nNur für Kunden mit höchstens 5 Artikeln." },
          ],
          items: [
            { id: "l11", number: 11, type: "true_false", stimulusIds: ["l-s11"], prompt: "Im August können Sie auch zu Dr. Yilmaz gehen.", options: RF },
            { id: "l12", number: 12, type: "true_false", stimulusIds: ["l-s12"], prompt: "Am Montag kann man hier schwimmen.", options: RF },
            { id: "l13", number: 13, type: "true_false", stimulusIds: ["l-s13"], prompt: "Im Juni fährt man mit dem Bus 5 von der Haltestelle Marktplatz.", options: RF },
            { id: "l14", number: 14, type: "true_false", stimulusIds: ["l-s14"], prompt: "Nach 18 Uhr kann man keine Bücher zurückgeben.", options: RF },
            { id: "l15", number: 15, type: "true_false", stimulusIds: ["l-s15"], prompt: "Mit vielen Artikeln soll man an Kasse 3 bezahlen.", options: RF },
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
            "Ihre Freundin Elena Rossi möchte im Fitnessstudio einen Kurs machen. Im Formular fehlen fünf Informationen. Helfen Sie Elena und schreiben Sie die fünf fehlenden Informationen in das Formular.",
          stimuli: [
            {
              id: "s-t1",
              kind: "text",
              title: "Elena",
              body:
                "Elena Rossi kommt aus Italien. Sie wohnt seit zwei Jahren in Köln, in der Gartenstraße 22, 50823 Köln. Sie ist 28 Jahre alt und arbeitet als Krankenschwester. Sie hat zwei Kinder. Elena möchte am Abend Yoga machen. Sie möchte mit Kreditkarte bezahlen.",
            },
            {
              id: "s-form",
              kind: "form",
              title: "FitPlus – Anmeldung",
              body:
                "| Feld | Eintrag |\n| --- | --- |\n| Name, Vorname | Rossi, Elena |\n| Herkunftsland | (1) |\n| Straße, Hausnummer | Gartenstraße 22 |\n| PLZ, Wohnort | (2) |\n| Alter | (3) |\n| Beruf | Krankenschwester |\n| Kurs | (4) |\n| Zahlungsart | (5) |",
            },
          ],
          items: [
            { id: "s1", number: 1, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Herkunftsland", prompt: "(1) Herkunftsland" },
            { id: "s2", number: 2, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "PLZ, Wohnort", prompt: "(2) PLZ, Wohnort" },
            { id: "s3", number: 3, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Alter", prompt: "(3) Alter" },
            { id: "s4", number: 4, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Kurs", prompt: "(4) Kurs" },
            { id: "s5", number: 5, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Zahlungsart", prompt: "(5) Zahlungsart" },
          ],
        },
        {
          partId: "schreiben-2",
          instructionsDe:
            "Sie haben am Freitag um 16 Uhr einen Termin beim Friseur „Haarwerk“. Sie können nicht kommen. Schreiben Sie eine E-Mail an den Friseur.",
          stimuli: [],
          items: [
            {
              id: "s6",
              number: 6,
              type: "writing",
              prompt: "E-Mail an den Friseur „Haarwerk“",
              writing: {
                taskDe:
                  "Schreiben Sie zu jedem Punkt ein bis zwei Sätze auf den Antwortbogen (circa 30 Wörter). Schreiben Sie auch eine Anrede und einen Gruß.",
                leitpunkte: [
                  "Sie können am Freitag nicht kommen.",
                  "Warum nicht?",
                  "Bitten Sie um einen neuen Termin.",
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
          instructionsDe: "Teil 1: Stellen Sie sich vor. Danach buchstabieren Sie ein Wort und nennen eine Zahl.",
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
                taskDe: "Stellen Sie sich mit den Stichwörtern vor. Beantworten Sie danach die Fragen der Prüferin.",
                cards: [{ title: "Stichwörter", body: "Name? Alter? Land? Wohnort? Sprachen? Beruf? Hobby?" }],
                partnerTurns: [
                  "Guten Tag. Bitte stellen Sie sich vor.",
                  "Danke. Buchstabieren Sie bitte Ihren Familiennamen.",
                  "Und wie ist Ihre Telefonnummer?",
                ],
                prepSeconds: 0,
                responseSeconds: 80,
              },
            },
          ],
        },
        {
          partId: "sprechen-2",
          instructionsDe:
            "Teil 2: Thema „Einkaufen“. Stellen Sie mit Ihren Karten Fragen. Ihre Partnerin / Ihr Partner antwortet. Dann antworten Sie auf die Fragen Ihrer Partnerin / Ihres Partners.",
          stimuli: [
            { id: "p-c2a", kind: "card", label: "Karte 1", title: "Thema: Einkaufen", body: "**Obst**" },
            { id: "p-c2b", kind: "card", label: "Karte 2", title: "Thema: Einkaufen", body: "**Wochenende**" },
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
                  "Stellen Sie zu jeder Karte eine Frage. Antworten Sie auch auf die zwei Fragen Ihrer Partnerin / Ihres Partners.",
                cards: [
                  { title: "Thema: Einkaufen", body: "Obst" },
                  { title: "Thema: Einkaufen", body: "Wochenende" },
                ],
                partnerTurns: [
                  "Jetzt fragen Sie bitte. Ihre erste Karte: Obst.",
                  "(Partnerin antwortet) Ja, ich esse gern Obst. Am liebsten Bananen. – Und jetzt meine Frage: Wo kaufst du ein?",
                  "Danke. Jetzt Ihre zweite Karte: Wochenende.",
                  "(Partnerin antwortet) Am Wochenende gehe ich auf den Markt. – Meine Frage: Was kostet bei dir ein Kilo Äpfel?",
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
            "Teil 3: Formulieren Sie mit Ihren Bildkarten Bitten. Ihre Partnerin / Ihr Partner reagiert. Reagieren Sie auch auf die Bitten Ihrer Partnerin / Ihres Partners.",
          stimuli: [
            { id: "p-c3a", kind: "card", label: "Karte 1", title: "Bildkarte", body: "🪟", imageAlt: "Ein geschlossenes Fenster" },
            { id: "p-c3b", kind: "card", label: "Karte 2", title: "Bildkarte", body: "✏️", imageAlt: "Ein Bleistift" },
          ],
          items: [
            {
              id: "p3",
              number: 3,
              type: "speaking",
              stimulusIds: ["p-c3a", "p-c3b"],
              prompt: "Bitten formulieren und darauf reagieren",
              speaking: {
                taskDe: "Formulieren Sie zu jeder Bildkarte eine Bitte. Reagieren Sie auch auf zwei Bitten Ihrer Partnerin / Ihres Partners.",
                cards: [
                  { title: "Bildkarte 1", body: "Fenster" },
                  { title: "Bildkarte 2", body: "Bleistift" },
                ],
                partnerTurns: [
                  "Formulieren Sie bitte eine Bitte zu Karte 1.",
                  "(Partner reagiert) Ja, gern. – Jetzt meine Bitte: Kannst du mir bitte dein Wörterbuch geben?",
                  "Danke. Und jetzt Ihre Karte 2.",
                  "(Partner reagiert) Natürlich, hier bitte. – Meine Bitte: Kannst du bitte langsamer sprechen?",
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
      id: "sc-h0", title: "Beispiel – Hotelrezeption", scenario: "accommodation",
      environment: { preset: "accommodation", ambienceLevel: 0.1 },
      speakers: [{ id: "w", name: "Frau Weber", role: "Gast", gender: "female" }, { id: "r", name: "Rezeptionist", role: "Hotel", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "w", text: "Guten Abend. Ich habe ein Zimmer reserviert. Mein Name ist Weber." },
        { id: "t2", speakerId: "r", text: "Guten Abend, Frau Weber. Ja, hier ist Ihr Schlüssel. Sie haben Zimmer einundzwanzig, im zweiten Stock." },
        { id: "t3", speakerId: "w", text: "Zimmer einundzwanzig. Danke schön!" },
      ],
    },
    {
      id: "sc-h1", title: "Im Supermarkt", scenario: "supermarket",
      environment: { preset: "supermarket", ambienceLevel: 0.15, ambiencePrompt: "quiet supermarket, distant till beeps, trolley wheels" },
      speakers: [{ id: "k", name: "Kundin", role: "Kundin", gender: "female" }, { id: "v", name: "Verkäufer", role: "Verkäufer", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "k", text: "Entschuldigung, wo finde ich hier Eier?" },
        { id: "t2", speakerId: "v", text: "Eier? Die sind hinten links, bei der Milch und dem Käse." },
        { id: "t3", speakerId: "k", text: "Hinten links? Beim Brot?" },
        { id: "t4", speakerId: "v", text: "Nein, das Brot ist vorne, neben der Kasse. Die Eier sind bei der Milch." },
        { id: "t5", speakerId: "k", text: "Ah, okay. Vielen Dank!" },
      ],
    },
    {
      id: "sc-h2", title: "Am Fahrkartenschalter", scenario: "railway_station",
      environment: { preset: "railway_station", ambienceLevel: 0.15, reverb: 0.2, ambiencePrompt: "indoor station ticket hall, soft crowd murmur" },
      speakers: [{ id: "m", name: "Reisender", role: "Kunde", gender: "male" }, { id: "f", name: "Mitarbeiterin", role: "Bahn", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "m", text: "Guten Tag. Wann fährt der nächste Zug nach Hamburg?" },
        { id: "t2", speakerId: "f", text: "Der Zug um zehn Uhr fünfzehn ist leider schon weg. Der nächste fährt um zehn Uhr fünfzig." },
        { id: "t3", speakerId: "m", text: "Zehn Uhr fünfzig. Und von welchem Gleis?" },
        { id: "t4", speakerId: "f", text: "Von Gleis sieben." },
        { id: "t5", speakerId: "m", text: "Danke schön." },
      ],
    },
    {
      id: "sc-h3", title: "Termin in der Arztpraxis", scenario: "doctor",
      environment: { preset: "telephone", ambienceLevel: 0.05, telephoneFilter: true },
      speakers: [{ id: "p", name: "Praxis", role: "Medizinische Fachangestellte", gender: "female" }, { id: "n", name: "Herr Novak", role: "Patient", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "p", text: "Praxis Doktor Albers, guten Morgen." },
        { id: "t2", speakerId: "n", text: "Guten Morgen, hier ist Novak. Ich brauche bitte einen Termin." },
        { id: "t3", speakerId: "p", text: "Geht es am Montag um neun Uhr?" },
        { id: "t4", speakerId: "n", text: "Am Montag arbeite ich leider. Geht es am Mittwoch?" },
        { id: "t5", speakerId: "p", text: "Mittwoch ist leider schon voll. Aber am Donnerstag um vierzehn Uhr ist noch frei." },
        { id: "t6", speakerId: "n", text: "Gut, dann komme ich am Donnerstag." },
      ],
    },
    {
      id: "sc-h4", title: "Im Café", scenario: "restaurant",
      environment: { preset: "restaurant", ambienceLevel: 0.15, ambiencePrompt: "small café, cups and quiet conversations" },
      speakers: [{ id: "k", name: "Kellnerin", role: "Kellnerin", gender: "female" }, { id: "g", name: "Gast", role: "Gast", gender: "male", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "k", text: "Guten Tag. Was möchten Sie trinken?" },
        { id: "t2", speakerId: "g", text: "Einen Kaffee, bitte. Ach nein, ich habe heute schon drei Kaffee getrunken. Ich nehme lieber einen Tee." },
        { id: "t3", speakerId: "k", text: "Einen Tee. Möchten Sie auch ein Wasser?" },
        { id: "t4", speakerId: "g", text: "Nein, danke." },
      ],
    },
    {
      id: "sc-h5", title: "Die neue Wohnung", scenario: "family",
      environment: { preset: "street", ambienceLevel: 0.1 },
      speakers: [{ id: "j", name: "Jonas", role: "Freund", gender: "male", age: "young" }, { id: "l", name: "Lea", role: "Freundin", gender: "female", age: "young" }],
      turns: [
        { id: "t1", speakerId: "j", text: "Hallo Lea! Und, wie ist deine neue Wohnung?" },
        { id: "t2", speakerId: "l", text: "Super! Sie hat drei Zimmer, eine Küche und einen Balkon." },
        { id: "t3", speakerId: "j", text: "Drei Zimmer? Deine alte Wohnung hatte nur zwei, oder?" },
        { id: "t4", speakerId: "l", text: "Ja, genau. Jetzt habe ich auch ein Arbeitszimmer." },
      ],
    },
    {
      id: "sc-h6", title: "Im Kleidungsgeschäft", scenario: "shop",
      environment: { preset: "shop", ambienceLevel: 0.12, ambiencePrompt: "clothing store, soft background music, hangers" },
      speakers: [{ id: "k", name: "Kundin", role: "Kundin", gender: "female" }, { id: "v", name: "Verkäufer", role: "Verkäufer", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "k", text: "Entschuldigung, was kostet diese Jacke?" },
        { id: "t2", speakerId: "v", text: "Die blaue Jacke? Sie kostet neunundvierzig Euro. Aber heute ist sie zehn Euro billiger." },
        { id: "t3", speakerId: "k", text: "Also neununddreißig Euro?" },
        { id: "t4", speakerId: "v", text: "Ja, genau." },
      ],
    },
    {
      id: "sc-h7", title: "Durchsage am Bahnhof", scenario: "railway_station",
      environment: { preset: "railway_station", ambienceLevel: 0.2, publicAddress: true, reverb: 0.35, ambiencePrompt: "outdoor railway platform, distant train, light wind" },
      speakers: [{ id: "d", name: "Durchsage", role: "Bahnhofsansage", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Achtung an Gleis vier. Der Regionalexpress nach Leipzig, Abfahrt sechzehn Uhr zwanzig, hat heute circa fünfzehn Minuten Verspätung. Wir bitten um Entschuldigung.", pace: 0.95 },
      ],
    },
    {
      id: "sc-h8", title: "Durchsage im Kaufhaus", scenario: "shop",
      environment: { preset: "shop", ambienceLevel: 0.15, publicAddress: true, reverb: 0.2 },
      speakers: [{ id: "d", name: "Durchsage", role: "Kaufhausdurchsage", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Kundinnen und Kunden! Nur heute: Alle T-Shirts im zweiten Stock kosten nur fünf Euro. Das Angebot gilt bis achtzehn Uhr." },
      ],
    },
    {
      id: "sc-h9", title: "Durchsage am Flughafen", scenario: "airport",
      environment: { preset: "airport", ambienceLevel: 0.18, publicAddress: true, reverb: 0.4, ambiencePrompt: "airport terminal hall, rolling suitcases, soft crowd" },
      speakers: [{ id: "d", name: "Durchsage", role: "Flughafendurchsage", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Information für die Fluggäste nach Wien: Bitte kommen Sie jetzt zum Ausgang B zwölf. Ich wiederhole: Ausgang B zwölf. Vielen Dank.", pace: 0.95 },
      ],
    },
    {
      id: "sc-h10", title: "Durchsage im Supermarkt", scenario: "supermarket",
      environment: { preset: "supermarket", ambienceLevel: 0.15, publicAddress: true, reverb: 0.2 },
      speakers: [{ id: "d", name: "Durchsage", role: "Marktdurchsage", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Kunden, unser Markt schließt in zehn Minuten. Bitte kommen Sie jetzt zur Kasse. Vielen Dank für Ihren Einkauf." },
      ],
    },
    {
      id: "sc-h11", title: "Nachricht von Sara", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.05, telephoneFilter: true },
      speakers: [{ id: "s", name: "Sara", role: "Freundin", gender: "female", age: "young" }],
      turns: [
        { id: "t1", speakerId: "s", text: "Hallo Tim, hier ist Sara. Wir treffen uns heute nicht um sieben Uhr, sondern um halb acht. Ich muss länger arbeiten. Bis später!" },
      ],
    },
    {
      id: "sc-h12", title: "Nachricht aus der Arztpraxis", scenario: "doctor",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "p", name: "Praxis Dr. Brandt", role: "Praxis", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "p", text: "Guten Tag, Frau Kaya, hier ist die Praxis Doktor Brandt. Ihr Termin morgen um zehn Uhr geht leider nicht. Bitte rufen Sie uns zurück. Unsere Nummer ist null drei vier eins, zwei zwei sechs, acht neun null. Danke!" },
      ],
    },
    {
      id: "sc-h13", title: "Nachricht von der Hausverwaltung", scenario: "accommodation",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "k", name: "Frau Klein", role: "Hausverwaltung", gender: "female", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "k", text: "Hallo Herr Petersen, hier ist Klein von der Hausverwaltung. Der Techniker kommt am Freitag zwischen acht und zwölf Uhr. Er repariert die Heizung. Bitte seien Sie zu Hause. Auf Wiederhören!" },
      ],
    },
    {
      id: "sc-h14", title: "Nachricht vom Fahrradgeschäft", scenario: "shop",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "f", name: "Fahrradgeschäft", role: "Verkäufer", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "f", text: "Guten Tag, hier ist das Fahrradgeschäft Rad und Tat. Ihr Fahrrad ist fertig. Sie können es ab heute abholen. Wir haben bis achtzehn Uhr geöffnet, am Samstag bis vierzehn Uhr." },
      ],
    },
    {
      id: "sc-h15", title: "Nachricht von Ben", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.05, telephoneFilter: true },
      speakers: [{ id: "b", name: "Ben", role: "Freund", gender: "male", age: "young" }],
      turns: [
        { id: "t1", speakerId: "b", text: "Hi Maria, hier ist Ben. Am Sonntag mache ich ein Picknick im Stadtpark. Kannst du einen Salat mitbringen? Getränke und Kuchen habe ich schon. Ruf mich an!" },
      ],
    },
  ],

  /* ==================================================================================== */
  /* ANSWER KEY                                                                           */
  /* ==================================================================================== */
  answerKey: {
    h1: { correct: ["b"], explanation: "Der Verkäufer sagt: Die Eier sind bei der Milch. Das Brot ist vorne.", evidence: "Die Eier sind bei der Milch." },
    h2: { correct: ["b"], explanation: "Der Zug um 10:15 Uhr ist schon weg. Der nächste fährt um 10:50 Uhr.", evidence: "Der nächste fährt um zehn Uhr fünfzig." },
    h3: { correct: ["c"], explanation: "Montag geht nicht (er arbeitet), Mittwoch ist voll. Er nimmt den Termin am Donnerstag.", evidence: "Gut, dann komme ich am Donnerstag." },
    h4: { correct: ["b"], explanation: "Er möchte zuerst Kaffee, nimmt dann aber Tee. Wasser möchte er nicht.", evidence: "Ich nehme lieber einen Tee." },
    h5: { correct: ["b"], explanation: "Die neue Wohnung hat drei Zimmer. Die alte Wohnung hatte zwei.", evidence: "Sie hat drei Zimmer." },
    h6: { correct: ["b"], explanation: "Die Jacke kostet 49 Euro, heute 10 Euro weniger: 39 Euro.", evidence: "Also neununddreißig Euro? – Ja, genau." },
    h7: { correct: ["f"], explanation: "Der Zug hat circa 15 Minuten Verspätung.", evidence: "hat heute circa fünfzehn Minuten Verspätung" },
    h8: { correct: ["r"], explanation: "Alle T-Shirts kosten heute nur fünf Euro.", evidence: "Alle T-Shirts im zweiten Stock kosten nur fünf Euro." },
    h9: { correct: ["f"], explanation: "Der Ausgang ist B 12, nicht B 21.", evidence: "Ausgang B zwölf" },
    h10: { correct: ["r"], explanation: "Der Markt schließt in zehn Minuten.", evidence: "unser Markt schließt in zehn Minuten" },
    h11: { correct: ["b"], explanation: "Sie treffen sich um halb acht, also um 19:30 Uhr.", evidence: "nicht um sieben Uhr, sondern um halb acht" },
    h12: { correct: ["b"], explanation: "Der Termin geht nicht. Frau Kaya soll die Praxis zurückrufen.", evidence: "Bitte rufen Sie uns zurück." },
    h13: { correct: ["a"], explanation: "Der Techniker repariert die Heizung.", evidence: "Er repariert die Heizung." },
    h14: { correct: ["a"], explanation: "Am Samstag ist das Geschäft bis 14 Uhr geöffnet.", evidence: "am Samstag bis vierzehn Uhr" },
    h15: { correct: ["c"], explanation: "Getränke und Kuchen hat Ben schon. Maria soll einen Salat mitbringen.", evidence: "Kannst du einen Salat mitbringen?" },
    l1: { correct: ["r"], explanation: "Anna schreibt: Am Samstag habe ich Geburtstag.", evidence: "am Samstag habe ich Geburtstag" },
    l2: { correct: ["f"], explanation: "Julia muss nichts mitbringen. Anna kocht für alle.", evidence: "Du musst nichts mitbringen, ich koche für alle." },
    l3: { correct: ["r"], explanation: "Anna bittet um eine Antwort bis Donnerstag.", evidence: "Bitte schreib mir bis Donnerstag." },
    l4: { correct: ["f"], explanation: "Marco soll Milch, Brot und Äpfel kaufen – keinen Käse.", evidence: "Milch, Brot und Äpfel" },
    l5: { correct: ["r"], explanation: "Das Geld liegt auf dem Küchentisch.", evidence: "Das Geld liegt auf dem Küchentisch." },
    l6: { correct: ["a"], explanation: "Das Wochenend-Ticket gilt am Samstag und Sonntag und kostet nur 29 €. Der ICE fährt nur Montag bis Freitag.", evidence: "Samstag und Sonntag … nur 29 €" },
    l7: { correct: ["b"], explanation: "Die 2-Zimmer-Wohnung ist im Zentrum und hat einen Balkon. Die andere Wohnung ist am Stadtrand.", evidence: "im Zentrum … Balkon" },
    l8: { correct: ["a"], explanation: "Der Kurs an der Volkshochschule ist am Abend (18:30 Uhr). Der Kurs der Sprachschule ist am Vormittag.", evidence: "18:30–20:00 Uhr" },
    l9: { correct: ["b"], explanation: "Der Bereitschaftsdienst hilft am Wochenende. Die Kinderarztpraxis ist nur Montag bis Freitag offen.", evidence: "Am Wochenende und an Feiertagen" },
    l10: { correct: ["b"], explanation: "Auf dem Flohmarkt gibt es gebrauchte Fahrräder. Die Werkstatt repariert nur.", evidence: "gebrauchte Fahrräder" },
    l11: { correct: ["r"], explanation: "Dr. Hoffmann hat im August Urlaub. Die Vertretung ist Dr. Yilmaz.", evidence: "Vertretung: Dr. Yilmaz" },
    l12: { correct: ["f"], explanation: "Am Montag ist das Hallenbad geschlossen.", evidence: "Montag: geschlossen" },
    l13: { correct: ["r"], explanation: "Im Juni hält der Bus nicht am Rathaus. Man soll zur Haltestelle Marktplatz gehen.", evidence: "Bitte gehen Sie zur Haltestelle Marktplatz." },
    l14: { correct: ["f"], explanation: "Nach 18 Uhr gibt man die Bücher in den Briefkasten am Eingang.", evidence: "Nach 18 Uhr: Rückgabe im Briefkasten" },
    l15: { correct: ["f"], explanation: "Kasse 3 ist nur für Kunden mit höchstens fünf Artikeln.", evidence: "Nur für Kunden mit höchstens 5 Artikeln." },
    s1: { correct: ["Italien"], explanation: "Elena kommt aus Italien." },
    s2: { correct: ["50823 Köln", "Köln 50823", "50823 Koeln"], explanation: "Elena wohnt in 50823 Köln." },
    s3: { correct: ["28", "28 Jahre", "achtundzwanzig", "28 Jahre alt"], explanation: "Elena ist 28 Jahre alt." },
    s4: { correct: ["Yoga", "Yoga am Abend", "Yogakurs", "Yoga abends"], explanation: "Elena möchte am Abend Yoga machen." },
    s5: { correct: ["Kreditkarte", "mit Kreditkarte", "per Kreditkarte"], explanation: "Elena möchte mit Kreditkarte bezahlen." },
    s6: { correct: [], explanation: "Bewertet werden die drei Inhaltspunkte (je 0 / 1,5 / 3 Punkte) und die Textsorte mit Anrede und Gruß (0 / 0,5 / 1 Punkt)." },
    p1: { correct: [] },
    p2: { correct: [] },
    p3: { correct: [] },
  },
};
