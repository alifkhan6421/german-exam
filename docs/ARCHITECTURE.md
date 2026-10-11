# Architecture

## Layers

```
src/domain/     Pure TypeScript: blueprints, exam schema + validation, attempt state machine,
                scoring, entitlements, roles, generation merge/prompt. No I/O, fully unit-tested.
src/content/    Authored exam content (original). Currently goethe-a1/mock-1.ts.
src/server/     Server-only ("server-only" import guard):
  config.ts       Environment, service modes, production readiness check
  db/             Db interface over PGlite (dev/tests) or node-postgres (production), migrations, seed
  auth/           Supabase Auth or dev cookie sessions, RBAC helpers
  services/       attempts, billing, assessment, generator, audio, llm, storage, privacy, admin, rate-limit
  actions/        Server Actions for forms
src/app/        Next.js routes: (public), (app) student area, (exam) full-screen simulator, admin, api
src/components/ UI (hand-written, shadcn-style), simulator, results, admin tools
supabase/       migrations/ (production + dev), dev/ (dev-only auth tables)
```

## Data model (main tables)

| Table | Purpose |
|---|---|
| `profiles` | One row per user (linked to `auth.users` in Supabase). Role, target exam, consents, recording retention |
| `blueprint_versions`, `blueprint_confirmations` | Versioned exam specifications; administrator sign-off for unverified facts |
| `exam_tracks`, `exams` | 8 tracks × 5 mock slots; `current_version_id` (editing) and `published_version_id` (students) |
| `exam_versions` | Immutable once locked. Content JSON incl. answer key, validation report, workflow status |
| `review_decisions` | Review decisions and comments |
| `attempts`, `attempt_answers`, `attempt_events` | Server-authoritative attempt state pinned to an exam version, plus an event log |
| `submission_media` | Speaking recordings (private storage, retention date, transcript) |
| `assessments` | AI (provisional) and human assessments with rubric version; human overrides AI |
| `generation_jobs` | AI generator runs: prompt version, model, raw output, validation, usage |
| `audio_assets` | ElevenLabs turns, ambience, final mixes; only `approved` assets reach students |
| `plans`, `subscriptions`, `billing_customers`, `payments`, `stripe_events` | Billing and entitlements. Subscriptions have a source: `stripe`, `manual` (admin grant) or `dev_simulated` |
| `usage_counters` | Monthly AI quota per user |
| `consents`, `issue_reports`, `audit_log` | GDPR consent records, content issue reports, admin audit trail |

## Exam content lifecycle

```
draft → generated → validated → in_review → approved → published → superseded / archived
```

- Automated validation (`src/domain/exam/validate.ts`) checks structure against the blueprint, answer
  key completeness, evidence for each answer, audio status, duplicate/similarity with other exams,
  and that unverified blueprint facts were confirmed. Critical issues block review and publishing.
- AI-generated content is saved only as a `generated` version. A human must validate, review and approve it.
  Nothing is ever published automatically.
- Publishing locks the version. Editing a locked version creates a new draft version.
- Attempts store `exam_version_id`, so publishing a new version never changes an attempt in progress or a
  past result.

## Attempts and timing

- The server owns the clock: each section group has `deadline_at`. The client timer is display only.
- Answers autosave (debounced PUT). Saves after the deadline are rejected, with a 10-second grace period
  for in-flight requests (`SAVE_GRACE_MS`).
- When a deadline passes, the next request auto-closes the group and, on the last group, auto-submits.
- Listening playback counts are enforced server-side via `/api/attempts/[id]/play`.
- Exam mode: no pausing, no answer checking, fixed order. Practice mode: pause, per-item answer check,
  replays.
- Student-facing APIs never return the answer key, audio scripts, or speaker turns of an unsubmitted
  attempt. This is asserted in the browser test.

## Scoring

- Objective items are scored automatically from the version's answer key.
- Writing/speaking are `pending` until assessed. AI assessment is labelled **provisional**. A human
  examiner assessment always takes precedence.
- Raw points are converted to the blueprint's scaled maxima. A pass estimate is shown only when the
  blueprint's pass rule and maxima are verified or confirmed by an administrator. Otherwise the result
  page says why no estimate is shown. Grades are never shown as official.

## Billing and entitlements

- Checkout and the billing portal go through Stripe. **Only the webhook** (`/api/stripe/webhook`,
  signature-verified, idempotent via `stripe_events`) creates or changes subscriptions.
  The checkout success page grants nothing.
- Entitlements are computed server-side from active subscriptions (Stripe or manual admin grants).
  `past_due` keeps access during Stripe's retry period. `canceled`/`unpaid` remove it.

## Security boundaries

- Secrets (service role, Stripe, Anthropic, ElevenLabs) are read only in `src/server/**` (guarded by `server-only`).
- RBAC: `src/domain/roles.ts`. Every admin page calls `requirePermission`, and every admin action
  checks its permission again on the server.
- Supabase RLS is enabled on every table (defence in depth). The app server uses the service role and filters by user.
- Storage buckets `exam-media` and `submissions` are private. Media is served through `/api/media` after an
  ownership/entitlement check, or via short-lived signed URLs.
- Rate limits: login, register, AI assessment, data export (in-memory per instance, see launch checklist).
- Security headers in `next.config.ts`. The microphone is allowed for same origin only.

## Route map

Public: `/`, `/pricing`, `/login`, `/register`, `/legal/[slug]`, `/auth/callback`

Student: `/dashboard`, `/onboarding`, `/exams`, `/exams/[provider]/[level]/[mock]`, `/attempts/[id]`
(simulator), `/attempts/[id]/results`, `/attempts/[id]/review`, `/progress`, `/settings`, `/settings/billing`

Admin: `/admin`, `/admin/exams`, `/admin/exams/[id]`, `/admin/exams/[id]/versions/[versionId]` (+ `/preview`),
`/admin/generator`, `/admin/generator/[jobId]`, `/admin/audio`, `/admin/audio/[versionId]/[scriptId]`,
`/admin/blueprints`, `/admin/assessments`, `/admin/reports`, `/admin/users`, `/admin/plans`, `/admin/audit`

API: `/api/attempts/[id]` (+ `answers`, `advance`, `pause`, `play`, `check`, `submit`, `recordings`, `assess`),
`/api/media`, `/api/me/export`, `/api/stripe/webhook`, `/api/cron/retention`, `/api/admin/audio/final`

## Roles

| Role | Can |
|---|---|
| Super Admin | Everything, including plans, roles and manual access grants |
| Content Admin | Edit, generate, produce audio, confirm blueprints, review, publish |
| Examiner / Reviewer | Review exam versions, approve audio, assess writing/speaking |
| Support Admin | View users, audit log and issue reports |
| Student | Own attempts, results, billing and data |
