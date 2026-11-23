# Rooms&Rights — Product Requirements Document (PRD)

| | |
|---|---|
| **Product** | Rooms&Rights |
| **Author** | Galaletsang |
| **Version** | 0.2 (updated to match the "Urban Receipt" design direction) |
| **Date** | 22 November 2026 |
| **Status** | Draft — pending approval before Stitch designs |

### Change log
- **v0.2:** Added the Urban Receipt design direction (section 12). Added the landlord dashboard and tenant dashboard requirements. Added "oral terms recorded" as an agreement type. Moved the Dispute Centre and Tribunal Pack to a named phase 2 stretch. Required real, verified data for the support directory. Rebuilt the screen list with Must / Phase 2 labels. Renamed the document vault to Evidence Vault in the UI.
- **v0.1:** First draft.

---

## 1. Overview

**One-line pitch:** Rooms&Rights helps backyard landlords and their tenants put their rental agreement in writing, keep every document and payment in one place, and settle disputes fairly before they become evictions or tribunal cases.

**Tagline:** Rent fairly. Live securely. Know your rights.

**What it is:** A mobile-first web app for backroom and backyard rentals in South African townships. The landlord and tenant agree in person (no online listings). The landlord then creates the agreement in the app, invites the tenant, and both sides get a shared "room hub" with the agreement, documents, rent ledger and receipts.

**Who pays:** Landlords, through a small monthly fee per room. Tenants use the app free.

---

## 2. Problem

- Backroom rentals are mostly informal: oral agreements, cash rent, no receipts, no records.
- When something goes wrong (rent dispute, deposit not returned, lock-out, services cut off), neither side can prove what was agreed or paid.
- Official routes are slow and thin. The Gauteng Rental Housing Tribunal is free but serves a whole province with very few inspectors, and it cannot hear eviction applications.
- Many backyard landlords are ordinary households who depend on the rent. They often break the law by accident (e.g. lock-outs, cutting electricity) because nobody explained the rules.

**Cost today:** lost rent, lost deposits, stress, illegal evictions, and cases that escalate because nothing was written down.

---

## 3. Users and roles

| Role | Who | Goal | Pays? |
|---|---|---|---|
| **Landlord** | Household renting out one or more backrooms | Protect rental income, avoid disputes, stay within the law | Yes |
| **Tenant** | Person renting a room | Prove what was agreed and paid; know their rights | No |
| **Admin / Paralegal** | Business owner, volunteer paralegal or advice-office worker | Maintain templates, review escalated cases, support users | Internal |

### Personas
- **Mama Dineo (landlord, 54):** Rents out 3 backrooms. Uses WhatsApp, a basic smartphone, limited data. Wants simple steps and a printable agreement.
- **Thabo (tenant, 27):** Works in retail, pays cash monthly. Wants receipts and a copy of what he agreed to.
- **Palesa (paralegal volunteer):** Reviews disputes and templates on desktop.

---

## 4. Goals and success metrics

| Goal | Metric | Day-one target (pilot) |
|---|---|---|
| Get agreements in writing | Rooms with a signed or recorded agreement | 50 rooms in pilot |
| Create payment proof | Payments recorded with receipts | 80% of rent payments logged |
| Reduce conflict | Disputes resolved without escalation | Track baseline |
| Adoption on both sides | Tenants who accept invite within 7 days | 70% |
| Business viability | Paying landlords | 20 in pilot |

---

## 5. Scope

### Must (day one, working end to end on the live link with real data)
1. **Authentication and roles** — sign up / log in; landlord, tenant and admin roles.
2. **Property and room setup + landlord dashboard** — landlord adds property and rooms (no public listings) and sees rooms, rent due and agreements needing action.
3. **Agreement builder + invite/accept** — written agreement or recorded oral terms, PDF output (print or share), invite by link, code or QR, tenant reviews and accepts.
4. **Evidence Vault (document vault per room)** — upload, view and download documents; permissions by role.
5. **Rent and deposit ledger with receipts** — record payments, generate receipts, show balance and history; powers the tenant dashboard.

### Phase 2 (design now, build after the Musts are live)
- **Stretch 1: Dispute Centre and Tribunal Pack Generator.** It mostly assembles data already stored (agreement, payments, documents) into a Rental Housing Tribunal complaint pack (PDF). Promote to the build if time allows.
- **Find Your Support directory** — only with real, verified contacts (community advice offices, Legal Aid South Africa, paralegal services). Not shipped with sample data.
- Issue/maintenance log with photos
- Move-in and move-out inspection checklist
- Notice generator (rent increase, lease end) with "what you must not do" warnings
- Emergency contact on the tenant profile
- WhatsApp/SMS reminders
- Setswana, isiZulu and other language support

### Later
- Online payments, rental reference for tenants, landlord analytics, municipality/NGO sponsorship dashboards

### Out of scope
- Public room listings or search
- Handling evictions or acting as a lawyer
- Holding user funds

**Rule:** No placeholder or sample screens on the live link. Unbuilt features are not shown. Empty states are designed instead.

---

## 6. Functional requirements and acceptance criteria

