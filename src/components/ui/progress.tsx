import { cn } from "@/lib/utils";

export function Progress({ value, className, tone = "brand", label }: { value: number; className?: string; tone?: "brand" | "success" | "warning" | "danger"; label?: string }) {
  const color = { brand: "bg-brand-600", success: "bg-success-600", warning: "bg-warning-600", danger: "bg-danger-600" }[tone];
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-ink-100", className)} role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${v}%` }} />
    </div>
  );
}
