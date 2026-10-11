# Development mode: what is simulated

Each external service switches on its own when its credentials are set. Until then the app uses a
development stand-in. Each stand-in is listed here, labelled in the UI, and shown on the admin dashboard
under **Service status**. With `APP_ENV=production`, the first database access fails with a clear error if Supabase or
Stripe is missing, and all simulated paths below are switched off.

| Service | Without credentials | How it is labelled | In production |
|---|---|---|---|
| Database, auth, storage (Supabase) | Embedded Postgres (PGlite) in `DEV_DATA_DIR`, password login with a database-backed session cookie, files on local disk | Admin service status shows "development". Dev accounts are seeded | Required. No dev accounts, no dev cookie |
| Payments (Stripe) | **Simulated checkout**: clicking a plan creates a subscription with source `dev_simulated` and a zero-value payment record. No money moves | Billing page shows a "Simulated payments" notice, buttons read "(simulated)", and payment history marks each entry "Simulated" | Disabled (`allowSimulatedBilling` is false). Only signed Stripe webhooks grant access |
| Listening audio (ElevenLabs) | Listening scripts play with the **browser's speech synthesis** | The exam shows a "Development preview audio" notice: recordings are read by the browser's preview voice | Disabled. Validation blocks publishing until every script has an **approved** studio audio asset |
| Speaking transcription (ElevenLabs STT) | Not available. Recordings are kept for human examiners | Results show "Awaiting assessment" | Uses ElevenLabs Scribe when configured |
| AI exam generation (Anthropic) | **Disabled**. The generator page explains why. Content can still be written in the JSON editor | Admin generator shows "Not configured: set ANTHROPIC_API_KEY" | Requires `ANTHROPIC_API_KEY` |
| AI writing/speaking assessment (Anthropic) | **Disabled**. There is no fake or heuristic AI score. Writing and speaking stay "Awaiting assessment" until an examiner scores them | The results page says AI feedback is not configured and answers wait for an examiner | Requires `ANTHROPIC_API_KEY`. Always labelled provisional, and a human can override it |
| Speaking partner lines | Read aloud with the browser voice during recording | Labelled "Scripted exam partner (simulation)" | Same. A live partner is out of scope |
| Rate limiting | In-memory per server process | n/a | Works per instance. See the launch checklist for a shared limiter |

## Development-only shortcuts in the seed

`seed({ dev: true })` (run automatically on first request in development):

- creates the four dev accounts listed in the README;
- **auto-confirms the Goethe A1 blueprint**, with a confirmation note that says it is a development seed;
- publishes Goethe A1 Mock 1 using preview (browser-speech) audio.

None of this happens in production. `npm run db:migrate` calls `seed({ dev: false })`, which imports Mock 1
as an unpublished draft whose validation fails until real audio exists and the blueprint is confirmed.
This is covered by `tests/integration/production-seed.test.ts`.

## Resetting

Stop the dev server and delete `.data/` (or whatever `DEV_DATA_DIR` points to).
