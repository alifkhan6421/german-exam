import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold tracking-tight text-ink-900">
      <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-sm font-bold text-white">Pk</span>
      <span>Prüfungsklar</span>
    </Link>
  );
}
