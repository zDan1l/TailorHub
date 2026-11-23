// GET /api/health — cek koneksi & database
import { json } from "./_utils.js";

export async function onRequestGet({ env }) {
  let db = "unknown";
  try {
    const r = await env.DB.prepare("SELECT COUNT(*) AS n FROM tenants").first();
    db = `ok (${r.n} tenant)`;
  } catch (e) {
    db = "error: " + e.message;
  }
  return json({ ok: true, service: "tailorhub-api", db, time: new Date().toISOString() });
}
