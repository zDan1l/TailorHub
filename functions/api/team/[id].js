// GET    /api/team/:id — detail anggota + daftar pesanan yang ditugaskan
// PUT    /api/team/:id — ubah nama, email, role, atau status anggota
// DELETE /api/team/:id — hapus anggota tim dari tenant
import { json, error, readJson, hashPassword } from "../_utils.js";

const VALID_ROLES = ["pemilik", "admin", "staff"];
const VALID_STATUSES = ["aktif", "nonaktif", "diundang"];

export async function onRequestGet({ env, params, data }) {
  const t = data.auth.tenantId;
  const member = await env.DB.prepare(
    "SELECT id, name, email, role, status, created_at FROM users WHERE id=? AND tenant_id=?"
  ).bind(params.id, t).first();
  if (!member) return error("Anggota tim tidak ditemukan.", 404);

  const orders = await env.DB.prepare(
    `SELECT o.id, o.code, o.type, o.qty, o.deadline, o.production_status, o.payment_status, c.name AS customer
       FROM orders o LEFT JOIN customers c ON c.id = o.customer_id
      WHERE o.assignee_id=? AND o.tenant_id=?
      ORDER BY o.id DESC`
  ).bind(member.id, t).all();

  return json({ member, orders: orders.results });
}

export async function onRequestPut({ request, env, params, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  const DB = env.DB;

  const member = await DB.prepare(
    "SELECT id, name, email, role, status FROM users WHERE id=? AND tenant_id=?"
  ).bind(params.id, t).first();
  if (!member) return error("Anggota tim tidak ditemukan.", 404);

  const sets = [];
  const args = [];
  if (b.name !== undefined || b.nama !== undefined) {
    sets.push("name=?");
    args.push(String(b.name || b.nama).trim());
  }
  if (b.email !== undefined) {
    sets.push("email=?");
    args.push(String(b.email).trim().toLowerCase());
  }
  if (b.role !== undefined && VALID_ROLES.includes(b.role)) {
    sets.push("role=?");
    args.push(b.role);
  }
  if (b.status !== undefined && VALID_STATUSES.includes(b.status)) {
    sets.push("status=?");
    args.push(b.status);
  }
  if (b.password && String(b.password).length >= 6) {
    const hash = await hashPassword(String(b.password));
    sets.push("password_hash=?");
    args.push(hash);
  }

  if (sets.length) {
    args.push(member.id, t);
    await DB.prepare(`UPDATE users SET ${sets.join(", ")} WHERE id=? AND tenant_id=?`).bind(...args).run();
  }

  return json({ ok: true });
}

export async function onRequestDelete({ env, params, data }) {
  const t = data.auth.tenantId;
  const DB = env.DB;
  const member = await DB.prepare("SELECT id, role FROM users WHERE id=? AND tenant_id=?").bind(params.id, t).first();
  if (!member) return error("Anggota tim tidak ditemukan.", 404);
  if (member.role === "pemilik") return error("Akun pemilik utama tidak dapat dihapus.", 403);

  await DB.batch([
    DB.prepare("UPDATE orders SET assignee_id=NULL WHERE assignee_id=? AND tenant_id=?").bind(member.id, t),
    DB.prepare("DELETE FROM sessions WHERE user_id=? AND tenant_id=?").bind(member.id, t),
    DB.prepare("DELETE FROM users WHERE id=? AND tenant_id=?").bind(member.id, t),
  ]);

  return json({ ok: true });
}
