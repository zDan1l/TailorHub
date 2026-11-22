================================================================
PRODUCT REQUIREMENTS DOCUMENT (PRD)
TailorHub — Multi-Tenant Tailoring SaaS Platform
================================================================
Versi      : 1.0 (Draft Awal)
Status     : In Review
Dibuat oleh: [Nama Tim / Founder]
Tanggal    : [Tanggal]
================================================================


1. OVERVIEW
-----------
TailorHub adalah platform SaaS berbasis web dengan arsitektur
multi-tenant, dirancang khusus untuk membantu usaha jahit dan
konveksi mengelola pesanan, produksi, customer, dan keuangan
dalam satu sistem terpusat.

Setiap usaha (tenant) mendapatkan lingkungan mandiri yang
terisolasi — data antar tenant tidak dapat saling diakses.


2. TUJUAN PRODUK
----------------
2.1 Business Goals
  - Mengakuisisi pengguna dari segmen usaha jahit & konveksi
    skala UMKM hingga menengah-besar
  - Membangun model bisnis subscription (SaaS) yang berkelanjutan
  - Menjadi referensi solusi digital untuk industri jahit Indonesia

2.2 Product Goals
  - Menggantikan pencatatan manual dengan sistem digital mudah pakai
  - Memberikan visibilitas real-time atas seluruh operasional usaha
  - Meningkatkan kepuasan customer melalui portal tracking mandiri
  - Mendukung pertumbuhan usaha tanpa perlu ganti sistem


3. RUANG LINGKUP (SCOPE)
------------------------
IN SCOPE (MVP):
  - Manajemen tenant (registrasi, onboarding, isolasi data)
  - Manajemen pesanan (CRUD pesanan lengkap)
  - Tracking status produksi real-time
  - Customer self-tracking portal
  - Manajemen data customer
  - Manajemen pembayaran & tagihan
  - Sistem multi-role (Pemilik / Admin / Staff / Customer)
  - Notifikasi otomatis perubahan status pesanan
  - Laporan operasional dasar
  - Dashboard ringkasan bisnis

OUT OF SCOPE (Post-MVP):
  - Integrasi marketplace (Tokopedia, Shopee, dll)
  - Fitur desain / ukuran garmen digital
  - Aplikasi mobile native (iOS/Android)
  - Integrasi mesin jahit / IoT
  - Modul HR dan penggajian


4. USER ROLES & PERMISSIONS
----------------------------

ROLE         | AKSES
-------------|-------------------------------------------------------
Pemilik      | Full access: semua fitur, laporan, pengaturan tenant,
             | manajemen tim, billing
-------------|-------------------------------------------------------
Admin        | Input & kelola pesanan, data customer, pembayaran,
             | update status produksi, lihat laporan dasar
-------------|-------------------------------------------------------
Staff        | Lihat pesanan yang ditugaskan, update status
             | produksi pada tahap tertentu
-------------|-------------------------------------------------------
Customer     | Akses portal tracking: cek status pesanan milik
             | sendiri via kode pesanan atau akun customer


5. FITUR & REQUIREMENTS
------------------------

5.1 MODUL MANAJEMEN TENANT
  FR-01 | Registrasi tenant baru (nama usaha, email, password)
  FR-02 | Onboarding setup awal (profil usaha, logo, kontak)
  FR-03 | Isolasi data penuh antar tenant
  FR-04 | Pengaturan profil dan preferensi tenant
  FR-05 | Manajemen paket langganan (plan & billing)

5.2 MODUL MANAJEMEN PESANAN
  FR-06 | Input pesanan baru dengan field:
         | - Data customer (nama, kontak)
         | - Deskripsi pesanan (jenis, jumlah, detail)
         | - Tanggal masuk & deadline
         | - Harga dan metode pembayaran
         | - Catatan tambahan / lampiran foto
  FR-07 | Edit dan hapus pesanan
  FR-08 | Pencarian dan filter pesanan
         | (berdasarkan status, tanggal, customer, dsb)
  FR-09 | Riwayat pesanan lengkap per customer
  FR-10 | Kode unik pesanan untuk tracking

5.3 MODUL TRACKING PRODUKSI
  FR-11 | Status produksi berlevel:
         | Antrean → Pemotongan → Penjahitan →
         | Finishing → QC → Selesai → Diambil
  FR-12 | Update status oleh staff yang berwenang
  FR-13 | Timestamp otomatis pada setiap perubahan status
  FR-14 | Dashboard kanban atau list view untuk semua pesanan aktif
  FR-15 | Indikator visual pesanan mendekati atau melewati deadline

5.4 MODUL CUSTOMER PORTAL
  FR-16 | Halaman tracking publik per tenant
         | (dapat diakses via link atau QR code)
  FR-17 | Customer cek status pesanan via kode pesanan
         | tanpa perlu login (guest access)
  FR-18 | Opsional: akun customer untuk riwayat pesanan
  FR-19 | Tampilan status pesanan yang informatif dan mudah dipahami

5.5 MODUL MANAJEMEN CUSTOMER
  FR-20 | Database customer per tenant
  FR-21 | Profil customer: nama, kontak, alamat, catatan
  FR-22 | Riwayat semua pesanan per customer
  FR-23 | Pencarian dan filter data customer

