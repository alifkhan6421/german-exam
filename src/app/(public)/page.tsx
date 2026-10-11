import { ArrowRight, AudioLines, BookOpenCheck, Clock, Columns2, Mic, PenLine, ShieldCheck } from "lucide-react";
import { BLUEPRINTS } from "@/domain/blueprints";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/layout/disclaimer";

const features = [
  { icon: Columns2, title: "A real exam desk", text: "Exam paper on the left, answer sheet on the right, server-backed timer and autosave. On phones you switch between paper and answer sheet." },
  { icon: AudioLines, title: "Listening that sounds like Germany", text: "Station announcements, phone messages, shops and offices, produced with natural German voices and subtle, intelligible ambience." },
  { icon: Clock, title: "The official rhythm", text: "Each track follows its own blueprint: module order, time limits, playback counts and scoring. Goethe and telc are never mixed." },
  { icon: PenLine, title: "Writing feedback", text: "Rubric-based feedback on task fulfilment, grammar, vocabulary and register, with your original text kept intact. AI feedback is always marked as an estimate." },
  { icon: Mic, title: "Speaking practice", text: "Record your answers with preparation and speaking countdowns, and practise interactive parts with a clearly labelled AI partner." },
  { icon: BookOpenCheck, title: "Review every answer", text: "See your answer, the correct answer and why — then follow recommendations for the skills that need work." },
];

export default function LandingPage() {
  const goethe = BLUEPRINTS.filter((b) => b.provider === "goethe");
  const telc = BLUEPRINTS.filter((b) => b.provider === "telc");
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-brand-50/60 to-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="flex flex-col gap-6">
            <Badge tone="brand" className="w-fit">Goethe & telc · A1 – B2</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              Walk into your German exam knowing exactly what to expect.
            </h1>
            <p className="max-w-xl text-lg text-ink-600">
              Full-length mock exams built on the published format of each certificate, with realistic listening, timed modules,
              and feedback on your writing and speaking.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/register" size="lg">Take a free mock exam <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href="/pricing" size="lg" variant="secondary">See plans</ButtonLink>
            </div>
            <p className="text-sm text-ink-500">Free account includes the complete Goethe A1 Übungstest 1. No card required.</p>
          </div>
          <div aria-hidden className="hidden lg:block">
            <div className="rounded-2xl border border-ink-200 bg-white p-3 shadow-xl shadow-ink-900/5">
              <div className="flex items-center justify-between rounded-lg bg-ink-900 px-4 py-2 text-xs text-white">
                <span>Goethe A1 · Lesen</span>
                <span className="font-mono">18:42</span>
              </div>
              <div className="grid grid-cols-[1.3fr_1fr] gap-3 pt-3">
                <div className="paper rounded-lg border border-paper-line p-4 text-[13px] leading-relaxed text-ink-800">
                  <p className="mb-2 font-semibold">Text 1</p>
                  <p>Liebe Julia, am Samstag habe ich Geburtstag und ich mache eine kleine Party. Die Party beginnt um 19 Uhr …</p>
                  <div className="mt-4 rounded border border-paper-line bg-white p-2 text-xs">
                    <strong>Hallenbad Nord</strong><br />Montag: geschlossen<br />Di–Fr: 7–21 Uhr
                  </div>
                </div>
                <div className="flex flex-col gap-2 rounded-lg border border-ink-200 p-3 text-xs">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="flex items-center justify-between rounded-md bg-ink-50 px-2 py-1.5">
                      <span className="font-medium">{n}</span>
                      <span className="flex gap-1">
                        <span className={`rounded px-2 py-0.5 ${n % 2 ? "bg-brand-600 text-white" : "bg-white ring-1 ring-ink-200"}`}>Richtig</span>
                        <span className={`rounded px-2 py-0.5 ${n % 2 ? "bg-white ring-1 ring-ink-200" : "bg-brand-600 text-white"}`}>Falsch</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="exams" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Two providers, eight exams, each with its own format</h2>
        <p className="mt-2 max-w-2xl text-ink-600">
          Goethe and telc exams at the same level are different exams. Every mock test here is built on a versioned blueprint of
          its certificate, with sources and verification dates.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            { name: "Goethe exam preparation", tone: "goethe" as const, list: goethe, text: "Goethe-Zertifikat A1 Start Deutsch 1, A2, B1 and B2 for adults: modular B1/B2, separate Lesen, Hören, Schreiben and Sprechen modules." },
            { name: "telc exam preparation", tone: "telc" as const, list: telc, text: "Start Deutsch 1 and 2, Zertifikat Deutsch / telc Deutsch B1 and telc Deutsch B2, including Sprachbausteine at B1 and B2." },
          ].map((p) => (
            <div key={p.name} className={`rounded-2xl border p-6 ${p.tone === "goethe" ? "border-emerald-200 bg-goethe-50/50" : "border-violet-200 bg-telc-50/50"}`}>
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-ink-600">{p.text}</p>
              <ul className="mt-4 divide-y divide-ink-100 rounded-xl bg-white">
                {p.list.map((b) => (
                  <li key={b.key} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                    <span className="font-medium text-ink-800">{b.officialName}</span>
                    <span className="flex flex-wrap justify-end gap-1">
                      {[...b.sections].sort((x, y) => x.order - y.order).map((s) => (
                        <Badge key={s.id} tone={p.tone}>{s.titleDe}</Badge>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-ink-100 bg-ink-50/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-2 rounded-xl bg-white p-5 ring-1 ring-ink-100">
              <Icon className="h-5 w-5 text-brand-600" aria-hidden />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-ink-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-4 rounded-2xl bg-ink-900 p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-300" aria-hidden />
            <div>
              <h2 className="text-xl font-semibold">Honest about what a mock exam can do</h2>
              <p className="mt-1 max-w-2xl text-sm text-ink-200">
                Objective answers are scored exactly. Writing and speaking feedback from AI is labelled as an estimate and can be
                reviewed by a human examiner. Pass estimates only appear where the official scoring rule is verified.
              </p>
            </div>
          </div>
          <ButtonLink href="/register" variant="secondary" size="lg">Create free account</ButtonLink>
        </div>
        <Disclaimer className="mt-6 text-xs text-ink-500" />
      </section>
    </>
  );
}
