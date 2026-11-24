-- =========================================================
-- Tables (created first: the helper functions below read them)
-- =========================================================
create table public.tenancies (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  tenant_id uuid references public.profiles (id),
  status text not null default 'draft'
    check (status in ('draft', 'invited', 'active', 'ended')),
  created_at timestamptz not null default now()
);

-- A room can only have one open tenancy at a time.
create unique index one_open_tenancy_per_room
  on public.tenancies (room_id) where status <> 'ended';

create index tenancies_tenant_idx on public.tenancies (tenant_id);

create table public.agreements (
  id uuid primary key default gen_random_uuid(),
  tenancy_id uuid not null references public.tenancies (id) on delete cascade,
  type text not null check (type in ('written', 'oral')),
  version integer not null default 1,
  status text not null default 'draft'
    check (status in ('draft', 'pending', 'valid', 'recorded', 'superseded')),
  terms jsonb not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index agreements_tenancy_idx on public.agreements (tenancy_id);

create table public.invites (
  id uuid primary key default gen_random_uuid(),
  tenancy_id uuid not null references public.tenancies (id) on delete cascade,
  code text not null unique,
  expires_at timestamptz not null default (now() + interval '7 days'),
  used_by uuid references public.profiles (id),
  used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

-- =========================================================
-- Helper functions (security definer, so policies don't loop)
-- =========================================================
create function public.owns_room(p_room uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.rooms r
    join public.properties p on p.id = r.property_id
    where r.id = p_room and p.landlord_id = auth.uid()
  )
$$;

create function public.is_tenant_of_room(p_room uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.tenancies t
    where t.room_id = p_room and t.tenant_id = auth.uid()
  )
$$;

create function public.is_tenant_of_property(p_property uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.rooms r
    join public.tenancies t on t.room_id = r.id
    where r.property_id = p_property and t.tenant_id = auth.uid()
  )
$$;

create function public.owns_tenancy(p_tenancy uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.tenancies t
    where t.id = p_tenancy and public.owns_room(t.room_id)
  )
$$;

create function public.can_read_tenancy(p_tenancy uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.tenancies t
    where t.id = p_tenancy
      and (t.tenant_id = auth.uid() or public.owns_room(t.room_id) or public.is_admin())
  )
$$;

alter table public.tenancies enable row level security;
alter table public.agreements enable row level security;
alter table public.invites enable row level security;

-- App users can only READ these tables. All writes go through the functions below.
revoke all on public.tenancies, public.agreements, public.invites from anon, authenticated;
grant select on public.tenancies, public.agreements, public.invites to authenticated;

create policy "tenancies: parties and admin read"
  on public.tenancies for select to authenticated
  using (tenant_id = auth.uid() or public.owns_room(room_id) or public.is_admin());

create policy "agreements: parties and admin read"
  on public.agreements for select to authenticated
  using (public.can_read_tenancy(tenancy_id));

-- Only the landlord who owns the room can see invites. Tenants never can.
create policy "invites: landlord reads own"
  on public.invites for select to authenticated
  using (public.owns_tenancy(tenancy_id));

-- Tenants can read the room and property they rent.
create policy "rooms: tenant reads own room"
  on public.rooms for select to authenticated
  using (public.is_tenant_of_room(id));

create policy "properties: tenant reads own property"
  on public.properties for select to authenticated
  using (public.is_tenant_of_property(id));

-- =========================================================
-- Accepted agreements cannot be changed
-- =========================================================
create function public.lock_accepted_agreements()
returns trigger
language plpgsql
as $$
begin
  if old.status in ('valid', 'recorded') and new.status <> 'superseded' then
    raise exception 'An accepted agreement cannot be changed' using errcode = '42501';
  end if;
  if old.status = 'superseded' then
    raise exception 'A superseded agreement cannot be changed' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger lock_accepted_agreements
  before update on public.agreements
  for each row execute function public.lock_accepted_agreements();

-- =========================================================
-- Write functions
-- =========================================================

-- Landlord: create a tenancy and a draft agreement together.
create function public.create_agreement(p_room uuid, p_type text, p_terms jsonb)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_tenancy uuid;
  v_agreement uuid;
begin
  if public.current_user_role() is distinct from 'landlord' or not public.owns_room(p_room) then
    raise exception 'Not allowed' using errcode = '42501';
  end if;
  if p_type not in ('written', 'oral') then
    raise exception 'Invalid agreement type' using errcode = '22023';
  end if;
  if exists (select 1 from public.tenancies where room_id = p_room and status <> 'ended') then
    raise exception 'This room already has an agreement in progress' using errcode = 'P0001';
  end if;

  insert into public.tenancies (room_id) values (p_room) returning id into v_tenancy;
  insert into public.agreements (tenancy_id, type, terms)
    values (v_tenancy, p_type, p_terms) returning id into v_agreement;

  return v_agreement;
end;
$$;

-- Landlord: make a new invite code (cancels any earlier unused one).
create function public.create_invite(p_agreement uuid)
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  v_tenancy uuid;
  v_room uuid;
  v_code text;
begin
  select a.tenancy_id, t.room_id into v_tenancy, v_room
  from public.agreements a
  join public.tenancies t on t.id = a.tenancy_id
  where a.id = p_agreement;

  if v_tenancy is null or not public.owns_room(v_room) then
    raise exception 'Not allowed' using errcode = '42501';
  end if;

  update public.invites set revoked_at = now()
  where tenancy_id = v_tenancy and used_at is null and revoked_at is null;

  v_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  insert into public.invites (tenancy_id, code) values (v_tenancy, v_code);

  update public.agreements set status = 'pending' where id = p_agreement and status = 'draft';
  update public.tenancies set status = 'invited' where id = v_tenancy and status = 'draft';

  return v_code;
end;
$$;

-- Landlord: cancel the current invite.
create function public.revoke_invite(p_tenancy uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.owns_tenancy(p_tenancy) then
    raise exception 'Not allowed' using errcode = '42501';
  end if;
  update public.invites set revoked_at = now()
  where tenancy_id = p_tenancy and used_at is null and revoked_at is null;
end;
$$;

-- Tenant: join a room with a code. Works once. Returns the agreement to review.
create function public.join_with_invite(p_code text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_invite public.invites;
  v_agreement uuid;
begin
  if public.current_user_role() is distinct from 'tenant' then
    raise exception 'Only tenants can join a room' using errcode = '42501';
  end if;

  select * into v_invite from public.invites where code = upper(trim(p_code)) for update;

  if not found
     or v_invite.revoked_at is not null
     or v_invite.used_at is not null
     or v_invite.expires_at < now() then
    raise exception 'This code is invalid or has expired' using errcode = 'P0001';
  end if;

  update public.tenancies set tenant_id = auth.uid()
  where id = v_invite.tenancy_id and tenant_id is null;
  if not found then
    raise exception 'This code is invalid or has expired' using errcode = 'P0001';
  end if;

  update public.invites set used_by = auth.uid(), used_at = now() where id = v_invite.id;

  select id into v_agreement
  from public.agreements
  where tenancy_id = v_invite.tenancy_id and status = 'pending'
  order by version desc limit 1;

  return v_agreement;
end;
$$;

-- Tenant: accept the agreement (written → valid, oral → recorded).
create function public.accept_agreement(p_agreement uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_tenancy uuid;
  v_type text;
  v_status text;
begin
  select a.tenancy_id, a.type, a.status into v_tenancy, v_type, v_status
  from public.agreements a
  join public.tenancies t on t.id = a.tenancy_id
  where a.id = p_agreement and t.tenant_id = auth.uid();

  if not found or v_status <> 'pending' then
    raise exception 'There is nothing to accept' using errcode = 'P0001';
  end if;

  update public.agreements
  set status = case when v_type = 'oral' then 'recorded' else 'valid' end,
      accepted_at = now()
  where id = p_agreement;

  update public.tenancies set status = 'active' where id = v_tenancy;
end;
$$;

-- Only signed-in users can call the functions.
revoke execute on function
  public.owns_room(uuid), public.is_tenant_of_room(uuid), public.is_tenant_of_property(uuid),
  public.owns_tenancy(uuid), public.can_read_tenancy(uuid),
  public.create_agreement(uuid, text, jsonb), public.create_invite(uuid),
  public.revoke_invite(uuid), public.join_with_invite(text), public.accept_agreement(uuid)
  from public, anon;

grant execute on function
  public.owns_room(uuid), public.is_tenant_of_room(uuid), public.is_tenant_of_property(uuid),
  public.owns_tenancy(uuid), public.can_read_tenancy(uuid),
  public.create_agreement(uuid, text, jsonb), public.create_invite(uuid),
  public.revoke_invite(uuid), public.join_with_invite(text), public.accept_agreement(uuid)
  to authenticated;
