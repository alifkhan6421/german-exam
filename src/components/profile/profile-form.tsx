"use client";

import { useActionState } from "react";
import { saveProfileAction } from "@/server/actions/profile";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { Alert } from "@/components/ui/alert";

export function ProfileForm({
  tracks,
  initial,
  from,
}: {
  tracks: { key: string; title: string }[];
  initial: { displayName: string; targetTrack: string | null; examDate: string | null; locale: string; aiConsent: boolean; retentionDays: number };
  from?: "onboarding";
}) {
  const [state, action, pending] = useActionState(saveProfileAction, undefined);
  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="from" value={from ?? ""} />
      {state?.error && <Alert tone="danger">{state.error}</Alert>}
      {state?.ok && <Alert tone="success">{state.message}</Alert>}
      <Field label="Name" htmlFor="displayName"><Input id="displayName" name="displayName" defaultValue={initial.displayName} /></Field>
      <Field label="Which exam are you preparing for?" htmlFor="targetTrack">
        <Select id="targetTrack" name="targetTrack" defaultValue={initial.targetTrack ?? tracks[0]?.key}>
          {tracks.map((t) => <option key={t.key} value={t.key}>{t.title}</option>)}
        </Select>
      </Field>
      <Field label="Exam date (optional)" htmlFor="examDate"><Input id="examDate" name="examDate" type="date" defaultValue={initial.examDate ?? ""} /></Field>
      <Field label="Interface language" htmlFor="locale" hint="Exam content is always in German.">
        <Select id="locale" name="locale" defaultValue={initial.locale}>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </Select>
      </Field>
      <Field label="Keep my speaking recordings for (days)" htmlFor="retentionDays" hint="Recordings are deleted automatically after this period.">
        <Input id="retentionDays" name="retentionDays" type="number" min={1} max={730} defaultValue={initial.retentionDays} />
      </Field>
      <label className="flex items-start gap-3 rounded-lg border border-ink-200 bg-ink-50 p-3 text-sm text-ink-700">
        <input type="checkbox" name="aiConsent" defaultChecked={initial.aiConsent} className="mt-1" />
        <span>
          <strong className="text-ink-900">Allow AI feedback.</strong> My writing and speaking responses may be sent to our AI processors
          (Anthropic for feedback, ElevenLabs for speech transcription) to produce automated practice feedback. Without this, responses can only
          be reviewed by a human examiner. I can withdraw this at any time.
        </span>
      </label>
      <Button type="submit" disabled={pending} className="self-start">{pending ? "Saving…" : from === "onboarding" ? "Continue to dashboard" : "Save"}</Button>
    </form>
  );
}
