// GET  /api/auth/me     — info user & tenant yang sedang login
// POST /api/auth/logout tidak di sini; lihat logout.js
import { json } from "../_utils.js";

export async function onRequestGet({ env, data }) {
  const auth = data.auth;
  const u = await env.DB.prepare(
    "SELECT id, name, email, role, status FROM users WHERE tenant_id=? AND (id=? OR ?=0) ORDER BY id ASC LIMIT 1"
  ).bind(auth.tenantId, auth.userId || 0, auth.userId || 0).first();
  const t = await env.DB.prepare(
    "SELECT id, name, slug, email, phone, address, logo_url, plan FROM tenants WHERE id=?"
  ).bind(auth.tenantId).first();
  return json({
    user: u
      ? { id: u.id, nama: u.name, name: u.name, email: u.email, role: u.role, status: u.status }
      : { id: auth.userId, nama: auth.name, name: auth.name, role: auth.role },
    tenant: t
      ? {
          id: t.id,
          nama: t.name,
          name: t.name,
          slug: t.slug,
          email: t.email,
          phone: t.phone,
          address: t.address,
          logo_url: t.logo_url,
          plan: t.plan,
        }
      : null,
  });
}
