PHASE 3 DROP-IN FILES (agreements, invite, accept)
===================================================

Before you unzip (in your repo folder, branch feat/5-agreements):

1. Delete any Phase 3 migration you already created, for example
   supabase\migrations\<timestamp>_agreements.sql and <timestamp>_cancel_agreement.sql.
   This zip brings fixed versions.

2. Unzip into the repo root so the folders merge. In PowerShell:
      tar -xf "$HOME\Downloads\phase-3.zip" -C .
   (or right-click the zip > Extract All, then copy the folders into the repo and choose "Replace")

3. Install the two new packages:
      pnpm add qrcode
      pnpm add -D @types/qrcode

4. Push the database changes:
      pnpm supabase db push

5. Check:
      pnpm typecheck
      pnpm lint
      pnpm test
      pnpm build

Files this zip REPLACES (they existed before):
   next.config.ts                 (removes cacheComponents and partialPrefetching, which break the build)
   src/lib/format.ts              (adds formatDate)
   src/lib/format.test.ts
   src/app/tenant/page.tsx        (new tenant home)
   src/components/BottomNav.tsx   (adds Agreements tab)

Everything else is new.
