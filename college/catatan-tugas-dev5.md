# Catatan Penugasan & Lembar Kerja: Developer 5 (Alan)
**Proyek:** TailorHub — Multi-Tenant Tailoring SaaS  
**Mata Kuliah:** Kewirausahaan (KWU) — Universitas Airlangga  
**Pengembang:** Dev 5 (Alan / Anda)  
**Cabang Git Aktif:** `alan`  
**Area Tanggung Jawab:** Produksi, Tugas Staf & Portal Pelanggan  

---

## 📌 Ringkasan Penugasan Resmi

Anda secara resmi memegang peran sebagai **Developer 5 (Dev 5)**. 

Tanggung jawab utama Anda adalah membangun antarmuka operasional lantai jahit dan wajah interaksi mandiri pelanggan, mencakup total **13 halaman HTML** yang terbagi ke dalam dua domain utama:
1. **Internal Usaha (🔒 App Shell):** Papan Kanban 7 tahap, List View produksi, pemantauan deadline, serta antarmuka khusus staf penjahit di smartphone.
2. **Eksternal Publik (🌐 Standalone Mobile-First):** Portal pelacakan pesanan tanpa login via QR/kode unik, informasi profil tenant, serta akun riwayat customer.

---

## 📋 Daftar Rinci 13 Halaman Tanggung Jawab Dev 5

### Bagian A: Lantai Produksi (`app/production/`) — 🔒 Menggunakan App Shell
*Wajib mengimpor:* `tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css` $\rightarrow$ `app.css`.

