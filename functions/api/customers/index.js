// GET  /api/customers    — daftar customer (filter: q, limit, offset)
// POST /api/customers    — tambah customer
import { json, error, readJson } from "../_utils.js";

export async function onRequestGet({ request, env, data }) {
  const t = data.auth.tenantId;
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  let sql = `SELECT c.id, c.name, c.phone, c.email, c.address,
                    COUNT(o.id) AS order_count,
                    COALESCE(SUM(o.price),0) AS total_value
               FROM customers c LEFT JOIN orders o ON o.customer_id=c.id AND o.tenant_id=c.tenant_id
              WHERE c.tenant_id=?`;
  const args = [t];
  if (q) { sql += " AND (c.name LIKE ? OR c.phone LIKE ?)"; args.push(`%${q}%`, `%${q}%`); }
  sql += " GROUP BY c.id ORDER BY c.name ASC LIMIT ? OFFSET ?";
  args.push(limit, offset);

  const rows = await env.DB.prepare(sql).bind(...args).all();
  return json({ data: rows.results });
}

export async function onRequestPost({ request, env, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  if (!b.name) return error("Nama customer wajib diisi.");
  const c = await env.DB.prepare(
    "INSERT INTO customers (tenant_id, name, phone, email, address, notes) VALUES (?,?,?,?,?,?) RETURNING id"
  ).bind(t, b.name, b.phone || null, b.email || null, b.address || null, b.notes || null).first();
  return json({ id: c.id }, 201);
}
