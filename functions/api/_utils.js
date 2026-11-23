// ============================================================
// TailorHub — Utilitas bersama untuk Pages Functions (API)
// Diimpor oleh _middleware.js dan tiap route (import relatif).
// ============================================================

// ---------- Respons JSON + CORS ----------
export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

export function cors(res) {
  const h = new Headers(res.headers);
  h.set("Access-Control-Allow-Origin", "*");
  h.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new Response(res.body, { status: res.status, headers: h });
}

export function error(message, status = 400) {
  return json({ error: message }, status);
}

// ---------- Baca body JSON dengan aman ----------
export async function readJson(request) {
  try {
    const t = await request.text();
    return t ? JSON.parse(t) : {};
  } catch {
    return {};
  }
}

// ---------- Token sesi ----------
export function getToken(request) {
  const auth = request.headers.get("Authorization") || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7).trim();
  // fallback cookie "th_session"
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(/(?:^|;\s*)th_session=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export function newToken() {
  return hex(crypto.getRandomValues(new Uint8Array(32)));
}

// ---------- Hashing password (PBKDF2-SHA256) ----------
export async function hashPassword(password, iterations = 100000) {
  const salt = crypto.getRandomValues(new Uint8Array(14));
  const bits = await pbkdf2(password, salt, iterations);
  return `pbkdf2$${iterations}$${hex(salt)}$${hex(bits)}`;
}

export async function verifyPassword(password, stored) {
  if (!stored || typeof stored !== "string") return false;
  const [scheme, iterStr, saltHex, hashHex] = stored.split("$");
  if (scheme !== "pbkdf2") return false;
  const bits = await pbkdf2(password, fromHex(saltHex), parseInt(iterStr, 10));
  return timingEqual(hex(bits), hashHex);
}

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" }, key, 256
  );
  return new Uint8Array(bits);
}

// ---------- Helper hex ----------
export function hex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function fromHex(h) {
  const a = new Uint8Array(h.length / 2);
  for (let i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16);
  return a;
}
function timingEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ---------- Domain: status valid ----------
export const PRODUCTION_STATUSES = ["Antrean","Pemotongan","Penjahitan","Finishing","QC","Selesai","Diambil"];
export const PAYMENT_STATUSES = ["Belum Bayar","DP","Lunas"];

// ---------- Nomor pesanan unik per tenant ----------
export async function nextOrderCode(DB, tenantId) {
  const row = await DB.prepare(
    "SELECT MAX(CAST(SUBSTR(code, 4) AS INTEGER)) AS maxnum FROM orders WHERE tenant_id = ? AND code LIKE 'TH-%'"
  ).bind(tenantId).first();
  const next = (row && row.maxnum ? row.maxnum : 2000) + 1;
  return "TH-" + next;
}

// ---------- Hitung ulang status pembayaran dari total payment vs harga ----------
export async function recomputePaymentStatus(DB, tenantId, orderId) {
  const o = await DB.prepare("SELECT price FROM orders WHERE id=? AND tenant_id=?").bind(orderId, tenantId).first();
  if (!o) return;
  const p = await DB.prepare("SELECT COALESCE(SUM(amount),0) AS paid FROM payments WHERE order_id=? AND tenant_id=?").bind(orderId, tenantId).first();
  const paid = p ? p.paid : 0;
  let status = "Belum Bayar";
  if (paid >= o.price && o.price > 0) status = "Lunas";
  else if (paid > 0) status = "DP";
  await DB.prepare("UPDATE orders SET payment_status=?, updated_at=datetime('now') WHERE id=? AND tenant_id=?")
    .bind(status, orderId, tenantId).run();
  return status;
}
