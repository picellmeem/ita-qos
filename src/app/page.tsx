import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-sky-50">
      {/* Top Nav */}
      <nav className="sticky top-0 z-20 border-b border-brand-100/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-sky-400 text-base text-white">
              ⏱
            </div>
            <div>
              <div className="text-base font-bold text-brand-900">ITA-QOS</div>
              <div className="-mt-1 text-[9px] uppercase tracking-wider text-slate-400">
                Temporal Analytics
              </div>
            </div>
          </div>
          <Link href="/login" className="btn-primary !py-2 text-xs md:text-sm">
            เข้าสู่ระบบ
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-500">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
              NFC × Real-time × Cloud
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-brand-900 md:text-5xl">
              ติดตามยา &amp; เครื่องมือแพทย์<br />
              <span className="text-brand-500">ด้วย NFC ในระยะ 1 แตะ</span>
            </h1>
            <p className="mt-4 text-base text-slate-600 md:text-lg">
              ระบบ Integrated Temporal Analytics for Quality &amp; Operational Safety
              <br className="hidden md:block" />
              ป้องกันยาหมดอายุ — เครื่องมือเกินรอบบำรุง — ก่อนสร้างความเสียหาย
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/login" className="btn-primary !px-6 !py-3 text-sm md:text-base">
                เริ่มใช้งาน →
              </Link>
              <a
                href="#features"
                className="btn-secondary !px-6 !py-3 text-sm md:text-base"
              >
                ดูฟีเจอร์
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <Stat n="80+" label="รายการตัวอย่าง" />
              <Stat n="3" label="ระดับสถานะ" />
              <Stat n="<1s" label="NFC tap → เห็นข้อมูล" />
            </div>
          </div>

          {/* Visual mock */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-500/20 to-sky-400/20 blur-2xl" />
            <div className="relative space-y-3 rounded-3xl border border-brand-100 bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-orange-400 text-lg">
                    💊
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-brand-900">
                      Amoxicillin 500mg
                    </div>
                    <div className="font-mono text-[10px] text-brand-500">MED-00002</div>
                  </div>
                </div>
                <span className="badge badge-green">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  ปกติ
                </span>
              </div>

              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
                จะหมดอายุใน 280 วัน
              </div>

              <div className="space-y-1.5 text-xs">
                <Row k="วันหมดอายุ" v="15 มี.ค. 2569" />
                <Row k="ตำแหน่ง" v="Zone A · Shelf 01" />
                <Row k="เลขล็อต" v="LOT-2025-0014" />
                <Row k="จำนวน" v="2,000 แคปซูล" />
              </div>

              <div className="rounded-xl bg-gradient-to-br from-brand-50 to-sky-50 p-3 text-center">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">
                  📱 Tap NFC tag เพื่อดูข้อมูล
                </div>
              </div>
            </div>

            {/* Floating second card */}
            <div className="absolute -bottom-6 -left-4 hidden rotate-[-4deg] rounded-2xl border border-red-200 bg-white p-3 shadow-xl md:block">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-blue-500 text-sm">
                  ⚙️
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-brand-900">CT Scanner</div>
                  <div className="text-[9px] text-red-600">เกินซ่อม 15 วัน</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-brand-900 md:text-3xl">
              ปัญหาที่ ITA-QOS แก้ให้
            </h2>
            <p className="mt-2 text-sm text-slate-500 md:text-base">
              ทุกโรงพยาบาลเจอปัญหาเดียวกัน — แค่ไม่มีเครื่องมือที่เหมาะสม
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Problem
              icon="⚠️"
              title="ยาหมดอายุไม่รู้"
              text="ยาบนชั้นมีเป็นพันรายการ การเช็ควันหมดอายุด้วยมือผิดพลาดง่าย — เสี่ยงให้คนไข้"
            />
            <Problem
              icon="🔧"
              title="เครื่องเสียกระทันหัน"
              text="ลืมรอบบำรุงเครื่อง CT/MRI พังตอนใช้งานจริง = ปิดบริการ + ค่าซ่อมแพง"
            />
            <Problem
              icon="📋"
              title="ระบบกระจัดกระจาย"
              text="Excel หลายไฟล์ คนละแผนกใช้คนละแบบ ไม่มี source of truth"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-brand-900 md:text-3xl">
              วิธีที่เราแก้ปัญหา
            </h2>
            <p className="mt-2 text-sm text-slate-500 md:text-base">
              4 ฟีเจอร์หลัก ออกแบบจาก PRD จริงของโรงพยาบาล
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Feature
              icon="📱"
              title="NFC Tap = 1 วินาทีเห็นข้อมูล"
              text="แตะมือถือบน tag → เปิดหน้ารายการทันที ไม่ต้องค้นหา ไม่ต้องล็อกอิน"
              tags={["Web NFC", "QR fallback"]}
            />
            <Feature
              icon="🚦"
              title="สีสถานะ 3 ระดับ"
              text="เขียว = ปกติ · เหลือง = เฝ้าระวัง 60 วัน · แดง = ด่วน/เกิน — เห็นปุ๊บเข้าใจปั๊บ"
              tags={["Real-time", "Auto-calculate"]}
            />
            <Feature
              icon="📊"
              title="Dashboard + กราฟ"
              text="สัดส่วนสถานะ · จำนวนตามหมวด · timeline หมดอายุ 6 เดือน — ผู้บริหารเห็นภาพรวม"
              tags={["Recharts", "Filter & search"]}
            />
            <Feature
              icon="🔐"
              title="แบ่งบทบาทชัดเจน"
              text="เภสัช ดู/แก้ยาเท่านั้น · ทีมซ่อม ดู/แก้เครื่องเท่านั้น · Audit log ติดตามทุกการแก้"
              tags={["RBAC", "Row Level Security"]}
            />
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="bg-gradient-to-br from-brand-50 to-sky-50 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-brand-900 md:text-3xl">
              2 โมดูลในระบบเดียว
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <ModuleCard
              icon="💊"
              title="Pharmacy Module"
              gradient="from-pink-400 to-orange-400"
              points={[
                "ติดตามวันหมดอายุยาและวัคซีน",
                "ระบุตำแหน่งจัดเก็บ Zone/Shelf",
                "ข้อมูล Lot, Trade, Generic, Supplier",
                "เงื่อนไขการเก็บ (อุณหภูมิห้อง / 2-8°C)",
              ]}
            />
            <ModuleCard
              icon="⚙️"
              title="Maintenance Module"
              gradient="from-violet-400 to-blue-500"
              points={[
                "ติดตามรอบบำรุงเครื่องมือแพทย์",
                "วันที่ติดตั้ง, ซ่อมล่าสุด, ครั้งถัดไป",
                "ระบุตำแหน่ง Building/Floor/Room",
                "Serial No, Manufacturer, ทีมรับผิดชอบ",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="text-2xl font-bold text-brand-900 md:text-4xl">
            พร้อมจะลดความเสี่ยงด้านความปลอดภัยแล้วหรือยัง?
          </h2>
          <p className="mt-3 text-base text-slate-600 md:text-lg">
            เข้าสู่ระบบเพื่อทดลองใช้งานจริงด้วยข้อมูลตัวอย่าง 80 รายการ
          </p>
          <Link
            href="/login"
            className="btn-primary mt-7 inline-block !px-8 !py-3.5 text-base"
          >
            เริ่มใช้งาน →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-100 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-400 md:px-6">
          ITA-QOS · Integrated Temporal Analytics for Quality &amp; Operational Safety<br />
          Built with Next.js · Supabase · Tailwind CSS
        </div>
      </footer>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-xl font-bold text-brand-500 md:text-2xl">{n}</div>
      <div className="text-[11px] text-slate-500">{label}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-slate-50 py-1.5 last:border-0">
      <span className="text-slate-400">{k}</span>
      <span className="font-medium text-slate-700">{v}</span>
    </div>
  );
}

function Problem({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-5 transition hover:border-brand-500 hover:shadow-md">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 text-base font-bold text-brand-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-600">{text}</p>
    </div>
  );
}

function Feature({ icon, title, text, tags }: { icon: string; title: string; text: string; tags: string[] }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-6 transition hover:border-brand-500 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-sky-400 text-2xl">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-brand-900">{title}</h3>
          <p className="mt-1.5 text-sm text-slate-600">{text}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-500">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({
  icon,
  title,
  gradient,
  points,
}: {
  icon: string;
  title: string;
  gradient: string;
  points: string[];
}) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-3xl`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-brand-900">{title}</h3>
      <ul className="mt-4 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="mt-0.5 text-brand-500">✓</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
