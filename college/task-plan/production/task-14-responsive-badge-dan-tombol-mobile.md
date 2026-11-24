# Task 14 — Perbaikan Teks Badge & Tombol 1 Baris di 360px (`update-status.html`, `detail.html`)

**Fase:** 1C — Perbaikan Responsivitas Mobile 360px (`app/production/*`)  
**Referensi Audit:** [`insight-audit-responsivitas-360px.md`](insight-audit-responsivitas-360px.md) (Temuan 3 & Temuan 5)  
**Dependensi:** Task 13  
**Target File:**
- `[MODIFY]` `app/production/update-status.html`
- `[MODIFY]` `app/production/detail.html`

---

## 🎯 Tujuan Task
Memastikan teks pada badge `.quick-chip` (`update-status.html`) dan tombol `#btnSendWa` (`detail.html`) tetap ringkas **1 baris** pada viewport `360px`, serta merapikan susunan baris chip transisi tahap pada `update-status.html`.

---

## 🛠️ Spesifikasi Teknis
1. **`app/production/update-status.html`**:
   - Ringkas teks tampilan `.quick-chip` pertama dari `"Selesai dijahit, lanjut setrika & kancing"` menjadi `"Selesai dijahit, lanjut setrika"` (atribut `data-note` tetap mempertahankan kalimat lengkap `"Selesai dijahit, lanjut setrika & pasang kancing."`).
   - Pastikan pembungkus chip transisi tahap (`#fromStageChip` $\rightarrow$ `#toStageChip`) memiliki `flex-wrap: nowrap` atau jarak rapat yang rapi agar tidak memisahkan panah `→` dari chip kedua secara janggal di lebar `360px`.
2. **`app/production/detail.html`**:
   - Ringkas teks tombol `#btnSendWa` di dalam kartu `Portal Tracking Publik` dari `"Kirim Update WA ke Customer"` menjadi `"Kirim Update WA"` agar muat **1 baris** (`38px` tinggi) pada viewport `360px`.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] Seluruh `.quick-chip` di `update-status.html` tampil 1 baris pada lebar `360px`.
- [x] Tombol `#btnSendWa` di `detail.html` tampil 1 baris pada lebar `360px`.
- [x] Lolos pemindaian `aikido_scan_paths`.

---

## 📦 Saran Micro-Commit
```bash
git add app/production/update-status.html app/production/detail.html
git commit -m "fix(production): pastikan quick-chip dan tombol aksi portal tetap satu baris di 360px"
```
