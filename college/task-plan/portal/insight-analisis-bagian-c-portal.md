# Insight & Analisis Pra-Implementasi — Bagian C: Portal Mandiri Pelanggan (`portal/`)

**Dokumen Acuan:** [`college/catatan-tugas-dev5.md`](../../catatan-tugas-dev5.md) (Bagian C)  
**Target Direktori Implementasi:** `portal/` (6 halaman HTML publik)  
**Prioritas PRD:** `FR-16`, `FR-17`, `FR-18`, `FR-19`, `FR-22`  
**Status Saat Ini:** ⏳ Antrean Kerja (belum diimplementasikan; `portal/` baru berisi `.gitkeep`)

---

## 1. Identifikasi Ruang Lingkup Bagian C

Bagian C adalah wajah publik **TailorHub** yang diakses langsung oleh pelanggan melalui smartphone (via tautan WhatsApp atau scan QR pada nota cetak). Berbeda dari Bagian A (`app/production/`) dan Bagian B (`app/staff/`) yang bersifat internal, seluruh halaman di `portal/` memiliki batasan arsitektur ketat:

1. **DILARANG memakai App Shell**: Tidak boleh ada sidebar `.side`, topbar `.top`, maupun impor `assets/css/app.css`.
2. **Hanya mengimpor 3 stylesheet dasar**: `tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css` (ditambah stylesheet khusus portal seperti `assets/css/portal.css` bila diperlukan agar file CSS bersama tetap terlindungi).
3. **Daftar 6 Halaman Target**:

| No | File Path | Peran & Nilai Utama | Prioritas PRD |
|:---:|---|---|:---:|
| 8 | `portal/landing.html` | Beranda Portal Tenant Publik (branding usaha jahit, jam buka, kontak CS, pintasan lacak pesanan) | **[M] Must** (`FR-16`) |
| 9 | `portal/track.html` | Formulir Lacak Pesanan *Guest* tanpa login (input kode pesanan + contoh kode cepat) | **[M] Must** (`FR-16`, `FR-17`) |
| 10 | `portal/track-result.html` | **Killer Feature** — Hasil pelacakan real-time dengan *visual stepper* 7 tahap, estimasi selesai, status bayar, dan tombol bantuan WA | **[M] Must** (`FR-19`) |
| 11 | `portal/customer-login.html` | Login akun pelanggan (opsional untuk melihat arsip pesanan) | **[C] Could** (`FR-18`) |
| 12 | `portal/customer-register.html` | Pendaftaran akun pelanggan baru (opsional) | **[C] Could** (`FR-18`) |
| 13 | `portal/customer-account.html` | Dashboard riwayat seluruh pesanan milik pelanggan | **[C] Could** (`FR-18`, `FR-22`) |

---

## 2. Temuan Kritis & Gap Sinkronisasi dengan Codebase Saat Ini

Berdasarkan penelaahan terhadap `app/production/*`, `assets/js/kanban.js`, `assets/css/components.css`, `auth/login.html`, dan `college/task-plan/README.md`, terdapat **4 insight penting** yang harus diselesaikan sebelum mulai menulis HTML:

### Insight 1: Inkonsistensi Dataset antara Catatan Tugas vs Implementasi Produksi (`app/production/*`)
- **Temuan:**
  - `college/catatan-tugas-dev5.md` masih mencontohkan nama tenant `Berkah Tailor & Konveksi` dan kode pesanan `TLR-2026-0891` / `TLR-2026-0892`.
  - Namun, seluruh modul yang sudah selesai di Bagian A & B (`app/production/board.html`, `list.html`, `detail.html`, `update-status.html`, `assets/js/kanban.js`, serta `college/task-plan/README.md`) menggunakan tenant **Jahit Lestari** (pemilik **Pak Mardi**) dengan kode pesanan **`TH-2030` s/d `TH-2045`**.
  - Lebih penting lagi, `app/production/detail.html` (baris 351–353 & 545) **sudah menautkan langsung** ke:
    - `../../portal/track-result.html?code=TH-2041`
    - serta menyusun pratinjau pesan WhatsApp ke `https://tailorhub.id/portal/track-result.html?code=TH-2041`.
- **Keputusan Desain yang Disarankan:**
  - Gunakan **Jahit Lestari** dan dataset **`TH-2030` s/d `TH-2045`** sebagai sumber kebenaran tunggal di `portal/` agar integrasi klik dari `app/production/detail.html` (`Buka Preview Portal`) langsung menampilkan data yang identik (nama pelanggan, item pakaian, tahap aktif `1/7`–`7/7`, deadline, dan status bayar).
  - Pada `portal/track.html`, sediakan chip/tombol contoh kode cepat (misal `TH-2041`, `TH-2035`, `TH-2045`, `TH-2030`) agar penguji atau dosen dapat mencoba skenario tahap berbeda dalam 1 klik, sekaligus tetap menangani input kode tidak valid dengan *empty/error state* yang ramah.

### Insight 2: Pelajaran dari Audit Mobile `360px` pada Bagian A
- Dari pengalaman audit `insight-audit-responsivitas-360px.md`, layar smartphone sempit (`360 × 800 px`) sangat rentan terhadap:
  1. **Chip/Badge terlipat 2 baris** saat teks terlalu panjang.
  2. **Tombol aksi panjang terpotong/meluber** di dalam kartu.
  3. **Horizontal overflow** akibat padding atau grid yang tidak fleksibel.
