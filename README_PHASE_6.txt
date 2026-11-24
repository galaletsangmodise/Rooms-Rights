PHASE 6 DROP-IN FILES (admin clause library)
============================================

Before you unzip (repo folder, new branch feat/8-clause-library, with Phases 3 to 5 in place):

1. Delete any Phase 6 migration you already created (supabase\migrations\<timestamp>_clause_library.sql).
2. Unzip into the repo root so folders merge:
      tar -xf "$HOME\Downloads\phase-6.zip" -C .
3. Push the database changes:
      pnpm supabase db push
   No new npm packages are needed.
4. Check: pnpm typecheck, pnpm lint, pnpm test, pnpm build

Files this zip REPLACES:
   src/app/landlord/agreements/page.tsx   (adds a "Clause library" link)
   src/app/admin/page.tsx                 (adds a "Manage the clause library" link)
Everything else is new. Your existing admin layout is left alone.

To make yourself admin, sign up normally, then run this in the Supabase SQL Editor:
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'YOUR-ADMIN-EMAIL');
Then sign in and open /admin/templates (or use the new link on /admin).
