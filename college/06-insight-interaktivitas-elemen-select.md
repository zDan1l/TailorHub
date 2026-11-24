# 06. Insight Teknis Global: Interaktivitas & Animasi Elemen `<select>`

Dokumen ini membahas secara menyeluruh mengapa elemen HTML `<select>` memiliki batasan animasi secara bawaan, bagaimana implementasinya saat ini di TailorHub, serta tiga pendekatan teknis global (*Native Enhanced*, *Customizable Select API*, dan *Custom ARIA Dropdown*) beserta rekomendasi penerapannya.

---

## 1. Mengapa `<select>` Klasik Sulit Dianimasikan?

Secara historis di seluruh browser web, elemen `<select>` adalah **replaced element** yang daftar pilihannya (*dropdown popup*) dirender langsung oleh **Sistem Operasi (OS)** di luar alur DOM halaman:
1. Properti CSS `appearance: none;` hanya memengaruhi **kotak pemicu (*trigger button*)**, bukan jendela popup `<option>` yang terbuka.
2. Pseudo-state seperti `:hover` atau transisi `opacity`/`transform` tidak dapat diterapkan ke kotak popup bawaan OS.
3. Pada perangkat mobile (Android/iOS), browser sengaja membajak `<select>` menjadi *native bottom sheet* atau *wheel picker* demi kenyamanan jari pengguna.

---

## 2. Audit `<select>` di Codebase TailorHub Saat Ini

