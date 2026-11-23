# Task 02 — Skrip Interaktif Kanban (`assets/js/kanban.js`)

**Fase:** 1 — Modul Produksi (`app/production/*`)  
**Dependensi:** Task 01  
**Target File:**
- `[NEW]` `assets/js/kanban.js`

---

## 🎯 Tujuan Task
Mengimplementasikan logika interaktif papan Kanban produksi (`board.html`) menggunakan Vanilla JavaScript tanpa dependensi eksternal, sesuai penamaan file pada `structure-folder.md`.

---

## 🛠️ Spesifikasi Teknis
Buat `assets/js/kanban.js` dengan fungsionalitas berikut:

1. **Konfigurasi 7 Tahap Resmi**:
   - Peta urutan tahap sesuai FR-11:
     1. `antrean` $\rightarrow$ Label: `Antrean`, Step: `1/7`, Warna: `var(--s-queue)`
     2. `potong` $\rightarrow$ Label: `Pemotongan`, Step: `2/7`, Warna: `var(--s-cut)`
     3. `jahit` $\rightarrow$ Label: `Penjahitan`, Step: `3/7`, Warna: `var(--s-sew)`
     4. `finishing` $\rightarrow$ Label: `Finishing`, Step: `4/7`, Warna: `var(--s-finish)`
     5. `qc` $\rightarrow$ Label: `QC`, Step: `5/7`, Warna: `var(--s-qc)`
     6. `selesai` $\rightarrow$ Label: `Selesai`, Step: `6/7`, Warna: `var(--s-done)`
     7. `diambil` $\rightarrow$ Label: `Diambil`, Step: `7/7`, Warna: `var(--s-taken)`
2. **HTML5 Drag & Drop Antar Kolom**:
   - Tangani event `dragstart` dan `dragend` pada `.kcard[draggable="true"]`.
   - Tangani `dragover`, `dragleave`, dan `drop` pada `.kcol`.
   - Saat kartu di-drop ke kolom baru, pindahkan elemen DOM kartu ke kolom tujuan.
3. **Sinkronisasi Otomatis Tampilan Kartu & Kolom**:
   - Perbarui `data-stage` kartu.
   - Perbarui segmen aktif `.kc-steps i` (nyalakan `.on` sebanyak indeks tahap `1..7`) dan teks `.kc-stepslabel` (`<Nama Tahap>` + `<x>/7`).
   - Hitung ulang seluruh `.kcount` pada ke-7 kolom (termasuk menangani status kosong / placeholder kolom jika jumlah 0).
4. **Tombol Pindah Tahap Cepat (Mobile / Non-Drag Friendly)**:
   - Fungsi `advanceCardStage(cardEl)` yang dipanggil dari tombol panah/aksi cepat di kartu untuk memajukan kartu 1 tahap ke kolom berikutnya.
5. **Filter Real-Time**:
   - Filter berdasarkan input pencarian (kode pesanan / nama customer / jenis pakaian).
   - Filter berdasarkan staf penanggung jawab (`data-staff`).
   - Filter berdasarkan urgensi deadline (`data-deadline="late|soon|normal"`).
   - Tombol reset filter.
6. **Toast Notifikasi Solid**:
   - Tampilkan toast di sudut kanan bawah (pola sama seperti `app/dashboard.html`) setiap kali kartu berpindah tahap, misal: `"Status diperbarui — TH-2041 dipindah ke tahap Finishing."`.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] File `assets/js/kanban.js` terbuat dengan kode modular, rapi, dan bebas error konsol.
- [x] Mendukung drag-and-drop maupun klik tombol pindah tahap (untuk pengguna touchscreen/mobile).
- [x] Counter kolom dan progress bar `x/7` selalu sinkron saat kartu pindah atau difilter.
- [x] Lolos pemindaian `aikido_full_scan`.

---

## 📦 Saran Micro-Commit
```bash
git add assets/js/kanban.js
git commit -m "feat(production): tambah skrip interaktif drag-and-drop dan filter kanban"
```
