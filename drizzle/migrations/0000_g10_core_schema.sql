
create type public.app_role as enum ('admin','staff');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique(user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create or replace function public.is_staff(_user_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id=_user_id) $$;

create or replace function public.handle_new_staff() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_roles(user_id, role) values (new.id, 'staff') on conflict do nothing;
  if (select count(*) from public.user_roles where role='admin') = 0 then
    insert into public.user_roles(user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_created_staff after insert on auth.users for each row execute function public.handle_new_staff();

create table public.zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create table public.areas (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid not null references public.zones(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique(zone_id, name)
);
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text,
  category text not null check (category in ('house','residential_land','commercial_land','farm','shop')),
  transaction text not null check (transaction in ('sale','rent')),
  condition text check (condition in ('completed','semi_completed','incomplete')),
  price numeric not null default 0,
  easy_buy boolean not null default false,
  unit_no text,
  units_available int not null default 1,
  size_text text,
  contact_phone text,
  zone_id uuid references public.zones(id) on delete set null,
  area_id uuid references public.areas(id) on delete set null,
  status text not null default 'available' check (status in ('available','reserved','sold')),
  published boolean not null default true,
  featured boolean not null default false,
  cover_key text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.property_photos (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null,
  path text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  property_code text,
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (char_length(phone) between 5 and 30),
  message text check (char_length(message) <= 2000),
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);
create table public.sales (
  id uuid primary key default gen_random_uuid(),
  receipt_no text not null unique,
  property_id uuid references public.properties(id) on delete set null,
  property_code text,
  property_title text,
  plot_details text,
  buyer_name text not null,
  buyer_phone text not null,
  buyer_address text,
  amount numeric not null default 0,
  amount_paid numeric not null default 0,
  payment_method text not null check (payment_method in ('full','easy_buy')),
  months int,
  monthly numeric,
  notes text,
  sale_date date not null default current_date,
  created_by uuid,
  created_at timestamptz not null default now()
);

grant select on public.zones, public.areas, public.properties, public.property_photos to anon, authenticated;
grant insert, update, delete on public.zones, public.areas, public.properties, public.property_photos to authenticated;
grant insert on public.inquiries to anon, authenticated;
grant select, update, delete on public.inquiries to authenticated;
grant select, insert, update, delete on public.sales to authenticated;
grant all on public.zones, public.areas, public.properties, public.property_photos, public.inquiries, public.sales to service_role;

alter table public.zones enable row level security;
alter table public.areas enable row level security;
alter table public.properties enable row level security;
alter table public.property_photos enable row level security;
alter table public.inquiries enable row level security;
alter table public.sales enable row level security;

create policy "public zones" on public.zones for select using (true);
create policy "staff zones" on public.zones for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "public areas" on public.areas for select using (true);
create policy "staff areas" on public.areas for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "public listings" on public.properties for select using (published or public.is_staff(auth.uid()));
create policy "staff listings" on public.properties for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "public photos" on public.property_photos for select using (true);
create policy "staff photos" on public.property_photos for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "anyone inquires" on public.inquiries for insert to anon, authenticated with check (status = 'new');
create policy "staff read inquiries" on public.inquiries for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff update inquiries" on public.inquiries for update to authenticated using (public.is_staff(auth.uid()));
create policy "staff delete inquiries" on public.inquiries for delete to authenticated using (public.is_staff(auth.uid()));
create policy "staff sales" on public.sales for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create or replace function public.next_property_code(_prefix text) returns text
language plpgsql stable security definer set search_path = public as $$
declare n int;
begin
  if not public.is_staff(auth.uid()) then raise exception 'not allowed'; end if;
  select coalesce(max((regexp_match(code, '-(\d+)$'))[1]::int), 0) + 1 into n
    from public.properties where code ~ ('^' || _prefix || '-\d+$');
  return _prefix || '-' || lpad(n::text, 3, '0');
end $$;
create or replace function public.next_receipt_no() returns text
language plpgsql stable security definer set search_path = public as $$
declare y text := to_char(now(), 'YYYY'); n int;
begin
  if not public.is_staff(auth.uid()) then raise exception 'not allowed'; end if;
  select coalesce(max((regexp_match(receipt_no, '-(\d+)$'))[1]::int), 0) + 1 into n
    from public.sales where receipt_no like 'G10-RCP-' || y || '-%';
  return 'G10-RCP-' || y || '-' || lpad(n::text, 4, '0');
end $$;
grant execute on function public.next_property_code(text), public.next_receipt_no() to authenticated;

create policy "staff read photo files" on storage.objects for select to authenticated using (bucket_id = 'property-photos' and public.is_staff(auth.uid()));
create policy "staff upload photo files" on storage.objects for insert to authenticated with check (bucket_id = 'property-photos' and public.is_staff(auth.uid()));
create policy "staff delete photo files" on storage.objects for delete to authenticated using (bucket_id = 'property-photos' and public.is_staff(auth.uid()));

insert into public.zones (name, description, sort) values
 ('Fatara Phase 3 Estate','Residential & commercial plots with proposed Arena, Clinic, Mosque, School and Shopping Complex.',1),
 ('Chara-Chara G.R.A Azare Phase 2','Serviced G.R.A plots off Chara-Chara.',2),
 ('Sabuwar Chara-Chara (G.R.A Road)','New layout along the G.R.A road by Chara-Chara.',3),
 ('Central Azare / Old Kano Road','Commercial heart of Azare town.',4),
 ('Katagum / Shira Road Corridor','Growing corridor towards Katagum and Shira.',5),
 ('Agricultural & Industrial Outskirts','Developing farmland and industrial land around Azare.',6);

insert into public.areas (zone_id, name) select id, a from public.zones z, unnest(case z.name
 when 'Fatara Phase 3 Estate' then array['Residential Block A','Residential Block B','Commercial Strip']
 when 'Chara-Chara G.R.A Azare Phase 2' then array['G.R.A Kan Hanyan Chara-Chara']
 when 'Sabuwar Chara-Chara (G.R.A Road)' then array['G.R.A Road Frontage']
 when 'Central Azare / Old Kano Road' then array['Old Kano Road','Azare Market Area']
 when 'Katagum / Shira Road Corridor' then array['Shira Road','Katagum Road']
 else array['Farm Belt','Industrial Layout'] end) a;

insert into public.properties (code,title,description,category,transaction,condition,price,easy_buy,unit_no,units_available,size_text,zone_id,area_id,featured,cover_key,lat,lng)
select v.code,v.title,v.descr,v.cat,v.tx,v.cond,v.price,v.eb,v.unit,v.units,v.size,z.id,a.id,v.feat,v.cover,v.lat,v.lng
from (values
 ('G10-S-RL-001','Residential Plot – Fatara Phase 3','Dry, surveyed 50×100ft plot inside Fatara Phase 3 Estate close to the proposed school, mosque and clinic.','residential_land','sale',null,2500000,true,'Plot 42',12,'50ft × 100ft','Fatara Phase 3 Estate','Residential Block A',true,'brochure',11.6835,10.1985),
 ('G10-S-CL-001','Commercial Plot – Fatara Shopping Strip','Road-facing commercial plot beside the proposed shopping complex.','commercial_land','sale',null,4500000,true,'Plot 7C',4,'50ft × 100ft','Fatara Phase 3 Estate','Commercial Strip',true,'brochure',11.6842,10.1991),
 ('G10-S-RL-002','G.R.A Plot – Chara-Chara Phase 2','14m × 14m Easy Buy plot at G.R.A Kan Hanyan Chara-Chara. Form ₦10,000, first payment ₦160,000, then ₦40,000 monthly for 6 months.','residential_land','sale',null,410000,true,'Plot 18',20,'14m × 14m','Chara-Chara G.R.A Azare Phase 2','G.R.A Kan Hanyan Chara-Chara',true,'land',11.6712,10.1878),
 ('G10-S-HC-001','3-Bedroom Bungalow – Sabuwar Chara-Chara','Completed 3-bedroom bungalow with POP ceilings, interlocking compound and fence.','house','sale','completed',18500000,true,'House 7B',1,'50ft × 100ft','Sabuwar Chara-Chara (G.R.A Road)','G.R.A Road Frontage',false,'house',11.6755,10.1902),
 ('G10-R-HC-001','2-Bedroom Flat for Rent – Old Kano Road','Completed 2-bedroom flat close to the market. Yearly rent.','house','rent','completed',600000,false,'Flat 3',2,null,'Central Azare / Old Kano Road','Old Kano Road',false,'house',11.6790,10.1930),
 ('G10-R-SH-001','Shop for Rent – Azare Market Area','Lock-up shop on a busy road. Yearly rent.','shop','rent',null,250000,false,'Shop 14',3,null,'Central Azare / Old Kano Road','Azare Market Area',false,'house',11.6801,10.1944),
 ('G10-S-FM-001','5-Hectare Farmland – Azare Outskirts','Fertile farmland with road access, ideal for grains and orchards.','farm','sale',null,3500000,true,'Farm 2',2,'5 hectares','Agricultural & Industrial Outskirts','Farm Belt',false,'land',11.7010,10.2200)
) as v(code,title,descr,cat,tx,cond,price,eb,unit,units,size,zname,aname,feat,cover,lat,lng)
join public.zones z on z.name=v.zname join public.areas a on a.zone_id=z.id and a.name=v.aname;
