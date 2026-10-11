import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { getEntitlements } from "@/server/services/entitlements";
import { publishedContent, trackFor } from "@/server/services/exams";
import { canAccessExam } from "@/domain/entitlements";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { StartExamForm } from "@/components/catalogue/start-exam-form";
import { isProvider, PROVIDERS } from "@/lib/utils";

export default async function ExamIntroPage({ params, searchParams }: { params: Promise<{ provider: string; level: string; mock: string }>; searchParams: Promise<{ practice?: string }> }) {
  const { provider, level, mock } = await params;
  const { practice } = await searchParams;
  if (!isProvider(provider)) notFound();
  const user = await requireUser();
  const db = await getDb();
  const track = await trackFor(db, provider, level);
  if (!track) notFound();
  const exam = await db.one<{ id: string; title: string; access_tier: string; track_key: string; status: string }>(`select id, title, access_tier, track_key, status from exams where track_key = $1 and mock_number = $2`, [track.key, Number(mock)]);
  if (!exam) notFound();
  const published = exam.status === "published" ? await publishedContent(db, exam.id) : null;
  const ent = await getEntitlements(db, user.id);
  const access = canAccessExam(ent, exam);
  const bp = published?.blueprint;
  const devAudio = published?.content.scripts.some((s) => s.audioStatus !== "approved");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={<><Link href={`/exams/${provider}`} className="hover:underline">{PROVIDERS[provider].long}</Link> / <Link href={`/exams/${provider}/${level}`} className="hover:underline">{track.level}</Link></>}
        title={exam.title}
        description={bp ? `${bp.officialName} · blueprint ${bp.version} (verified ${bp.verifiedAt})` : undefined}
      />
      {!published && <Alert tone="info" title="This mock exam is still in production">It will appear here once all tasks, recordings and reviews are complete.</Alert>}
      {published && !access.ok && (
        <Alert tone="warning" title="Premium exam">{access.reason} <Link href="/settings/billing" className="underline">Upgrade</Link></Alert>
      )}
      {devAudio && <Alert tone="warning" title="Development preview audio">This exam&apos;s listening recordings are not produced yet. In this development build they are read by your browser&apos;s speech synthesis, which does not reflect the final audio quality.</Alert>}
      {bp && published && (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader><CardTitle>Prüfungsablauf</CardTitle></CardHeader>
            <CardContent>
              <ol className="flex flex-col divide-y divide-ink-100">
                {[...bp.sections].sort((a, b) => a.order - b.order).map((s) => {
                  const group = s.timeGroupId ? bp.timeGroups.find((g) => g.id === s.timeGroupId) : undefined;
                  return (
                    <li key={s.id} className="flex flex-col gap-1 py-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">{s.order}. {s.titleDe} <span className="font-normal text-ink-500">· {s.titleEn}</span></span>
                        <span className="text-sm text-ink-600">{s.durationMinutes.value ? `${s.durationMinutes.value} min` : group?.minutes.value ? `${group.minutes.value} min (${group.labelDe})` : "—"}</span>
                      </div>
                      <ul className="text-sm text-ink-600">
                        {s.parts.map((p) => (
                          <li key={p.id}>{p.titleDe}: {p.descriptionEn}{p.playbacks?.value ? ` Played ${p.playbacks.value === 1 ? "once" : `${p.playbacks.value}×`}.` : ""}</li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader><CardTitle>Before you start</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm text-ink-700">
                <p>Use headphones and a quiet room. Check that your microphone works for Sprechen.</p>
                <p>The timer runs on our server. If your connection drops or you refresh the page, your answers are kept and you return where you left off — but the clock keeps running, as in a real exam.</p>
                <p>In exam mode, a module closes when its time ends or when you move on. You cannot go back to a closed module.</p>
                <p className="text-ink-500">{bp.speakingFormat.value} Here, speaking is simulated with a scripted or AI partner.</p>
              </CardContent>
            </Card>
            {access.ok ? (
              <StartExamForm
                examId={exam.id}
                defaultMode={practice ? "practice" : "exam"}
                canPractice={ent.sectionPractice}
                sections={[...bp.sections].sort((a, b) => a.order - b.order).map((s) => ({ id: s.id, titleDe: s.titleDe, titleEn: s.titleEn, minutes: s.durationMinutes.value ? `${s.durationMinutes.value} min` : "shared time" }))}
              />
            ) : (
              <ButtonLink href="/settings/billing">See plans</ButtonLink>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
