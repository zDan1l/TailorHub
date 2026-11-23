// GET /api/account — profil user & tenant aktif
// PUT /api/account — perbarui profil user, ganti password, atau info kontak tenant
import { json, error, readJson, hashPassword, verifyPassword } from "../_utils.js";

async function loadAccount(DB, tenantId, userId) {
  const u = await DB.prepare(
    "SELECT id, name, email, role, status, password_hash FROM users WHERE tenant_id=? AND (id=? OR ?=0) ORDER BY id ASC LIMIT 1"
  ).bind(tenantId, userId, userId).first();
  const tenant = await DB.prepare(
    "SELECT id, name, slug, email, phone, address, logo_url, plan FROM tenants WHERE id=?"
  ).bind(tenantId).first();
  return { u, tenant };
}

function formatResponse(u, tenant) {
  return {
    user: u
      ? { id: u.id, nama: u.name, name: u.name, email: u.email, role: u.role, status: u.status }
      : null,
    tenant: tenant
      ? {
          id: tenant.id,
          nama: tenant.name,
          name: tenant.name,
          slug: tenant.slug,
          email: tenant.email,
          phone: tenant.phone,
          address: tenant.address,
          logo_url: tenant.logo_url,
          plan: tenant.plan,
        }
      : null,
  };
}

export async function onRequestGet({ env, data }) {
  const t = data.auth.tenantId;
  const userId = data.auth.userId || 0;
  const { u, tenant } = await loadAccount(env.DB, t, userId);
  return json(formatResponse(u, tenant));
}

export async function onRequestPut({ request, env, data }) {
  const t = data.auth.tenantId;
  const userId = data.auth.userId || 0;
  const b = await readJson(request);
  const DB = env.DB;

  const { u } = await loadAccount(DB, t, userId);
  if (!u) return error("Pengguna tidak ditemukan.", 404);

  // 1) Ganti kata sandi bila new_password dikirim
  if (b.new_password !== undefined && b.new_password !== "") {
    if (!b.old_password) return error("Kata sandi saat ini wajib diisi.");
    if (String(b.new_password).length < 6) return error("Kata sandi baru minimal 6 karakter.");
    const ok = await verifyPassword(String(b.old_password), u.password_hash);
    if (!ok) return error("Kata sandi saat ini tidak sesuai.", 401);
    const newHash = await hashPassword(String(b.new_password));
    await DB.prepare("UPDATE users SET password_hash=? WHERE id=? AND tenant_id=?")
      .bind(newHash, u.id, t)
      .run();
  }

  // 2) Update nama / email user
  const nextName = b.name !== undefined ? String(b.name).trim() : b.nama !== undefined ? String(b.nama).trim() : null;
  const nextEmail = b.email !== undefined ? String(b.email).trim() : null;
  if (nextName || nextEmail) {
    await DB.prepare("UPDATE users SET name=?, email=? WHERE id=? AND tenant_id=?")
      .bind(nextName || u.name, nextEmail || u.email, u.id, t)
      .run();
  }

  // 3) Update informasi kontak / alamat tenant bila disertakan (mis. dari onboarding atau profil)
  const tenantSets = [];
  const tenantArgs = [];
  if (b.tenant_name !== undefined || b.usaha !== undefined) {
    tenantSets.push("name=?");
    tenantArgs.push(String(b.tenant_name || b.usaha).trim());
  }
  if (b.phone !== undefined) {
    tenantSets.push("phone=?");
    tenantArgs.push(b.phone ? String(b.phone).trim() : null);
  }
  if (b.address !== undefined) {
    tenantSets.push("address=?");
    tenantArgs.push(b.address ? String(b.address).trim() : null);
  }
  if (b.logo_url !== undefined) {
    tenantSets.push("logo_url=?");
    tenantArgs.push(b.logo_url ? String(b.logo_url).trim() : null);
  }
  if (tenantSets.length) {
    tenantArgs.push(t);
    await DB.prepare(`UPDATE tenants SET ${tenantSets.join(", ")} WHERE id=?`)
      .bind(...tenantArgs)
      .run();
  }

  const updated = await loadAccount(DB, t, u.id);
  return json({ ok: true, ...formatResponse(updated.u, updated.tenant) });
}
