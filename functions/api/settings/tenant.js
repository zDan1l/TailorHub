// GET /api/settings/tenant — profil & konfigurasi usaha (tenant)
// PUT /api/settings/tenant — simpan perubahan profil & konfigurasi usaha
import { json, error, readJson } from "../_utils.js";

export async function onRequestGet({ env, data }) {
  const t = data.auth.tenantId;
  const tenant = await env.DB.prepare(
    "SELECT id, name, slug, email, phone, address, logo_url, plan, created_at FROM tenants WHERE id=?"
  ).bind(t).first();
  if (!tenant) return error("Tenant tidak ditemukan.", 404);
  return json({ tenant });
}

export async function onRequestPut({ request, env, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  const DB = env.DB;

  const fields = ["name", "slug", "email", "phone", "address", "logo_url", "plan"];
  const sets = [];
  const args = [];
  for (const f of fields) {
    if (b[f] !== undefined) {
      sets.push(`${f}=?`);
      args.push(b[f] === null ? null : String(b[f]).trim());
    }
  }

  if (sets.length) {
    args.push(t);
    await DB.prepare(`UPDATE tenants SET ${sets.join(", ")} WHERE id=?`).bind(...args).run();
  }

  const updated = await DB.prepare(
    "SELECT id, name, slug, email, phone, address, logo_url, plan, created_at FROM tenants WHERE id=?"
  ).bind(t).first();
  return json({ ok: true, tenant: updated });
}
