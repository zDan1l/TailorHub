// GET    /api/customers/:id  — profil + riwayat pesanan
// PUT    /api/customers/:id  — ubah profil
// DELETE /api/customers/:id  — hapus (ditolak jika masih punya pesanan)
import { json, error, readJson } from "../_utils.js";

export async function onRequestGet({ env, params, data }) {
  const t = data.auth.tenantId;
  const c = await env.DB.prepare("SELECT * FROM customers WHERE id=? AND tenant_id=?").bind(params.id, t).first();
  if (!c) return error("Customer tidak ditemukan.", 404);
  const orders = await env.DB.prepare(
    "SELECT id, code, type, qty, price, deadline, production_status, payment_status FROM orders WHERE customer_id=? AND tenant_id=? ORDER BY id DESC"
  ).bind(params.id, t).all();
  return json({ customer: c, orders: orders.results });
}

export async function onRequestPut({ request, env, params, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  const fields = ["name","phone","email","address","notes"];
  const sets = [], args = [];
  for (const f of fields) if (b[f] !== undefined) { sets.push(`${f}=?`); args.push(b[f]); }
  if (!sets.length) return json({ ok: true });
  args.push(params.id, t);
  const r = await env.DB.prepare(`UPDATE customers SET ${sets.join(", ")} WHERE id=? AND tenant_id=?`).bind(...args).run();
  if (!r.meta.changes) return error("Customer tidak ditemukan.", 404);
  return json({ ok: true });
}

export async function onRequestDelete({ env, params, data }) {
  const t = data.auth.tenantId;
  const used = await env.DB.prepare("SELECT COUNT(*) AS n FROM orders WHERE customer_id=? AND tenant_id=?").bind(params.id, t).first();
  if (used.n > 0) return error("Tidak bisa dihapus: customer masih memiliki pesanan.", 409);
  await env.DB.prepare("DELETE FROM customers WHERE id=? AND tenant_id=?").bind(params.id, t).run();
  return json({ ok: true });
}
