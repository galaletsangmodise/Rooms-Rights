# Rooms&Rights — Designs

Designs for **Rooms&Rights**, a mobile-first web app that helps backyard landlords and tenants keep agreements, documents, rent and receipts in one place.

- **Stitch project:** `<https://stitch.google.com/projects/652628702472025550>`
- **Style guide:** [DESIGN.md](./DESIGN.md) ("Urban Receipt": cream paper, maroon ink, forest green for done, burnt orange for pending)
- **Product requirements:** [../PRD.md](../PRD.md)
- **Initial concept:** [concept/urban-receipt-mockup.jpg](./concept/urban-receipt-mockup.jpg) (my first idea, used as the style reference for Stitch)

The live app is built to match these Stitch screens on mobile and desktop.

---

## How the designs map to the PRD

Feature codes refer to the functional requirements in the PRD (F1 Auth and roles, F2 Properties, rooms and landlord dashboard, F3 Agreements, invite and accept, F4 Evidence Vault, F5 Rent ledger and tenant dashboard, F6 Admin, F7 Disputes).

### Must screens (built in the live app)

| # | File | Screen | Role | Feature |
|---|---|---|---|---|
| 01 | `01-welcome.png` | Welcome | Public | F1 |
| 02 | `02-role-selection.png` | Role selection | Public | F1 |
| 03 | `03-login-signup.png` | Login / sign up | Public | F1 |
| 04 | `04-join-with-code.png` | Join with invite code | Tenant | F3 |
| 05 | `05-tenant-dashboard.png` | Tenant dashboard | Tenant | F5 |
| 06 | `06-landlord-dashboard.png` | Landlord dashboard | Landlord | F2 |
| 07 | `07-add-room.png` | Add property / room | Landlord | F2 |
| 08 | `08-agreement-builder.png` | Agreement builder (written or oral) | Landlord | F3 |
| 09 | `09-agreement-preview.png` | Agreement preview and PDF | Landlord, Tenant | F3 |
| 10 | `10-invite-tenant.png` | Invite (link, code, QR) | Landlord | F3 |
| 11 | `11-review-accept.png` | Review and accept agreement | Tenant | F3 |
| 12 | `12-my-agreements.png` | My Agreements list | Landlord, Tenant | F3 |
| 13 | `13-room-hub.png` | Room hub | Landlord, Tenant | F2, F4, F5 |
| 14 | `14-evidence-vault.png` | Evidence Vault | Landlord, Tenant | F4 |
| 15 | `15-money-ledger.png` | Rent ledger | Landlord, Tenant | F5 |
| 16 | `16-record-payment.png` | Record payment | Landlord | F5 |
| 17 | `17-receipt.png` | Receipt | Landlord, Tenant | F5 |
| 18 | `18-admin-templates.png` | Admin: agreement templates (desktop) | Admin | F6 |

### Desktop versions

| File | Screen |
|---|---|
| `05-tenant-dashboard-desktop.png` | Tenant dashboard |
| `06-landlord-dashboard-desktop.png` | Landlord dashboard |
| `08-agreement-builder-desktop.png` | Agreement builder |
| `14-evidence-vault-desktop.png` | Evidence Vault |
| `15-money-ledger-desktop.png` | Rent ledger |

### Planned screens (designed, not built yet)

| # | File | Screen | Feature |
|---|---|---|---|
| 19 | `19-dispute-centre.png` | Dispute Centre ("The Resolution Room") | F7 |
| 20 | `20-tribunal-pack.png` | Tribunal complaint pack generator | F7 |
| 21 | `21-find-support.png` | Find Your Support directory | F7 |

These are shown for the product direction only and are not part of the live app. The support directory will launch only with real, verified contacts, so any contact details in screen 21 are sample text.

---

## Design notes

- **Roles:** Tenant tabs are Home, Agreements, Money, Support. Landlord tabs are Home, Rooms, Agreements, Money, Profile.
- **Status chips:** green = Active or Valid, orange = Pending, sand = Recorded (oral terms).
- **Decoration:** the chevron band appears only on Welcome and the corner stripes only on Role selection. Decoration never sits behind text.
- **Language:** plain English, short sentences, rands written as R1,200. Setswana and other languages are planned.
- **Accessibility:** body text is at least 15px, tap targets are at least 48px, and contrast is checked on cream and maroon backgrounds.
- **No sample data in the live app:** screens in this folder use example names and amounts for illustration. The live app shows real data and designed empty states.

---

## Differences between the designs and the live app

- `<ADD any screens or details that differ, and why>`