
# TailorHub — Panduan Pengerjaan Tim (6 Developer)

Panduan kerja untuk membangun seluruh halaman **TailorHub** — platform SaaS multi-tenant
untuk usaha jahit & konveksi. Proyek ini **HTML/CSS statis** (belum ada backend), dikerjakan
**6 developer** secara paralel.

> Tujuan utama panduan ini: **6 orang menghasilkan tampilan yang konsisten seolah dibuat satu orang.**
> Caranya: semua memakai token & komponen yang sama, serta kerangka (shell) yang sama.

---

## 📁 Dokumen Acuan (baca dulu sebelum mulai)

| File                                          | Isi                                                                                            | Wajib dibuka saat                      |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------- |
| [`PRD.md`](PRD.md)                           | Kebutuhan produk, fitur (FR), role, user flow                                                  | Memahami fitur halaman                 |
| [`style-guide.html`](style-guide.html)       | **Sumber gaya tunggal**: warna, tipografi, tombol, form, chip, tabel, alert, kanban, dll | **Setiap** kali membuat komponen |
| [`list-page.md`](list-page.md)               | Daftar 67 halaman + pembagian 6 dev + detail konten tiap halaman                               | Menentukan halaman yang dikerjakan     |
| [`structure-folder.md`](structure-folder.md) | Struktur folder & aturan penamaan file                                                         | Membuat file baru                      |
| [`index.html`](index.html)                   | Landing page (sudah jadi, acuan visual)                                                        | Referensi gaya publik                  |
| [`app/dashboard.html`](app/dashboard.html)   | **Template App Shell** (sidebar + topbar) + contoh dashboard                             | Membuat halaman internal `app/`      |

---

## 👥 Pembagian 6 Developer

| Bagian | Dev                     | Fokus Area                              | Folder utama                                                             |
| ------ | ----------------------- | --------------------------------------- | ------------------------------------------------------------------------ |
| 1      | **Dev 1 (Danil)** | Situs Publik, Marketing & Sistem        | `index.html`, `pricing/features/about/...`, `404`, `maintenance` |
| 2      | **Dev 2 (Angel)** | Autentikasi & Akun Pengguna             | `auth/`, `account/`                                                  |
| 3      | **Dev 3**         | Dashboard, Laporan & Notifikasi         | `app/dashboard.html`, `app/reports/`, `app/notifications/`         |
| 4      | **Dev 4 (Putri)** | Manajemen Pesanan & Customer            | `app/orders/`, `app/customers/`                                      |
| 5      | **Dev 5**         | Produksi, Tugas Staff & Portal Customer | `app/production/`, `app/staff/`, `portal/`                         |
| 6      | **Dev 6**         | Pembayaran, Tim & Pengaturan Tenant     | `app/payments/`, `app/team/`, `app/settings/`                      |

> Rincian halaman per dev + detail kontennya ada di [`list-page.md`](list-page.md).
> **Dev 3 memulai lebih dulu**: ia membangun `assets/` (CSS bersama) + partial sidebar/topbar,
> karena dibutuhkan 5 dev lainnya. Shell-nya sudah ada di `app/dashboard.html` — tinggal diekstrak.

---

## 🚀 Cara Menjalankan (lokal)

Proyek ini HTML statis — cukup buka di browser. Disarankan pakai server kecil agar path `/assets/...`
dan partial bekerja benar.

**Opsi A — VS Code Live Server (paling mudah):**

1. Install ekstensi **Live Server**.
2. Klik kanan file HTML → **Open with Live Server**.

**Opsi B — Python:**

```bash
# dari folder tailorhub/
python -m http.server 5500
# buka http://localhost:5500/app/dashboard.html
```

**Opsi C — Node:**

```bash
npx serve .
```

---

## 🎨 Aturan Wajib (agar konsisten)

### 1. Jangan pernah menulis warna / ukuran mentah

❌ `color:#C05424` · `background:#2F8F5B` · `padding:26px`
✅ `color:var(--clay)` · `background:var(--s-done)` · `padding:var(--r-l)`

Semua token (warna, radius, bayangan) sudah didefinisikan di `:root` pada `style-guide.html`.
Nanti dipindahkan ke `assets/css/tokens.css` lalu diimpor di setiap halaman.

### 2. Urutan impor CSS — selalu sama di setiap halaman

```html
<link rel="stylesheet" href="/assets/css/tokens.css">      <!-- 1. variabel -->
<link rel="stylesheet" href="/assets/css/base.css">        <!-- 2. reset & tipografi -->
<link rel="stylesheet" href="/assets/css/components.css">  <!-- 3. komponen -->
<link rel="stylesheet" href="/assets/css/app.css">         <!-- 4. HANYA halaman di app/ -->
```

