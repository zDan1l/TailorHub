# Task 20 — Stylesheet & Skrip Data Bersama Portal (`assets/css/portal.css`, `assets/js/portal.js`)

**Fase:** 3 — Portal Mandiri Pelanggan (`portal/*`)  
**Prioritas:** Fondasi (Wajib sebelum seluruh halaman HTML portal dibuat)  
**Target File:**
- `[NEW]` `assets/css/portal.css`
- `[NEW]` `assets/js/portal.js`

---

## 🎯 Tujuan Task
Menyediakan fondasi gaya terisolasi (`assets/css/portal.css`) dan modul data/lookup pesanan terpusat (`assets/js/portal.js`) untuk seluruh halaman publik `portal/*`, **tanpa mengimpor `app.css`** dan tanpa mengubah file CSS bersama (`tokens.css`, `base.css`, `components.css`, `app.css`).

---

## 🛠️ Spesifikasi Teknis

### 1. Stylesheet `assets/css/portal.css`
Seluruh warna, radius, dan bayangan wajib memakai `var(--...)` dari `tokens.css` serta menerapkan standar bebas *horizontal overflow* di viewport `360 × 800 px`:
1. **Shell Publik Tanpa App Shell (`.portal-page`, `.portal-header`, `.portal-shell`, `.portal-footer`)**:
   - Latar `var(--cream)`, `min-height: 100vh`, kontainer terpusat `max-width: 640px` (atau varian `.portal-shell--wide` `760px` bila perlu untuk `customer-account.html`) dengan padding `20px 16px 40px`.
   - `.portal-header`: Topbar publik sederhana (tanpa `.side` / `.top` internal), berisi logo + nama tenant **Jahit Lestari** di kiri dan tautan ringkas (*Lacak* / *Masuk Akun*) di kanan yang tetap rapi 1 baris di `360px`.
   - `.portal-footer`: Catatan kaki ringkas berisi alamat workshop, jam buka, dan tautan WhatsApp CS + kredit TailorHub.
2. **Hero & Kartu Informasi Tenant (`landing.html`)**:
   - `.portal-hero`: Kartu sambutan hangat berlatar `var(--paper)` / aksen halus `var(--clay-100)` dengan badge buka/jam operasional, judul ajakan lacak pesanan tanpa login, dan tombol CTA primer **"Lacak Pesanan Sekarang"** (`min-height: 48px`).
   - `.portal-info-grid`: Grid informasi workshop (Jam Buka, Lokasi, Kontak WhatsApp CS, Estimasi Layanan) `2` kolom di desktop dan `1` kolom di `@media (max-width: 560px)`.
3. **Kartu Pencarian Guest (`track.html`)**:
   - `.track-box`: Kartu fokus input kode pesanan dengan input besar (`font-size: 1.05rem`, huruf kapital otomatis / `text-transform: uppercase`), tombol submit lebar penuh **"Cek Status Jahitan"**, dan deretan `.sample-chips` (chip contoh kode cepat seperti `TH-2041`, `TH-2035`, `TH-2030`, `TH-2045`) dengan `flex-wrap: wrap` dan `white-space: nowrap` per chip.
   - `.track-help` & `.track-error`: Panduan menemukan kode di nota cetak/WhatsApp serta banner pesan error ramah saat kode tidak ditemukan.
4. **Visual Stepper 7 Tahap & Kartu Hasil (`track-result.html`)**:
   - `.result-summary`: Kartu header ringkas (kode order, nama item & jumlah pcs, nama customer, `.chip` status tahap aktif, `.chip` status pembayaran, serta estimasi tanggal selesai/fitting).
   - `.stepper` & `.step-item`: Timeline vertikal 7 tahap (`Antrean` $\rightarrow$ `Pemotongan` $\rightarrow$ `Penjahitan` $\rightarrow$ `Finishing` $\rightarrow$ `QC` $\rightarrow$ `Selesai` $\rightarrow$ `Diambil`):
     - `.step-item.is-done`: Lingkaran ikon centang solid `var(--s-done)` dengan teks putih `#fff` dan garis penghubung hijau.
     - `.step-item.is-active`: Lingkaran/kartu tersorot beraksen `var(--clay)` (atau warna tahap aktif), ring halus `var(--clay-100)`, badge **`Sedang Dikerjakan`** 1 baris, dan keterangan progres singkat yang mudah dipahami pelanggan.
     - `.step-item.is-pending`: Lingkaran & garis redup `var(--sand)` / `var(--ink-45)`.
   - `.wa-help-card`: Kartu gelap/kontras atau beraksen lembut berisi tombol **"Hubungi WhatsApp Penjahit"** dengan teks ringkas agar 1 baris di `360px`.
