# Task 08 — QA Akhir, Uji Responsivitas & Pembaruan Tracker (`app/production/*`)

**Fase:** 1 — Modul Produksi (`app/production/*`)  
**Dependensi:** Task 03, Task 04, Task 05, Task 06, Task 07  
**Target File:**
- `[MODIFY]` `college/catatan-tugas-dev5.md` (tandai 5 halaman `app/production/*` sebagai ✅ Selesai)
- `[MODIFY]` `college/task-plan/README.md` (tandai Task 01–08 sebagai ✅ Selesai)
- `[FIX IF NEEDED]` Perbaikan minor pada file `app/production/*` atau `assets/js/kanban.js` jika ditemukan bug saat pengujian.

---

## 🎯 Tujuan Task
Melakukan audit kualitas menyeluruh pada seluruh modul `app/production/*` sebelum pindah ke modul berikutnya (`app/staff/*` dan `portal/`), memastikan nol broken link, nol error JS, dan responsivitas penuh di desktop maupun mobile.

---

## 🛠️ Langkah Verifikasi
1. **Audit CSS & Token**:
   - Pastikan tidak ada hex warna mentah di luar `var(--...)` dalam `assets/css/production.css` dan `app/production/*.html`.
   - Verifikasi seluruh 5 halaman mengimpor CSS dengan urutan: `tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css` $\rightarrow$ `app.css` $\rightarrow$ `production.css`.
2. **Audit Tautan Lintas Halaman**:
   - Periksa seluruh `href` di sidebar dan konten agar tidak ada `#` kosong pada rute yang tersedia (`board.html`, `list.html`, `detail.html`, `update-status.html`, `deadline-alerts.html`, `../dashboard.html`, `../orders/index.html`, `../orders/detail.html`).
3. **Uji Browser Lokal (Desktop & Mobile 390px)**:
   - Jalankan local server dan uji ke-5 halaman via browser subagent:
     - Verifikasi drag-and-drop & filter di `board.html`.
     - Verifikasi filter tabel di `list.html`.
     - Verifikasi parameter `?code=` dan tambah catatan di `detail.html`.
     - Verifikasi preview WhatsApp & submit di `update-status.html`.
     - Verifikasi filter urgensi di `deadline-alerts.html`.
     - Verifikasi off-canvas menu `.burger` pada lebar layar `390px` dan pastikan tidak ada overflow horizontal halaman.
4. **Keamanan**:
   - Jalankan `aikido_scan_paths` pada seluruh file yang dibuat di Fase 1.
5. **Update Dokumentasi**:
   - Perbarui status checklist di `college/catatan-tugas-dev5.md` dan `college/task-plan/README.md`.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] Seluruh 5 halaman `app/production/*` lulus uji browser desktop dan mobile 390px/360px tanpa error konsol.
- [x] Seluruh file lolos scan keamanan Aikido tanpa temuan.
- [x] Tracker di `college/` telah diperbarui.

---

## 📦 Saran Micro-Commit
```bash
git add app/production/ assets/css/production.css assets/js/kanban.js
git commit -m "chore(production): verifikasi responsivitas, tautan, dan polish modul produksi"
```
*(Catatan: `college/` berada di `.gitignore`, sehingga pembaruan dokumen di `college/` tetap bersifat lokal dan tidak mengotori commit tim).*
