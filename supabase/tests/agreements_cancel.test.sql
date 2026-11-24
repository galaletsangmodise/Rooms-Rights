begin;
select plan(4);

insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-4111-8111-111111111111', 'l1@test.com', '{"role":"landlord","full_name":"Landlord One"}'),
  ('22222222-2222-4222-8222-222222222222', 'l2@test.com', '{"role":"landlord","full_name":"Landlord Two"}');

insert into public.properties (id, landlord_id, name, address) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'House A', '1 Main Road');
insert into public.rooms (id, property_id, label, rent_amount) values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Room 1', 1200);
insert into public.tenancies (id, room_id) values
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
insert into public.agreements (id, tenancy_id, type, terms) values
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'written', '{}');

-- Another landlord cannot cancel it
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select public.cancel_agreement('cccccccc-cccc-4ccc-8ccc-cccccccccccc')$$,
  '42501', null, 'another landlord cannot cancel the agreement'
);

-- The owner can, and the room is free again
reset role;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
set local role authenticated;
select lives_ok(
  $$select public.cancel_agreement('cccccccc-cccc-4ccc-8ccc-cccccccccccc')$$,
  'the landlord can cancel an unaccepted agreement'
);
select is(
  (select status from public.agreements where id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'),
  'superseded', 'the cancelled agreement is marked superseded'
);
select lives_ok(
  $$select public.create_agreement('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'written', '{}'::jsonb)$$,
  'the room can get a new agreement after cancelling'
);

select * from finish();
rollback;
