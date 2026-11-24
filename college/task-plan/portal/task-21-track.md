# Task 21 — Halaman Formulir Lacak Pesanan Guest (`portal/track.html`)

**Fase:** 3 — Portal Mandiri Pelanggan (`portal/*`)  
**Prioritas PRD:** [M] Must (`FR-16`, `FR-17`)  
**Dependensi:** Task 20  
**Target File:**
- `[NEW]` `portal/track.html`

---

## 🎯 Tujuan Task
Membangun halaman formulir pelacakan pesanan **tanpa perlu login (Guest Access)** (`portal/track.html`) yang ramah layar smartphone (akses via scan QR nota fisik atau tautan WhatsApp) dan mengarahkan pelanggan ke `portal/track-result.html?code=...`.

---

## 🛠️ Spesifikasi Teknis
1. **Head & Impor CSS (TANPA `app.css`)**:
   - Impor berurutan: `tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css` $\rightarrow$ `portal.css` (path relatif `../assets/css/...`).
   - Dilarang menyertakan `.side`, `.top`, atau elemen App Shell internal.
   - Sertakan SVG Sprite inline untuk ikon yang dibutuhkan (`#i-search`, `#i-arrow`, `#i-info`, `#i-warn`, `#i-order`, `#i-clock`, `#i-phone`, `#i-scissors`).
2. **Header Publik Ringkas (`.portal-header`)**:
   - Logo + nama tenant **Jahit Lestari** yang menaut ke `landing.html`.
   - Tautan sekunder **"Akun Pelanggan"** $\rightarrow$ `customer-login.html`.
3. **Kartu Pencarian Kode Pesanan (`.track-box`)**:
   - Judul jelas: *"Lacak Status Jahitan Anda"* + subjudul *"Tanpa perlu login. Masukkan kode pesanan yang tertera pada nota cetak atau pesan WhatsApp."*
   - Input `<input id="orderCodeInput" class="input" type="text" placeholder="Contoh: TH-2041" required autocomplete="off">` beserta tombol submit **"Cek Status Jahitan"** (`btn btn--primary btn--lg btn--block`).
   - Jika URL membawa parameter `?error=notfound&code=...` (misal dialihkan kembali atau dicek langsung), tampilkan `.track-error` dengan pesan ramah dan saran memeriksa ulang kode pada nota.
   - Saat form disubmit:
     - Validasi klien via `portal.js`: bila kode ada di dataset, langsung navigasi ke `track-result.html?code=<KODE>`; bila tidak ditemukan, tampilkan pesan error inline di halaman yang sama (tidak melempar user ke halaman rusak) dan fokuskan kembali ke input.
4. **Pintasan Kode Contoh Demo (`.sample-chips`)**:
   - Sediakan 4 chip contoh interaktif agar penguji/pengunjung dapat langsung menguji variasi status tanpa mengetik manual:
     - `TH-2041` *(Penjahitan · H-1)*
     - `TH-2035` *(Finishing · Lunas)*
     - `TH-2030` *(Siap Diambil)*
     - `TH-2045` *(Antrean · Belum Bayar)*
   - Klik chip langsung mengisi input atau membuka `track-result.html?code=...`.
5. **Panduan Nota & Kontak Bantuan (`.track-help`)**:
   - Kartu instruksi singkat cara membaca kode pesanan di nota (format `TH-XXXX`) + tautan bantuan ke WhatsApp CS **Jahit Lestari**.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `portal/track.html` terbuat dan tidak mengimpor `app.css` maupun memuat `.side` / `.top`.
- [x] Submit kode valid (huruf besar maupun kecil, misal `th-2041` atau `TH-2041`) mengarahkan ke `track-result.html?code=TH-2041`.
- [x] Submit kode tidak valid menampilkan pesan peringatan inline yang jelas tanpa error console.
- [x] Chip contoh kode dan seluruh tombol tampil rapi tanpa *horizontal overflow* di `360 × 800 px`.
- [x] Lolos pemindaian `aikido_full_scan` (0 issues SAST/Secrets).

---

## 📦 Saran Micro-Commit
```bash
git add portal/track.html
git commit -m "feat(portal): tambah halaman formulir lacak pesanan guest tanpa login"
```
