begin;
select plan(10);

insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-4111-8111-111111111111', 'l1@test.com', '{"role":"landlord","full_name":"Landlord One"}'),
  ('22222222-2222-4222-8222-222222222222', 'l2@test.com', '{"role":"landlord","full_name":"Landlord Two"}'),
  ('33333333-3333-4333-8333-333333333333', 't1@test.com', '{"role":"tenant","full_name":"Tenant One"}'),
  ('55555555-5555-4555-8555-555555555555', 't2@test.com', '{"role":"tenant","full_name":"Tenant Two"}');

insert into public.properties (id, landlord_id, name, address) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'House A', '1 Main Road');
insert into public.rooms (id, property_id, label, rent_amount) values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Room 1', 1200);
insert into public.tenancies (room_id, tenant_id, status) values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '33333333-3333-4333-8333-333333333333', 'active');

-- ===== Landlord One =====
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
set local role authenticated;

select lives_ok(
  $$insert into public.documents (room_id, type, visibility, file_path, file_name, file_size, mime_type)
    values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'agreement', 'shared',
            'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb/a.pdf', 'a.pdf', 1000, 'application/pdf')$$,
  'landlord can add a shared file'
);

select lives_ok(
  $$insert into public.documents (room_id, type, visibility, file_path, file_name, file_size, mime_type)
    values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'other', 'landlord_only',
            'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb/b.pdf', 'b.pdf', 1000, 'application/pdf')$$,
  'landlord can add a private file'
);

-- ===== Tenant One (the room's tenant) =====
reset role;
select set_config('request.jwt.claims', '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}', true);
set local role authenticated;

select is(
  (select count(*)::int from public.documents),
  1,
  'tenant sees the shared file but not the landlord-only file'
);

select lives_ok(
  $$insert into public.documents (room_id, type, visibility, file_path, file_name, file_size, mime_type)
    values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'photo', 'shared',
            'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb/c.jpg', 'c.jpg', 2000, 'image/jpeg')$$,
  'tenant can add a shared file'
);

select throws_ok(
  $$insert into public.documents (room_id, type, visibility, file_path, file_name, file_size, mime_type)
    values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'photo', 'landlord_only',
            'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb/d.jpg', 'd.jpg', 2000, 'image/jpeg')$$,
  '42501', null,
  'tenant cannot add a landlord-only file'
);

-- ===== Tenant Two (unrelated) =====
reset role;
select set_config('request.jwt.claims', '{"sub":"55555555-5555-4555-8555-555555555555","role":"authenticated"}', true);
set local role authenticated;

select is((select count(*)::int from public.documents), 0, 'an unrelated tenant sees no files');

select throws_ok(
  $$insert into public.documents (room_id, type, visibility, file_path, file_name, file_size, mime_type)
    values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'photo', 'shared',
            'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb/e.jpg', 'e.jpg', 2000, 'image/jpeg')$$,
  '42501', null,
  'an unrelated tenant cannot add a file to the room'
);

-- ===== Landlord Two (not the owner) =====
reset role;
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true);
set local role authenticated;

select is((select count(*)::int from public.documents), 0, 'another landlord sees no files');

-- ===== Landlord One again =====
reset role;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
set local role authenticated;

select is((select count(*)::int from public.documents), 3, 'landlord sees all three files');

select throws_ok(
  $$delete from public.documents where file_name = 'a.pdf'$$,
  '42501', null,
  'files cannot be deleted'
);

select * from finish();
rollback;