### F1. Authentication and roles
- Users sign up with email or phone and password (OTP if feasible) and choose their role on the Role Selection screen ("I'm renting a room" / "I rent out rooms"). Admin accounts are created by the owner.
- **Acceptance:** a user can register, log in, log out; routes and data are restricted by role; unauthorised access returns an error.

### F2. Property, room setup and landlord dashboard
- Landlord creates a property (name, address) and one or more rooms (label, monthly rent, deposit, notes, house rules).
- **Landlord dashboard** shows: rooms and status, rent due and overdue, income recorded this month, and agreements by status (Valid, Pending, Recorded).
- **Acceptance:** landlord can create, edit and archive rooms; dashboard figures come from real ledger data; only the owning landlord sees their data; tenants and other landlords cannot.

### F3. Agreement builder, invite and accept
- Two agreement types: **Written** (guided form, PDF) and **Oral terms recorded** (landlord captures the agreed terms and the tenant confirms them).
- Guided form fields: parties, room, start date, term, rent, due date, deposit, escalation, notice period, utilities (electricity/water arrangement), house rules.
- Statuses: **Draft, Pending (awaiting confirmation), Valid, Recorded (oral terms), Superseded.**
- Landlord generates an invite (link, code, QR). Tenant joins, reviews and accepts; the agreement is locked and stored.
- **Acceptance:** agreement is created from the form, PDF downloads, invite works once and can be revoked, tenant acceptance is timestamped, both parties can view the final version, edits after acceptance create a new version and mark the old one Superseded.

### F4. Evidence Vault (per room)
- Upload agreement scans, ID copies (optional), photos, receipts. Each file has a type (Agreements, Receipts, Photos, Other), uploader and date. Filter tabs: All, Agreements, Receipts, Photos.
- **Acceptance:** landlord and the room's tenant can view shared documents; landlord-only documents stay private; files cannot be accessed by other users via URL.

### F5. Rent and deposit ledger, and tenant dashboard
- Landlord records payments (amount, date, method, note) and the app generates a numbered receipt. Tenant sees history and balance; deposit is tracked separately.
- **Tenant dashboard** shows: room card (type, rent, status), next payment and due date, deposit status, and a rental checklist driven by real state (agreement documented, deposit recorded).
- **Acceptance:** receipts are downloadable by both parties; balance updates correctly; entries cannot be silently edited (changes are logged); tenant can view but not create payments; checklist items reflect actual data.

### F6. Admin / paralegal
- Manage agreement templates and review basic usage data.
- **Acceptance:** admin can view and edit templates; admin sees only what permissions allow.

### F7 (Phase 2). Dispute Centre and Tribunal Pack
- Case start screen with categories: lock-out or restricted access; deposit or rent disagreement; maintenance or repairs; agreement disagreement; threats or unfair treatment; something else.
- Tribunal Pack checklist: case information, rental agreement, payment records, communication history, chronology of events, supporting evidence. Generates a PDF from stored data.
- Must show "information, not legal advice" and a clear warning that lock-outs and cutting services are unlawful.

---

## 7. Permissions matrix (enforced in the database)

| Resource | Landlord | Tenant | Admin |
|---|---|---|---|
| Own property / rooms | Create, read, update | Read (their room only) | Read (support) |
| Agreement | Create, read, update until accepted | Read, accept | Read (support) |
| Evidence Vault documents | Upload, read own rooms | Upload and read shared documents for own room | Read (support) |
| Payments / receipts | Create, read | Read | Read (support) |
| Templates | Read | Read | Create, update |
| Audit log | Read own rooms | Read own room | Read |

Rule: a user can only access rows linked to their own rooms. Enforce with row-level security on the backend, not only in the UI.

---

## 8. Data model (initial)

- **profiles** (id, role, full_name, phone, language)
- **properties** (id, landlord_id, name, address)
- **rooms** (id, property_id, label, rent_amount, deposit_amount, house_rules, status)
- **tenancies** (id, room_id, tenant_id, start_date, end_date, status)
- **agreements** (id, tenancy_id, type [written/oral], version, terms JSON, pdf_url, status, accepted_at)
- **invites** (id, room_id, code, expires_at, used_by, revoked)
- **documents** (id, room_id, uploaded_by, type, file_url, visibility)
- **payments** (id, tenancy_id, type [rent/deposit], amount, paid_on, method, receipt_no)
- **audit_log** (id, actor_id, entity, entity_id, action, created_at)
- *Phase 2:* **cases** (id, tenancy_id, category, status, summary), **case_events** (id, case_id, event_date, note), **support_contacts** (id, name, type, area, phone, verified_at)

---

## 9. Key user flows

1. **Landlord onboarding:** sign up → choose "I rent out rooms" → add property → add room.
2. **Agreement and invite:** choose written or oral → fill terms → preview → download or print → generate invite.
3. **Tenant join:** open link or enter code → sign up → choose "I'm renting a room" → review → accept.
4. **Monthly rent:** landlord records payment → receipt generated → tenant dashboard updates.
5. **Evidence:** either party uploads → visibility rules apply.
6. *(Phase 2)* **Dispute:** start case → pick category → attach evidence → generate Tribunal Pack.

