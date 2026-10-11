import { ProfileForm } from "@/components/profile/profile-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { requireUser } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { listTracks } from "@/server/services/exams";

export const metadata = { title: "Welcome" };

export default async function OnboardingPage() {
  const user = await requireUser();
  const tracks = await listTracks(await getDb());
  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Set up your preparation</CardTitle>
          <CardDescription>Tell us your goal so the dashboard can focus on the right exam. You can change this later.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            from="onboarding"
            tracks={tracks.map((t) => ({ key: t.key, title: t.title }))}
            initial={{ displayName: user.displayName, targetTrack: user.targetTrack, examDate: user.examDate, locale: user.locale, aiConsent: user.aiConsent, retentionDays: user.recordingRetentionDays }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
