"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { Profile } from "@/lib/types";

const sections = [
  {
    title: "หน้าหลัก",
    items: [{ href: "/home", label: "Dashboard", icon: "🏠" }],
  },
  {
    title: "โมดูล",
    items: [
      { href: "/pharmacy",    label: "Pharmacy",    icon: "💊" },
      { href: "/maintenance", label: "Maintenance", icon: "⚙️" },
    ],
  },
  {
    title: "ระบบ",
    items: [
      { href: "/nfc",             label: "NFC Mapping",   icon: "📱" },
      { href: "/print/stickers",  label: "พิมพ์ Stickers", icon: "🏷" },
      { href: "/import",          label: "Import Data",    icon: "📥" },
      { href: "/logs",            label: "Audit Log",      icon: "📋" },
    ],
  },
];

export default function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // ปิด sidebar อัตโนมัติเมื่อเปลี่ยนหน้า (สำหรับมือถือ)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initial = (profile?.full_name || profile?.username || "?")[0].toUpperCase();

  return (
    <>
      {/* Hamburger button — มือถือเท่านั้น */}
      <button
        onClick={() => setOpen(true)}
        aria-label="เปิดเมนู"
        className="fixed left-3 top-3 z-30 rounded-lg border border-brand-100 bg-white p-2.5 text-brand-900 shadow-sm hover:bg-brand-50 md:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Backdrop เมื่อเปิด sidebar บนมือถือ */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-brand-100 bg-white transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-brand-100 px-5 py-5">
          <div>
            <div className="text-lg font-bold text-brand-900">ITA-QOS</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">
              Temporal Analytics System
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="ปิดเมนู"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 md:hidden"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sections.map((sec) => (
            <div key={sec.title} className="mb-4">
              <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {sec.title}
              </div>
              {sec.items.map((it) => {
                const active = pathname === it.href || pathname.startsWith(it.href + "/");
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={`mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-brand-100 text-brand-500"
                        : "text-slate-600 hover:bg-brand-50 hover:text-brand-900"
                    }`}
                  >
                    <span className="w-5 text-center">{it.icon}</span>
                    {it.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3 border-t border-brand-100 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-sky-400 text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-brand-900">
              {profile?.full_name || profile?.username || "User"}
            </div>
            <div className="truncate text-[10px] text-slate-400">{profile?.role_code || "—"}</div>
          </div>
          <button
            onClick={logout}
            className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            title="ออกจากระบบ"
          >
            ↩
          </button>
        </div>
      </aside>
    </>
  );
}
