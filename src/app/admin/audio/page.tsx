import Link from "next/link";
import { ExamContentSchema } from "@/domain/exam/schema";
import { requirePermission } from "@/server/auth/session";
import { config } from "@/server/config";
import { getDb } from "@/server/db";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ActionForm } from "@/components/admin/action-form";
import { importAudioBundleAction } from "@/server/actions/admin";
import { listAudioBundles } from "@/server/services/audio-bundle";

export const metadata = { title: "Audio studio" };

export default async function AudioIndex() {
  await requirePermission("audio.produce");
  const db = await getDb();
  const rows = await db.query<{ exam_id: string; title: string; version_id: string; version: number; content: unknown }>(
    `select e.id as exam_id, e.title, v.id as version_id, v.version, v.content from exams e join exam_versions v on v.id = e.current_version_id where e.status <> 'archived' order by e.track_key, e.mock_number`,
  );
  const bundles = await listAudioBundles();
  return (
    <>
      <PageHeader title="Audio studio" description="Produce listening recordings: cast voices, generate speech and ambience with ElevenLabs, mix, review and approve." />
      {!config.elevenlabs.configured && <Alert tone="warning" className="mb-4" title="ElevenLabs not configured">Set ELEVENLABS_API_KEY to generate speech and ambience. You can still upload finished recordings and approve them.</Alert>}
      {bundles.map((b) => (
        <Card key={b.dir} className="mb-4">
          <CardHeader><CardTitle className="text-base">Prepared recordings: {b.trackKey} mock {b.mockNumber}</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p>{b.entries.length} finished mixes ({b.tts.provider} {b.tts.model}, {b.mixer}). Importing adds them as unapproved recordings on the current version. You still listen to and approve each one.</p>
            <ActionForm action={importAudioBundleAction} fields={{ bundle: b.dir }} label="Import recordings" pendingLabel="Importing…" />
          </CardContent>
        </Card>
      ))}
      <div className="flex flex-col gap-4">
        {rows.map((r) => {
          const p = ExamContentSchema.safeParse(r.content);
          if (!p.success || p.data.scripts.length === 0) return null;
          const approved = p.data.scripts.filter((s) => s.audioStatus === "approved").length;
          return (
            <Card key={r.version_id}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">{r.title} · v{r.version}</CardTitle>
                <Badge tone={approved === p.data.scripts.length ? "success" : "warning"}>{approved}/{p.data.scripts.length} approved</Badge>
              </CardHeader>
              <CardContent className="grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {p.data.scripts.map((s) => (
                  <Link key={s.id} href={`/admin/audio/${r.version_id}/${s.id}`} className="flex items-center justify-between gap-2 rounded px-2 py-1 hover:bg-ink-50">
                    <span className="truncate">{s.title || s.id}</span>
                    <Badge tone={s.audioStatus === "approved" ? "success" : "neutral"}>{s.audioStatus}</Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
