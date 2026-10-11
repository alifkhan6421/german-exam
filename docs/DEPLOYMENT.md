# Deployment: Vercel + Supabase + Stripe

The order matters: database first, then the app, then the webhooks that point at the app.

## 1. Supabase

1. Create a project in an EU region (for example Frankfurt) to keep student data in the EU.
2. **Auth → Providers → Email**: enabled. Keep "Confirm email" on. Under **Auth → URL Configuration**,
   set the Site URL to your production URL and add `https://<your-domain>/auth/callback` to the redirect URLs.
3. **Auth → SMTP**: configure your own SMTP sender. Supabase's built-in sender is rate-limited and not for production.
4. Collect, from **Project settings**:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (API settings)
   - `SUPABASE_SERVICE_ROLE_KEY` (API settings, **secret**)
   - `DATABASE_URL`: the **transaction pooler** connection string (port 6543) for the app
5. Apply the schema and reference data from your machine. Use the **session/direct** connection string for this step:

   ```bash
   DATABASE_URL="postgres://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres" npm run db:migrate
   ```

   This applies `supabase/migrations/*` (tables, RLS on every table, private storage buckets `exam-media`
   and `submissions` with size limits, and the trigger that creates a profile for each auth user). It also seeds
   blueprints, tracks, plans and the 40 exam slots. Goethe A1 Mock 1 is imported as an **unpublished draft**.
   No users are created, and the script is safe to re-run.

6. Create the first Super Admin: register through the app, confirm the email, then in the Supabase SQL editor run

   ```sql
   update profiles set role = 'super_admin' where email = 'you@example.com';
   ```

   Every later role change goes through **Admin → Users** and is audit-logged.

## 2. Stripe

1. Create a product for each paid plan, with a recurring **price** (monthly and annual). Turn on Stripe Tax if you sell in the EU.
2. Configure the **Customer Portal** (cancel, update payment method, invoices).
3. Add a webhook endpoint `https://<your-domain>/api/stripe/webhook` with these events:
   - `checkout.session.completed`
   - `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - `invoice.paid`, `invoice.payment_failed`, `invoice.finalized`
4. Copy the signing secret into `STRIPE_WEBHOOK_SECRET` and the secret key into `STRIPE_SECRET_KEY`.
5. After the app is deployed, open **Admin → Plans** and paste each Stripe price id (`price_…`) into its plan.
   Prices and entitlements live in the database, so they can change without a redeploy.

Use test-mode keys on a preview deployment first. With the Stripe CLI, `stripe trigger checkout.session.completed`
exercises the webhook, and a successful checkout must show up under **Settings → Billing** only after the webhook arrives.

## 3. Anthropic and ElevenLabs

- `ANTHROPIC_API_KEY` enables the AI exam generator and provisional AI feedback. Models default to `claude-opus-5-5`
  and can be changed with `LLM_GENERATION_MODEL` / `LLM_ASSESSMENT_MODEL`. Generation calls stream and can take
  minutes. The generator route sets `maxDuration = 300`, which needs a Vercel plan that allows 300-second functions.
- `ELEVENLABS_API_KEY` enables the Audio Studio (voices, text-to-speech per turn, ambience) and speaking transcription.
  A commercial ElevenLabs plan is needed to use the generated audio in a paid product.

## 4. Vercel

1. Import the GitHub repository. The framework preset is Next.js, and no build settings need changing.
2. Set the environment variables from `.env.example` for **Production** (and Preview, with test keys).
   - `APP_ENV=production` (the app then refuses every development fallback)
   - `NEXT_PUBLIC_APP_URL=https://<your-domain>`
   - `CRON_SECRET`: a long random string. Vercel Cron sends it automatically as a Bearer token.
3. Deploy. `vercel.json` schedules `/api/cron/retention` daily at 03:17 UTC, which deletes speaking recordings past
   their retention date.
4. Set the function region close to the Supabase region (for example `fra1`).
5. Add the domain, then update the Supabase Site URL and redirect URL and the Stripe webhook URL if they changed.

### Upload sizes on Vercel

Serverless request bodies are limited to about 4.5 MB.

- Final listening audio (up to 25 MB WAV) is uploaded **directly from the browser to Supabase Storage** with a one-time
  signed upload token. The app only records the result after checking the object exists.
- Speaking recordings go through the app server and are recorded at about 48 kbit/s (around 6 KB/s), so a 10-minute
  answer stays under the limit.

## 5. After the first deploy

1. Open **Admin**. Service status should show every service as live.
2. Follow [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) to produce audio, confirm blueprints and publish the first exam.
