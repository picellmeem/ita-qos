"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import ColorfulBackground from "@/components/ColorfulBackground";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push("/home");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-4">
      <ColorfulBackground />
      <div className="relative z-10 w-full max-w-sm animate-scale-in">
        <div className="mb-6 text-center">
          <div className="text-2xl font-bold text-brand-900">ITA-QOS</div>
          <div className="mt-1 text-xs text-slate-500">
            Integrated Temporal Analytics for Quality &amp; Operational Safety
          </div>
        </div>

        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-white/60 bg-white/75 p-6 shadow-2xl backdrop-blur-xl"
        >
          <h1 className="text-lg font-semibold text-brand-900">เข้าสู่ระบบ</h1>

          {err && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {err}
            </div>
          )}

          <div>
            <label className="label">อีเมล</label>
            <input
              type="email"
              className="input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="label">รหัสผ่าน</label>
            <input
              type="password"
              className="input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

          <p className="text-center text-xs text-slate-500">
            ยังไม่มีบัญชี?{" "}
            <a href="/signup" className="font-semibold text-brand-500 hover:underline">
              สมัครสมาชิก
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
