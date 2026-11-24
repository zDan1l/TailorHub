# Task 01 — Setup Lingkungan Lokal, Wrangler & Database D1

**Fase:** 1 — Fondasi Infrastruktur Lokal  
**Prioritas:** Kritis (Blocker untuk seluruh Task 02–07)  
**Target File:**
- `[MODIFY]` `wrangler.toml` *(isi `database_id` hasil `db:create`)*
- `[NEW]` `.dev.vars` *(salinan lokal dari `.dev.vars.example` — jangan di-commit)*

---

## 🔌 Penggunaan Plugin Cloudflare pada Task Ini
- Baca skill **`wrangler`** dan **`workers-development`** sebelum menjalankan perintah CLI atau mengedit `wrangler.toml`.
- Gunakan MCP **`cloudflare_cloudflare`** (`whoami`) untuk memastikan sesi akun Cloudflare aktif bila perlu membuat D1 remote atau cek akun.
- Gunakan MCP **`cloudflare_cloudflare`** (`docs`) bila menemui error binding D1 atau flag Wrangler di versi `^3.90.0`.
- **Catatan Penting:** Proyek ini menggunakan `wrangler.toml`, sehingga **tetap pakai Wrangler** (`npm run ...`), bukan `cf dev` / `cf deploy`.

---

## 🎯 Tujuan Task
Menyiapkan runtime Cloudflare Pages + Functions + D1 lokal agar seluruh anggota tim bisa menjalankan `npm run dev` di `http://localhost:8788` dengan data demo dari `db/seed.sql`.

---

## 🛠️ Langkah Eksekusi

1. **Install dependency lokal:**
   ```bash
   npm install
   ```
2. **Login ke Cloudflare CLI:**
   ```bash
   npx wrangler login
   ```
3. **Buat database D1 & salin ID:**
   ```bash
   npm run db:create
   ```
   - Ambil nilai `database_id` dari output terminal.
   - Buka `wrangler.toml` baris 24, ganti `"GANTI_DENGAN_DATABASE_ID_ANDA"` dengan ID tersebut.
4. **Siapkan variabel environment lokal:**
   ```powershell
   Copy-Item .dev.vars.example .dev.vars
   ```
   - Pastikan `.dev.vars` berisi `DEV_TENANT_ID=1` dan terdaftar di `.gitignore`.
5. **Inisialisasi schema & isi data demo (lokal):**
   ```bash
   npm run db:reset
   ```
6. **Jalankan dev server & verifikasi endpoint:**
   ```bash
   npm run dev
   ```
   - Cek `http://localhost:8788/api/health` → harus mengembalikan `{"ok":true,"db":"ok (1 tenant)"}`.
   - Uji cepat `http://localhost:8788/api/dashboard` dan `http://localhost:8788/api/orders` untuk memastikan data seed terbaca.

---

## ✅ Kriteria Selesai (Definition of Done)
- [ ] `node_modules/` terpasang (`wrangler` berjalan normal).
- [ ] `wrangler.toml` memiliki `database_id` valid (bukan placeholder).
- [ ] `.dev.vars` terbuat secara lokal dengan `DEV_TENANT_ID=1` dan tidak masuk status `git status` untracked/commit.
- [ ] `npm run db:reset` sukses tanpa error SQL.
- [ ] `GET http://localhost:8788/api/health` mengembalikan `{"ok":true,"db":"ok (1 tenant)"}`.
