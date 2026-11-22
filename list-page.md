# TailorHub — Daftar Seluruh Halaman (List All Pages)

Dokumen ini memetakan **seluruh halaman HTML** TailorHub secara lengkap, diturunkan dari `PRD.md`.
Semua halaman wajib memakai token & komponen dari **`style-guide.html`** (lihat juga `structure-folder.md`).

**Legenda:**
- 🌐 **Publik** — tanpa login (landing, portal customer, auth, halaman sistem).
- 🔒 **App Shell** — halaman internal dengan sidebar + topbar (lihat komponen *App Shell* di style guide).
- Role: **P** = Pemilik · **A** = Admin · **S** = Staff · **C** = Customer.
- Prioritas: **[M]** Must · **[S]** Should · **[C]** Could (MoSCoW di PRD §9). Tanpa tanda = pendukung/sistem.
- Kode FR merujuk ke requirement di `PRD.md`.

**Total: 67 halaman**, dibagi ke **6 pengembang** (10–13 halaman/orang).
Sebagian ditandai *(partial)* = potongan HTML/modal yang disisipkan, bukan halaman penuh.

---

## 📋 Ringkasan Pembagian 6 Orang

| Bagian | Pengembang | Fokus Area | Jml |
|--------|-----------|-----------|-----|
| **1** | Dev 1 | Situs Publik, Marketing & Halaman Sistem | 10 | **Danil**
| **2** | Dev 2 | Autentikasi & Akun Pengguna | 10 |
| **3** | Dev 3 | Dashboard, Laporan & Notifikasi | 10 |
| **4** | Dev 4 | Manajemen Pesanan & Customer | 11 | **Zelvia** |
| **5** | Dev 5 | Produksi, Tugas Staff & Portal Customer | 13 |
| **6** | Dev 6 | Pembayaran, Tim & Pengaturan Tenant | 13 |

> **Konvensi bersama:** semua halaman App Shell memakai partial sidebar + topbar yang sama. Warna status wajib mengikuti *Peta Status Pesanan* di style guide. Nama file huruf kecil, pisah tanda hubung (`order-detail.html`). Impor CSS sesuai `structure-folder.md`.

---

# BAGIAN 1 — Dev 1 · Situs Publik, Marketing & Halaman Sistem
Area publik: pintu masuk produk + halaman legal/bantuan + halaman error. Mengacu FLOW A.

### 1.1 `index.html` — Landing Page 🌐 [M] *(SUDAH ADA — acuan visual)*
Hero, segmen usaha, perbandingan sebelum/sesudah, fitur, kanban produksi, portal, harga, FAQ, CTA, footer. Dev 1 menyambungkan tombol ke halaman auth.

### 1.2 `pricing.html` — Harga & Paket 🌐 [S] (FR-05)
Tabel perbandingan 3 paket (Perorangan/Usaha/Konveksi), toggle bulanan–tahunan, daftar fitur per paket, FAQ billing, CTA "Coba Gratis".

### 1.3 `features.html` — Detail Fitur 🌐 [C]
Penjabaran modul: pesanan, produksi, portal, pembayaran, laporan — tiap fitur dengan ilustrasi & benefit.

### 1.4 `about.html` — Tentang TailorHub 🌐 [C]
Cerita produk, visi industri jahit Indonesia (PRD §2), tim/kontak singkat.

### 1.5 `contact.html` — Kontak & Demo 🌐 [C]
Form kontak (nama, email, pesan), info support, ajakan jadwalkan demo.

### 1.6 `help-center.html` — Pusat Bantuan / FAQ Publik 🌐 [C]
Daftar pertanyaan umum terkelompok, kolom pencarian, tautan panduan onboarding.

### 1.7 `terms.html` — Syarat & Ketentuan 🌐
Halaman legal berbasis teks. Ditautkan dari form registrasi.