---

## 10. Non-functional requirements

- **Mobile-first and responsive:** works well on basic Android phones and desktop.
- **Low data:** lightweight pages, compressed images, no heavy assets.
- **Security and privacy:** password hashing, HTTPS, private file storage with signed URLs, least-privilege access. Treat ID copies as sensitive personal information under POPIA: optional, access-restricted, with clear consent.
- **Reliability:** automated backups on the hosted database.
- **Accessibility:** plain language, minimum readable text size, strong contrast, large tap targets.
- **Quality:** tests for every Must feature; CI runs lint, typecheck, tests and build on each PR.

---

## 11. Legal and compliance guardrails

- The app provides **legal information and paperwork tools, not legal advice**. It will not describe itself as a lawyer.
- Agreement templates and rights content must be **reviewed by a practising attorney** before launch.
- The app must never encourage self-help eviction (lock-outs, cutting services) and will show clear warnings about this.
- Evictions must go through the courts; the app will refer such matters to a paralegal or attorney.
- Neutral by design: guidance must be fair to both landlord and tenant.
- Support directory entries must be real and verified, with a "last verified" date.

---

## 12. Design direction: "Urban Receipt"

**Concept:** A warm, receipt-inspired look that feels local and trustworthy, not like generic SaaS. Receipts and paperwork are the heart of the product, so the interface borrows from them.

- **Palette:** deep maroon (primary actions, headers), warm cream (backgrounds), dark green (accents and success), amber (pending), with patterned borders as decoration only.
- **Tone:** plain language, friendly, short sentences. Slogan on the welcome screen.
- **Components:** rounded cards, status chips (Active, Valid, Pending, Recorded), checklist rows with green ticks, large primary buttons, illustrated role cards.
- **Navigation:** bottom tab bar on mobile, sidebar on desktop.
  - Tenant: Home, Agreements, Money, Support (Support appears only when the directory is real).
  - Landlord: Home, Rooms, Agreements, Money, Profile.
- **Rules:** minimum text size and contrast checked on basic Android screens; decorative elements (stamp, pattern borders) never sit behind core content; no sample data in the live app.

---

## 13. Screens (input for Stitch designs)

| # | Screen | Role | Phase |
|---|---|---|---|
| 1 | Welcome | Public | Must |
| 2 | Role selection | Public | Must |
| 3 | Login / sign up | Public | Must |
| 4 | Join with code or link | Tenant | Must |
| 5 | Tenant dashboard | Tenant | Must |
| 6 | Landlord dashboard | Landlord | Must |
| 7 | Add / edit property | Landlord | Must |
| 8 | Add / edit room | Landlord | Must |
| 9 | Agreement builder (written / oral) | Landlord | Must |
| 10 | Agreement preview and PDF | Landlord, Tenant | Must |
| 11 | Invite (link, code, QR) | Landlord | Must |
| 12 | Agreement review and accept | Tenant | Must |
| 13 | My Agreements list | Landlord, Tenant | Must |
| 14 | Room hub | Landlord, Tenant | Must |
| 15 | Evidence Vault | Landlord, Tenant | Must |
| 16 | Rent ledger | Landlord, Tenant | Must |
| 17 | Record payment | Landlord | Must |
| 18 | Receipt view | Landlord, Tenant | Must |
| 19 | Admin: templates list and editor | Admin | Must |
| 20 | Dispute Centre (Resolution Room) | Landlord, Tenant | Phase 2 |
| 21 | Tribunal Pack Generator | Landlord, Tenant | Phase 2 |
| 22 | Find Your Support | Landlord, Tenant | Phase 2 |

---

## 14. Proposed tech stack (to confirm)

- **Frontend:** Next.js (React, TypeScript), Tailwind CSS, responsive and mobile-first
- **Backend / DB / auth / storage:** Supabase (hosted Postgres, auth, row-level security, file storage)
- **PDF generation:** server-side (e.g. React PDF or similar)
- **Testing:** Vitest / Jest plus Playwright for key flows
- **CI/CD:** GitHub Actions (lint, typecheck, tests, build); deploy to Vercel

---

## 15. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Regulatory (unauthorised legal practice) | Information-only positioning, attorney-reviewed templates, human escalation |
| Low trust / low adoption | Pilot with known community, printed agreements with QR, Setswana support |
| Connectivity and devices | Lightweight, mobile-first design; printable fallback |
| One side distrusts a landlord-paid tool | Neutral content, tenant gets full access to their records |
| Data protection | POPIA-aware design, minimal data collection, strict access rules |
| Scope creep from designed Phase 2 screens | Build only the 5 Musts first; unbuilt screens never appear in the live app |

---

## 16. Open questions

1. Final payment model and price per room (to test with landlord interviews).
2. Which languages to ship first.
3. Whether ID copies are collected at all in version 1.
4. How the pilot area and first 20 landlords will be recruited.
5. Which attorney will review templates.
6. Whether the Tribunal Pack is built as Stretch 1 once the Musts are live.
7. Source and process for verifying support-directory contacts.

---

