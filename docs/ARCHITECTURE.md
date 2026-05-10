# 🏗 System Architecture — ITA-QOS

## Visual Diagram (สำหรับสไลด์ — copy ASCII / สร้างใน Figma/Canva)

```
                    ┌───────────────────────────────────────┐
                    │          ผู้ใช้งาน (Users)            │
                    │  Pharmacist · Maintenance · Viewer    │
                    └───────────┬───────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │ Desktop       │ Mobile        │ NFC tap
                │ (PC/Mac)      │ (Browser)     │ (Phone)
                ▼               ▼               ▼
          ┌─────────────────────────────────────────────┐
          │          Vercel Edge Network (CDN)          │
          │             https://ita-qos.vercel.app      │
          └─────────────────────┬───────────────────────┘
                                │
                                ▼
          ┌─────────────────────────────────────────────┐
          │          Next.js 15 App Router               │
          │  ┌────────────┐  ┌────────────┐  ┌────────┐ │
          │  │  Pages     │  │  Server    │  │ Edge   │ │
          │  │  (RSC)     │  │  Actions   │  │ Funcs  │ │
          │  └────────────┘  └────────────┘  └────────┘ │
          │  ┌────────────────────────────────────────┐ │
          │  │     Middleware (Auth Guard)            │ │
          │  └────────────────────────────────────────┘ │
          └─────────────────────┬───────────────────────┘
                                │ Supabase JS SDK
                                ▼
          ┌─────────────────────────────────────────────┐
          │             Supabase Cloud                   │
          │  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
          │  │   Auth   │ │ Realtime │ │   Storage   │  │
          │  └──────────┘ └──────────┘ └─────────────┘  │
          │  ┌────────────────────────────────────────┐ │
          │  │  PostgreSQL + Row Level Security        │ │
          │  │  ┌──────┐ ┌──────────┐ ┌────────────┐  │ │
          │  │  │items │ │pharmacy/ │ │ scan_logs  │  │ │
          │  │  │      │ │maintenance│ │ audit_logs │  │ │
          │  │  └──────┘ └──────────┘ └────────────┘  │ │
          │  └────────────────────────────────────────┘ │
          └─────────────────────────────────────────────┘
                                ▲
                                │ NFC tag lookup
                                │
                ┌───────────────┴───────────────┐
                │       Physical NFC Tags        │
                │   ติดบนยา + เครื่องมือแพทย์    │
                │      NTAG215 / 504 bytes        │
                └────────────────────────────────┘
```

---

## Data Flow (3 scenarios)

### 🔵 Scenario A: NFC Tap (Public, no auth)

```
[User Phone]
    │ Tap NFC tag
    ▼
[Phone Browser opens URL]
    │ https://ita-qos.vercel.app/scan/<tag-uid>
    ▼
[Vercel Edge → Next.js scan/[uid]/page.tsx]
    │
    ├─ middleware: ตรวจว่าเป็น public route ✓
    │
    ├─ Query 1: SELECT FROM nfc_mappings WHERE tag_uid = ?
    │   ← ใช้ anon Supabase client
    │
    ├─ Query 2: SELECT FROM v_pharmacy/v_maintenance WHERE item_id = ?
    │   ← RLS policy: anon allowed (read-only)
    │
    ├─ Query 3: INSERT INTO scan_logs (best-effort logging)
    │
    ▼
[Render public detail view]
    │ Status banner + item info + button "จัดการ"
    ▼
[User sees data within 1 second]
```

### 🟢 Scenario B: Login + Edit (Authenticated)

```
[User] → /login
    │
    ▼
[Supabase Auth: signInWithPassword]
    │ Validates credentials, sets HTTP-only cookies
    ▼
[Redirect /home]
    │ middleware checks cookies, finds valid JWT
    │
    ▼
[/pharmacy/[id]/edit]
    │ Form submission → Server Action updatePharmacyItem(formData)
    ▼
[Server Action validates + writes]
    │
    ├─ UPDATE items SET ... WHERE item_id = ?
    │   ← RLS: editor_pharmacy or admin only
    │
    ├─ UPDATE pharmacy_items SET ... WHERE item_id = ?
    │   ← RLS: editor_pharmacy or admin only
    │
    ├─ INSERT INTO audit_logs (action='update')
    │
    ├─ revalidatePath('/pharmacy')
    │
    ▼
[Redirect to detail page with fresh data]
```

