# TailorHub — Panduan Implementasi Cloudflare (Pages + Functions + D1)

Panduan untuk membuat halaman **menampilkan & menyimpan data asli** dari database.
Backend sudah di-scaffold; dokumen ini menjelaskan **cara memakainya** dan **tugas tiap dev** saat implementasi.

> **Arsitektur:** frontend HTML statis tetap seperti sekarang. Data diambil/disimpan lewat
> `fetch()` ke **Cloudflare Pages Functions** (folder `functions/`) yang terhubung ke **D1** (SQLite).
> Tidak perlu React/Vite — cukup vanilla JS + helper `assets/js/api.js`.

```
Browser (HTML + JS)  ──fetch('/api/...')──►  Pages Functions  ──SQL──►  D1 Database
      ▲                                                                     │
      └──────────────── JSON (data asli) ◄─────────────────────────────────┘
```

---

## 1. Prasyarat (sekali saja per komputer)

- **Node.js 18+** (cek: `node -v`)
- Akun **Cloudflare** gratis — https://dash.cloudflare.com/sign-up
- Terminal di folder proyek `tailorhub/`

---

## 2. Setup Pertama Kali

```bash
# 1) Install dependency (wrangler)
npm install

# 2) Login ke Cloudflare (buka browser)
npx wrangler login

# 3) Buat database D1
npm run db:create
#    -> output memberi "database_id". SALIN id itu.
#    -> buka wrangler.toml, ganti  database_id = "GANTI_DENGAN_DATABASE_ID_ANDA"

# 4) Siapkan variabel dev lokal
#    Windows (PowerShell):  Copy-Item .dev.vars.example .dev.vars
#    Mac/Linux:             cp .dev.vars.example .dev.vars

# 5) Buat tabel + isi data demo (DATABASE LOKAL)
npm run db:reset

# 6) Jalankan server lokal (frontend + API + D1)
npm run dev
#    -> buka http://localhost:8788
#    -> cek API: http://localhost:8788/api/health
```

Jika `/api/health` menjawab `{"ok":true,"db":"ok (1 tenant)"}` → **setup berhasil.**

### Akun demo (sudah ada di seed)
| Field | Nilai |
|-------|-------|
| Email | `owner@jahitlestari.id` |
| Password | `password123` |
| (juga) | `admin@jahitlestari.id`, `staff@jahitlestari.id` — password sama |

---

## 3. Perintah Harian (npm scripts)

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan frontend + API + D1 lokal di `:8788` |
| `npm run db:reset` | Reset DB lokal (schema + seed ulang) — **sering dipakai saat dev** |
| `npm run db:init` | Jalankan ulang hanya schema (lokal) |
| `npm run db:seed` | Isi ulang hanya data demo (lokal) |
| `npm run db:console "SELECT * FROM orders"` | Query cepat ke DB lokal |
| `npm run deploy` | Deploy ke Cloudflare Pages (produksi) |
| `npm run db:init:remote` / `db:seed:remote` | Setup DB **produksi** (sekali di awal) |

> **Lokal vs remote:** `--local` memakai SQLite di folder `.wrangler/` (hanya di komputer Anda).
> `--remote` mengubah database asli di Cloudflare. Saat ngoding, pakai **lokal**.

---

## 4. Struktur Backend

```
tailorhub/
├── wrangler.toml            # konfigurasi Pages + binding D1
├── package.json             # script npm
├── .dev.vars                # variabel lokal (DEV_TENANT_ID) — TIDAK di-commit
├── db/
│   ├── schema.sql           # definisi tabel
│   └── seed.sql             # data demo
├── assets/js/api.js         # helper fetch untuk frontend (window.TH)
└── functions/api/           # SEMUA endpoint API (Pages Functions)
    ├── _middleware.js       # CORS + auth + binding DB (jalan untuk semua /api/*)
    ├── _utils.js            # helper bersama (json, hash, status, dll)
    ├── health.js            # GET /api/health
    ├── dashboard.js         # GET /api/dashboard
    ├── auth/                # register, login, logout, me
    ├── orders/              # index.js (list/create) + [id].js (detail/update/delete)
    ├── customers/           # index.js + [id].js
    ├── payments/            # index.js
    ├── notifications/       # index.js
    └── public/track.js      # GET /api/public/track (portal, tanpa login)
```

