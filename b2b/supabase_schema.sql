-- =======================================================
-- MOUNTAIN VIP TRANSFER - B2B PORTAL DATABASE SCHEMA
-- Paste this script into the Supabase SQL Editor to set up.
-- =======================================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (User roles management)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text default 'agency'::text check (role in ('admin', 'agency')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- 2. AGENCIES TABLE (Agency limits, balance & discounts)
create table public.agencies (
  id uuid references public.profiles(id) on delete cascade primary key,
  company_name text not null,
  contact_person text,
  phone text,
  discount_rate numeric(5,2) default 15.00, -- Default 15% discount
  credit_limit numeric(10,2) default 5000.00, -- Default €5000 limit
  balance numeric(10,2) default 0.00,        -- Current outstanding balance
  status text default 'active'::text check (status in ('active', 'suspended')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on agencies
alter table public.agencies enable row level security;

-- 3. BOOKINGS TABLE (B2B transfers)
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  booking_code text unique not null,
  agency_id uuid references public.agencies(id) on delete cascade,
  passenger_name text not null,
  pax integer not null,
  luggage integer not null,
  flight_number text,
  pickup_date date not null,
  pickup_time time not null,
  pickup_location text not null,
  dropoff_location text not null,
  vehicle_type text not null,                -- 'vito' / 'sprinter' / 'premium'
  base_price numeric(10,2) not null,         -- Retail price in EUR
  agency_price numeric(10,2) not null,       -- Special B2B price in EUR
  status text default 'pending'::text check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on bookings
alter table public.bookings enable row level security;


-- =======================================================
-- AUTOMATIC SIGNUP TRIGGER
-- =======================================================
-- Create profile & agency record automatically on auth.users insert
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'role', 'agency')
  );

  insert into public.agencies (id, company_name, contact_person, phone, discount_rate, credit_limit, balance, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'company_name', 'Yeni Acente'),
    coalesce(new.raw_user_meta_data->>'contact_person', 'Yetkili Kişi'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce((new.raw_user_meta_data->>'discount_rate')::numeric, 15.00),
    coalesce((new.raw_user_meta_data->>'credit_limit')::numeric, 5000.00),
    0.00,
    'active'
  );

  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists, then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- =======================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================

-- 1. Profiles Policies
create policy "Allow users to read their own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Allow admins read/write all profiles" 
  on public.profiles for all 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 2. Agencies Policies
create policy "Allow agencies to read their own agency details" 
  on public.agencies for select 
  using (auth.uid() = id);

create policy "Allow admins read/write all agencies" 
  on public.agencies for all 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 3. Bookings Policies
create policy "Allow agencies to read their own bookings" 
  on public.bookings for select 
  using (agency_id = auth.uid());

create policy "Allow agencies to insert their own bookings" 
  on public.bookings for insert 
  with check (agency_id = auth.uid());

create policy "Allow admins read/write all bookings" 
  on public.bookings for all 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );
