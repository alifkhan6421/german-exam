import Link from "next/link";

export function Logo({ href = "/", inverted = false }: { href?: string; inverted?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-2 font-semibold tracking-tight ${inverted ? "text-white" : "text-ink-900"}`}>
      <span aria-hidden className={`grid h-8 w-8 place-items-center rounded-lg text-sm font-bold ${inverted ? "bg-white text-ink-900" : "bg-ink-900 text-white"}`}>Pk</span>
      <span>Prüfungsklar</span>
    </Link>
  );
}
