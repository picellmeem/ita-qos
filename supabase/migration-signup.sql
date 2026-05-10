-- รันใน Supabase SQL Editor เพื่อให้คนนอกสมัครเองได้

-- 1) Trigger: สร้าง profile อัตโนมัติเมื่อมี user ใหม่ (default role = viewer_pharmacy)
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, username, role_code, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'viewer_pharmacy',
    true
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- 2) ให้ user ดู role ของตัวเองได้ + อ่าน roles table
drop policy if exists "roles_read_all" on roles;
create policy "roles_read_all" on roles for select using (true);
alter table roles enable row level security;
