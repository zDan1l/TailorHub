# Insight Teknis: Identifikasi Kerusakan CSS pada Branch `dev5/app-style-fix`

**Tanggal Analisis:** 23 November 2026  
**Branch Aktif:** `dev5/app-style-fix` (berbasis `alan` / `main` terbaru)  
**Branch Pembanding:** `dev5/chore/style-select`, `dev5/orders-production`, `dev5/app-staff`

---

## 📌 Ringkasan Eksekutif (Root Cause)

CSS pada branch `dev5/app-style-fix` rusak bukan karena konflik pada stylesheet modul (`app.css`, `production.css`, `staff.css`, `portal.css`), melainkan karena **tertimpanya fondasi CSS bersama (`assets/css/components.css` dan `assets/css/base.css`) oleh commit `346b849` (`tambah halaman situs publik, marketing & sistem (Dev 1)`)**.

Pada commit `346b849`, file `assets/css/components.css` yang sebelumnya berisi **1.272 baris** komponen aplikasi bersama (*App Components*, Dashboard, Tabel, Modal, Tabs, Kanban, KPI, `base-select`, dll.) **ditimpa seluruhnya menjadi 263 baris** yang hanya berisi komponen untuk halaman publik/marketing (`.site-header`, `.site-footer`, `.price-grid`, `.faq`, `.cta-box`, dll.).

Akibatnya, seluruh halaman internal aplikasi (`/app/*`) kehilangan styling komponen intinya, meskipun fitur HTML/JS pada branch ini adalah yang paling lengkap dan terbaru.

---

## 🔍 Perbandingan Antar-Branch

| Aspek / File | `dev5/chore/style-select` | `dev5/orders-production` | `dev5/app-staff` | `dev5/app-style-fix` (Saat Ini) |
|---|---|---|---|---|
| **`tokens.css`** | Utuh (format standar) | Utuh (identik) | Utuh (identik) | Di-minify/reformat di `346b849` (nilai token warna/radius/shadow tetap sama) |
| **`base.css`** | Utuh (66 baris non-kosong, reset dasar + `input, select, textarea` inherit font) | Utuh (identik) | Utuh (identik) | **Tertimpa** di `346b849`: ukuran `body` & `h1`/`h2` membesar untuk landing page, `overflow-x: hidden` di `html`/`body`, `input/select/textarea` kehilangan `font-family: inherit`, dan class publik (`.wrap`, `.section`, `.eyebrow`, `.lead`) masuk ke `base.css` |
| **`components.css`** | Utuh + animasi `base-select` (`::picker(select)`) | Utuh + tambahan style dari merge App Shell & Orders | Utuh (sama dengan `orders-production`) | **RUSAK / TERTIMPA** di `346b849`: turun drastis dari **1.272 baris menjadi 263 baris** (`-1.461` baris terhapus) |
| **`app.css`** | Utuh (sama) | Utuh (sama) | Utuh (sama) | Utuh (tidak berubah antar keempat branch) |
| **`production.css`** | Versi awal Kanban | +118/-12 baris (perbaikan responsif `360px`) | Sama dengan `orders-production` | Sama dengan `orders-production` & `app-staff` |
| **`staff.css`** | Belum ada | Belum ada | Ada (utuh) | Ada (identik dengan `app-staff`) |
| **`portal.css`** | Belum ada | Belum ada | Belum ada | Ada (utuh, 1.187 baris) |

---

## 🧩 Detail Perubahan yang Menyebabkan CSS Rusak (`346b849`)

