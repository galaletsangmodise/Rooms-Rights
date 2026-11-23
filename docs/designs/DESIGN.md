# Rooms&Rights — "Urban Receipt" Style Guide + Exact Stitch Prompts

Built from your 8-screen mockup. Colours are matched by eye, so confirm them with an eyedropper on your image and adjust the hex codes if needed. Save this file as `docs/designs/DESIGN.md` when you are done.

This replaces the earlier prompts in `STITCH_PROMPTS.md` for screens 1–8. Screens 9 onward are new screens written in the same style.

---

## PART A — STYLE GUIDE

### A1. Brand
- **Name:** ROOMS&RIGHTS (wordmark, all caps, the "&" in maroon)
- **Logo:** a house outline in dark green with a maroon door, next to the stacked wordmark "ROOMS&" over "RIGHTS" in a heavy condensed sans
- **Tagline:** Rent fairly. Live securely. Know your rights.
- **Feel:** warm, local, trustworthy, like a paper receipt. Cream paper, maroon ink, a little township pattern. Never cold, blue or corporate.

### A2. Colour palette

| Role | Name | Hex (approx.) |
|---|---|---|
| Primary | Maroon | `#6B2326` |
| Primary pressed / header shade | Deep maroon | `#5A1D20` |
| Page background | Cream | `#F6EDE0` |
| Card surface | Light cream | `#FBF5EA` |
| Card border / dividers | Tan | `#E6D6BF` |
| Success, ticks, "Active" and "Valid" | Forest green | `#2F6B4F` |
| Success chip background | Pale green | `#D9E8D5` |
| Logo house | Dark green | `#1F4A3A` |
| Pending chip / action items | Burnt orange | `#C9672A` |
| Pending chip background | Pale orange | `#F5D9B5` |
| "Recorded" chip | Sand | `#E8D9C3` with text `#6E5B54` |
| Heading text | Near-black brown | `#2A1B17` |
| Body / secondary text | Warm grey brown | `#6E5B54` |
| White | | `#FFFFFF` (used on maroon only) |

Rules:
- Maroon is for the main button, the tenant dashboard header and the active tab. Do not use blue anywhere.
- Green means "done" or "valid". Orange means "needs action" or "pending".
- Never put pattern or illustration behind text.

### A3. Typography

| Use | Style | Suggested font |
|---|---|---|
| Wordmark and big screen headings | Heavy, tight, bold | Montserrat ExtraBold or Poppins Bold (wordmark: Oswald or Bebas Neue) |
| Section headings | Bold | Poppins SemiBold |
| Body, labels, buttons | Regular / medium | Poppins or Inter |
| Accent labels (e.g. "Option 3") | Typewriter / receipt feel | Courier Prime or Special Elite |

Sizes (mobile): screen heading 30–34px, section heading 18–20px, card title 16–17px bold, body 15–16px, helper text 13–14px, chip and tab label 12–13px. Minimum body text is 15px.

### A4. Shape, spacing, depth
- Page side padding 20px; space between cards 12–14px
- Cards: radius 16px, light cream fill, 1px tan border, very soft shadow
- Buttons: full width, height 52–56px, radius 12px, maroon fill, white bold text, icon at the end (→ or +)
- Chips: pill shape, 12–13px bold text, 6px × 12px padding
- Icons: simple rounded line icons in maroon (outline, 2px stroke); green circle with white tick for completed items
- Dividers: thin tan lines between list rows
- No device bezel, no status bar notch drawn by the design. Show a simple status bar "9:41" only.

### A5. Decorative elements
- **Chevron / zigzag border:** a horizontal band of maroon and cream zig-zag triangles, used at the bottom of the Welcome screen only
- **Corner stripes:** diagonal geometric stripes in maroon, ochre and green in the top-right corner of the Role Selection screen only
- **Township illustration:** sepia/beige line-art of backyard rooms and power lines, faded into the cream at the bottom of the Welcome and Role Selection screens
- **People illustrations:** friendly flat illustrations in warm browns, a woman in a headscarf for tenant, a man in a blue cap for landlord
- Do not use the "South Africa" stamp inside the app screens.

### A6. Components

