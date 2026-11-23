# Task 06 — Halaman Update Status & Trigger Notifikasi (`app/production/update-status.html`)

**Fase:** 1 — Modul Produksi (`app/production/*`)  
**Prioritas PRD:** [M] Must (FR-12, FR-13, FR-30) · Role: A, S  
**Dependensi:** Task 01  
**Target File:**
- `[NEW]` `app/production/update-status.html`

---

## 🎯 Tujuan Task
Menyediakan antarmuka pembaruan tahap produksi yang mencatat *timestamp* otomatis, catatan pengerjaan staf, serta simulasi pengiriman notifikasi ke pelanggan via WhatsApp/In-App (FR-30).

---

## 🛠️ Spesifikasi Teknis
1. **App Shell & Header**:
   - Breadcrumb: `TailorHub / Produksi / Update Status`.
   - Konteks pesanan aktif di bagian atas (bisa memilih pesanan dari dropdown atau otomatis terisi lewat `?code=TH-2041`).
   - Menampilkan ringkasan tahap saat ini (misal: `.chip--sew` `Penjahitan (3/7)`) menuju tahap baru yang dipilih.
2. **Formulir Update Status (`.prod-grid`)**:
   - **Kolom Kiri (Form Utama)**:
     - **Pilih Pesanan** (select: `TH-2041 — Kemeja Formal ×3 (Budi Santoso)`, `TH-2037`, `TH-2035`, `TH-2033`, dll).
     - **Pilih Tahap Baru (`.stage-picker`)**: 7 kartu pilihan radio interaktif (*Antrean*, *Pemotongan*, *Penjahitan*, *Finishing*, *QC*, *Selesai*, *Diambil*) lengkap dengan titik warna token status masing-masing.
     - **Staf Penanggung Jawab Tahap**: Dropdown staf (`Andi S.`, `Rina N.`, `Mas Budi`, `Pak Mardi`).
     - **Catatan Progres Pengerjaan**: Textarea dengan contoh cepat (*quick chips*, misal: *"Selesai dijahit, lanjut setrika & kancing"*, *"Lolos QC, siap diambil"*).
     - **Timestamp Pencatatan**: Info *read-only* waktu real-time saat ini (`Otomatis dicatat oleh sistem`).
   - **Kolom Kanan (Notifikasi Customer FR-30 & Ringkasan)**:
     - **Toggle Kirim Notifikasi Otomatis** (`.toggle` dicentang default) untuk WhatsApp + Notifikasi In-App.
     - **Pratinjau Pesan WhatsApp (`.wa-preview`)**: Kotak pratinjau yang teksnya berubah dinamis mengikuti tahap baru & kode pesanan yang dipilih (contoh: *"Halo Bpk. Budi Santoso, pesanan TH-2041 (Kemeja Formal ×3) di Jahit Lestari kini berada di tahap Finishing..."*).
     - Ringkasan dampak: Peringatan singkat apabila status dipindah ke `Diambil` namun status bayar belum `Lunas` (mengacu kopling dengan modul Pembayaran).
3. **Simulasi Simpan**:
   - Tombol `Simpan & Perbarui Status` memunculkan alert sukses + toast notifikasi solid + tombol pintas kembali ke `board.html` atau `detail.html`.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `app/production/update-status.html` terbuat dengan urutan impor CSS resmi.
- [x] Pemilihan tahap memperbarui pratinjau pesan WhatsApp secara real-time.
- [x] Simulasi submit menampilkan konfirmasi *timestamp* dan toast tanpa error.
- [x] Responsif di desktop dan mobile 390px.
- [x] Lolos pemindaian `aikido_full_scan`.

---

## 📦 Saran Micro-Commit
```bash
git add app/production/update-status.html
git commit -m "feat(production): tambah halaman update status produksi dan preview notifikasi"
```
