// GET  /api/orders        — daftar pesanan (filter: status, payment, q, limit, offset)
// POST /api/orders        — buat pesanan baru
import { json, error, readJson, nextOrderCode, PRODUCTION_STATUSES } from "../_utils.js";

export async function onRequestGet({ request, env, data }) {
  const t = data.auth.tenantId;
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const payment = url.searchParams.get("payment");
  const q = url.searchParams.get("q");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  let sql = `SELECT o.id, o.code, o.type, o.qty, o.detail, o.entry_date, o.deadline, o.price,
                    o.production_status, o.payment_status, o.customer_id, c.name AS customer
               FROM orders o LEFT JOIN customers c ON c.id=o.customer_id
              WHERE o.tenant_id=?`;
  const args = [t];
  if (status) { sql += " AND o.production_status=?"; args.push(status); }
  if (payment) { sql += " AND o.payment_status=?"; args.push(payment); }
  if (q) { sql += " AND (o.code LIKE ? OR c.name LIKE ?)"; args.push(`%${q}%`, `%${q}%`); }
  sql += " ORDER BY o.id DESC LIMIT ? OFFSET ?";
  args.push(limit, offset);

  const rows = await env.DB.prepare(sql).bind(...args).all();
  const total = await env.DB.prepare("SELECT COUNT(*) AS n FROM orders WHERE tenant_id=?").bind(t).first();
  return json({ data: rows.results, total: total.n });
}

export async function onRequestPost({ request, env, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  if (!b.type) return error("Jenis pesanan wajib diisi.");

  const DB = env.DB;

  // customer: pakai id yang ada, atau buat baru dari nama
  let customerId = b.customer_id || null;
  if (!customerId && b.customer_name) {
    const c = await DB.prepare(
      "INSERT INTO customers (tenant_id, name, phone) VALUES (?,?,?) RETURNING id"
    ).bind(t, b.customer_name, b.customer_phone || null).first();
    customerId = c.id;
  }

  const code = await nextOrderCode(DB, t);
  const paymentStatus = b.payment_status || "Belum Bayar";

  const o = await DB.prepare(
    `INSERT INTO orders (tenant_id, code, customer_id, type, qty, detail, entry_date, deadline, price, production_status, payment_status, notes)
     VALUES (?,?,?,?,?,?,?,?,?,'Antrean',?,?) RETURNING id`
  ).bind(
    t, code, customerId, b.type, b.qty || 1, b.detail || null,
    b.entry_date || null, b.deadline || null, b.price || 0, paymentStatus, b.notes || null
  ).first();

  await DB.prepare(
    "INSERT INTO order_status_history (tenant_id, order_id, status, note, changed_by) VALUES (?,?,?,?,?)"
  ).bind(t, o.id, "Antrean", "Pesanan dibuat", data.auth.userId || null).run();

  await DB.prepare(
    "INSERT INTO notifications (tenant_id, title, body, type) VALUES (?,?,?, 'info')"
  ).bind(t, "Pesanan baru masuk", `${code} · ${b.type}`).run();

  return json({ id: o.id, code }, 201);
}
