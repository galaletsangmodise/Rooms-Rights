create table public.documents (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  uploaded_by uuid not null default auth.uid() references public.profiles (id),
  type text not null check (type in ('agreement', 'receipt', 'photo', 'other')),
  visibility text not null default 'shared' check (visibility in ('shared', 'landlord_only')),
  file_path text not null unique,
  file_name text not null,
  file_size integer not null check (file_size > 0 and file_size <= 5242880),
  mime_type text not null
    check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'application/pdf')),
  created_at timestamptz not null default now(),
  check (file_path like room_id::text || '/%')
);

create index documents_room_idx on public.documents (room_id, created_at desc);

alter table public.documents enable row level security;

-- Read and add only. Nothing is edited or deleted in version 1.
revoke all on public.documents from anon, authenticated;
grant select, insert on public.documents to authenticated;

create policy "documents: who can see a file"
  on public.documents for select to authenticated
  using (
    public.is_admin()
    or public.owns_room(room_id)
    or (visibility = 'shared' and public.is_tenant_of_room(room_id))
  );

create policy "documents: who can add a file"
  on public.documents for insert to authenticated
  with check (
    uploaded_by = auth.uid()
    and (
      public.owns_room(room_id)
      or (visibility = 'shared' and public.is_tenant_of_room(room_id))
    )
  );

-- =========================================================
-- Private storage bucket
-- =========================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'evidence', 'evidence', false, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;

-- Files live in a folder named after the room id: <room_id>/<file>.
create function public.storage_room_access(p_name text)
returns boolean
language plpgsql stable security definer set search_path = ''
as $$
declare
  v_room uuid;
begin
  begin
    v_room := (storage.foldername(p_name))[1]::uuid;
  exception when others then
    return false;
  end;
  return public.owns_room(v_room) or public.is_tenant_of_room(v_room);
end;
$$;

revoke execute on function public.storage_room_access(text) from public, anon;
grant execute on function public.storage_room_access(text) to authenticated;

create policy "evidence: room members upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'evidence' and public.storage_room_access(name));

-- A file can be opened only if the user is allowed to see its documents row,
-- or if they uploaded it themselves.
create policy "evidence: read what documents allow"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'evidence'
    and (
      owner_id = (select auth.uid())::text
      or exists (select 1 from public.documents d where d.file_path = name)
    )
  );
