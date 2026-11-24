# Task 22 — Halaman Hasil Pelacakan Real-time (`portal/track-result.html`)

**Fase:** 3 — Portal Mandiri Pelanggan (`portal/*`)  
**Prioritas PRD:** [M] Must (`FR-19` — *Killer Feature* Portal Pelanggan)  
**Dependensi:** Task 20, Task 21  
**Target File:**
- `[NEW]` `portal/track-result.html`

---

## 🎯 Tujuan Task
Membangun halaman **Hasil Pelacakan Pesanan Real-time** (`portal/track-result.html`) yang menjadi nilai jual utama TailorHub bagi pelanggan: menampilkan progres 7 tahap secara visual dan mudah dipahami, estimasi tanggal selesai/fitting, status pembayaran ringkas, serta tombol bantuan WhatsApp langsung ke penjahit.

---

## 🛠️ Spesifikasi Teknis
1. **Head & Impor CSS (TANPA `app.css`)**:
   - Impor berurutan: `tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css` $\rightarrow$ `portal.css`.
   - Tanpa sidebar `.side` dan tanpa topbar internal `.top`.
2. **Pembacaan Query Parameter `?code=...`**:
   - Membaca `?code=` dari URL via `portal.js` (default fallback ke `TH-2041` jika diakses langsung tanpa `?code=` agar preview langsung informatif, sambil menampilkan *state* tidak ditemukan bila `?code=` diisi kode yang tidak dikenal dengan tombol **"Cari Kode Lain"** $\rightarrow$ `track.html`).
   - Pastikan tautan dari `app/production/detail.html?code=TH-2041` (`Buka Preview Portal` $\rightarrow$ `../../portal/track-result.html?code=TH-2041`) langsung merender data **TH-2041 — Kemeja Formal ×3 (Budi Santoso)**.
3. **Kartu Ringkasan Header Pesanan (`.result-summary`)**:
   - Menampilkan badge kode pesanan (`TH-2041`), nama tenant (**Jahit Lestari**), nama pelanggan (`Budi Santoso`), item & jumlah (`Kemeja Formal ×3 · 3 Pcs (M, L, L)`), dan 2–3 `.chip` 1 baris:
     - Chip tahap aktif (`.chip--queue` s/d `.chip--taken`)
     - Chip status pembayaran (`.chip--unpaid`, `.chip--dp`, atau `.chip--paid`)
     - Chip estimasi selesai / status siap diambil
   - Blok ringkasan progres angka (*"Tahap 3 dari 7 · Estimasi Selesai: 24 Nov 2026"*) dan catatan terakhir untuk pelanggan (*"Kain furing sudah terpasang, sedang proses pasang lengan & kerah"*).
4. **Visual Stepper Timeline 7 Tahap (`.stepper`)**:
   - Menampilkan seluruh 7 tahap secara berurutan:
     1. `Antrean`
     2. `Pemotongan`
     3. `Penjahitan`
     4. `Finishing`
     5. `QC`
     6. `Selesai`
     7. `Diambil`
   - Perilaku visual per status:
     - **Tahap Selesai (`step < activeStep`)**: Ikon centang hijau (`--s-done`), keterangan *"Selesai"* + waktu ringkas.
     - **Tahap Aktif (`step === activeStep`)**: Sorotan aksen `--clay` (atau warna tahap aktif), badge **`Sedang Dikerjakan`** (atau **`Siap Diambil`** pada tahap 6 / **`Selesai & Diambil`** pada tahap 7), dan deskripsi ramah pelanggan.
     - **Tahap Berikutnya (`step > activeStep`)**: Abu-abu netral (`--sand` / `--ink-45`), keterangan *"Menunggu giliran"*.
5. **Kartu Bantuan WhatsApp & Aksi Lanjutan (`.wa-help-card`)**:
   - Ajakan ramah: *"Ada pertanyaan tentang ukuran, fitting, atau jadwal ambil?"*
   - Tombol **"Hubungi WhatsApp CS"** (`https://wa.me/6281234567890?text=...` berisi kode pesanan otomatis) dan tombol **"Lacak Pesanan Lain"** $\rightarrow$ `track.html`.
   - Tautan halus di bawah untuk pelanggan tetap: *"Punya beberapa pesanan? Lihat di Akun Pelanggan"* $\rightarrow$ `customer-login.html`.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `portal/track-result.html` terbuat tanpa `app.css` maupun elemen `.side` / `.top`.
- [x] Mengakses `track-result.html?code=TH-2041`, `?code=TH-2035`, `?code=TH-2030`, `?code=TH-2026`, dan `?code=TH-2045` merender *stepper* 7 tahap, status bayar, dan estimasi secara akurat.
- [x] Kode tidak valid menampilkan kartu *empty/not-found state* dengan tombol kembali ke `track.html`.
- [x] Seluruh `.chip`, badge tahap aktif, dan tombol WhatsApp tampil 1 baris dan `0px` *horizontal overflow* di `360 × 800 px`.
- [x] Lolos pemindaian `aikido_full_scan` (0 issues SAST/Secrets).

---

## 📦 Saran Micro-Commit
```bash
git add portal/track-result.html
git commit -m "feat(portal): tambah halaman hasil pelacakan real-time dengan stepper 7 tahap"
```
