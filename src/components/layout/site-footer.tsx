import Link from "next/link";
import { Disclaimer } from "./disclaimer";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-ink-500">Realistic mock exams for Goethe and telc German certificates, A1 to B2.</p>
        </div>
        <div className="flex flex-col gap-4">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-600" aria-label="Footer">
            <Link href="/pricing" className="hover:text-ink-900">Pricing</Link>
            <Link href="/legal/privacy" className="hover:text-ink-900">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-ink-900">Terms</Link>
            <Link href="/legal/imprint" className="hover:text-ink-900">Imprint</Link>
            <Link href="/legal/independence" className="hover:text-ink-900">Independence statement</Link>
          </nav>
          <Disclaimer />
        </div>
      </div>
    </footer>
  );
}
