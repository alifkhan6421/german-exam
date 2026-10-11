# Launch checklist

Everything here is outside the code, or needs a decision only the operator can make. The app enforces the
content items: nothing can be published while they are open.

## Accounts and keys

- [ ] Supabase project (EU region), custom SMTP, email confirmation on. See [DEPLOYMENT.md](DEPLOYMENT.md)
- [ ] Stripe account activated, products/prices created, Customer Portal configured, webhook added, tax settings decided
- [ ] Anthropic API key with enough rate limit and budget for generation and assessment
- [ ] ElevenLabs plan that allows commercial use of generated audio, plus API key
- [ ] Vercel project with a plan that allows 300-second functions (AI generation, audio studio)
- [ ] Production domain

## Content (blocked by the app until done)

- [ ] **Blueprint confirmation** for each track you launch. Check every unverified fact in
      [BLUEPRINTS.md](BLUEPRINTS.md) against the official handbook or Modellsatz, correct anything wrong in
      `src/domain/blueprints/`, then confirm in **Admin → Blueprints**. telc A1, A2, B1 and B2 have
      **unverified pass rules**, so no pass estimate is shown for them until this is done.
- [ ] **Goethe A1 Mock 1**: produce and approve studio audio for each listening script in **Admin → Audio**, run
      validation, send it to review, approve it and publish it. It is already authored and imported as a draft.
- [ ] **The other 39 mock exams**: generate them with **Admin → AI generator** (or write them in the editor), then
      check each one for originality, level and answer-key correctness, produce audio, review and publish.
      Generated content is never published automatically.
- [ ] Decide which exams are free and which are premium (**Admin → Exams → availability**).
- [ ] Have a qualified examiner spot-check AI assessments against their own scores before relying on AI feedback.

## Legal and privacy (EU)

- [ ] Imprint (Impressum) with operator details: `src/app/(public)/legal/[slug]/page.tsx`
- [ ] Privacy notice reviewed by counsel: processors (Supabase, Stripe, Anthropic, ElevenLabs, Vercel), legal bases,
      retention periods, international transfers
- [ ] Data processing agreements signed with each processor
- [ ] Terms of service and consumer withdrawal rights for digital subscriptions
- [ ] Keep the independence disclaimer: no affiliation with the Goethe-Institut or telc gGmbH. Do not use their
      logos or imply official status. The disclaimer already appears in the public site and student app footers and on the home page.
- [ ] Recording retention default confirmed (90 days now, adjustable per user from 1 to 730)

## Operations

- [ ] **Shared rate limiter**: the built-in limiter is in-memory per instance. Add Vercel WAF rate-limit rules or an
      Upstash Redis limiter for `/login`, `/register`, `/api/attempts/*/assess` and `/api/me/export`
- [ ] Error monitoring (for example Sentry) and uptime checks
- [ ] Supabase backups / point-in-time recovery on a paid plan
- [ ] Billing alerts on Anthropic and ElevenLabs usage
- [ ] Plan prices shown in the app (**Admin → Plans**) match the Stripe prices. Stripe charges the Stripe price.
- [ ] End-to-end test on production with a real card in Stripe test mode first, then one live purchase and refund
