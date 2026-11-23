// GET  /api/payments        — daftar pembayaran (filter: order_id)
// POST /api/payments        — catat pembayaran, lalu hitung ulang status bayar pesanan
import { json, error, readJson, recomputePaymentStatus } from "../_utils.js";

export async function onRequestGet({ request, env, data }) {
  const t = data.auth.tenantId;
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order_id");

  let sql = `SELECT p.id, p.order_id, o.code, p.type, p.amount, p.method, p.paid_at, p.created_at
               FROM payments p JOIN orders o ON o.id=p.order_id
              WHERE p.tenant_id=?`;
  const args = [t];
  if (orderId) { sql += " AND p.order_id=?"; args.push(orderId); }
  sql += " ORDER BY p.id DESC LIMIT 200";
  const rows = await env.DB.prepare(sql).bind(...args).all();

  const sum = await env.DB.prepare("SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE tenant_id=?").bind(t).first();
  return json({ data: rows.results, totalDiterima: sum.total });
}

export async function onRequestPost({ request, env, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  if (!b.order_id || !b.amount) return error("order_id dan amount wajib diisi.");

  const order = await env.DB.prepare("SELECT id FROM orders WHERE id=? AND tenant_id=?").bind(b.order_id, t).first();
  if (!order) return error("Pesanan tidak ditemukan.", 404);

  await env.DB.prepare(
    "INSERT INTO payments (tenant_id, order_id, type, amount, method, paid_at) VALUES (?,?,?,?,?, date('now'))"
  ).bind(t, b.order_id, b.type || "dp", b.amount, b.method || null).run();

  const status = await recomputePaymentStatus(env.DB, t, b.order_id);
  return json({ ok: true, payment_status: status }, 201);
}