**Status chips**
- Active / Valid: pale green background, forest green text
- Pending: pale orange background, burnt orange text
- Recorded: sand background, brown text

**List card (agreements):** title bold on the left, one-line subtitle in grey brown under it, chip on the right.

**Checklist row:** green tick circle, label, chevron on the right. Pending row uses an orange plus icon and orange text, no chevron.

**Info tile:** square-ish card with a maroon outline icon at the top, small label, large bold value, small grey sub-label.

**Filter chips (Evidence Vault):** one selected chip filled dark maroon with white text, others plain text on cream.

**Bottom tab bar:** cream background, thin top border, four tabs each with a line icon above a small label. Active tab in maroon, others grey brown.
- Tenant tabs: Home, Agreements, Money, Support
- Landlord tabs: Home, Rooms, Agreements, Money, Profile

**Header patterns**
- Tenant dashboard: maroon header block with white greeting and avatar circle, and a cream card overlapping its bottom edge
- All other screens: cream background, back arrow top left, bold title

### A7. Voice
Plain English, short sentences, friendly, no legal jargon. Rands as "R1,200". Dates like "Due 01 Dec" and "Created 12 Nov 2026".

---

## PART B — HOW TO PROMPT STITCH (so it copies your design)

1. Crop one phone screen at a time from your mockup (no bezel) and upload it with its prompt below.
2. Start every prompt with the **Copy line**:
   ```
   Recreate the attached screen as an exact match. Keep the layout, spacing, colours, card shapes, chips, icons, illustration style and fonts identical. Use only cream #F6EDE0, light cream #FBF5EA, maroon #6B2326, forest green #2F6B4F, burnt orange #C9672A, near-black brown #2A1B17. No blue. No device frame.
   ```
3. Then paste the screen prompt.
4. For new screens, upload the closest finished screen and say: "Create this new screen in exactly the same style as the attached screen."
5. Change one thing per refinement prompt.

---

## PART C — EXACT PROMPTS FOR YOUR 8 SCREENS

**1. Welcome**
```
Mobile welcome screen. Top bar: small house logo (dark green outline, maroon door) with the text "ROOMS&RIGHTS" on the left, hamburger menu icon on the right. Large left-aligned bold heading on three lines: "Rent fairly. / Live securely. / Know your rights." Under it, grey brown text: "A better way for South African tenants and landlords." Below, a sepia line-art illustration of backyard rooms in a township with power lines, fading into the cream background. Full-width maroon button "Get started →". Centered small text under the button: "I already have an account". At the very bottom, a band of maroon and cream chevron zig-zag pattern.
```

**2. Role Selection**
```
Mobile screen. Back arrow top left. Diagonal geometric stripes in maroon, ochre and green in the top-right corner. Large bold heading "Let's get you settled." on two lines. Under it: "Choose your role to continue". Two large rounded cards stacked: first card has an illustration of a smiling woman in a headscarf on the left, text "I'm renting a room" and a chevron on the right; second card has an illustration of a smiling man in a blue cap on the left, text "I rent out rooms" and a chevron on the right. At the bottom, a faded sepia illustration of township backyard rooms.
```

**3. Tenant Dashboard**
```
Mobile tenant dashboard. Top: deep maroon header block with white text "Good evening, Thandeka" at the left and a circular avatar icon at the right. A light cream card overlaps the bottom of the header: title "My Room", a small pale green pill "Active" on the right, and grey text "Backroom · R1,200/month". Below, two square tiles side by side: left tile with a maroon calendar icon, label "Next payment", bold "R1,200", small text "Due 01 Dec"; right tile with a maroon shield icon, label "My deposit", bold "R1,200", small text "Recorded". Section heading "Your rental checklist". Three rows with chevrons: green tick circle "Agreement documented", green tick circle "Deposit recorded", and an orange plus icon with orange text "Add emergency contact". Bottom tab bar with four tabs: Home (active, maroon), Agreements, Money, Support.
```

