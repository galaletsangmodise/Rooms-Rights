create table public.properties (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  address text not null check (length(trim(address)) > 0),
  suburb text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  label text not null check (length(trim(label)) > 0),
  rent_amount integer not null check (rent_amount > 0),
  deposit_amount integer not null default 0 check (deposit_amount >= 0),
  rent_due_day smallint not null default 1 check (rent_due_day between 1 and 31),
  electricity text not null default 'included'
    check (electricity in ('included', 'prepaid_meter', 'shared', 'none')),
  water text not null default 'included'
    check (water in ('included', 'shared', 'none')),
  house_rules text not null default '',
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create index rooms_property_id_idx on public.rooms (property_id);

alter table public.properties enable row level security;
alter table public.rooms enable row level security;

-- No delete: rooms are archived, never removed.
revoke all on public.properties, public.rooms from anon, authenticated;
grant select, insert, update on public.properties, public.rooms to authenticated;

-- Properties
create policy "properties: landlord reads own"
  on public.properties for select to authenticated
  using (landlord_id = auth.uid());

create policy "properties: admin reads all"
  on public.properties for select to authenticated
  using (public.is_admin());

create policy "properties: landlord inserts own"
  on public.properties for insert to authenticated
  with check (landlord_id = auth.uid() and public.current_user_role() = 'landlord');

create policy "properties: landlord updates own"
  on public.properties for update to authenticated
  using (landlord_id = auth.uid())
  with check (landlord_id = auth.uid());

-- Rooms (access follows ownership of the property)
create policy "rooms: landlord reads own"
  on public.rooms for select to authenticated
  using (exists (
    select 1 from public.properties p
    where p.id = property_id and p.landlord_id = auth.uid()
  ));

create policy "rooms: admin reads all"
  on public.rooms for select to authenticated
  using (public.is_admin());

create policy "rooms: landlord inserts in own property"
  on public.rooms for insert to authenticated
  with check (
    public.current_user_role() = 'landlord'
    and exists (
      select 1 from public.properties p
      where p.id = property_id and p.landlord_id = auth.uid()
    )
  );

create policy "rooms: landlord updates own"
  on public.rooms for update to authenticated
  using (exists (
    select 1 from public.properties p
    where p.id = property_id and p.landlord_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.properties p
    where p.id = property_id and p.landlord_id = auth.uid()
  ));