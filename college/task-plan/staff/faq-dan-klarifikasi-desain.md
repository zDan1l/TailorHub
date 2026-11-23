# FAQ & Klarifikasi Desain — Modul Kerja Staf (`app/staff/*`)

Dokumen ini mencatat pertanyaan-pertanyaan teknis dan arsitektural koordinator selama pengerjaan modul `app/staff/*` beserta jawabannya berdasarkan **PRD**, **`list-page.md`**, dan keputusan produk.

---

## Q1. Pada `app/staff/task-detail.html`, dari mana data *"Checklist Meja Kerja"* berasal, di mana manajemennya, dan berasal dari requirement mana?
**Jawaban:**
1. **Asal data di prototipe:** Sebelumnya berupa array `checklist` statis (*hardcoded*) per pesanan di dalam objek `ORDERS`.
2. **Manajemen:** Tidak ada halaman manajemen template checklist di `PRD.md` maupun `list-page.md` (halaman terdekat hanyalah `app/settings/order-preferences.html` milik Dev 6 untuk penyesuaian nama/urutan tahap produksi).
3. **Requirement:** **Tidak berasal dari FR eksplisit di `PRD.md`**, melainkan penambahan UI/UX pendukung untuk `list-page.md` §5.7 (*"Instruksi, detail item, tombol 'tandai selesai tahap ini'"*).

**Keputusan Koordinator:**
- Bagian **"Checklist Meja Kerja"** dihapus dari `app/staff/task-detail.html` (dan styling `.work-checklist` / `.work-check-item` dihapus dari `assets/css/staff.css`) agar halaman tetap ringkas dan 100% berpegang pada requirement resmi PRD (`acuan model`, `ukuran kustom & rincian pola`, `catatan desainer`, serta tombol `Mulai Kerjakan` / `Tandai Selesai Tahap Ini`).
