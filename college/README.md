# TailorHub — Hub Dokumen Insight Repositori
**Mata Kuliah Kewirausahaan (KWU) — Universitas Airlangga**
*Analisis Komprehensif: Product Requirements Document (PRD), Arsitektur Codebase, Pembagian Kerja Tim (6 Developer), dan Strategi Bisnis SaaS.*

---

## 📌 Ringkasan Eksekutif (Executive Summary)

**TailorHub** adalah platform *Software-as-a-Service* (SaaS) multi-tenant B2B yang dirancang untuk mendigitalisasi operasional usaha jahit rumahan, butik kustom, hingga konveksi semi-industri di Indonesia. Repositori ini berisi fondasi *frontend* prototipe aplikasi statis (HTML5, CSS3 murni berbasis variabel token, dan JavaScript modular) yang dikembangkan secara paralel oleh **tim beranggotakan 6 pengembang**.

Tujuan utama repositori pada tahap ini adalah menyajikan **antarmuka sistem (UI/UX) yang 100% konsisten, responsif, dan siap diintegrasikan dengan backend fullstack (seperti Next.js / Laravel + PostgreSQL Multi-Tenant)**.

Direktori `college/` ini memuat telaah mendalam, evaluasi kritis, dan panduan strategis yang disusun secara sistematis untuk kebutuhan akademik dan eksekusi teknis tim.

---

## 🗺️ Struktur & Peta Dokumen Insight

Berikut adalah peta modul insight yang tersedia di dalam direktori `college/`:

| No | Dokumen | Fokus Pembahasan | Target Pembaca |
|---|---|---|---|
| **01** | [`01-analisis-prd-dan-kebutuhan.md`](01-analisis-prd-dan-kebutuhan.md) | Bedah PRD, Problem-Solution Fit UMKM jahit, Scope MVP vs Post-MVP, RBAC Matrix, dan telaah 40 Functional Requirements (FR). | Product Owner, System Analyst, Tim Pengembang |
| **02** | [`02-analisis-codebase-dan-arsitektur.md`](02-analisis-codebase-dan-arsitektur.md) | Analisis arsitektur MPA tanpa build step, CSS Design Tokens, komponen `style-guide.html`, App Shell reusable, serta evaluasi kualitas kode berjalan. | Frontend Developer, UI/UX Designer |
| **03** | [`03-analisis-pembagian-kerja-tim.md`](03-analisis-pembagian-kerja-tim.md) | Telaah pembagian 67 halaman ke 6 developer (Dev 1–6), analisis jalur kritis (*Critical Path*), titik rawan integrasi (*bottleneck*), dan standar Git workflow. | Project Manager, Scrum Master, Seluruh Anggota Tim |
| **04** | [`04-analisis-bisnis-dan-kewirausahaan.md`](04-analisis-bisnis-dan-kewirausahaan.md) | Perspektif Kewirausahaan (KWU UNAIR): Business Model Canvas (BMC), strategi monetisasi langganan, analisis SWOT, dan rencana Go-To-Market (GTM) sentra konveksi Surabaya. | Founder, Tim Bisnis / Manajemen KWU |
| **05** | [`05-panduan-eksekusi-dev5-alan.md`](05-panduan-eksekusi-dev5-alan.md) | Action plan & panduan teknis khusus Dev 5 (Alan) pada cabang `alan`: spesifikasi Kanban 7 tahap, portal tracking publik tanpa login, dan mobile-view staf. | Developer 5 (Alan / Anda) |
| **06** | [`catatan-tugas-dev5.md`](catatan-tugas-dev5.md) | **Lembar Penugasan Resmi & Tracking Dev 5**: Status pengerjaan 13 halaman modul Produksi, Staf, dan Portal Pelanggan milik Anda. | Developer 5 (Alan / Anda) |
| **07** | [`task-plan/README.md`](task-plan/README.md) | **Task Plan Micro-Commit (`app/production/*`)**: Pemecahan `implementation_plan.md` menjadi 8 micro-task atomik siap eksekusi & commit per langkah. | Koordinator & Dev 5 |
| **08** | [`06-insight-interaktivitas-elemen-select.md`](06-insight-interaktivitas-elemen-select.md) | **Insight Global Elemen `<select>`**: Analisis teknis animasi dropdown, *Customizable Select API* (`base-select`), dukungan browser, dan rekomendasi untuk TailorHub. | Frontend Developer, UI/UX Designer |

---

## 🔍 Temuan Utama (Key Insights)

