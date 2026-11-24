# Insight Audit Responsivitas Mobile (Lebar 360px) — Modul Produksi (`app/production/*`)

**Metode Pengujian:** Live Browser Audit pada viewport **`360 × 800 px`** (`clientWidth: 344.67px` dengan scrollbar vertikal).  
**Halaman Acuan (Referensi):** `app/dashboard.html`  
**Halaman Diuji (Task 01–12):**
1. `app/production/board.html`
2. `app/production/list.html`
3. `app/production/detail.html`
4. `app/production/update-status.html`
5. `app/production/deadline-alerts.html`

---

## 📊 1. Mengapa `app/dashboard.html` Rapi di 360px? (Benchmark Referensi)

Berdasarkan pengukuran langsung di browser pada lebar `360px`, `app/dashboard.html` tidak memiliki *horizontal overflow* (`0px`) karena 3 keputusan CSS penting:
1. **Topbar (`.top-actions`) Ringkas**: Hanya memuat **2 elemen ikon** (tombol lonceng `42×42px` dan avatar `PM` `42×42px`), sehingga kolom `.search` masih mendapat ruang **`154.67px`** dan tinggi `.top` terjaga di **`66.67px`**.
2. **Padding Mobile Lebih Lega (`@media (max-width: 560px)`)**:
   - `.page` mengecilkan padding dari `26px` menjadi **`18px 16px`** (menambah ruang lebar konten sebesar `+20px`, dari `292.67px` menjadi `312.67px`).
   - `.top` mengecilkan padding dari `13px 26px` menjadi **`12px 16px`**.
3. **Semua Badge/Chip 1 Baris**: Seluruh 16 `.chip` pada `dashboard.html` memiliki `white-space: nowrap` dengan teks singkat sehingga tingginya konsisten **`24.34px`** (1 baris).

---

## 🚨 2. Daftar Temuan Masalah Responsivitas 360px pada `app/production/*`

### Temuan 1 (Kritis — Semua 5 Halaman): Horizontal Overflow `57.33px` Akibat `.top-actions`
- **Halaman Terdampak:** `board.html`, `list.html`, `detail.html`, `update-status.html`, `deadline-alerts.html`.
- **Gejala & Ukuran Aktual:**
  - Seluruh halaman dapat digeser ke kanan sejauh **`57.33px`** (lebar total meluber ke `402.21px` dari viewport `344.67px`).
  - Penyebab utamanya adalah tombol `<a href="deadline-alerts.html" class="btn btn--ghost btn--sm">Alert Deadline <span class="badge-count">2</span></a>` di dalam `.top-actions`.
  - Pada lebar 360px:
    - Tombol `Alert Deadline 2` membengkak menjadi **`159.84 × 65.52px`** dan **teksnya terlipat menjadi 2 baris**.
    - Input `.search` di topbar tergencet dari `154.67px` menjadi hanya **`60.67px`** (placeholder hilang/terpotong).
    - Tombol lonceng notifikasi terpotong di tepi kanan layar (`x: 320.51`), dan avatar `PM` terdorong **keluar layar sepenuhnya** (`x: 366.46` s/d `402.21px`).
- **Rekomendasi Perbaikan:**
  - Samakan `.top-actions` dengan `app/dashboard.html` (cukup tombol lonceng + avatar `PM`), **atau** sembunyikan tombol `.top-actions .btn` pada `@media (max-width: 680px)` karena tombol `Pantau Deadline (2)` sudah tersedia di `.page-head` dan sub-tab navigasi.
  - Tambahkan aturan `.page { padding: 18px 16px; } .top { padding: 12px 16px; }` pada `@media (max-width: 560px)` di `assets/css/production.css` agar identik dengan `app/dashboard.html`.

---

### Temuan 2 (`board.html`, `list.html`, `deadline-alerts.html`): Sub-Navigasi `.tabs a` Terlipat Menjadi 2–3 Baris
- **Gejala & Ukuran Aktual:**
  - Di dalam `.prod-subnav`, ketiga item `.tabs a` (`Papan Kanban`, `List Pesanan Aktif`, `Pantau Deadline`) dipaksa berbagi lebar `292.67px` tanpa `white-space: nowrap`.
  - Akibatnya tinggi baris tab membengkak menjadi **`93.09px`**:
    - `Papan Kanban`: `87.91 × 93.09px` (2 baris)
    - `List Pesanan Aktif`: `101.13 × 93.09px` (**3 baris**)
    - `Pantau Deadline`: `95.64 × 93.09px` (2 baris)
