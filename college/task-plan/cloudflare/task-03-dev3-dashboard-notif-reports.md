# Task 03 — Dev 3: Integrasi Dashboard, Notifikasi & Laporan

**PIC:** Dev 3  
**Dependensi:** Task 01 selesai  
**Target File:**
- `[MODIFY]` `app/dashboard.html`, `app/search.html`
- `[MODIFY]` `app/notifications/index.html`, `app/notifications/settings.html`
- `[MODIFY]` `app/reports/index.html`, `app/reports/income.html`, `app/reports/orders.html`, `app/reports/customers.html`, `app/reports/productivity.html`, `app/reports/export.html`
- `[NEW]` `functions/api/reports/income.js`
- `[NEW]` `functions/api/reports/orders.js`

---

## 🔌 Penggunaan Plugin Cloudflare pada Task Ini
- Baca skill **`workers-development`** dan **`workers-best-practices`** sebelum membuat endpoint analitik laporan di `functions/api/reports/*`.
- Gunakan MCP **`cloudflare_cloudflare`** (`docs`) bila perlu referensi sintaks SQLite D1 (mis. fungsi agregasi tanggal `strftime` di D1).

---

## 🎯 Tujuan Task
Mengganti seluruh angka statis di Dashboard, pusat notifikasi, pencarian global, dan halaman laporan dengan data agregasi asli dari D1.

---

## 🛠️ Langkah Eksekusi

1. **Hidupkan `app/dashboard.html`:**
   - Muat `<script src="/assets/js/api.js"></script>` (dan `TH.requireAuth("/auth/login.html")` — boleh dikomentari sementara saat masih pakai `DEV_TENANT_ID`).
   - Tambahkan `id` pada elemen KPI (`#kpiAktif`, `#kpiSelesai`, `#kpiPemasukan`, `#kpiDeadline`), tabel pesanan terbaru (`#recentBody`), dan daftar alert deadline.
   - Fetch `TH.get("/api/dashboard")` dan render menggunakan `TH.rupiah()`, `TH.statusChip()`, dan `TH.esc()`.
2. **Sambungkan `app/notifications/index.html`:**
   - Ambil data dari `GET /api/notifications` (serta filter `?unread=1`).
   - Implementasikan aksi "Tandai dibaca" via `PATCH /api/notifications` (`{ all: true }` atau `{ ids: [...] }`).
3. **Sambungkan `app/search.html`:**
   - Gunakan `GET /api/orders?q=...` dan `GET /api/customers?q=...` untuk pencarian cepat lintas modul.
4. **Buat Endpoint Laporan Baru:**
   - `functions/api/reports/income.js` (`GET /api/reports/income`): agregasi pemasukan dari tabel `payments` berdasarkan rentang tanggal/bulan, wajib filter `WHERE tenant_id = ?`.
   - `functions/api/reports/orders.js` (`GET /api/reports/orders`): ringkasan jumlah pesanan per `production_status`, per `type`, dan metrik ketepatan deadline, wajib filter `WHERE tenant_id = ?`.
5. **Sambungkan `app/reports/*`:**
   - Muat `/assets/js/api.js` pada halaman laporan utama, income, orders, customers, productivity, dan export.
   - Render grafik/tabel laporan dari `/api/reports/income`, `/api/reports/orders`, `/api/orders`, dan `/api/payments` (serta fitur export CSV di sisi klien dari data JSON asli).
6. **Uji & Scan Keamanan:**
   - Verifikasi nilai KPI dashboard cocok dengan isi D1 (`npm run db:console`).
   - Jalankan `aikido_full_scan` pada semua file yang diubah/ditambah.

---

## ✅ Kriteria Selesai (Definition of Done)
- [ ] KPI, tabel terbaru, dan alert di `app/dashboard.html` berasal dari `/api/dashboard` (bukan angka dummy).
- [ ] Notifikasi bisa dibaca dan ditandai sudah dibaca (`PATCH /api/notifications`).
- [ ] Endpoint `/api/reports/income` dan `/api/reports/orders` tersedia dan terisolasi per `tenant_id`.
- [ ] Halaman laporan menampilkan data agregat nyata dari D1.
- [ ] Lolos `aikido_full_scan` tanpa temuan keamanan.
