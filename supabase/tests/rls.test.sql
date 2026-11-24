begin;
select plan(14);

-- Users: the "admin" signup must be downgraded to tenant by the trigger.
insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-4111-8111-111111111111', 'landlord-a@test.com', '{"role":"landlord","full_name":"Landlord A"}'),
  ('22222222-2222-4222-8222-222222222222', 'landlord-b@test.com', '{"role":"landlord","full_name":"Landlord B"}'),
  ('33333333-3333-4333-8333-333333333333', 'tenant@test.com',     '{"role":"tenant","full_name":"Tenant"}'),
  ('44444444-4444-4444-8444-444444444444', 'admin@test.com',      '{"role":"admin","full_name":"Admin"}');

select is(
  (select role from public.profiles where id = '44444444-4444-4444-8444-444444444444'),
  'tenant',
  'signing up as admin gives a tenant, not an admin'
);

-- The owner promotes the admin (as postgres, like you would in the SQL editor).
update public.profiles set role = 'admin' where id = '44444444-4444-4444-8444-444444444444';

-- ===== Landlord A =====
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
set local role authenticated;

select lives_ok(
  $$insert into public.properties (id, name, address)
    values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'House A', '1 Main Road')$$,
  'landlord can create a property'
);

select lives_ok(
  $$insert into public.rooms (id, property_id, label, rent_amount)
    values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Room 1', 1200)$$,
  'landlord can add a room to their own property'
);

select lives_ok(
  $$update public.profiles set full_name = 'Landlord Alpha'
    where id = '11111111-1111-4111-8111-111111111111'$$,
  'user can update their own name'
);

select throws_ok(
  $$update public.profiles set role = 'admin'
    where id = '11111111-1111-4111-8111-111111111111'$$,
  '42501',
  null,
  'user cannot change their own role'
);

select throws_ok(
  $$delete from public.rooms where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'$$,
  '42501',
  null,
  'rooms cannot be deleted (archive instead)'
);

select is(
  (select count(*)::int from public.profiles where id = '22222222-2222-4222-8222-222222222222'),
  0,
  'a landlord cannot read another landlord profile'
);

-- ===== Landlord B =====
reset role;
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true);
set local role authenticated;

select is(
  (select count(*)::int from public.properties),
  0,
  'another landlord cannot see the property'
);

select is(
  (select count(*)::int from public.rooms),
  0,
  'another landlord cannot see the room'
);

select throws_ok(
  $$insert into public.rooms (property_id, label, rent_amount)
    values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Sneaky room', 100)$$,
  '42501',
  null,
  'a landlord cannot add a room to someone else''s property'
);

-- ===== Tenant =====
reset role;
select set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}', true);
set local role authenticated;

select throws_ok(
  $$insert into public.properties (name, address) values ('Tenant house', '2 Side Street')$$,
  '42501',
  null,
  'a tenant cannot create a property'
);

select is(
  (select count(*)::int from public.properties),
  0,
  'a tenant cannot see properties they are not part of'
);

-- ===== Admin =====
reset role;
select set_config('request.jwt.claims', '{"sub":"44444444-4444-4444-8444-444444444444","role":"authenticated"}', true);
set local role authenticated;

select is(
  (select count(*)::int from public.properties),
  1,
  'admin can see all properties'
);

select cmp_ok(
  (select count(*)::int from public.profiles),
  '>=',
  4,
  'admin can see all profiles'
);

select * from finish();
rollback;