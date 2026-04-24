-- Najdisibydleni.cz — init schema (bez auth, zatím)

create type public.offer_type as enum ('prodej', 'pronajem');
create type public.property_type as enum ('byt', 'dum', 'pozemek', 'chata', 'novostavba', 'komercni');
create type public.property_status as enum ('aktivni', 'rezervovano', 'prodano', 'neaktivni');
create type public.seller_type as enum ('owner', 'agent', 'dev');

create table public.properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null default '',
  offer_type public.offer_type not null,
  property_type public.property_type not null,
  status public.property_status not null default 'aktivni',
  price integer not null,
  area integer not null,
  disposition text,
  city text not null,
  district text,
  street text,
  zip_code text,
  floor smallint,
  total_floors smallint,
  condition_note text,
  energy_class text,
  has_parking boolean default false,
  has_balcony boolean default false,
  has_garden boolean default false,
  has_elevator boolean default false,
  seller_name text,
  seller_email text,
  seller_phone text,
  seller_kind public.seller_type default 'owner',
  seed_index smallint default 1,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.properties enable row level security;

create policy "Properties are viewable by everyone"
  on public.properties for select using (true);

create policy "Anyone can insert properties"
  on public.properties for insert with check (true);

create index idx_properties_offer_type on public.properties(offer_type);
create index idx_properties_property_type on public.properties(property_type);
create index idx_properties_city on public.properties(city);
create index idx_properties_price on public.properties(price);
create index idx_properties_created_at on public.properties(created_at desc);

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger properties_updated_at
  before update on public.properties
  for each row execute procedure public.update_updated_at();
