begin;
select plan(21);

-- Users: two landlords, two tenants
insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-4111-8111-111111111111', 'l1@test.com', '{"role":"landlord","full_name":"Landlord One"}'),
  ('22222222-2222-4222-8222-222222222222', 'l2@test.com', '{"role":"landlord","full_name":"Landlord Two"}'),
  ('33333333-3333-4333-8333-333333333333', 't1@test.com', '{"role":"tenant","full_name":"Tenant One"}'),
  ('55555555-5555-4555-8555-555555555555', 't2@test.com', '{"role":"tenant","full_name":"Tenant Two"}');

-- Landlord One owns a property with two rooms. Room 2 already has a pending agreement and a known invite code.
insert into public.properties (id, landlord_id, name, address) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'House A', '1 Main Road');

insert into public.rooms (id, property_id, label, rent_amount) values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Room 1', 1200),
  ('b2b2b2b2-b2b2-42b2-82b2-b2b2b2b2b2b2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Room 2', 1500);

insert into public.tenancies (id, room_id, status) values
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'b2b2b2b2-b2b2-42b2-82b2-b2b2b2b2b2b2', 'invited');

insert into public.agreements (id, tenancy_id, type, status, terms) values
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'written', 'pending', '{"tenant_name":"Thabo"}');

insert into public.invites (tenancy_id, code) values
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'AAAA1111');

-- ===== Landlord One =====
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
set local role authenticated;

select lives_ok(
  $$select public.create_agreement('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'written', '{"tenant_name":"Thandeka"}'::jsonb)$$,
  'landlord can create an agreement for their room'
);

select throws_ok(
  $$select public.create_agreement('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'written', '{}'::jsonb)$$,
  'P0001', null,
  'a room cannot have two open agreements'
);

select lives_ok(
  $$select public.create_invite((
      select a.id from public.agreements a
      join public.tenancies t on t.id = a.tenancy_id
      where t.room_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'))$$,
  'landlord can create an invite'
);

select matches(
  (select code from public.invites where code <> 'AAAA1111' limit 1),
  '^[0-9A-F]{8}$',
  'invite code is 8 characters'
);

select is(
  (select a.status from public.agreements a
   join public.tenancies t on t.id = a.tenancy_id
   where t.room_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
  'pending',
  'agreement becomes pending once invited'
);

select throws_ok(
  $$select public.join_with_invite('AAAA1111')$$,
  '42501', null,
  'a landlord cannot join with an invite code'
);

-- ===== Landlord Two (not the owner) =====
reset role;
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true);
set local role authenticated;

select is(
  (select count(*)::int from public.agreements),
  0,
  'another landlord cannot see the agreements'
);

select throws_ok(
  $$select public.create_invite('cccccccc-cccc-4ccc-8ccc-cccccccccccc')$$,
  '42501', null,
  'another landlord cannot create an invite for this agreement'
);

-- ===== Tenant One =====
reset role;
select set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}', true);
set local role authenticated;

select is(
  (select count(*)::int from public.agreements),
  0,
  'a tenant sees nothing before joining'
);

select throws_ok(
  $$select public.join_with_invite('WRONG123')$$,
  'P0001', null,
  'a wrong code is rejected'
);

select lives_ok(
  $$select public.join_with_invite('AAAA1111')$$,
  'a tenant can join with a valid code'
);

select is((select count(*)::int from public.agreements), 1, 'tenant can see their agreement');
select is((select count(*)::int from public.rooms), 1, 'tenant can see their room');
select is((select count(*)::int from public.properties), 1, 'tenant can see their property');

-- ===== Tenant Two =====
reset role;
select set_config('request.jwt.claims', '{"sub":"55555555-5555-4555-8555-555555555555","role":"authenticated"}', true);
set local role authenticated;

select throws_ok(
  $$select public.join_with_invite('AAAA1111')$$,
  'P0001', null,
  'a code cannot be used twice'
);

select is((select count(*)::int from public.agreements), 0, 'an unrelated tenant sees no agreements');

select throws_ok(
  $$select public.accept_agreement('cccccccc-cccc-4ccc-8ccc-cccccccccccc')$$,
  'P0001', null,
  'an unrelated tenant cannot accept the agreement'
);

-- ===== Tenant One again =====
reset role;
select set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}', true);
set local role authenticated;

select throws_ok(
  $$update public.agreements set status = 'valid' where id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'$$,
  '42501', null,
  'a tenant cannot change an agreement directly'
);

select lives_ok(
  $$select public.accept_agreement('cccccccc-cccc-4ccc-8ccc-cccccccccccc')$$,
  'the tenant can accept their agreement'
);

select is(
  (select status from public.agreements where id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'),
  'valid',
  'a written agreement becomes valid when accepted'
);

-- ===== Owner (database admin) =====
reset role;

select throws_ok(
  $$update public.agreements set terms = '{}'::jsonb where id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'$$,
  '42501', null,
  'an accepted agreement is locked, even for the database owner'
);

select * from finish();
rollback;
