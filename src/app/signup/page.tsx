"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import ColorfulBackground from "@/components/ColorfulBackground";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (password.length < 6) {
      setErr("รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (password !== confirm) {
      setErr("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    setBusy(false);

    if (error) {
      setErr(error.message);
      return;
    }

    if (data.user && !data.session) {
      // ต้อง confirm email — แสดง message
      setOk(true);
      return;
    }

    router.push("/home");
    router.refresh();
  }

  if (ok) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-white px-4">
        <ColorfulBackground />
        <div className="relative z-10 w-full max-w-sm">
          <div className="rounded-2xl border border-white/60 bg-white/75 p-6 text-center shadow-2xl backdrop-blur-xl">
            <div className="text-4xl">📧</div>
            <h1 className="mt-3 text-lg font-bold text-brand-900">
              สมัครสำเร็จ! ตรวจสอบอีเมล
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              เราส่งลิงก์ยืนยันไปที่ <span className="font-semibold">{email}</span> แล้ว
              <br />
              กรุณาคลิกลิงก์ในอีเมลเพื่อเปิดใช้งานบัญชี
            </p>
            <Link href="/login" className="btn-secondary mt-5 inline-block">
              ← ไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <ColorfulBackground />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="text-2xl font-bold text-brand-900">ITA-QOS</div>
          <div className="mt-1 text-xs text-slate-500">
            สมัครบัญชีใหม่เพื่อทดลองใช้งาน
          </div>
        </div>

        <form
          onSubmit={submit}
          className="space-y-3 rounded-2xl border border-white/60 bg-white/75 p-6 shadow-2xl backdrop-blur-xl"
        >
          <h1 className="text-lg font-semibold text-brand-900">สมัครสมาชิก</h1>

          {err && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {err}
            </div>
          )}

          <div>
            <label className="label">ชื่อ-นามสกุล</label>
            <input
              type="text"
              className="input"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="วรัญชิต ฉันทะชาติ"
            />
          </div>

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
            <label className="label">รหัสผ่าน (อย่างน้อย 6 ตัว)</label>
            <input
              type="password"
              className="input"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="label">ยืนยันรหัสผ่าน</label>
            <input
              type="password"
              className="input"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>

          <p className="text-center text-xs text-slate-400">
            มีบัญชีแล้ว?{" "}
            <Link href="/login" className="font-semibold text-brand-500 hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>

          <p className="rounded-lg bg-brand-50 px-3 py-2 text-[11px] text-brand-500">
            ℹ️ บัญชีใหม่จะได้สิทธิ์ <b>Viewer</b> (ดูได้อย่างเดียว) admin จะอัปเกรดสิทธิ์ให้ทีหลัง
          </p>
        </form>
      </div>
    </div>
  );
}
