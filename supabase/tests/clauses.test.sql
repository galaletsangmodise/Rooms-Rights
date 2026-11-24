begin;
select plan(7);

insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-4111-8111-111111111111', 'l1@test.com', '{"role":"landlord","full_name":"Landlord One"}'),
  ('33333333-3333-4333-8333-333333333333', 't1@test.com', '{"role":"tenant","full_name":"Tenant One"}'),
  ('99999999-9999-4999-8999-999999999999', 'admin@test.com', '{"role":"tenant","full_name":"Admin"}');

update public.profiles set role = 'admin' where id = '99999999-9999-4999-8999-999999999999';

-- ===== Landlord =====
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
set local role authenticated;

select is((select count(*)::int from public.clauses), 4, 'landlord sees the four starter clauses');

select throws_ok(
  $$select public.add_clause('My clause', 'Some text that is long enough')$$,
  '42501', null,
  'landlord cannot add a clause'
);

-- ===== Tenant =====
reset role;
select set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}', true);
set local role authenticated;

select is((select count(*)::int from public.clauses), 0, 'tenant sees no clauses');

-- ===== Admin =====
reset role;
select set_config('request.jwt.claims', '{"sub":"99999999-9999-4999-8999-999999999999","role":"authenticated"}', true);
set local role authenticated;

select lives_ok(
  $$select public.add_clause('Pets', 'No pets without the landlord''s written permission.')$$,
  'admin can add a clause'
);

select lives_ok(
  $$select public.set_clause_active((select id from public.clauses where title = 'Pets'), false)$$,
  'admin can deactivate a clause'
);

select is((select count(*)::int from public.clauses), 5, 'admin sees active and inactive clauses');

-- ===== Landlord again =====
reset role;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
set local role authenticated;

select is((select count(*)::int from public.clauses), 4, 'landlord no longer sees the deactivated clause');

select * from finish();
rollback;
