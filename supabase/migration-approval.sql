-- เพิ่ม approval workflow: signup → pending → admin approve

-- 1) เพิ่มคอลัมน์ status ใน profiles
alter table profiles add column if not exists status text default 'pending'
  check (status in ('pending','approved','rejected'));

alter table profiles add column if not exists approved_at timestamptz;
alter table profiles add column if not exists approved_by uuid references auth.users(id);

-- ทำให้ user ที่มีอยู่ (admin คุณ) เป็น approved ทั้งหมด
update profiles set status = 'approved', approved_at = now() where status = 'pending' or status is null;

-- 2) อัปเดต trigger: user ใหม่จะเป็น pending แทน auto-approved
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, username, role_code, is_active, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'viewer_pharmacy',
    true,
    'pending'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- 3) Helper function: เช็คว่า user เป็น admin
create or replace function is_admin() returns boolean
language sql stable security definer as $$
  select coalesce(
    (select role_code = 'admin' and status = 'approved'
     from profiles where user_id = auth.uid()),
    false
  );
$$;

-- 4) Helper function: เช็คว่า user approved แล้ว
create or replace function is_approved() returns boolean
language sql stable security definer as $$
  select coalesce(
    (select status = 'approved' from profiles where user_id = auth.uid()),
    false
  );
$$;

-- 5) Profile policies: user ดู own profile, admin ดูทุก profile + approve
drop policy if exists "profiles_self_read"  on profiles;
drop policy if exists "profiles_admin_read" on profiles;
drop policy if exists "profiles_admin_write" on profiles;

create policy "profiles_self_read" on profiles for select
  using (user_id = auth.uid() or is_admin());

create policy "profiles_admin_write" on profiles for update
  using (is_admin())
  with check (is_admin());

-- 6) Action function สำหรับ admin
create or replace function approve_user(target_user_id uuid, new_role text default null)
returns void
language plpgsql security definer as $$
begin
  if not is_admin() then
    raise exception 'Only admin can approve users';
  end if;
  update profiles set
    status = 'approved',
    role_code = coalesce(new_role, role_code),
    approved_at = now(),
    approved_by = auth.uid()
  where user_id = target_user_id;
end;
$$;

create or replace function reject_user(target_user_id uuid)
returns void
language plpgsql security definer as $$
begin
  if not is_admin() then
    raise exception 'Only admin can reject users';
  end if;
  update profiles set
    status = 'rejected',
    approved_at = now(),
    approved_by = auth.uid()
  where user_id = target_user_id;
end;
$$;

create or replace function update_user_role(target_user_id uuid, new_role text)
returns void
language plpgsql security definer as $$
begin
  if not is_admin() then
    raise exception 'Only admin can change roles';
  end if;
  update profiles set role_code = new_role where user_id = target_user_id;
end;
$$;
