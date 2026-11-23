// GET  /api/team — daftar anggota tim dalam tenant (tanpa password_hash)
// POST /api/team — tambah / undang anggota tim baru
import { json, error, readJson, hashPassword } from "../_utils.js";

const VALID_ROLES = ["pemilik", "admin", "staff"];
const VALID_STATUSES = ["aktif", "nonaktif", "diundang"];

export async function onRequestGet({ env, data }) {
  const t = data.auth.tenantId;
  const rows = await env.DB.prepare(
    `SELECT u.id, u.name, u.email, u.role, u.status, u.created_at,
            COUNT(CASE WHEN o.production_status NOT IN ('Selesai','Diambil') THEN o.id END) AS active_orders,
            COUNT(o.id) AS total_orders
       FROM users u
       LEFT JOIN orders o ON o.assignee_id = u.id AND o.tenant_id = u.tenant_id
      WHERE u.tenant_id=?
      GROUP BY u.id
      ORDER BY u.id ASC`
  ).bind(t).all();

  return json({ data: rows.results });
}

export async function onRequestPost({ request, env, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  const name = (b.name || b.nama || "").trim();
  const email = (b.email || "").trim().toLowerCase();
  if (!name || !email) return error("Nama dan email anggota wajib diisi.");

  const role = VALID_ROLES.includes(b.role) ? b.role : "staff";
  const status = VALID_STATUSES.includes(b.status) ? b.status : "aktif";
  const rawPass = b.password && String(b.password).length >= 6 ? String(b.password) : "password123";

  const exists = await env.DB.prepare(
    "SELECT id FROM users WHERE tenant_id=? AND LOWER(email)=?"
  ).bind(t, email).first();
  if (exists) return error("Email anggota sudah terdaftar di usaha ini.", 409);

  const hash = await hashPassword(rawPass);
  const created = await env.DB.prepare(
    "INSERT INTO users (tenant_id, name, email, password_hash, role, status) VALUES (?,?,?,?,?,?) RETURNING id"
  ).bind(t, name, email, hash, role, status).first();

  await env.DB.prepare(
    "INSERT INTO notifications (tenant_id, title, body, type) VALUES (?,?,?, 'info')"
  ).bind(t, "Anggota tim ditambahkan", `${name} (${role})`).run();

  return json({ id: created.id, name, email, role, status }, 201);
}
