# Task 19 — QA Akhir, Uji Mobile 360px/390px & Pembaruan Tracker (`app/staff/*`)

**Fase:** 2 — Modul Kerja Staf (`app/staff/*`)  
**Dependensi:** Task 16, Task 17, Task 18  
**Target File:**
- `[MODIFY]` `college/catatan-tugas-dev5.md` (tandai 2 halaman `app/staff/*` sebagai ✅ Selesai)
- `[MODIFY]` `college/task-plan/README.md` (tandai Task 16–19 sebagai ✅ Selesai)
- `[FIX IF NEEDED]` Perbaikan minor pada `assets/css/staff.css` atau `app/staff/*.html` jika ditemukan bug saat pengujian.

---

## 🎯 Tujuan Task
Memastikan modul antarmuka kerja staf (`app/staff/my-tasks.html` dan `app/staff/task-detail.html`) lolos verifikasi kualitas visual, responsivitas mobile (`360px` dan `390px`), integrasi lintas halaman, serta pemindaian keamanan sebelum beralih ke Fase 3 (`portal/`).

---

## 🛠️ Langkah Verifikasi
1. **Audit CSS & Token**:
   - Pastikan tidak ada hex warna mentah di luar `var(--...)` pada `assets/css/staff.css` dan `app/staff/*.html`.
   - Verifikasi urutan impor CSS: `tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css` $\rightarrow$ `app.css` $\rightarrow$ `staff.css`.
   - Pastikan tidak ada perubahan pada file bersama (`tokens.css`, `base.css`, `components.css`, `app.css`, `icons.svg`).
2. **Audit Tautan Lintas Halaman**:
   - Pastikan navigasi antara `my-tasks.html`, `task-detail.html?code=...`, `../production/board.html`, `../production/detail.html?code=...`, dan `../dashboard.html` berfungsi tanpa `#` kosong.
3. **Uji Browser Lokal (Desktop `1280px` & Mobile `390px` / `360px`)**:
   - Jalankan server lokal dan uji ke-2 halaman via browser subagent:
     - Verifikasi `0px` *horizontal overflow* di `360 × 800 px` dan `390 × 800 px`.
     - Verifikasi seluruh `.chip`, `.staff-tabs`, dan tombol aksi cepat tampil rapi (tidak ada chip/tab terlipat 2 baris tak wajar; tombol aksi minimal tinggi `44px`).
     - Uji switcher staf (`AS` / `RN` / `MB`), filter tab (*Perlu Hari Ini*, *Sedang Berjalan*, *Selesai*), tombol **"Mulai Kerjakan"**, dan **"Tandai Selesai"** di `my-tasks.html`.
     - Uji `task-detail.html?code=TH-2041` dan `?code=TH-2038`, checklist meja kerja, catatan progres, dan tombol **"Tandai Selesai Tahap Ini"**.
     - Verifikasi menu burger off-canvas di viewport mobile.
4. **Keamanan**:
   - Jalankan `aikido_full_scan` pada `assets/css/staff.css`, `app/staff/my-tasks.html`, dan `app/staff/task-detail.html`.
5. **Update Dokumentasi Tracker**:
   - Tandai baris no. 6 (`app/staff/my-tasks.html`) dan no. 7 (`app/staff/task-detail.html`) di `college/catatan-tugas-dev5.md` menjadi `✅ Selesai`.
   - Tandai Task 16–19 di `college/task-plan/README.md` menjadi `✅ Selesai`.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `app/staff/my-tasks.html` dan `app/staff/task-detail.html` lulus uji browser desktop, `390px`, dan `360px` dengan `0` console error dan `0px` horizontal overflow.
- [x] Seluruh alur interaktif (*Mulai Kerjakan*, *Tandai Selesai*, switcher staf, query `?code=`) berfungsi mulus.
- [x] Seluruh file lolos `aikido_full_scan` tanpa temuan SAST/Secrets.
- [x] Tracker di `college/catatan-tugas-dev5.md` dan `college/task-plan/README.md` telah diperbarui.

---

## 📦 Saran Micro-Commit
```bash
git add app/staff/ assets/css/staff.css
git commit -m "chore(staff): verifikasi mobile 360px/390px, tautan, dan polish modul kerja staf"
```
*(Catatan: `college/` berada di `.gitignore`, sehingga pembaruan dokumen di `college/` tetap bersifat lokal dan tidak mengotori commit tim).*
