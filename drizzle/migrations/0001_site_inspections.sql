create table public.inspections (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (char_length(phone) between 5 and 30),
  estate text not null check (char_length(estate) between 1 and 200),
  preferred_date date not null,
  time_slot text not null check (time_slot in ('morning','afternoon')),
  note text check (char_length(note) <= 1000),
  status text not null default 'new' check (status in ('new','confirmed','done','cancelled')),
  created_at timestamptz not null default now()
);
grant insert on public.inspections to anon, authenticated;
grant select, update, delete on public.inspections to authenticated;
grant all on public.inspections to service_role;
alter table public.inspections enable row level security;
create policy "anyone books" on public.inspections for insert to anon, authenticated with check (status = 'new');
create policy "staff read inspections" on public.inspections for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff update inspections" on public.inspections for update to authenticated using (public.is_staff(auth.uid()));
create policy "staff delete inspections" on public.inspections for delete to authenticated using (public.is_staff(auth.uid()));