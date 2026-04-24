-- Auth, Storage a geokódování

-- PROFILES (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.profiles enable row level security;

create policy "Profiles public read"
  on public.profiles for select using (true);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

-- PROPERTIES: attach owner + coordinates + main image
alter table public.properties
  add column user_id uuid references public.profiles(id) on delete cascade,
  add column latitude double precision,
  add column longitude double precision,
  add column main_image_url text;

-- Replace open insert policy with authenticated-only, tied to user_id
drop policy if exists "Anyone can insert properties" on public.properties;

create policy "Authenticated users can insert properties"
  on public.properties for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Owners can update their properties"
  on public.properties for update to authenticated
  using (auth.uid() = user_id);

create policy "Owners can delete their properties"
  on public.properties for delete to authenticated
  using (auth.uid() = user_id);

create index idx_properties_user_id on public.properties(user_id);
create index idx_properties_lat_lng on public.properties(latitude, longitude);

-- PROPERTY IMAGES
create table public.property_images (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  url text not null,
  position smallint not null default 0,
  created_at timestamptz default now() not null
);
alter table public.property_images enable row level security;

create policy "Public can view property images"
  on public.property_images for select using (true);

create policy "Owners can insert images"
  on public.property_images for insert to authenticated
  with check (
    exists (select 1 from public.properties where id = property_id and user_id = auth.uid())
  );

create policy "Owners can delete images"
  on public.property_images for delete to authenticated
  using (
    exists (select 1 from public.properties where id = property_id and user_id = auth.uid())
  );

create index idx_property_images_property_id on public.property_images(property_id);

-- STORAGE BUCKET
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view property images (storage)" on storage.objects;
drop policy if exists "Authenticated can upload property images" on storage.objects;
drop policy if exists "Users can delete own property images" on storage.objects;

create policy "Public can view property images (storage)"
  on storage.objects for select
  using (bucket_id = 'property-images');

create policy "Authenticated can upload property images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'property-images');

create policy "Users can delete own property images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
