# Task 01 — Stylesheet Khusus Produksi (`assets/css/production.css`)

**Fase:** 1 — Modul Produksi (`app/production/*`)  
**Prioritas:** Fondasi (Wajib sebelum halaman HTML dibuat)  
**Target File:**
- `[NEW]` `assets/css/production.css`

---

## 🎯 Tujuan Task
Menyediakan satu stylesheet terisolasi khusus untuk modul produksi agar tidak mengubah `components.css` atau `app.css` milik bersama, namun menjaga desain 100% identik dengan `style-guide.html` dan `app/dashboard.html`.

---

## 🛠️ Spesifikasi Teknis
Buat `assets/css/production.css` dengan komponen styling berikut (seluruh warna/radius/bayangan wajib memakai `var(--...)`):

1. **Toolbar Filter & Sub-Navigasi Produksi**:
   - `.prod-toolbar`: Flex/grid bar untuk input cari, dropdown filter staf/tahap/deadline, dan tombol toggle `Kanban | List`.
   - `.prod-summary`: Baris KPI ringkas (`tile` atau pill counter) untuk `deadline-alerts.html`.
2. **Papan Kanban 7 Kolom (selaras `app/dashboard.html` & `style-guide.html`)**:
   - `.kanban-wrap`: Scroll horizontal halus (`overflow-x: auto`) agar 7 kolom rapi di layar desktop maupun tablet.
   - `.kanban--7`: `grid-template-columns: repeat(7, minmax(250px, 1fr))` dengan `gap: 14px`.
   - `.kcol`, `.kcol-head`, `.kcol-dot`, `.kcount`: Wadah kolom berlatar `--cream-200`, border `--sand`, radius `--r-l`.
   - State drag-and-drop: `.kcol.is-over` (highlight border `--clay` & latar lembut saat kartu di-hover di atas kolom) dan `.kcard.is-dragging` (opacity menurun ringan).
3. **Kartu Kanban (`.kcard` & `.kc-*`)**:
   - Menyamakan 100% gaya kartu seragam pada `app/dashboard.html`: aksen kiri `--acc`, `.kc-top`, `.kc-code`, `.kc-type`, `.kc-title`, `.kc-cust`, `.kc-steps` (7 segmen `i.on`), `.kc-stepslabel`, `.kc-foot`, `.kc-dead` (`.is-late`), `.kc-assignee`.
   - `.kc-actions`: Baris tombol aksi kecil di bagian bawah/hover kartu (misal: *"Detail"* dan *"Tahap Berikut"* untuk akses mudah di mobile/touchscreen).
4. **Timeline Produksi Vertikal (`.prod-timeline`)**:
   - Styling bersih untuk 7 langkah riwayat produksi pada `detail.html` (node selesai `--s-done`, node aktif `--clay` + halo `--clay-100`, node mendatang `--sand`, garis penghubung vertikal).
5. **Layout Detail & Update Status**:
   - `.prod-grid`: Grid 2 kolom (`2fr 1fr`) untuk `detail.html` dan `update-status.html` yang otomatis menjadi `1fr` pada breakpoint `@media (max-width: 900px)`.
   - `.wa-preview`: Kotak pratinjau pesan WhatsApp pada `update-status.html`.
   - `.stage-picker`: Kartu pilihan radio 7 tahap produksi yang responsif pada `update-status.html`.
6. **Responsivitas Mobile (`@media (max-width: 560px)`)**:
   - Pastikan toolbar filter menumpuk rapi (`grid-template-columns: 1fr`) dan `.kanban-wrap` tetap menjaga lebar halaman tanpa memicu scroll horizontal di `<body>`.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] File `assets/css/production.css` terbuat.
- [x] Tidak ada warna hex mentah di luar `var(--...)` (kecuali `rgba(...)` standar untuk transparansi scrim/shadow atau `#fff` teks di atas chip solid).
- [x] Tidak ada modifikasi pada `tokens.css`, `base.css`, `components.css`, atau `app.css`.
- [x] Lolos pemindaian `aikido_full_scan`.

---

## 📦 Saran Micro-Commit
```bash
git add assets/css/production.css
git commit -m "style(production): tambah stylesheet khusus modul produksi dan kanban"
```
