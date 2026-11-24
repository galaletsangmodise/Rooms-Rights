# Rooms&Rights — Implementation Plan

Based on PRD v0.2. Build phase by phase, test first, one small PR at a time.

**Assumptions (change if wrong):** Next.js + TypeScript + Tailwind, Supabase (Postgres, Auth, Storage, RLS), Vercel, GitHub Actions. Deadline not fixed yet, so phases are sized in working days instead of dates.

---

## 1. Working agreement

### Workflow: Issues → branches → PRs → merge
1. Every task is a GitHub Issue (small, one outcome, with acceptance criteria copied from the PRD).
2. Branch from `main`: `feat/12-agreement-builder`, `fix/20-receipt-total`, `chore/3-ci`, `docs/5-readme`.
3. Commit small and often using Conventional Commits: `feat: add room form`, `test: cover invite expiry`, `fix: block tenant payment insert`.
4. Open a PR that says `Closes #12`, with a short description and a screenshot for UI changes.
5. CI must pass (lint, typecheck, tests, build). Squash and merge. Delete the branch.
6. `main` is protected: no direct pushes, PR and passing CI required.

### TDD loop for every issue
1. **Red:** write a failing test from the acceptance criteria.
2. **Green:** write the minimum code to pass.
3. **Refactor:** clean up, keep tests green.
4. Commit after each step where it makes sense (`test:` then `feat:`).

### Test layers
| Layer | Tool | Covers |
|---|---|---|
| Unit | Vitest | Pure logic: balance calculation, receipt numbering, invite expiry, agreement validation |
| Component | Vitest + React Testing Library | Forms, status chips, dashboards, empty and error states |
| Database / RLS | Supabase CLI `supabase test db` (pgTAP) | Every permission rule in the PRD matrix |
| End to end | Playwright | Full flows on desktop and mobile viewport |

**Rule:** a feature is not done until its RLS tests prove other users cannot see or change it.

---

## 2. Repository structure

```
/
├─ BUSINESS.md
├─ README.md
├─ IMPLEMENTATION_PLAN.md
├─ docs/
│  ├─ PRD.md
│  └─ designs/            (Stitch exports, DESIGN.md, README.md)
├─ .github/
│  ├─ workflows/ci.yml
│  ├─ pull_request_template.md
│  └─ ISSUE_TEMPLATE/
├─ supabase/
│  ├─ migrations/
│  ├─ tests/              (pgTAP RLS tests)
│  └─ seed.sql
├─ src/
│  ├─ app/                (routes: public, landlord, tenant, admin)
│  ├─ components/
│  ├─ lib/                (supabase clients, validators, pdf, utils)
│  └─ tests/
└─ e2e/                   (Playwright)
```

---

## 3. Phase 0 — Foundations 

**Goal:** an empty app that is deployed, tested and protected before any feature.

Issues:
1. Create repo, add `docs/PRD.md`, `IMPLEMENTATION_PLAN.md`, `docs/designs/` and a README skeleton.
2. Scaffold Next.js (TypeScript strict, Tailwind, ESLint, Prettier), set up path aliases.
3. Set up Vitest and React Testing Library with one passing test.
4. **CI:** GitHub Actions workflow running `lint`, `typecheck`, `test`, `build` on every PR and on `main`. Turn on branch protection.
5. Create Supabase project (hosted). Install Supabase CLI, `supabase init`, link the project, add environment variable handling (`.env.example`, never commit secrets).
6. Deploy "hello" to Vercel with preview deploys for PRs.
7. Add PR template and issue templates.
8. Tailwind theme from the Stitch design system (colours, fonts, radius tokens).
9. Draft `BUSINESS.md` (problem, customer, solution, impact, model, go-to-market, competition, why you).

**Exit criteria:** CI green on a PR, live link loads, protected `main`.

---

## 4. Phase 1 — Authentication and roles (F1) 

**Tests first:** profile is created on signup with the chosen role; a user cannot set themselves as admin; protected routes redirect when logged out; role-based redirect after login.

Issues:
1. Migration: `profiles` table (id → auth.users, role, full_name, phone, language) and trigger to create a profile on signup.
2. RLS: user reads and updates only their own profile; role cannot be changed by the user; admin can read profiles.
3. Supabase auth wiring (server and browser clients, session middleware).
4. Screens: Welcome, Role selection, Login/Sign up (from Stitch).
5. Route guards and role-based navigation (landlord, tenant, admin layouts with correct tabs).
6. Seed script for three test accounts (landlord, tenant, admin) for README.

