import { LoginForm } from "@/components/auth/auth-forms";
import { config } from "@/server/config";
import { DEV_USERS } from "@/server/db/seed";

export const metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-500">Log in to continue your exam preparation.</p>
      </div>
      <LoginForm next={next} devUsers={config.backend === "dev" ? DEV_USERS.map((u) => ({ email: u.email, password: u.password, role: u.role })) : undefined} />
    </div>
  );
}
