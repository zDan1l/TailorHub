# TailorHub — Struktur Folder Proyek

Struktur ini menata **seluruh halaman HTML** (67 halaman, lihat `list-page.md`) agar rapi saat dikerjakan 6 orang.
Prinsip: **aset gaya dipusatkan** (token + komponen + partial bersama), **halaman dikelompokkan per modul** sesuai pembagian tim.

> Folder sudah dibuat. **File `.html`/`.css` di dalamnya BELUM dibuat** — itu tugas tiap pengembang.
> `.gitkeep` hanya penanda agar folder kosong tetap masuk Git; hapus saat file pertama ditambahkan.

```
tailorhub/
│
├── index.html                      # Landing (SUDAH ADA) ...................... Dev 1
├── style-guide.html                # Style guide & pustaka komponen (SUDAH ADA)
├── PRD.md · list-page.md · structure-folder.md
│
├── pricing.html                    # Dev 1 (publik)
├── features.html                   # Dev 1
├── about.html                      # Dev 1
├── contact.html                    # Dev 1
├── help-center.html                # Dev 1
├── terms.html                      # Dev 1
├── privacy.html                    # Dev 1
├── 404.html                        # Dev 1 (sistem)
├── maintenance.html                # Dev 1 (sistem)
│
├── assets/                         # SEMUA aset bersama (lintas halaman)
│   ├── css/
│   │   ├── tokens.css              # Variabel :root (salin dari style-guide.html) — SUMBER WARNA/UKURAN
│   │   ├── base.css                # Reset, body, heading, tipografi dasar
│   │   ├── components.css          # Semua kelas komponen (.btn .card .table .chip .field …)
│   │   └── app.css                 # Khusus App Shell (sidebar, topbar, layout internal)
│   ├── js/
│   │   ├── main.js                 # Interaksi umum (dropdown, toast, toggle sidebar, modal)
│   │   ├── kanban.js               # Drag & drop papan produksi
│   │   └── charts.js               # Render chart dashboard & laporan
│   ├── partials/                   # Potongan HTML bersama (disisipkan tiap halaman)
│   │   ├── icons.svg               # Set <symbol> ikon (salin dari style-guide.html)
│   │   ├── sidebar.html            # Sidebar App Shell
│   │   ├── topbar.html             # Topbar App Shell (search + notif + avatar)
│   │   └── footer.html             # Footer publik
│   └── img/
│       ├── logo/                   # Logo TailorHub & placeholder logo tenant
│       └── illustrations/          # Ilustrasi empty state, onboarding, 404, dll
│
├── auth/                           # BAGIAN 2 — Dev 2 (publik, autentikasi)
│   ├── register.html
│   ├── login.html
│   ├── verify-email.html
│   ├── forgot-password.html
│   ├── reset-password.html
│   ├── accept-invitation.html
│   └── onboarding.html             # wizard setup tenant
│
├── account/                        # BAGIAN 2 — Dev 2 (akun pribadi, 🔒)
│   ├── profile.html
│   ├── change-password.html
│   └── preferences.html
│
├── portal/                         # BAGIAN 5 — Dev 5 (portal customer PUBLIK, tanpa App Shell)
│   ├── landing.html
│   ├── track.html
│   ├── track-result.html
│   ├── customer-login.html
│   ├── customer-register.html
│   └── customer-account.html
│
└── app/                            # SEMUA halaman internal (pakai App Shell 🔒)
    │
    ├── dashboard.html              # BAGIAN 3 — Dev 3
    ├── search.html                 # BAGIAN 3 — Dev 3 (hasil pencarian global)
    │
    ├── reports/                    # BAGIAN 3 — Dev 3
    │   ├── index.html
    │   ├── orders.html
    │   ├── income.html
    │   ├── customers.html
    │   ├── productivity.html
    │   └── export.html
    │
    ├── notifications/              # BAGIAN 3 — Dev 3
    │   ├── index.html
    │   └── settings.html
    │
    ├── orders/                     # BAGIAN 4 — Dev 4
    │   ├── index.html
    │   ├── create.html
    │   ├── edit.html
    │   ├── detail.html
    │   ├── search.html
    │   ├── print.html
    │   ├── delete-modal.html       # (partial) konfirmasi hapus
    │   └── bulk-update.html
    │
    ├── customers/                  # BAGIAN 4 — Dev 4 (internal)
    │   ├── index.html
    │   ├── detail.html
    │   └── form.html               # (bisa modal) tambah/edit customer
    │
    ├── production/                 # BAGIAN 5 — Dev 5
    │   ├── board.html              # Kanban
    │   ├── list.html
    │   ├── detail.html
    │   ├── update-status.html      # (bisa modal)
    │   └── deadline-alerts.html
    │
    ├── staff/                      # BAGIAN 5 — Dev 5 (sisi staff)
    │   ├── my-tasks.html
    │   └── task-detail.html
    │
    ├── payments/                   # BAGIAN 6 — Dev 6
    │   ├── index.html
    │   ├── record.html             # (bisa modal)
    │   ├── invoice.html
    │   ├── receipt.html
    │   └── detail.html
    │
    ├── team/                       # BAGIAN 6 — Dev 6
    │   ├── index.html
    │   ├── member-detail.html
    │   └── activity-log.html
    │
    └── settings/                   # BAGIAN 6 — Dev 6
        ├── tenant.html             # profil + branding + subdomain/QR
        ├── billing.html            # langganan + metode bayar
        ├── notifications.html      # integrasi WhatsApp/email
        ├── order-preferences.html  # format kode & tahap produksi
        └── security.html
```

