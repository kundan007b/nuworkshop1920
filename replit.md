# Nalanda Workshop 2026

Mobile-friendly workshop website for Nalanda University's Logic, Computation, AI and Quantum Information Technologies workshop, 19–20 December 2026.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Website: `artifacts/nalanda-workshop`; main content and programme in `src/lib/content.ts`.
- Registrations: `artifacts/api-server/src/routes/registrations.ts`, database model in `lib/db/src/schema/registrations.ts`.
- API contract: `lib/api-spec/openapi.yaml`. Regenerate client and validation schemas after edits.

## Architecture decisions

- Registration saves a request, not a guaranteed seat: the supplied site describes limited places, external fees, and accommodation requiring organiser follow-up.
- Email delivery is intentionally not configured. The user requested a preview, and no email provider is connected. Never label a preview as a sent email.
- Receipts use private bearer links rather than user accounts to keep workshop registration accessible. Anyone holding the link can read the receipt; tokens are hashed at rest, excluded from API logs, and receipt pages disable referrers and indexing.
- Speaker identities, affiliations, dates and programme come from the supplied HTML. Do not invent confirmed speaker/session assignments or fee amounts.

## Product

Responsive navigation, real university branding and campus imagery, speaker cards, committee, day selector and expandable agenda, accessible registration validation, live email preview, persistent confirmation receipt, calendar download and printing.

## User preferences

Match Nalanda University and `aiclub.nalandalibrary.com` branding; improve navigation, agenda, speaker cards and registration especially for mobile screens.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
