# Task 05 — Dev 5: Integrasi Produksi, Tugas Staf & Portal Pelanggan

**PIC:** Dev 5 (Alan)  
**Dependensi:** Task 01 selesai  
**Target File:**
- `[MODIFY]` `app/production/board.html`, `app/production/list.html`, `app/production/detail.html`, `app/production/update-status.html`, `app/production/deadline-alerts.html`, `assets/js/kanban.js`
- `[MODIFY]` `app/staff/my-tasks.html`, `app/staff/task-detail.html`
- `[MODIFY]` `portal/track.html`, `portal/track-result.html`, `portal/landing.html` *(serta `portal/customer-*.html` bila menggunakan API)*
- `[MODIFY]` `functions/api/orders/index.js` *(opsional: tambah filter `assignee_id` atau `urgent` bila dibutuhkan `app/staff/*` dan `deadline-alerts.html`)*

---

## 🔌 Penggunaan Plugin Cloudflare pada Task Ini
- Baca skill **`workers-development`** dan **`workers-best-practices`** sebelum memodifikasi `functions/api/orders/index.js` atau endpoint publik `functions/api/public/track.js`.
- Gunakan MCP **`cloudflare_cloudflare`** (`docs`) bila perlu memastikan batas query/binding D1 pada endpoint publik tanpa login.

---

## 🎯 Tujuan Task
Menghubungkan papan Kanban 7 tahap produksi, daftar tugas staf penjahit, dan portal pelacakan publik pelanggan ke data D1 secara real-time.

---

## 🛠️ Langkah Eksekusi

1. **Integrasi Produksi (`app/production/*` & `assets/js/kanban.js`):**
   - Muat `<script src="/assets/js/api.js"></script>` di seluruh halaman `app/production/*`.
   - `board.html` & `kanban.js`: Ambil daftar pesanan lewat `GET /api/orders?limit=200` (atau per `?status=` untuk kolom Kanban), kelompokkan ke 7 kolom status (`Antrean` s/d `Diambil`). Saat kartu di-drag/drop atau tombol `←`/`→`/tahap berikut diklik, kirim `PUT /api/orders/:id` dengan `{ production_status, note }`.
   - `list.html` & `deadline-alerts.html`: Ambil data dari `GET /api/orders` dan hitung/filter pesanan yang mendekati atau melewati `deadline`.
   - `detail.html` & `update-status.html`: Baca `?id=` dari URL, ambil `GET /api/orders/:id` (beserta `d.history`), dan simpan perubahan tahap melalui `PUT /api/orders/:id`.
2. **Integrasi Tugas Staf (`app/staff/*`):**
   - Jika perlu filter berdasarkan staf penanggung jawab, tambahkan parameter query opsional `?assignee_id=` di `functions/api/orders/index.js` (tetap pertahankan `WHERE o.tenant_id = ?`).
   - Sambungkan `my-tasks.html` dan `task-detail.html` ke `GET /api/orders` dan `PUT /api/orders/:id` agar tombol "Selesai Tahap" memperbarui status nyata di D1.
3. **Integrasi Portal Publik (`portal/*` — TANPA `TH.requireAuth`):**
   - Pastikan portal **tetap bebas login internal** (jangan panggil `TH.requireAuth` di `portal/track.html`, `portal/track-result.html`, atau `portal/landing.html`).
   - `track.html`: Submit slug usaha + kode pesanan ke `track-result.html?slug=...&code=...`.
   - `track-result.html`: Panggil `TH.get("/api/public/track?slug=" + encodeURIComponent(slug) + "&code=" + encodeURIComponent(code))` untuk menampilkan `d.usaha`, `d.pesanan` (kode, jenis, jumlah, deadline, statusProduksi, statusBayar), dan `d.riwayat` pada stepper 7 tahap.
4. **Uji & Scan Keamanan:**
   - Uji ubah status di `board.html` → refresh halaman untuk pastikan tersimpan di D1 → cek langsung di `portal/track-result.html?slug=jahit-lestari&code=...` apakah stepper ikut berubah.
   - Jalankan `aikido_full_scan` pada semua file JS/HTML/API yang diubah.

---

## ✅ Kriteria Selesai (Definition of Done)
- [ ] Drag-and-drop & tombol pindah tahap di Kanban benar-benar memanggil `PUT /api/orders/:id` dan tersimpan di `orders` + `order_status_history`.
- [ ] Portal `track.html` & `track-result.html` bekerja tanpa login menggunakan `/api/public/track` dan hanya menampilkan info non-sensitif.
- [ ] Tidak ada kebocoran `tenant_id` pada filter tambahan di `/api/orders`.
- [ ] Lolos `aikido_full_scan` tanpa temuan keamanan.