---

## Peta Folder → Pengembang

| Folder / File | Pengembang | Bagian |
|---------------|-----------|--------|
| `index.html`, `pricing/features/about/contact/help-center/terms/privacy`, `404`, `maintenance` | Dev 1 | Publik & Sistem |
| `auth/`, `account/` | Dev 2 | Autentikasi & Akun |
| `app/dashboard.html`, `app/search.html`, `app/reports/`, `app/notifications/` | Dev 3 | Dashboard & Laporan |
| `app/orders/`, `app/customers/` | Dev 4 (Zelvia) | Pesanan & Customer |
| `app/production/`, `app/staff/`, `portal/` | Dev 5 | Produksi & Portal |
| `app/payments/`, `app/team/`, `app/settings/` | Dev 6 | Keuangan & Administrasi |
| `assets/` | **Bersama** (Dev 3 inisiasi) | Aset & partial |

---

## Aturan Impor CSS (tiap halaman HTML)

Urutan impor di `<head>` — **selalu sama**:

```html
<link rel="stylesheet" href="/assets/css/tokens.css">      <!-- 1. variabel -->
<link rel="stylesheet" href="/assets/css/base.css">        <!-- 2. dasar -->
<link rel="stylesheet" href="/assets/css/components.css">  <!-- 3. komponen -->
<link rel="stylesheet" href="/assets/css/app.css">         <!-- 4. HANYA halaman di app/ -->
```

> Halaman publik (`auth/`, `account/` memakai shell? lihat catatan), `portal/`, dan root publik **tidak** mengimpor `app.css`.
> `account/*` memakai App Shell (🔒) → impor `app.css`. `auth/*` & `portal/*` tidak.
> Sesuaikan path (`/assets/...` absolut vs `../assets/...` relatif) dengan kedalaman folder.

## Catatan
- `assets/css/tokens.css` & `assets/partials/icons.svg` **disalin langsung** dari `style-guide.html` — jangan ubah nilainya tanpa kesepakatan tim.
- Buat file hanya saat dikerjakan; jangan buat file kosong lebih dulu agar Git bersih.
- **Dev 3** membuat `assets/` + partial App Shell (sidebar/topbar) lebih dulu karena dibutuhkan bagian lain.
- Halaman bertanda *(partial)* / *(bisa modal)* boleh berupa potongan yang disisipkan, bukan dokumen HTML penuh.
