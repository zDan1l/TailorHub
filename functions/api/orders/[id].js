// GET    /api/orders/:id  — detail + riwayat status + pembayaran (:id boleh numeric id atau kode mis. TH-2041)
// PUT    /api/orders/:id  — ubah data / status produksi
// DELETE /api/orders/:id  — hapus pesanan (beserta riwayat & pembayaran)
import { json, error, readJson, PRODUCTION_STATUSES, findOrderByParam, listOrderNotes } from "../_utils.js";

export async function onRequestGet({ env, params, data }) {
  const t = data.auth.tenantId;
  const order = await findOrderByParam(env.DB, t, params.id);
  if (!order) return error("Pesanan tidak ditemukan.", 404);

  const history = await env.DB.prepare(
    "SELECT status, note, created_at FROM order_status_history WHERE order_id=? AND tenant_id=? ORDER BY id ASC"
  ).bind(order.id, t).all();
  const notes = await listOrderNotes(env.DB, t, order.id);
  const payments = await env.DB.prepare(
    "SELECT id, type, amount, method, paid_at, created_at FROM payments WHERE order_id=? AND tenant_id=? ORDER BY id ASC"
  ).bind(order.id, t).all();

  const paid = payments.results.reduce((s, p) => s + p.amount, 0);
  return json({ order, history: history.results, notes, payments: payments.results, paid, sisa: Math.max(0, order.price - paid) });
}

export async function onRequestPut({ request, env, params, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  const DB = env.DB;

  const order = await findOrderByParam(DB, t, params.id);
  if (!order) return error("Pesanan tidak ditemukan.", 404);

  // Ubah status produksi -> catat riwayat + notifikasi
  if (b.production_status && b.production_status !== order.production_status) {
    if (!PRODUCTION_STATUSES.includes(b.production_status)) return error("Status produksi tidak valid.");
    await DB.prepare(
      "INSERT INTO order_status_history (tenant_id, order_id, status, note, changed_by) VALUES (?,?,?,?,?)"
    ).bind(t, order.id, b.production_status, b.note || null, data.auth.userId || null).run();
    await DB.prepare(
      "INSERT INTO notifications (tenant_id, title, body, type) VALUES (?,?,?, 'success')"
    ).bind(t, `${order.code} → ${b.production_status}`, b.note || "Status produksi diperbarui").run();
  }

  // Perbarui kolom yang dikirim (hanya yang ada di body)
  const fields = ["customer_id","type","qty","detail","entry_date","deadline","price","production_status","payment_status","assignee_id","notes"];
  const sets = [], args = [];
  for (const f of fields) {
    if (b[f] !== undefined) { sets.push(`${f}=?`); args.push(b[f]); }
  }
  if (sets.length) {
    sets.push("updated_at=datetime('now')");
    args.push(order.id, t);
    await DB.prepare(`UPDATE orders SET ${sets.join(", ")} WHERE id=? AND tenant_id=?`).bind(...args).run();
  }
  return json({ ok: true, id: order.id, code: order.code });
}

export async function onRequestDelete({ env, params, data }) {
  const t = data.auth.tenantId;
  const DB = env.DB;
  const order = await findOrderByParam(DB, t, params.id);
  if (!order) return error("Pesanan tidak ditemukan.", 404);
  await DB.batch([
    DB.prepare("DELETE FROM order_notes WHERE order_id=? AND tenant_id=?").bind(order.id, t),
    DB.prepare("DELETE FROM order_status_history WHERE order_id=? AND tenant_id=?").bind(order.id, t),
    DB.prepare("DELETE FROM payments WHERE order_id=? AND tenant_id=?").bind(order.id, t),
    DB.prepare("DELETE FROM orders WHERE id=? AND tenant_id=?").bind(order.id, t),
  ]);
  return json({ ok: true });
}
