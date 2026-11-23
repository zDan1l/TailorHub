// POST /api/auth/register — daftarkan tenant baru + user pemilik
// body: { usaha, nama, email, password }
import { json, error, readJson, hashPassword, newToken } from "../_utils.js";

function slugify(s) {
  return (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "usaha";
}

export async function onRequestPost({ request, env }) {
  const { usaha, nama, email, password } = await readJson(request);
  if (!usaha || !nama || !email || !password) return error("Lengkapi nama usaha, nama, email, dan password.");
  if (password.length < 6) return error("Password minimal 6 karakter.");

  const DB = env.DB;

  // email sudah terpakai?
  const existing = await DB.prepare("SELECT id FROM users WHERE email=?").bind(email).first();
  if (existing) return error("Email sudah terdaftar.", 409);

  // slug unik
  let slug = slugify(usaha);
  const taken = await DB.prepare("SELECT id FROM tenants WHERE slug=?").bind(slug).first();
  if (taken) slug = slug + "-" + Math.floor(Math.random() * 9000 + 1000);

  const tenant = await DB.prepare(
    "INSERT INTO tenants (name, slug, email, plan) VALUES (?,?,?,'perorangan') RETURNING id"
  ).bind(usaha, slug, email).first();
  const tenantId = tenant.id;

  const hash = await hashPassword(password);
  const user = await DB.prepare(
    "INSERT INTO users (tenant_id, name, email, password_hash, role, status) VALUES (?,?,?,?,'pemilik','aktif') RETURNING id"
  ).bind(tenantId, nama, email, hash).first();

  const token = newToken();
  await DB.prepare(
    "INSERT INTO sessions (token, user_id, tenant_id, expires_at) VALUES (?,?,?, datetime('now','+30 days'))"
  ).bind(token, user.id, tenantId).run();

  return json({
    token,
    user: { id: user.id, nama, email, role: "pemilik" },
    tenant: { id: tenantId, nama: usaha, slug },
  }, 201);
}
