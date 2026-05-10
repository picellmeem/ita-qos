# ITA-QOS v2

**Integrated Temporal Analytics for Quality & Operational Safety**
NFC-based monitoring system for pharmacy expiry & equipment maintenance tracking.

Built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS + Supabase**.
Deploys to **Vercel** (free tier) — no local server required.

---

## ✨ Features

- 🔐 **Supabase Auth** with role-based access (RBAC) enforced at the database via Row Level Security
- 💊 **Pharmacy module** — track expiry dates, lot numbers, storage locations
- ⚙️ **Maintenance module** — track machinery, last/next maintenance, cycle days
- 🚦 **Auto-calculated status** (green > 60d, yellow 1–60d, red ≤ 0d)
- 📱 **NFC scan flow** — `/scan/<TAG_UID>` looks up the mapping and redirects to the item detail page
- 📥 **CSV import** with preview, validation, progress
- 📋 **Audit log + scan log**
- 🌏 Thai-first UI

---

## 🚀 Setup (15 minutes)

### 1. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) → New Project (free tier).
2. Wait for the project to provision (~2 min).
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret)

### 2. Apply the database schema
1. Open **SQL Editor** in Supabase.
2. Copy the contents of [`supabase/schema.sql`](supabase/schema.sql) and run it.
3. This creates all tables, views, RLS policies, and the `calc_status` function.

### 3. Create the first admin user
1. In Supabase **Authentication → Users → Add user**, enter an email + password.
2. Copy the new user's UUID.
3. Open **SQL Editor** and run:
   ```sql
   insert into profiles (user_id, full_name, username, role_code)
   values ('<paste-uuid>', 'Admin User', 'admin', 'admin');
   ```

### 4. Local development
```bash
cd ita-qos-v2
cp .env.example .env.local      # then fill in your Supabase keys
npm install
npm run dev
```
Open http://localhost:3000 and log in with the email/password from step 3.

### 5. Deploy to Vercel
1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo.
3. Add the three environment variables from `.env.local`.
4. Deploy. Your site will be at `https://<your-project>.vercel.app`.

The site is now online 24/7 — you do **not** need to keep your computer on.

---

## 🏷️ NFC tag programming

Encode each NFC tag with a URL of the form:
```
https://<your-domain>/scan/<TAG_UID>
```
Then in the app, go to **NFC Mapping** and bind that `TAG_UID` to an item.
When users tap the tag, they'll be redirected straight to the item's detail page.

> Tip: You don't have to use the chip's hardware UID — any unique string works.
> e.g. `https://<domain>/scan/MED-A001` is fine.

---

## 👥 Roles

| Role | Pharmacy items | Maintenance items |
|---|---|---|
| `viewer_pharmacy`   | read | – |
| `editor_pharmacy`   | read + write | read |
| `viewer_maintenance`| – | read |
| `editor_maintenance`| read | read + write |
| `admin`             | full | full |

All authenticated users can read both modules; **write** is restricted by role via RLS in [`supabase/schema.sql`](supabase/schema.sql).

To assign a role to a user, insert (or update) a row in `profiles` with the matching `role_code`.

---

## 📂 Project structure

```
ita-qos-v2/
├── supabase/schema.sql          # DB schema + RLS policies (run in Supabase)
├── src/
│   ├── middleware.ts            # auth guard
│   ├── lib/
│   │   ├── supabase-browser.ts  # client-side Supabase
│   │   ├── supabase-server.ts   # server-side Supabase (cookies)
│   │   ├── actions.ts           # server actions (create/update/etc.)
│   │   ├── status.ts            # status color logic + formatters
│   │   └── types.ts
│   ├── components/
│   │   ├── AppShell.tsx         # sidebar + topbar layout
│   │   ├── Sidebar.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── SummaryCards.tsx
│   │   └── ItemFilters.tsx      # search + filter table
│   └── app/
│       ├── login/               # login page
│       ├── home/                # module selector
│       ├── pharmacy/            # dashboard + [id] + new
│       ├── maintenance/         # dashboard + [id] + new
│       ├── nfc/                 # NFC mapping management
│       ├── scan/[uid]/          # NFC tap entry point
│       ├── import/              # CSV import wizard
│       └── logs/                # audit log
└── README.md
```

---

## 🛣️ Roadmap (from PRD)

Phase 1 (this build):
- [x] Auth + RBAC
- [x] Pharmacy + Maintenance modules
- [x] NFC mapping + scan redirector
- [x] Status color engine
- [x] CSV import
- [x] Audit + scan logs

Phase 2:
- [ ] Email/LINE notifications
- [ ] Predictive maintenance
- [ ] SSO / Active Directory
- [ ] Mobile app (PWA)
- [ ] QR code fallback for non-NFC devices