5.6 MODUL PEMBAYARAN & TAGIHAN
  FR-24 | Pencatatan pembayaran per pesanan
         | (DP, pelunasan, lunas)
  FR-25 | Status pembayaran: Belum Bayar / DP / Lunas
  FR-26 | Ringkasan tagihan per pesanan
  FR-27 | Laporan pemasukan harian / mingguan / bulanan
  FR-28 | Ekspor laporan ke PDF atau CSV (opsional MVP)

5.7 MODUL NOTIFIKASI
  FR-29 | Notifikasi in-app saat status pesanan berubah
  FR-30 | Notifikasi ke customer via WhatsApp atau email
         | saat status pesanan diperbarui
  FR-31 | Alert internal untuk pesanan mendekati deadline
  FR-32 | Notifikasi pesanan baru untuk Pemilik / Admin

5.8 MODUL LAPORAN & DASHBOARD
  FR-33 | Dashboard utama: total pesanan aktif, pesanan selesai,
         | pemasukan periode ini, alert deadline
  FR-34 | Laporan pesanan: jumlah, status, distribusi waktu
  FR-35 | Laporan pemasukan: harian, mingguan, bulanan
  FR-36 | Laporan produktivitas (opsional post-MVP)

5.9 MODUL TIM & AKSES
  FR-37 | Undang anggota tim via email
  FR-38 | Assign role per anggota (Admin / Staff)
  FR-39 | Pemilik bisa edit dan hapus akses anggota
  FR-40 | Log aktivitas anggota tim (opsional)


6. NON-FUNCTIONAL REQUIREMENTS
--------------------------------
NFR-01 | Multi-tenancy: data sepenuhnya terisolasi antar tenant
NFR-02 | Performa: halaman utama load < 3 detik pada koneksi normal
NFR-03 | Keamanan: autentikasi JWT, HTTPS, enkripsi data sensitif
NFR-04 | Responsif: antarmuka mendukung desktop dan mobile browser
NFR-05 | Ketersediaan: uptime target 99.5% per bulan
NFR-06 | Skalabilitas: arsitektur mendukung penambahan tenant
         | tanpa degradasi performa signifikan
NFR-07 | Kemudahan pakai: onboarding tenant baru < 10 menit
         | tanpa panduan teknis


7. USER FLOW UTAMA
------------------

FLOW A — Pemilik mendaftarkan usaha:
  Registrasi → Verifikasi email → Setup profil usaha →
  Undang tim → Mulai input pesanan

FLOW B — Admin input pesanan baru:
  Login → Dashboard → Tambah Pesanan → Isi form pesanan →
  Simpan → Pesanan masuk antrean produksi

FLOW C — Staff update status produksi:
  Login → Lihat daftar pesanan aktif → Pilih pesanan →
  Update status → Simpan → Notifikasi terkirim ke customer

FLOW D — Customer tracking pesanan:
  Buka link portal tenant → Masukkan kode pesanan →
  Lihat status terkini dan histori perubahan status

FLOW E — Pemilik cek laporan bisnis:
  Login → Menu Laporan → Pilih periode →
  Lihat ringkasan pesanan dan pemasukan


8. TECH STACK (REKOMENDASI)
----------------------------
Frontend   : Next.js (React) + Tailwind CSS
Backend    : Node.js / Laravel (pilih sesuai tim)
Database   : PostgreSQL (dengan schema per tenant
             atau row-level tenant ID)
Auth       : JWT + Role-based access control (RBAC)
Notifikasi : WhatsApp API (Fonnte / Wablas) + Email (Resend/SMTP)
Hosting    : VPS / Railway / Vercel + Supabase
             (atau full AWS/GCP untuk skala besar)

Catatan: Tech stack bersifat rekomendasi dan dapat disesuaikan
dengan kapabilitas tim pengembang.


9. MVP PRIORITY (MoSCoW)
--------------------------

MUST HAVE:
  - Registrasi & manajemen tenant
  - Input & manajemen pesanan
  - Tracking status produksi
  - Customer portal (kode pesanan, tanpa login)
  - Multi-role dasar (Pemilik, Admin, Staff)
  - Dashboard ringkasan pesanan aktif
  - Notifikasi perubahan status (minimal in-app)

SHOULD HAVE:
  - Manajemen pembayaran & tagihan
  - Laporan pemasukan dasar
  - Alert deadline pesanan
  - Manajemen data customer terstruktur

COULD HAVE:
  - Notifikasi WhatsApp otomatis ke customer
  - Ekspor laporan ke PDF/CSV
  - Akun customer untuk riwayat pesanan
  - Undang tim via email

WON'T HAVE (MVP):
  - Integrasi marketplace
  - Mobile native app
  - Modul HR / penggajian
  - Fitur desain garmen digital


10. OPEN QUESTIONS
------------------
  [ ] Model pricing / subscription (per tenant, per user, atau
      berdasarkan volume pesanan?)
  [ ] Apakah customer portal menggunakan subdomain per tenant?
      (mis: namausaha.tailorhub.id)
  [ ] Provider notifikasi WhatsApp yang akan digunakan?
  [ ] Apakah dibutuhkan fitur multi-bahasa sejak awal?
  [ ] Strategi onboarding: self-service atau assisted?


================================================================
END OF DOCUMENT
================================================================