**Exit criteria:** all three roles can register or log in on the live link and land on the right empty dashboard; RLS tests pass.

---

## 5. Phase 2 — Properties, rooms and landlord dashboard (F2) 

**Tests first:** landlord can create and edit own property and rooms; other landlords and tenants cannot read them; dashboard totals (income this month, due, overdue) calculate correctly from sample payment rows; empty state renders when no rooms.

Issues:
1. Migration and RLS: `properties`, `rooms`.
2. Add / edit property screens with validation.
3. Add / edit room screens (rent, deposit, due day, utilities, house rules); archive instead of delete.
4. Landlord dashboard shell: rooms list with status chips, "Add a room" button, empty state.
5. Dashboard summary cards (wired to payments in Phase 5; use real zero-state until then).

**Exit criteria:** landlord can set up a real property and rooms on the live link.

---

## 6. Phase 3 — Agreements, invite and accept (F3) 

### 3a. Agreement builder and PDF
**Tests first:** validation rejects missing rent, dates or parties; written vs oral types store correct fields; accepted agreements cannot be edited (a new version is created and the old one is Superseded); PDF route returns a PDF containing the key terms.

Issues:
1. Migration and RLS: `tenancies`, `agreements` (type, version, terms JSON, status). Trigger blocks updates once accepted.
2. Multi-step builder UI (People → Room and rent → Deposit and notice → House rules) for Written and Oral types.
3. Agreement preview screen.
4. PDF generation route (server-side, `@react-pdf/renderer` or similar) with print-friendly layout.
5. My Agreements list with status chips (Draft, Pending, Valid, Recorded, Superseded).
6. Admin-managed template text feeds the PDF (read-only for now, editor comes in Phase 6).

### 3b. Invite and accept
**Tests first:** invite code is unique and expires; code works once; revoked or expired codes are rejected with a clear message; tenant can only accept the agreement linked to their invite; acceptance is timestamped; both parties can read the final version and nobody else can.

Issues:
1. Migration and RLS: `invites`. Invites table is not directly readable by tenants; use a **security-definer function** `accept_invite(code)` that creates the tenancy and links the tenant.
2. Invite screen: link, 6-character code, QR (`qrcode` library), share on WhatsApp, copy link, revoke.
3. Tenant join screen (code or link) and the accept flow with checkbox and timestamp.
4. Oral terms flow: tenant confirms recorded terms; status becomes Recorded.
5. Audit log entries for create, send, accept, supersede.

**Exit criteria:** a landlord creates an agreement, downloads the PDF, invites a tenant, and the tenant accepts it, all on the live link with two real accounts.

---

## 7. Phase 4 — Evidence Vault (F4) 

**Tests first:** upload stores a file with type, uploader and visibility; tenant sees only shared files for their own room; landlord-only files are hidden from tenants; another room's files return no access; storage URLs are signed and expire.

Issues:
1. Migration and RLS: `documents`.
2. Private Supabase Storage bucket with path `room_id/uuid.ext` and storage policies that mirror room membership.
3. Upload component (size and type limits, client-side image compression for low data).
4. Evidence Vault screen: filter chips (All, Agreements, Receipts, Photos), file cards, empty state, error state.
5. Download via short-lived signed URL.

**Exit criteria:** both roles can upload and open files on the live link, and cross-room access fails.

---

## 8. Phase 5 — Rent and deposit ledger, receipts and tenant dashboard (F5) 

**Tests first:** balance = expected rent minus payments; deposit tracked separately; receipt numbers are sequential and unique; tenant cannot insert, update or delete payments; payments cannot be edited or deleted (corrections are reversal entries); dashboard totals match the ledger.

Issues:
1. Migration and RLS: `payments`. Insert for landlord only. No update or delete policies. Receipt number assigned by a database function or trigger.
2. Balance and due-date logic as pure, unit-tested functions in `lib/`.
3. Record payment screen (amount, date, type, method, note) and confirmation with receipt number.
4. Rent ledger screen (landlord and tenant versions) and deposit section.
5. Receipt view and PDF, with Share on WhatsApp link.
6. Wire real numbers into the landlord dashboard (income, due, overdue) and build the tenant dashboard (room card, next payment, deposit, checklist from real state).
7. Audit log trigger for payment events.