### 1.8 `privacy.html` — Kebijakan Privasi 🌐 (NFR-03)
Halaman legal: pengelolaan data, enkripsi, isolasi antar tenant.

### 1.9 `404.html` — Halaman Tidak Ditemukan 🌐
Ilustrasi + pesan + tombol kembali ke beranda/dashboard. (Komponen empty state.)

### 1.10 `maintenance.html` — Perawatan / Error Server 🌐 (NFR-05)
State sistem tidak tersedia / sedang perawatan + estimasi.

---

# BAGIAN 2 — Dev 2 · Autentikasi & Akun Pengguna
Seluruh alur masuk/daftar + pengaturan akun pribadi (beda dari pengaturan tenant). Mengacu FLOW A, FR-01, FR-02, FR-37, NFR-03.

### 2.1 `auth/register.html` — Registrasi Tenant 🌐 [M] (FR-01)
Form daftar usaha: nama usaha, nama pemilik, email, password, konfirmasi, setuju S&K. Validasi inline.

### 2.2 `auth/login.html` — Masuk 🌐 [M]
Email, password, "ingat saya", lupa password. Untuk semua role internal.

### 2.3 `auth/verify-email.html` — Verifikasi Email 🌐 [M] (FLOW A)
Status "cek email" + kirim ulang + state sudah terverifikasi → onboarding.

### 2.4 `auth/forgot-password.html` — Lupa Password 🌐 [S]
Input email untuk kirim tautan reset + pesan sukses.

### 2.5 `auth/reset-password.html` — Atur Password Baru 🌐 [S]
Form password baru via token dari email + validasi kekuatan.

### 2.6 `auth/accept-invitation.html` — Terima Undangan Tim 🌐 [C] (FR-37)
Anggota diundang klik tautan email → set nama & password → masuk sebagai Admin/Staff.

### 2.7 `auth/onboarding.html` — Setup Awal Tenant 🔒 [M] (FR-02, NFR-07)
Wizard multi-langkah (<10 menit): profil usaha, logo, kontak, jenis usaha, undang tim (opsional). Progress steps.

### 2.8 `account/profile.html` — Profil Saya 🔒 P·A·S
Kelola data pribadi: nama, foto, email, nomor. (Berbeda dari profil usaha/tenant.)

### 2.9 `account/change-password.html` — Ganti Password 🔒 P·A·S (NFR-03)
Form password lama + baru + konfirmasi.

### 2.10 `account/preferences.html` — Preferensi Akun 🔒 P·A·S
Bahasa (Open Question multi-bahasa), tema, preferensi notifikasi pribadi.

---

# BAGIAN 3 — Dev 3 · Dashboard, Laporan & Notifikasi
Pusat ringkasan & seluruh laporan. Mengacu FLOW E, modul 5.7–5.8.

### 3.1 `app/dashboard.html` — Dashboard Utama 🔒 P·A [M] (FR-33)
Tile KPI (pesanan aktif, selesai, pemasukan periode, alert deadline), grafik tren, panel pesanan terbaru, panel alert deadline, mini-kanban per tahap.

### 3.2 `app/search.html` — Hasil Pencarian Global 🔒 P·A·S
Hasil dari kolom search topbar: gabungan pesanan, customer, tagihan dengan tab hasil.

### 3.3 `app/reports/index.html` — Pusat Laporan 🔒 P·A [S] (FR-34–36)
Hub laporan: kartu/tab menuju tiap laporan + pemilih periode global.

### 3.4 `app/reports/orders.html` — Laporan Pesanan 🔒 P·A [S] (FR-34)
Jumlah pesanan, distribusi status, distribusi waktu; chart + tabel rekap + ekspor.

### 3.5 `app/reports/income.html` — Laporan Pemasukan 🔒 P·A [S] (FR-35)
Pemasukan harian/mingguan/bulanan; chart tren, tabel rincian, total & rata-rata.

