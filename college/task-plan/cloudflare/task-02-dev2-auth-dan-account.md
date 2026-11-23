# Task 02 — Dev 2: Integrasi Auth, Onboarding & Akun Pengguna

**PIC:** Dev 2 (Angel)  
**Dependensi:** Task 01 selesai  
**Target File:**
- `[MODIFY]` `auth/login.html`, `auth/register.html`, `auth/onboarding.html` *(serta halaman auth pendukung bila relevan)*
- `[MODIFY]` `account/profile.html`, `account/change-password.html`, `account/preferences.html`
- `[NEW]` `functions/api/account/index.js` *(atau `functions/api/account.js` untuk `PUT /api/account`)*

---

## 🔌 Penggunaan Plugin Cloudflare pada Task Ini
- Baca skill **`workers-best-practices`** dan **`workers-development`** sebelum membuat endpoint `PUT /api/account`.
- Gunakan MCP **`cloudflare_cloudflare`** (`docs`) untuk referensi Web Crypto / PBKDF2 di Cloudflare Workers runtime bila perlu memodifikasi alur ganti password.

---

## 🎯 Tujuan Task
Menghubungkan seluruh alur autentikasi nyata (register tenant baru, login, logout, cek sesi aktif) dan pengelolaan profil akun ke Cloudflare Pages Functions + D1.

---

## 🛠️ Langkah Eksekusi

1. **Sambungkan `auth/login.html`:**
   - Muat `<script src="/assets/js/api.js"></script>`.
   - Pada submit form login, panggil `await TH.login(email, password)` lalu redirect ke `/app/dashboard.html`.
   - Tampilkan pesan error yang jelas saat kredensial salah (`catch (err)`).
2. **Sambungkan `auth/register.html` & `auth/onboarding.html`:**
   - Muat `/assets/js/api.js`.
   - Panggil `await TH.register({ usaha, nama, email, password })` (otomatis membuat tenant + user pemilik + menyimpan token).
   - Redirect ke `/auth/onboarding.html` atau `/app/dashboard.html` sesuai alur wizard.
3. **Buat endpoint `PUT /api/account`:**
   - Ikuti pola di `functions/api/auth/me.js` dan `_utils.js`.
   - Ambil `userId` dan `tenantId` dari `context.data.auth`.
   - Dukung pembaruan nama/profil user serta ganti password (verifikasi password lama & hash password baru dengan fungsi hash di `_utils.js`, jangan simpan polos).
   - Wajib filter query `WHERE id = ? AND tenant_id = ?`.
4. **Sambungkan `account/profile.html`, `account/change-password.html`, `account/preferences.html`:**
   - Muat `/assets/js/api.js` dan pasang `TH.requireAuth("/auth/login.html")`.
   - Ambil data aktif via `GET /api/auth/me` dan simpan perubahan via `PUT /api/account`.
   - Sambungkan tombol logout di App Shell/account agar memanggil `await TH.logout()` lalu redirect ke `/auth/login.html`.
5. **Uji & Scan Keamanan:**
   - Uji login dengan akun demo (`owner@jahitlestari.id` / `password123`), register akun baru, dan update profil sambil memantau DB via `npm run db:console`.
   - Jalankan `aikido_full_scan` pada semua file yang diubah/ditambah.

---

## ✅ Kriteria Selesai (Definition of Done)
- [ ] Login dan register berhasil menyimpan token `th_token` di `localStorage` dan membuat baris baru di tabel `sessions` / `users` / `tenants`.
- [ ] Endpoint `PUT /api/account` berjalan, memvalidasi input, meng-hash password baru, dan memfilter `tenant_id`.
- [ ] Halaman `account/*` menampilkan data user asli dari `/api/auth/me` dan bisa menyimpan perubahan.
- [ ] Lolos `aikido_full_scan` tanpa temuan keamanan.
