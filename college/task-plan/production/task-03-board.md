# Task 03 — Halaman Papan Kanban Produksi (`app/production/board.html`)

**Fase:** 1 — Modul Produksi (`app/production/*`)  
**Prioritas PRD:** [M] Must (FR-14) · Role: P, A, S  
**Dependensi:** Task 01, Task 02  
**Target File:**
- `[NEW]` `app/production/board.html`
- `[DELETE]` `app/production/.gitkeep`

---

## 🎯 Tujuan Task
Membangun halaman utama lantai produksi berupa **Papan Kanban 7 Tahap** lengkap dengan App Shell, filter staf/deadline, kartu pesanan interaktif, dan integrasi `production.css` + `kanban.js`.

---

## 🛠️ Spesifikasi Teknis
1. **Head & Impor CSS**:
   - Impor berurutan: `tokens.css`, `base.css`, `components.css`, `app.css`, `production.css` (relative path `../../assets/css/...`).
   - Sertakan SVG Sprite inline lengkap untuk ikon navigasi dan kartu.
2. **App Shell (Sidebar + Topbar)**:
   - Salin struktur sidebar dari `app/orders/index.html` / `app/dashboard.html`, dengan tautan relatif yang benar (`../dashboard.html`, `../orders/index.html`, `board.html` berkelas `.nav-i is-on`, `../customers/index.html`, dll).
   - Topbar dengan tombol burger mobile, global search, ikon notifikasi (`../notifications/index.html`), dan avatar `PM`.
3. **Header Halaman & Sub-Navigasi**:
   - Breadcrumb: `TailorHub / Produksi / Papan Kanban`.
   - Tombol header: `Pantau Deadline (2)` $\rightarrow$ `deadline-alerts.html` dan tombol toggle `Tampilan List` $\rightarrow$ `list.html`.
   - Sub-tab `.tabs`: **Papan Kanban** (aktif) | **List Pesanan Aktif** (`list.html`) | **Pantau Deadline** (`deadline-alerts.html`).
4. **Toolbar Filter**:
   - Input cari kode/pelanggan (`#kanbanSearch`), dropdown staf (`#filterStaff`: Semua Staf, Andi S. (AS), Rina N. (RN), Mas Budi (MB)), dropdown deadline (`#filterDeadline`: Semua, Lewat/Mendesak), dan tombol Reset.
5. **Kanban 7 Kolom Penuh (`.kanban.kanban--7`)**:
   - **Kolom 1 — Antrean** (`--s-queue`): `TH-2045` (Seragam Kantor ×20, PT Maju Jaya), `TH-2044` (Celana Bahan ×2, Rudi Darmawan).
   - **Kolom 2 — Pemotongan** (`--s-cut`): `TH-2037` (Kemeja Batik ×6, Sari Wulandari, AS).
   - **Kolom 3 — Penjahitan** (`--s-sew`): `TH-2041` (Kemeja Formal ×3, Budi Santoso, `is-late` Besok, AS), `TH-2038` (Gamis Pesta ×1, Nurul Laila, RN).
   - **Kolom 4 — Finishing** (`--s-finish`): `TH-2035` (Jas Almamater ×1, Citra Dewi, MB), `TH-2033` (Jas Formal ×1, Hendra W., `is-late` `-1 hari`, MB).
   - **Kolom 5 — QC** (`--s-qc`): `TH-2040` (Jas Formal ×1, Citra Dewi, 24 Nov, AS).
   - **Kolom 6 — Selesai** (`--s-done`): `TH-2030` (Kemeja ×2, Hendra W., Lunas).
   - **Kolom 7 — Diambil** (`--s-taken`): `TH-2026` (Kebaya Wisuda ×1, Ibu Ratna, Diambil 20 Nov).
   - Setiap kartu memiliki tautan ke `detail.html?code=...`, tombol aksi cepat ke `update-status.html?code=...`, dan tombol geser tahap berikutnya.
6. **Skrip & Housekeeping**:
   - Muat `../../assets/js/kanban.js` di akhir `<body>` + inisialisasi toggle sidebar mobile.
   - Hapus `app/production/.gitkeep`.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `app/production/board.html` selesai dan `app/production/.gitkeep` dihapus.
- [x] Ke-7 tahap produksi tampil dengan warna `.kcol-dot` sesuai token resmi.
- [x] Drag-and-drop, filter, dan tombol pindah tahap berfungsi mulus.
- [x] Tampilan rapi di desktop & mobile 390px tanpa merusak layout shell.
- [x] Lolos pemindaian `aikido_full_scan`.

---

## 📦 Saran Micro-Commit
```bash
git add app/production/board.html app/production/.gitkeep
git commit -m "feat(production): tambah halaman papan kanban produksi 7 tahap"
```
