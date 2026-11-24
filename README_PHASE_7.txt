PHASE 7 - Polish and e2e test

Unzip into the repo root (replace when asked). No database changes.

Adds: not-found, error and loading pages, page titles, visible focus ring,
laptop grid tweaks, Playwright config and e2e/landlord-flow.spec.ts.
Replaces: layout.tsx, globals.css, vitest.config.ts, VaultView.tsx and the
landlord/tenant/login pages (they only gain a page title; rooms page gets a grid).

Then run:
  pnpm add -D @playwright/test
  pnpm exec playwright install chromium

Add this line inside "scripts" in package.json:
  "e2e": "playwright test"

Run the e2e test manually with: pnpm e2e
(Supabase "Confirm email" must be OFF. Not part of CI.)

You can delete this file after unzipping.