### 3.6 `app/reports/customers.html` — Laporan Pelanggan 🔒 P·A [C]
Pelanggan teraktif, pelanggan baru per periode, nilai transaksi per pelanggan.

### 3.7 `app/reports/productivity.html` — Laporan Produktivitas 🔒 P [C] (FR-36, post-MVP)
Output per staff/tahap, waktu rata-rata tiap tahap. Tandai "Segera hadir" bila di luar MVP.

### 3.8 `app/reports/export.html` — Pratinjau & Ekspor 🔒 P·A [C] (FR-28)
Pilih jenis + periode + format (PDF/CSV), pratinjau sebelum unduh.

### 3.9 `app/notifications/index.html` — Pusat Notifikasi In-App 🔒 P·A·S [M] (FR-29, FR-31, FR-32)
Daftar notifikasi: perubahan status, pesanan baru, alert deadline. Filter semua/belum dibaca, tandai dibaca.

### 3.10 `app/notifications/settings.html` — Preferensi Notifikasi 🔒 P·A (FR-29–32)
Atur kanal (in-app, email, WhatsApp) per jenis kejadian.

---

# BAGIAN 4 — Dev 4 · Manajemen Pesanan & Customer
Inti operasional + database pelanggan (dibuat bersama saat input pesanan). Mengacu FLOW B, modul 5.2 & 5.5.

### 4.1 `app/orders/index.html` — Daftar Pesanan 🔒 P·A [M] (FR-08, FR-15)
Tabel semua pesanan + search & filter (status, tanggal, customer), tombol "Tambah Pesanan", indikator deadline, pagination.

### 4.2 `app/orders/create.html` — Tambah Pesanan 🔒 P·A [M] (FR-06)
Form: data customer (pilih/buat baru), deskripsi (jenis, jumlah, detail), tanggal masuk & deadline, harga, metode & status bayar, catatan + lampiran foto. Ringkasan harga → masuk antrean.

### 4.3 `app/orders/edit.html` — Edit Pesanan 🔒 P·A [M] (FR-07)
Form sama seperti create, terisi data lama.

### 4.4 `app/orders/detail.html` — Detail Pesanan 🔒 P·A·S [M] (FR-09, FR-10)
Tab **Detail · Produksi · Pembayaran · Riwayat**. Header: kode unik + QR/link tracking, status produksi & bayar, deadline, timeline, info customer, rincian item, aksi.

### 4.5 `app/orders/search.html` — Pencarian & Filter Lanjutan 🔒 P·A [S] (FR-08)
Filter kombinasi (rentang tanggal, status, customer, nilai), simpan filter.

### 4.6 `app/orders/print.html` — Nota / Surat Kerja 🔒 P·A
Tampilan cetak-ramah: header usaha, detail pesanan, harga, status bayar, kode tracking + QR.

### 4.7 `app/orders/delete-modal.html` — Konfirmasi Hapus *(partial)* 🔒 P·A (FR-07)
Modal konfirmasi hapus pesanan.

### 4.8 `app/orders/bulk-update.html` — Aksi Massal 🔒 P·A [C]
Pilih banyak pesanan → ubah status / tetapkan staff / hapus sekaligus.

### 4.9 `app/customers/index.html` — Database Customer 🔒 P·A [S] (FR-20, FR-23)
Tabel customer + search & filter; kolom nama, kontak, jumlah pesanan, total transaksi; tombol tambah.

### 4.10 `app/customers/detail.html` — Profil & Riwayat Customer 🔒 P·A [S] (FR-21, FR-22)
Profil (nama, kontak, alamat, catatan) + riwayat seluruh pesanan; aksi edit & buat pesanan baru.

### 4.11 `app/customers/form.html` — Tambah / Edit Customer *(bisa modal)* 🔒 P·A (FR-20, FR-21)
Form data customer dipakai di database & saat input pesanan.

---

