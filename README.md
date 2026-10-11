# Prüfungsklar: German exam preparation

Mock exams and practice for Goethe-Zertifikat and telc German exams, levels A1 to B2.
The app is independent: it is not affiliated with, endorsed by or connected to the Goethe-Institut
or telc gGmbH. All exam content is original.

Stack: Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Postgres, Auth, Storage) ·
Stripe Billing · ElevenLabs · Anthropic Claude · Vercel.

## Quick start (development mode, no accounts needed)

```bash
npm install
npm run dev            # http://localhost:3000
```

Without credentials the app runs fully in **development mode**. It uses an embedded Postgres (PGlite)
in `.data/`, cookie login, simulated checkout and browser speech for listening previews.
Every simulated service is labelled in the UI and listed in [docs/DEV_MODE.md](docs/DEV_MODE.md).

Development accounts, created on first start:

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@example.com | admin-dev-123 |
| Content Admin | editor@example.com | editor-dev-123 |
| Examiner | examiner@example.com | examiner-dev-123 |
| Student | student@example.com | student-dev-123 |

These accounts exist only in the embedded development database. Production never creates them.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Unit and integration tests (Vitest, in-memory Postgres) |
| `npm run test:e2e` | Browser tests (Playwright). In this sandbox set `PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium` |
| `npm run db:migrate` | Apply migrations and reference data to `DATABASE_URL` (production) |
| `npx tsx scripts/blueprint-report.ts` | List every exam rule that still needs administrator confirmation |

## Documentation

- [Architecture](docs/ARCHITECTURE.md): data model, exam lifecycle, scoring, security boundaries and route map.
- [Development mode](docs/DEV_MODE.md): what is simulated and how it is labelled.
- [Exam blueprints](docs/BLUEPRINTS.md): which official exam facts are verified and which need confirmation.
- [Deployment](docs/DEPLOYMENT.md): Vercel, Supabase, Stripe, ElevenLabs, Anthropic and cron setup.
- [Launch checklist](docs/LAUNCH_CHECKLIST.md): what has to happen before real students pay.

## Current content status

Out of 40 planned mock exams (8 tracks × 5), **one is authored**: Goethe A1 Start Deutsch 1, Übungstest 1.
In development it is published with labelled browser-speech audio. In production it is imported as an
**unpublished draft**: it needs studio audio from the Audio Studio, blueprint confirmation and human
review before it can be published. The other 39 slots are empty drafts, to be produced with the
AI generator plus human review, or written by hand in the exam editor.
