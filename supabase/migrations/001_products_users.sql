create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  sku text unique,
  price numeric(12,2) not null default 0 check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Authenticated users can read products" on public.products;
create policy "Authenticated users can read products" on public.products for select to authenticated using (true);
drop policy if exists "Users can create products" on public.products;
create policy "Users can create products" on public.products for insert to authenticated with check (auth.uid() = created_by);
drop policy if exists "Owners can update products" on public.products;
create policy "Owners can update products" on public.products for update to authenticated using (auth.uid() = created_by) with check (auth.uid() = created_by);
drop policy if exists "Owners can delete products" on public.products;
create policy "Owners can delete products" on public.products for delete to authenticated using (auth.uid() = created_by);

create index if not exists products_created_by_idx on public.products(created_by);
create index if not exists products_active_idx on public.products(active);
