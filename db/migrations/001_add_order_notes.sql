-- Migrasi aman untuk produksi Cloudflare D1: menambah tabel order_notes
-- tanpa menghapus tabel/data yang sudah ada.
-- Jalankan: npx wrangler d1 execute tailorhub --remote --file=./db/migrations/001_add_order_notes.sql

CREATE TABLE IF NOT EXISTS order_notes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id   INTEGER NOT NULL REFERENCES tenants(id),
  order_id    INTEGER NOT NULL REFERENCES orders(id),
  user_id     INTEGER REFERENCES users(id),
  body        TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notes_order ON order_notes(tenant_id, order_id);
