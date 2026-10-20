import type { ExamContentInput } from "@/domain/exam/schema";

/**
 * telc A1 (Start Deutsch 1) — Übungstest 1 (original content).
 *
 * Theme: Familie und Freizeit (Geburtstag, Sportverein, Kino, Wochenende, Ausflug).
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

export const telcA1Mock1: ExamContentInput = {
  schemaVersion: 1,
  blueprintKey: "telc-a1-sd1",
  blueprintVersion: "2026.10.2",
  title: "telc A1 — Übungstest 1",
  themes: ["Familie", "Freizeit", "Geburtstag", "Sportverein", "Kino", "Wochenende", "Ausflug"],
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
            "Sie hören kurze Gespräche. Sie hören jeden Text zweimal. Kreuzen Sie an: a, b oder c. Hören Sie zuerst das Beispiel.",
          example: {
            prompt: "Wann hat Konstantins Bruder Geburtstag?",
            stimulusIds: ["h-a0"],
            options: [
              { id: "a", label: "a", text: "Am 4. Mai" },
              { id: "b", label: "b", text: "Am 14. Mai" },
              { id: "c", label: "c", text: "Am 24. Mai" },
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
            { id: "h1", number: 1, type: "mc", stimulusIds: ["h-a1"], prompt: "Wann sehen die Leute den Film?", options: [{ id: "a", label: "a", text: "Um 17:45 Uhr" }, { id: "b", label: "b", text: "Um 18:15 Uhr" }, { id: "c", label: "c", text: "Um 20:00 Uhr" }] },
            { id: "h2", number: 2, type: "mc", stimulusIds: ["h-a2"], prompt: "Wann hat Luca Fußballtraining?", options: [{ id: "a", label: "a", text: "Am Montag" }, { id: "b", label: "b", text: "Am Dienstag" }, { id: "c", label: "c", text: "Am Freitag" }] },
            { id: "h3", number: 3, type: "mc", stimulusIds: ["h-a3"], prompt: "Was schenkt Sophie ihrer Oma?", options: [{ id: "a", label: "a", text: "Blumen" }, { id: "b", label: "b", text: "Einen Kuchen" }, { id: "c", label: "c", text: "Ein Buch" }] },
            { id: "h4", number: 4, type: "mc", stimulusIds: ["h-a4"], prompt: "Wohin fährt die Familie am Sonntag?", options: [{ id: "a", label: "a", text: "An den See" }, { id: "b", label: "b", text: "In die Berge" }, { id: "c", label: "c", text: "In den Zoo" }] },
            { id: "h5", number: 5, type: "mc", stimulusIds: ["h-a5"], prompt: "Wie viel kostet die Karte für das Kind?", options: [{ id: "a", label: "a", text: "4 Euro" }, { id: "b", label: "b", text: "8 Euro" }, { id: "c", label: "c", text: "12 Euro" }] },
            { id: "h6", number: 6, type: "mc", stimulusIds: ["h-a6"], prompt: "Wann fahren Emma und Jan Fahrrad?", options: [{ id: "a", label: "a", text: "Um 10 Uhr" }, { id: "b", label: "b", text: "Um 15 Uhr" }, { id: "c", label: "c", text: "Um 12 Uhr" }] },
          ],
        },
        {
          partId: "hoeren-2",
          instructionsDe:
            "Sie hören Durchsagen. Sie hören jeden Text einmal. Kreuzen Sie an: Richtig oder Falsch. Hören Sie zuerst das Beispiel.",
          example: { prompt: "Der kleine Timo wartet im Erdgeschoss.", stimulusIds: ["h-b0"], options: RF, answer: "r" },
          stimuli: [
            { id: "h-b0", kind: "audio", title: "Beispiel", scriptId: "sc-h20", body: "" },
            { id: "h-a7", kind: "audio", title: "Durchsage 7", scriptId: "sc-h7", body: "" },
            { id: "h-a8", kind: "audio", title: "Durchsage 8", scriptId: "sc-h8", body: "" },
            { id: "h-a9", kind: "audio", title: "Durchsage 9", scriptId: "sc-h9", body: "" },
            { id: "h-a10", kind: "audio", title: "Durchsage 10", scriptId: "sc-h10", body: "" },
          ],
          items: [
            { id: "h7", number: 7, type: "true_false", stimulusIds: ["h-a7"], prompt: "Das Kinderbecken ist heute bis 19 Uhr offen.", options: RF },
            { id: "h8", number: 8, type: "true_false", stimulusIds: ["h-a8"], prompt: "Der Zug nach Bamberg fährt heute von Gleis 2.", options: RF },
            { id: "h9", number: 9, type: "true_false", stimulusIds: ["h-a9"], prompt: "Der Film in Saal 3 beginnt heute um 21 Uhr.", options: RF },
            { id: "h10", number: 10, type: "true_false", stimulusIds: ["h-a10"], prompt: "Die Kindershow ist heute um 15 Uhr.", options: RF },
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
            { id: "h11", number: 11, type: "mc", stimulusIds: ["h-a11"], prompt: "Was soll Lena kaufen?", options: [{ id: "a", label: "a", text: "Sahne" }, { id: "b", label: "b", text: "Kuchen" }, { id: "c", label: "c", text: "Kaffee" }] },
            { id: "h12", number: 12, type: "mc", stimulusIds: ["h-a12"], prompt: "Wann beginnt der Turnkurs?", options: [{ id: "a", label: "a", text: "Am 1. März" }, { id: "b", label: "b", text: "Am 3. März" }, { id: "c", label: "c", text: "Am 8. März" }] },
            { id: "h13", number: 13, type: "mc", stimulusIds: ["h-a13"], prompt: "Was möchte Malte?", options: [{ id: "a", label: "a", text: "Heute Abend ins Kino gehen" }, { id: "b", label: "b", text: "Am Donnerstag ins Kino gehen" }, { id: "c", label: "c", text: "Eine E-Mail von Tobias bekommen" }] },
            { id: "h14", number: 14, type: "mc", stimulusIds: ["h-a14"], prompt: "Wann soll Frau Lorenz am Busbahnhof sein?", options: [{ id: "a", label: "a", text: "Um 7:15 Uhr" }, { id: "b", label: "b", text: "Um 7:00 Uhr" }, { id: "c", label: "c", text: "Um 7:30 Uhr" }] },
            { id: "h15", number: 15, type: "mc", stimulusIds: ["h-a15"], prompt: "Wo ist die Geburtstagsparty?", options: [{ id: "a", label: "a", text: "Im Spielpark" }, { id: "b", label: "b", text: "Bei Finn zu Hause" }, { id: "c", label: "c", text: "Bei Ole zu Hause" }] },
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
          example: { prompt: "Ella hat am 12. Juni Geburtstag.", stimulusIds: ["l-t1"], options: RF, answer: "r" },
          stimuli: [
            {
              id: "l-t1",
              kind: "email",
              title: "Text 1",
              body:
                "**Von:** birgit.sommer@netzpost.de\n**An:** familie.oezdemir@netzpost.de\n**Betreff:** Ellas Geburtstag\n\nLiebe Familie Özdemir,\n\nunsere Tochter Ella wird am 12. Juni sieben Jahre alt. Wir feiern am Samstag, den 14. Juni. Die Party ist von 15 bis 18 Uhr in unserem Garten. Wir grillen und machen Spiele. Bei Regen feiern wir im Gemeindehaus in der Kirchstraße.\n\nKommt Aylin auch? Bitte antworten Sie bis Mittwoch.\n\nViele Grüße\nBirgit Sommer",
            },
            {
              id: "l-t2",
              kind: "note",
              title: "Text 2",
              body:
                "Hallo Noah,\n\nich bin mit Lisa beim Schwimmkurs. Wir sind um 17:30 Uhr wieder da. Dein Fußballtraining ist heute nicht um 16 Uhr. Es beginnt erst um 16:30 Uhr. Deine Sporttasche steht im Flur. Nimm bitte auch eine Flasche Wasser mit!\n\nBis später\nPapa",
            },
          ],
          items: [
            { id: "l1", number: 1, type: "true_false", stimulusIds: ["l-t1"], prompt: "Die Party beginnt um 18 Uhr.", options: RF },
            { id: "l2", number: 2, type: "true_false", stimulusIds: ["l-t1"], prompt: "Bei schlechtem Wetter feiern die Kinder in der Kirchstraße.", options: RF },
            { id: "l3", number: 3, type: "true_false", stimulusIds: ["l-t1"], prompt: "Familie Özdemir soll bis Mittwoch antworten.", options: RF },
            { id: "l4", number: 4, type: "true_false", stimulusIds: ["l-t2"], prompt: "Noahs Training beginnt heute um 16 Uhr.", options: RF },
            { id: "l5", number: 5, type: "true_false", stimulusIds: ["l-t2"], prompt: "Noahs Sporttasche ist im Flur.", options: RF },
          ],
        },
        {
          partId: "lesen-2",
          instructionsDe:
            "Lesen Sie die Aufgaben 6–10 und die Texte. Welche Anzeige ist interessant für Sie? Kreuzen Sie an: a oder b. Lesen Sie zuerst das Beispiel.",
          example: {
            prompt: "Sie möchten am Sonntag mit Ihren Kindern ins Kino gehen.",
            stimulusIds: ["l-ad0a", "l-ad0b"],
            options: AB,
            answer: "a",
          },
          stimuli: [
            { id: "l-ad0a", kind: "ad", label: "Beispiel a", body: "**Kinderkino im Filmhaus**\nJeden Sonntag um 11 Uhr\nFilme für Kinder ab 4 Jahren" },
            { id: "l-ad0b", kind: "ad", label: "Beispiel b", body: "**Lange Kinonacht**\nFreitag und Samstag ab 23 Uhr\nNur für Erwachsene" },
            { id: "l-ad6a", kind: "ad", label: "6 a", body: "**Tennisclub Grün-Weiß**\nTenniskurse für Erwachsene\nMontag und Mittwoch, 19–21 Uhr" },
            { id: "l-ad6b", kind: "ad", label: "6 b", body: "**Tennisschule Ass**\nKurse für Kinder von 6 bis 14 Jahren\nSamstag, 9–12 Uhr" },
            { id: "l-ad7a", kind: "ad", label: "7 a", body: "**Spielhaus Kunterbunt**\nKindergeburtstag bei uns!\nGroßer Raum für bis zu 20 Kinder, mit Spielen und Musik" },
            { id: "l-ad7b", kind: "ad", label: "7 b", body: "**Café Lindner**\nKaffee und Kuchen\nTische für 2 bis 6 Personen" },
            { id: "l-ad8a", kind: "ad", label: "8 a", body: "**Fahrrad-Center Klein**\nNeue Fahrräder ab 299 €\nMontag bis Freitag, 9–18 Uhr" },
            { id: "l-ad8b", kind: "ad", label: "8 b", body: "**Radverleih am See**\nFahrräder mieten – auch Kinderräder!\nSamstag und Sonntag, 9–18 Uhr" },
            { id: "l-ad9a", kind: "ad", label: "9 a", body: "**Babysitter Jakob, 19 Jahre**\nIch habe freitags und samstags am Abend Zeit.\nTel. 0151 3307 642" },
            { id: "l-ad9b", kind: "ad", label: "9 b", body: "**Studentin Marie, 21 Jahre**\nIch passe auf Ihre Kinder auf.\nMontag bis Freitag am Nachmittag.\nTel. 0172 5810 936" },
            { id: "l-ad10a", kind: "ad", label: "10 a", body: "**Tierpark Eichenwald**\nÜber 500 Tiere!\nErwachsene 14 €, Kinder 9 €" },
            { id: "l-ad10b", kind: "ad", label: "10 b", body: "**Bauernhof Lindenhof**\nKühe, Ziegen und Hühner sehen und füttern.\nEintritt frei!" },
          ],
          items: [
            { id: "l6", number: 6, type: "ab", stimulusIds: ["l-ad6a", "l-ad6b"], prompt: "Ihr Sohn ist zehn Jahre alt. Er möchte Tennis spielen lernen.", options: AB },
            { id: "l7", number: 7, type: "ab", stimulusIds: ["l-ad7a", "l-ad7b"], prompt: "Ihre Tochter hat Geburtstag. Sie brauchen einen Raum für 15 Kinder.", options: AB },
            { id: "l8", number: 8, type: "ab", stimulusIds: ["l-ad8a", "l-ad8b"], prompt: "Sie möchten am Wochenende mit der Familie Fahrrad fahren. Sie haben keine Fahrräder.", options: AB },
            { id: "l9", number: 9, type: "ab", stimulusIds: ["l-ad9a", "l-ad9b"], prompt: "Sie gehen am Samstagabend ins Theater. Sie brauchen einen Babysitter.", options: AB },
            { id: "l10", number: 10, type: "ab", stimulusIds: ["l-ad10a", "l-ad10b"], prompt: "Sie möchten mit Ihren Kindern Tiere sehen. Sie haben nur wenig Geld.", options: AB },
          ],
        },
        {
          partId: "lesen-3",
          instructionsDe: "Lesen Sie die Texte und die Aufgaben 11–15. Kreuzen Sie an: Richtig oder Falsch. Lesen Sie zuerst das Beispiel.",
          example: { prompt: "An der Schultür: Der Elternabend ist am Dienstag.", stimulusIds: ["l-s0"], options: RF, answer: "r" },
          stimuli: [
            { id: "l-s0", kind: "notice", label: "Beispiel", title: "An der Tür einer Grundschule", body: "**Grundschule am Park**\nElternabend Klasse 2b\nDienstag, 19 Uhr, Raum 12" },
            { id: "l-s11", kind: "notice", label: "11", title: "An der Post", body: "**Postfiliale Bergstraße**\nVom 3. bis 7. Mai geschlossen.\nIhre Pakete bekommen Sie im Kiosk am Rathausplatz." },
            { id: "l-s12", kind: "notice", label: "12", title: "Am Bahnhof", body: "**Fahrräder in der S-Bahn**\nMontag bis Freitag erst ab 9 Uhr.\nSamstag und Sonntag den ganzen Tag." },
            { id: "l-s13", kind: "notice", label: "13", title: "An einem Restaurant", body: "**Pizzeria Da Gino**\nJeden Mittwoch: Kinder bis 10 Jahre essen gratis!" },
            { id: "l-s14", kind: "notice", label: "14", title: "An der Bushaltestelle Sportplatz", body: "**Sonntag, 9. Juli: Stadtlauf**\nDie Linie 8 fährt an diesem Tag nicht.\nBitte nehmen Sie die Linie 3." },
            { id: "l-s15", kind: "notice", label: "15", title: "An der Tür einer Sporthalle", body: "**Bitte nur mit Hallenschuhen!**\nStraßenschuhe bitte hier ausziehen." },
          ],
          items: [
            { id: "l11", number: 11, type: "true_false", stimulusIds: ["l-s11"], prompt: "Vom 3. bis 7. Mai holen Sie Ihre Pakete am Rathausplatz ab.", options: RF },
            { id: "l12", number: 12, type: "true_false", stimulusIds: ["l-s12"], prompt: "Am Montag um 8 Uhr können Sie Ihr Fahrrad in die S-Bahn mitnehmen.", options: RF },
            { id: "l13", number: 13, type: "true_false", stimulusIds: ["l-s13"], prompt: "Am Mittwoch bezahlen Kinder bis 10 Jahre nichts.", options: RF },
            { id: "l14", number: 14, type: "true_false", stimulusIds: ["l-s14"], prompt: "Am 9. Juli fährt die Linie 8 wie immer.", options: RF },
            { id: "l15", number: 15, type: "true_false", stimulusIds: ["l-s15"], prompt: "In der Sporthalle darf man Straßenschuhe tragen.", options: RF },
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
            "Ihr Nachbar Marco Bianchi möchte seine Tochter Giulia in einem Schwimmkurs anmelden. Lesen Sie den Text. Schreiben Sie die fünf fehlenden Informationen in das Formular.",
          stimuli: [
            {
              id: "s-t1",
              kind: "text",
              title: "Giulia",
              body:
                "Giulia Bianchi ist sechs Jahre alt. Sie kann noch nicht schwimmen. Sie möchte den Kurs „Seepferdchen“ machen. Die Familie wohnt in der Ahornstraße 7 in 90402 Nürnberg. Herr Bianchi hat die Handynummer 0162 4471 380. Giulia hat am Mittwoch und am Freitag Zeit. Aber am Freitag hat sie Ballett.",
            },
            {
              id: "s-form",
              kind: "form",
              title: "Schwimmschule Delfin – Anmeldung Kinderkurs",
              body:
                "| Feld | Eintrag |\n| --- | --- |\n| Name, Vorname (Kind) | Bianchi, Giulia |\n| Alter | (1) |\n| Kind kann schwimmen (ja / nein) | (2) |\n| Kurs | Seepferdchen |\n| Name (Vater / Mutter) | Marco Bianchi |\n| Straße, Hausnummer | Ahornstraße 7 |\n| PLZ, Wohnort | (3) |\n| Telefon | (4) |\n| Kurstag | (5) |",
            },
          ],
          items: [
            { id: "s1", number: 1, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Alter", prompt: "(1) Alter" },
            { id: "s2", number: 2, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Kind kann schwimmen (ja / nein)", prompt: "(2) Kind kann schwimmen (ja / nein)" },
            { id: "s3", number: 3, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "PLZ, Wohnort", prompt: "(3) PLZ, Wohnort" },
            { id: "s4", number: 4, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Telefon", prompt: "(4) Telefon" },
            { id: "s5", number: 5, type: "short_text", stimulusIds: ["s-t1", "s-form"], fieldLabel: "Kurstag", prompt: "(5) Kurstag" },
          ],
        },
        {
          partId: "schreiben-2",
          instructionsDe:
            "Sie machen am Sonntag mit Ihrer Familie einen Ausflug. Ihr Freund Daniel soll mitkommen. Schreiben Sie Daniel eine E-Mail.",
          stimuli: [],
          items: [
            {
              id: "s6",
              number: 6,
              type: "writing",
              prompt: "E-Mail an Daniel",
              writing: {
                taskDe:
                  "Schreiben Sie zu jedem Punkt ein bis zwei Sätze (circa 30 Wörter). Schreiben Sie auch eine Anrede und einen Gruß.",
                leitpunkte: ["Wohin fahren Sie?", "Wann fahren Sie los?", "Was soll Daniel mitbringen?"],
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
                  "Stellen Sie sich mit den Stichwörtern vor. Buchstabieren Sie danach Ihren Vornamen und nennen Sie Ihre Postleitzahl.",
                cards: [{ title: "Stichwörter", body: "Name? Alter? Land? Wohnort? Sprachen? Beruf? Hobby?" }],
                partnerTurns: [
                  "Hallo und herzlich willkommen. Bitte erzählen Sie etwas über sich.",
                  "Vielen Dank. Wie schreibt man Ihren Vornamen? Bitte buchstabieren Sie.",
                  "Gut. Und wie ist Ihre Postleitzahl?",
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
            "Sie bekommen zwei Karten mit einem Thema und einem Wort. Stellen Sie eine Frage zu Ihrer Karte. Ihre Partnerin / Ihr Partner antwortet. Runde 1: Thema „Freizeit“. Runde 2: Thema „Familie“.",
          stimuli: [
            { id: "p-c2-f1", kind: "card", label: "Freizeit 1", title: "Thema: Freizeit", body: "**Sport**" },
            { id: "p-c2-f2", kind: "card", label: "Freizeit 2", title: "Thema: Freizeit", body: "**Kino**" },
            { id: "p-c2-f3", kind: "card", label: "Freizeit 3", title: "Thema: Freizeit", body: "**Samstag**" },
            { id: "p-c2-f4", kind: "card", label: "Freizeit 4", title: "Thema: Freizeit", body: "**Musik**" },
            { id: "p-c2-f5", kind: "card", label: "Freizeit 5", title: "Thema: Freizeit", body: "**Urlaub**" },
            { id: "p-c2-f6", kind: "card", label: "Freizeit 6", title: "Thema: Freizeit", body: "**Freunde**" },
            { id: "p-c2-m1", kind: "card", label: "Familie 1", title: "Thema: Familie", body: "**Geschwister**" },
            { id: "p-c2-m2", kind: "card", label: "Familie 2", title: "Thema: Familie", body: "**Geburtstag**" },
            { id: "p-c2-m3", kind: "card", label: "Familie 3", title: "Thema: Familie", body: "**Kinder**" },
            { id: "p-c2-m4", kind: "card", label: "Familie 4", title: "Thema: Familie", body: "**Eltern**" },
            { id: "p-c2-m5", kind: "card", label: "Familie 5", title: "Thema: Familie", body: "**Großeltern**" },
            { id: "p-c2-m6", kind: "card", label: "Familie 6", title: "Thema: Familie", body: "**Haustier**" },
          ],
          items: [
            {
              id: "p2",
              number: 2,
              type: "speaking",
              stimulusIds: ["p-c2-f1", "p-c2-f2", "p-c2-f3", "p-c2-f4", "p-c2-f5", "p-c2-f6", "p-c2-m1", "p-c2-m2", "p-c2-m3", "p-c2-m4", "p-c2-m5", "p-c2-m6"],
              prompt: "Um Informationen bitten und Informationen geben",
              speaking: {
                taskDe:
                  "Sie ziehen zu jedem Thema eine Karte. Stellen Sie mit jeder Karte eine Frage. Antworten Sie auch auf die zwei Fragen Ihrer Partnerin / Ihres Partners.",
                cards: [
                  { title: "Thema: Freizeit", body: "Kino" },
                  { title: "Thema: Familie", body: "Geschwister" },
                ],
                partnerTurns: [
                  "Wir beginnen mit dem Thema Freizeit. Ihre Karte heißt: Kino. Bitte fragen Sie.",
                  "(Partner antwortet) Ich gehe einmal im Monat ins Kino. Ich mag lustige Filme. – Jetzt frage ich: Machst du gern Sport?",
                  "Danke. Jetzt das Thema Familie. Ihre Karte heißt: Geschwister.",
                  "(Partner antwortet) Ja, ich habe eine Schwester. Sie heißt Nadia. – Meine Frage: Wann hast du Geburtstag?",
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
            { id: "p-c3a", kind: "card", label: "Karte 1", title: "Handlungskarte", body: "Bild: ein Fahrradhelm", imageAlt: "Ein Fahrradhelm für Kinder" },
            { id: "p-c3b", kind: "card", label: "Karte 2", title: "Handlungskarte", body: "Bild: ein Fotoapparat", imageAlt: "Ein Fotoapparat" },
            { id: "p-c3c", kind: "card", label: "Karte 3", title: "Handlungskarte", body: "Bild: ein Ball", imageAlt: "Ein Fußball" },
            { id: "p-c3d", kind: "card", label: "Karte 4", title: "Handlungskarte", body: "Bild: eine Uhr", imageAlt: "Eine Armbanduhr" },
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
                  "Formulieren Sie zu jeder Karte eine Bitte. Reagieren Sie auch auf zwei Bitten Ihrer Partnerin / Ihres Partners.",
                cards: [
                  { title: "Karte 1", body: "Bild: ein Fahrradhelm" },
                  { title: "Karte 2", body: "Bild: ein Fotoapparat" },
                ],
                partnerTurns: [
                  "Bitte formulieren Sie eine Bitte zu Karte 1.",
                  "(Partner reagiert) Ja, klar, ich habe zwei Helme. – Jetzt meine Bitte: Spielst du am Sonntag mit uns Fußball?",
                  "Danke. Jetzt bitte Ihre Karte 2.",
                  "(Partner reagiert) Gern, ich mache ein Foto von euch. – Meine Bitte: Wie spät ist es, bitte?",
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
      id: "sc-h0", title: "Beispiel – Auf dem Schulhof", scenario: "family",
      environment: { preset: "street", ambienceLevel: 0.1, ambiencePrompt: "schoolyard, distant children playing" },
      speakers: [{ id: "k", name: "Konstantin", role: "Schüler", gender: "male", age: "young" }, { id: "s", name: "Selin", role: "Freundin", gender: "female", age: "young" }],
      turns: [
        { id: "t1", speakerId: "s", text: "Konstantin, wann hat dein Bruder Geburtstag?" },
        { id: "t2", speakerId: "k", text: "Am vierzehnten Mai. Er wird zwölf." },
        { id: "t3", speakerId: "s", text: "Am vierzehnten? Das ist ja bald!", pauseAfterMs: 600 },
      ],
    },
    {
      id: "sc-h1", title: "An der Kinokasse", scenario: "shop",
      environment: { preset: "shop", ambienceLevel: 0.12, ambiencePrompt: "cinema foyer, popcorn machine, quiet voices" },
      speakers: [{ id: "m", name: "Kunde", role: "Kunde", gender: "male" }, { id: "f", name: "Kassiererin", role: "Kino", gender: "female", age: "young" }],
      turns: [
        { id: "t1", speakerId: "m", text: "Guten Abend. Zwei Karten für den Film um Viertel nach sechs, bitte." },
        { id: "t2", speakerId: "f", text: "Tut mir leid, um Viertel nach sechs ist alles voll. Aber um acht Uhr gibt es noch Plätze." },
        { id: "t3", speakerId: "m", text: "Um acht? Gut, dann nehmen wir die Karten um acht Uhr." },
        { id: "t4", speakerId: "f", text: "Zwei Karten für zwanzig Uhr. Das macht achtzehn Euro.", pauseAfterMs: 600 },
      ],
    },
    {
      id: "sc-h2", title: "Im Sportverein", scenario: "education",
      environment: { preset: "education", ambienceLevel: 0.15, reverb: 0.25, ambiencePrompt: "sports hall, balls bouncing in the distance" },
      speakers: [{ id: "m", name: "Mutter", role: "Mutter", gender: "female" }, { id: "t", name: "Trainer", role: "Trainer", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "m", text: "Hallo. Mein Sohn Luca ist acht. Er möchte Fußball spielen. Wann ist das Training für ihn?" },
        { id: "t2", speakerId: "t", text: "Am Montag trainieren die Großen, ab zwölf Jahren. Die Kleinen kommen am Dienstag." },
        { id: "t3", speakerId: "m", text: "Und am Freitag?" },
        { id: "t4", speakerId: "t", text: "Am Freitag haben wir kein Training. Luca kommt also am Dienstag.", pauseAfterMs: 600 },
      ],
    },
    {
      id: "sc-h3", title: "Ein Geschenk für Oma", scenario: "family",
      environment: { preset: "family", ambienceLevel: 0.05 },
      speakers: [{ id: "v", name: "Vater", role: "Vater", gender: "male" }, { id: "s", name: "Sophie", role: "Tochter", gender: "female", age: "young" }],
      turns: [
        { id: "t1", speakerId: "v", text: "Sophie, was schenkst du Oma zum Geburtstag? Blumen?" },
        { id: "t2", speakerId: "s", text: "Blumen hat Oma doch viele im Garten. Sie liest so gern. Ich kaufe ihr ein Buch." },
        { id: "t3", speakerId: "v", text: "Schöne Idee. Und ich backe einen Kuchen.", pauseAfterMs: 600 },
      ],
    },
    {
      id: "sc-h4", title: "Pläne für Sonntag", scenario: "family",
      environment: { preset: "family", ambienceLevel: 0.05 },
      speakers: [{ id: "j", name: "Jonas", role: "Sohn", gender: "male", age: "child" }, { id: "m", name: "Mutter", role: "Mutter", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "j", text: "Mama, fahren wir am Sonntag in den Zoo?" },
        { id: "t2", speakerId: "m", text: "Im Zoo waren wir doch letzten Monat. Am Sonntag wird es warm. Wir fahren an den See." },
        { id: "t3", speakerId: "j", text: "Super! Dann nehme ich meine Badehose mit.", pauseAfterMs: 600 },
      ],
    },
    {
      id: "sc-h5", title: "Im Freizeitbad", scenario: "shop",
      environment: { preset: "shop", ambienceLevel: 0.15, reverb: 0.3, ambiencePrompt: "indoor swimming pool entrance, water splashing" },
      speakers: [{ id: "f", name: "Frau", role: "Kundin", gender: "female" }, { id: "k", name: "Kassierer", role: "Kasse", gender: "male", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "f", text: "Guten Tag. Eine Karte für mich und eine für meine Tochter, bitte." },
        { id: "t2", speakerId: "k", text: "Erwachsene bezahlen acht Euro. Kinder bezahlen die Hälfte." },
        { id: "t3", speakerId: "f", text: "Also vier Euro für meine Tochter?" },
        { id: "t4", speakerId: "k", text: "Genau. Zusammen sind das zwölf Euro.", pauseAfterMs: 600 },
      ],
    },
    {
      id: "sc-h6", title: "Fahrrad fahren am Samstag", scenario: "street",
      environment: { preset: "street", ambienceLevel: 0.12, ambiencePrompt: "quiet residential street, birds" },
      speakers: [{ id: "e", name: "Emma", role: "Freundin", gender: "female", age: "young" }, { id: "j", name: "Jan", role: "Freund", gender: "male", age: "young" }],
      turns: [
        { id: "t1", speakerId: "e", text: "Jan, fahren wir am Samstag Fahrrad? Um zehn Uhr?" },
        { id: "t2", speakerId: "j", text: "Um zehn habe ich Tennis. Geht es um zwölf?" },
        { id: "t3", speakerId: "e", text: "Um zwölf essen wir bei meiner Oma. Und um drei?" },
        { id: "t4", speakerId: "j", text: "Ja, um drei Uhr ist gut. Bis Samstag!", pauseAfterMs: 600 },
      ],
    },
    {
      id: "sc-h20", title: "Beispiel – Durchsage im Kaufhaus", scenario: "shop",
      environment: { preset: "shop", ambienceLevel: 0.12, publicAddress: true, reverb: 0.25 },
      speakers: [{ id: "d", name: "Durchsage", role: "Kaufhausdurchsage", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Kundinnen und Kunden. Der kleine Timo sucht seine Mama. Er ist fünf Jahre alt. Timo wartet an der Information im Erdgeschoss.", pace: 0.95, pauseAfterMs: 800 },
      ],
    },
    {
      id: "sc-h7", title: "Durchsage im Schwimmbad", scenario: "other",
      environment: { preset: "other", ambienceLevel: 0.15, publicAddress: true, reverb: 0.35, ambiencePrompt: "indoor swimming pool hall, children splashing" },
      speakers: [{ id: "d", name: "Durchsage", role: "Bademeister", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Badegäste! Das große Becken ist heute ab sechzehn Uhr geschlossen. Das Kinderbecken bleibt bis neunzehn Uhr offen. Vielen Dank.", pace: 0.95, pauseAfterMs: 800 },
      ],
    },
    {
      id: "sc-h8", title: "Durchsage am Bahnhof", scenario: "railway_station",
      environment: { preset: "railway_station", ambienceLevel: 0.18, publicAddress: true, reverb: 0.35, ambiencePrompt: "railway platform, distant train" },
      speakers: [{ id: "d", name: "Durchsage", role: "Bahnhofsansage", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Achtung, bitte. Der Regionalzug nach Bamberg fährt heute nicht von Gleis zwei. Er fährt von Gleis fünf. Abfahrt neun Uhr zwölf.", pace: 0.95, pauseAfterMs: 800 },
      ],
    },
    {
      id: "sc-h9", title: "Durchsage im Kino", scenario: "other",
      environment: { preset: "other", ambienceLevel: 0.1, publicAddress: true, reverb: 0.25, ambiencePrompt: "cinema foyer, soft crowd" },
      speakers: [{ id: "d", name: "Durchsage", role: "Kinodurchsage", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Gäste! Der Film in Saal drei beginnt heute zwanzig Minuten später. Er beginnt um einundzwanzig Uhr. Wir bitten um Entschuldigung.", pace: 0.95, pauseAfterMs: 800 },
      ],
    },
    {
      id: "sc-h10", title: "Durchsage im Freizeitpark", scenario: "other",
      environment: { preset: "other", ambienceLevel: 0.2, publicAddress: true, reverb: 0.3, ambiencePrompt: "outdoor amusement park, distant music" },
      speakers: [{ id: "d", name: "Durchsage", role: "Parkdurchsage", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Liebe Besucher! Die Kindershow um fünfzehn Uhr fällt heute leider aus. Morgen ist die Show wieder um fünfzehn Uhr.", pace: 0.95, pauseAfterMs: 800 },
      ],
    },
    {
      id: "sc-h11", title: "Nachricht von Oma", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.05, telephoneFilter: true },
      speakers: [{ id: "o", name: "Oma", role: "Großmutter", gender: "female", age: "senior" }],
      turns: [
        { id: "t1", speakerId: "o", text: "Hallo Lena, hier ist Oma. Am Sonntag komme ich zum Kaffee. Ich bringe einen Apfelkuchen mit. Kannst du bitte Sahne kaufen? Bis Sonntag!", pauseAfterMs: 1000 },
      ],
    },
    {
      id: "sc-h12", title: "Nachricht vom Turnverein", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "c", name: "Carla Weiß", role: "Turnverein", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "c", text: "Guten Tag, Herr Demir. Hier ist Carla Weiß vom Turnverein Blau-Weiß. Der Kurs für Ihre Tochter beginnt nicht am ersten März. Er beginnt am achten März. Bitte bringen Sie Turnschuhe mit. Danke!", pauseAfterMs: 1000 },
      ],
    },
    {
      id: "sc-h13", title: "Nachricht von Malte", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.05, telephoneFilter: true },
      speakers: [{ id: "m", name: "Malte", role: "Freund", gender: "male", age: "young" }],
      turns: [
        { id: "t1", speakerId: "m", text: "Hi Tobias, hier ist Malte. Das Kino heute Abend geht leider nicht. Ich bin krank. Gehen wir am Donnerstag ins Kino? Ruf mich bitte an!", pauseAfterMs: 1000 },
      ],
    },
    {
      id: "sc-h14", title: "Nachricht vom Reisebüro", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.03, telephoneFilter: true },
      speakers: [{ id: "r", name: "Reisebüro", role: "Mitarbeiter", gender: "male" }],
      turns: [
        { id: "t1", speakerId: "r", text: "Guten Tag, Frau Lorenz. Hier ist das Reisebüro Sonnenweg. Ihr Ausflug nach Heidelberg ist am Samstag. Der Bus fährt um sieben Uhr dreißig am Busbahnhof ab. Bitte seien Sie schon um Viertel nach sieben da. Auf Wiederhören!", pauseAfterMs: 1000 },
      ],
    },
    {
      id: "sc-h15", title: "Nachricht von Dana", scenario: "telephone",
      environment: { preset: "telephone", ambienceLevel: 0.05, telephoneFilter: true },
      speakers: [{ id: "d", name: "Dana", role: "Mutter", gender: "female" }],
      turns: [
        { id: "t1", speakerId: "d", text: "Hallo Schatz, ich bin's, Dana. Finn geht am Samstag zu Oles Geburtstag. Die Party ist nicht im Spielpark. Sie ist bei Ole zu Hause, im Gartenweg neunzehn. Wir holen Finn um sechs Uhr ab. Tschüss!", pauseAfterMs: 1000 },
      ],
    },
  ],

  /* ==================================================================================== */
  /* ANSWER KEY                                                                           */
  /* ==================================================================================== */
  answerKey: {
    h1: { correct: ["c"], explanation: "Um Viertel nach sechs (18:15 Uhr) ist alles voll. Sie nehmen Karten für acht Uhr, also 20:00 Uhr.", evidence: "Zwei Karten für zwanzig Uhr." },
    h2: { correct: ["b"], explanation: "Luca ist acht. Die Kleinen trainieren am Dienstag. Am Montag trainieren die Großen, am Freitag gibt es kein Training.", evidence: "Luca kommt also am Dienstag." },
    h3: { correct: ["c"], explanation: "Oma hat viele Blumen im Garten. Sophie kauft ein Buch. Den Kuchen backt der Vater.", evidence: "Ich kaufe ihr ein Buch." },
    h4: { correct: ["a"], explanation: "Im Zoo waren sie letzten Monat. Am Sonntag fahren sie an den See.", evidence: "Wir fahren an den See." },
    h5: { correct: ["a"], explanation: "Erwachsene bezahlen 8 Euro, Kinder die Hälfte: 4 Euro. 12 Euro ist der Preis für beide zusammen.", evidence: "Also vier Euro für meine Tochter? – Genau." },
    h6: { correct: ["b"], explanation: "Um 10 Uhr hat Jan Tennis, um 12 Uhr isst Emma bei ihrer Oma. Sie fahren um drei Uhr, also um 15 Uhr.", evidence: "Ja, um drei Uhr ist gut." },
    h7: { correct: ["r"], explanation: "Das große Becken schließt um 16 Uhr. Das Kinderbecken bleibt bis 19 Uhr offen.", evidence: "Das Kinderbecken bleibt bis neunzehn Uhr offen." },
    h8: { correct: ["f"], explanation: "Der Zug fährt heute nicht von Gleis 2, sondern von Gleis 5.", evidence: "Er fährt von Gleis fünf." },
    h9: { correct: ["r"], explanation: "Der Film beginnt heute zwanzig Minuten später, um 21 Uhr.", evidence: "Er beginnt um einundzwanzig Uhr." },
    h10: { correct: ["f"], explanation: "Die Kindershow fällt heute aus. Erst morgen ist sie wieder um 15 Uhr.", evidence: "Die Kindershow um fünfzehn Uhr fällt heute leider aus." },
    h11: { correct: ["a"], explanation: "Oma bringt den Kuchen mit. Lena soll Sahne kaufen.", evidence: "Kannst du bitte Sahne kaufen?" },
    h12: { correct: ["c"], explanation: "Der Kurs beginnt nicht am 1. März, sondern am 8. März.", evidence: "Er beginnt am achten März." },
    h13: { correct: ["b"], explanation: "Malte ist heute krank. Er möchte am Donnerstag ins Kino gehen. Tobias soll anrufen, nicht schreiben.", evidence: "Gehen wir am Donnerstag ins Kino?" },
    h14: { correct: ["a"], explanation: "Der Bus fährt um 7:30 Uhr. Frau Lorenz soll schon um Viertel nach sieben (7:15 Uhr) da sein.", evidence: "Bitte seien Sie schon um Viertel nach sieben da." },
    h15: { correct: ["c"], explanation: "Die Party ist nicht im Spielpark, sondern bei Ole zu Hause.", evidence: "Sie ist bei Ole zu Hause, im Gartenweg neunzehn." },
    l1: { correct: ["f"], explanation: "Die Party ist von 15 bis 18 Uhr. Sie beginnt um 15 Uhr und endet um 18 Uhr.", evidence: "Die Party ist von 15 bis 18 Uhr in unserem Garten." },
    l2: { correct: ["r"], explanation: "Bei Regen feiern sie im Gemeindehaus in der Kirchstraße.", evidence: "Bei Regen feiern wir im Gemeindehaus in der Kirchstraße." },
    l3: { correct: ["r"], explanation: "Frau Sommer bittet um eine Antwort bis Mittwoch.", evidence: "Bitte antworten Sie bis Mittwoch." },
    l4: { correct: ["f"], explanation: "Das Training ist heute nicht um 16 Uhr. Es beginnt erst um 16:30 Uhr.", evidence: "Es beginnt erst um 16:30 Uhr." },
    l5: { correct: ["r"], explanation: "Papa schreibt: Die Sporttasche steht im Flur.", evidence: "Deine Sporttasche steht im Flur." },
    l6: { correct: ["b"], explanation: "Die Tennisschule Ass hat Kurse für Kinder von 6 bis 14 Jahren. Der Tennisclub hat nur Kurse für Erwachsene.", evidence: "Kurse für Kinder von 6 bis 14 Jahren" },
    l7: { correct: ["a"], explanation: "Das Spielhaus hat einen Raum für bis zu 20 Kinder. Im Café gibt es nur Tische für 2 bis 6 Personen.", evidence: "Großer Raum für bis zu 20 Kinder" },
    l8: { correct: ["b"], explanation: "Beim Radverleih kann man am Wochenende Fahrräder mieten. Das Fahrrad-Center verkauft neue Fahrräder und ist am Wochenende geschlossen.", evidence: "Fahrräder mieten – auch Kinderräder! Samstag und Sonntag" },
    l9: { correct: ["a"], explanation: "Jakob hat samstags am Abend Zeit. Marie hat nur Montag bis Freitag am Nachmittag Zeit.", evidence: "Ich habe freitags und samstags am Abend Zeit." },
    l10: { correct: ["b"], explanation: "Auf dem Bauernhof ist der Eintritt frei. Der Tierpark kostet Geld.", evidence: "Eintritt frei!" },
    l11: { correct: ["r"], explanation: "Die Post ist vom 3. bis 7. Mai geschlossen. Die Pakete bekommt man im Kiosk am Rathausplatz.", evidence: "Ihre Pakete bekommen Sie im Kiosk am Rathausplatz." },
    l12: { correct: ["f"], explanation: "Von Montag bis Freitag darf man Fahrräder erst ab 9 Uhr mitnehmen.", evidence: "Montag bis Freitag erst ab 9 Uhr." },
    l13: { correct: ["r"], explanation: "Am Mittwoch essen Kinder bis 10 Jahre gratis.", evidence: "Jeden Mittwoch: Kinder bis 10 Jahre essen gratis!" },
    l14: { correct: ["f"], explanation: "Am 9. Juli ist ein Stadtlauf. Die Linie 8 fährt an diesem Tag nicht.", evidence: "Die Linie 8 fährt an diesem Tag nicht." },
    l15: { correct: ["f"], explanation: "In der Sporthalle sind nur Hallenschuhe erlaubt. Straßenschuhe soll man ausziehen.", evidence: "Straßenschuhe bitte hier ausziehen." },
    s1: { correct: ["6", "6 Jahre", "sechs", "sechs Jahre", "6 Jahre alt", "sechs Jahre alt"], explanation: "Giulia ist sechs Jahre alt.", evidence: "Giulia Bianchi ist sechs Jahre alt." },
    s2: { correct: ["nein", "Nein", "nein, noch nicht", "noch nicht", "kann nicht schwimmen", "Sie kann noch nicht schwimmen.", "Nichtschwimmerin"], explanation: "Giulia kann noch nicht schwimmen.", evidence: "Sie kann noch nicht schwimmen." },
    s3: { correct: ["90402 Nürnberg", "Nürnberg 90402", "90402 Nuernberg", "90402, Nürnberg"], explanation: "Die Familie wohnt in 90402 Nürnberg.", evidence: "in 90402 Nürnberg" },
    s4: { correct: ["0162 4471 380", "01624471380", "0162 4471380", "0162/4471380", "0162-4471380"], explanation: "Die Handynummer von Herrn Bianchi ist 0162 4471 380.", evidence: "Herr Bianchi hat die Handynummer 0162 4471 380." },
    s5: { correct: ["Mittwoch", "mittwochs", "am Mittwoch", "Mi"], explanation: "Giulia hat am Mittwoch und Freitag Zeit, aber am Freitag hat sie Ballett. Also: Mittwoch.", evidence: "Aber am Freitag hat sie Ballett." },
    s6: { correct: [], explanation: "Bewertet werden die drei Inhaltspunkte (je 0 / 1,5 / 3 Punkte) und die kommunikative Gestaltung mit Anrede und Gruß (0 / 0,5 / 1 Punkt)." },
    p1: { correct: [] },
    p2: { correct: [] },
    p3: { correct: [] },
  },
};
