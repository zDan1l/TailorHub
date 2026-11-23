# Task 10 — Polish Kanban JS & Board (`board.html`): Tombol Panah Kiri/Kanan + 12 Item

**Fase:** 1B — Polish Modul Produksi (`app/production/*`)  
**Dependensi:** Task 09  
**Target File:**
- `[MODIFY]` `assets/js/kanban.js`
- `[MODIFY]` `app/production/board.html`

---

## 🎯 Validasi & Tujuan Task
1. **Dukungan Tombol Tahap Sebelum (`←`) & Tahap Berikut (`→`)**: Memungkinkan kartu dimajukan atau dimundurkan 1 tahap secara langsung dari tombol panah kiri/kanan pada kartu.
2. **Penyelarasan Jumlah Item Menjadi 12 Pesanan**: Menambah 2 pesanan baru (`TH-2043` di Pemotongan dan `TH-2042` di QC) sehingga total di Papan Kanban menjadi **12 item** (selaras dengan badge `12` di menu sidebar Pesanan).

---

## 🛠️ Spesifikasi Teknis
1. **`assets/js/kanban.js`**:
   - Tambahkan `stepCardStage(card, delta)` dan `prevCardStage(card)` (untuk `.kc-btn--prev`).
   - Pada `syncCardVisual(card, stageKey)`:
     - Nonaktifkan `.kc-btn--prev` saat `stage.step <= 1` (`antrean`).
     - Nonaktifkan `.kc-btn--next` saat `stage.step >= 7` (`diambil`).
   - Pada `bindCardEvents()`: tangani klik `.kc-btn--prev` dan `.kc-btn--next` via event delegation di `.kanban`.
2. **`app/production/board.html`**:
   - Ubah `.kc-actions` pada seluruh kartu menjadi:
     - Kiri: `<button type="button" class="kc-btn kc-btn--prev" aria-label="Tahap sebelumnya" title="Tahap sebelumnya">←</button>`
     - Tengah (`.kc-actions-mid`): `<a href="detail.html?code=..." class="kc-btn">Detail</a>` + `<a href="update-status.html?code=..." class="kc-btn">Update</a>`
     - Kanan: `<button type="button" class="kc-btn kc-btn--next" aria-label="Tahap berikutnya" title="Tahap berikutnya">→</button>`
   - Tambahkan 2 item baru (total 12 pesanan):
     - `TH-2043` (Kaos Komunitas ×30 · Komunitas Lari Sby) di kolom `potong` (`RN`, `01 Des`, `normal`).
     - `TH-2042` (Blazer Kerja ×2 · Ibu Maya) di kolom `qc` (`MB`, `27 Nov`, `normal`).
   - Perbarui `#visibleCount` default menjadi `Menampilkan 12 pesanan` dan `.kcount` kolom terkait.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] Seluruh 12 kartu memakai struktur tombol `← | Detail/Update | →`.
- [x] Klik `←` memundurkan tahap; klik `→` memajukan tahap; tombol otomatis disabled di ujung tahap.
- [x] Lolos pemindaian `aikido_scan_paths`.

---

## 📦 Saran Micro-Commit
```bash
git add assets/js/kanban.js app/production/board.html
git commit -m "feat(production): tambah navigasi tahap kiri-kanan dan lengkapi 12 item di kanban"
```
