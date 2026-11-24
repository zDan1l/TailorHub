# Task 13 — Perbaikan CSS Responsivitas 360px (`assets/css/production.css`)

**Fase:** 1C — Perbaikan Responsivitas Mobile 360px (`app/production/*`)  
**Referensi Audit:** [`insight-audit-responsivitas-360px.md`](insight-audit-responsivitas-360px.md) (Temuan 1, 2, 3, 4)  
**Target File:**
- `[MODIFY]` `assets/css/production.css`

---

## 🎯 Tujuan Task
Menghilangkan *horizontal overflow* `57.33px` pada layar `360px`, menyelaraskan padding `.page` dan `.top` dengan referensi `app/dashboard.html`, membuat `.tabs` tetap 1 baris, membungkus `.alert` agar teks tidak tergencet `95px`, dan memastikan `.quick-chip` tidak pernah patah menjadi 2 baris.

---

## 🛠️ Spesifikasi Teknis (`assets/css/production.css`)
1. **Topbar Mobile (`@media (max-width: 680px)`) — Temuan 1**:
   - Sembunyikan `.top-actions .btn` (`display: none;`) karena tautan `Pantau Deadline (2)` sudah tersedia di `.page-head` dan sub-tab navigasi. Ini membebaskan ruang `.search` (~154px) dan menjaga lonceng + avatar `PM` tetap berada di dalam viewport `360px`.
2. **Padding Mobile Selaras `dashboard.html` (`@media (max-width: 560px)`) — Temuan 1**:
   - `.page { padding: 18px 16px; }`
   - `.top { padding: 12px 16px; }`
   - `.search { max-width: none; }`
3. **Sub-Navigasi `.tabs` 1 Baris (`@media (max-width: 560px)`) — Temuan 2**:
   - `.prod-subnav .tabs { overflow-x: auto; flex-wrap: nowrap; width: 100%; }`
   - `.prod-subnav .tabs a { flex: none; white-space: nowrap; padding: 9px 12px; font-size: .83rem; }`
4. **Banner `.alert` Wrap Rapi (`@media (max-width: 560px)`) — Temuan 4**:
   - `.alert { flex-wrap: wrap; align-items: flex-start; }`
   - `.alert > div { min-width: 0; flex: 1 1 200px; }`
   - `.alert .btn { width: 100%; justify-content: center; margin-top: 4px; }`
5. **Badge `.quick-chip` Selalu 1 Baris — Temuan 3**:
   - Pada `.quick-chip`: tambahkan `white-space: nowrap; flex: none;`.
   - Pada `@media (max-width: 560px)`: `.quick-chips { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 4px; }` agar badge tidak pernah terlipat 2 baris.

---

## ✅ Kriteria Selesai (Definition of Done)
- [x] Seluruh aturan responsif di atas ditambahkan ke `assets/css/production.css` tanpa menyentuh `tokens.css` / `components.css` / `app.css`.
- [x] Tidak ada *raw hex* warna baru di luar `var(--...)`.
- [x] Lolos pemindaian `aikido_scan_paths`.

---

## 📦 Saran Micro-Commit
```bash
git add assets/css/production.css
git commit -m "fix(production): perbaiki overflow 360px, padding mobile, alert wrap, dan tabs satu baris"
```
