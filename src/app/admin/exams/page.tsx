import Link from "next/link";
import { requirePermission } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { listExams, listTracks } from "@/server/services/exams";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { EXAM_STATUS_LABEL, EXAM_STATUS_TONE } from "@/components/admin/status";

export const metadata = { title: "Exams" };

export default async function AdminExams() {
  await requirePermission("exam.review");
  const db = await getDb();
  const [tracks, exams] = await Promise.all([listTracks(db), listExams(db)]);
  const max = Math.max(5, ...exams.map((e) => e.mock_number));
  return (
    <>
      <PageHeader title="Exams" description="Every track and mock slot. Open a slot to edit, validate, review, preview and publish." />
      <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-500">
              <th className="px-4 py-3">Track</th>
              {Array.from({ length: max }, (_, i) => <th key={i} className="px-3 py-3">Mock {i + 1}</th>)}
            </tr>
          </thead>
          <tbody>
            {tracks.map((t) => (
              <tr key={t.key} className="border-b border-ink-100 last:border-0">
                <td className="px-4 py-3 font-medium">
                  <Badge tone={t.provider === "goethe" ? "goethe" : "telc"}>{t.provider === "goethe" ? "Goethe" : "telc"} {t.level}</Badge>
                </td>
                {Array.from({ length: max }, (_, i) => {
                  const e = exams.find((x) => x.track_key === t.key && x.mock_number === i + 1);
                  return (
                    <td key={i} className="px-3 py-3">
                      {e ? (
                        <Link href={`/admin/exams/${e.id}`} className="flex flex-col gap-1 hover:underline">
                          <Badge tone={EXAM_STATUS_TONE[e.status]}>{EXAM_STATUS_LABEL[e.status]}</Badge>
                          <span className="text-xs text-ink-500">{e.access_tier}{e.current_version_id && e.current_version_id !== e.published_version_id && e.published_version_id ? " · newer draft" : ""}</span>
                        </Link>
                      ) : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
