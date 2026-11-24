create table public.clauses (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 80),
  body text not null check (char_length(body) between 10 and 1000),
  active boolean not null default true,
  created_by uuid references public.profiles (id) default auth.uid(),
  created_at timestamptz not null default now()
);

alter table public.clauses enable row level security;

revoke all on public.clauses from anon, authenticated;
grant select on public.clauses to authenticated;

-- Landlords see active clauses. The admin sees everything.
create policy "clauses: landlords read active, admin reads all"
  on public.clauses for select to authenticated
  using (
    public.is_admin()
    or (active and public.current_user_role() = 'landlord')
  );

create function public.add_clause(p_title text, p_body text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_id uuid;
begin
  if not public.is_admin() then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  insert into public.clauses (title, body)
  values (trim(p_title), trim(p_body))
  returning id into v_id;

  return v_id;
end;
$$;

create function public.set_clause_active(p_id uuid, p_active boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  update public.clauses set active = p_active where id = p_id;
end;
$$;

revoke execute on function public.add_clause(text, text) from public, anon;
revoke execute on function public.set_clause_active(uuid, boolean) from public, anon;
grant execute on function public.add_clause(text, text) to authenticated;
grant execute on function public.set_clause_active(uuid, boolean) to authenticated;

-- Starter clauses. Have a legal professional review these before real use.
insert into public.clauses (title, body, created_by) values
  ('Notice to end the agreement',
   'Either party may end this agreement by giving the other party [30] days'' written notice.', null),
  ('Visitors',
   'The tenant may have visitors during the day. Overnight guests must be agreed with the landlord first.', null),
  ('Water and electricity',
   'Water and electricity are [included in the rent / paid separately by the tenant]. Any change must be agreed in writing.', null),
  ('Quiet hours',
   'Both parties agree to keep noise down between [22:00] and [06:00] out of respect for everyone on the property.', null);
