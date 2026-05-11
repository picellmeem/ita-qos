import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const supabase = await createClient();

  // เช็คว่าเป็น admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("role_code, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (me?.role_code !== "admin" || me.status !== "approved") {
    return (
      <AppShell title="🚫 ไม่มีสิทธิ์เข้าถึง">
        <div className="card max-w-md text-center">
          <div className="text-4xl">🔒</div>
          <h1 className="mt-3 text-lg font-bold text-brand-900">
            หน้านี้สำหรับ Admin เท่านั้น
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            ติดต่อ admin หากต้องการสิทธิ์เข้าถึง
          </p>
        </div>
      </AppShell>
    );
  }

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AppShell title="👥 จัดการผู้ใช้งาน">
      <UsersClient users={users ?? []} />
    </AppShell>
  );
}
