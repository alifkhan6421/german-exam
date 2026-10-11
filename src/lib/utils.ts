import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(ms: number) {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatDate(iso: string | Date | null | undefined, locale = "en-GB") {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string | Date | null | undefined, locale = "en-GB") {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function formatPrice(cents: number, currency = "eur") {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

export const PROVIDERS = {
  goethe: { name: "Goethe", long: "Goethe-Zertifikat", accent: "goethe" },
  telc: { name: "telc", long: "telc Deutsch", accent: "telc" },
} as const;

export type ProviderKey = keyof typeof PROVIDERS;

export function isProvider(p: string): p is ProviderKey {
  return p === "goethe" || p === "telc";
}

export const LEVELS = ["A1", "A2", "B1", "B2"] as const;
