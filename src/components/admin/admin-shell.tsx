import Link from "next/link";
import { ArrowLeft, BookCheck, ClipboardCheck, CreditCard, FileStack, Flag, Gauge, History, Mic, ScrollText, Sparkles, Users } from "lucide-react";
import { can, ROLE_LABELS, type Permission } from "@/domain/roles";
import type { CurrentUser } from "@/server/auth/session";
import { DevBanner } from "@/components/layout/dev-banner";
import { Logo } from "@/components/layout/logo";

const NAV: { href: string; label: string; icon: typeof Gauge; permission: Permission }[] = [
  { href: "/admin", label: "Overview", icon: Gauge, permission: "admin.access" },
  { href: "/admin/exams", label: "Exams", icon: FileStack, permission: "exam.review" },
  { href: "/admin/generator", label: "AI generator", icon: Sparkles, permission: "ai.generate" },
  { href: "/admin/audio", label: "Audio studio", icon: Mic, permission: "audio.produce" },
  { href: "/admin/blueprints", label: "Blueprints", icon: BookCheck, permission: "blueprint.confirm" },
  { href: "/admin/assessments", label: "Assessments", icon: ClipboardCheck, permission: "assessment.review" },
  { href: "/admin/reports", label: "Issue reports", icon: Flag, permission: "reports.view" },
  { href: "/admin/users", label: "Users", icon: Users, permission: "users.view" },
  { href: "/admin/plans", label: "Plans", icon: CreditCard, permission: "plans.edit" },
  { href: "/admin/audit", label: "Audit log", icon: History, permission: "audit.view" },
];

export function AdminShell({ user, children }: { user: CurrentUser; children: React.ReactNode }) {
  const items = NAV.filter((n) => can(user.role, n.permission));
  return (
    <div className="flex min-h-screen flex-col">
      <DevBanner />
      <div className="flex flex-1 flex-col lg:flex-row">
        <aside className="border-b border-ink-200 bg-ink-900 text-ink-100 lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-2 px-4 py-4">
            <Logo href="/admin" inverted />
            <span className="rounded bg-telc-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Admin</span>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 pb-3 text-sm lg:flex-col lg:overflow-visible" aria-label="Admin">
            {items.map((n) => (
              <Link key={n.href} href={n.href} className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-ink-300 hover:bg-ink-800 hover:text-white">
                <n.icon className="h-4 w-4" />{n.label}
              </Link>
            ))}
            <Link href="/dashboard" className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-ink-400 hover:bg-ink-800 hover:text-white lg:mt-4">
              <ArrowLeft className="h-4 w-4" />Student app
            </Link>
          </nav>
          <div className="hidden px-4 pb-4 text-xs text-ink-400 lg:block">
            <ScrollText className="mb-1 h-3.5 w-3.5" />
            {user.email}<br />{ROLE_LABELS[user.role]}
          </div>
        </aside>
        <main className="min-w-0 flex-1 bg-ink-50 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
