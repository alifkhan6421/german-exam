import { Download } from "lucide-react";
import { requireUser } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { listTracks } from "@/server/services/exams";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/profile-form";
import { DeleteAccountForm } from "@/components/settings/delete-account";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  const tracks = await listTracks(await getDb());
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Profile, exam goal, privacy and your data." />
      <Card>
        <CardHeader><CardTitle>Profile and privacy</CardTitle></CardHeader>
        <CardContent>
          <ProfileForm
            tracks={tracks.map((t) => ({ key: t.key, title: t.title }))}
            initial={{ displayName: user.displayName, targetTrack: user.targetTrack, examDate: user.examDate, locale: user.locale, aiConsent: user.aiConsent, retentionDays: user.recordingRetentionDays }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your data</CardTitle>
          <CardDescription>Download a copy of everything we store about you: profile, consents, attempts, answers, assessments, subscriptions and payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <a href="/api/me/export" className="inline-flex items-center gap-2 rounded-md border border-ink-200 bg-white px-4 py-2 text-sm font-medium hover:bg-ink-50"><Download className="h-4 w-4" />Download my data (JSON)</a>
        </CardContent>
      </Card>
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle>Delete account</CardTitle>
          <CardDescription>This removes your profile, attempts, answers, recordings and assessments, and cancels any subscription. Payment records are kept without your name because accounting law requires it.</CardDescription>
        </CardHeader>
        <CardContent><DeleteAccountForm email={user.email} /></CardContent>
      </Card>
    </div>
  );
}
