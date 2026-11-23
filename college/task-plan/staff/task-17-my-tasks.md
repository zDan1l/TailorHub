# Task 17 — Halaman Tugas Saya Staf (`app/staff/my-tasks.html`)

**Fase:** 2 — Modul Kerja Staf (`app/staff/*`)  
**Prioritas PRD:** [M] Must (Modul 5.3 · Role: S)  
**Dependensi:** Task 16  
**Target File:**
- `[NEW]` `app/staff/my-tasks.html`
- `[DELETE]` `app/staff/.gitkeep`

---

## 🎯 Tujuan Task
Membangun halaman **Tugas Saya** (`app/staff/my-tasks.html`) khusus bagi staf penjahit/pemotong yang bekerja di smartphone meja jahit ($\pm 390\text{px}$), menampilkan **hanya pesanan yang ditugaskan ke staf bersangkutan**, dikelompokkan berdasarkan urgensi & status pengerjaan, serta dilengkapi tombol aksi cepat besar **"Mulai Kerjakan"** dan **"Tandai Selesai"**.

---

## 🛠️ Spesifikasi Teknis
1. **Head & Impor CSS**:
   - Impor berurutan: `tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css` $\rightarrow$ `app.css` $\rightarrow$ `staff.css` (path relatif `../../assets/css/...`).
   - Sertakan SVG Sprite inline untuk seluruh ikon navigasi dan kartu tugas.
2. **App Shell (Sidebar + Topbar)**:
   - Gunakan struktur `.app > .scrim + aside.side + .main` yang konsisten dengan `app/production/board.html`.
   - Pada sidebar, sediakan akses ke **Produksi** (`../production/board.html`) dan tandai tautan **Tugas Saya (Staf)** (`my-tasks.html`) dengan `.is-on`.
   - Topbar ringkas (tombol burger mobile, kolom cari tugas/kode, tombol notifikasi `../notifications/index.html`, dan avatar staf yang aktif) agar tetap 0 overflow di `360px`.
3. **Header & Simulasi Akun Staf (Prototype Switcher)**:
   - Breadcrumb: `TailorHub / Staf / Tugas Saya`.
   - Kartu `.staff-hero`: Menampilkan profil staf yang login (default **Andi S. (`AS`) — Penjahit Utama**) + `<select class="select">` atau pill switcher simulasi untuk mengganti akun staf yang dilihat (**Andi S.**, **Rina N.**, **Mas Budi**) agar daftar tugas terfilter dinamis sesuai staf terpilih.
   - Ringkasan KPI (`.staff-kpis`): *Perlu Hari Ini*, *Sedang Berjalan*, dan *Selesai* yang dihitung otomatis dari daftar tugas staf aktif.
4. **Filter & Pengelompokan Tugas (`.staff-tabs`)**:
   - Tab 1 baris (`overflow-x: auto`):
     - **Semua Aktif**
     - **Perlu Dikerjakan Hari Ini** (tugas yang di-assign namun belum dikerjakan / mendekati deadline)
     - **Sedang Berjalan** (tugas yang sudah diklik *"Mulai Kerjakan"*)
     - **Selesai** (tab riwayat tugas yang sudah diselesaikan staf)
   - Pencarian cepat berdasarkan kode pesanan atau nama pakaian/pelanggan.
5. **Dataset Konsisten & Kartu Tugas Interaktif**:
   - Gunakan dataset yang sama dengan `app/production/board.html` & `detail.html`:
     - **Andi S. (`AS`)**: `TH-2041` (*Kemeja Formal ×3*, Penjahitan, deadline Besok `.chip--clay`), `TH-2037` (*Kemeja Batik ×6*, Pemotongan, 29 Nov), `TH-2040` (*Jas Formal ×1*, QC, H-2 `.chip--clay`), plus contoh riwayat selesai (`TH-2029`).
     - **Rina N. (`RN`)**: `TH-2038` (*Gamis Pesta ×1*, Penjahitan), `TH-2043` (*Kaos Komunitas ×30*, Pemotongan), `TH-2030` (*Kemeja Kerja ×2*, Selesai), `TH-2026` (*Kebaya Wisuda ×1*, Diambil).
     - **Mas Budi (`MB`)**: `TH-2033` (*Jas Formal ×1*, Finishing, Lewat Deadline `.chip--danger`), `TH-2035` (*Jas Almamater ×1*, Finishing), `TH-2042` (*Blazer Kerja ×2*, QC).
   - Tiap kartu memuat:
     - Kode order, chip tahap solid (`chip--cut`, `chip--sew`, `chip--finish`, `chip--qc`, `chip--done`), dan chip deadline (`.chip--clay` / `.chip--danger`).
     - Nama item + jumlah pcs, nama customer, ringkasan kain/potongan, dan status pengerjaan lokal (*Menunggu Dimulai* / *Sedang Dikerjakan sejak ...* / *Selesai pada ...*).
     - **Tombol Aksi Cepat Besar (`min-height: 44px`)**:
       - Jika belum dimulai: tombol **"Mulai Kerjakan"** (mengubah status menjadi *Sedang Berjalan*, mencatat timestamp lokal, memperbarui KPI, dan memunculkan Toast).
       - Jika sedang berjalan: tombol **"Tandai Selesai"** (memindahkan tugas ke tab *Selesai*, mencatat timestamp selesai, memperbarui KPI, dan memunculkan Toast simulasi notifikasi).
       - Tombol tautan **"Detail Instruksi"** $\rightarrow$ `task-detail.html?code=...&staff=...`.
6. **Housekeeping**:
   - Hapus `app/staff/.gitkeep`.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `app/staff/my-tasks.html` selesai dan `app/staff/.gitkeep` dihapus.
- [x] Hanya tugas milik staf terpilih yang tampil, dan switcher staf mengubah daftar tugas secara dinamis.
- [x] Tab *Perlu Dikerjakan Hari Ini*, *Sedang Berjalan*, dan *Selesai* berfungsi normal.
- [x] Tombol aksi cepat **"Mulai Kerjakan"** dan **"Tandai Selesai"** berukuran besar, mudah disentuh di `390px`/`360px`, dan memperbarui state + KPI + Toast.
- [x] Lolos pemindaian `aikido_full_scan` (0 issues SAST/Secrets).

---

## 📦 Saran Micro-Commit
```bash
git add app/staff/my-tasks.html app/staff/.gitkeep
git commit -m "feat(staff): tambah halaman tugas saya mobile-first untuk staf produksi"
```
