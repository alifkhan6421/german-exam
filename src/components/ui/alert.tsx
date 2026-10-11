import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const tones = {
  info: { cls: "border-brand-200 bg-brand-50 text-brand-800", Icon: Info },
  success: { cls: "border-green-200 bg-success-50 text-green-900", Icon: CheckCircle2 },
  warning: { cls: "border-amber-200 bg-warning-50 text-amber-900", Icon: AlertTriangle },
  danger: { cls: "border-red-200 bg-danger-50 text-red-900", Icon: XCircle },
};

export function Alert({ tone = "info", title, children, className }: { tone?: keyof typeof tones; title?: string; children?: React.ReactNode; className?: string }) {
  const { cls, Icon } = tones[tone];
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex gap-3 rounded-lg border p-3 text-sm", cls, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="flex flex-col gap-0.5">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}