- **Rekomendasi Perbaikan:**
  - Tambahkan `overflow-x: auto; white-space: nowrap;` pada `.prod-subnav .tabs` serta `white-space: nowrap; flex: none;` pada `.prod-subnav .tabs a` (dengan padding mobile `9px 12px` dan `font-size: .83rem`) sehingga setiap tab tetap **1 baris** rapi.

---

### Temuan 3 (`update-status.html`): Badge `.quick-chip` Terlipat 2 Baris & Baris Chip Transisi Terpecah
- **Gejala & Ukuran Aktual:**
  1. **Badge `.quick-chip` 2 Baris:** Tombol `.quick-chip:nth-child(1)` (`"Selesai dijahit, lanjut setrika & kancing"`) berukuran **`243.33 × 42px`** dan **terlipat menjadi 2 baris** (melanggar aturan *"satu badge teksnya tidak dua baris"*), sedangkan 2 chip lainnya (`"Pola selesai dipotong"` dan `"Lolos QC, siap diambil"`) tampil 1 baris (`26.67px`).
  2. **Deretan Chip Transisi Tahap:** Pada kartu ringkasan `Pesanan Aktif`, deretan `[Penjahitan (3/7)] → [Finishing (4/7)]` terpecah ke baris baru di mana panah `→` tertinggal di baris atas dan chip kedua turun ke bawah.
  3. **Opsi `<select id="orderSelect">`:** Teks opsi yang panjang terlipat hingga 3 baris di dalam kotak select.
- **Rekomendasi Perbaikan:**
  - Tambahkan `white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;` pada `.quick-chip` dan ringkas label tampilan chip pertama menjadi `"Selesai dijahit, lanjut setrika"` (nilai `data-note` tetap kalimat lengkap).
  - Pada `@media (max-width: 560px)`, perkecil ukuran chip transisi atau izinkan container `.quick-chips` melakukan scroll horizontal halus agar tidak ada chip yang patah menjadi 2 baris.

---

### Temuan 4 (`deadline-alerts.html`): Banner `.alert.alert--error` Tergencet Ekstrem (`95px` Lebar Teks, 16 Baris)
- **Gejala & Ukuran Aktual:**
  - Komponen `.alert.alert--error` (`292.67 × 363.49px`) menaruh ikon (`22px`), blok teks, dan tombol `Prioritaskan` (`113.34px`) dalam satu baris `display: flex` tanpa `flex-wrap`.
  - Akibatnya ruang untuk teks pesan di tengah hanya tersisa **`95.32px`**, memaksa kalimat peringatan terlipat menjadi **~16 baris vertikal sempit** setinggi `333.49px`.
- **Rekomendasi Perbaikan:**
  - Pada `@media (max-width: 560px)` di `assets/css/production.css`, tambahkan `flex-wrap: wrap;` pada `.alert` dan atur `.alert .btn` agar menjadi `width: 100%; justify-content: center; margin-top: 6px;` sehingga teks peringatan menggunakan lebar penuh kartu dan tombol aksi berada rapi di bawahnya.

---

### Temuan 5 (`detail.html`): Tombol `"Kirim Update WA ke Customer"` Terlipat 2 Baris
- **Gejala & Ukuran Aktual:**
  - Seluruh `.chip` status di `detail.html` (`Penjahitan (3/7)`, `Deadline: Besok · 24 Nov 2026`, `DP`, `Progres 3 dari 7 tahap`, `Sedang Berjalan`, `Sinkron Otomatis`) sudah tampil **1 baris** (`height: 22.78px–25.68px`).
  - Namun tombol `#btnSendWa` (`"Kirim Update WA ke Customer"`) di dalam kartu gelap `Portal Tracking Publik` (`lebar 243.33px`) terlipat menjadi 2 baris (`height: 56.67px`) karena padding horizontal tombol `.btn` cukup lebar.
- **Rekomendasi Perbaikan:**
  - Sesuaikan padding/font-size `.btn--sm` di dalam kartu pada `@media (max-width: 560px)` atau ringkas teks tombol menjadi `"Kirim Update WA"` agar tetap 1 baris (`38px`).

---

