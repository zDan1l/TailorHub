# Task 12 — Polish Detail & Update Status (`detail.html`, `update-status.html`)

**Fase:** 1B — Polish Modul Produksi (`app/production/*`)  
**Dependensi:** Task 09  
**Target File:**
- `[MODIFY]` `app/production/detail.html`
- `[MODIFY]` `app/production/update-status.html`

---

## 🎯 Validasi & Tujuan Task
1. **Bug Badge `"Sedang Berjalan"` di `detail.html`**: Saat ini `<span class="chip chip--clay">Sedang Berjalan</span>` ditulis statis pada langkah 3, sehingga tetap menempel di langkah 3 walau membuka pesanan pada tahap lain (`?code=TH-2035`, `?code=TH-2045`, dll). Badge harus dipindahkan/dirender secara dinamis ke tahap yang benar-benar sedang aktif (`stepNum === data.step`).
2. **Preview Pesan WA di Kartu Portal Tracking (`detail.html`)**: Karena terdapat tombol `"Kirim Update WA ke Customer"`, kartu tersebut perlu menampilkan pratinjau pesan teks yang akan dikirim agar staf bisa memverifikasi isi pesan sebelum mengirim.
3. **Format Tahap `x/7` & Layout Kolom di `update-status.html`**: Menghapus teks `"Tahap x/7"` di bawah judul dan menggantinya dengan `"x/7"` di sebelah kiri judul tahap (`.stage-opt-num`), serta memastikan struktur `.stage-picker` terurut 1–4 kiri dan 5–7 kanan.
4. **Sinkronisasi 12 Item**: Melengkapi kamus `ORDERS` di `detail.html` dan opsi `#orderSelect` di `update-status.html` agar mencakup 12 item yang sama (`TH-2043`, `TH-2042`, `TH-2026`).

---

## 🛠️ Spesifikasi Teknis
1. **`app/production/detail.html`**:
   - Hapus badge statis `Sedang Berjalan` dari markup langkah 3, lalu sisipkan via JS (`applyOrderFromQuery`) hanya pada `.pt-title` milik langkah dengan `data-step === data.step` (menggunakan `document.createElement('span')` dan `textContent`).
   - Tambahkan blok pratinjau pesan WA (`#detailWaPreview`) di dalam kartu `"Portal Tracking Publik"` di atas tombol `"Kirim Update WA ke Customer"`, diisi dinamis dari data pesanan aktif.
   - Tambahkan `TH-2043` dan `TH-2042` ke objek `ORDERS` (total 12 item).
2. **`app/production/update-status.html`**:
   - Ubah setiap `.stage-opt` di `#stagePicker`: hapus `<small>Tahap x/7</small>`, ganti menjadi `<span class="stage-opt-num">1/7</span>` di sebelah kiri `<b>Antrean</b>`.
   - Tambahkan `TH-2043`, `TH-2042`, dan `TH-2026` ke `#orderSelect` dan objek `ORDERS` (total 12 item).

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] Badge `"Sedang Berjalan"` di `detail.html` selalu tepat berada di tahap aktif sesuai `?code=...`.
- [x] Preview teks pesan WA tampil di kartu Portal Tracking `detail.html`.
- [x] Pilihan tahap di `update-status.html` menampilkan `1/7 Antrean` (tanpa teks `Tahap`) dan mengalir vertikal kiri-ke-kanan.
- [x] Data 12 item lengkap di `detail.html` dan `update-status.html`.
- [x] Lolos pemindaian `aikido_scan_paths`.

---

## 📦 Saran Micro-Commit
```bash
git add app/production/detail.html app/production/update-status.html
git commit -m "fix(production): selaraskan badge aktif, tambah preview WA detail, dan format stage picker"
```
