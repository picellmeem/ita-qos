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
      <main className="flex min-h-screen flex-col md:ml-60">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-brand-100 bg-white px-4 py-3 pl-16 md:px-7 md:pl-7">
          <h1 className="flex-1 truncate text-sm font-semibold text-brand-900 md:text-base">
            {title}
          </h1>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </header>
        <div className="flex-1 px-4 py-5 md:px-7 md:py-6">{children}</div>
      </main>
    </div>
  );
}