**Exit criteria:** a payment recorded by the landlord appears on the tenant dashboard with a downloadable receipt.

---

## 9. Phase 6 — Admin / paralegal (F6) 

**Tests first:** only admins can create or edit templates; landlords and tenants can read the active template only; edits create a new version with reviewed-by and date.

Issues:
1. Migration and RLS: `agreement_templates` (version, body, reviewed_by, reviewed_at, status).
2. Admin templates list and editor (desktop-first).
3. Builder and PDF read the active reviewed template.
4. Basic usage overview (counts of landlords, rooms, agreements).

**Exit criteria:** admin edits a template, and the next generated PDF uses it.

---

## 10. Phase 7 — Polish and hardening 

Issues:
1. Responsive pass on every Must screen against the Stitch designs (mobile first, then desktop).
2. Empty, loading and error states everywhere.
3. Accessibility pass: contrast, text size, focus states, labels.
4. Low-data pass: image compression, lazy loading, bundle size check.
5. Playwright e2e for the full journey: landlord signs up → adds room → creates agreement → invites tenant → tenant accepts → payment recorded → receipt visible → file uploaded; plus a negative test (tenant tries to open another room).
6. Security review: no secrets in repo, service role key only on the server, RLS enabled on every table, rate limit on invite acceptance.
7. Legal text pass: "information, not legal advice" notice, warning that lock-outs and cutting services are unlawful, attorney review of templates.
8. Fix known issues list.

**Exit criteria:** e2e suite green in CI, no Must feature depends on sample data.

---

## 11. Phase 8 — Deploy and documentation 

Issues:
1. Production Supabase project, migrations applied, environment variables set in Vercel.
2. Test logins created as real accounts (one per role) with real room data entered through the app.
3. Take screenshots for README (mobile and desktop).
4. Write `README.md`: name and one-line pitch, live link, Stitch link, test logins, screenshots, tech stack, architecture diagram, run locally, run tests, known issues, links to `BUSINESS.md`, PRD and this plan.
5. Finish `BUSINESS.md` with real pilot or interview evidence.
6. Export final Stitch images to `docs/designs/` with `DESIGN.md`.
7. **Loom (max 5 minutes):** 2 minutes investor pitch (problem, customer, solution, impact, money, first 100 customers, competition, why you), 3 minutes live demo of the full flow on the live link.

---

## 12. Phase 9 — Stretch: Dispute Centre and Tribunal Pack 

**Tests first:** a case can only be opened by a party to the tenancy; the pack includes agreement, payments and documents for that tenancy and nothing else.

Issues: `cases` and `case_events` tables with RLS, Resolution Room screen, chronology builder, Tribunal Pack PDF, "information, not legal advice" notice.

---

## 13. Database build order (migrations)

1. `profiles`
2. `properties`, `rooms`
3. `tenancies`, `agreements`, `agreement_templates`
4. `invites` + `accept_invite()` function
5. `documents` + storage policies
6. `payments` + receipt number function
7. `audit_log` + triggers

**RLS pattern:** a helper function `is_room_party(room_id)` returns true if the current user is the landlord who owns the room or the tenant on its active tenancy. Most policies call it. Every table has RLS enabled, with default deny.

---

## 14. Definition of done (every issue)

- Acceptance criteria from the PRD are met.
- Tests written first and passing (unit, component, RLS or e2e as relevant).
- RLS test proves other users cannot access it.
- Lint, typecheck and build pass in CI.
- UI matches the Stitch design on mobile and desktop, with empty and error states.
- PR is small, linked to an issue, and squash-merged.
- Works on the live link with real data.

---



---

## 15. Risks and how the plan handles them

| Risk | Plan |
|---|---|
| Permission bugs leak data | RLS tests in every phase, default deny, e2e negative tests |
| Agreement phase overruns | Split into 3a and 3b, ship written agreements before oral terms |
| PDF layout problems | Build one template early, test in CI with a snapshot of key text |
| Design drift | Check each screen against Stitch before merging UI PRs |
| Running out of time | Cut order in section 15; Must features always come first |
| Legal exposure | Attorney reviews templates and rights text before launch |

---
