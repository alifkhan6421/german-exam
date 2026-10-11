import type { Stimulus } from "@/domain/exam/schema";
import { RichText } from "./rich-text";

const FRAME: Record<string, string> = {
  email: "rounded-lg border border-paper-line bg-white p-4 shadow-sm",
  note: "rotate-[-0.3deg] rounded-sm border border-amber-200 bg-amber-50 p-4 shadow-sm",
  ad: "rounded-md border-2 border-ink-200 bg-white p-3",
  notice: "rounded-md border-2 border-ink-800 bg-white p-4 text-center",
  form: "rounded-lg border border-paper-line bg-white p-3",
  card: "rounded-xl border-2 border-dashed border-telc-600/40 bg-white p-5 text-center text-lg",
  image: "rounded-lg border border-dashed border-ink-300 bg-ink-50 p-6 text-center text-sm text-ink-500",
  table: "rounded-lg border border-paper-line bg-white p-3",
};

/** Printed (non-audio) stimulus as it appears on the exam paper. */
export function TextStimulus({ st }: { st: Stimulus }) {
  return (
    <figure className={FRAME[st.kind] ?? ""}>
      {(st.label || st.title) && (
        <figcaption className="mb-2 flex items-baseline gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
          {st.label && <span className="rounded bg-ink-900 px-1.5 py-0.5 text-white">{st.label}</span>}
          {st.title}
        </figcaption>
      )}
      {st.kind === "image" ? <p>[Illustration: {st.imageAlt}]</p> : <RichText text={st.body} />}
      {st.kind === "card" && st.imageAlt && <p className="mt-1 text-xs text-ink-500">{st.imageAlt}</p>}
    </figure>
  );
}
