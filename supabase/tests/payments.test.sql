begin;
select plan(13);

insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-4111-8111-111111111111', 'l1@test.com', '{"role":"landlord","full_name":"Landlord One"}'),
  ('22222222-2222-4222-8222-222222222222', 'l2@test.com', '{"role":"landlord","full_name":"Landlord Two"}'),
  ('33333333-3333-4333-8333-333333333333', 't1@test.com', '{"role":"tenant","full_name":"Tenant One"}'),
  ('55555555-5555-4555-8555-555555555555', 't2@test.com', '{"role":"tenant","full_name":"Tenant Two"}');

insert into public.properties (id, landlord_id, name, address) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'House A', '1 Main Road');
insert into public.rooms (id, property_id, label, rent_amount) values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Room 1', 1200);
insert into public.tenancies (id, room_id, tenant_id, status) values
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
   '33333333-3333-4333-8333-333333333333', 'active');

-- ===== Landlord One =====
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
set local role authenticated;

select lives_ok(
  $$select public.record_payment('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'rent', 1200, '2026-11-01', current_date, 'cash', 'November')$$,
  'landlord can record rent'
);

select lives_ok(
  $$select public.record_payment('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'deposit', 1200, null, current_date, 'eft', null)$$,
  'landlord can record a deposit'
);

select is((select count(*)::int from public.payments), 2, 'landlord sees both payments');

select throws_ok(
  $$select public.record_payment('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'rent', 1200, '2026-12-01', current_date + 3, 'cash', null)$$,
  '22023', null,
  'a future payment date is refused'
);

select throws_ok(
  $$insert into public.payments (tenancy_id, kind, amount, period, paid_on, method, receipt_no, recorded_by)
    values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'rent', 1, '2026-10-01', current_date, 'cash', 'X-1',
            '11111111-1111-4111-8111-111111111111')$$,
  '42501', null,
  'direct inserts are blocked'
);

-- ===== Tenant One =====
reset role;
select set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}', true);
set local role authenticated;

select is((select count(*)::int from public.payments), 2, 'tenant sees their own ledger');

select throws_ok(
  $$select public.record_payment('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'rent', 50, '2026-10-01', current_date, 'cash', null)$$,
  '42501', null,
  'tenant cannot record a payment'
);

-- ===== Tenant Two (unrelated) =====
reset role;
select set_config('request.jwt.claims', '{"sub":"55555555-5555-4555-8555-555555555555","role":"authenticated"}', true);
set local role authenticated;

select is((select count(*)::int from public.payments), 0, 'an unrelated tenant sees nothing');

-- ===== Landlord Two (not the owner) =====
reset role;
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true);
set local role authenticated;

select is((select count(*)::int from public.payments), 0, 'another landlord sees nothing');

select throws_ok(
  $$select public.record_payment('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'rent', 50, '2026-10-01', current_date, 'cash', null)$$,
  '42501', null,
  'another landlord cannot record a payment'
);

-- ===== Landlord One again: void =====
reset role;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
set local role authenticated;

select lives_ok(
  $$select public.void_payment((select id from public.payments where kind = 'deposit'), 'Entered by mistake')$$,
  'landlord can void a payment'
);

select throws_ok(
  $$select public.void_payment((select id from public.payments where kind = 'deposit'), 'Again')$$,
  '22023', null,
  'a payment cannot be voided twice'
);

select is(
  (select count(*)::int from public.payments where voided_at is not null),
  1,
  'the voided payment stays in the ledger'
);

select * from finish();
rollback;
