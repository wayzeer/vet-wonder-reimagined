-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create role enum
create type public.app_role as enum ('admin', 'staff', 'client');

-- Create appointment status enum
create type public.appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled');

-- Create payment status enum
create type public.payment_status as enum ('pending', 'completed', 'refunded', 'failed');

-- Clinics table
create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  email text,
  description text,
  logo_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.clinics enable row level security;

-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- User roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  clinic_id uuid references public.clinics(id) on delete cascade,
  role app_role not null,
  created_at timestamp with time zone default now(),
  unique (user_id, clinic_id, role)
);

alter table public.user_roles enable row level security;

-- Pets table
create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  species text not null,
  breed text,
  date_of_birth date,
  gender text,
  weight numeric,
  photo_url text,
  microchip_id text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.pets enable row level security;

-- Appointments table
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references public.clinics(id) on delete cascade not null,
  pet_id uuid references public.pets(id) on delete cascade not null,
  client_id uuid references auth.users(id) on delete cascade not null,
  veterinarian_id uuid references auth.users(id) on delete set null,
  appointment_date timestamp with time zone not null,
  duration_minutes integer default 30,
  appointment_type text not null,
  status appointment_status default 'pending',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.appointments enable row level security;

-- Medical records table
create table public.medical_records (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade not null,
  clinic_id uuid references public.clinics(id) on delete cascade not null,
  appointment_id uuid references public.appointments(id) on delete set null,
  veterinarian_id uuid references auth.users(id) on delete set null,
  record_type text not null,
  title text not null,
  description text,
  diagnosis text,
  treatment text,
  prescription text,
  attachments jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.medical_records enable row level security;

-- Vaccinations table
create table public.vaccinations (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade not null,
  vaccine_name text not null,
  vaccine_date date not null,
  next_due_date date,
  veterinarian_id uuid references auth.users(id) on delete set null,
  batch_number text,
  notes text,
  created_at timestamp with time zone default now()
);

alter table public.vaccinations enable row level security;

-- Payments table
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references public.clinics(id) on delete cascade not null,
  client_id uuid references auth.users(id) on delete cascade not null,
  appointment_id uuid references public.appointments(id) on delete set null,
  amount numeric not null,
  currency text default 'USD',
  status payment_status default 'pending',
  stripe_payment_id text,
  description text,
  invoice_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.payments enable row level security;

-- Gallery photos table
create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references public.clinics(id) on delete cascade not null,
  title text,
  description text,
  photo_url text not null,
  category text,
  display_order integer,
  created_at timestamp with time zone default now()
);

alter table public.gallery_photos enable row level security;

-- Blog posts table
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references public.clinics(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  featured_image_url text,
  category text,
  published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.blog_posts enable row level security;

-- Security definer function for role checking
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Security definer function for clinic staff checking
create or replace function public.is_clinic_staff(_user_id uuid, _clinic_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and clinic_id = _clinic_id
      and role in ('admin', 'staff')
  )
$$;

-- RLS Policies

-- Clinics policies (public read, staff write)
create policy "Anyone can view clinics"
  on public.clinics for select
  using (true);

create policy "Admins can manage clinics"
  on public.clinics for all
  using (public.has_role(auth.uid(), 'admin'));

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- User roles policies
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can manage all roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'));

-- Pets policies
create policy "Users can view their own pets"
  on public.pets for select
  using (auth.uid() = owner_id);

create policy "Users can manage their own pets"
  on public.pets for all
  using (auth.uid() = owner_id);

create policy "Staff can view all pets"
  on public.pets for select
  using (public.has_role(auth.uid(), 'staff') or public.has_role(auth.uid(), 'admin'));

-- Appointments policies
create policy "Users can view their own appointments"
  on public.appointments for select
  using (auth.uid() = client_id);

create policy "Users can create their own appointments"
  on public.appointments for insert
  with check (auth.uid() = client_id);

create policy "Staff can view clinic appointments"
  on public.appointments for select
  using (public.is_clinic_staff(auth.uid(), clinic_id));

create policy "Staff can manage clinic appointments"
  on public.appointments for all
  using (public.is_clinic_staff(auth.uid(), clinic_id));

-- Medical records policies
create policy "Pet owners can view their pets' records"
  on public.medical_records for select
  using (
    exists (
      select 1 from public.pets
      where pets.id = medical_records.pet_id
        and pets.owner_id = auth.uid()
    )
  );

create policy "Staff can manage clinic medical records"
  on public.medical_records for all
  using (public.is_clinic_staff(auth.uid(), clinic_id));

-- Vaccinations policies
create policy "Pet owners can view their pets' vaccinations"
  on public.vaccinations for select
  using (
    exists (
      select 1 from public.pets
      where pets.id = vaccinations.pet_id
        and pets.owner_id = auth.uid()
    )
  );

create policy "Staff can manage vaccinations"
  on public.vaccinations for all
  using (
    exists (
      select 1 from public.pets
      join public.appointments on appointments.pet_id = pets.id
      where pets.id = vaccinations.pet_id
        and public.is_clinic_staff(auth.uid(), appointments.clinic_id)
    )
  );

-- Payments policies
create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = client_id);

create policy "Staff can view clinic payments"
  on public.payments for select
  using (public.is_clinic_staff(auth.uid(), clinic_id));

create policy "Staff can manage clinic payments"
  on public.payments for all
  using (public.is_clinic_staff(auth.uid(), clinic_id));

-- Gallery photos policies (public read, staff write)
create policy "Anyone can view gallery photos"
  on public.gallery_photos for select
  using (true);

create policy "Staff can manage clinic gallery"
  on public.gallery_photos for all
  using (public.is_clinic_staff(auth.uid(), clinic_id));

-- Blog posts policies (public read published, staff write)
create policy "Anyone can view published blog posts"
  on public.blog_posts for select
  using (published = true);

create policy "Staff can view all blog posts"
  on public.blog_posts for select
  using (public.has_role(auth.uid(), 'staff') or public.has_role(auth.uid(), 'admin'));

create policy "Staff can manage blog posts"
  on public.blog_posts for all
  using (public.has_role(auth.uid(), 'staff') or public.has_role(auth.uid(), 'admin'));

-- Trigger function for updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add triggers for updated_at
create trigger update_clinics_updated_at before update on public.clinics
  for each row execute function public.update_updated_at_column();

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_pets_updated_at before update on public.pets
  for each row execute function public.update_updated_at_column();

create trigger update_appointments_updated_at before update on public.appointments
  for each row execute function public.update_updated_at_column();

create trigger update_medical_records_updated_at before update on public.medical_records
  for each row execute function public.update_updated_at_column();

create trigger update_payments_updated_at before update on public.payments
  for each row execute function public.update_updated_at_column();

create trigger update_blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.update_updated_at_column();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  
  -- Assign default client role
  insert into public.user_roles (user_id, role)
  values (new.id, 'client');
  
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();