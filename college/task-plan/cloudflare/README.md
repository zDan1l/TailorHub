# Task Plan Integrasi Cloudflare (Pages + Functions + D1)

Direktori ini berisi pemecahan rencana implementasi dari [`implementation-cloudflare.md`](../../../implementation-cloudflare.md) menjadi **7 task terstruktur** agar seluruh halaman statis TailorHub tersambung ke **Cloudflare Pages Functions** dan database **Cloudflare D1**, serta siap di-deploy ke produksi.

> **Status saat ini:** Backend inti (`functions/api/*`), helper frontend (`assets/js/api.js`), schema (`db/schema.sql`), dan seed (`db/seed.sql`) sudah di-scaffold. Namun `database_id` di `wrangler.toml` masih placeholder, `.dev.vars` belum dibuat, dan belum ada halaman HTML (`app/`, `auth/`, `account/`, `portal/`) yang memuat `/assets/js/api.js`.

---

## 🔌 Panduan Menggunakan Plugin Cloudflare

Selama mengerjakan task-task di bawah ini, gunakan **Plugin Cloudflare** yang sudah terpasang di environment agent agar konfigurasi, debugging, dan pengelolaan resource Cloudflare mengikuti dokumentasi terbaru dan akurat:

### 1. MCP Server `cloudflare_cloudflare`
Gunakan tool MCP `cloudflare_cloudflare` (via `call_mcp_tool`) untuk berinteraksi langsung dengan dokumentasi & API Cloudflare:
- **`whoami`**: Cek status akun Cloudflare yang sedang terhubung sebelum melakukan operasi remote.
- **`docs`**: Cari dokumentasi resmi Cloudflare (Pages Functions, D1 SQLite, bindings, environment variables, Wrangler config) sebelum menulis kode atau mengubah `wrangler.toml`.
- **`search`**: Cari endpoint OpenAPI Cloudflare (mis. D1 database, Pages project, deployments) beserta parameter dan skemanya.
- **`execute`**: Jalankan panggilan API Cloudflare via `cloudflare.request(...)` untuk inspeksi/manajemen resource remote (cek D1 database, cek Pages project/deployments/bindings) setelah mencari endpoint yang tepat lewat `search`.

### 2. Skills Plugin Cloudflare yang Relevan
Baca `SKILL.md` yang sesuai sebelum mengeksekusi task terkait:
- **`wrangler`** — Wajib dibaca saat menjalankan perintah CLI lokal/remote atau mengubah `wrangler.toml`. Karena proyek ini sudah memakai `wrangler.toml` dan `wrangler` di `package.json`, **tetap gunakan Wrangler** (`npm run dev`, `npm run deploy`, `npm run db:*`) dan **jangan** mencampur dengan `cf dev`/`cf deploy`.
- **`workers-development`** — Gunakan saat menjalankan & men-debug Pages Functions secara lokal, memeriksa trace/log, dan menguji binding D1.
- **`workers-best-practices`** — Gunakan sebagai acuan saat menulis atau me-review endpoint baru di `functions/api/*` (validasi input, error handling, keamanan).
- **`cloudflare`** — Gunakan jika perlu memilih atau mendiagnosis konfigurasi layanan/error Cloudflare saat staging maupun produksi.

---

## 📋 Daftar Task Implementasi

| Urutan | File Task | Ruang Lingkup & PIC | Dependensi | Status |
|:---:|---|---|---|:---:|
| **01** | [`task-01-setup-env-dan-d1.md`](task-01-setup-env-dan-d1.md) | Setup `wrangler`, buat D1 (`db:create`), update `wrangler.toml`, siapkan `.dev.vars`, `db:reset`, uji `/api/health` | — | ✅ Selesai |
| **02** | [`task-02-dev2-auth-dan-account.md`](task-02-dev2-auth-dan-account.md) | **Dev 2:** Integrasi `auth/*` & `account/*` ke `/api/auth/*` + buat `PUT /api/account` | Task 01 | ✅ Selesai |
| **03** | [`task-03-dev3-dashboard-notif-reports.md`](task-03-dev3-dashboard-notif-reports.md) | **Dev 3:** Integrasi `app/dashboard.html`, `app/notifications/*`, `app/reports/*` + buat `/api/reports/income` & `/api/reports/orders` | Task 01 | ✅ Selesai |
| **04** | [`task-04-dev4-orders-dan-customers.md`](task-04-dev4-orders-dan-customers.md) | **Dev 4:** Integrasi `app/orders/*` & `app/customers/*` ke `/api/orders*` & `/api/customers*` | Task 01 | ✅ Selesai |
| **05** | [`task-05-dev5-production-staff-portal.md`](task-05-dev5-production-staff-portal.md) | **Dev 5:** Integrasi `app/production/*`, `app/staff/*`, `portal/*` ke `/api/orders`, `/api/public/track` + filter status/assignee | Task 01 | ✅ Selesai |
| **06** | [`task-06-dev6-payments-team-settings.md`](task-06-dev6-payments-team-settings.md) | **Dev 6:** Integrasi `app/payments/*`, `app/team/*`, `app/settings/*` + buat `/api/team` & `/api/settings/tenant` | Task 01 | ✅ Selesai |
| **07** | [`task-07-deploy-dan-verifikasi-produksi.md`](task-07-deploy-dan-verifikasi-produksi.md) | Aktifkan `TH.requireAuth`, pastikan `DEV_TENANT_ID` kosong di produksi, `db:init:remote`, `npm run deploy`, verifikasi binding D1 & smoke test | Task 02–06 | ✅ Selesai |

> **Catatan Urutan:** Task 01 wajib diselesaikan lebih dulu. Setelah Task 01 berhasil, Task 02–06 dapat dikerjakan paralel oleh masing-masing dev (memanfaatkan `DEV_TENANT_ID=1` di `.dev.vars` selama dev lokal), lalu ditutup dengan Task 07.

---

## 🔒 Aturan Wajib Lintas Task

1. **Path Absolut Frontend:** Semua halaman (termasuk di dalam subfolder `app/*/`) wajib memakai path absolut `/assets/js/api.js` dan `/api/...` — bukan path relatif.
2. **Isolasi Multi-Tenant:** Setiap endpoint baru di `functions/api/` wajib mengambil `const t = data.auth.tenantId;` dari `context.data.auth` dan memfilter seluruh query SQL dengan `WHERE tenant_id = ?`.
3. **Keamanan & Sanitasi:**
   - Render data teks ke HTML via `innerHTML` wajib dibungkus `TH.esc(...)` untuk mencegah XSS.
   - Jangan pernah menyimpan password polos (gunakan PBKDF2-SHA256 di `functions/api/_utils.js`).
   - Nominal Rupiah disimpan sebagai bilangan bulat (integer).
4. **Scan Keamanan:** Setelah menulis atau mengubah kode (`*.js`, `*.html`), jalankan `aikido_full_scan` sesuai aturan keamanan proyek hingga bebas temuan.
