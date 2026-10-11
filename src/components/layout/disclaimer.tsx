export const DISCLAIMER =
  "Prüfungsklar is an independent exam preparation service. It is not affiliated with, endorsed by or acting on behalf of the Goethe-Institut or telc gGmbH. Goethe-Zertifikat and telc are trademarks of their respective owners. Practice scores are estimates and are not official exam results or certificates.";

export function Disclaimer({ className }: { className?: string }) {
  return <p className={className ?? "text-xs leading-relaxed text-ink-500"}>{DISCLAIMER}</p>;
}