**Aturan Pages Functions:** nama file = rute. `functions/api/orders/index.js` → `/api/orders`.
`[id].js` → parameter dinamis `/api/orders/123` (`context.params.id`). Handler: `onRequestGet`,
`onRequestPost`, `onRequestPut`, `onRequestPatch`, `onRequestDelete`.

---

## 5. Cara Kerja Auth & Tenant (WAJIB dipahami)

- Setiap request API diproses `functions/api/_middleware.js` lebih dulu.
- Ia membaca token sesi (header `Authorization: Bearer <token>`), lalu menetapkan
  **tenant & user** ke `context.data.auth = { tenantId, userId, role, name }`.
- **Setiap query WAJIB difilter `tenant_id`** (sudah dilakukan di endpoint contoh) — ini yang
  menjaga isolasi data antar usaha (multi-tenant).
- **Mode DEV:** selama `DEV_TENANT_ID=1` ada di `.dev.vars`, semua request dianggap milik
  tenant 1 **tanpa login**. Ini supaya dev bisa menyambungkan halaman `app/` ke data asli
  **sebelum** halaman login (Dev 2) selesai. **Hapus/kosongkan di produksi.**

Alur login sebenarnya: halaman login → `TH.login(email, password)` → token disimpan di
`localStorage` → request berikutnya otomatis membawa token.

---

## 6. Referensi API

> Base URL saat dev: `http://localhost:8788`. Semua balasan JSON.

### Publik (tanpa login)
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/health` | Cek status |
| POST | `/api/auth/register` | Daftar tenant+pemilik. Body: `{usaha,nama,email,password}` → `{token,user,tenant}` |
| POST | `/api/auth/login` | Login. Body: `{email,password}` → `{token,user,tenant}` |
| GET | `/api/public/track?slug=&code=` | Lacak pesanan (portal customer) |

### Perlu login (atau DEV_TENANT_ID)
| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/auth/me` | Info user+tenant aktif |
| POST | `/api/auth/logout` | Keluar |
| GET | `/api/dashboard` | KPI + pesanan terbaru + alert deadline |
| GET | `/api/orders?status=&payment=&q=&limit=&offset=` | Daftar pesanan |
| POST | `/api/orders` | Buat pesanan. Body: `{type,qty,price,deadline,customer_id\|customer_name,...}` |
| GET | `/api/orders/:id` | Detail + riwayat + pembayaran |
| PUT | `/api/orders/:id` | Ubah data / status produksi (`{production_status,note}`) |
| DELETE | `/api/orders/:id` | Hapus pesanan |
| GET | `/api/customers?q=` | Daftar customer (+jumlah pesanan) |
| POST | `/api/customers` | Tambah customer `{name,phone,...}` |
| GET | `/api/customers/:id` | Profil + riwayat pesanan |
| PUT / DELETE | `/api/customers/:id` | Ubah / hapus |
| GET | `/api/payments?order_id=` | Daftar pembayaran |
| POST | `/api/payments` | Catat bayar `{order_id,amount,type,method}` (status bayar dihitung ulang otomatis) |
| GET | `/api/notifications?unread=1` | Daftar notifikasi |
| PATCH | `/api/notifications` | Tandai dibaca `{all:true}` atau `{ids:[...]}` |

**Coba cepat dari terminal:**
```bash
curl http://localhost:8788/api/dashboard
curl "http://localhost:8788/api/orders?status=Penjahitan"
curl -X POST http://localhost:8788/api/payments -H "Content-Type: application/json" -d "{\"order_id\":9,\"amount\":4000000,\"type\":\"dp\"}"
```

---

## 7. Pola Menyambungkan Halaman ke Data (INTI implementasi)

### Langkah umum di setiap halaman `app/…`:
1. Muat helper di `<head>` atau sebelum skrip halaman:
   ```html
   <script src="/assets/js/api.js"></script>
   ```
   > Halaman di dalam subfolder (mis. `app/orders/index.html`) **harus pakai path absolut**
   > `/assets/js/api.js` dan `/api/...` (bukan relatif), agar benar di semua kedalaman folder.
