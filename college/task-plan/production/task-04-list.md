# Task 04 — Halaman List View Pesanan Aktif (`app/production/list.html`)

**Fase:** 1 — Modul Produksi (`app/production/*`)  
**Prioritas PRD:** [M] Must (FR-14) · Role: P, A, S  
**Dependensi:** Task 01  
**Target File:**
- `[NEW]` `app/production/list.html`

---

## 🎯 Tujuan Task
Menyediakan alternatif tampilan tabel (*List View*) bagi pemilik, admin, atau staf yang ingin menyortir/memindai seluruh pesanan produksi aktif dalam satu layar padat informasi, dengan tautan bolak-balik ke `board.html`.

---

## 🛠️ Spesifikasi Teknis
1. **App Shell & Navigasi**:
   - Struktur CSS & App Shell identik dengan `board.html`, menu Sidebar **Produksi** berstatus `.is-on`.
   - Sub-tab `.tabs`: **Papan Kanban** (`board.html`) | **List Pesanan Aktif** (aktif) | **Pantau Deadline** (`deadline-alerts.html`).
   - Tombol header kanan: `Buka Kanban` (`board.html`) dan `Pantau Deadline` (`deadline-alerts.html`).
2. **Toolbar Filter Tabel**:
   - Pencarian teks (kode/customer/jenis), filter dropdown **Tahap Produksi** (7 tahap), filter **Penanggung Jawab**, filter **Status Pembayaran** (`Belum Bayar`, `DP`, `Lunas`).
   - Filter bekerja secara live di sisi klien (Vanilla JS ringan) pada baris tabel `<tbody>`.
3. **Tabel Pesanan Aktif (`.table-card` / `.tw`)**:
   - Kolom tabel:
     1. **Kode & Item** (link ke `detail.html?code=...`, contoh `TH-2041` · `Kemeja Formal ×3`)
     2. **Customer** (`.cust-cell` dengan `.mini` inisial + nama)
     3. **Tahap Produksi** (chip solid resmi misal `<span class="chip chip--sew"><span class="d"></span>Penjahitan</span>` + mini teks `3/7`)
     4. **Penanggung Jawab** (avatar inisial staf + nama staf, misal `Andi S.`)
     5. **Pembayaran** (chip solid `.chip--unpaid`, `.chip--dp`, `.chip--paid`)
     6. **Deadline** (tanggal + badge `.chip--danger` untuk lewat deadline atau `.chip--clay` untuk H-1/H-2)
     7. **Aksi** (tombol kecil `Detail` $\rightarrow$ `detail.html` dan `Update` $\rightarrow$ `update-status.html`)
4. **Pagination (`.pager`)**:
   - Footer tabel dengan info jumlah data (`Menampilkan 1–9 dari 9 pesanan aktif`) dan kontrol `.pager`.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `app/production/list.html` terbuat dengan urutan impor CSS lengkap.
- [x] Seluruh status produksi dan pembayaran menggunakan kelas `.chip--*` solid resmi.
- [x] Filter pencarian, tahap, dan staf pada tabel berjalan interaktif.
- [x] Tabel dibungkus `.tw` (`overflow-x: auto`) agar halaman mobile 390px tidak meluber.
- [x] Lolos pemindaian `aikido_full_scan`.

---

## 📦 Saran Micro-Commit
```bash
git add app/production/list.html
git commit -m "feat(production): tambah halaman list view pesanan aktif produksi"
```
