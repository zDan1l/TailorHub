# Task 23 — Halaman Beranda Portal Tenant Publik (`portal/landing.html`)

**Fase:** 3 — Portal Mandiri Pelanggan (`portal/*`)  
**Prioritas PRD:** [M] Must (`FR-16`)  
**Dependensi:** Task 20, Task 21, Task 22  
**Target File:**
- `[NEW]` `portal/landing.html`
- `[DELETE]` `portal/.gitkeep`

---

## 🎯 Tujuan Task
Membangun halaman depan publik milik tenant (**Jahit Lestari**) di `portal/landing.html` sebagai titik masuk utama pelanggan yang memindai QR toko atau membuka tautan bio WhatsApp/Instagram usaha jahit, berisi branding usaha, informasi jam buka & kontak, serta pintasan cepat menuju pelacakan pesanan.

---

## 🛠️ Spesifikasi Teknis
1. **Head & Impor CSS (TANPA `app.css`)**:
   - Impor berurutan: `tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css` $\rightarrow$ `portal.css`.
   - Tanpa sidebar `.side` dan tanpa topbar internal `.top`.
2. **Header Branding Tenant (`.portal-header`)**:
   - Logo ikon jahit + nama tenant **Jahit Lestari**, tagline singkat *"Tailor & Konveksi · Busana Kustom & Seragam"*, serta tombol ringkas **"Masuk Akun"** $\rightarrow$ `customer-login.html`.
3. **Hero Utama & Quick Track Form (`.portal-hero`)**:
   - Badge status operasional 1 baris (`Buka Hari Ini · 08.00–17.00 WIB`).
   - Judul ramah pelanggan: *"Pantau Jahitan Anda Kapan Saja"*.
   - Deskripsi singkat: *"Cek progres pemotongan, penjahitan, hingga siap ambil tanpa perlu antre chat."*
   - Form mini lacak langsung di hero (input kode pesanan + tombol **"Lacak Sekarang"** yang langsung mengarah ke `track-result.html?code=...`) **atau** tombol CTA primer **"Lacak Pesanan Sekarang"** $\rightarrow$ `track.html` beserta pintasan kode contoh `TH-2041`.
4. **Kartu Informasi Workshop & Layanan (`.portal-info-grid`)**:
   - **Jam Operasional**: Senin–Sabtu, `08.00–17.00 WIB` (Minggu libur).
   - **Alamat Workshop**: Jl. Dharmawangsa No. 48, Surabaya.
   - **Layanan Unggulan**: Jas & Blazer Kustom, Kemeja & Batik, Kebaya & Busana Pesta, Seragam Kantor/Komunitas.
   - **Kontak WhatsApp CS**: Tombol langsung menuju WhatsApp (`wa.me/...`) untuk konsultasi ukuran/fitting.
5. **Alur 3 Langkah Pelacakan Mandiri**:
   - Ringkasan visual 3 langkah sederhana (*1. Siapkan kode di nota* $\rightarrow$ *2. Masukkan kode tanpa login* $\rightarrow$ *3. Pantau progres real-time hingga siap ambil*).
6. **Housekeeping**:
   - Hapus `portal/.gitkeep` karena folder `portal/` sudah terisi halaman aktif.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `portal/landing.html` terbuat dan `portal/.gitkeep` dihapus.
- [x] Tidak mengimpor `app.css` dan tidak ada elemen `.side` / `.top`.
- [x] CTA menuju `track.html`, form/pintasan menuju `track-result.html?code=...`, dan tautan menuju `customer-login.html` berfungsi tanpa link mati (`#`).
- [x] Tampilan rapi dan `0px` *horizontal overflow* di `360 × 800 px` maupun `1280 × 800 px`.
- [x] Lolos pemindaian `aikido_full_scan` (0 issues SAST/Secrets).

---

## 📦 Saran Micro-Commit
```bash
git add portal/landing.html portal/.gitkeep
git commit -m "feat(portal): tambah halaman beranda portal tenant publik jahit lestari"
```