> `auth/`, `portal/`, dan halaman publik root **tidak** mengimpor `app.css`.
> Halaman `app/` dan `account/` **memakai** `app.css` (App Shell).

### 3. Gunakan komponen dari style guide, jangan bikin sendiri

Tombol → `.btn .btn--primary` · Form → `.field .input` · Tabel → `.table` ·
Chip status → lihat **Peta Status** di bawah. Semua contoh + kode ada di `style-guide.html`.

### 4. Status = chip SOLID (latar pekat + teks putih)

Jangan pakai latar pucat/transparan. Gunakan kelas semantik ini **persis**:

| Status produksi | Kelas            | Status bayar       | Kelas            |
| --------------- | ---------------- | ------------------ | ---------------- |
| Antrean         | `chip--queue`  | Belum Bayar        | `chip--unpaid` |
| Pemotongan      | `chip--cut`    | DP                 | `chip--dp`     |
| Penjahitan      | `chip--sew`    | Lunas              | `chip--paid`   |
| Finishing       | `chip--finish` |                    |                  |
| QC              | `chip--qc`     | Mendekati deadline | `chip--clay`   |
| Selesai         | `chip--done`   | Lewat deadline     | `chip--danger` |
| Diambil         | `chip--taken`  | Label netral       | `chip--soft`   |

### 5. Halaman internal WAJIB pakai App Shell yang sama

Salin struktur **sidebar + topbar** dari `app/dashboard.html` (ada komentar `SIDEBAR (reusable)`
dan `Topbar (reusable)`). Hanya isi `<main class="page">` yang berbeda tiap halaman.
Tandai menu aktif dengan `class="nav-i is-on"`.

### 6. Responsif itu wajib

Setiap halaman harus rapi di **desktop & mobile** (uji di lebar ±390px). App Shell sudah
menyediakan sidebar off-canvas + tombol burger — ikuti pola yang sama.

---

## 🌿 Alur Git

1. **Jangan commit langsung ke `main`.** Buat branch per halaman/fitur:
   ```
   git checkout -b dev4/orders-create
   ```
2. Pola nama branch: `dev<nomor>/<area>-<halaman>` → `dev2/auth-login`, `dev5/production-board`.
3. Pesan commit singkat & jelas (Bahasa Indonesia boleh): `tambah halaman form tambah pesanan`.
4. Buka **Pull Request** ke `main`, minta review (disarankan ke Dev 3 / pemilik `assets/`).
5. **Jangan ubah `assets/css/tokens.css` & `assets/partials/icons.svg` tanpa kesepakatan tim** —
   perubahan di sana berdampak ke semua halaman.

---

## ✅ Checklist "Selesai" per Halaman

Sebelum PR, pastikan:

- [ ] Memakai token (`var(--...)`), **tidak ada** hex/px mentah.
- [ ] Memakai kelas komponen dari `style-guide.html` (tombol, form, tabel, chip, dll).
- [ ] Chip status memakai kelas semantik yang benar (lihat Peta Status).
- [ ] Halaman `app/` memakai App Shell (sidebar + topbar) dan menu aktif ditandai.
- [ ] Impor CSS urut benar (`app.css` hanya untuk `app/` & `account/`).
- [ ] Rapi di desktop **dan** mobile (±390px), tanpa scroll horizontal tak sengaja.
- [ ] Nama file & lokasi folder sesuai `structure-folder.md`.
- [ ] Semua tautan antar halaman diisi (bukan `#` kosong) bila tujuannya sudah ada.

---

## 🗂️ Urutan Prioritas (MoSCoW dari PRD)

Kerjakan dulu yang **[M] Must**, lalu **[S] Should**, terakhir **[C] Could**
(penanda ada di tiap halaman pada `list-page.md`):

1. **Must** — autentikasi, dashboard, pesanan, produksi, portal tracking, pengaturan tenant.
2. **Should** — pembayaran, laporan dasar, alert deadline, data customer.
3. **Could** — notifikasi WhatsApp, ekspor laporan, akun customer, log aktivitas, halaman marketing sekunder.

---

## ❓ Pertanyaan Terbuka (belum diputuskan — lihat PRD §10)

- Model pricing/langganan (isi `pricing.html`).
- Portal customer pakai subdomain per tenant? (`namausaha.tailorhub.id`)
- Provider WhatsApp (Fonnte/Wablas) untuk `settings/notifications.html`.
- Multi-bahasa sejak awal?

Jika menemui keputusan yang memengaruhi banyak halaman, diskusikan dengan tim dulu — jangan
putuskan sendiri agar tidak terjadi perbedaan antar halaman.

---

**Selamat mengerjakan! Konsistensi > kreativitas individual. Kalau ragu, lihat `style-guide.html`.**
