# FAQ & Klarifikasi Desain — Modul Produksi (`app/production/*`)

Dokumen ini mencatat pertanyaan-pertanyaan teknis dan arsitektural koordinator selama pengerjaan modul `app/production/*` beserta jawabannya berdasarkan **PRD**, **`list-page.md`**, dan **codebase TailorHub**.

---

## Q1. Kenapa ada filter staf pada Papan Kanban (`board.html`)?
**Jawaban:**
1. **Mandat Spesifikasi (`list-page.md` §5.1)**: Halaman `board.html` secara eksplisit mensyaratkan *"Kanban 7 tahap ... indikator deadline, **filter per staff**"*.
2. **Kontrol Beban Kerja (*Workload Balancing*)**: Pemilik/Admin dapat melihat distribusi tugas tiap penjahit (misal **Andi S.** vs **Rina N.**) untuk mencegah penumpukan di satu orang dan melacak penanggung jawab saat ada pesanan yang mendekati atau melewati deadline.
3. **Alokasi Pesanan Baru & Fokus Staf**: Opsi **"Belum Ditugaskan"** memudahkan Admin menyaring pesanan baru di *Antrean* agar segera di-assign, sedangkan Staf dapat memfilter papan agar hanya menampilkan pekerjaan miliknya sendiri.

---

## Q2. Apa yang terjadi jika status dipindah melalui Kanban dengan Drag & Drop? Apakah ada catatan progres / notifikasi WA ke customer?
**Jawaban:**
- **Di prototipe statis saat ini (`assets/js/kanban.js`):** Drag & drop memindahkan kartu ke kolom baru, memperbarui progress bar `x/7`, menghitung ulang `.kcount`, dan menampilkan **Toast konfirmasi** internal. Belum ada modal catatan atau panggilan API WA.
- **Di alur sistem nyata (FR-12, FR-13, FR-30):** Setiap perpindahan tahap tetap mencatat **timestamp otomatis** dan memicu **notifikasi template default** ke customer (sesuai kanal yang diaktifkan Pemilik di `app/settings/notifications.html`). Jika staf ingin menyisipkan catatan khusus saat memindahkan status, alurnya diarahkan lewat `update-status.html` (atau modal konfirmasi saat drop).

---

## Q3. Pada `production/detail.html`, siapa yang menentukan estimasi per tahap (misal *"Estimasi: 23 Nov 2026 · Pasang kancing..."*) dan di mana manajemennya?
**Jawaban:**
- **Tanggal deadline utama:** Ditentukan oleh **Pemilik/Admin** saat input pesanan di `app/orders/create.html` (Dev 4, FR-06).
- **Nama tahap, urutan, & estimasi standar:** Dikelola Pemilik di **`app/settings/order-preferences.html`** (Dev 6, `list-page.md` §6.12: *"penyesuaian nama/urutan tahap produksi"*). Pada implementasi backend nantinya, sistem membagi rentang waktu *tanggal masuk $\rightarrow$ deadline* ke tiap tahap secara otomatis sebagai estimasi awal.
- *(Pada prototipe `detail.html` saat ini, teks estimasi tahap 4–7 merupakan data contoh statis untuk memvisualisasikan tampilan timeline).*

---

## Q4. Pada `production/detail.html`, ada tombol `"Kirim Update WA ke Customer"` — informasi apa yang dikirim?
**Jawaban:**
Pada prototipe `detail.html` saat ini tombol tersebut masih berupa simulasi toast, sedangkan isi pesan sebenarnya (sesuai **FR-30** dan pratinjau di `update-status.html`) mencakup 5 informasi:
1. Nama customer & nama usaha tenant (`Jahit Lestari`).
2. Kode unik pesanan & ringkasan item (`TH-2041 — Kemeja Formal ×3`).
3. Tahap produksi terbaru & progresnya (`Penjahitan 3/7`).
4. Catatan progres terakhir (bila diisi staf).
5. Tautan langsung ke **Portal Tracking** (`portal/track-result.html?code=TH-2041`).

*(Template pesan & integrasi provider Fonnte/Wablas dikelola di `app/settings/notifications.html` oleh Dev 6).*

---

## Q5. Dari mana sumber inkonsistensi kode pesanan antara `ORD-2026-XXXX` di halaman pesanan dan `TH-XXXX`? Atau memang berbeda?
**Jawaban:**
Keduanya adalah **entitas yang sama** (kode unik pesanan, FR-10), bukan dua jenis kode berbeda. Perbedaan tersebut muncul karena variasi data contoh antar pengembang:
- `TH-2041`, `TH-2045`, dll. berasal dari **`style-guide.html`** dan **`app/dashboard.html`** (dibuat lebih dulu).
- `ORD-2026-0089` berasal dari **`app/orders/*`** (dibuat Dev 4 di PR #2).

Di sistem nyata nanti, **format kode pesanan hanya ada satu per tenant** dan dapat dikustomisasi Pemilik melalui **`app/settings/order-preferences.html`** (Dev 6). Di modul produksi Dev 5 dipakai format `TH-XXXX` agar konsisten dengan `app/dashboard.html` dan `style-guide.html`.