# BAGIAN 5 — Dev 5 · Produksi, Tugas Staff & Portal Customer
Operasional lantai produksi + portal publik pelanggan (keduanya menampilkan status produksi). Mengacu FLOW C & D, modul 5.3 & 5.4, FR-30.

### 5.1 `app/production/board.html` — Papan Kanban Produksi 🔒 P·A·S [M] (FR-14)
Kanban 7 tahap (Antrean→Pemotongan→Penjahitan→Finishing→QC→Selesai→Diambil), drag antar kolom, hitung per kolom, indikator deadline, filter per staff.

### 5.2 `app/production/list.html` — List View Pesanan Aktif 🔒 P·A·S [M] (FR-14)
Tabel pesanan aktif + kolom tahap, assignee, deadline; toggle ke board.

### 5.3 `app/production/detail.html` — Detail Produksi 🔒 P·A·S [M] (FR-12, FR-13)
Timeline tahap + timestamp otomatis, tombol update status, catatan produksi, assignee.

### 5.4 `app/production/update-status.html` — Update Status *(modal/halaman)* 🔒 A·S [M] (FR-12, FR-13, FR-30)
Pilih tahap baru + catatan → timestamp otomatis → memicu notifikasi ke customer.

### 5.5 `app/production/deadline-alerts.html` — Pantau Deadline 🔒 P·A [S] (FR-15, FR-31)
Pesanan mendekati/melewati deadline, diurut mendesak, indikator visual + aksi cepat.

### 5.6 `app/staff/my-tasks.html` — Tugas Saya (Staff) 🔒 S [M] (5.3)
Hanya pesanan yang ditugaskan, dikelompokkan per tahap; kartu tugas + update cepat; tab tugas selesai.

### 5.7 `app/staff/task-detail.html` — Detail Tugas Staff 🔒 S [M]
Instruksi, detail item, tombol "tandai selesai tahap ini".

### 5.8 `portal/landing.html` — Halaman Depan Portal Tenant 🌐 C [M] (FR-16)
Branding tenant (logo, nama), ajakan lacak pesanan, info kontak/jam buka. **Tanpa App Shell.**

### 5.9 `portal/track.html` — Lacak Pesanan (Guest) 🌐 C [M] (FR-16, FR-17)
Input kode pesanan tanpa login (akses via link/QR).

### 5.10 `portal/track-result.html` — Hasil Tracking 🌐 C [M] (FR-19)
Timeline tahap produksi informatif, estimasi selesai, status bayar ringkas, kontak usaha.

### 5.11 `portal/customer-login.html` — Login Akun Customer 🌐 C [C] (FR-18)
Login opsional agar customer lihat riwayat pesanan.

### 5.12 `portal/customer-register.html` — Daftar Akun Customer 🌐 C [C] (FR-18)
Pendaftaran akun customer (opsional).

### 5.13 `portal/customer-account.html` — Riwayat Pesanan Customer 🌐 C [C] (FR-18, FR-22)
Dashboard customer (setelah login): daftar semua pesanannya + status masing-masing.

---

# BAGIAN 6 — Dev 6 · Pembayaran, Tim & Pengaturan Tenant
Keuangan per pesanan + administrasi & konfigurasi tenant. Mengacu modul 5.1, 5.6, 5.9.

### 6.1 `app/payments/index.html` — Daftar Pembayaran & Tagihan 🔒 P·A [S] (FR-24–26)
Tabel pembayaran semua pesanan: status (Belum Bayar/DP/Lunas), nilai, sisa tagihan; filter, ringkasan piutang & pemasukan, tombol catat.

### 6.2 `app/payments/record.html` — Catat Pembayaran *(bisa modal)* 🔒 P·A [S] (FR-24)
Jenis (DP/pelunasan), jumlah, metode, tanggal; ringkasan tagihan otomatis (total, terbayar, sisa).

