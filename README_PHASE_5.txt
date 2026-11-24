PHASE 5 DROP-IN FILES (rent and deposit ledger, receipts, tenant rent card)
===========================================================================

Before you unzip (repo folder, new branch feat/7-ledger, with Phases 3 and 4 in place):

1. Delete any Phase 5 migration you already created (supabase\migrations\<timestamp>_rent_ledger.sql).
2. Unzip into the repo root so folders merge:
      tar -xf "$HOME\Downloads\phase-5.zip" -C .
3. Push the database changes:
      pnpm supabase db push
   No new npm packages are needed for this phase.
4. Check:
      pnpm typecheck
      pnpm lint
      pnpm test
      pnpm build

Files this zip REPLACES:
   src/app/landlord/rooms/[id]/edit/page.tsx   (adds the "Rent and deposit" link, keeps the Vault link)
   src/components/BottomNav.tsx                (adds the tenant Rent tab, keeps the Vault tab)
   src/app/tenant/page.tsx                     (adds the rent card at the top)

Everything else is new.
Manual check: landlord opens a room > "Rent and deposit", records a payment, opens the receipt.
Tenant sees the rent card on the home page and the same payments under the Rent tab.