| No | File Path | Nama Halaman & Deskripsi | Prioritas PRD | Status |
|:---:|---|---|:---:|:---:|
| 1 | [`app/production/board.html`](file:///d:/programs/unair/kwu/TailorHub/app/production/board.html) | **Papan Kanban Produksi (7 Kolom)**: Visualisasi tahap *Antrean $\rightarrow$ Pemotongan $\rightarrow$ Penjahitan $\rightarrow$ Finishing $\rightarrow$ QC $\rightarrow$ Selesai $\rightarrow$ Diambil*. Counter jumlah kartu, indikator deadline (<2 hari clay, lewat deadline danger). | **[M] Must** | ✅ Selesai |
| 2 | [`app/production/list.html`](file:///d:/programs/unair/kwu/TailorHub/app/production/list.html) | **List View Pesanan Aktif**: Tabel pesanan aktif dengan kolom tahap, penjahit (assignee), deadline, dan tombol beralih ke board. | **[M] Must** | ✅ Selesai |
| 3 | [`app/production/detail.html`](file:///d:/programs/unair/kwu/TailorHub/app/production/detail.html) | **Detail Alur Produksi**: Timeline tahapan + timestamp riwayat perubahan status, catatan produksi kain/benang, dan nama staf penjahit. | **[M] Must** | ✅ Selesai |
| 4 | [`app/production/update-status.html`](file:///d:/programs/unair/kwu/TailorHub/app/production/update-status.html) | **Formulir / Modal Update Tahap**: Pilihan status baru, catatan progres pengerjaan, dan trigger notifikasi pelanggan. | **[M] Must** | ✅ Selesai |
| 5 | [`app/production/deadline-alerts.html`](file:///d:/programs/unair/kwu/TailorHub/app/production/deadline-alerts.html) | **Pantauan Deadline Kritis**: Filter pesanan mendekati/melewati batas waktu pengerjaan untuk prioritas kerja lantai produksi. | **[S] Should** | ✅ Selesai |

---

### Bagian B: Antarmuka Kerja Staf (`app/staff/`) — 🔒 Menggunakan App Shell (Mobile Focused)
*Dirancang khusus untuk diakses penjahit di smartphone meja kerja ($\pm 360\text{px}$):*

| No | File Path | Nama Halaman & Deskripsi | Prioritas PRD | Status |
|:---:|---|---|:---:|:---:|
| 6 | [`app/staff/my-tasks.html`](file:///d:/programs/unair/kwu/TailorHub/app/staff/my-tasks.html) | **Tugas Saya (Staf)**: Menampilkan hanya tugas jahit/potong yang di-assign ke staf yang bersangkutan. Tombol aksi cepat besar: "Mulai Kerjakan" & "Tandai Selesai". | **[M] Must** | ✅ Selesai |
| 7 | [`app/staff/task-detail.html`](file:///d:/programs/unair/kwu/TailorHub/app/staff/task-detail.html) | **Detail Instruksi Tugas**: Rincian potongan pola, foto model pakaian, spesifikasi ukuran kustom, dan catatan desainer. | **[M] Must** | ✅ Selesai |

---

### Bagian C: Portal Mandiri Pelanggan (`portal/`) — 🌐 Area Publik (DILARANG Memakai App Shell)
*Hanya mengimpor 3 file:* `tokens.css` $\rightarrow$ `base.css` $\rightarrow$ `components.css`. **TIDAK mengimpor `app.css`**.

| No | File Path | Nama Halaman & Deskripsi | Prioritas PRD | Status |
|:---:|---|---|:---:|:---:|
| 8 | [`portal/landing.html`](file:///d:/programs/unair/kwu/TailorHub/portal/landing.html) | **Beranda Portal Tenant Publik**: Branding tempat jahit (logo, nama tenant, kontak CS, jam kerja) dan tombol pintas lacak pesanan. | **[M] Must** | ✅ Selesai |
| 9 | [`portal/track.html`](file:///d:/programs/unair/kwu/TailorHub/portal/track.html) | **Formulir Lacak Pesanan (Guest)**: Kolom masukan Kode Unik Pesanan tanpa perlu login (akses via scan QR di nota fisik). | **[M] Must** | ✅ Selesai |
| 10 | [`portal/track-result.html`](file:///d:/programs/unair/kwu/TailorHub/portal/track-result.html) | **Hasil Pelacakan Real-time (Killer Feature)**: Stepper visual tahapan (ikon centang hijau, tahap berjalan clay, sisa abu-abu), estimasi selesai/fitting, status bayar (DP/Lunas), dan tombol bantuan WA. | **[M] Must** | ✅ Selesai |
| 11 | [`portal/customer-login.html`](file:///d:/programs/unair/kwu/TailorHub/portal/customer-login.html) | **Login Akun Pelanggan**: Opsi masuk bagi customer yang ingin melihat arsip pesanan lama. | **[C] Could** | ✅ Selesai |
| 12 | [`portal/customer-register.html`](file:///d:/programs/unair/kwu/TailorHub/portal/customer-register.html) | **Pendaftaran Akun Pelanggan**: Opsi registrasi customer baru. | **[C] Could** | ✅ Selesai |
| 13 | [`portal/customer-account.html`](file:///d:/programs/unair/kwu/TailorHub/portal/customer-account.html) | **Riwayat Pesanan Pelanggan**: Daftar riwayat seluruh pakaian yang pernah dipesan di tempat jahit tersebut. | **[C] Could** | ✅ Selesai |

---

## 🎨 Aturan Desain & Standar Teknis untuk Dev 5

1. **Warna Status Solid 100% Wajib**:
   - `Antrean` $\rightarrow$ `class="chip chip--queue"` (`#7A6155`)
   - `Pemotongan` $\rightarrow$ `class="chip chip--cut"` (`#495ECD`)
   - `Penjahitan` $\rightarrow$ `class="chip chip--sew"` (`#C05424`)
   - `Finishing` $\rightarrow$ `class="chip chip--finish"` (`#9A6209`)
   - `QC` $\rightarrow$ `class="chip chip--qc"` (`#3C4FA6`)
   - `Selesai` $\rightarrow$ `class="chip chip--done"` (`#2F8F5B`)
   - `Diambil` $\rightarrow$ `class="chip chip--taken"` (`#20683F`)
   - `Mendekati Deadline` $\rightarrow$ `class="chip chip--clay"` (`#B06E12`)
   - `Lewat Deadline` $\rightarrow$ `class="chip chip--danger"` (`#C0392B`)
2. **Koneksi dengan Dev 4**:
   - Gunakan kode contoh pesanan yang konsisten: `TLR-2026-0891`, `TLR-2026-0892`.
   - Nama tenant contoh: `Berkah Tailor & Konveksi`.
3. **Pembedaan Layout Portal**:
   - Jangan pernah meletakkan sidebar `.side` pada folder `portal/`. Buat tata letak kartu mandiri yang elegan dan fokus pada keterbacaan di layar smartphone.

---

## 🎯 Urutan Pengerjaan yang Direkomendasikan
1. **Langkah 1 (Core Tracking)**: Bangun `portal/track.html` dan `portal/track-result.html` (membuktikan fungsi pelacakan mandiri).
2. **Langkah 2 (Lantai Kanban)**: Bangun `app/production/board.html` (papan 7 kolom) dan `app/production/list.html`.
3. **Langkah 3 (Interaksi Staf)**: Bangun `app/staff/my-tasks.html` dan `app/production/update-status.html`.
4. **Langkah 4 (Halaman Pendukung)**: Selesaikan `portal/landing.html`, `deadline-alerts.html`, dan halaman akun customer opsional.
