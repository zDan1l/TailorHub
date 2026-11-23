# Task 11 — Polish List View (`list.html`): Selaraskan Angka Pantau Deadline & 12 Item

**Fase:** 1B — Polish Modul Produksi (`app/production/*`)  
**Target File:**
- `[MODIFY]` `app/production/list.html`

---

## 🎯 Validasi & Tujuan Task
1. **Selaraskan Angka Pantau Deadline**: Pada `board.html` dan topbar tertulis `Pantau Deadline (2)` / `Alert Deadline 2`, sedangkan di `list.html` tombol header hanya bertulis `Pantau Deadline` tanpa angka `(2)`. Diselaraskan menjadi `Pantau Deadline (2)`.
2. **Lengkapi Item Menjadi 12 Pesanan**: Menyelaraskan daftar tabel di `list.html` agar memuat **12 item** yang sama dengan `board.html` (menambahkan `TH-2043`, `TH-2042`, dan `TH-2026`).

---

## 🛠️ Spesifikasi Teknis
1. Ubah tombol header di `app/production/list.html` dari `Pantau Deadline` menjadi `Pantau Deadline (2)`.
2. Tambahkan 3 baris baru (`TH-2043`, `TH-2042`, `TH-2026`) ke `<tbody>` tabel `#prodTable` sehingga total baris menjadi 12 (selaras 1:1 dengan 12 kartu di `board.html`).
3. Terapkan pagination **maksimal 10 item per halaman** pada `#prodTable` (`Page 1`: item 1–10, `Page 2`: item 11–12), lengkap dengan kontrol `.pager` (`‹ 1 2 ›`) dan pembaruan teks `#tableInfo` yang sinkron dengan filter.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] Tombol header menampilkan `Pantau Deadline (2)` selaras dengan `board.html` dan badge topbar.
- [x] Tabel memuat 12 item yang identik dengan `board.html`.
- [x] Pagination membatasi tampilan maksimal 10 item/halaman dan bekerja dengan filter tabel.
- [x] Lolos pemindaian `aikido_scan_paths`.

---

## 📦 Saran Micro-Commit
```bash
git add app/production/list.html
git commit -m "fix(production): selaraskan angka pantau deadline dan lengkapi 12 item di list view"
```
