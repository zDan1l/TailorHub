// GET  /api/orders/:id/notes — daftar log catatan produksi pesanan
// POST /api/orders/:id/notes — tambah log catatan produksi baru
import { json, error, readJson, findOrderByParam, listOrderNotes } from "../../_utils.js";

export async function onRequestGet({ env, params, data }) {
  const t = data.auth.tenantId;
  const order = await findOrderByParam(env.DB, t, params.id);
  if (!order) return error("Pesanan tidak ditemukan.", 404);

  const notes = await listOrderNotes(env.DB, t, order.id);
  return json({ data: notes });
}

export async function onRequestPost({ request, env, params, data }) {
  const t = data.auth.tenantId;
  const order = await findOrderByParam(env.DB, t, params.id);
  if (!order) return error("Pesanan tidak ditemukan.", 404);

  const b = await readJson(request);
  const body = String(b.body || "").trim();
  if (!body) return error("Isi catatan produksi wajib diisi.");

  const inserted = await env.DB.prepare(
    `INSERT INTO order_notes (tenant_id, order_id, user_id, body)
     VALUES (?,?,?,?) RETURNING id`
  ).bind(t, order.id, data.auth.userId || null, body).first();

  const note = await env.DB.prepare(
    `SELECT n.id, n.body, n.created_at,
            COALESCE(u.name, 'Tim Produksi') AS author_name,
            COALESCE(u.role, 'staff') AS author_role
       FROM order_notes n
       LEFT JOIN users u ON u.id=n.user_id
      WHERE n.id=? AND n.tenant_id=?
      LIMIT 1`
  ).bind(inserted.id, t).first();

  return json({ note }, 201);
}