5. **Kartu Riwayat Akun Customer (`customer-account.html`)**:
   - `.cust-banner`: Kartu sapaan pelanggan yang login (nama, no. HP/email, tombol **Keluar** & tombol **Lacak Kode Lain**).
   - `.cust-kpis`: Ringkasan 3 angka (*Total Pesanan*, *Sedang Diproses*, *Siap Diambil / Selesai*).
   - `.cust-order-card`: Kartu per pesanan dengan kode order, nama pakaian, tanggal masuk & estimasi selesai, `.chip` tahap & `.chip` bayar (1 baris), mini progress bar 7 tahap, dan tombol **"Lihat Progres Detail"** $\rightarrow$ `track-result.html?code=...`.

### 2. Skrip Data & Helper `assets/js/portal.js`
1. **Konstanta Tenant & 7 Tahap Produksi**:
   - Informasi tenant **Jahit Lestari** (alamat workshop Surabaya, jam buka `Senin–Sabtu · 08.00–17.00 WIB`, nomor WA CS simulasi `6281234567890`).
   - Array `STAGES` 7 tahap (`Antrean`, `Pemotongan`, `Penjahitan`, `Finishing`, `QC`, `Selesai`, `Diambil`) lengkap dengan penjelasan ramah pelanggan awam per tahap (misal tahap 3: *"Busana sedang dalam proses penjahitan oleh penjahit kami"*).
2. **Dataset Konsisten dengan Bagian A & B (`TH-2030` s/d `TH-2045` + `TH-2026`)**:
   - Memuat seluruh 12+ pesanan dari `app/production/detail.html` (`TH-2045`, `TH-2044`, `TH-2037`, `TH-2043`, `TH-2041`, `TH-2038`, `TH-2035`, `TH-2033`, `TH-2040`, `TH-2042`, `TH-2030`, `TH-2026`) termasuk `customer`, `title`, `qty`, `step`, `stageLabel`, `stageClass`, `estimateLabel`, `deadlineClass`, `payLabel`, `payClass`, `lastUpdate`, dan `customerNote` (catatan aman untuk publik).
   - Sediakan juga fungsi `findOrder(code)` yang melakukan normalisasi `trim().toUpperCase()` agar input huruf kecil (`th-2041`) tetap ditemukan.
3. **Helper Sesi Simulasi Customer (`localStorage` / `sessionStorage`)**:
   - Helper ringan untuk menyimpan akun pelanggan demo yang sedang masuk (default demo: `Citra Dewi` / `Hendra W.` / `Budi Santoso`, atau akun baru dari `customer-register.html`) sehingga alur `customer-login.html` $\rightarrow$ `customer-account.html` dan `customer-register.html` $\rightarrow$ `customer-account.html` terasa nyata tanpa backend.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `assets/css/portal.css` dan `assets/js/portal.js` terbuat.
- [x] Tidak ada warna hex mentah di luar `var(--...)` (kecuali `#fff` di atas elemen solid atau `rgba(...)` standar).
- [x] Tidak ada modifikasi pada `tokens.css`, `base.css`, `components.css`, `app.css`, atau `icons.svg`.
- [x] Dataset `portal.js` 100% selaras dengan kode pesanan di `app/production/detail.html` (`TH-2041`, `TH-2035`, `TH-2045`, dll.).
- [x] Lolos pemindaian `aikido_full_scan` (0 issues SAST/Secrets).

---

## 📦 Saran Micro-Commit
```bash
git add assets/css/portal.css assets/js/portal.js
git commit -m "feat(portal): tambah stylesheet terisolasi dan dataset bersama portal customer"
```
