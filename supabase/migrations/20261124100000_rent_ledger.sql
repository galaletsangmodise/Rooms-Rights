create sequence public.receipt_seq;

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  tenancy_id uuid not null references public.tenancies (id) on delete cascade,
  kind text not null check (kind in ('rent', 'deposit')),
  amount numeric(10, 2) not null check (amount > 0 and amount <= 1000000),
  period date,
  paid_on date not null,
  method text not null check (method in ('cash', 'eft', 'other')),
  note text check (char_length(note) <= 200),
  receipt_no text not null unique,
  recorded_by uuid not null references public.profiles (id),
  voided_at timestamptz,
  void_reason text,
  created_at timestamptz not null default now(),
  check ((kind = 'rent' and period is not null) or (kind = 'deposit' and period is null)),
  check (period is null or period = date_trunc('month', period)::date)
);

create index payments_tenancy_idx on public.payments (tenancy_id, paid_on desc);

alter table public.payments enable row level security;

-- Read only. All writes go through the functions below.
revoke all on public.payments from anon, authenticated;
grant select on public.payments to authenticated;

create policy "payments: parties and admin can read"
  on public.payments for select to authenticated
  using (public.is_admin() or public.can_read_tenancy(tenancy_id));

-- =========================================================
-- Record a payment (landlord only)
-- =========================================================
create function public.record_payment(
  p_tenancy uuid,
  p_kind text,
  p_amount numeric,
  p_period date,
  p_paid_on date,
  p_method text,
  p_note text
)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_id uuid;
  v_period date;
begin
  if not public.owns_tenancy(p_tenancy) then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  if p_paid_on > current_date then
    raise exception 'The payment date cannot be in the future.' using errcode = '22023';
  end if;

  if p_kind = 'rent' then
    if p_period is null then
      raise exception 'Choose the month this rent is for.' using errcode = '22023';
    end if;
    v_period := date_trunc('month', p_period)::date;
  else
    v_period := null;
  end if;

  insert into public.payments
    (tenancy_id, kind, amount, period, paid_on, method, note, receipt_no, recorded_by)
  values (
    p_tenancy, p_kind, p_amount, v_period, p_paid_on, p_method,
    nullif(trim(p_note), ''),
    'RR-' || to_char(now(), 'YYMM') || '-' || lpad(nextval('public.receipt_seq')::text, 4, '0'),
    auth.uid()
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- =========================================================
-- Void a payment (landlord only, keeps the row)
-- =========================================================
create function public.void_payment(p_payment uuid, p_reason text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_tenancy uuid;
  v_voided timestamptz;
begin
  select tenancy_id, voided_at into v_tenancy, v_voided
  from public.payments where id = p_payment;

  if v_tenancy is null or not public.owns_tenancy(v_tenancy) then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  if v_voided is not null then
    raise exception 'This payment is already voided.' using errcode = '22023';
  end if;

  if char_length(trim(coalesce(p_reason, ''))) < 3 then
    raise exception 'Give a short reason for voiding.' using errcode = '22023';
  end if;

  update public.payments
  set voided_at = now(), void_reason = trim(p_reason)
  where id = p_payment;
end;
$$;

-- =========================================================
-- Everything a receipt shows, including both names
-- =========================================================
create function public.receipt_details(p_payment uuid)
returns table (
  receipt_no text,
  kind text,
  amount numeric,
  period date,
  paid_on date,
  method text,
  note text,
  voided_at timestamptz,
  void_reason text,
  room_label text,
  property_name text,
  property_address text,
  landlord_name text,
  tenant_name text
)
language sql stable security definer set search_path = ''
as $$
  select p.receipt_no, p.kind, p.amount, p.period, p.paid_on, p.method, p.note,
         p.voided_at, p.void_reason,
         r.label, pr.name, pr.address, lp.full_name, tp.full_name
  from public.payments p
  join public.tenancies t on t.id = p.tenancy_id
  join public.rooms r on r.id = t.room_id
  join public.properties pr on pr.id = r.property_id
  join public.profiles lp on lp.id = pr.landlord_id
  join public.profiles tp on tp.id = t.tenant_id
  where p.id = p_payment
    and (public.can_read_tenancy(p.tenancy_id) or public.is_admin());
$$;

revoke execute on function public.record_payment(uuid, text, numeric, date, date, text, text) from public, anon;
revoke execute on function public.void_payment(uuid, text) from public, anon;
revoke execute on function public.receipt_details(uuid) from public, anon;
grant execute on function public.record_payment(uuid, text, numeric, date, date, text, text) to authenticated;
grant execute on function public.void_payment(uuid, text) to authenticated;
grant execute on function public.receipt_details(uuid) to authenticated;
