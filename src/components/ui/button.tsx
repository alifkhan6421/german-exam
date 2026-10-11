import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
  {
    variants: {
      variant: {
        primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700",
        secondary: "bg-white text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50",
        ghost: "text-ink-700 hover:bg-ink-100",
        danger: "bg-danger-600 text-white hover:bg-red-700",
        success: "bg-success-600 text-white hover:bg-green-700",
        link: "text-brand-700 underline-offset-4 hover:underline px-0",
      },
      size: { sm: "h-8 px-3", md: "h-10 px-4", lg: "h-12 px-6 text-base", icon: "h-9 w-9" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = "Button";

export function ButtonLink({ href, className, variant, size, children, ...rest }: React.ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...rest}>
      {children}
    </Link>
  );
}
