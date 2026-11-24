PHASE 4 DROP-IN FILES (Evidence Vault)
======================================

Before you unzip (repo folder, new branch feat/6-evidence-vault, after Phase 3 is merged or at least in place):

1. Delete any Phase 4 migration you already created (supabase\migrations\<timestamp>_evidence_vault.sql).
2. Unzip into the repo root so folders merge:
      tar -xf "$HOME\Downloads\phase-4.zip" -C .
3. Push the database changes:
      pnpm supabase db push
   No new npm packages are needed for this phase.
4. Check:
      pnpm typecheck
      pnpm lint
      pnpm test
      pnpm build

Files this zip REPLACES:
   src/app/landlord/rooms/[id]/edit/page.tsx   (adds the "Open Evidence Vault" link)
   src/components/BottomNav.tsx                (adds the tenant Vault tab)

Everything else is new.
After pushing, check in Supabase > Storage that a private bucket called "evidence" exists.