**4. Landlord Dashboard / My Agreements**
```
Mobile screen titled "My Agreements" in bold at the top left on cream. Three stacked cards: "Room 01 Agreement" with grey text "Created 12 Nov 2026" and a pale green pill "Valid"; "Room 02 Agreement" with "Awaiting confirmation" and a pale orange pill "Pending"; "Room 03 Agreement" with "Oral terms recorded" and a sand pill "Recorded". Full-width maroon button "Create an agreement +". Below it a tan card with a maroon scales-of-justice icon, bold "Know your rights", small text "Get guidance on rental law." and a chevron. Bottom tab bar: Home, Agreements (active), Money, Profile.
```

**5. Dispute Centre (Resolution Room)**
```
Mobile screen. Back arrow and small title "The Resolution Room" at the top. Large bold heading "Let's work through this." Under it: "Tell us what happened so we can help you find a solution." A list of six rows separated by thin tan lines, each with a maroon line icon on the left and a chevron on the right: lock icon "Lockout or restricted access"; wallet icon "Deposit or rent disagreement"; wrench icon "Maintenance or repairs"; document icon "Agreement disagreement"; location pin icon "Threats or unfair treatment"; sparkle icon "Something else". Full-width maroon button at the bottom "Start a case →".
```

**6. Evidence Vault**
```
Mobile screen. Back arrow and title "Evidence Vault". Row of filter chips: "All" selected (filled dark maroon, white text), then "Agreements", "Receipts", "Photos" as plain text. Below, a two-by-two grid of rounded cards: a blue-grey document icon card with "Agreement" and "PDF · 245 KB"; a photo thumbnail of a room interior with "Receipt" and "JPG · 1.2 MB"; a photo thumbnail of a plumbing fixture with "Maintenance" and "JPG · 892 KB"; a chat bubble icon card with "Message" and "PDF · 120 KB". Full-width maroon button at the bottom "Upload a file +".
```

**7. Tribunal Pack Generator**
```
Mobile screen. Back arrow and title "Your complaint pack". Text: "We'll help organise your information for the Rental Housing Tribunal." A checklist with chevrons: green tick circle for each of "Case information", "Rental agreement", "Payment records", "Communication history", "Chronology of events", and a beige tick circle for "Supporting evidence". Full-width maroon button at the bottom "Generate PDF".
```

**8. Find Your Support**
```
Mobile screen with bold title "Find Your Support" at the top left. Subtitle: "Get help from trusted community resources." Three stacked cards with a maroon line icon on the left and a chevron on the right: location pin icon, "Community Advice Office", "Soweto", "011 987 6543"; scales icon, "Legal Aid South Africa", "Multiple branches"; people icon, "Paralegal Services", "Local support". Full-width maroon button at the bottom "Request a review".
```

(Screen 8 shows sample contacts for the design only. The live app must use real, verified contacts.)

---

## PART D — NEW SCREENS IN THE SAME STYLE

For each, upload your finished Tenant Dashboard or My Agreements screen as the style reference and start with: "Create this new screen in exactly the same style as the attached screen."

**9. Login / Sign up**
```
Cream screen, back arrow, bold heading "Welcome back." Two tab pills "Log in" and "Create account" (selected one filled maroon). Fields in light cream rounded inputs with tan borders: full name, phone or email, password. A small role chip under the title. Full-width maroon button "Continue →". Small grey text "Your information stays private."
```

**10. Join with code (tenant)**
```
Cream screen, back arrow, bold heading "Join your room." Text "Your landlord gave you this code or link." Six large separate input boxes for a code. Full-width maroon button "Join →". Below, an outlined button with a camera icon "Scan QR code". An error banner variant in pale orange: "This code has expired. Ask your landlord for a new one."
```

**11. Landlord Dashboard (home)**
```
Deep maroon header block with white text "Good evening, Mama Dineo" and an avatar circle. Overlapping cream card with three small stats in a row: "Income this month R3,600", "Due this week R2,400", "Overdue R1,200" (overdue in burnt orange). Section "My rooms": list cards "Room 01 · Thandeka" with pale green pill "Paid", "Room 02 · Thabo" with pale orange pill "Due 01 Dec", "Room 03" with sand pill "Empty". Section "Needs your action": one card with orange text "Room 02 agreement awaiting tenant confirmation". Full-width maroon button "Add a room +". Bottom tab bar: Home (active), Rooms, Agreements, Money, Profile.
```

