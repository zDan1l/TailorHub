# Task 24 — Halaman Login & Daftar Akun Pelanggan Opsional (`portal/customer-login.html`, `portal/customer-register.html`)

**Fase:** 3 — Portal Mandiri Pelanggan (`portal/*`)  
**Prioritas PRD:** [C] Could (`FR-18`)  
**Dependensi:** Task 20, Task 21  
**Target File:**
- `[NEW]` `portal/customer-login.html`
- `[NEW]` `portal/customer-register.html`

---

## 🎯 Tujuan Task
Menyediakan halaman **Login** dan **Pendaftaran Akun Pelanggan** opsional (`FR-18`) agar pelanggan tetap yang memiliki beberapa pesanan dapat masuk untuk melihat seluruh riwayat pesanan mereka, tanpa mengganggu alur *Guest Tracking* bebas login.

---

## 🛠️ Spesifikasi Teknis

### 1. `portal/customer-login.html`
1. **Impor CSS & Struktur**:
   - Hanya `tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css` $\rightarrow$ `portal.css` (memanfaatkan `.auth-wrap`, `.auth-box`, `.auth-header`, `.auth-card` dari `components.css`).
   - Header menonjolkan branding **Jahit Lestari** (dengan badge kecil *"Portal Pelanggan"* dan tautan balik ke `landing.html`).
2. **Banner Pengingat Guest Access**:
   - Info ringkas di atas/bawah form: *"Hanya ingin cek 1 pesanan? Anda tidak wajib login."* + tombol **"Lacak Tanpa Login"** $\rightarrow$ `track.html`.
3. **Form Login Pelanggan**:
   - Input `Nomor WhatsApp atau Email` (default contoh: `citra.dewi@email.com` / `081234567891`).
   - Input `Kata Sandi` dengan tombol toggle lihat/sembunyi sandi (`#i-eye` / `#i-eye-off`, mengikuti pola `auth/login.html`).
   - Opsi pilih akun demo cepat (misal **Citra Dewi — 2 pesanan**, **Hendra W. — 2 pesanan**, **Budi Santoso — 1 pesanan**) atau langsung submit untuk masuk ke `customer-account.html`.
   - Tautan ke `customer-register.html` (*"Belum punya akun pelanggan? Daftar sekarang"*).

### 2. `portal/customer-register.html`
1. **Impor CSS & Struktur**:
   - Konsisten dengan `customer-login.html` memakai `.auth-wrap` + `.auth-card` (`tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css` $\rightarrow$ `portal.css`).
2. **Form Pendaftaran Pelanggan**:
   - Input: `Nama Lengkap`, `Nomor WhatsApp`, `Email (opsional)`, `Kata Sandi` (dengan toggle eye), dan `Konfirmasi Kata Sandi`.
   - Validasi sederhana sisi klien (panjang sandi min 6 karakter & kecocokan konfirmasi sandi) + penyimpanan sesi demo ke `portal.js` lalu arahkan ke `customer-account.html?welcome=1`.
   - Tautan ke `customer-login.html` (*"Sudah punya akun? Masuk di sini"*) dan `track.html` (*"Lacak pesanan tanpa login"*).

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `portal/customer-login.html` dan `portal/customer-register.html` terbuat tanpa `app.css` maupun `.side` / `.top`.
- [x] Toggle lihat/sembunyikan kata sandi berfungsi normal di kedua halaman.
- [x] Submit login maupun register menyimpan sesi simulasi via `portal.js` dan mengarahkan ke `customer-account.html`.
- [x] Tautan alternatif menuju *Guest Tracking* (`track.html`) tersedia jelas.
- [x] Lolos pemindaian `aikido_full_scan` (0 issues SAST/Secrets).

---

## 📦 Saran Micro-Commit
```bash
git add portal/customer-login.html portal/customer-register.html
git commit -m "feat(portal): tambah halaman login dan registrasi akun pelanggan opsional"
```
