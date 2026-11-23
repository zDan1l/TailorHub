# Task 09 — Polish CSS: Aksi Kartu Kanban 3-Kolom, Stage Picker Column-Flow & Fix Overflow WA

**Fase:** 1B — Polish Modul Produksi (`app/production/*`)  
**Target File:**
- `[MODIFY]` `assets/css/production.css`

---

## 🎯 Validasi & Tujuan Task
1. **Revisi Tombol Kartu Kanban (`.kc-actions`)**: Mengubah tata letak tombol dari baris datar menjadi **grid 3 kolom** (`auto 1fr auto`) di mana tombol `←` (kiri) dan `→` (kanan) membentang vertikal penuh (`align-items: stretch`), sementara `Detail` (atas) dan `Update` (bawah) ditumpuk secara vertikal di kolom tengah.
2. **Stage Picker Column-Flow (`update-status.html`)**: Mengubah `.stage-picker` agar item mengalir dari kiri-atas ke bawah lalu berlanjut ke kolom kanan (`grid-auto-flow: column; grid-template-rows: repeat(4, auto);`), serta menambahkan gaya `.stage-opt-num` untuk label `x/7` di sebelah kiri judul tahap.
3. **Fix Bug Overflow `.wa-bubble`**: Menambahkan `overflow-wrap: anywhere; word-break: break-word;` pada `.wa-bubble` (serta `min-width: 0` pada `.prod-stack`) agar teks panjang tanpa spasi (seperti URL tracking) tidak keluar dari kotak pratinjau.

---

## 🛠️ Spesifikasi Teknis
1. Pada `.kc-actions`:
   - `display: grid; grid-template-columns: 36px 1fr 36px; gap: 6px; align-items: stretch;`
   - `.kc-actions-mid`: `display: flex; flex-direction: column; gap: 5px;` (berisi tombol `Detail` dan `Update` `width: 100%`).
   - `.kc-btn--prev`, `.kc-btn--next`: `height: 100%; padding: 0; font-size: .95rem;` dan state `:disabled` yang jelas.
2. Pada `.stage-picker`:
   - Desktop/tablet (`> 560px`): `grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(4, auto); grid-auto-flow: column;`
   - Mobile (`<= 560px`): reset `grid-template-rows: none; grid-auto-flow: row; grid-template-columns: 1fr;`.
   - Tambahkan `.stage-opt-num` (`font-size: .75rem; font-weight: 800; color: var(--ink-45); margin-right: 4px;`).
3. Pada `.wa-bubble` & `.wa-preview`:
   - `.wa-preview`: `min-width: 0; overflow: hidden;`
   - `.wa-bubble`: `overflow-wrap: anywhere; word-break: break-word; max-width: 100%;`

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] `.kc-actions` membentuk layout `[←] [Detail/Update] [→]` dengan tombol panah penuh tinggi.
- [x] `.stage-picker` mengalir vertikal per kolom (1–4 kiri, 5–7 kanan).
- [x] URL panjang di `.wa-bubble` terbungkus rapi di dalam kotak.
- [x] Lolos pemindaian `aikido_scan_paths`.

---

## 📦 Saran Micro-Commit
```bash
git add assets/css/production.css
git commit -m "style(production): poles layout aksi kartu kanban, stage picker, dan wrap wa-bubble"
```
