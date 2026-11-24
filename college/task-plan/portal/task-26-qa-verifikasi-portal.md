# Task 26 — QA Akhir, Uji Mobile 360px/390px & Pembaruan Tracker (`portal/*`)

**Fase:** 3 — Portal Mandiri Pelanggan (`portal/*`)  
**Dependensi:** Task 20–25  
**Target File:**
- `[MODIFY]` `college/catatan-tugas-dev5.md` (tandai 6 halaman `portal/*` sebagai ✅ Selesai)
- `[MODIFY]` `college/task-plan/README.md` (tandai Task 20–26 sebagai ✅ Selesai)
- `[FIX IF NEEDED]` Perbaikan minor pada `assets/css/portal.css`, `assets/js/portal.js`, atau `portal/*.html` jika ditemukan bug saat pengujian.

---

## 🎯 Tujuan Task
Memastikan seluruh 6 halaman Portal Mandiri Pelanggan (`portal/*`) lolos audit arsitektur (bebas App Shell), audit responsivitas mobile (`360px` & `390px`), integrasi silang dari `app/production/detail.html`, serta pemindaian keamanan sebelum seluruh tugas Dev 5 dinyatakan selesai 100% (13/13 halaman).

---

## 🛠️ Langkah Verifikasi
1. **Audit Arsitektur & CSS**:
   - Pastikan **tidak ada** `<link ... app.css>`, class `.app`, `.side`, atau `.top` di seluruh `portal/*.html`.
   - Verifikasi urutan impor CSS di ke-6 halaman: `tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css` $\rightarrow$ `portal.css`.
   - Pastikan tidak ada warna hex mentah di luar `var(--...)` (kecuali `#fff` standar di atas elemen solid) dan tidak ada modifikasi pada file bersama (`tokens.css`, `base.css`, `components.css`, `app.css`, `icons.svg`).
2. **Audit Tautan Lintas-Halaman & Integrasi Modul Produksi**:
   - Uji tautan `"Buka Preview Portal"` dari `app/production/detail.html?code=TH-2041` $\rightarrow$ `portal/track-result.html?code=TH-2041` dan pastikan detail pesanan tampil identik.
   - Uji alur lengkap: `landing.html` $\rightarrow$ `track.html` $\rightarrow$ `track-result.html` $\rightarrow$ `customer-login.html` $\rightarrow$ `customer-register.html` $\rightarrow$ `customer-account.html` $\rightarrow$ `track-result.html`.
3. **Uji Browser Lokal (Desktop `1280px` & Mobile `390px` / `360px`)**:
   - Jalankan server lokal dan uji seluruh 6 halaman di `portal/*` via browser subagent:
     - Verifikasi `0px` *horizontal overflow* di `360 × 800 px` dan `390 × 800 px`.
     - Verifikasi seluruh `.chip` status tahap, status bayar, badge `Sedang Dikerjakan`, `.sample-chips`, dan tombol CTA tampil **1 baris** rapi dan mudah disentuh (`min-height >= 44px` untuk CTA utama).
     - Uji input kode valid (`TH-2041`, `th-2035`) & kode tidak valid di `track.html`.
     - Uji *stepper* 7 tahap di `track-result.html` untuk tahap awal (`TH-2045`), tengah (`TH-2041`), dan selesai/diambil (`TH-2030`, `TH-2026`).
     - Uji toggle kata sandi + simulasi login/register/switcher akun di `customer-login.html`, `customer-register.html`, dan `customer-account.html`.
4. **Keamanan**:
   - Jalankan `aikido_full_scan` pada `assets/css/portal.css`, `assets/js/portal.js`, dan seluruh 6 file `portal/*.html`.
5. **Update Dokumentasi Tracker**:
   - Tandai baris no. 8–13 (`portal/landing.html` s/d `portal/customer-account.html`) di `college/catatan-tugas-dev5.md` menjadi `✅ Selesai`.
   - Tandai Task 20–26 di `college/task-plan/README.md` menjadi `✅ Selesai`.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] Seluruh 6 halaman `portal/*` lulus uji browser `1280px`, `390px`, dan `360px` dengan `0` console error dan `0px` horizontal overflow.
- [x] Seluruh 6 halaman bersih dari `app.css` maupun elemen sidebar/topbar internal.
- [x] Integrasi `app/production/detail.html` $\rightarrow$ `portal/track-result.html?code=TH-2041` berjalan sinkron.
- [x] Seluruh file lolos `aikido_full_scan` tanpa temuan SAST/Secrets.
- [x] Tracker `college/catatan-tugas-dev5.md` (13/13 halaman) dan `college/task-plan/README.md` telah diperbarui.

---

## 📦 Saran Micro-Commit
```bash
git add portal/ assets/css/portal.css assets/js/portal.js
git commit -m "chore(portal): verifikasi mobile 360px/390px, integrasi lintas modul, dan finalisasi portal"
```
*(Catatan: `college/` berada di `.gitignore`, sehingga pembaruan dokumen di `college/` tetap bersifat lokal dan tidak mengotori commit tim).*
