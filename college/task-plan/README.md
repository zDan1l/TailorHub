# Task Plan & Panduan Micro-Commit — Dev 5 (Alan)

Direktori ini berisi pemecahan rencana implementasi (*Implementation Plan*) menjadi **micro-task atomik** yang masing-masing setara dengan **1 micro-commit Git yang bersih, terukur, dan mudah di-review**.

**Peran Anda:** Koordinator Teknis (menentukan task mana yang dieksekusi, meninjau hasil per task, lalu melakukan commit sebelum lanjut ke task berikutnya).  
**Cabang Aktif:** `alan`

---

## 🔄 Alur Kerja Koordinator (Micro-Commit Workflow)

1. **Pilih Task**: Perintahkan agen untuk mengerjakan satu task spesifik (contoh: *"kerjakan task 01"* atau *"lanjut task 03"*).
2. **Tinjau Hasil**: Periksa perubahan file yang dibuat pada task tersebut saja.
3. **Micro-Commit**: Jalankan perintah `git add` & `git commit` yang tertera di bagian bawah masing-masing dokumen task.
4. **Centang Status**: Tandai status task menjadi ✅ Selesai sebelum beralih ke task berikutnya.

---

## 📋 Daftar Micro-Task Fase 1: Modul Produksi (`app/production/*`)

| Urutan | File Task | Judul & Ruang Lingkup | File Terdampak | Dependensi | Status |
|:---:|---|---|---|---|:---:|
| **01** | [`task-01-css-production.md`](production/task-01-css-production.md) | Stylesheet Khusus Produksi & Kanban | `assets/css/production.css` | — | ✅ Selesai |
| **02** | [`task-02-js-kanban.md`](production/task-02-js-kanban.md) | Skrip Interaktif Drag-and-Drop & Filter Kanban | `assets/js/kanban.js` | Task 01 | ✅ Selesai |
| **03** | [`task-03-board.md`](production/task-03-board.md) | Halaman Papan Kanban Produksi 7 Tahap + hapus `.gitkeep` | `app/production/board.html` | Task 01, 02 | ✅ Selesai |
| **04** | [`task-04-list.md`](production/task-04-list.md) | Halaman List View Pesanan Aktif Produksi | `app/production/list.html` | Task 01 | ✅ Selesai |
| **05** | [`task-05-detail.md`](production/task-05-detail.md) | Halaman Detail Produksi & Timeline 7 Tahap | `app/production/detail.html` | Task 01 | ✅ Selesai |
| **06** | [`task-06-update-status.md`](production/task-06-update-status.md) | Halaman Update Status & Preview Notifikasi Customer | `app/production/update-status.html` | Task 01 | ✅ Selesai |
| **07** | [`task-07-deadline-alerts.md`](production/task-07-deadline-alerts.md) | Halaman Pantau Deadline Kritis | `app/production/deadline-alerts.html` | Task 01 | ✅ Selesai |
| **08** | [`task-08-qa-verifikasi.md`](production/task-08-qa-verifikasi.md) | Uji Browser, Responsivitas 390px, Link Lintas Halaman & Update Tracker | `college/catatan-tugas-dev5.md` *(plus perbaikan minor bila ditemukan)* | Task 03–07 | ✅ Selesai |

---

## ✨ Daftar Micro-Task Fase 1B: Polish & Penyelarasan (`app/production/*`)

| Urutan | File Task | Judul & Ruang Lingkup | File Terdampak | Dependensi | Status |
|:---:|---|---|---|---|:---:|
| **09** | [`task-09-polish-css-dan-wa-wrap.md`](production/task-09-polish-css-dan-wa-wrap.md) | Layout `.kc-actions` 3-kolom, `.stage-picker` column-flow & fix overflow `.wa-bubble` | `assets/css/production.css` | — | ✅ Selesai |
| **10** | [`task-10-polish-board-dan-12-item.md`](production/task-10-polish-board-dan-12-item.md) | Navigasi tahap `←`/`→` di `kanban.js` & `board.html` + lengkapi 12 item | `assets/js/kanban.js`, `app/production/board.html` | Task 09 | ✅ Selesai |
| **11** | [`task-11-polish-list-dan-deadline-sync.md`](production/task-11-polish-list-dan-deadline-sync.md) | Selaraskan angka `Pantau Deadline (2)` & lengkapi 12 item di `list.html` | `app/production/list.html` | — | ✅ Selesai |
| **12** | [`task-12-polish-detail-dan-update-status.md`](production/task-12-polish-detail-dan-update-status.md) | Badge aktif dinamis & preview WA di `detail.html`; format `x/7` di `update-status.html` | `app/production/detail.html`, `app/production/update-status.html` | Task 09 | ✅ Selesai |

---

## 📱 Daftar Micro-Task Fase 1C: Perbaikan Responsivitas Mobile 360px (`app/production/*`)

| Urutan | File Task | Judul & Ruang Lingkup | File Terdampak | Dependensi | Status |
|:---:|---|---|---|---|:---:|
| **13** | [`task-13-responsive-topbar-alert-dan-tabs.md`](production/task-13-responsive-topbar-alert-dan-tabs.md) | Fix overflow 360px, padding mobile, alert wrap, tabs & quick-chip 1 baris | `assets/css/production.css` | — | ✅ Selesai |
| **14** | [`task-14-responsive-badge-dan-tombol-mobile.md`](production/task-14-responsive-badge-dan-tombol-mobile.md) | Ringkas `.quick-chip` & `#btnSendWa` agar tetap 1 baris di 360px | `app/production/update-status.html`, `app/production/detail.html` | Task 13 | ✅ Selesai |
| **15** | [`task-15-verifikasi-ulang-360px.md`](production/task-15-verifikasi-ulang-360px.md) | Uji ulang browser 360px & desktop + penutupan Fase 1 | `college/catatan-tugas-dev5.md`, `college/task-plan/README.md` | Task 13, 14 | ✅ Selesai |

