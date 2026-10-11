import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod/v4";
import { config } from "../config";
import { DomainError } from "./exams";

/**
 * Thin wrapper around the Anthropic Messages API. All LLM calls are server-side; the key
 * never reaches the browser. Requests opt into server-side refusal fallbacks so a policy
 * decline on the primary model is retried on a fallback model inside the same call.
 */
let client: Anthropic | null = null;

function getClient() {
  if (!config.llm.configured) throw new DomainError("AI features are not configured on this server (ANTHROPIC_API_KEY is missing).", 503);
  client ??= new Anthropic({ apiKey: config.llm.apiKey });
  return client;
}

const FALLBACK_BETA = "server-side-fallback-2026-07-01";

export interface LlmUsage {
  model: string;
  inputTokens: number;
  outputTokens: number;
}

/** Small structured response validated against a Zod (v4) schema. */
export async function structured<T extends z.ZodType>(args: {
  schema: T;
  system: string;
  user: string;
  model?: string;
  effort?: "low" | "medium" | "high";
  maxTokens?: number;
}): Promise<{ data: z.infer<T>; usage: LlmUsage }> {
  const res = await getClient().beta.messages.parse({
    model: args.model ?? config.llm.assessmentModel,
    max_tokens: args.maxTokens ?? 16000,
    betas: [FALLBACK_BETA],
    fallbacks: "default",
    system: args.system,
    messages: [{ role: "user", content: args.user }],
    output_config: { effort: args.effort ?? "medium", format: betaZodOutputFormat(args.schema) },
  });
  if (res.stop_reason === "refusal") throw new DomainError("The AI model declined this request.", 502);
  if (res.stop_reason === "max_tokens" || !res.parsed_output) throw new DomainError("The AI response was incomplete. Please try again.", 502);
  return { data: res.parsed_output as z.infer<T>, usage: { model: res.model, inputTokens: res.usage.input_tokens, outputTokens: res.usage.output_tokens } };
}

/**
 * Long free-form generation (exam content). Streams to avoid HTTP timeouts and returns the
 * text; callers extract and validate JSON themselves because exam content is validated
 * against the blueprint, which a response schema alone cannot express.
 */
export async function generateText(args: { system: string; user: string; model?: string; maxTokens?: number }): Promise<{ text: string; usage: LlmUsage }> {
  const stream = getClient().beta.messages.stream({
    model: args.model ?? config.llm.generationModel,
    max_tokens: args.maxTokens ?? 64000,
    betas: [FALLBACK_BETA],
    fallbacks: "default",
    system: args.system,
    messages: [{ role: "user", content: args.user }],
    output_config: { effort: "high" },
  });
  const msg = await stream.finalMessage();
  if (msg.stop_reason === "refusal") throw new DomainError("The AI model declined this request.", 502);
  if (msg.stop_reason === "max_tokens") throw new DomainError("The AI response was cut off. Try a smaller scope (section, part or item).", 502);
  const text = msg.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("\n");
  return { text, usage: { model: msg.model, inputTokens: msg.usage.input_tokens, outputTokens: msg.usage.output_tokens } };
}

/** Pull the first JSON object out of a model response (fenced or bare). */
export function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  try {
    return JSON.parse(candidate);
  } catch {
    throw new DomainError("The AI response was not valid JSON.", 502);
  }
}
