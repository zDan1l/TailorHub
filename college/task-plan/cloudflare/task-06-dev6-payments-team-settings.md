# Task 06 — Dev 6: Integrasi Pembayaran, Manajemen Tim & Pengaturan Tenant

**PIC:** Dev 6  
**Dependensi:** Task 01 selesai  
**Target File:**
- `[MODIFY]` `app/payments/index.html`, `app/payments/record.html`, `app/payments/detail.html`, `app/payments/invoice.html`, `app/payments/receipt.html`
- `[MODIFY]` `app/team/index.html`, `app/team/member-detail.html`, `app/team/activity-log.html`
- `[MODIFY]` `app/settings/tenant.html`, `app/settings/billing.html`, `app/settings/notifications.html`, `app/settings/order-preferences.html`, `app/settings/security.html`
- `[NEW]` `functions/api/team/index.js` & `functions/api/team/[id].js` *(CRUD user tim per tenant)*
- `[NEW]` `functions/api/settings/tenant.js` *(GET/PUT profil & pengaturan usaha tenant)*

---

## 🔌 Penggunaan Plugin Cloudflare pada Task Ini
- Baca skill **`workers-best-practices`** dan **`workers-development`** sebelum membuat endpoint `/api/team` dan `/api/settings/tenant`.
- Gunakan MCP **`cloudflare_cloudflare`** (`docs`) jika perlu memeriksa praktik RBAC/validasi request di Cloudflare Pages Functions.

---

## 🎯 Tujuan Task
Menghubungkan pencatatan pembayaran (DP/pelunasan otomatis) serta membangun endpoint & integrasi halaman manajemen tim dan pengaturan tenant.

---

## 🛠️ Langkah Eksekusi

1. **Integrasi Pembayaran (`app/payments/*`):**
   - Muat `<script src="/assets/js/api.js"></script>` di seluruh halaman pembayaran.
   - `index.html`: Ambil riwayat pembayaran lewat `GET /api/payments` dan daftar tagihan order via `GET /api/orders`.
   - `record.html`: Ambil pilihan pesanan (`GET /api/orders`), kirim pembayaran baru ke `POST /api/payments` (`{ order_id, amount, type, method }`). Backend otomatis menghitung ulang `payment_status` (`Belum Bayar` → `DP` → `Lunas`).
   - `detail.html`, `invoice.html`, `receipt.html`: Baca `?id=` atau `?order_id=`, ambil detail dari `GET /api/orders/:id` dan `GET /api/payments?order_id=...` untuk mengisi rincian tagihan, total terbayar, sisa tagihan, dan kuitansi cetak.
2. **Buat Endpoint Tim (`functions/api/team/index.js` & `[id].js`):**
   - Wajib ambil `const t = data.auth.tenantId;` dan batasi akses sensitif untuk role `pemilik` / `admin` (`data.auth.role`).
   - `GET /api/team`: Daftar `users` milik tenant (`id, name, email, role, status, created_at` — **jangan** kembalikan `password_hash`).
   - `POST /api/team`: Tambah/undang anggota baru (hash password awal via `_utils.js`, cek duplikasi email dalam tenant).
   - `GET/PUT/DELETE /api/team/:id`: Detail, ubah role/status (`aktif`/`nonaktif`), atau hapus anggota dengan `WHERE id = ? AND tenant_id = ?`.
3. **Buat Endpoint Pengaturan Tenant (`functions/api/settings/tenant.js`):**
   - `GET /api/settings/tenant`: Ambil data usaha dari `tenants WHERE id = ?`.
   - `PUT /api/settings/tenant`: Perbarui `name, email, phone, address, logo_url` (validasi hak akses `pemilik`/`admin`).
4. **Sambungkan `app/team/*` & `app/settings/*`:**
   - Sambungkan halaman tim ke `/api/team*` dan `activity-log.html` ke riwayat status/notifikasi (`/api/notifications` atau endpoint log).
   - Sambungkan `app/settings/tenant.html` dan halaman pengaturan lain ke `/api/settings/tenant`.
5. **Uji & Scan Keamanan:**
   - Uji catat pembayaran DP lalu pelunasan hingga status order berubah otomatis menjadi `Lunas`.
   - Uji tambah & nonaktifkan staf di `/api/team`, pastikan `password_hash` tidak pernah bocor di JSON response.
   - Jalankan `aikido_full_scan` pada semua file yang dibuat/diubah.

---

## ✅ Kriteria Selesai (Definition of Done)
- [ ] Pencatatan pembayaran via UI memperbarui `payments` dan `orders.payment_status` di D1 secara otomatis.
- [ ] Endpoint `/api/team` dan `/api/settings/tenant` tersedia, terfilter `tenant_id`, dan menerapkan validasi role.
- [ ] Halaman `app/team/*` dan `app/settings/*` terhubung ke data nyata D1.
- [ ] Lolos `aikido_full_scan` tanpa temuan keamanan.
