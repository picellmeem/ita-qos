import Sidebar from "./Sidebar";
import { createClient } from "@/lib/supabase-server";
import type { Profile } from "@/lib/types";

export default async function AppShell({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    profile = data as Profile | null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar profile={profile} />
      <main className="ml-60 flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-brand-100 bg-white px-7 py-3">
          <h1 className="flex-1 text-base font-semibold text-brand-900">{title}</h1>
          {actions}
        </header>
        <div className="flex-1 px-7 py-6">{children}</div>
      </main>
    </div>
  );
}
