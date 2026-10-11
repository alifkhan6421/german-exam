import { serviceStatuses } from "@/server/config";

/** Visible on every page whenever any external service runs in development/simulated mode. */
export function DevBanner() {
  const dev = serviceStatuses().filter((s) => s.mode !== "live");
  if (dev.length === 0) return null;
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-xs text-amber-900">
      <strong>Development mode.</strong>{" "}
      {dev.map((s) => `${s.name}: ${s.mode === "development" ? "simulated" : "off"}`).join(" · ")}. Nothing here is a real payment, real AI
      evaluation or production audio.
    </div>
  );
}