- **Keputusan Desain yang Disarankan untuk `portal/`:**
  - Terapkan pendekatan **Mobile-First** dengan kontainer utama terpusat (misal `max-width: 640px` untuk tracking/landing dan `max-width: 440px` untuk form login/register) agar nyaman di `360px`–`430px` sekaligus proporsional di desktop `1280px`.
  - Pastikan semua `.chip` status tahap dan status bayar (`Belum Bayar`, `DP`, `Lunas`) memakai warna solid 100% dari `tokens.css` (`--s-*`, `--pay-*`) dan tetap **1 baris** (`white-space: nowrap`).
  - Pastikan setiap elemen interaktif memiliki *touch target* minimal `44px` dan tidak ada horizontal overflow (`0px` pada `360px`).

### Insight 3: Pemanfaatan Komponen CSS & Ikon yang Sudah Ada
- `assets/css/components.css` sudah menyediakan:
  - `.btn` (`.btn--primary`, `.btn--ghost`, `.btn--light`, `.btn--sm`, `.btn--lg`, `.btn--block`)
  - `.field`, `.input`, `.input-group`, `.toggle-pass`
  - `.chip` lengkap dengan seluruh varian tahap (`.chip--queue` s/d `.chip--taken`) dan pembayaran (`.chip--unpaid`, `.chip--dp`, `.chip--paid`)
  - `.auth-wrap`, `.auth-box`, `.auth-header`, `.auth-card` (yang sudah dipakai di `auth/login.html`).
- `assets/partials/icons.svg` sudah memiliki ikon relevan: `#i-check`, `#i-arrow`, `#i-clock`, `#i-search`, `#i-scissors`, `#i-phone`, `#i-mail`, `#i-key`, `#i-eye`, `#i-eye-off`, `#i-info`, `#i-warn`, `#i-order`.
- **Keputusan Desain yang Disarankan:**
  - Halaman `customer-login.html` dan `customer-register.html` dapat langsung memanfaatkan pola `.auth-wrap` / `.auth-card` dari `components.css` (dengan header branding **Jahit Lestari** dan tautan kembali ke `landing.html` / `track.html`).
  - Komponen spesifik portal — seperti *tenant hero card*, *guest tracking search box*, *vertical 7-stage progress stepper*, dan *customer order history card* — ditempatkan terpisah di `assets/css/portal.css`, sementara data pesanan bersama + logika lookup `?code=` ditempatkan di `assets/js/portal.js`.

### Insight 4: Pemisahan Jelas Alur *Guest* (`[M]`) vs *Customer Account* (`[C]`)
- Menurut `PRD.md` (`FR-17` & `FR-18`), pelacakan pesanan **wajib bebas login** (*frictionless*). Pelanggan yang datang dari QR nota cetak tidak boleh terhalang halaman login.
- **Alur Navigasi yang Disarankan:**
  - `landing.html` menonjolkan CTA utama **"Lacak Pesanan (Tanpa Login)"** $\rightarrow$ `track.html` $\rightarrow$ `track-result.html`, sementara tautan **"Masuk Akun Pelanggan"** ditempatkan sebagai opsi sekunder di header/footer kartu.
  - `track-result.html` menampilkan **7 tahap produksi secara utuh** dengan pembeda visual yang mudah dipahami orang awam:
    - **Selesai:** ikon centang hijau (`--s-done`)
    - **Sedang Dikerjakan:** highlight aktif (`--clay` / warna tahap solid + badge `Sedang Berjalan`)
    - **Tahap Berikutnya:** netral redup (`--sand` / `--ink-45`)
  - `customer-login.html` & `customer-register.html` menyediakan simulasi masuk/daftar menuju `customer-account.html` yang menampilkan daftar pesanan milik satu pelanggan (misal **Ibu Sari** atau **Bapak Hendra** dari dataset `TH-2030`–`TH-2045`), di mana tiap kartu pesanan terhubung langsung ke `track-result.html?code=...`.

---

## 3. Rencana Pemecahan Implementasi (Usulan Fase 3 di `college/task-plan/portal/`)

Agar selaras dengan pola *micro-commit* pada Fase 1 (`production/`) dan Fase 2 (`staff/`), implementasi Bagian C idealnya dipecah menjadi task atomik berikut:

| Urutan | Ruang Lingkup Usulan | File Target | Prioritas |
|:---:|---|---|:---:|
| **1** | Stylesheet & Skrip Data Bersama Portal | `assets/css/portal.css`, `assets/js/portal.js` | Fondasi |
| **2** | Core Guest Tracking (`track.html` + `track-result.html`) | `portal/track.html`, `portal/track-result.html` | **[M] Must** |
| **3** | Beranda Portal Tenant Publik (`landing.html`) + hapus `.gitkeep` | `portal/landing.html` | **[M] Must** |
| **4** | Halaman Akun Pelanggan Opsional (`customer-login`, `customer-register`, `customer-account`) | `portal/customer-*.html` | **[C] Could** |
| **5** | QA Verifikasi Browser (`360px` & `1280px`), Cek Konsistensi Link dari `app/production/detail.html`, Update Tracker | `college/catatan-tugas-dev5.md`, `college/task-plan/README.md` | Verifikasi |

---

## 4. Checklist Kepatuhan Sebelum Eksekusi Kode
- [ ] Tidak ada impor `app.css` atau elemen `.side` / `.top` di seluruh file `portal/*.html`.
- [ ] Tidak ada modifikasi pada file CSS/SVG bersama (`tokens.css`, `base.css`, `components.css`, `app.css`, `icons.svg`).
- [ ] Seluruh kode pesanan contoh selaras dengan `app/production/*` (`Jahit Lestari`, `TH-2030` s/d `TH-2045`), termasuk tautan langsung dari `app/production/detail.html?code=TH-2041` $\rightarrow$ `portal/track-result.html?code=TH-2041`.
- [ ] Seluruh `.chip` status dan tombol CTA tampil **1 baris** dan bebas *horizontal overflow* pada viewport `360 × 800 px`.
