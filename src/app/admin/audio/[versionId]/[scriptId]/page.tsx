import Link from "next/link";
import { notFound } from "next/navigation";
import { can } from "@/domain/roles";
import { requirePermission } from "@/server/auth/session";
import { config } from "@/server/config";
import { getDb } from "@/server/db";
import { defaultAmbiencePrompt, listVoices, studioScript } from "@/server/services/audio";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ActionForm } from "@/components/admin/action-form";
import { StudioMixer } from "@/components/admin/studio-mixer";
import { approveAudioAction, castVoicesAction, generateAmbienceAction, generateTurnsAction, rejectAudioAction } from "@/server/actions/admin";
import { formatDateTime } from "@/lib/utils";

export const maxDuration = 300;

export default async function StudioPage({ params }: { params: Promise<{ versionId: string; scriptId: string }> }) {
  const { versionId, scriptId } = await params;
  const user = await requirePermission("audio.produce");
  const db = await getDb();
  const data = await studioScript(db, versionId, scriptId).catch(() => null);
  if (!data) notFound();
  const { script, version } = data;
  const voices = config.elevenlabs.configured ? await listVoices().catch(() => []) : [];
  const fields = { versionId, scriptId };

  return (
    <>
      <PageHeader
        eyebrow={<><Link href="/admin/audio" className="hover:underline">Audio studio</Link> / <Link href={`/admin/exams/${version.exam_id}/versions/${version.id}`} className="hover:underline">version {version.version}</Link></>}
        title={script.title || script.id}
        description={<span className="flex flex-wrap gap-2"><Badge>{script.scenario}</Badge><Badge tone={script.audioStatus === "approved" ? "success" : "neutral"}>{script.audioStatus}</Badge>{version.locked && <Badge>version locked: edits create a new version</Badge>}</span>}
      />
      {!config.elevenlabs.configured && <Alert tone="warning" className="mb-4">ElevenLabs is not configured. Speech and ambience generation are disabled; you can upload a finished file below.</Alert>}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>1 · Script and casting</CardTitle><CardDescription>Pick a German-capable voice for each speaker. Ages and genders should match the script.</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ActionForm action={castVoicesAction} fields={fields} label="Save casting">
              {script.speakers.map((sp) => (
                <label key={sp.id} className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">{sp.name} <span className="font-normal text-ink-500">· {sp.role}, {sp.gender}, {sp.age}</span></span>
                  {voices.length > 0 ? (
                    <select name={`voice:${sp.id}`} defaultValue={sp.voiceId ?? ""} className="h-9 rounded-md border border-ink-200 px-2">
                      <option value="">Choose a voice…</option>
                      {voices.map((v) => <option key={v.id} value={v.id}>{v.name}{v.labels.gender ? ` · ${v.labels.gender}` : ""}{v.labels.age ? ` · ${v.labels.age}` : ""}{v.labels.accent ? ` · ${v.labels.accent}` : ""}</option>)}
                    </select>
                  ) : (
                    <input name={`voice:${sp.id}`} defaultValue={sp.voiceId ?? ""} placeholder="ElevenLabs voice id" className="h-9 rounded-md border border-ink-200 px-2" />
                  )}
                </label>
              ))}
            </ActionForm>
            <ol className="flex flex-col gap-2 text-sm">
              {data.turns.map(({ turn, asset }) => {
                const sp = script.speakers.find((s) => s.id === turn.speakerId);
                return (
                  <li key={turn.id} className="rounded-md border border-ink-100 p-2">
                    <p><strong>{sp?.name}:</strong> {turn.text}</p>
                    <p className="text-xs text-ink-500">pause {turn.pauseAfterMs} ms · pace {turn.pace}</p>
                    {asset && <audio controls src={asset.url} className="mt-1 h-8 w-full" />}
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle>2 · Generate</CardTitle><CardDescription>Uses ElevenLabs credits. Model {config.elevenlabs.ttsModel}.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <ActionForm action={generateTurnsAction} fields={fields} label={data.turns.some((t) => t.asset) ? "Regenerate all speech clips" : "Generate speech clips"} pendingLabel="Generating speech…" confirm="This uses ElevenLabs credits. Continue?" />
              <div className="text-sm">
                <p className="text-ink-600">Ambience: {script.environment.ambiencePrompt ?? defaultAmbiencePrompt(script)}</p>
                {data.ambience && <audio controls src={data.ambience.url} className="mt-1 h-8 w-full" />}
              </div>
              <ActionForm action={generateAmbienceAction} fields={fields} label={data.ambience ? "Regenerate ambience" : "Generate ambience"} pendingLabel="Generating ambience…" confirm="This uses ElevenLabs credits. Continue?" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>3 · Mix</CardTitle><CardDescription>Pauses come from the script. Telephone and announcement effects follow the script&apos;s environment.</CardDescription></CardHeader>
            <CardContent>
              <StudioMixer
                versionId={versionId}
                scriptId={scriptId}
                turns={data.turns.map(({ turn, asset }) => ({ id: turn.id, url: asset?.url ?? null, pauseAfterMs: turn.pauseAfterMs }))}
                ambienceUrl={data.ambience?.url ?? null}
                environment={script.environment}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>4 · Review and approve</CardTitle><CardDescription>Listen in full. Speech must be clearly intelligible over any background sound.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {data.finals.length === 0 ? <p className="text-sm text-ink-500">No mixes yet.</p> : data.finals.map((f) => (
                <div key={f.id} className="flex flex-col gap-2 rounded-md border border-ink-100 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{f.provider === "upload" ? "Uploaded" : "Studio mix"} · {f.duration_sec ? `${f.duration_sec} s` : ""} · {formatDateTime(f.created_at)}</span>
                    <Badge tone={f.status === "approved" ? "success" : f.status === "rejected" ? "danger" : "warning"}>{f.status}</Badge>
                  </div>
                  <audio controls src={f.url} className="w-full" />
                  {can(user.role, "exam.review") && f.status === "generated" && (
                    <div className="flex gap-2">
                      <ActionForm action={approveAudioAction} fields={{ assetId: f.id }} label="Approve for students" variant="primary" confirm="I listened to the whole recording and it matches the script. Approve?" />
                      <ActionForm action={rejectAudioAction} fields={{ assetId: f.id }} label="Reject" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
