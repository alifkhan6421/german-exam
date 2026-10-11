import Link from "next/link";
import { LogOut, Shield } from "lucide-react";
import { can } from "@/domain/roles";
import type { CurrentUser } from "@/server/auth/session";
import { logoutAction } from "@/server/actions/auth";
import { Logo } from "./logo";
import { DevBanner } from "./dev-banner";
import { Disclaimer } from "./disclaimer";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/exams", label: "Exams" },
  { href: "/progress", label: "Progress" },
  { href: "/settings/billing", label: "Subscription" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({ user, children }: { user: CurrentUser; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DevBanner />
      <header className="sticky top-0 z-30 border-b border-ink-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Logo href="/dashboard" />
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto text-sm" aria-label="App">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-md px-3 py-1.5 text-ink-600 hover:bg-ink-50 hover:text-ink-900">{n.label}</Link>
            ))}
            {can(user.role, "admin.access") && (
              <Link href="/admin" className="ml-1 inline-flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-1.5 text-telc-700 hover:bg-telc-50"><Shield className="h-3.5 w-3.5" />Admin</Link>
            )}
          </nav>
          <form action={logoutAction}>
            <button className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-ink-500 hover:bg-ink-50 hover:text-ink-900" aria-label="Log out">
              <span className="hidden sm:inline">{user.displayName}</span><LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-ink-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-4 sm:px-6"><Disclaimer /></div></footer>
    </div>
  );
}
