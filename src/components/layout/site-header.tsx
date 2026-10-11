import { ButtonLink } from "@/components/ui/button";
import { getCurrentUser } from "@/server/auth/session";
import { Logo } from "./logo";
import Link from "next/link";

export async function SiteHeader() {
  const user = await getCurrentUser().catch(() => null);
  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          <Link href="/#exams" className="hidden rounded-md px-3 py-2 text-sm text-ink-600 hover:text-ink-900 sm:block">Exams</Link>
          <Link href="/pricing" className="rounded-md px-3 py-2 text-sm text-ink-600 hover:text-ink-900">Pricing</Link>
          {user ? (
            <ButtonLink href="/dashboard" size="sm">Dashboard</ButtonLink>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm">Log in</ButtonLink>
              <ButtonLink href="/register" size="sm">Start free</ButtonLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
