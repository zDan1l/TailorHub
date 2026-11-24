# Task 16 — Stylesheet Khusus Antarmuka Kerja Staf (`assets/css/staff.css`)

**Fase:** 2 — Modul Kerja Staf (`app/staff/*`)  
**Prioritas:** Fondasi (Wajib sebelum halaman HTML staf dibuat)  
**Target File:**
- `[NEW]` `assets/css/staff.css`

---

## 🎯 Tujuan Task
Menyediakan stylesheet terisolasi khusus untuk antarmuka kerja staf (`app/staff/my-tasks.html` dan `app/staff/task-detail.html`) yang dioptimalkan untuk layar smartphone meja jahit ($\pm 360\text{px}$–$390\text{px}$), tanpa memodifikasi `tokens.css`, `base.css`, `components.css`, atau `app.css` milik bersama.

---

## 🛠️ Spesifikasi Teknis
Buat `assets/css/staff.css` dengan komponen styling berikut (seluruh warna/radius/bayangan wajib memakai `var(--...)` dan menerapkan pelajaran audit responsivitas `360px` dari Fase 1):

1. **Perlindungan Layout Mobile (`@media (max-width: 560px)`)**:
   - Pastikan `[hidden] { display: none !important; }` tersedia.
   - Terapkan `.page { padding: 18px 16px; }` dan `.top { padding: 12px 16px; }` pada layar $\le 560\text{px}$ agar identik dengan `app/dashboard.html` dan bebas *horizontal overflow*.
   - Sembunyikan tombol sekunder di `.top-actions .btn` pada `@media (max-width: 680px)` agar kolom `.search`, ikon lonceng, dan avatar staf di topbar tidak tergencet.
2. **Banner Profil & Ringkasan Beban Kerja Staf (`.staff-hero`, `.staff-switcher`, `.staff-kpis`)**:
   - `.staff-hero`: Kartu ringkas identitas staf yang sedang bertugas (avatar inisial, nama, spesialisasi, dan dropdown/pill switcher simulasi akun staf: *Andi S.*, *Rina N.*, *Mas Budi*).
   - `.staff-kpis`: Grid ringkas 3 indikator tugas (*Hari Ini*, *Sedang Dikerjakan*, *Selesai*) yang responsif (`repeat(3, 1fr)` di desktop/tablet, tetap rapi 3 kolom kompak atau wrap bersih di `360px`).
3. **Tab Pengelompokan Tugas (`.staff-tabs`)**:
   - Gaya pill/tab yang mendukung `overflow-x: auto; white-space: nowrap;` dengan item `flex: none` agar label tab (*Semua Aktif*, *Perlu Hari Ini*, *Sedang Berjalan*, *Selesai*) selalu tampil **1 baris** tanpa terlipat di `360px`.
4. **Kartu Tugas Ramah Sentuh (`.task-list`, `.task-card`)**:
   - `.task-list`: Daftar kartu 1 kolom di mobile, grid `repeat(auto-fill, minmax(340px, 1fr))` di desktop/tablet.
   - `.task-card`: Kartu beraksen kiri sesuai warna status (`--acc`), header kode order + chip tahap solid (`.chip--cut`, `.chip--sew`, `.chip--finish`, `.chip--qc`, `.chip--done`), badge deadline (`.chip--clay` / `.chip--danger`), ringkasan item & bahan, serta blok catatan singkat.
   - `.task-actions`: Tombol aksi cepat berukuran besar (**minimal tinggi `44px`** agar nyaman ditekan jari penjahit di meja mesin): tombol utama **"Mulai Kerjakan"** / **"Tandai Selesai"** dan tombol sekunder **"Detail Instruksi"**. Pastikan teks tombol ringkas dan tidak terlipat 2 baris secara canggung di `360px`.
5. **Layout Detail Instruksi Tugas (`task-detail.html`)**:
   - `.task-detail-grid`: Grid 2 kolom (`1.4fr 1fr`) di desktop dan otomatis menjadi `1fr` di `@media (max-width: 900px)`.
   - `.model-ref`: Kartu foto/ilustrasi acuan model pakaian dengan badge bagian detail (*kerah, potongan, jahitan*).
   - `.measure-grid`: Grid spesifikasi ukuran kustom (`LD`, `Lengan`, `Bahu`, `Kerah`, `Panjang`, dll.) dalam kotak bernilai kontras tinggi agar mudah dibaca sekilas saat memotong/menjahit.
   - `.designer-note`: Kotak sorotan catatan desainer/admin berlatar lembut (`--amber-100` / `--clay-100` dengan border kiri `--clay`).
   - `.staff-action-bar`: Panel aksi penyelesaian tahap yang menonjol di bawah instruksi dengan tombol **"Mulai Kerjakan"** / **"Tandai Selesai Tahap Ini"** (`min-height: 48px`) dan input catatan progres singkat.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] File `assets/css/staff.css` terbuat.
- [x] Tidak ada warna hex mentah di luar `var(--...)` (kecuali `rgba(...)` standar untuk bayangan atau `#fff` untuk teks di atas chip/tombol solid).
- [x] Tidak ada modifikasi pada `tokens.css`, `base.css`, `components.css`, atau `app.css`.
- [x] Lolos pemindaian `aikido_full_scan` (0 issues SAST/Secrets).

---

## 📦 Saran Micro-Commit
```bash
git add assets/css/staff.css
git commit -m "style(staff): tambah stylesheet mobile-first untuk antarmuka kerja staf"
```
