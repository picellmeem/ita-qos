"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import ColorfulBackground from "@/components/ColorfulBackground";

export default function PendingPage() {
  const router = useRouter();
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-4">
      <ColorfulBackground />
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="rounded-2xl border border-white/60 bg-white/80 p-7 text-center shadow-2xl backdrop-blur-xl">
          <div className="text-5xl">⏳</div>
          <h1 className="mt-4 text-xl font-bold text-brand-900">
            บัญชีของคุณรอการอนุมัติ
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            ขอบคุณที่สมัครสมาชิก ITA-QOS
            <br />
            <span className="font-semibold text-brand-900">
              admin จะตรวจสอบและอนุมัติบัญชีของคุณภายใน 24 ชั่วโมง
            </span>
            <br />
            <br />
            หลังได้รับอนุมัติ คุณจะสามารถเข้าใช้งานระบบได้ทันที
            ตอนนี้คุณสามารถปิดหน้านี้และรอการแจ้งเตือนได้
          </p>

          <div className="mt-6 rounded-xl bg-brand-50 px-4 py-3 text-left">
            <div className="text-[10px] font-bold uppercase tracking-wider text-brand-500">
              ทำไมต้องรอ?
            </div>
            <p className="mt-1 text-xs text-slate-600">
              เพื่อปกป้องความปลอดภัยของข้อมูลทางการแพทย์
              ระบบของเราต้องการให้ admin ตรวจสอบตัวตนและกำหนดบทบาทที่เหมาะสมก่อนเข้าใช้งาน
              เป็นไปตามมาตรฐาน <b>HA</b> และ <b>PDPA</b>
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => router.refresh()}
              className="btn-primary"
            >
              🔄 รีเฟรช (เช็คสถานะอีกครั้ง)
            </button>
            <button onClick={logout} className="btn-secondary">
              ออกจากระบบ
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-[11px] text-slate-400">
          มีคำถาม? ติดต่อ admin โรงพยาบาล
        </div>
      </div>
    </div>
  );
}