### 6.3 `app/payments/invoice.html` — Tagihan / Invoice 🔒 P·A·C [S] (FR-26)
Rincian tagihan satu pesanan: item, harga, DP, sisa, status; siap cetak/kirim.

### 6.4 `app/payments/receipt.html` — Kwitansi / Bukti Bayar 🔒 P·A·C (FR-24)
Bukti pembayaran per transaksi, cetak-ramah.

### 6.5 `app/payments/detail.html` — Riwayat Pembayaran Pesanan 🔒 P·A (FR-24, FR-26)
Semua transaksi satu pesanan (DP, cicilan, pelunasan) + sisa tagihan.

### 6.6 `app/team/index.html` — Manajemen Tim 🔒 P [C] (FR-37, FR-38, FR-39)
Daftar anggota + role (Admin/Staff), tombol undang (modal via email), edit role, hapus akses.

### 6.7 `app/team/member-detail.html` — Detail & Hak Akses Anggota 🔒 P (FR-38, FR-39)
Profil anggota, ubah role, atur tahap produksi yang boleh di-update, nonaktifkan akses.

### 6.8 `app/team/activity-log.html` — Log Aktivitas Tim 🔒 P [C] (FR-40)
Riwayat aktivitas anggota (siapa mengubah apa, kapan) + filter per anggota/tanggal.

### 6.9 `app/settings/tenant.html` — Profil & Branding Usaha 🔒 P [M] (FR-02, FR-04)
Nama, logo, kontak, alamat usaha + pengaturan portal/subdomain & QR (Open Question subdomain).

### 6.10 `app/settings/billing.html` — Langganan & Billing 🔒 P [S] (FR-05)
Paket aktif, tanggal perpanjangan, riwayat tagihan langganan, upgrade/ubah paket, metode bayar.

### 6.11 `app/settings/notifications.html` — Integrasi Notifikasi 🔒 P (FR-30)
Konfigurasi provider WhatsApp (Fonnte/Wablas) & email (SMTP/Resend), template pesan status.

### 6.12 `app/settings/order-preferences.html` — Preferensi Pesanan 🔒 P (FR-10, FR-11)
Format kode pesanan, penyesuaian nama/urutan tahap produksi, default metode bayar.

### 6.13 `app/settings/security.html` — Keamanan 🔒 P (NFR-03)
Kebijakan password, sesi aktif/perangkat, (opsional) 2FA, isolasi data tenant.

---

## 📌 Catatan Lintas-Tim (penting untuk 6 orang)
1. **Satu sumber gaya:** jangan menulis CSS warna/ukuran mentah. Impor `assets/css/tokens.css` + `components.css` + (untuk `app/`) `app.css`.
2. **Partial bersama:** sidebar, topbar, set ikon SVG dibuat sekali di `assets/partials/` lalu dipakai semua halaman. **Disarankan Dev 3** membuatnya lebih dulu (dia yang pertama butuh App Shell untuk dashboard).
3. **Status & chip:** warna status wajib mengikuti *Peta Status Pesanan* di `style-guide.html`.
4. **Penamaan file & folder:** ikuti `structure-folder.md` persis.
5. **Halaman *(partial)*/modal:** boleh berupa potongan HTML yang disisipkan, bukan halaman penuh.
6. **Urutan pengerjaan (MoSCoW):** dahulukan **[M] Must** (auth, dashboard, pesanan, produksi, portal tracking, pengaturan tenant), lalu **[S] Should**, terakhir **[C] Could**.
7. **Di luar MVP / opsional (boleh ditunda):** `reports/productivity`, `reports/customers`, `team/activity-log`, `bulk-update`, akun customer (`customer-login/register/account`), `features/about/contact/help-center`.
8. **Catatan multi-tenant:** PRD menyebut role Pemilik/Admin/Staff/Customer — **belum** ada super-admin platform. Jika kelak dibutuhkan panel pengelola seluruh tenant (manajemen langganan global), itu modul tambahan **di luar daftar ini**.
