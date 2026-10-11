import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getDb } from "@/server/db";
import { listTracks } from "@/server/services/exams";
import { trackSummary } from "@/server/services/catalogue";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { isProvider, PROVIDERS } from "@/lib/utils";

export default async function ProviderPage({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  if (!isProvider(provider)) notFound();
  const tracks = (await listTracks(await getDb())).filter((t) => t.provider === provider);
  return (
    <>
      <PageHeader eyebrow={<Link href="/exams" className="hover:underline">Exams</Link>} title={`${PROVIDERS[provider].long} — levels`} />
      <div className="grid gap-4 sm:grid-cols-2">
        {tracks.map((t) => {
          const s = trackSummary(t.key);
          return (
            <Link key={t.key} href={`/exams/${provider}/${t.level.toLowerCase()}`} className="group flex flex-col gap-3 rounded-xl border border-ink-200 bg-white p-5 hover:border-ink-400">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold">{t.level}</span>
                <ArrowRight className="h-5 w-5 text-ink-400 group-hover:text-ink-800" />
              </div>
              <span className="font-medium">{t.title}</span>
              <div className="flex flex-wrap gap-1">
                {s.blueprint && [...s.blueprint.sections].sort((a, b) => a.order - b.order).map((sec) => <Badge key={sec.id} tone={provider}>{sec.titleDe}</Badge>)}
              </div>
              <span className="text-sm text-ink-500">{s.durationMinutes ? `about ${Math.round(s.durationMinutes)} minutes in total` : "Duration per module"} · 5 mock exams</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
