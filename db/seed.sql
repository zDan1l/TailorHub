-- ============================================================
-- TailorHub — Data Demo (seed)
-- Jalankan setelah schema: npm run db:seed  (atau npm run db:reset)
--
-- AKUN DEMO (tenant "Jahit Lestari", id = 1):
--   Email    : owner@jahitlestari.id   (Pemilik)
--   Password : password123
--   (admin@jahitlestari.id & staff@jahitlestari.id juga password123)
-- ============================================================

-- ---------- Tenant ----------
INSERT INTO tenants (id, name, slug, email, phone, address, plan) VALUES
  (1, 'Jahit Lestari', 'jahit-lestari', 'owner@jahitlestari.id', '0812-1111-2222', 'Jakarta', 'usaha');

-- ---------- Users (hash = password123) ----------
-- format hash: pbkdf2$<iterasi>$<saltHex>$<hashHex>
INSERT INTO users (id, tenant_id, name, email, password_hash, role, status) VALUES
  (1, 1, 'Pak Mardi',   'owner@jahitlestari.id', 'pbkdf2$100000$7461696c6f726875622d73616c74$c26bd566d5944f139d7c2376fa1c64ea11b16dd47b57bf10c86196bf396ae2cb', 'pemilik', 'aktif'),
  (2, 1, 'Ani Suryani', 'admin@jahitlestari.id', 'pbkdf2$100000$7461696c6f726875622d73616c74$c26bd566d5944f139d7c2376fa1c64ea11b16dd47b57bf10c86196bf396ae2cb', 'admin',   'aktif'),
  (3, 1, 'Rudi Nugroho','staff@jahitlestari.id', 'pbkdf2$100000$7461696c6f726875622d73616c74$c26bd566d5944f139d7c2376fa1c64ea11b16dd47b57bf10c86196bf396ae2cb', 'staff',   'aktif');

-- ---------- Customers ----------
INSERT INTO customers (id, tenant_id, name, phone, email, address) VALUES
  (1, 1, 'Budi Santoso',  '0813-0001-0001', 'budi@mail.com',  'Jakarta Selatan'),
  (2, 1, 'Citra Dewi',    '0813-0002-0002', 'citra@mail.com', 'Depok'),
  (3, 1, 'PT Maju Jaya',  '021-5550-0003',  'po@majujaya.co.id', 'Jakarta Pusat'),
  (4, 1, 'Nurul Laila',   '0813-0004-0004', 'nurul@mail.com', 'Bekasi'),
  (5, 1, 'Hendra Wijaya', '0813-0005-0005', 'hendra@mail.com','Tangerang'),
  (6, 1, 'Sari Wulandari','0813-0006-0006', 'sari@mail.com',  'Bogor'),
  (7, 1, 'Rudi Darmawan', '0813-0007-0007', 'rudid@mail.com', 'Jakarta Timur');

-- ---------- Orders ----------
INSERT INTO orders (id, tenant_id, code, customer_id, type, qty, detail, entry_date, deadline, price, production_status, payment_status, assignee_id) VALUES
  (1, 1, 'TH-2030', 5, 'Kemeja',        2, 'Kemeja lengan panjang', '2026-11-14', '2026-11-20', 300000,  'Selesai',    'Lunas',       3),
  (2, 1, 'TH-2033', 5, 'Jas',           1, 'Jas formal navy',       '2026-11-15', '2026-11-21', 1500000, 'Penjahitan', 'DP',          3),
  (3, 1, 'TH-2035', 2, 'Jas Almamater', 1, 'Almamater kampus',      '2026-11-17', '2026-11-26', 950000,  'Finishing',  'Lunas',       2),
  (4, 1, 'TH-2037', 6, 'Kemeja',        6, 'Kemeja batik seragam',  '2026-11-18', '2026-11-29', 1800000, 'Pemotongan', 'DP',          2),
  (5, 1, 'TH-2038', 4, 'Gamis',         1, 'Gamis pesta',           '2026-11-18', '2026-11-30', 850000,  'Penjahitan', 'DP',          3),
  (6, 1, 'TH-2040', 2, 'Jas',           1, 'Jas formal',            '2026-11-16', '2026-11-24', 1200000, 'QC',         'Lunas',       2),
  (7, 1, 'TH-2041', 1, 'Kemeja',        3, 'Kemeja formal putih',   '2026-11-19', '2026-11-24', 450000,  'Penjahitan', 'DP',          3),
  (8, 1, 'TH-2044', 7, 'Celana',        2, 'Celana bahan',          '2026-11-20', '2026-11-28', 400000,  'Antrean',    'DP',          NULL),
  (9, 1, 'TH-2045', 3, 'Seragam',       20,'Seragam kantor',        '2026-11-21', '2026-12-02', 8000000, 'Antrean',    'Belum Bayar', NULL);

-- ---------- Payments ----------
INSERT INTO payments (tenant_id, order_id, type, amount, method, paid_at) VALUES
  (1, 1, 'pelunasan', 300000,  'tunai',    '2026-11-14'),
  (1, 3, 'pelunasan', 950000,  'transfer', '2026-11-17'),
  (1, 6, 'pelunasan', 1200000, 'transfer', '2026-11-16'),
  (1, 2, 'dp',        500000,  'transfer', '2026-11-15'),
  (1, 4, 'dp',        600000,  'tunai',    '2026-11-18'),
  (1, 5, 'dp',        300000,  'qris',     '2026-11-18'),
  (1, 7, 'dp',        150000,  'tunai',    '2026-11-19'),
  (1, 8, 'dp',        150000,  'tunai',    '2026-11-20');

-- ---------- Riwayat status (contoh timeline TH-2041) ----------
INSERT INTO order_status_history (tenant_id, order_id, status, note, changed_by, created_at) VALUES
  (1, 7, 'Antrean',    'Pesanan masuk',        2, '2026-11-19 09:10:00'),
  (1, 7, 'Pemotongan', 'Mulai dipotong',       3, '2026-11-20 10:00:00'),
  (1, 7, 'Penjahitan', 'Dijahit oleh Rudi',    3, '2026-11-21 13:30:00'),
  (1, 6, 'QC',         'Masuk pemeriksaan',    2, '2026-11-22 15:00:00'),
  (1, 1, 'Selesai',    'Lolos QC, siap ambil', 3, '2026-11-19 16:00:00');

-- ---------- Notifikasi (3 belum dibaca) ----------
INSERT INTO notifications (tenant_id, title, body, type, is_read) VALUES
  (1, 'Pesanan baru masuk', 'TH-2045 · Seragam ×20 dari PT Maju Jaya', 'info',    0),
  (1, 'Mendekati deadline', 'TH-2041 jatuh tempo besok',               'warn',    0),
  (1, 'TH-2030 lolos QC',   'Customer sudah dikabari otomatis',        'success', 0),
  (1, 'Pembayaran diterima','Pelunasan TH-2040 sebesar Rp1.200.000',   'success', 1);