2. (Halaman internal) pasang penjaga login di awal:
   ```html
   <script>TH.requireAuth("/auth/login.html");</script>
   ```
   > Saat masih memakai `DEV_TENANT_ID`, baris ini boleh dikomentari dulu.
3. Ambil data lalu render ke DOM.

### Contoh LENGKAP — menghidupkan `app/dashboard.html`
Ganti angka statis dengan data dari `/api/dashboard`. Tambahkan sebelum `</body>`:

```html
<script src="/assets/js/api.js"></script>
<script>
(async function () {
  try {
    const d = await TH.get("/api/dashboard");

    // 1) KPI — beri id pada elemen <b> KPI di HTML, lalu:
    document.querySelector("#kpiAktif").textContent    = d.kpi.pesananAktif;
    document.querySelector("#kpiSelesai").textContent  = d.kpi.selesaiBulanIni;
    document.querySelector("#kpiPemasukan").textContent= TH.rupiah(d.kpi.pemasukanBulanIni);
    document.querySelector("#kpiDeadline").textContent = d.kpi.mendekatiDeadline;

    // 2) Tabel pesanan terbaru — isi <tbody id="recentBody">
    document.querySelector("#recentBody").innerHTML = d.recentOrders.map(function (o) {
      return (
        "<tr>" +
          "<td><b>" + TH.esc(o.code) + "</b></td>" +
          "<td>" + TH.esc(o.customer || "-") + "</td>" +
          "<td>" + TH.esc(o.type) + " ×" + o.qty + "</td>" +
          "<td><span class='chip " + TH.statusChip(o.production_status) + "'>" + TH.esc(o.production_status) + "</span></td>" +
          "<td><span class='chip " + TH.statusChip(o.payment_status) + "'>" + TH.esc(o.payment_status) + "</span></td>" +
          "<td class='num'>" + TH.rupiah(o.price) + "</td>" +
          "<td>" + TH.esc(o.deadline || "—") + "</td>" +
        "</tr>"
      );
    }).join("");
  } catch (e) {
    console.error(e);
    alert("Gagal memuat dashboard: " + e.message);
  }
})();
</script>
```
> Jadi tugasnya: beri `id` pada elemen yang perlu diisi (`#kpiAktif`, `#recentBody`, dst.),
> lalu biarkan skrip mengisinya. Kelas chip memakai `TH.statusChip()` → otomatis solid & sesuai Peta Status.

### Contoh — menyimpan data (form Tambah Pesanan, `app/orders/create.html`)
```html
<script src="/assets/js/api.js"></script>
<script>
document.querySelector("#formOrder").addEventListener("submit", async function (e) {
  e.preventDefault();
  const f = e.target;
  try {
    const res = await TH.post("/api/orders", {
      customer_name: f.customer.value,
      type: f.type.value,
      qty: Number(f.qty.value),
      price: Number(f.price.value),
      deadline: f.deadline.value,     // format YYYY-MM-DD
      detail: f.detail.value,
    });
    location.href = "/app/orders/detail.html?id=" + res.id;   // ke detail pesanan baru
  } catch (err) {
    alert("Gagal menyimpan: " + err.message);
  }
});
</script>
```

### Contoh — membaca `:id` dari URL (halaman detail)
```js
const id = new URLSearchParams(location.search).get("id");
const d = await TH.get("/api/orders/" + id);   // d.order, d.history, d.payments, d.paid, d.sisa
```

### Contoh — login (`auth/login.html`, punya Dev 2)
```js
await TH.login(email, password);      // token tersimpan otomatis
location.href = "/app/dashboard.html";
```

### Contoh — portal publik (`portal/track.html`, tanpa login)
```js
const d = await TH.get("/api/public/track?slug=jahit-lestari&code=" + kode);
// d.usaha, d.pesanan.statusProduksi, d.riwayat[...]
```

---

## 8. Pembagian Tugas Implementasi (per dev)

