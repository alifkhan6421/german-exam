import type { ExamContentInput } from "@/domain/exam/schema";

/**
 * telc A1 (Start Deutsch 1) — Übungstest 3 (original content).
 *
 * Theme: Wohnen und Nachbarschaft — Wohnungssuche, Umzug, Möbel, Hausmeister, Nachbarn, Stadtteil.
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

export const telcA1Mock3: ExamContentInput = {
  schemaVersion: 1,
  blueprintKey: "telc-a1-sd1",
  blueprintVersion: "2026.10.2",
  title: "telc A1 — Übungstest 3",
  themes: ["Wohnungssuche", "Umzug", "Möbel", "Hausmeister", "Nachbarn", "Stadtteil"],
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
            prompt: "Wo findet die Frau die Betten?",
            stimulusIds: ["h-a0"],
            options: [
              { id: "a", label: "a", text: "Im Erdgeschoss" },
              { id: "b", label: "b", text: "Im ersten Stock" },
              { id: "c", label: "c", text: "Im dritten Stock" },
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
            { id: "h1", number: 1, type: "mc", stimulusIds: ["h-a1"], prompt: "Wie viel bezahlt Frau Albrecht im Monat?", options: [{ id: "a", label: "a", text: "680 Euro" }, { id: "b", label: "b", text: "620 Euro" }, { id: "c", label: "c", text: "760 Euro" }] },
            { id: "h2", number: 2, type: "mc", stimulusIds: ["h-a2"], prompt: "Wann hilft Nina beim Umzug?", options: [{ id: "a", label: "a", text: "Am Freitag" }, { id: "b", label: "b", text: "Am Samstag" }, { id: "c", label: "c", text: "Am Sonntag" }] },
            { id: "h3", number: 3, type: "mc", stimulusIds: ["h-a3"], prompt: "Was ist kaputt?", options: [{ id: "a", label: "a", text: "Die Waschmaschine" }, { id: "b", label: "b", text: "Das Licht im Flur" }, { id: "c", label: "c", text: "Die Klingel" }] },
            { id: "h4", number: 4, type: "mc", stimulusIds: ["h-a4"], prompt: "Woher kommt die neue Nachbarin?", options: [{ id: "a", label: "a", text: "Aus Portugal" }, { id: "b", label: "b", text: "Aus Spanien" }, { id: "c", label: "c", text: "Aus Polen" }] },
            { id: "h5", number: 5, type: "mc", stimulusIds: ["h-a5"], prompt: "Was kauft der Mann?", options: [{ id: "a", label: "a", text: "Ein Sofa" }, { id: "b", label: "b", text: "Einen Tisch" }, { id: "c", label: "c", text: "Einen Schrank" }] },
            { id: "h6", number: 6, type: "mc", stimulusIds: ["h-a6"], prompt: "Wie fährt Lukas jetzt zur Arbeit?", options: [{ id: "a", label: "a", text: "Mit dem Bus" }, { id: "b", label: "b", text: "Mit dem Fahrrad" }, { id: "c", label: "c", text: "Mit der U-Bahn" }] },
          ],
        },
        {
          partId: "hoeren-2",
          instructionsDe:
            "Sie hören Durchsagen. Sie hören jeden Text einmal. Kreuzen Sie an: Richtig oder Falsch. Lesen Sie zuerst das Beispiel.",
          example: { prompt: "Die Lampen sind heute billiger.", stimulusIds: ["h-a00"], options: RF, answer: "r" },
          stimuli: [
            { id: "h-a00", kind: "audio", title: "Beispiel", scriptId: "sc-h00", body: "" },
            { id: "h-a7", kind: "audio", title: "Durchsage 7", scriptId: "sc-h7", body: "" },
            { id: "h-a8", kind: "audio", title: "Durchsage 8", scriptId: "sc-h8", body: "" },
            { id: "h-a9", kind: "audio", title: "Durchsage 9", scriptId: "sc-h9", body: "" },
            { id: "h-a10", kind: "audio", title: "Durchsage 10", scriptId: "sc-h10", body: "" },
          ],
          items: [
            { id: "h7", number: 7, type: "true_false", stimulusIds: ["h-a7"], prompt: "Das Restaurant im ersten Stock ist heute offen.", options: RF },
            { id: "h8", number: 8, type: "true_false", stimulusIds: ["h-a8"], prompt: "Ab Rosenplatz fahren die Fahrgäste mit dem Bus.", options: RF },
            { id: "h9", number: 9, type: "true_false", stimulusIds: ["h-a9"], prompt: "Das Bürgeramt ist heute bis 16 Uhr geöffnet.", options: RF },
            { id: "h10", number: 10, type: "true_false", stimulusIds: ["h-a10"], prompt: "Das Konzert beginnt um 19 Uhr.", options: RF },
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
            { id: "h11", number: 11, type: "mc", stimulusIds: ["h-a11"], prompt: "Wann kann Herr Demir die Wohnung sehen?", options: [{ id: "a", label: "a", text: "Am Dienstag um 17 Uhr" }, { id: "b", label: "b", text: "Am Mittwoch um 17 Uhr" }, { id: "c", label: "c", text: "Am Mittwoch um 7 Uhr" }] },
            { id: "h12", number: 12, type: "mc", stimulusIds: ["h-a12"], prompt: "Was soll Frau Schuster machen?", options: [{ id: "a", label: "a", text: "Kartons kaufen" }, { id: "b", label: "b", text: "Den Wagen fahren" }, { id: "c", label: "c", text: "Die Bücher einpacken" }] },
            { id: "h13", number: 13, type: "mc", stimulusIds: ["h-a13"], prompt: "Wo ist Jans Schlüssel?", options: [{ id: "a", label: "a", text: "Bei Frau Kraus" }, { id: "b", label: "b", text: "Im Briefkasten" }, { id: "c", label: "c", text: "Bei Mia im Keller" }] },
            { id: "h14", number: 14, type: "mc", stimulusIds: ["h-a14"], prompt: "Wann gibt es am Freitag kein Wasser?", options: [{ id: "a", label: "a", text: "Den ganzen Tag" }, { id: "b", label: "b", text: "Von 9 bis 12 Uhr" }, { id: "c", label: "c", text: "Ab 12 Uhr" }] },
            { id: "h15", number: 15, type: "mc", stimulusIds: ["h-a15"], prompt: "Was kann Herr Okafor ab morgen abholen?", options: [{ id: "a", label: "a", text: "Die Stühle" }, { id: "b", label: "b", text: "Das Regal" }, { id: "c", label: "c", text: "Den Tisch" }] },
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
          example: { prompt: "Das Fest beginnt am Nachmittag.", stimulusIds: ["l-t1"], options: RF, answer: "r" },
          stimuli: [
            {
              id: "l-t1",
              kind: "notice",
              title: "Text 1",
              body:
                "**Einladung zum Hoffest!**\n\nLiebe Nachbarinnen und Nachbarn,\n\nam Samstag, 14. Juni, machen wir ein Fest im Hof. Wir beginnen um 15 Uhr. Für die Kinder gibt es Spiele. Bitte bringen Sie einen Kuchen oder einen Salat mit. Die Getränke kaufen wir. Bei Regen feiern wir im Keller.\n\nBitte antworten Sie bis Mittwoch.\n\nViele Grüße\nFamilie Horvath, 2. Stock",
            },
            {
              id: "l-t2",
              kind: "note",
              title: "Text 2",
              body:
                "Hallo Tobias,\n\nder Hausmeister kommt heute um 16 Uhr. Er repariert die Dusche. Ich bin leider bis 18 Uhr im Büro. Kannst du bitte zu Hause sein? Der neue Schrank für dein Zimmer kommt erst morgen.\n\nDanke!\nLena",
            },
          ],
          items: [
            { id: "l1", number: 1, type: "true_false", stimulusIds: ["l-t1"], prompt: "Die Nachbarn sollen Getränke mitbringen.", options: RF },
            { id: "l2", number: 2, type: "true_false", stimulusIds: ["l-t1"], prompt: "Wenn es regnet, ist das Fest im Keller.", options: RF },
            { id: "l3", number: 3, type: "true_false", stimulusIds: ["l-t1"], prompt: "Familie Horvath wohnt im Erdgeschoss.", options: RF },
            { id: "l4", number: 4, type: "true_false", stimulusIds: ["l-t2"], prompt: "Der Hausmeister repariert heute die Dusche.", options: RF },
            { id: "l5", number: 5, type: "true_false", stimulusIds: ["l-t2"], prompt: "Der Schrank für Tobias kommt heute.", options: RF },
          ],
        },
        {
          partId: "lesen-2",
          instructionsDe:
            "Lesen Sie die Aufgaben 6–10 und die Texte. Welche Anzeige ist interessant für Sie? Kreuzen Sie an: a oder b. Lesen Sie zuerst das Beispiel.",
          example: {
            prompt: "Sie suchen ein Zimmer für einen Monat.",
            stimulusIds: ["l-ad0a", "l-ad0b"],
            options: AB,
            answer: "a",
          },
          stimuli: [
            { id: "l-ad0a", kind: "ad", label: "Beispiel a", body: "**Zimmer frei!**\nMöbliertes Zimmer ab 1. Mai. Nur für vier Wochen. Miete: 350 Euro." },
            { id: "l-ad0b", kind: "ad", label: "Beispiel b", body: "**WG-Zimmer ab sofort**\nNur für Studenten. Mindestens ein Jahr. Miete: 420 Euro." },
            { id: "l-ad6a", kind: "ad", label: "6 a", body: "**3-Zimmer-Wohnung in Nordstadt**\nSpielplatz im Hof. Haustiere sind leider nicht möglich. Tel. 0151 732 448." },
            { id: "l-ad6b", kind: "ad", label: "6 b", body: "**4-Zimmer-Wohnung mit Garten**\nHund oder Katze? Kein Problem! Die Schule ist nur 5 Minuten weit. Tel. 0172 905 316." },
            { id: "l-ad7a", kind: "ad", label: "7 a", body: "**Umzugshilfe Stark**\nWir tragen Ihre Möbel. Wir arbeiten auch am Wochenende. Rufen Sie an: 0800 447 120." },
            { id: "l-ad7b", kind: "ad", label: "7 b", body: "**Möbelmarkt Kessler**\nSofas, Betten und Regale. Diese Woche alles 20 Prozent billiger!" },
            { id: "l-ad8a", kind: "ad", label: "8 a", body: "**Neu im Möbelhaus Weiß!**\nModerne Sofas in vielen Farben. Preise ab 899 Euro." },
            { id: "l-ad8b", kind: "ad", label: "8 b", body: "**Verkaufe mein Sofa.**\nEs ist drei Jahre alt und sehr gut. Nur 80 Euro! Sie müssen es selbst abholen." },
            { id: "l-ad9a", kind: "ad", label: "9 a", body: "**Waschsalon Blitz**\nWaschen und trocknen in einer Stunde. Wir sind jeden Tag von 7 bis 22 Uhr da." },
            { id: "l-ad9b", kind: "ad", label: "9 b", body: "**Elektro Huber**\nWir reparieren Waschmaschinen. Freie Termine in zwei Wochen." },
            { id: "l-ad10a", kind: "ad", label: "10 a", body: "**Kino am Park**\nJeden Abend neue Filme. Am Montag kostet das Ticket nur 6 Euro." },
            { id: "l-ad10b", kind: "ad", label: "10 b", body: "**Nachbarschaftscafé**\nJeden Donnerstag von 15 bis 18 Uhr im Stadtteilzentrum. Neue Nachbarn sind herzlich willkommen!" },
          ],
          items: [
            { id: "l6", number: 6, type: "ab", stimulusIds: ["l-ad6a", "l-ad6b"], prompt: "Sie haben ein Kind und einen Hund. Sie suchen eine Wohnung.", options: AB },
            { id: "l7", number: 7, type: "ab", stimulusIds: ["l-ad7a", "l-ad7b"], prompt: "Sie ziehen um. Sie brauchen Hilfe mit Ihren Möbeln.", options: AB },
            { id: "l8", number: 8, type: "ab", stimulusIds: ["l-ad8a", "l-ad8b"], prompt: "Sie möchten ein Sofa kaufen. Sie haben nicht viel Geld.", options: AB },
            { id: "l9", number: 9, type: "ab", stimulusIds: ["l-ad9a", "l-ad9b"], prompt: "Ihre Waschmaschine ist kaputt. Sie möchten heute Ihre Wäsche waschen.", options: AB },
            { id: "l10", number: 10, type: "ab", stimulusIds: ["l-ad10a", "l-ad10b"], prompt: "Sie sind neu im Stadtteil. Sie möchten Ihre Nachbarn kennenlernen.", options: AB },
          ],
        },
        {
          partId: "lesen-3",
          instructionsDe:
            "Lesen Sie die Texte und die Aufgaben 11–15. Kreuzen Sie an: Richtig oder Falsch. Lesen Sie zuerst das Beispiel.",
          example: { prompt: "Am Abend soll man die Haustür abschließen.", stimulusIds: ["l-s0"], options: RF, answer: "r" },
          stimuli: [
            { id: "l-s0", kind: "notice", label: "Beispiel", title: "An der Haustür", body: "**Liebe Mieter!**\nBitte schließen Sie die Haustür ab 22 Uhr ab.\nIhre Hausverwaltung." },
            { id: "l-s11", kind: "notice", label: "11", title: "An der Tür einer Grundschule", body: "**Elternabend Klasse 2b**\nAm Dienstag um 19 Uhr in Raum 8.\nBitte kommen Sie pünktlich." },
            { id: "l-s12", kind: "notice", label: "12", title: "In der Post", body: "**Postfiliale Lindenplatz**\nPakete bekommen Sie an Schalter 2.\nSamstag: 9 bis 12 Uhr geöffnet." },
            { id: "l-s13", kind: "notice", label: "13", title: "Am Bahnhof", body: "**Bahnhof Ost**\nDer Aufzug zu Gleis 3 ist kaputt.\nBitte nehmen Sie den Aufzug an Gleis 4." },
            { id: "l-s14", kind: "notice", label: "14", title: "An der Tür eines Restaurants", body: "**Gasthaus Zur Linde**\nHeute geschlossen.\nAb morgen sind wir wieder für Sie da!" },
            { id: "l-s15", kind: "notice", label: "15", title: "An der Bushaltestelle Kirchweg", body: "**Bus 12**\nVom 3. bis 7. März hält der Bus hier nicht.\nDie Haltestelle ist in dieser Zeit in der Bergstraße." },
          ],
          items: [
            { id: "l11", number: 11, type: "true_false", stimulusIds: ["l-s11"], prompt: "Der Elternabend ist am Vormittag.", options: RF },
            { id: "l12", number: 12, type: "true_false", stimulusIds: ["l-s12"], prompt: "Am Samstag kann man hier am Vormittag Pakete abholen.", options: RF },
            { id: "l13", number: 13, type: "true_false", stimulusIds: ["l-s13"], prompt: "Man kann zu Gleis 3 den Aufzug nehmen.", options: RF },
            { id: "l14", number: 14, type: "true_false", stimulusIds: ["l-s14"], prompt: "Das Restaurant ist morgen wieder offen.", options: RF },
            { id: "l15", number: 15, type: "true_false", stimulusIds: ["l-s15"], prompt: "Im März hält der Bus 12 jeden Tag am Kirchweg.", options: RF },
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
            "Ihr Freund Rafael Moreno ist neu in Freiburg. Er möchte einen Ausweis für die Stadtbibliothek. Lesen Sie den Text. Schreiben Sie die fünf fehlenden Informationen in das Formular.",
          stimuli: [
            {
              id: "s-t1",
              kind: "text",
              title: "Rafael",
              body:
                "Rafael Moreno kommt aus Chile. Er ist am 12. März 1994 geboren. Seit Juli wohnt er in der Kastanienallee 7, 79102 Freiburg. Er ist Koch von Beruf. Rafael liest nicht viel. Aber er möchte gern Filme ausleihen. Die Jahresgebühr bezahlt er bar.",
            },
            {
              id: "s-form",
              kind: "form",
              title: "Stadtbibliothek Freiburg – Anmeldung",
              body:
                "| Feld | Eintrag |\n| --- | --- |\n| Name, Vorname | Moreno, Rafael |\n| Geburtsdatum | (1) |\n| Herkunftsland | Chile |\n| Straße, Hausnummer | Kastanienallee 7 |\n| PLZ, Wohnort | (2) |\n| Beruf | (3) |\n| Ich möchte ausleihen: Bücher / Filme / Musik | (4) |\n| Zahlung: bar / mit Karte | (5) |",
            },
          ],
          items: [
            { id: "s1", number: 1, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Geburtsdatum", prompt: "(1) Geburtsdatum" },
            { id: "s2", number: 2, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "PLZ, Wohnort", prompt: "(2) PLZ, Wohnort" },
            { id: "s3", number: 3, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Beruf", prompt: "(3) Beruf" },
            { id: "s4", number: 4, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Ich möchte ausleihen", prompt: "(4) Ich möchte ausleihen: Bücher / Filme / Musik" },
            { id: "s5", number: 5, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Zahlung", prompt: "(5) Zahlung: bar / mit Karte" },
          ],
        },
        {
          partId: "schreiben-2",
          instructionsDe:
            "Sie ziehen am Samstag in eine neue Wohnung. Ihre Nachbarin heißt Frau Lindqvist. Schreiben Sie Frau Lindqvist eine kurze Nachricht.",
          stimuli: [],
          items: [
            {
              id: "s6",
              number: 6,
              type: "writing",
              prompt: "Nachricht an die Nachbarin Frau Lindqvist",
              writing: {
                taskDe:
                  "Schreiben Sie zu jedem Punkt ein bis zwei Sätze (circa 30 Wörter). Schreiben Sie auch eine Anrede und einen Gruß.",
                leitpunkte: [
                  "Wer sind Sie?",
                  "Am Samstag ist es im Haus laut. Warum?",
                  "Laden Sie Frau Lindqvist zu einem Kaffee ein.",
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
                  "Stellen Sie sich mit den Stichwörtern vor. Buchstabieren Sie dann Ihren Wohnort und nennen Sie Ihre Hausnummer und Postleitzahl.",
                cards: [{ title: "Stichwörter", body: "Name? Alter? Land? Wohnort? Sprachen? Beruf? Hobby?" }],
                partnerTurns: [
                  "Hallo und herzlich willkommen. Erzählen Sie bitte etwas über sich.",
                  "Vielen Dank. Wie heißt Ihr Wohnort? Buchstabieren Sie ihn bitte.",
                  "Gut. Und wie ist Ihre Adresse? Nennen Sie bitte Ihre Hausnummer und Ihre Postleitzahl.",
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
            "Sie bekommen zwei Karten mit einem Thema und einem Wort. Stellen Sie eine Frage zu Ihrer Karte. Ihre Partnerin / Ihr Partner antwortet. Runde 1: Thema „Wohnen“. Runde 2: Thema „Stadt“.",
          stimuli: [
            { id: "p-c2w1", kind: "card", label: "Wohnen 1", title: "Thema: Wohnen", body: "**Zimmer**" },
            { id: "p-c2w2", kind: "card", label: "Wohnen 2", title: "Thema: Wohnen", body: "**Küche**" },
            { id: "p-c2w3", kind: "card", label: "Wohnen 3", title: "Thema: Wohnen", body: "**Miete**" },
            { id: "p-c2w4", kind: "card", label: "Wohnen 4", title: "Thema: Wohnen", body: "**Nachbarn**" },
            { id: "p-c2w5", kind: "card", label: "Wohnen 5", title: "Thema: Wohnen", body: "**Balkon**" },
            { id: "p-c2w6", kind: "card", label: "Wohnen 6", title: "Thema: Wohnen", body: "**Möbel**" },
            { id: "p-c2s1", kind: "card", label: "Stadt 1", title: "Thema: Stadt", body: "**Park**" },
            { id: "p-c2s2", kind: "card", label: "Stadt 2", title: "Thema: Stadt", body: "**Bus**" },
            { id: "p-c2s3", kind: "card", label: "Stadt 3", title: "Thema: Stadt", body: "**Markt**" },
            { id: "p-c2s4", kind: "card", label: "Stadt 4", title: "Thema: Stadt", body: "**Kino**" },
            { id: "p-c2s5", kind: "card", label: "Stadt 5", title: "Thema: Stadt", body: "**Schwimmbad**" },
            { id: "p-c2s6", kind: "card", label: "Stadt 6", title: "Thema: Stadt", body: "**Bibliothek**" },
          ],
          items: [
            {
              id: "p2",
              number: 2,
              type: "speaking",
              stimulusIds: ["p-c2w1", "p-c2w2", "p-c2w3", "p-c2w4", "p-c2w5", "p-c2w6", "p-c2s1", "p-c2s2", "p-c2s3", "p-c2s4", "p-c2s5", "p-c2s6"],
              prompt: "Um Informationen bitten und Informationen geben",
              speaking: {
                taskDe:
                  "Stellen Sie zu jeder Karte eine Frage. Antworten Sie auch auf die Fragen Ihrer Partnerin / Ihres Partners.",
                cards: [
                  { title: "Thema: Wohnen", body: "Miete" },
                  { title: "Thema: Stadt", body: "Park" },
                ],
                partnerTurns: [
                  "Wir beginnen mit dem Thema Wohnen. Ihre Karte: Miete. Fragen Sie bitte.",
                  "(Partner antwortet) Meine Miete ist nicht so hoch, ungefähr 500 Euro. – Jetzt meine Frage, Karte Balkon: Hast du einen Balkon?",
                  "Danke. Jetzt das Thema Stadt. Ihre Karte: Park.",
                  "(Partner antwortet) Ja, ich gehe am Sonntag oft in den Park. – Meine Frage, Karte Bus: Welcher Bus fährt zu deiner Wohnung?",
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
            { id: "p-c3a", kind: "card", label: "Karte 1", title: "Handlungskarte", body: "Bild: ein Umzugskarton", imageAlt: "Ein großer Umzugskarton aus Pappe" },
            { id: "p-c3b", kind: "card", label: "Karte 2", title: "Handlungskarte", body: "Bild: ein Hausschlüssel", imageAlt: "Ein Hausschlüssel" },
            { id: "p-c3c", kind: "card", label: "Karte 3", title: "Handlungskarte", body: "Bild: eine Bohrmaschine", imageAlt: "Eine Bohrmaschine" },
            { id: "p-c3d", kind: "card", label: "Karte 4", title: "Handlungskarte", body: "Bild: eine Stehlampe", imageAlt: "Eine Stehlampe" },
          ],
          items: [
            {
              id: "p3",
              number: 3,
              type: "speaking",
              stimulusIds: ["p-c3a", "p-c3b", "p-c3c", "p-c3d"],
              prompt: "Bitten formulieren und darauf reagieren",
              speaking: {
                taskDe:
                  "Formulieren Sie zu Karte 1 und Karte 2 eine Bitte. Reagieren Sie auch auf zwei Bitten Ihrer Partnerin / Ihres Partners (Karte 3 und Karte 4).",
                cards: [
                  { title: "Karte 1", body: "Bild: ein Umzugskarton" },
                  { title: "Karte 2", body: "Bild: ein Hausschlüssel" },
                ],
                partnerTurns: [
                  "Bitte formulieren Sie eine Bitte zu Karte 1.",
                  "(Partnerin reagiert) Ja, klar, ich helfe dir. – Jetzt meine Bitte, Karte 3: Kannst du mir bitte deine Bohrmaschine leihen?",
                  "Danke. Und jetzt Ihre Karte 2.",
                  "(Partnerin reagiert) Kein Problem, ich nehme den Schlüssel. – Meine Bitte, Karte 4: Machst du bitte die Lampe an?",
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
      id: "sc-h0", title: "Beispiel – Im Möbelhaus", scenario: "shop",
      environment: { preset: "shop", ambienceLevel: 0.12, ambiencePrompt: "large furniture store, soft music, distant voices" },
      speakers: [{ id: "k", name: "Kundin", role: "Kundin", gender: "female" }, { id: "v", name: "Verkäufer", role: "Verkäufer", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "k", text: "Entschuldigung, wo finde ich Betten?" },
        { id: "t2", speakerId: "v", text: "Hier im Erdgeschoss haben wir nur Lampen. Die Betten sind im dritten Stock." },
        { id: "t3", speakerId: "k", text: "Im dritten Stock. Vielen Dank!", pauseAfterMs: 800 },
      ],
    },
    {
      id: "sc-h1", title: "Wohnungsbesichtigung", scenario: "accommodation",
      environment: { preset: "accommodation", ambienceLevel: 0.08, reverb: 0.25, ambiencePrompt: "empty apartment, footsteps on wooden floor" },
      speakers: [{ id: "v", name: "Herr Pohl", role: "Vermieter", gender: "male", age: "senior" }, { id: "a", name: "Frau Albrecht", role: "Interessentin", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "a", text: "Die Wohnung ist sehr schön. Wie hoch ist die Miete?" },
        { id: "t2", speakerId: "v", text: "Die Miete ist sechshundertzwanzig Euro. Dazu kommen sechzig Euro für Heizung und Wasser." },
        { id: "t3", speakerId: "a", text: "Also bezahle ich sechshundertachtzig Euro im Monat?" },
        { id: "t4", speakerId: "v", text: "Ja, genau. Sechshundertachtzig Euro.", pauseAfterMs: 800 },
      ],
    },
    {
      id: "sc-h2", title: "Hilfe beim Umzug", scenario: "family",
      environment: { preset: "family", ambienceLevel: 0.08 },
      speakers: [{ id: "p", name: "Paul", role: "Freund", gender: "male", age: "young" }, { id: "n", name: "Nina", role: "Freundin", gender: "female", age: "young" }],
      turns: [
        { id: "t1", speakerId: "p", text: "Nina, ich ziehe am Samstag um. Hast du Zeit?" },
        { id: "t2", speakerId: "n", text: "Am Samstag? Da besuche ich meine Eltern. Aber am Freitag habe ich frei." },
        { id: "t3", speakerId: "p", text: "Am Freitag geht es leider nicht. Ich habe den Wagen nur am Samstag." },
        { id: "t4", speakerId: "n", text: "Okay. Dann komme ich am Samstag am Vormittag. Am Sonntag fahre ich dann zu meinen Eltern.", pauseAfterMs: 800 },
      ],
    },
    {
      id: "sc-h3", title: "Beim Hausmeister", scenario: "accommodation",
      environment: { preset: "accommodation", ambienceLevel: 0.1, reverb: 0.3, ambiencePrompt: "stairwell of an apartment building, door closing far away" },
      speakers: [{ id: "m", name: "Frau Yilmaz", role: "Mieterin", gender: "female" }, { id: "h", name: "Herr Brandl", role: "Hausmeister", gender: "male", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "m", text: "Guten Tag, Herr Brandl. Bei mir ist etwas kaputt." },
        { id: "t2", speakerId: "h", text: "Wieder die Waschmaschine im Keller?" },
        { id: "t3", speakerId: "m", text: "Nein, die Waschmaschine geht. Das Licht im Flur ist auch okay. Aber meine Klingel geht nicht." },
        { id: "t4", speakerId: "h", text: "Die Klingel. Gut, ich komme heute Nachmittag.", pauseAfterMs: 800 },
      ],
    },
    {
      id: "sc-h4", title: "Die neue Nachbarin", scenario: "accommodation",
      environment: { preset: "street", ambienceLevel: 0.1, ambiencePrompt: "quiet residential street, birds, a car passing" },
      speakers: [{ id: "f", name: "Ana Ferreira", role: "Nachbarin", gender: "female", age: "young" }, { id: "m", name: "Herr Vogt", role: "Nachbar", gender: "male", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "f", text: "Guten Tag! Ich bin Ana Ferreira. Ich wohne jetzt hier, neben Ihnen." },
        { id: "t2", speakerId: "m", text: "Herzlich willkommen! Ich heiße Vogt. Kommen Sie aus Spanien?" },
        { id: "t3", speakerId: "f", text: "Nein, ich komme aus Portugal. Aber ich habe zwei Jahre in Spanien gearbeitet." },
        { id: "t4", speakerId: "m", text: "Ah, aus Portugal. Schön!", pauseAfterMs: 800 },
      ],
    },
    {
      id: "sc-h5", title: "Im Möbelgeschäft", scenario: "shop",
      environment: { preset: "shop", ambienceLevel: 0.12, ambiencePrompt: "furniture shop, quiet background music" },
      speakers: [{ id: "v", name: "Verkäuferin", role: "Verkäuferin", gender: "female" }, { id: "k", name: "Kunde", role: "Kunde", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "v", text: "Guten Tag. Suchen Sie ein Sofa?" },
        { id: "t2", speakerId: "k", text: "Nein, ein Sofa und einen Tisch habe ich schon. Ich brauche einen Schrank für das Schlafzimmer." },
        { id: "t3", speakerId: "v", text: "Dieser Schrank hier ist sehr groß. Er kostet hundertneunundneunzig Euro." },
        { id: "t4", speakerId: "k", text: "Gut, den nehme ich.", pauseAfterMs: 800 },
      ],
    },
    {
      id: "sc-h6", title: "Der neue Stadtteil", scenario: "street",
      environment: { preset: "street", ambienceLevel: 0.15, ambiencePrompt: "city street, light traffic, bicycle bell" },
      speakers: [{ id: "s", name: "Sabine", role: "Kollegin", gender: "female" }, { id: "l", name: "Lukas", role: "Kollege", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "s", text: "Lukas, du wohnst jetzt in Weststadt. Wie kommst du zur Arbeit? Mit der U-Bahn?" },
        { id: "t2", speakerId: "l", text: "Nein, in Weststadt gibt es keine U-Bahn. Es gibt einen Bus, aber er ist sehr langsam." },
        { id: "t3", speakerId: "l", text: "Ich fahre jetzt immer mit dem Fahrrad. Das sind nur zwanzig Minuten." },
        { id: "t4", speakerId: "s", text: "Super, das ist gesund!", pauseAfterMs: 800 },
      ],
    },
    {
      id: "sc-h00", title: "Beispiel – Durchsage im Baumarkt", scenario: "shop",
      environment: { preset: "shop", ambienceLevel: 0.15, publicAddress: true, reverb: 0.3, ambiencePrompt: "large DIY store hall, trolleys, distant drilling" },
      speakers: [{ id: "d", name: "Durchsage", role: "Baumarktdurchsage", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Kundinnen und Kunden! Heute sind alle Lampen zwanzig Prozent billiger. Sie finden die Lampen in Halle zwei.", pauseAfterMs: 1000 },
      ],
    },
    {
      id: "sc-h7", title: "Durchsage im Möbelhaus", scenario: "shop",
      environment: { preset: "shop", ambienceLevel: 0.15, publicAddress: true, reverb: 0.3 },
      speakers: [{ id: "d", name: "Durchsage", role: "Möbelhausdurchsage", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Kunden, unser Restaurant im ersten Stock ist heute leider geschlossen. Kaffee und Kuchen gibt es im Café im Erdgeschoss. Vielen Dank.", pauseAfterMs: 1000 },
      ],
    },
    {
      id: "sc-h8", title: "Durchsage in der U-Bahn", scenario: "railway_station",
      environment: { preset: "railway_station", ambienceLevel: 0.2, publicAddress: true, reverb: 0.4, ambiencePrompt: "underground station platform, train arriving far away" },
      speakers: [{ id: "d", name: "Durchsage", role: "U-Bahn-Ansage", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Achtung, liebe Fahrgäste! Die U-Bahn-Linie drei fährt heute nur bis Rosenplatz. Ab Rosenplatz nehmen Sie bitte den Bus sechsundvierzig.", pace: 0.95, pauseAfterMs: 1000 },
      ],
    },
    {
      id: "sc-h9", title: "Durchsage im Bürgeramt", scenario: "public_office",
      environment: { preset: "public_office", ambienceLevel: 0.12, publicAddress: true, reverb: 0.3, ambiencePrompt: "waiting room of a public office, quiet murmur, ticket machine beep" },
      speakers: [{ id: "d", name: "Durchsage", role: "Bürgeramt", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Eine Information für unsere Besucher: Das Bürgeramt schließt heute schon um vierzehn Uhr. Sie möchten Ihre neue Wohnung anmelden? Dann kommen Sie bitte morgen ab acht Uhr.", pauseAfterMs: 1000 },
      ],
    },
    {
      id: "sc-h10", title: "Durchsage beim Stadtteilfest", scenario: "street",
      environment: { preset: "street", ambienceLevel: 0.2, publicAddress: true, reverb: 0.2, ambiencePrompt: "open-air neighbourhood festival, children playing, light crowd" },
      speakers: [{ id: "d", name: "Durchsage", role: "Festansage", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Hallo, liebe Gäste vom Stadtteilfest! Das Konzert auf dem Marktplatz beginnt heute nicht um achtzehn Uhr. Es beginnt erst um neunzehn Uhr. Viel Spaß!", pauseAfterMs: 1000 },
      ],
    },
    {
      id: "sc-h11", title: "Nachricht von der Vermieterin", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "g", name: "Frau Gruber", role: "Vermieterin", gender: "female", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "g", text: "Hallo Herr Demir, hier ist Gruber. Sie möchten die Wohnung in der Ahornstraße sehen. Am Dienstag habe ich leider keine Zeit. Kommen Sie bitte am Mittwoch um siebzehn Uhr. Auf Wiederhören!", pauseAfterMs: 1200 },
      ],
    },
    {
      id: "sc-h12", title: "Nachricht von der Umzugsfirma", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "u", name: "Umzugsfirma", role: "Mitarbeiter", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "u", text: "Guten Tag, Frau Schuster, hier ist die Firma Umzug Schnell. Unser Wagen kommt am Donnerstag um acht Uhr. Die Kartons bringen wir am Montag. Bitte packen Sie dann Ihre Bücher in die Kartons. Danke!", pauseAfterMs: 1200 },
      ],
    },
    {
      id: "sc-h13", title: "Nachricht vom Nachbarn", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.05, telephoneFilter: true },
      speakers: [{ id: "j", name: "Jan", role: "Nachbar", gender: "male", age: "young" }],
      turns: [
        { id: "t1", speakerId: "j", text: "Hallo Mia, hier ist Jan von nebenan. Ich bin bis Sonntag in Berlin. Kannst du bitte meine Blumen gießen? Mein Schlüssel ist bei Frau Kraus im Erdgeschoss. Danke und tschüss!", pauseAfterMs: 1200 },
      ],
    },
    {
      id: "sc-h14", title: "Nachricht vom Hausmeister", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "h", name: "Herr Lorenz", role: "Hausmeister", gender: "male", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "h", text: "Guten Tag, hier ist Hausmeister Lorenz. Eine Information für alle Mieter: Am Freitag gibt es von neun bis zwölf Uhr kein Wasser im Haus. Ab zwölf Uhr ist alles wieder normal. Vielen Dank!", pauseAfterMs: 1200 },
      ],
    },
    {
      id: "sc-h15", title: "Nachricht vom Möbelgeschäft", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "m", name: "Möbel Sommer", role: "Verkäuferin", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "m", text: "Guten Tag, Herr Okafor, hier ist Möbel Sommer. Ihr Tisch ist da. Die Stühle kommen leider erst nächste Woche. Den Tisch können Sie ab morgen abholen. Auf Wiederhören!", pauseAfterMs: 1200 },
      ],
    },
  ],

  /* ==================================================================================== */
  /* ANSWER KEY                                                                           */
  /* ==================================================================================== */
  answerKey: {
    h1: { correct: ["a"], explanation: "Die Miete ist 620 Euro, dazu kommen 60 Euro für Heizung und Wasser: zusammen 680 Euro.", evidence: "Also bezahle ich sechshundertachtzig Euro im Monat? – Ja, genau." },
    h2: { correct: ["b"], explanation: "Paul hat den Wagen nur am Samstag. Nina kommt am Samstag am Vormittag.", evidence: "Dann komme ich am Samstag am Vormittag." },
    h3: { correct: ["c"], explanation: "Die Waschmaschine und das Licht im Flur gehen. Die Klingel ist kaputt.", evidence: "Aber meine Klingel geht nicht." },
    h4: { correct: ["a"], explanation: "Ana kommt aus Portugal. In Spanien hat sie nur gearbeitet.", evidence: "Nein, ich komme aus Portugal." },
    h5: { correct: ["c"], explanation: "Ein Sofa und einen Tisch hat der Mann schon. Er kauft einen Schrank.", evidence: "Ich brauche einen Schrank für das Schlafzimmer. … Gut, den nehme ich." },
    h6: { correct: ["b"], explanation: "Es gibt keine U-Bahn, der Bus ist langsam. Lukas fährt mit dem Fahrrad.", evidence: "Ich fahre jetzt immer mit dem Fahrrad." },
    h7: { correct: ["f"], explanation: "Das Restaurant im ersten Stock ist heute geschlossen.", evidence: "unser Restaurant im ersten Stock ist heute leider geschlossen" },
    h8: { correct: ["r"], explanation: "Die U-Bahn fährt nur bis Rosenplatz. Danach nehmen die Fahrgäste den Bus 46.", evidence: "Ab Rosenplatz nehmen Sie bitte den Bus sechsundvierzig." },
    h9: { correct: ["f"], explanation: "Das Bürgeramt schließt heute schon um 14 Uhr.", evidence: "Das Bürgeramt schließt heute schon um vierzehn Uhr." },
    h10: { correct: ["r"], explanation: "Das Konzert beginnt nicht um 18 Uhr, sondern erst um 19 Uhr.", evidence: "Es beginnt erst um neunzehn Uhr." },
    h11: { correct: ["b"], explanation: "Am Dienstag hat Frau Gruber keine Zeit. Herr Demir soll am Mittwoch um 17 Uhr kommen.", evidence: "Kommen Sie bitte am Mittwoch um siebzehn Uhr." },
    h12: { correct: ["c"], explanation: "Die Firma bringt die Kartons. Frau Schuster soll ihre Bücher einpacken.", evidence: "Bitte packen Sie dann Ihre Bücher in die Kartons." },
    h13: { correct: ["a"], explanation: "Der Schlüssel ist bei Frau Kraus im Erdgeschoss.", evidence: "Mein Schlüssel ist bei Frau Kraus im Erdgeschoss." },
    h14: { correct: ["b"], explanation: "Von 9 bis 12 Uhr gibt es kein Wasser. Ab 12 Uhr ist alles normal.", evidence: "von neun bis zwölf Uhr kein Wasser im Haus" },
    h15: { correct: ["c"], explanation: "Der Tisch ist da. Die Stühle kommen erst nächste Woche.", evidence: "Den Tisch können Sie ab morgen abholen." },
    l1: { correct: ["f"], explanation: "Die Nachbarn sollen Kuchen oder Salat mitbringen. Die Getränke kauft Familie Horvath.", evidence: "Die Getränke kaufen wir." },
    l2: { correct: ["r"], explanation: "Bei Regen ist das Fest im Keller.", evidence: "Bei Regen feiern wir im Keller." },
    l3: { correct: ["f"], explanation: "Familie Horvath wohnt im 2. Stock.", evidence: "Familie Horvath, 2. Stock" },
    l4: { correct: ["r"], explanation: "Der Hausmeister kommt heute um 16 Uhr und repariert die Dusche.", evidence: "Er repariert die Dusche." },
    l5: { correct: ["f"], explanation: "Der Schrank kommt erst morgen.", evidence: "Der neue Schrank für dein Zimmer kommt erst morgen." },
    l6: { correct: ["b"], explanation: "In Wohnung b sind Hunde kein Problem. In Wohnung a sind Haustiere nicht möglich.", evidence: "Hund oder Katze? Kein Problem!" },
    l7: { correct: ["a"], explanation: "Die Umzugshilfe trägt Möbel. Der Möbelmarkt verkauft nur Möbel.", evidence: "Wir tragen Ihre Möbel." },
    l8: { correct: ["b"], explanation: "Das gebrauchte Sofa kostet nur 80 Euro. Im Möbelhaus kosten Sofas ab 899 Euro.", evidence: "Nur 80 Euro!" },
    l9: { correct: ["a"], explanation: "Im Waschsalon kann man heute waschen. Bei Elektro Huber gibt es erst in zwei Wochen einen Termin.", evidence: "Wir sind jeden Tag von 7 bis 22 Uhr da." },
    l10: { correct: ["b"], explanation: "Im Nachbarschaftscafé lernt man neue Nachbarn kennen. Das Kino zeigt nur Filme.", evidence: "Neue Nachbarn sind herzlich willkommen!" },
    l11: { correct: ["f"], explanation: "Der Elternabend ist um 19 Uhr, also am Abend.", evidence: "Am Dienstag um 19 Uhr" },
    l12: { correct: ["r"], explanation: "Am Samstag ist die Post von 9 bis 12 Uhr geöffnet. Pakete gibt es an Schalter 2.", evidence: "Samstag: 9 bis 12 Uhr geöffnet." },
    l13: { correct: ["f"], explanation: "Der Aufzug zu Gleis 3 ist kaputt.", evidence: "Der Aufzug zu Gleis 3 ist kaputt." },
    l14: { correct: ["r"], explanation: "Das Gasthaus ist nur heute geschlossen. Ab morgen ist es wieder offen.", evidence: "Ab morgen sind wir wieder für Sie da!" },
    l15: { correct: ["f"], explanation: "Vom 3. bis 7. März hält der Bus nicht am Kirchweg, sondern in der Bergstraße.", evidence: "Vom 3. bis 7. März hält der Bus hier nicht." },
    s1: { correct: ["12.03.1994", "12.3.1994", "12. März 1994", "12.03.94", "12.3.94", "12. 3. 1994"], explanation: "Rafael ist am 12. März 1994 geboren." },
    s2: { correct: ["79102 Freiburg", "Freiburg 79102", "79102, Freiburg"], explanation: "Rafael wohnt in 79102 Freiburg." },
    s3: { correct: ["Koch", "Er ist Koch"], explanation: "Rafael ist Koch von Beruf." },
    s4: { correct: ["Filme", "Filme ausleihen", "DVDs", "Film"], explanation: "Rafael liest nicht viel. Er möchte Filme ausleihen." },
    s5: { correct: ["bar", "in bar", "Bargeld", "bar bezahlen", "Bar"], explanation: "Rafael bezahlt die Jahresgebühr bar." },
    s6: { correct: [], explanation: "Bewertet werden die drei Inhaltspunkte (je 0 / 1,5 / 3 Punkte) und die Textsorte mit Anrede und Gruß (0 / 0,5 / 1 Punkt)." },
    p1: { correct: [] },
    p2: { correct: [] },
    p3: { correct: [] },
  },
};
