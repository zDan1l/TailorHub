# Task 25 — Halaman Riwayat Pesanan Pelanggan (`portal/customer-account.html`)

**Fase:** 3 — Portal Mandiri Pelanggan (`portal/*`)  
**Prioritas PRD:** [C] Could (`FR-18`, `FR-22`)  
**Dependensi:** Task 20, Task 22, Task 24  
**Target File:**
- `[NEW]` `portal/customer-account.html`

---

## 🎯 Tujuan Task
Membangun dashboard akun pelanggan (`portal/customer-account.html`) yang menampilkan seluruh riwayat dan pesanan aktif milik pelanggan yang login di tenant **Jahit Lestari**, lengkap dengan filter status, ringkasan pembayaran, dan akses cepat ke detail progres di `track-result.html`.

---

## 🛠️ Spesifikasi Teknis
1. **Head & Impor CSS (TANPA `app.css`)**:
   - Impor berurutan: `tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css` $\rightarrow$ `portal.css`.
   - Tanpa sidebar `.side` dan tanpa topbar internal `.top`.
2. **Header & Identitas Pelanggan (`.portal-header`, `.cust-banner`)**:
   - Header publik **Jahit Lestari** dengan tombol **"Lacak Kode"** (`track.html`) dan **"Keluar"** (`customer-login.html`).
   - Kartu `.cust-banner`: Menampilkan nama pelanggan aktif dari sesi `portal.js` (default **Citra Dewi** bila dibuka langsung tanpa login terlebih dahulu, atau sesuai akun yang dipilih/didaftarkan di Task 24), nomor WhatsApp, serta switcher demo cepat (*Citra Dewi*, *Hendra W.*, *Budi Santoso*) agar dosen/penguji dapat melihat perbedaan riwayat pesanan tanpa harus logout-login berulang kali.
3. **Ringkasan KPI Pesanan Pelanggan (`.cust-kpis`)**:
   - 3 metrik ringkas: **Total Pesanan**, **Sedang Dikerjakan**, dan **Selesai / Diambil** yang dihitung dinamis dari daftar pesanan pelanggan aktif.
4. **Filter Tab & Pencarian Riwayat (`Semua`, `Sedang Proses`, `Selesai`)**:
   - Tab 1 baris (`overflow-x: auto; white-space: nowrap`) untuk memisahkan pesanan yang masih berjalan vs arsip selesai/diambil.
   - Pencarian cepat berdasarkan kode pesanan atau nama busana.
5. **Daftar Kartu Riwayat Pesanan (`.cust-order-card`)**:
   - Contoh konsisten dari dataset `TH-2030`–`TH-2045`:
     - **Citra Dewi**: `TH-2040` (*Jas Formal ×1*, QC 5/7, Lunas) & `TH-2035` (*Jas Almamater ×1*, Finishing 4/7, Lunas), ditambah 1 contoh arsip selesai historis agar tab *Selesai* terisi.
     - **Hendra W.**: `TH-2033` (*Jas Formal ×1*, Finishing 4/7, DP) & `TH-2030` (*Kemeja Kerja ×2*, Selesai 6/7 — Siap Diambil, Lunas).
     - **Budi Santoso**: `TH-2041` (*Kemeja Formal ×3*, Penjahitan 3/7, DP).
   - Tiap kartu memuat: kode order, nama item & jumlah, mini progress bar (`step / 7`), `.chip` tahap solid + `.chip` status bayar (keduanya **1 baris**), estimasi selesai, dan tombol **"Lihat Progres Detail"** $\rightarrow$ `track-result.html?code=...`.
   - Jika akun baru mendaftar dari `customer-register.html` dan belum punya pesanan tertaut, tampilkan *empty state* yang rapi dengan tombol **"Lacak Pesanan dengan Kode"** $\rightarrow$ `track.html` dan **"Hubungi WhatsApp CS"**.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `portal/customer-account.html` terbuat tanpa `app.css` maupun `.side` / `.top`.
- [x] Daftar pesanan tampil dinamis sesuai akun aktif (`Citra Dewi`, `Hendra W.`, `Budi Santoso`, atau akun baru) dan filter tab *Semua* / *Sedang Proses* / *Selesai* bekerja normal.
- [x] Klik **"Lihat Progres Detail"** membuka `track-result.html?code=...` dengan data yang sinkron.
- [x] Seluruh `.chip`, tab, dan kartu tampil rapi dengan `0px` *horizontal overflow* di `360 × 800 px`.
- [x] Lolos pemindaian `aikido_full_scan` (0 issues SAST/Secrets).

---

## 📦 Saran Micro-Commit
```bash
git add portal/customer-account.html
git commit -m "feat(portal): tambah halaman dashboard riwayat pesanan pelanggan"
```
