# Task 07 — Halaman Pantau Deadline Kritis (`app/production/deadline-alerts.html`)

**Fase:** 1 — Modul Produksi (`app/production/*`)  
**Prioritas PRD:** [S] Should (FR-15, FR-31) · Role: P, A  
**Dependensi:** Task 01  
**Target File:**
- `[NEW]` `app/production/deadline-alerts.html`

---

## 🎯 Tujuan Task
Menyediakan pusat pantauan khusus bagi Pemilik dan Admin untuk mengidentifikasi pesanan yang **sudah melewati deadline** atau **mendekati deadline ($\le 3$ hari)**, diurutkan dari yang paling mendesak agar tidak terjadi keterlambatan penyerahan ke pelanggan.

---

## 🛠️ Spesifikasi Teknis
1. **App Shell & Navigasi**:
   - Sidebar menu **Produksi** berstatus `.is-on`.
   - Sub-tab `.tabs`: **Papan Kanban** (`board.html`) | **List Pesanan Aktif** (`list.html`) | **Pantau Deadline** (aktif).
2. **Ringkasan KPI Urgensi (`.kpis` / `.tile`)**:
   - **Lewat Deadline**: `1` pesanan (`.delta--down` `-1 hari` — aksen `--red`).
   - **Jatuh Tempo Besok**: `1` pesanan (`.delta--warn` `H-1` — aksen `--warn`).
   - **Dalam 3 Hari**: `2` pesanan (aksen `--clay`).
   - **Jadwal Aman**: `5` pesanan (`.delta--up` `On Track` — aksen `--s-done`).
3. **Banner Peringatan & Filter**:
   - Banner `.alert.alert--error` menyorot pesanan yang sudah melewati tenggat (`TH-2033` milik Hendra W. terlambat 1 hari).
   - Filter tab/pill: `Semua Mendesak (4)` | `Lewat Deadline (1)` | `Mendekati ≤3 Hari (3)`.
4. **Daftar Prioritas Terurut (`.table-card` / Kartu Alert)**:
   - Diurutkan dari paling kritis ke aman:
     1. **`TH-2033`** (Jas Formal ×1 · Hendra W.) — `.chip--danger` `Lewat 1 hari` — Tahap: `.chip--finish` `Finishing` — Staf: `Mas Budi` — Aksi: `Prioritaskan / Update`.
     2. **`TH-2041`** (Kemeja Formal ×3 · Budi Santoso) — `.chip--clay` `Besok (H-1)` — Tahap: `.chip--sew` `Penjahitan` — Staf: `Andi S.`.
     3. **`TH-2040`** (Jas Formal ×1 · Citra Dewi) — `.chip--clay` `24 Nov (H-2)` — Tahap: `.chip--qc` `QC` — Staf: `Andi S.`.
     4. **`TH-2035`** (Jas Almamater ×1 · Citra Dewi) — `.chip--soft` `26 Nov (H-4)` — Tahap: `.chip--finish` `Finishing` — Staf: `Mas Budi`.
   - Setiap baris menyediakan aksi langsung ke `update-status.html?code=...` dan `detail.html?code=...`, serta tombol simulasi *"Kirim Pengingat ke Staf"* yang memicu toast.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `app/production/deadline-alerts.html` terbuat sesuai App Shell.
- [x] Indikator urgensi memakai `.chip--danger` (lewat) dan `.chip--clay` (mendekati) sesuai aturan `README.md`.
- [x] Filter kategori urgensi bekerja secara interaktif.
- [x] Tampilan rapi di desktop & mobile 390px.
- [x] Lolos pemindaian `aikido_full_scan`.

---

## 📦 Saran Micro-Commit
```bash
git add app/production/deadline-alerts.html
git commit -m "feat(production): tambah halaman pantau deadline kritis produksi"
```
