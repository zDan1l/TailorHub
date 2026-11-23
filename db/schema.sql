-- ============================================================
-- TailorHub — Skema Database D1 (SQLite)
-- Multi-tenant: setiap baris bermuatan tenant_id untuk isolasi data.
-- Jalankan: npm run db:init   (atau npm run db:reset untuk schema + seed)
-- ============================================================
PRAGMA foreign_keys = ON;

-- Hapus (urutan aman terhadap foreign key) agar bisa di-reset berulang.
DROP TABLE IF EXISTS order_status_history;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tenants;

-- ---------- Tenant (usaha) ----------
CREATE TABLE tenants (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,          -- untuk portal: slug.tailorhub.id
  email       TEXT,
  phone       TEXT,
  address     TEXT,
  logo_url    TEXT,
  plan        TEXT NOT NULL DEFAULT 'perorangan', -- perorangan | usaha | konveksi
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------- Pengguna (Pemilik/Admin/Staff) ----------
CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id     INTEGER NOT NULL REFERENCES tenants(id),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'staff', -- pemilik | admin | staff
  status        TEXT NOT NULL DEFAULT 'aktif', -- aktif | nonaktif | diundang
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (tenant_id, email)
);

-- ---------- Sesi login (token) ----------
CREATE TABLE sessions (
  token       TEXT PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  tenant_id   INTEGER NOT NULL REFERENCES tenants(id),
  expires_at  TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------- Customer ----------
CREATE TABLE customers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id   INTEGER NOT NULL REFERENCES tenants(id),
  name        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  address     TEXT,
  notes       TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------- Pesanan ----------
CREATE TABLE orders (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id         INTEGER NOT NULL REFERENCES tenants(id),
  code              TEXT NOT NULL,            -- mis. TH-2041
  customer_id       INTEGER REFERENCES customers(id),
  type              TEXT,                      -- Kemeja, Jas, Seragam, Permak, ...
  qty               INTEGER NOT NULL DEFAULT 1,
  detail            TEXT,
  entry_date        TEXT,                      -- YYYY-MM-DD
  deadline          TEXT,                      -- YYYY-MM-DD
  price             INTEGER NOT NULL DEFAULT 0, -- total harga (rupiah, bilangan bulat)
  production_status TEXT NOT NULL DEFAULT 'Antrean',     -- Antrean|Pemotongan|Penjahitan|Finishing|QC|Selesai|Diambil
  payment_status    TEXT NOT NULL DEFAULT 'Belum Bayar', -- Belum Bayar|DP|Lunas
  assignee_id       INTEGER REFERENCES users(id),
  notes             TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (tenant_id, code)
);

-- ---------- Riwayat perubahan status produksi ----------
CREATE TABLE order_status_history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id   INTEGER NOT NULL REFERENCES tenants(id),
  order_id    INTEGER NOT NULL REFERENCES orders(id),
  status      TEXT NOT NULL,
  note        TEXT,
  changed_by  INTEGER REFERENCES users(id),
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------- Pembayaran ----------
CREATE TABLE payments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id   INTEGER NOT NULL REFERENCES tenants(id),
  order_id    INTEGER NOT NULL REFERENCES orders(id),
  type        TEXT NOT NULL DEFAULT 'dp',  -- dp | pelunasan
  amount      INTEGER NOT NULL DEFAULT 0,
  method      TEXT,                         -- tunai | transfer | qris
  paid_at     TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------- Notifikasi in-app ----------
CREATE TABLE notifications (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id   INTEGER NOT NULL REFERENCES tenants(id),
  title       TEXT NOT NULL,
  body        TEXT,
  type        TEXT DEFAULT 'info',          -- info | success | warn | error
  is_read     INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---------- Index (percepat query per tenant) ----------
CREATE INDEX idx_users_tenant      ON users(tenant_id);
CREATE INDEX idx_customers_tenant  ON customers(tenant_id);
CREATE INDEX idx_orders_tenant     ON orders(tenant_id);
CREATE INDEX idx_orders_status     ON orders(tenant_id, production_status);
CREATE INDEX idx_orders_payment    ON orders(tenant_id, payment_status);
CREATE INDEX idx_history_order      ON order_status_history(order_id);
CREATE INDEX idx_payments_order     ON payments(order_id);
CREATE INDEX idx_notif_tenant       ON notifications(tenant_id, is_read);
