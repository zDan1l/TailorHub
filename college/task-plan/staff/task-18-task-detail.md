# Task 18 — Halaman Detail Instruksi Tugas Staf (`app/staff/task-detail.html`)

**Fase:** 2 — Modul Kerja Staf (`app/staff/*`)  
**Prioritas PRD:** [M] Must (FR-12, FR-13 · Role: S)  
**Dependensi:** Task 16, Task 17  
**Target File:**
- `[NEW]` `app/staff/task-detail.html`

---

## 🎯 Tujuan Task
Membangun halaman **Detail Instruksi Tugas** (`app/staff/task-detail.html`) agar penjahit/pemotong di meja kerja dapat melihat rincian potongan pola, foto/ilustrasi model pakaian, spesifikasi ukuran kustom, catatan desainer, serta menekan tombol besar **"Tandai Selesai Tahap Ini"** langsung dari smartphone.

---

## 🛠️ Spesifikasi Teknis
1. **Head & Impor CSS**:
   - Impor berurutan: `tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css` $\rightarrow$ `app.css` $\rightarrow$ `staff.css`.
   - Sertakan SVG Sprite inline lengkap dan App Shell yang selaras dengan `app/staff/my-tasks.html`.
2. **Dukungan Query Parameter (`?code=...&staff=...`)**:
   - Baca parameter `?code=` (default `TH-2041`) dan `?staff=` dari URL agar ketika dibuka dari kartu `my-tasks.html` atau `../production/board.html`, seluruh isi halaman (judul, chip tahap, foto model, ukuran kustom, kain/benang, dan catatan desainer) menyesuaikan pesanan tersebut secara dinamis.
   - Siapkan dataset lengkap untuk seluruh item tugas staf (`TH-2041`, `TH-2037`, `TH-2040`, `TH-2038`, `TH-2043`, `TH-2035`, `TH-2033`, `TH-2042`, `TH-2030`, `TH-2026`).
3. **Header Halaman**:
   - Breadcrumb: `TailorHub / Tugas Saya / TH-2041`.
   - Judul item (`TH-2041 — Kemeja Formal ×3`), chip tahap solid (`.chip--sew`: `Penjahitan (3/7)`), dan chip deadline (`.chip--clay` / `.chip--danger`).
   - Tombol kembali ke `my-tasks.html` dan tautan sekunder ke timeline lengkap `../production/detail.html?code=...`.
4. **Konten Instruksi Teknis (`.task-detail-grid`)**:
   - **Kartu Foto / Acuan Model Pakaian (`.model-ref`)**:
     - Tampilan visual referensi model pakaian (ilustrasi SVG rapi/berkualitas tinggi sesuai kategori busana: *Kemeja, Jas/Blazer, Gamis/Kebaya*) dengan keterangan poin visual utama (*model kerah, posisi saku, jenis kancing, belahan*).
   - **Kartu Rincian Potongan Pola & Spesifikasi Kain**:
     - Jenis kain, warna/motif, jumlah potong (`qty`), model potongan (`cut`), jenis furing, dan kode/warna benang jahit.
   - **Kartu Spesifikasi Ukuran Kustom (`.measure-grid`)**:
     - Grid terstruktur angka ukuran tubuh/pola (mis. `Lingkar Dada: 100 cm`, `Panjang Lengan: 60 cm`, `Lebar Bahu: 44 cm`, `Lingkar Kerah: 40 cm`, `Panjang Baju: 74 cm`, `Varian Size: M (1), L (2)`).
   - **Kartu Catatan Desainer & Checklist Meja Kerja (`.designer-note`)**:
     - Sorotan catatan khusus dari desainer/owner (mis. *"Kerah shanghai kaku pakai kain keras M33, jahit tindas tepi 2mm, cek kesesuaian kancing manset"*).
     - Checklist langkah kerja ringan yang bisa dicentang staf sebelum menyelesaikan tahap (interaktif di klien).
5. **Panel Aksi Penyelesaian Tahap (`.staff-action-bar`)**:
   - Pilihan catatan pengerjaan cepat (chip 1 baris, mis. *"Jahitan badan selesai"*, *"Pola siap lanjut jahit"*, *"Lolos cek jahitan"*).
   - Input `<textarea>` catatan progres opsional untuk tahap berikutnya/admin.
   - Tombol aksi besar (`min-height: 48px`):
     - **"Mulai Kerjakan"** (jika status tugas masih menunggu dimulai).
     - **"Tandai Selesai Tahap Ini"** (mengubah status tahap ke selesai/tahap berikutnya, menampilkan banner konfirmasi + timestamp WIB otomatis + Toast simulasi notifikasi ke admin/customer, serta menyediakan tombol kembali ke `my-tasks.html`).

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] File `app/staff/task-detail.html` terbuat dengan App Shell lengkap.
- [x] Parameter `?code=...` mengubah seluruh rincian model, potongan pola, ukuran kustom, dan catatan desainer secara dinamis.
- [x] Foto/ilustrasi acuan model pakaian, ukuran kustom, dan catatan desainer tampil jelas di layar `390px`/`360px`.
- [x] Tombol **"Tandai Selesai Tahap Ini"** berfungsi interaktif dengan feedback banner, timestamp, dan Toast.
- [x] Lolos pemindaian `aikido_full_scan` (0 issues SAST/Secrets).

---

## 📦 Saran Micro-Commit
```bash
git add app/staff/task-detail.html
git commit -m "feat(staff): tambah halaman detail instruksi tugas dan aksi selesai tahap"
```
