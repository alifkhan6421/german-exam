import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", {
  variants: {
    tone: {
      neutral: "bg-ink-50 text-ink-700 ring-ink-200",
      brand: "bg-brand-50 text-brand-700 ring-brand-200",
      success: "bg-success-50 text-success-600 ring-green-200",
      warning: "bg-warning-50 text-warning-600 ring-amber-200",
      danger: "bg-danger-50 text-danger-600 ring-red-200",
      goethe: "bg-goethe-50 text-goethe-700 ring-emerald-200",
      telc: "bg-telc-50 text-telc-700 ring-violet-200",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export function Badge({ className, tone, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
