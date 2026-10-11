"use client";

import { useMemo, useState } from "react";
import { ActionForm } from "./action-form";
import { generateAction } from "@/server/actions/admin";
import { Label } from "@/components/ui/form";

export interface GenExam {
  id: string;
  title: string;
  sections: { id: string; title: string; parts: { id: string; title: string; items: { id: string; number: number }[]; stimuli: { id: string; label: string }[] }[] }[];
}

const SCOPES = [
  { v: "exam", l: "Whole exam" },
  { v: "section", l: "Section" },
  { v: "part", l: "Part" },
  { v: "item", l: "Single item" },
  { v: "passage", l: "Text or recording" },
] as const;

const sel = "h-9 w-full rounded-md border border-ink-200 bg-white px-2 text-sm";

export function GeneratorForm({ exams, initialExam, configured }: { exams: GenExam[]; initialExam?: string; configured: boolean }) {
  const [examId, setExamId] = useState(initialExam ?? exams[0]?.id ?? "");
  const [scope, setScope] = useState<(typeof SCOPES)[number]["v"]>("part");
  const exam = exams.find((e) => e.id === examId);
  const [sectionId, setSectionId] = useState("");
  const [partId, setPartId] = useState("");
  const section = useMemo(() => exam?.sections.find((s) => s.id === sectionId) ?? exam?.sections[0], [exam, sectionId]);
  const part = section?.parts.find((p) => p.id === partId) ?? section?.parts[0];

  return (
    <ActionForm action={generateAction} label={configured ? "Generate draft" : "Generation unavailable"} pendingLabel="Generating… this can take a few minutes" variant="primary" size="md">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="examId">Exam slot</Label>
          <select id="examId" name="examId" className={sel} value={examId} onChange={(e) => { setExamId(e.target.value); setSectionId(""); setPartId(""); }}>
            {exams.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="scope">Scope</Label>
          <select id="scope" name="scope" className={sel} value={scope} onChange={(e) => setScope(e.target.value as typeof scope)}>
            {SCOPES.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
        </div>
        {scope !== "exam" && section && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sectionId">Section</Label>
            <select id="sectionId" name="sectionId" className={sel} value={section.id} onChange={(e) => { setSectionId(e.target.value); setPartId(""); }}>
              {exam!.sections.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
        )}
        {["part", "item", "passage"].includes(scope) && part && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="partId">Part</Label>
            <select id="partId" name="partId" className={sel} value={part.id} onChange={(e) => setPartId(e.target.value)}>
              {section!.parts.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        )}
        {scope === "item" && part && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="itemId">Item</Label>
            <select id="itemId" name="itemId" className={sel}>
              {part.items.map((i) => <option key={i.id} value={i.id}>Aufgabe {i.number} ({i.id})</option>)}
            </select>
          </div>
        )}
        {scope === "passage" && part && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="stimulusId">Text or recording</Label>
            <select id="stimulusId" name="stimulusId" className={sel}>
              {part.stimuli.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="brief">Brief for the model</Label>
        <textarea id="brief" name="brief" className="h-32 rounded-md border border-ink-200 p-2 text-sm" placeholder="e.g. Theme: moving to a new flat. One dialogue on the phone with a landlord. Avoid food topics, which Mock 1 already covers." />
      </div>
      <p className="text-xs text-ink-500">The result is validated against the blueprint and saved as a new version with status &quot;AI generated&quot; only when you choose to. It is never published without human review.</p>
    </ActionForm>
  );
}
