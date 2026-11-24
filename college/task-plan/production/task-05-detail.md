# Task 05 — Halaman Detail Produksi (`app/production/detail.html`)

**Fase:** 1 — Modul Produksi (`app/production/*`)  
**Prioritas PRD:** [M] Must (FR-12, FR-13) · Role: P, A, S  
**Dependensi:** Task 01  
**Target File:**
- `[NEW]` `app/production/detail.html`

---

## 🎯 Tujuan Task
Menyediakan tampilan rinci riwayat pengerjaan produksi satu pesanan, lengkap dengan **timeline 7 tahap + timestamp otomatis (FR-13)**, catatan teknis antar-staf, dan informasi penugasan penjahit.

---

## 🛠️ Spesifikasi Teknis
1. **App Shell & Header**:
   - Breadcrumb: `TailorHub / Produksi / TH-2041`.
   - Judul: `TH-2041 — Kemeja Formal ×3` beserta chip status produksi (`.chip--sew`: `Penjahitan`), chip deadline (`.chip--clay` / `.chip--danger`: `Besok · 24 Nov 2026`), dan chip bayar (`.chip--dp`: `DP`).
   - Tombol aksi header: `Update Status` (`update-status.html?code=TH-2041`), `Lihat Detail Pesanan` (`../orders/detail.html`), dan `Kembali ke Kanban` (`board.html`).
2. **Grid 2 Kolom (`.prod-grid` $\rightarrow$ 1 kolom di mobile)**:
   - **Kolom Kiri (Timeline & Catatan)**:
     - **Kartu Timeline Produksi 7 Tahap (`.prod-timeline`)**:
       - Tahap 1 (*Antrean*): Selesai (`--s-done`), `20 Nov 2026 · 09:15 WIB · Pak Mardi`, catatan: *"Bahan katun poplin diterima dan dicek"*.
       - Tahap 2 (*Pemotongan*): Selesai (`--s-done`), `21 Nov 2026 · 13:40 WIB · Andi S.`, catatan: *"Pola slim fit M/L selesai dipotong"*.
       - Tahap 3 (*Penjahitan*): **Sedang Berjalan** (`--clay` + halo), `Mulai: 22 Nov 2026 · 08:30 WIB · Andi S.`, catatan: *"Proses penyambungan badan dan kerah"*.
       - Tahap 4–7 (*Finishing, QC, Selesai, Diambil*): Status menunggu (abu-abu `--sand`) dengan estimasi target.
     - **Kartu Catatan Produksi & Form Tambah Catatan**:
       - Daftar catatan internal lantai produksi + form textarea untuk menambah catatan produksi baru (disimulasikan langsung muncul di daftar via JS).
   - **Kolom Kanan (Info Penugasan & Spesifikasi)**:
     - **Kartu Penanggung Jawab (Assignee)**: Avatar staf (`AS — Andi S.`), spesialisasi (`Penjahit Utama`), dropdown simulasi ganti penanggung jawab + tombol simpan.
     - **Kartu Spesifikasi Kain & Ukuran Ringkas**: Jenis kain, warna, jumlah pcs, ringkasan ukuran kunci (LD, panjang lengan, kerah), dan link ke `../orders/detail.html` untuk ukuran lengkap.
     - **Kartu Sinkronisasi Portal Customer**: Ringkasan kode tracking `TH-2041` dan tautan pratinjau ke `../../portal/track-result.html?code=TH-2041`.
3. **Dukungan Query Parameter `?code=...`**:
   - Skrip ringan yang membaca `?code=` di URL (misal `detail.html?code=TH-2035`) untuk menyesuaikan judul/kode tampilan secara dinamis jika dibuka dari kartu Kanban atau List.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `app/production/detail.html` terbuat sesuai App Shell.
- [x] Timeline 7 tahap tampil jelas dengan pembedaan visual selesai, aktif, dan menunggu.
- [x] Form tambah catatan produksi berjalan interaktif di klien.
- [x] Responsif 1 kolom pada layar $\le 900\text{px}$ dan 390px.
- [x] Lolos pemindaian `aikido_full_scan`.

---

## 📦 Saran Micro-Commit
```bash
git add app/production/detail.html
git commit -m "feat(production): tambah halaman detail alur dan timeline produksi"
```