### 1. Hilangnya Komponen Inti Aplikasi di `assets/css/components.css`
Commit `346b849` menghapus blok-blok CSS penting berikut dari `components.css`:
- **Tabel & Wrapper (`/* ----- Tabel ----- */`, `/* ----- Table card wrapper ----- */`)**: `.table-wrap`, `.table`, styling `th`/`td`, hover row — menyebabkan seluruh tabel di `/app/orders/`, `/app/production/list.html`, `/app/customers/`, `/app/payments/`, `/app/team/`, dan `/app/reports/` berantakan.
- **Modal (`/* ----- Modal ----- */`)**: `.modal-backdrop`, `.modal`, `.modal-head`, `.modal-body`, `.modal-foot` — menyebabkan modal tidak ter-overlay dengan benar.
- **Kartu & KPI Dashboard (`/* ----- Kartu (Card) & KPI Tile ----- */`, `/* ----- KPI Grid ----- */`, `/* ----- Panel Grid ----- */`, `/* ----- Bar chart SVG ----- */`)**: `.card-head`, `.card-title`, `.kpi-tile`, `.kpi`, dan layout grid dashboard hilang; `.card` berubah menjadi padding `26px` dan radius besar `--r-l` (`26px`) ala kartu marketing.
- **Navigasi Dalam Halaman (`/* ----- Tabs, Crumb & Pagination ----- */`)**: `.tabs`, `.tab`, `.crumb`, `.pagination` hilang.
- **Komponen UI Lain**:
  - `/* ----- Avatar ----- */` (`.avatar`)
  - `/* ----- Progress bar ----- */` (`.progress`)
  - `/* ----- Toast (posisi fixed) ----- */` (`.toast`)
  - `/* ----- Empty state ----- */` (diganti dengan `.empty` versi halaman 404/maintenance)
  - `/* ----- Deadline / Alert-item list ----- */` & `/* ----- Alert dismiss button ----- */`
  - `/* ----- Kanban Board ----- */` & `/* ----- Kartu Kanban ----- */` (fallback dasar di `components.css`)
  - Variasi chip/badge seperti `.chip--info`, `.chip--warn`, `.chip--success` serta `.upload-box`, `.toggle`, `.input-group .toggle-pass`.
- **Animasi `<select>` (`base-select`)**: Rule `appearance: base-select` dan transisi `::picker(select)` dari branch `dev5/chore/style-select` ikut terhapus.
- **Perubahan Dimensi `.btn`**: Padding `.btn` berubah menjadi besar ala CTA marketing (`15px 28px`, `.btn--sm` `10px 18px`), sehingga tombol-tombol di dalam aplikasi tampak kebesaran.

### 2. Efek Samping di `assets/css/base.css`
- **`overflow-x: hidden` pada `html` dan `body`**: Dapat mematahkan `position: sticky` pada sidebar/header App Shell atau header kolom/tabel di beberapa halaman aplikasi.
- **Skala Tipografi Marketing**: `body` naik dari `16px` ke `16.5px`, `h1` dari `clamp(2rem, 3.6vw, 2.9rem)` ke `clamp(2.3rem, 4.3vw, 3.4rem)`, dan `h2` ke `clamp(1.85rem, 3.3vw, 2.6rem)`, membuat judul di dalam dashboard/aplikasi terasa terlalu besar.
- **`input, select, textarea` kehilangan `font-family: inherit`**: Di `base.css` baru, hanya `button` yang diberi `font-family: inherit;`.

---

## 🛠️ Rekomendasi Perbaikan pada `dev5/app-style-fix`

1. **Pisahkan CSS Publik vs CSS Aplikasi (Separation of Concerns)**  
   - Kembalikan `assets/css/base.css` dan `assets/css/components.css` ke versi sebelum commit `346b849` (`git checkout 346b849^ -- assets/css/base.css assets/css/components.css`).
   - Pindahkan styling khusus halaman publik/marketing dari commit `346b849` (`.site-header`, `.site-footer`, `.faq`, `.price-grid`, `.page-hero`, `.prose`, `.cta-box`, `.bill-toggle`, dll.) ke file terpisah, misalnya **`assets/css/public.css`**, lalu muat file tersebut hanya pada halaman publik (`index.html`, `pricing.html`, `features.html`, `about.html`, `contact.html`, `help-center.html`, `terms.html`, `privacy.html`, `404.html`, `maintenance.html`).
2. **Pertahankan Fitur & Perbaikan Terbaru**  
   - Jangan me-revert file halaman HTML/JS hasil merge PR #10–#15 maupun commit `346b849` halaman publik; cukup pisahkan CSS-nya agar halaman `/app/*` dan halaman publik sama-sama tampil rapi tanpa saling menimpa.
3. **Verifikasi Lintas Modul**  
   - Setelah pemisahan CSS, lakukan pengecekan visual pada:
     - `/app/dashboard.html`, `/app/orders/`, `/app/production/board.html` & `list.html`
     - `/app/staff/`, `/app/payments/`, `/app/settings/`, `/app/team/`
     - Halaman publik (`index.html`, `pricing.html`, `features.html`, dll.)
     - Portal pelanggan (`portal/track.html`, `portal/track-result.html`)