**12. Add property / Add room**
```
Cream form screen, back arrow, title "Add a room". Fields in light cream rounded inputs: Room label, Monthly rent (R), Deposit (R), Rent due day, Electricity (dropdown), Water (dropdown), House rules (multiline). Full-width maroon button "Save room". Small text link "Cancel".
```

**13. Agreement builder (choose type)**
```
Cream screen, back arrow, title "Create an agreement". Progress bar in maroon. Heading "How was it agreed?" Two large cards with maroon line icons: a document icon "Written agreement" with small text "We'll build a printable agreement." and a speech-bubble icon "Record oral terms" with small text "Write down what you both agreed." Full-width maroon button "Next →".
```

**14. Agreement preview**
```
Cream screen, back arrow, title "Rental Agreement" with a pale orange "Pending" pill. A clean white paper document card with sections: Parties, Room, Rent, Deposit, Notice, House rules, and two signature lines. Bottom: maroon button "Send invite →" and two outlined buttons "Download PDF" and "Print".
```

**15. Invite tenant**
```
Cream screen, back arrow, title "Invite your tenant". A large rounded card with a QR code in the centre and the code "K7M4PQ" in big bold letters beneath it. Three buttons: maroon "Share on WhatsApp", outlined "Copy link", outlined "Print". Grey text "This code works once and expires in 7 days." Text link "Revoke invite" in burnt orange.
```

**16. Review and accept (tenant)**
```
Cream screen, back arrow, title "Review your agreement". Stacked summary cards: "Rent R1,200", "Due 1st of each month", "Deposit R1,200", "Notice 1 month", "House rules" with a short list. Checkbox "I have read and agree." Full-width maroon button "Accept agreement". Outlined button "I have a question". Grey text "You will get a copy."
```

**17. Room hub**
```
Cream screen, back arrow, title "Room 01 · Backroom", green "Active" pill. Segmented tabs: Overview (selected), Agreement, Money, Evidence. Overview shows info tiles for next payment and deposit, then a "Recent activity" list with small icons: "Payment recorded · R1,200", "Document uploaded · Agreement".
```

**18. Money / Rent ledger**
```
Cream screen titled "Money". Top card: "Balance" with large "R0" and green "Up to date" pill. Section "Payments": rows "Nov 2026 · R1,200 · Cash · Receipt #0042" each with a green tick. Section "Deposit": "R1,200 held". Landlord version has a full-width maroon button "Record payment +".
```

**19. Receipt**
```
Cream screen, back arrow, title "Receipt". A paper-style receipt card with torn zig-zag top and bottom edges, typewriter-style font for the labels: Receipt No. 0042, date, tenant, landlord, room, amount "R1,200", method "Cash", balance after payment "R0". Two buttons: maroon "Download PDF" and outlined "Share on WhatsApp".
```

**20. Admin templates (desktop)**
```
Desktop screen in the same cream and maroon style. Left sidebar in deep maroon with logo and menu items. Main area: title "Agreement templates", a table with columns Name, Version, Reviewed by, Status (pale green "Reviewed" pill), and a side panel editor with text fields and buttons "Save draft" and "Mark as reviewed".
```

---

## PART E — DESKTOP VERSIONS

```
Create the desktop version of the attached screen in exactly the same style. Replace the bottom tab bar with a deep maroon left sidebar (logo at the top, same menu items). Keep the cream background, cards, chips, icons and fonts. Use a two-column layout where it helps. Keep the maximum content width around 1100px.
```

Do this for: Tenant Dashboard, Landlord Dashboard, Agreement builder, Money, Evidence Vault.

---

## PART F — CHECKLIST BEFORE EXPORTING

- Every screen uses only the palette above, with no blue
- Same fonts, card radius, button style and chips on every screen
- No device frame, no "South Africa" stamp inside screens
- Chevron band only on Welcome; corner stripes only on Role Selection
- Tab labels match the role (tenant vs landlord)
- Text is at least 15px and readable
- Save images to `docs/designs/` and this file as `docs/designs/DESIGN.md`