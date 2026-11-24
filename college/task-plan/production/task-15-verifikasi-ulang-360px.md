# Task 15 — Verifikasi Ulang Browser 360px & Desktop + Penutupan Fase 1

**Fase:** 1C — Perbaikan Responsivitas Mobile 360px (`app/production/*`)  
**Dependensi:** Task 13, Task 14  
**Target File:**
- `[MODIFY]` `college/task-plan/production/insight-audit-responsivitas-360px.md` (catat hasil verifikasi setelah perbaikan)
- `[MODIFY]` `college/catatan-tugas-dev5.md` (tandai 5 halaman `app/production/*` sebagai ✅ Selesai)
- `[MODIFY]` `college/task-plan/README.md` (tandai Task 08 & Task 13–15 sebagai ✅ Selesai)

---

## 🎯 Tujuan Task
Memvalidasi secara langsung di browser bahwa seluruh temuan pada audit `360px` telah tuntas (`0px` horizontal overflow, seluruh badge/chip/tab 1 baris, `.alert` terbaca jelas, topbar rapi seperti `app/dashboard.html`), sekaligus menutup Fase 1 (`app/production/*`) dengan pengujian fungsional di desktop dan mobile.

---

## 🛠️ Langkah Verifikasi
1. Jalankan local HTTP server dan buka ke-5 halaman `app/production/*` via *browser subagent* pada viewport **`360 × 800 px`** dan **`1280 × 800 px`**:
   - `board.html`: cek `scrollWidth <= clientWidth`, `.top` rapi, `.tabs` 1 baris, 7 kolom Kanban + tombol `←`/`→` + filter.
   - `list.html`: cek `scrollWidth <= clientWidth`, `.tabs` 1 baris, pagination `10` item per halaman (`1–10` & `11–12`).
   - `detail.html`: cek `scrollWidth <= clientWidth`, `?code=TH-2035` memindahkan badge `Sedang Berjalan` ke langkah 4, `#detailWaPreview` rapi, `#btnSendWa` 1 baris.
   - `update-status.html`: cek `scrollWidth <= clientWidth`, `.stage-picker` column-flow `1/7`–`7/7`, `.quick-chip` 1 baris, `#waBubble` tidak overflow, `#successBanner` tetap tersembunyi sebelum submit.
   - `deadline-alerts.html`: cek `scrollWidth <= clientWidth`, banner `.alert--error` wrap rapi dengan tombol `Prioritaskan` lebar penuh di bawah teks, filter pills bekerja.
2. Perbarui status di `college/catatan-tugas-dev5.md`, `college/task-plan/README.md`, dan catat status lulus di `insight-audit-responsivitas-360px.md`.
3. Jalankan `aikido_scan_paths` pada seluruh file terkait.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `0px` horizontal overflow di seluruh 5 halaman pada viewport `360px`.
- [x] Seluruh badge, `.chip`, `.tabs a`, `.alert-pill`, dan `.quick-chip` tampil 1 baris pada `360px`.
- [x] Seluruh file lolos `aikido_scan_paths` dan tracker `college/` diperbarui menjadi ✅ Selesai.

---

## 📦 Saran Micro-Commit
*(Jika tidak ada perbaikan kode tambahan, cukup tandai checklist di `college/` yang ter-gitignore, atau commit perbaikan minor jika ditemukan saat verifikasi).*
