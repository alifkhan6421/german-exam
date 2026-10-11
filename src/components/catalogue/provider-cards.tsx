import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LEVELS } from "@/lib/utils";

const PROVIDERS = [
  {
    key: "goethe",
    title: "Goethe Exam Preparation",
    text: "Goethe-Zertifikat A1 Start Deutsch 1, A2, B1 and B2. Module-based exams with Lesen, Hören, Schreiben and Sprechen.",
    cls: "border-emerald-200 from-goethe-50 to-white",
    pill: "bg-goethe-600",
  },
  {
    key: "telc",
    title: "telc Exam Preparation",
    text: "Start Deutsch 1 & 2, Zertifikat Deutsch / telc Deutsch B1 and telc Deutsch B2, with Sprachbausteine at B1 and B2.",
    cls: "border-violet-200 from-telc-50 to-white",
    pill: "bg-telc-600",
  },
];

export function ProviderCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {PROVIDERS.map((p) => (
        <div key={p.key} className={`flex flex-col gap-4 rounded-2xl border bg-gradient-to-br p-6 ${p.cls}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-ink-600">{p.text}</p>
            </div>
            <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white ${p.pill}`}>{p.key === "goethe" ? "G" : "t"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <Link key={l} href={`/exams/${p.key}/${l.toLowerCase()}`} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink-800 ring-1 ring-ink-200 hover:ring-ink-400">{l}</Link>
            ))}
          </div>
          <Link href={`/exams/${p.key}`} className="inline-flex items-center gap-1 text-sm font-medium text-ink-700 hover:text-ink-900">View levels <ArrowRight className="h-4 w-4" /></Link>
        </div>
      ))}
    </div>
  );
}