Pada repositori TailorHub, gaya global `<select>` didefinisikan di [`assets/css/components.css`](file:///d:/programs/unair/kwu/TailorHub/assets/css/components.css#L151-L201) dengan kelas `.select`:

- **Tampilan Pemicu**: Memakai `appearance: none` dengan ikon panah chevron SVG tertanam (`background-image: url("data:image/svg+xml,...")`) di sisi kanan.
- **Animasi / Transisi yang Aktif**:
  - `transition: border-color .2s, box-shadow .2s, background .2s;` saat fokus (`.select:focus` menampilkan *ring glow* `--clay` sebesar `4px` dan mengubah latar `--paper` menjadi `#fff`).
- **Keterbatasan & Temuan Bug di Codebase Awal**:
  - Di versi awal `components.css`, `.input:focus, .select:focus, .textarea:focus` memakai shorthand `background: #fff;`, yang secara tidak sengaja **mereset `background-image` menjadi `none`** sehingga ikon panah hilang saat `<select>` diklik/fokus. Menggantinya menjadi `background-color: #fff;` memperbaiki bug ini.
  - Pada mode klasik, daftar opsi memakai gaya bawaan OS; namun sejak CSS `:open` mencapai status *Baseline* (Chrome 131+, Edge 131+, Firefox 133+, Safari 18.1+), panah SVG pada `<select>` native tetap dapat dibalik ke atas (`.select:open { background-image: ... }`) tanpa mengubah gaya dropdown native.
  - Catatan penting tentang `appearance: base-select`: properti ini **harus** diterapkan pada `select` **dan** `::picker(select)` sekaligus. Jika hanya diterapkan pada `select` saja agar dropdown tetap native, browser gagal menghasilkan elemen `::picker-icon` sehingga ikon panah justru hilang.

---

## 3. Tiga Pendekatan Global untuk Interaktivitas `<select>`

### Pendekatan A — Native `<select>` dengan Mikro-Interaksi CSS *(Pola TailorHub Saat Ini)*
Tetap memakai `<select class="select">` standar dengan tambahan transisi halus pada kotak pemicu (`hover`, `focus`, `active`).
- **Kelebihan**:
  - Aksesibilitas (*screen reader* & navigasi keyboard) 100% terjamin tanpa JavaScript tambahan.
  - Di smartphone ($\pm 390\text{px}$), pengguna langsung mendapat *native picker* OS yang sangat ergonomis.
  - Zero-JS, ringan, dan bebas bug posisi/overflow.
- **Kekurangan**: Daftar opsi tidak bisa dianimasikan atau diberi styling custom (warna, ikon, badge).

### Pendekatan B — Modern CSS Customizable Select API (`appearance: base-select`)
Standar web modern yang membuka kendali CSS penuh atas elemen `<select>` dan kontainer daftarnya (`::picker(select)`) di *top layer* browser:

```css
/* 1. Aktifkan mode base-select sebagai progressive enhancement */
@supports (appearance: base-select) {
  .select,
  .select::picker(select) {
    appearance: base-select;
  }

  /* 2. Rotasi ikon panah bawaan saat dropdown terbuka */
  .select::picker-icon {
    transition: transform .22s var(--ease);
  }
  .select:open::picker-icon {
    transform: rotate(180deg);
  }

  /* 3. Animasi buka-tutup dropdown (fade + scale) */
  .select::picker(select) {
    border: 1px solid var(--sand);
    border-radius: var(--r-s);
    background: var(--paper);
    box-shadow: var(--shadow-m);
    opacity: 0;
    transform: translateY(-4px) scale(.98);
    transition:
      opacity .2s var(--ease),
      transform .2s var(--ease),
      display .2s allow-discrete,
      overlay .2s allow-discrete;
  }

  .select:open::picker(select) {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  @starting-style {
    .select:open::picker(select) {
      opacity: 0;
      transform: translateY(-4px) scale(.98);
    }
  }
}
```
- **Dukungan Browser (2025–2026)**:
  - **Chrome & Edge**: Stabil sejak **Chromium 135**.
  - **Safari**: Didukung mulai **Safari 27** (macOS, iOS, iPadOS).
  - **Firefox**: Belum aktif secara default (masih di balik flag eksperimental).
- **Keunggulan**: Bersifat **Progressive Enhancement** — browser yang belum mendukung akan mengabaikan blok `@supports` dan otomatis menampilkan `<select>` native yang tetap 100% berfungsi.

### Pendekatan C — Custom Dropdown / Visual Picker (HTML + CSS + ARIA + JS)
Membangun ulang komponen dropdown memakai `<button>` + `<ul role="listbox">` + JavaScript (atau kartu radio visual).
- **Kelebihan**: Animasi dan desain (chip warna, avatar, kolom cari di dalam dropdown) tampil seragam 100% di seluruh browser termasuk Firefox.
- **Kekurangan**: Harus mengelola secara manual: navigasi keyboard (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`), atribut ARIA (`aria-expanded`, `aria-selected`), *click-outside to close*, dan posisi agar tidak terpotong oleh `overflow: hidden`.

---

## 4. Rekomendasi Penerapan untuk TailorHub

| Konteks Penggunaan di TailorHub | Pendekatan yang Disarankan | Alasan |
|---|---|---|
| **Filter Toolbar & Form Standar** (`board.html`, `list.html`, `orders/create.html`, `onboarding.html`) | **Pendekatan A** *(opsional ditambah **Pendekatan B** via `@supports`)* | Kecepatan input tinggi, 100% aksesibel di mobile 390px, dan tanpa beban JavaScript tambahan. |
| **Pemilihan Tahap Produksi Berwarna** (`update-status.html`) | **Visual Radio Card (`.stage-picker`)** | Pengguna perlu langsung melihat 7 titik warna token status (`--s-queue` s/d `--s-taken`) dan animasi seleksi aktif tanpa harus membuka dropdown. |
| **Pencarian Pelanggan / Item Ribuan Data** (tahap integrasi backend lanjutan) | **Pendekatan C (Searchable Combobox)** | Native `<select>` kurang nyaman jika opsi lebih dari 50–100 pelanggan. |

> **Catatan Arsitektur Tim:** Karena `assets/css/components.css` dilindungi agar tidak terjadi *merge conflict* lintas 6 developer, apabila tim sepakat ingin mengaktifkan animasi `appearance: base-select` secara global, penambahannya cukup diletakkan dalam blok `@supports (appearance: base-select)` di `components.css` setelah kesepakatan bersama.