> 💬 **Catatan Diskusi & Klarifikasi Desain:** Tanya-jawab teknis modul produksi dicatat di [`production/faq-dan-klarifikasi-desain.md`](production/faq-dan-klarifikasi-desain.md).  
> 📱 **Hasil Audit Responsivitas 360px:** Laporan temuan & rekomendasi perbaikan mobile 360px tersedia di [`production/insight-audit-responsivitas-360px.md`](production/insight-audit-responsivitas-360px.md).

---

## ✂️ Daftar Micro-Task Fase 2: Modul Kerja Staf (`app/staff/*`)

| Urutan | File Task | Judul & Ruang Lingkup | File Terdampak | Dependensi | Status |
|:---:|---|---|---|---|:---:|
| **16** | [`task-16-css-staff.md`](staff/task-16-css-staff.md) | Stylesheet Mobile-First Antarmuka Kerja Staf | `assets/css/staff.css` | — | ✅ Selesai |
| **17** | [`task-17-my-tasks.md`](staff/task-17-my-tasks.md) | Halaman Tugas Saya (Staf) + Switcher Staf + hapus `.gitkeep` | `app/staff/my-tasks.html` | Task 16 | ✅ Selesai |
| **18** | [`task-18-task-detail.md`](staff/task-18-task-detail.md) | Halaman Detail Instruksi Tugas & Aksi Selesai Tahap | `app/staff/task-detail.html` | Task 16, 17 | ✅ Selesai |
| **19** | [`task-19-qa-verifikasi-staff.md`](staff/task-19-qa-verifikasi-staff.md) | Uji Browser Desktop & Mobile 360px/390px + Update Tracker | `college/catatan-tugas-dev5.md`, `college/task-plan/README.md` | Task 16–18 | ✅ Selesai |

> 💬 **Catatan Diskusi & Klarifikasi Desain:** Tanya-jawab teknis modul staf dicatat di [`staff/faq-dan-klarifikasi-desain.md`](staff/faq-dan-klarifikasi-desain.md).

---

## 🌐 Daftar Micro-Task Fase 3: Portal Mandiri Pelanggan (`portal/*`)

| Urutan | File Task | Judul & Ruang Lingkup | File Terdampak | Dependensi | Status |
|:---:|---|---|---|---|:---:|
| **20** | [`task-20-css-dan-js-portal.md`](portal/task-20-css-dan-js-portal.md) | Stylesheet Terisolasi & Skrip Data Bersama Portal | `assets/css/portal.css`, `assets/js/portal.js` | — | ✅ Selesai |
| **21** | [`task-21-track.md`](portal/task-21-track.md) | Halaman Formulir Lacak Pesanan Guest (Tanpa Login) | `portal/track.html` | Task 20 | ✅ Selesai |
| **22** | [`task-22-track-result.md`](portal/task-22-track-result.md) | Halaman Hasil Pelacakan Real-time & Stepper 7 Tahap | `portal/track-result.html` | Task 20, 21 | ✅ Selesai |
| **23** | [`task-23-landing.md`](portal/task-23-landing.md) | Halaman Beranda Portal Tenant Publik + hapus `.gitkeep` | `portal/landing.html`, `portal/.gitkeep` | Task 20–22 | ✅ Selesai |
| **24** | [`task-24-customer-auth.md`](portal/task-24-customer-auth.md) | Halaman Login & Daftar Akun Pelanggan Opsional | `portal/customer-login.html`, `portal/customer-register.html` | Task 20, 21 | ✅ Selesai |
| **25** | [`task-25-customer-account.md`](portal/task-25-customer-account.md) | Halaman Dashboard Riwayat Pesanan Pelanggan | `portal/customer-account.html` | Task 20, 22, 24 | ✅ Selesai |
| **26** | [`task-26-qa-verifikasi-portal.md`](portal/task-26-qa-verifikasi-portal.md) | Uji Browser 360px/390px/1280px, Audit Lintas-Modul & Update Tracker | `college/catatan-tugas-dev5.md`, `college/task-plan/README.md` | Task 20–25 | ✅ Selesai |

> 🔎 **Hasil Analisis Pra-Implementasi Bagian C:** Temuan sinkronisasi dataset (`Jahit Lestari` / `TH-2030`–`TH-2045`), arsitektur non-App-Shell, dan rencana pemecahan tersedia di [`portal/insight-analisis-bagian-c-portal.md`](portal/insight-analisis-bagian-c-portal.md).

---

## 📌 Aturan Konsistensi Lintas Micro-Task
- **Token CSS**: Dilarang menulis warna hex/pixel mentah; wajib memakai `var(--...)` dari `assets/css/tokens.css`.
- **File Bersama yang Dilindungi**: Jangan memodifikasi `assets/css/tokens.css`, `assets/css/base.css`, `assets/css/components.css`, `assets/css/app.css`, maupun `assets/partials/icons.svg` agar tidak terjadi *merge conflict* dengan tim lain.
- **Dataset Bersama**: Gunakan data konsisten dengan `app/dashboard.html` (tenant **Jahit Lestari**, owner **Pak Mardi**, kode `TH-2030` s/d `TH-2045`).
