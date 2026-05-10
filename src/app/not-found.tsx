import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="card max-w-md text-center">
        <div className="text-3xl">🔍</div>
        <h1 className="mt-3 text-lg font-bold text-brand-900">ไม่พบหน้าที่คุณค้นหา</h1>
        <p className="mt-2 text-sm text-slate-500">รายการอาจถูกลบหรือ URL ไม่ถูกต้อง</p>
        <Link href="/home" className="btn-secondary mt-4">กลับหน้าหลัก</Link>
      </div>
    </div>
  );
}
