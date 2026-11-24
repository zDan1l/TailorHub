# Task 07 — Aktivasi Auth Penuh, Deploy Produksi & Verifikasi Cloudflare

**PIC:** Koordinator / Tim Integrasi  
**Dependensi:** Task 02–06 selesai  
**Target:** Produksi Cloudflare Pages (`https://tailorhub-xxx.pages.dev`) + D1 Remote (`tailorhub`)

---

## 🔌 Penggunaan Plugin Cloudflare pada Task Ini
- Baca skill **`wrangler`** (terutama bagian *Validate* dan *Apply the Change*) serta **`cloudflare`** sebelum deploy ke produksi.
- Gunakan MCP **`cloudflare_cloudflare`** (`whoami`) untuk memastikan akun Cloudflare target benar.
- Gunakan MCP **`cloudflare_cloudflare`** (`search` + `execute`) untuk memeriksa daftar database D1 remote, status project Cloudflare Pages, dan verifikasi bahwa binding `DB` sudah terpasang di environment produksi (atau mendiagnosis error `52x`/`500` bila ada).
- Jalankan `npx wrangler pages deploy . --dry-run` (atau cek via `npm run deploy` setelah verifikasi) sesuai panduan skill `wrangler`.

---

## 🎯 Tujuan Task
Memastikan aplikasi aman untuk publik (tanpa bypass `DEV_TENANT_ID`), database D1 remote siap, proyek berhasil di-deploy ke Cloudflare Pages, dan seluruh alur utama lolos smoke test di URL produksi.

---

## 🛠️ Langkah Eksekusi

1. **Aktifkan Penjaga Login (`TH.requireAuth`) di Semua Halaman Internal:**
   - Pastikan seluruh halaman di `app/**` dan `account/**` memanggil `TH.requireAuth("/auth/login.html");` (tidak dikomentari lagi).
   - Pastikan halaman publik (`index.html`, `auth/*`, `portal/track.html`, `portal/track-result.html`, `portal/landing.html`) **tidak** memanggil `TH.requireAuth`.
2. **Audit Keamanan Pra-Deploy:**
   - Pastikan `.dev.vars` (berisi `DEV_TENANT_ID=1`) tidak masuk Git dan variabel `DEV_TENANT_ID` **tidak** diset di Cloudflare Pages Dashboard.
   - Uji lokal tanpa `DEV_TENANT_ID` (komentari sementara di `.dev.vars` lalu restart `npm run dev`): akses `/api/dashboard` tanpa token harus mengembalikan `401`.
   - Jalankan `aikido_full_scan` pada file konfigurasi/kode yang berubah di tahap final.
3. **Inisialisasi Database D1 Remote (Produksi):**
   ```bash
   npm run db:init:remote
   # Opsional jika ingin mengisi data demo di produksi:
   npm run db:seed:remote
   ```
4. **Deploy ke Cloudflare Pages:**
   ```bash
   npm run deploy
   ```
5. **Konfigurasi & Verifikasi Binding D1 di Produksi:**
   - Buka **Cloudflare Dashboard → Pages → tailorhub → Settings → Functions → D1 database bindings** (atau cek via MCP `cloudflare_cloudflare` `search` & `execute` untuk endpoint Pages project).
   - Pastikan binding bernama `DB` terhubung ke database D1 `tailorhub` untuk environment **Production** (dan **Preview** jika dipakai). Jika baru ditambahkan, lakukan re-deploy agar binding aktif.
6. **Smoke Test Produksi:**
   - Buka `https://<url-pages>.pages.dev/api/health` → verifikasi `{"ok":true,"db":"ok (...)"}`.
   - Uji register/login → buka Dashboard → buat Customer & Order → geser status di Kanban Produksi → catat Payment → cek pelacakan publik di `portal/track.html`.

---

## ✅ Kriteria Selesai (Definition of Done)
- [ ] `TH.requireAuth` aktif di seluruh halaman internal dan endpoint API menolak request tanpa token (`401`).
- [ ] `DEV_TENANT_ID` tidak ada di environment produksi.
- [ ] Schema D1 remote (`db:init:remote`) terpasang dan binding `DB` aktif di Cloudflare Pages.
- [ ] `npm run deploy` sukses dan URL produksi lolos smoke test end-to-end.
