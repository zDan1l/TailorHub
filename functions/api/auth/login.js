// POST /api/auth/login — masuk dengan email + password
// body: { email, password }
import { json, error, readJson, verifyPassword, newToken } from "../_utils.js";

export async function onRequestPost({ request, env }) {
  const { email, password } = await readJson(request);
  if (!email || !password) return error("Email dan password wajib diisi.");

  const DB = env.DB;
  const user = await DB.prepare(
    "SELECT u.id, u.name, u.email, u.role, u.status, u.tenant_id, u.password_hash, t.name AS tenant_name, t.slug AS tenant_slug FROM users u JOIN tenants t ON t.id=u.tenant_id WHERE u.email=?"
  ).bind(email).first();

  if (!user) return error("Email atau password salah.", 401);
  if (user.status !== "aktif") return error("Akun tidak aktif. Hubungi pemilik usaha.", 403);

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return error("Email atau password salah.", 401);

  const token = newToken();
  await DB.prepare(
    "INSERT INTO sessions (token, user_id, tenant_id, expires_at) VALUES (?,?,?, datetime('now','+30 days'))"
  ).bind(token, user.id, user.tenant_id).run();

  return json({
    token,
    user: { id: user.id, nama: user.name, email: user.email, role: user.role },
    tenant: { id: user.tenant_id, nama: user.tenant_name, slug: user.tenant_slug },
  });
}