### 1. Dari Sudut Pandang Produk (PRD)
- **Niche Market yang Valid**: Industri jahit skala mikro dan menengah di Indonesia masih mengandalkan buku nota fisik dan chat WhatsApp yang terfragmentasi. Masalah utama bukan sekadar pencatatan keuangan, melainkan **ketidakpastian status pengerjaan pakaian** dan **seringnya meleset dari deadline** (misal momen wisuda/lebaran).
- **Fitur Pembeda Utama (Killer Feature)**: **Guest Self-Tracking Portal via Kode Unik / QR Code** (FR-16, FR-17). Pelanggan tidak perlu mengunduh aplikasi atau membuat akun; mereka cukup memindai QR pada nota cetak untuk melihat progres baju secara *real-time*. Ini memangkas 70%+ pesan tanya-jawab *"baju saya sudah jadi belum?"* di WhatsApp penjahit.
- **Batasan MVP yang Tepat**: Menahan diri dari godaan fitur rumit seperti *digital pattern design* (CAD baju), IoT mesin jahit, atau marketplace terintegrasi adalah langkah bijak agar tim dapat meluncurkan MVP dalam kurun waktu semester perkuliahan.

### 2. Dari Sudut Pandang Codebase
- **Zero-Build Architecture**: Keputusan menggunakan HTML/CSS statis dengan struktur modular (`tokens.css`, `base.css`, `components.css`, `app.css`) sangat tepat untuk kolaborasi cepat 6 developer tanpa hambatan kompilasi atau dependensi npm yang rapuh.
- **Design System Disiplin Tinggi**: Tersedianya `style-guide.html` sebagai *single source of truth* berhasil menjaga keselarasan palet warna (Clay `#C05424`, Cream, Sand, Indigo) serta standarisasi chip status solid (7 tahap produksi dan 3 status pembayaran).
- **Progres Implementasi**:
  - Modul **Publik & Landing** (`index.html`): Sudah lengkap dan memiliki estetika visual kelas industri.
  - Modul **Auth & Onboarding** (`auth/`, `account/` oleh Dev 2 - Angel): Selesai diimplementasikan dengan wizard setup tenant yang sangat rapi.
  - Modul **Orders & Customers** (`app/orders/`, `app/customers/`): Telah didesain lengkap dengan fitur nota cetak dan filter mutakhir (tersimpan dalam riwayat commit PR #2).
  - Modul **Produksi, Staff, & Portal** (Dev 5 - Alan): Merupakan fokus utama pengerjaan berikutnya di cabang aktif saat ini.

### 3. Dari Sudut Pandang Pembagian Kerja & Kolaborasi Tim
- **Distribusi Rata & Logis**: 67 halaman dibagi merata menjadi 10–13 halaman per orang dengan batasan modul yang jelas:
  - **Dev 1 (Danil)**: Halaman Publik, Marketing, Legal, dan Error Handling.
  - **Dev 2 (Angel)**: Autentikasi Pengguna dan Akun Pribadi.
  - **Dev 3**: Dashboard Utama, Pusat Laporan, Notifikasi, dan Fondasi Aset Bersama.
  - **Dev 4 (Putri / Zelvia)**: Manajemen Pesanan dan Direktori Pelanggan.
  - **Dev 5 (Alan)**: Papan Kanban Produksi, Tugas Staf Jahit, dan Portal Publik Pelanggan.
  - **Dev 6**: Pembayaran, Invoice, Manajemen Hak Akses Tim, dan Pengaturan Tenant.
- **Jalur Kritis (Critical Path)**: Dev 4 dan Dev 5 memiliki interdependensi data tertinggi. Alur pesanan yang diinput di Dev 4 mengalir langsung ke Kanban Produksi milik Dev 5, lalu hasilnya ditampilkan ke Portal Customer milik Dev 5. Sinkronisasi status semantik antar kedua developer ini adalah kunci sukses integrasi sistem.

---

## 💡 Rekomendasi Langkah Selanjutnya
1. **Untuk Anda sebagai Dev 5 (Alan)**: Gunakan lembar kerja di [`catatan-tugas-dev5.md`](catatan-tugas-dev5.md) dan panduan teknis di [`05-panduan-eksekusi-dev5-alan.md`](05-panduan-eksekusi-dev5-alan.md) untuk memulai pengerjaan 13 halaman modul Produksi dan Portal Publik pada cabang git `alan`.
2. **Prioritas Eksekusi**: Mulai dari `portal/track.html` dan `portal/track-result.html` (fitur pelacakan mandiri tanpa login), lalu lanjutkan ke Papan Kanban 7 tahap di `app/production/board.html`.
2. **Standardisasi Komponen Partial**: Hindari duplikasi kode SVG Sprite di setiap file dengan memanfaatkan pemanggilan file simbol bersama atau menyepakati template `<head>` yang seragam.
3. **Penyelarasan Git & PR Review**: Sebelum menggabungkan modul ke `main`, lakukan *peer-review* lintas bagian (terutama Dev 4 dan Dev 5) guna memastikan semua tautan navigasi relatif antar halaman terhubung tanpa pranala mati (`href="#"`).

---
*Dibuat untuk kebutuhan analisis akademik dan panduan teknis proyek TailorHub — Universitas Airlangga.*