## ✅ Bagian yang Sudah Lulus Audit 360px dengan Baik
- **Burger Menu & Off-Canvas Sidebar**: Berfungsi normal di seluruh 5 halaman (terbuka `256 × 800px` saat diklik dan tertutup saat klik backdrop `.scrim`).
- **Seluruh `.chip` Status Produksi, Pembayaran & Deadline**: Di `board.html`, `list.html`, `detail.html`, `update-status.html`, dan `deadline-alerts.html` semuanya **1 baris** (`24.34px–25.68px`) berkat `white-space: nowrap`.
- **Papan Kanban (`.kanban-wrap`) & Tabel (`.table-wrap > .tw`)**: Keduanya melakukan *internal horizontal scroll* tanpa merusak lebar halaman.
- **Pratinjau Pesan WhatsApp (`.wa-bubble` & `.detail-wa-preview`)**: URL tracking panjang terbungkus rapi di dalam kartu tanpa overflow horizontal.
- **Filter Pills (`.alert-pills`) & Stage Picker (`.stage-picker`)**: Seluruh item `.alert-pill` dan ke-7 pilihan `.stage-opt` (`1/7 Antrean` s/d `7/7 Diambil`) tampil **1 baris** penuh dan mudah ditekan di layar sentuh.

---

## 🛠️ Ringkasan Rencana Perbaikan (Jika Siap Dieksekusi)

| Prioritas | Target Perbaikan | File yang Diubah |
|:---:|---|---|
| **P1** | Hilangkan overflow horizontal `57.33px` & rapikan `.top` / `.page` di `<= 560px` (sembunyikan `.top-actions .btn` di layar sempit + samakan padding `.page` & `.top` dengan `dashboard.html`) | `assets/css/production.css` |
| **P2** | Buat `.alert` wrap di mobile agar teks banner `deadline-alerts.html` tidak tergencet `95px` | `assets/css/production.css` |
| **P3** | Buat `.prod-subnav .tabs` tetap 1 baris (`white-space: nowrap; overflow-x: auto`) | `assets/css/production.css` |
| **P4** | Pastikan `.quick-chip` di `update-status.html` tetap 1 baris (`white-space: nowrap` + ringkas label chip ke-1) dan rapikan tombol `#btnSendWa` di `detail.html` | `assets/css/production.css`, `app/production/update-status.html`, `app/production/detail.html` |

---

## ✅ 3. Hasil Verifikasi Ulang Pasca-Perbaikan (Task 13–15)

**Status:** **LULUS 100%** pada viewport **`360 × 800 px`** dan **`1280 × 800 px`** dengan **0 console errors**.

| Halaman | Overflow `360px` | Topbar `.top` `360px` | Semua Badge / Chip / Tab 1 Baris | Catatan Fungsional & Layout |
|---|---|---|---|---|
| `board.html` | **0 px** (`344.67px`) | **Lulus** (`66.67px`, search `154.67px`) | **Lulus** (`.tabs a` `41.25px`, `.chip` `24.34px`) | 7 kolom Kanban + aksi `←`/`→` + filter `AS` + Reset + off-canvas burger menu berjalan mulus. |
| `list.html` | **0 px** (`344.67px`) | **Lulus** (`66.67px`) | **Lulus** (29 `.chip` `≤ 25.68px`, `.tabs a` `41.25px`) | Tabel scroll internal `.tw`, pagination 10 item (`1–10` & `11–12` dari 12 pesanan), dan filter berjalan mulus. |
| `detail.html?code=TH-2035` | **0 px** (`344.67px`) | **Lulus** (`66.67px`) | **Lulus** (6 `.chip` `≤ 25.68px`, `#btnSendWa` `39.33px`) | Badge `Sedang Berjalan` tepat di langkah `4. Finishing`, `#detailWaPreview` wrap rapi, form tambah catatan berfungsi. |
| `update-status.html?code=TH-2041` | **0 px** (`344.67px`) | **Lulus** (`66.67px`) | **Lulus** (`.quick-chip` `26.67px`, chip transisi sejajar) | `#successBanner` & `#unpaidWarn` tersembunyi awal, `.stage-picker` column-flow `1/7–7/7`, `#waBubble` wrap rapi, submit memicu banner + toast. |
| `deadline-alerts.html` | **0 px** (`344.67px`) | **Lulus** (`66.67px`) | **Lulus** (`.alert-pill` & `.chip` 1 baris) | Banner `.alert--error` wrap rapi dengan tombol `Prioritaskan` lebar penuh di bawah teks, filter `Lewat Deadline (1)` & tombol `Ingatkan Staf` berfungsi. |
