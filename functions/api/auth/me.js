// GET  /api/auth/me     — info user & tenant yang sedang login
// POST /api/auth/logout tidak di sini; lihat logout.js
import { json } from "../_utils.js";

export async function onRequestGet({ env, data }) {
  const auth = data.auth;
  const t = await env.DB.prepare("SELECT id, name, slug, plan FROM tenants WHERE id=?").bind(auth.tenantId).first();
  return json({
    user: { id: auth.userId, nama: auth.name, role: auth.role },
    tenant: t ? { id: t.id, nama: t.name, slug: t.slug, plan: t.plan } : null,
  });
}
