# Task 04 — Dev 4: Integrasi Manajemen Pesanan & Direktori Pelanggan

**PIC:** Dev 4 (Putri / Zelvia)  
**Dependensi:** Task 01 selesai  
**Target File:**
- `[MODIFY]` `app/orders/index.html`, `app/orders/create.html`, `app/orders/edit.html`, `app/orders/detail.html`, `app/orders/search.html`, `app/orders/print.html`, `app/orders/delete-modal.html`, `app/orders/bulk-update.html`
- `[MODIFY]` `app/customers/index.html`, `app/customers/detail.html`, `app/customers/form.html`

> **Catatan Backend:** Endpoint CRUD untuk `/api/orders*` (`functions/api/orders/index.js`, `[id].js`) dan `/api/customers*` (`functions/api/customers/index.js`, `[id].js`) sudah lengkap di repo.

---

## 🔌 Penggunaan Plugin Cloudflare pada Task Ini
- Baca skill **`workers-development`** jika perlu memantau log `wrangler pages dev` saat menguji request `POST`/`PUT`/`DELETE` atau memeriksa error D1 constraint.
- Gunakan `npm run db:console "SELECT * FROM orders"` untuk memverifikasi data hasil CRUD dari form UI.

---

## 🎯 Tujuan Task
Menghubungkan seluruh alur CRUD pesanan dan pelanggan (daftar, pencarian, buat baru, edit, detail, cetak nota, dan hapus) ke API D1 nyata.

---

## 🛠️ Langkah Eksekusi

1. **Integrasi Modul Pesanan (`app/orders/*`):**
   - Pastikan seluruh halaman memakai `<script src="/assets/js/api.js"></script>` dengan path absolut.
   - `index.html` & `search.html`: Ambil daftar pesanan dari `GET /api/orders?status=&payment=&q=&limit=&offset=`, hubungkan filter/search bar dan pagination.
   - `create.html`: Submit form ke `POST /api/orders` (`{ customer_id|customer_name, customer_phone, type, qty, price, deadline, detail, notes }`), lalu redirect ke `/app/orders/detail.html?id=<id>`.
   - `detail.html` & `print.html`: Baca `?id=` dari `URLSearchParams`, ambil `GET /api/orders/:id` (`d.order`, `d.history`, `d.payments`, `d.paid`, `d.sisa`) untuk mengisi rincian pesanan, riwayat produksi, status bayar, dan nota cetak.
   - `edit.html`: Muat data awal via `GET /api/orders/:id`, simpan perubahan via `PUT /api/orders/:id`.
   - `delete-modal.html` / tombol hapus: Panggil `TH.del("/api/orders/" + id)` dengan konfirmasi pengguna.
   - `bulk-update.html`: Lakukan iterasi `PUT /api/orders/:id` (atau sesuaikan kebutuhan batch) untuk memperbarui beberapa pesanan sekaligus.
2. **Integrasi Modul Pelanggan (`app/customers/*`):**
   - `index.html`: Ambil daftar pelanggan (+ jumlah pesanan) dari `GET /api/customers?q=`.
   - `form.html`: Jika ada `?id=`, muat `GET /api/customers/:id` dan simpan lewat `PUT /api/customers/:id`; jika buat baru, kirim `POST /api/customers`.
   - `detail.html`: Tampilkan profil pelanggan dan riwayat pesanannya dari `GET /api/customers/:id`, serta dukung tombol hapus (`DELETE /api/customers/:id`).
3. **Uji & Scan Keamanan:**
   - Uji skenario End-to-End: buat customer baru → buat order baru → edit order → lihat detail/print → hapus order uji.
   - Pastikan seluruh input teks yang di-render ke HTML dibungkus `TH.esc()`.
   - Jalankan `aikido_full_scan` pada semua file yang diubah.

---

## ✅ Kriteria Selesai (Definition of Done)
- [ ] Seluruh halaman `app/orders/*` dan `app/customers/*` membaca dan menulis data langsung ke D1 lewat `/assets/js/api.js`.
- [ ] Membuat order baru otomatis memunculkan kode pesanan unik (`TH-xxxx`), riwayat awal `"Antrean"`, dan notifikasi.
- [ ] Semua path aset & endpoint memakai path absolut (`/assets/...`, `/api/...`).
- [ ] Lolos `aikido_full_scan` tanpa temuan keamanan.