### 🟡 Scenario C: Status Color Calculation

```
ในทุก request ที่ดึงข้อมูล item:

  SELECT *, calc_status(expiry_date) AS status_color
  FROM v_pharmacy

  ─── calc_status() เป็น SQL function ───
  CASE
    WHEN date < current_date  THEN 'red'
    WHEN date <= +60 days     THEN 'yellow'
    ELSE                            'green'
  END

→ คำนวณที่ database ทุกครั้งที่ query
→ ไม่ต้องมี cron job
→ ไม่มี race condition
→ Always consistent
```

---

## Tech Stack ละเอียด

| Layer | Technology | เหตุผล |
|---|---|---|
| **Frontend Framework** | Next.js 15 (App Router) | RSC, Server Actions, ลด client JS |
| **UI** | React 19 + Tailwind CSS | Component-based, utility-first |
| **Charts** | Recharts | Composable, animated, responsive |
| **Type Safety** | TypeScript | Catch bugs ตอนเขียน |
| **Database** | PostgreSQL (Supabase) | ACID, relational, RLS built-in |
| **Auth** | Supabase Auth | Industry standard, session mgmt |
| **Hosting** | Vercel (Edge) | Auto-deploy, global CDN |
| **CI/CD** | GitHub + Vercel | Push → auto build → deploy |

---

## Security Architecture

```
3 ชั้นของความปลอดภัย:

Layer 1: Network
├─ HTTPS only (Vercel enforced)
├─ HTTP Strict Transport Security
└─ CDN-level DDoS protection

Layer 2: Application
├─ Next.js middleware → Auth guard ทุก request
├─ HTTP-only cookies → ป้องกัน XSS อ่าน token
├─ CSRF protection (Server Actions ใช้ POST + same-origin)
└─ Input validation ที่ Server Action

Layer 3: Database (CRITICAL)
├─ Row Level Security (RLS) บังคับสิทธิ์ที่ row
├─ Role-based: viewer / editor_pharmacy / editor_maintenance / admin
├─ ไม่มี SQL injection (parameterized queries)
└─ Audit log บันทึกทุก write
```

---

## Scalability

```
Free Tier ปัจจุบัน:
- Database: 500 MB
- Bandwidth: 5 GB/เดือน  (Supabase) + 100 GB/เดือน (Vercel)
- Concurrent users: ~50-100 OK
- MAU: 50,000

ถ้าโต:
- Supabase Pro: $25/เดือน → 8 GB DB, 250 GB bandwidth
- Vercel Pro: $20/เดือน → 1 TB bandwidth, advanced analytics

Scale path:
[100 users] → free tier
[1,000 users] → Supabase Pro
[10,000 users] → Pro + Read replicas
[100,000+ users] → dedicated DB + caching layer (Redis)
```

---

## Database Schema Overview

```
┌─────────────┐
│ auth.users  │ ← Supabase managed
└──────┬──────┘
       │ 1:1
       ▼
┌─────────────┐         ┌──────────┐
│  profiles   │────────▶│  roles   │
└─────────────┘   role  └──────────┘
                  
┌─────────────┐
│   items     │── 1:1 ──▶ pharmacy_items
│ (parent)    │── 1:1 ──▶ maintenance_items
│             │── n:1 ──▶ locations
└──────┬──────┘
       │ 1:n
       ├──▶ nfc_mappings
       ├──▶ scan_logs
       └──▶ audit_logs
```

---

## ฟีเจอร์ที่ Implement แล้ว

✅ Login / Sign-up / Auth (Supabase)
✅ Role-based access (RLS)
✅ Pharmacy + Maintenance modules
✅ CRUD: Create, Read, Update, Delete (single + bulk)
✅ Auto status color (SQL view)
✅ Dashboard with summary + 3 charts
✅ Search + Filter + Pagination
✅ NFC scan public view (no login)
✅ QR code per item (download + print)
✅ NFC sticker A4 print template
✅ CSV import + export
✅ PDF export (browser print)
✅ Audit log
✅ Mobile responsive
✅ Loading skeletons
✅ Deployed to Vercel

## ฟีเจอร์ Phase 2

🚧 Email/LINE notifications
🚧 PWA (install on phone like native app)
🚧 Multi-language (i18n)
🚧 Predictive maintenance ML
🚧 SSO / Active Directory
🚧 Multi-tenant
