import "server-only";

/**
 * Central environment configuration.
 *
 * Every external service has a real mode and, where credentials are missing, a clearly
 * labelled development mode. Development modes are refused when APP_ENV=production.
 */

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

const isProduction = env("APP_ENV") === "production";

const supabaseUrl = env("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = env("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const supabaseServiceKey = env("SUPABASE_SERVICE_ROLE_KEY");
const databaseUrl = env("DATABASE_URL");

const supabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseServiceKey && databaseUrl);

export const config = {
  appUrl: env("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000",
  isProduction,
  /** "supabase": real Postgres/Auth/Storage. "dev": embedded Postgres, local files, cookie auth. */
  backend: (supabaseConfigured ? "supabase" : "dev") as "supabase" | "dev",
  supabase: { url: supabaseUrl, anonKey: supabaseAnonKey, serviceKey: supabaseServiceKey, databaseUrl },
  dev: {
    dataDir: env("DEV_DATA_DIR") ?? ".data",
    sessionSecret: env("DEV_SESSION_SECRET") ?? "dev-only-insecure-session-secret-change-me",
  },
  stripe: {
    secretKey: env("STRIPE_SECRET_KEY"),
    webhookSecret: env("STRIPE_WEBHOOK_SECRET"),
    get configured() {
      return !!(this.secretKey && this.webhookSecret);
    },
  },
  elevenlabs: {
    apiKey: env("ELEVENLABS_API_KEY"),
    ttsModel: env("ELEVENLABS_TTS_MODEL") ?? "eleven_multilingual_v2",
    sttModel: env("ELEVENLABS_STT_MODEL") ?? "scribe_v1",
    get configured() {
      return !!this.apiKey;
    },
  },
  llm: {
    provider: (env("LLM_PROVIDER") ?? "anthropic") as "anthropic",
    apiKey: env("ANTHROPIC_API_KEY"),
    generationModel: env("LLM_GENERATION_MODEL") ?? "claude-opus-5-5",
    assessmentModel: env("LLM_ASSESSMENT_MODEL") ?? "claude-opus-5-5",
    get configured() {
      return !!this.apiKey;
    },
  },
  /**
   * Development only: let exams whose listening scripts have no approved audio be
   * published and played with the browser's speech synthesis, clearly labelled.
   */
  allowDevPreviewAudio: !isProduction && env("DEV_ALLOW_PREVIEW_AUDIO") !== "false",
  /** Development only: simulate Stripe checkout when Stripe is not configured. */
  allowSimulatedBilling: !isProduction,
};

export function assertProductionReady() {
  if (!config.isProduction) return;
  const missing: string[] = [];
  if (config.backend !== "supabase") missing.push("Supabase (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL)");
  if (!config.stripe.configured) missing.push("Stripe (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)");
  if (missing.length) throw new Error(`APP_ENV=production but these services are not configured: ${missing.join("; ")}`);
}

export type ServiceStatus = { name: string; mode: "live" | "development" | "unavailable"; detail: string };

export function serviceStatuses(): ServiceStatus[] {
  return [
    {
      name: "Database & auth",
      mode: config.backend === "supabase" ? "live" : "development",
      detail: config.backend === "supabase" ? "Supabase Postgres, Auth and Storage" : "Embedded Postgres (PGlite), local file storage, development cookie login",
    },
    {
      name: "Payments",
      mode: config.stripe.configured ? "live" : config.allowSimulatedBilling ? "development" : "unavailable",
      detail: config.stripe.configured ? "Stripe Checkout, Billing Portal and webhooks" : "Simulated checkout — no money moves, subscriptions are marked 'dev_simulated'",
    },
    {
      name: "Exam generation & AI assessment",
      mode: config.llm.configured ? "live" : "unavailable",
      detail: config.llm.configured ? `Anthropic (${config.llm.generationModel} / ${config.llm.assessmentModel})` : "No LLM key: AI generation and AI feedback are disabled; human review still works",
    },
    {
      name: "Audio (TTS, sound effects, transcription)",
      mode: config.elevenlabs.configured ? "live" : config.allowDevPreviewAudio ? "development" : "unavailable",
      detail: config.elevenlabs.configured ? "ElevenLabs" : "No ElevenLabs key: listening uses labelled browser speech preview; no transcription",
    },
  ];
}
