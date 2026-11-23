// ============================================================
// TailorHub — Middleware API (berlaku untuk semua /api/*)
// - Menangani CORS preflight
// - Memastikan binding D1 (env.DB) ada
// - Menyelesaikan autentikasi: token sesi -> tenant & user
//   (DEV: jika env.DEV_TENANT_ID diset, lewati login)
// - Menaruh hasilnya di context.data.auth untuk dipakai route
// ============================================================
import { cors, json, getToken } from "./_utils.js";

const PUBLIC_PATHS = ["/api/health", "/api/auth/login", "/api/auth/register"];

export async function onRequest(context) {
  const { request, env } = context;

  // Preflight CORS
  if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }));

  if (!env.DB) {
    return cors(json({ error: "Binding D1 'DB' tidak ditemukan. Cek wrangler.toml & database_id." }, 500));
  }

  const path = new URL(request.url).pathname;

  // Resolusi autentikasi
  let auth = null;
  const token = getToken(request);
  if (token) {
    auth = await env.DB.prepare(
      `SELECT s.user_id AS userId, s.tenant_id AS tenantId, u.role, u.name
         FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.token = ? AND s.expires_at > datetime('now')`
    ).bind(token).first();
  }
  // Fallback DEV: anggap request milik DEV_TENANT_ID tanpa login
  if (!auth && env.DEV_TENANT_ID) {
    auth = { userId: 0, tenantId: Number(env.DEV_TENANT_ID), role: "pemilik", name: "Dev" };
  }
  context.data.auth = auth;

  // Route non-publik wajib terotorisasi.
  // /api/public/* = portal customer (tanpa login).
  const isPublic = PUBLIC_PATHS.includes(path) || path.startsWith("/api/public/");
  if (!isPublic && !auth) {
    return cors(json({ error: "Tidak terotorisasi. Silakan login terlebih dahulu." }, 401));
  }

  const res = await context.next();
  return cors(res);
}
