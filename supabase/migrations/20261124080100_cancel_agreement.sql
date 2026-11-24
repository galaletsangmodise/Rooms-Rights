create function public.cancel_agreement(p_agreement uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_tenancy uuid;
  v_room uuid;
  v_status text;
begin
  select a.tenancy_id, t.room_id, a.status into v_tenancy, v_room, v_status
  from public.agreements a
  join public.tenancies t on t.id = a.tenancy_id
  where a.id = p_agreement;

  if v_tenancy is null or not public.owns_room(v_room) then
    raise exception 'Not allowed' using errcode = '42501';
  end if;
  if v_status not in ('draft', 'pending') then
    raise exception 'Only an agreement that has not been accepted can be cancelled' using errcode = 'P0001';
  end if;

  update public.invites set revoked_at = now()
  where tenancy_id = v_tenancy and used_at is null and revoked_at is null;
  update public.agreements set status = 'superseded' where id = p_agreement;
  update public.tenancies set status = 'ended' where id = v_tenancy;
end;
$$;

revoke execute on function public.cancel_agreement(uuid) from public, anon;
grant execute on function public.cancel_agreement(uuid) to authenticated;