Backend untuk area inti sudah ada. Tugas = **menyambungkan halaman ke endpoint** + membuat
endpoint tambahan bila perlu (ikuti pola file yang sudah ada).

| Dev | Halaman disambungkan | Endpoint dipakai | Endpoint baru yang mungkin dibuat |
|-----|----------------------|------------------|-----------------------------------|
| **Dev 2** | `auth/login`, `auth/register`, `auth/onboarding`, `account/*` | `/api/auth/*` | update profil (`PUT /api/account`) |
| **Dev 3** | `app/dashboard`, `app/notifications/*`, `app/reports/*` | `/api/dashboard`, `/api/notifications`, `/api/orders`, `/api/payments` | `/api/reports/income`, `/api/reports/orders` |
| **Dev 4** | `app/orders/*`, `app/customers/*` | `/api/orders*`, `/api/customers*` | — (CRUD sudah lengkap) |
| **Dev 5** | `app/production/*`, `app/staff/*`, `portal/*` | `GET/PUT /api/orders`, `/api/public/track` | filter `?status=` untuk kolom kanban |
| **Dev 6** | `app/payments/*`, `app/team/*`, `app/settings/*` | `/api/payments`, (buat) `/api/team`, `/api/settings` | `/api/team` (users CRUD), `/api/settings/tenant` |

**Membuat endpoint baru** = buat file di `functions/api/...` meniru yang ada. Selalu:
`const t = data.auth.tenantId;` lalu filter `WHERE tenant_id=?`.

---

## 9. Deploy ke Produksi

```bash
# 1) Setup database produksi (sekali)
npm run db:init:remote
npm run db:seed:remote        # opsional: isi data demo di produksi

# 2) Deploy
npm run deploy
#    -> Cloudflare memberi URL: https://tailorhub-xxx.pages.dev
```
Di **Cloudflare dashboard → Pages → project → Settings → Functions → D1 bindings**, pastikan
binding `DB` terhubung ke database `tailorhub`. **Jangan** set `DEV_TENANT_ID` di produksi.

> Alternatif: hubungkan repo GitHub ke Cloudflare Pages agar auto-deploy tiap push. Build
> command dikosongkan (situs statis), output directory `.`, lalu tamb«kan binding D1 di dashboard.

---

## 10. Keamanan & Catatan

- **Isolasi tenant:** tiap query difilter `tenant_id`. Jangan pernah query tanpa filter ini.
- **Password:** di-hash PBKDF2-SHA256 (lihat `_utils.js`). Jangan simpan password polos.
- **`DEV_TENANT_ID`** hanya untuk lokal. Di produksi, akses butuh login nyata.
- **Input:** validasi di endpoint; untuk render ke HTML gunakan `TH.esc()` agar aman dari XSS.
- **Rupiah** disimpan sebagai bilangan bulat (tanpa desimal/titik).

---

## 11. Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `/api/health` → `db: error: no such table` | Belum migrasi. Jalankan `npm run db:reset`. |
| `Binding D1 'DB' tidak ditemukan` | `database_id` di `wrangler.toml` masih placeholder, atau belum `db:create`. |
| `401 Tidak terotorisasi` saat dev | Pastikan `.dev.vars` berisi `DEV_TENANT_ID=1`, lalu restart `npm run dev`. |
| Ikon/CSS tidak muncul di halaman `app/` | Pakai path **absolut** `/assets/...`, bukan relatif. |
| Perubahan `functions/` tidak berefek | `wrangler pages dev` auto-reload; jika macet, hentikan (Ctrl+C) & `npm run dev` lagi. |
| Data demo hilang | `npm run db:seed` (lokal) untuk mengisi ulang. |
| Perubahan skema | Edit `db/schema.sql` lalu `npm run db:reset` (lokal). Untuk produksi: `db:init:remote`. |

---

**Ringkas:** `npm install` → `wrangler login` → `npm run db:create` (salin id ke wrangler.toml)
→ `npm run db:reset` → `npm run dev`. Lalu di tiap halaman: muat `/assets/js/api.js`, panggil
`TH.get/post/...`, render ke DOM. Semua data nyata dari D1. Selamat implementasi!
