// GET  /api/orders        — daftar pesanan (filter: status, payment, assignee_id, code, q, limit, offset)
// POST /api/orders        — buat pesanan baru (+ opsional pembayaran awal)
import { json, error, readJson, nextOrderCode, recomputePaymentStatus } from "../_utils.js";

export async function onRequestGet({ request, env, data }) {
  const t = data.auth.tenantId;
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const payment = url.searchParams.get("payment");
  const assigneeId = url.searchParams.get("assignee_id");
  const code = url.searchParams.get("code");
  const q = url.searchParams.get("q");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  let sql = `SELECT o.id, o.code, o.type, o.qty, o.detail, o.entry_date, o.deadline, o.price,
                    o.production_status, o.payment_status, o.customer_id, o.assignee_id, o.notes,
                    c.name AS customer, c.phone AS customer_phone, u.name AS assignee,
                    COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.order_id=o.id AND p.tenant_id=o.tenant_id), 0) AS paid_amount
               FROM orders o
               LEFT JOIN customers c ON c.id=o.customer_id
               LEFT JOIN users u ON u.id=o.assignee_id
              WHERE o.tenant_id=?`;
  const args = [t];
  if (status) { sql += " AND o.production_status=?"; args.push(status); }
  if (payment) { sql += " AND o.payment_status=?"; args.push(payment); }
  if (assigneeId) {
    if (assigneeId === "unassigned") {
      sql += " AND o.assignee_id IS NULL";
    } else {
      sql += " AND o.assignee_id=?";
      args.push(assigneeId);
    }
  }
  if (code) { sql += " AND UPPER(o.code)=UPPER(?)"; args.push(code.trim()); }
  if (q) { sql += " AND (o.code LIKE ? OR c.name LIKE ? OR o.type LIKE ?)"; args.push(`%${q}%`, `%${q}%`, `%${q}%`); }
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
  let customerId = b.customer_id ? Number(b.customer_id) : null;
  if (!customerId && b.customer_name) {
    const c = await DB.prepare(
      "INSERT INTO customers (tenant_id, name, phone, address) VALUES (?,?,?,?) RETURNING id"
    ).bind(t, b.customer_name, b.customer_phone || null, b.customer_address || null).first();
    customerId = c.id;
  }

  const code = await nextOrderCode(DB, t);
  const price = Number(b.price) || 0;
  const paymentStatus = b.payment_status || "Belum Bayar";

  const o = await DB.prepare(
    `INSERT INTO orders (tenant_id, code, customer_id, type, qty, detail, entry_date, deadline, price, production_status, payment_status, assignee_id, notes)
     VALUES (?,?,?,?,?,?,?,?,?,'Antrean',?,?,?) RETURNING id`
  ).bind(
    t, code, customerId, b.type, Number(b.qty) || 1, b.detail || null,
    b.entry_date || new Date().toISOString().slice(0, 10), b.deadline || null,
    price, paymentStatus, b.assignee_id ? Number(b.assignee_id) : null, b.notes || null
  ).first();

  await DB.prepare(
    "INSERT INTO order_status_history (tenant_id, order_id, status, note, changed_by) VALUES (?,?,?,?,?)"
  ).bind(t, o.id, "Antrean", "Pesanan dibuat", data.auth.userId || null).run();

  if (b.initial_payment && Number(b.initial_payment) > 0) {
    const payType = Number(b.initial_payment) >= price && price > 0 ? "pelunasan" : "dp";
    await DB.prepare(
      "INSERT INTO payments (tenant_id, order_id, type, amount, method, paid_at) VALUES (?,?,?,?,?, date('now'))"
    ).bind(t, o.id, payType, Number(b.initial_payment), b.payment_method || "transfer").run();
    await recomputePaymentStatus(DB, t, o.id);
  }

  await DB.prepare(
    "INSERT INTO notifications (tenant_id, title, body, type) VALUES (?,?,?, 'info')"
  ).bind(t, "Pesanan baru masuk", `${code} · ${b.type}`).run();

  return json({ id: o.id, code }, 201);
}
