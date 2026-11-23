var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-0jbuWe/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// .wrangler/tmp/pages-DPwPWb/functionsWorker-0.2606283814583954.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
function stripCfConnectingIPHeader2(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader2, "stripCfConnectingIPHeader");
__name2(stripCfConnectingIPHeader2, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader2.apply(null, argArray)
    ]);
  }
});
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extraHeaders }
  });
}
__name(json, "json");
__name2(json, "json");
function cors(res) {
  const h = new Headers(res.headers);
  h.set("Access-Control-Allow-Origin", "*");
  h.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new Response(res.body, { status: res.status, headers: h });
}
__name(cors, "cors");
__name2(cors, "cors");
function error(message, status = 400) {
  return json({ error: message }, status);
}
__name(error, "error");
__name2(error, "error");
async function readJson(request) {
  try {
    const t = await request.text();
    return t ? JSON.parse(t) : {};
  } catch {
    return {};
  }
}
__name(readJson, "readJson");
__name2(readJson, "readJson");
function getToken(request) {
  const auth = request.headers.get("Authorization") || "";
  if (auth.startsWith("Bearer "))
    return auth.slice(7).trim();
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(/(?:^|;\s*)th_session=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
__name(getToken, "getToken");
__name2(getToken, "getToken");
function newToken() {
  return hex(crypto.getRandomValues(new Uint8Array(32)));
}
__name(newToken, "newToken");
__name2(newToken, "newToken");
async function hashPassword(password, iterations = 1e5) {
  const salt = crypto.getRandomValues(new Uint8Array(14));
  const bits = await pbkdf2(password, salt, iterations);
  return `pbkdf2$${iterations}$${hex(salt)}$${hex(bits)}`;
}
__name(hashPassword, "hashPassword");
__name2(hashPassword, "hashPassword");
async function verifyPassword(password, stored) {
  if (!stored || typeof stored !== "string")
    return false;
  const [scheme, iterStr, saltHex, hashHex] = stored.split("$");
  if (scheme !== "pbkdf2")
    return false;
  const bits = await pbkdf2(password, fromHex(saltHex), parseInt(iterStr, 10));
  return timingEqual(hex(bits), hashHex);
}
__name(verifyPassword, "verifyPassword");
__name2(verifyPassword, "verifyPassword");
async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    256
  );
  return new Uint8Array(bits);
}
__name(pbkdf2, "pbkdf2");
__name2(pbkdf2, "pbkdf2");
function hex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hex, "hex");
__name2(hex, "hex");
function fromHex(h) {
  const a = new Uint8Array(h.length / 2);
  for (let i = 0; i < a.length; i++)
    a[i] = parseInt(h.substr(i * 2, 2), 16);
  return a;
}
__name(fromHex, "fromHex");
__name2(fromHex, "fromHex");
function timingEqual(a, b) {
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++)
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
__name(timingEqual, "timingEqual");
__name2(timingEqual, "timingEqual");
var PRODUCTION_STATUSES = ["Antrean", "Pemotongan", "Penjahitan", "Finishing", "QC", "Selesai", "Diambil"];
async function nextOrderCode(DB, tenantId) {
  const row = await DB.prepare(
    "SELECT MAX(CAST(SUBSTR(code, 4) AS INTEGER)) AS maxnum FROM orders WHERE tenant_id = ? AND code LIKE 'TH-%'"
  ).bind(tenantId).first();
  const next = (row && row.maxnum ? row.maxnum : 2e3) + 1;
  return "TH-" + next;
}
__name(nextOrderCode, "nextOrderCode");
__name2(nextOrderCode, "nextOrderCode");
async function recomputePaymentStatus(DB, tenantId, orderId) {
  const o = await DB.prepare("SELECT price FROM orders WHERE id=? AND tenant_id=?").bind(orderId, tenantId).first();
  if (!o)
    return;
  const p = await DB.prepare("SELECT COALESCE(SUM(amount),0) AS paid FROM payments WHERE order_id=? AND tenant_id=?").bind(orderId, tenantId).first();
  const paid = p ? p.paid : 0;
  let status = "Belum Bayar";
  if (paid >= o.price && o.price > 0)
    status = "Lunas";
  else if (paid > 0)
    status = "DP";
  await DB.prepare("UPDATE orders SET payment_status=?, updated_at=datetime('now') WHERE id=? AND tenant_id=?").bind(status, orderId, tenantId).run();
  return status;
}
__name(recomputePaymentStatus, "recomputePaymentStatus");
__name2(recomputePaymentStatus, "recomputePaymentStatus");
async function onRequestPost({ request, env }) {
  const { email, password } = await readJson(request);
  if (!email || !password)
    return error("Email dan password wajib diisi.");
  const DB = env.DB;
  const user = await DB.prepare(
    "SELECT u.id, u.name, u.email, u.role, u.status, u.tenant_id, u.password_hash, t.name AS tenant_name, t.slug AS tenant_slug FROM users u JOIN tenants t ON t.id=u.tenant_id WHERE u.email=?"
  ).bind(email).first();
  if (!user)
    return error("Email atau password salah.", 401);
  if (user.status !== "aktif")
    return error("Akun tidak aktif. Hubungi pemilik usaha.", 403);
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok)
    return error("Email atau password salah.", 401);
  const token = newToken();
  await DB.prepare(
    "INSERT INTO sessions (token, user_id, tenant_id, expires_at) VALUES (?,?,?, datetime('now','+30 days'))"
  ).bind(token, user.id, user.tenant_id).run();
  return json({
    token,
    user: { id: user.id, nama: user.name, email: user.email, role: user.role },
    tenant: { id: user.tenant_id, nama: user.tenant_name, slug: user.tenant_slug }
  });
}
__name(onRequestPost, "onRequestPost");
__name2(onRequestPost, "onRequestPost");
async function onRequestPost2({ request, env }) {
  const token = getToken(request);
  if (token)
    await env.DB.prepare("DELETE FROM sessions WHERE token=?").bind(token).run();
  return json({ ok: true });
}
__name(onRequestPost2, "onRequestPost2");
__name2(onRequestPost2, "onRequestPost");
async function onRequestGet({ env, data }) {
  const auth = data.auth;
  const u = await env.DB.prepare(
    "SELECT id, name, email, role, status FROM users WHERE tenant_id=? AND (id=? OR ?=0) ORDER BY id ASC LIMIT 1"
  ).bind(auth.tenantId, auth.userId || 0, auth.userId || 0).first();
  const t = await env.DB.prepare(
    "SELECT id, name, slug, email, phone, address, logo_url, plan FROM tenants WHERE id=?"
  ).bind(auth.tenantId).first();
  return json({
    user: u ? { id: u.id, nama: u.name, name: u.name, email: u.email, role: u.role, status: u.status } : { id: auth.userId, nama: auth.name, name: auth.name, role: auth.role },
    tenant: t ? {
      id: t.id,
      nama: t.name,
      name: t.name,
      slug: t.slug,
      email: t.email,
      phone: t.phone,
      address: t.address,
      logo_url: t.logo_url,
      plan: t.plan
    } : null
  });
}
__name(onRequestGet, "onRequestGet");
__name2(onRequestGet, "onRequestGet");
function slugify(s) {
  return (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "usaha";
}
__name(slugify, "slugify");
__name2(slugify, "slugify");
async function onRequestPost3({ request, env }) {
  const { usaha, nama, email, password } = await readJson(request);
  if (!usaha || !nama || !email || !password)
    return error("Lengkapi nama usaha, nama, email, dan password.");
  if (password.length < 6)
    return error("Password minimal 6 karakter.");
  const DB = env.DB;
  const existing = await DB.prepare("SELECT id FROM users WHERE email=?").bind(email).first();
  if (existing)
    return error("Email sudah terdaftar.", 409);
  let slug = slugify(usaha);
  const taken = await DB.prepare("SELECT id FROM tenants WHERE slug=?").bind(slug).first();
  if (taken)
    slug = slug + "-" + Math.floor(Math.random() * 9e3 + 1e3);
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
    tenant: { id: tenantId, nama: usaha, slug }
  }, 201);
}
__name(onRequestPost3, "onRequestPost3");
__name2(onRequestPost3, "onRequestPost");
async function onRequestGet2({ request, env }) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  const code = (url.searchParams.get("code") || "").trim().toUpperCase();
  if (!slug || !code)
    return error("Parameter 'slug' dan 'code' wajib diisi.");
  const tenant = await env.DB.prepare("SELECT id, name FROM tenants WHERE slug=?").bind(slug).first();
  if (!tenant)
    return error("Usaha tidak ditemukan.", 404);
  const order = await env.DB.prepare(
    `SELECT o.code, o.type, o.qty, o.deadline, o.production_status, o.payment_status, c.name AS customer
       FROM orders o LEFT JOIN customers c ON c.id=o.customer_id
      WHERE o.tenant_id=? AND o.code=?`
  ).bind(tenant.id, code).first();
  if (!order)
    return error("Kode pesanan tidak ditemukan.", 404);
  const history = await env.DB.prepare(
    "SELECT status, created_at FROM order_status_history h WHERE h.tenant_id=? AND h.order_id=(SELECT id FROM orders WHERE tenant_id=? AND code=?) ORDER BY h.id ASC"
  ).bind(tenant.id, tenant.id, code).all();
  return json({
    usaha: tenant.name,
    pesanan: {
      kode: order.code,
      jenis: order.type,
      jumlah: order.qty,
      customer: order.customer,
      deadline: order.deadline,
      statusProduksi: order.production_status,
      statusBayar: order.payment_status
    },
    riwayat: history.results
  });
}
__name(onRequestGet2, "onRequestGet2");
__name2(onRequestGet2, "onRequestGet");
async function onRequestGet3({ env, data }) {
  const DB = env.DB;
  const t = data.auth.tenantId;
  const totalRow = await DB.prepare(
    "SELECT COALESCE(SUM(amount),0) AS total, COUNT(*) AS count FROM payments WHERE tenant_id=?"
  ).bind(t).first();
  const dpRow = await DB.prepare(
    "SELECT COALESCE(SUM(amount),0) AS total, COUNT(*) AS count FROM payments WHERE tenant_id=? AND type='dp'"
  ).bind(t).first();
  const lunasRow = await DB.prepare(
    "SELECT COALESCE(SUM(amount),0) AS total, COUNT(*) AS count FROM payments WHERE tenant_id=? AND type='pelunasan'"
  ).bind(t).first();
  const orderValueRow = await DB.prepare(
    "SELECT COALESCE(SUM(price),0) AS total_price, COUNT(CASE WHEN payment_status != 'Lunas' THEN 1 END) AS unpaid_orders FROM orders WHERE tenant_id=?"
  ).bind(t).first();
  const byMethod = await DB.prepare(
    "SELECT COALESCE(method,'lainnya') AS method, COALESCE(SUM(amount),0) AS total, COUNT(*) AS count FROM payments WHERE tenant_id=? GROUP BY method ORDER BY total DESC"
  ).bind(t).all();
  const recentPayments = await DB.prepare(
    `SELECT p.id, p.order_id, o.code, o.type AS order_type, p.type, p.amount, p.method, p.paid_at, p.created_at,
            c.name AS customer
       FROM payments p
       JOIN orders o ON o.id = p.order_id
       LEFT JOIN customers c ON c.id = o.customer_id
      WHERE p.tenant_id=?
      ORDER BY p.id DESC LIMIT 100`
  ).bind(t).all();
  const totalKas = totalRow ? totalRow.total : 0;
  const totalPrice = orderValueRow ? orderValueRow.total_price : 0;
  const piutang = Math.max(0, totalPrice - totalKas);
  return json({
    kpi: {
      totalPemasukan: totalKas,
      jumlahTransaksi: totalRow ? totalRow.count : 0,
      totalDp: dpRow ? dpRow.total : 0,
      jumlahDp: dpRow ? dpRow.count : 0,
      totalPelunasan: lunasRow ? lunasRow.total : 0,
      jumlahPelunasan: lunasRow ? lunasRow.count : 0,
      piutangBerjalan: piutang,
      pesananBelumLunas: orderValueRow ? orderValueRow.unpaid_orders : 0
    },
    byMethod: byMethod.results,
    payments: recentPayments.results
  });
}
__name(onRequestGet3, "onRequestGet3");
__name2(onRequestGet3, "onRequestGet");
async function onRequestGet4({ env, data }) {
  const DB = env.DB;
  const t = data.auth.tenantId;
  const summary = await DB.prepare(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(price),0) AS total_omzet,
            COUNT(CASE WHEN production_status IN ('Selesai','Diambil') THEN 1 END) AS selesai,
            COUNT(CASE WHEN production_status NOT IN ('Selesai','Diambil') THEN 1 END) AS aktif,
            COUNT(CASE WHEN production_status NOT IN ('Selesai','Diambil') AND deadline IS NOT NULL AND date(deadline) < date('now') THEN 1 END) AS terlambat,
            COUNT(CASE WHEN production_status NOT IN ('Selesai','Diambil') AND deadline IS NOT NULL AND date(deadline) <= date('now','+3 day') THEN 1 END) AS mendekati_deadline
       FROM orders WHERE tenant_id=?`
  ).bind(t).first();
  const byStatus = await DB.prepare(
    "SELECT production_status AS status, COUNT(*) AS count FROM orders WHERE tenant_id=? GROUP BY production_status"
  ).bind(t).all();
  const byType = await DB.prepare(
    "SELECT COALESCE(type,'Lainnya') AS type, COUNT(*) AS count, COALESCE(SUM(qty),0) AS total_qty, COALESCE(SUM(price),0) AS total_price FROM orders WHERE tenant_id=? GROUP BY type ORDER BY count DESC"
  ).bind(t).all();
  const byStaff = await DB.prepare(
    `SELECT u.id, u.name, u.role,
            COUNT(o.id) AS total_orders,
            COALESCE(SUM(o.qty),0) AS total_pcs,
            COUNT(CASE WHEN o.production_status IN ('Selesai','Diambil') THEN 1 END) AS done_orders
       FROM users u
       LEFT JOIN orders o ON o.assignee_id = u.id AND o.tenant_id = u.tenant_id
      WHERE u.tenant_id=?
      GROUP BY u.id
      ORDER BY total_orders DESC`
  ).bind(t).all();
  const orders = await DB.prepare(
    `SELECT o.id, o.code, o.type, o.qty, o.detail, o.entry_date, o.deadline, o.price,
            o.production_status, o.payment_status, c.name AS customer, u.name AS assignee
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       LEFT JOIN users u ON u.id = o.assignee_id
      WHERE o.tenant_id=?
      ORDER BY o.id DESC LIMIT 100`
  ).bind(t).all();
  const total = summary ? summary.total : 0;
  const totalOmzet = summary ? summary.total_omzet : 0;
  const terlambat = summary ? summary.terlambat : 0;
  const aov = total > 0 ? Math.round(totalOmzet / total) : 0;
  const ontimePct = total > 0 ? Math.max(0, Math.round((total - terlambat) / total * 1e3) / 10) : 100;
  return json({
    kpi: {
      totalPesanan: total,
      totalOmzet,
      pesananSelesai: summary ? summary.selesai : 0,
      pesananAktif: summary ? summary.aktif : 0,
      terlambat,
      mendekatiDeadline: summary ? summary.mendekati_deadline : 0,
      aov,
      ontimePct
    },
    byStatus: byStatus.results,
    byType: byType.results,
    byStaff: byStaff.results,
    orders: orders.results
  });
}
__name(onRequestGet4, "onRequestGet4");
__name2(onRequestGet4, "onRequestGet");
async function onRequestGet5({ env, data }) {
  const t = data.auth.tenantId;
  const tenant = await env.DB.prepare(
    "SELECT id, name, slug, email, phone, address, logo_url, plan, created_at FROM tenants WHERE id=?"
  ).bind(t).first();
  if (!tenant)
    return error("Tenant tidak ditemukan.", 404);
  return json({ tenant });
}
__name(onRequestGet5, "onRequestGet5");
__name2(onRequestGet5, "onRequestGet");
async function onRequestPut({ request, env, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  const DB = env.DB;
  const fields = ["name", "slug", "email", "phone", "address", "logo_url", "plan"];
  const sets = [];
  const args = [];
  for (const f of fields) {
    if (b[f] !== void 0) {
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
__name(onRequestPut, "onRequestPut");
__name2(onRequestPut, "onRequestPut");
async function onRequestGet6({ env, params, data }) {
  const t = data.auth.tenantId;
  const c = await env.DB.prepare("SELECT * FROM customers WHERE id=? AND tenant_id=?").bind(params.id, t).first();
  if (!c)
    return error("Customer tidak ditemukan.", 404);
  const orders = await env.DB.prepare(
    "SELECT id, code, type, qty, price, deadline, production_status, payment_status FROM orders WHERE customer_id=? AND tenant_id=? ORDER BY id DESC"
  ).bind(params.id, t).all();
  return json({ customer: c, orders: orders.results });
}
__name(onRequestGet6, "onRequestGet6");
__name2(onRequestGet6, "onRequestGet");
async function onRequestPut2({ request, env, params, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  const fields = ["name", "phone", "email", "address", "notes"];
  const sets = [], args = [];
  for (const f of fields)
    if (b[f] !== void 0) {
      sets.push(`${f}=?`);
      args.push(b[f]);
    }
  if (!sets.length)
    return json({ ok: true });
  args.push(params.id, t);
  const r = await env.DB.prepare(`UPDATE customers SET ${sets.join(", ")} WHERE id=? AND tenant_id=?`).bind(...args).run();
  if (!r.meta.changes)
    return error("Customer tidak ditemukan.", 404);
  return json({ ok: true });
}
__name(onRequestPut2, "onRequestPut2");
__name2(onRequestPut2, "onRequestPut");
async function onRequestDelete({ env, params, data }) {
  const t = data.auth.tenantId;
  const used = await env.DB.prepare("SELECT COUNT(*) AS n FROM orders WHERE customer_id=? AND tenant_id=?").bind(params.id, t).first();
  if (used.n > 0)
    return error("Tidak bisa dihapus: customer masih memiliki pesanan.", 409);
  await env.DB.prepare("DELETE FROM customers WHERE id=? AND tenant_id=?").bind(params.id, t).run();
  return json({ ok: true });
}
__name(onRequestDelete, "onRequestDelete");
__name2(onRequestDelete, "onRequestDelete");
async function findOrderByParam(DB, tenantId, idOrCode) {
  const raw = String(idOrCode || "").trim();
  return DB.prepare(
    `SELECT o.*, c.name AS customer, c.phone AS customer_phone, c.email AS customer_email, c.address AS customer_address,
            u.name AS assignee
       FROM orders o
       LEFT JOIN customers c ON c.id=o.customer_id
       LEFT JOIN users u ON u.id=o.assignee_id
      WHERE o.tenant_id=? AND (o.id=? OR UPPER(o.code)=UPPER(?))
      LIMIT 1`
  ).bind(tenantId, raw, raw).first();
}
__name(findOrderByParam, "findOrderByParam");
__name2(findOrderByParam, "findOrderByParam");
async function onRequestGet7({ env, params, data }) {
  const t = data.auth.tenantId;
  const order = await findOrderByParam(env.DB, t, params.id);
  if (!order)
    return error("Pesanan tidak ditemukan.", 404);
  const history = await env.DB.prepare(
    "SELECT status, note, created_at FROM order_status_history WHERE order_id=? AND tenant_id=? ORDER BY id ASC"
  ).bind(order.id, t).all();
  const payments = await env.DB.prepare(
    "SELECT id, type, amount, method, paid_at, created_at FROM payments WHERE order_id=? AND tenant_id=? ORDER BY id ASC"
  ).bind(order.id, t).all();
  const paid = payments.results.reduce((s, p) => s + p.amount, 0);
  return json({ order, history: history.results, payments: payments.results, paid, sisa: Math.max(0, order.price - paid) });
}
__name(onRequestGet7, "onRequestGet7");
__name2(onRequestGet7, "onRequestGet");
async function onRequestPut3({ request, env, params, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  const DB = env.DB;
  const order = await findOrderByParam(DB, t, params.id);
  if (!order)
    return error("Pesanan tidak ditemukan.", 404);
  if (b.production_status && b.production_status !== order.production_status) {
    if (!PRODUCTION_STATUSES.includes(b.production_status))
      return error("Status produksi tidak valid.");
    await DB.prepare(
      "INSERT INTO order_status_history (tenant_id, order_id, status, note, changed_by) VALUES (?,?,?,?,?)"
    ).bind(t, order.id, b.production_status, b.note || null, data.auth.userId || null).run();
    await DB.prepare(
      "INSERT INTO notifications (tenant_id, title, body, type) VALUES (?,?,?, 'success')"
    ).bind(t, `${order.code} \u2192 ${b.production_status}`, b.note || "Status produksi diperbarui").run();
  }
  const fields = ["customer_id", "type", "qty", "detail", "entry_date", "deadline", "price", "production_status", "payment_status", "assignee_id", "notes"];
  const sets = [], args = [];
  for (const f of fields) {
    if (b[f] !== void 0) {
      sets.push(`${f}=?`);
      args.push(b[f]);
    }
  }
  if (sets.length) {
    sets.push("updated_at=datetime('now')");
    args.push(order.id, t);
    await DB.prepare(`UPDATE orders SET ${sets.join(", ")} WHERE id=? AND tenant_id=?`).bind(...args).run();
  }
  return json({ ok: true, id: order.id, code: order.code });
}
__name(onRequestPut3, "onRequestPut3");
__name2(onRequestPut3, "onRequestPut");
async function onRequestDelete2({ env, params, data }) {
  const t = data.auth.tenantId;
  const DB = env.DB;
  const order = await findOrderByParam(DB, t, params.id);
  if (!order)
    return error("Pesanan tidak ditemukan.", 404);
  await DB.batch([
    DB.prepare("DELETE FROM order_status_history WHERE order_id=? AND tenant_id=?").bind(order.id, t),
    DB.prepare("DELETE FROM payments WHERE order_id=? AND tenant_id=?").bind(order.id, t),
    DB.prepare("DELETE FROM orders WHERE id=? AND tenant_id=?").bind(order.id, t)
  ]);
  return json({ ok: true });
}
__name(onRequestDelete2, "onRequestDelete2");
__name2(onRequestDelete2, "onRequestDelete");
var VALID_ROLES = ["pemilik", "admin", "staff"];
var VALID_STATUSES = ["aktif", "nonaktif", "diundang"];
async function onRequestGet8({ env, params, data }) {
  const t = data.auth.tenantId;
  const member = await env.DB.prepare(
    "SELECT id, name, email, role, status, created_at FROM users WHERE id=? AND tenant_id=?"
  ).bind(params.id, t).first();
  if (!member)
    return error("Anggota tim tidak ditemukan.", 404);
  const orders = await env.DB.prepare(
    `SELECT o.id, o.code, o.type, o.qty, o.deadline, o.production_status, o.payment_status, c.name AS customer
       FROM orders o LEFT JOIN customers c ON c.id = o.customer_id
      WHERE o.assignee_id=? AND o.tenant_id=?
      ORDER BY o.id DESC`
  ).bind(member.id, t).all();
  return json({ member, orders: orders.results });
}
__name(onRequestGet8, "onRequestGet8");
__name2(onRequestGet8, "onRequestGet");
async function onRequestPut4({ request, env, params, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  const DB = env.DB;
  const member = await DB.prepare(
    "SELECT id, name, email, role, status FROM users WHERE id=? AND tenant_id=?"
  ).bind(params.id, t).first();
  if (!member)
    return error("Anggota tim tidak ditemukan.", 404);
  const sets = [];
  const args = [];
  if (b.name !== void 0 || b.nama !== void 0) {
    sets.push("name=?");
    args.push(String(b.name || b.nama).trim());
  }
  if (b.email !== void 0) {
    sets.push("email=?");
    args.push(String(b.email).trim().toLowerCase());
  }
  if (b.role !== void 0 && VALID_ROLES.includes(b.role)) {
    sets.push("role=?");
    args.push(b.role);
  }
  if (b.status !== void 0 && VALID_STATUSES.includes(b.status)) {
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
__name(onRequestPut4, "onRequestPut4");
__name2(onRequestPut4, "onRequestPut");
async function onRequestDelete3({ env, params, data }) {
  const t = data.auth.tenantId;
  const DB = env.DB;
  const member = await DB.prepare("SELECT id, role FROM users WHERE id=? AND tenant_id=?").bind(params.id, t).first();
  if (!member)
    return error("Anggota tim tidak ditemukan.", 404);
  if (member.role === "pemilik")
    return error("Akun pemilik utama tidak dapat dihapus.", 403);
  await DB.batch([
    DB.prepare("UPDATE orders SET assignee_id=NULL WHERE assignee_id=? AND tenant_id=?").bind(member.id, t),
    DB.prepare("DELETE FROM sessions WHERE user_id=? AND tenant_id=?").bind(member.id, t),
    DB.prepare("DELETE FROM users WHERE id=? AND tenant_id=?").bind(member.id, t)
  ]);
  return json({ ok: true });
}
__name(onRequestDelete3, "onRequestDelete3");
__name2(onRequestDelete3, "onRequestDelete");
async function loadAccount(DB, tenantId, userId) {
  const u = await DB.prepare(
    "SELECT id, name, email, role, status, password_hash FROM users WHERE tenant_id=? AND (id=? OR ?=0) ORDER BY id ASC LIMIT 1"
  ).bind(tenantId, userId, userId).first();
  const tenant = await DB.prepare(
    "SELECT id, name, slug, email, phone, address, logo_url, plan FROM tenants WHERE id=?"
  ).bind(tenantId).first();
  return { u, tenant };
}
__name(loadAccount, "loadAccount");
__name2(loadAccount, "loadAccount");
function formatResponse(u, tenant) {
  return {
    user: u ? { id: u.id, nama: u.name, name: u.name, email: u.email, role: u.role, status: u.status } : null,
    tenant: tenant ? {
      id: tenant.id,
      nama: tenant.name,
      name: tenant.name,
      slug: tenant.slug,
      email: tenant.email,
      phone: tenant.phone,
      address: tenant.address,
      logo_url: tenant.logo_url,
      plan: tenant.plan
    } : null
  };
}
__name(formatResponse, "formatResponse");
__name2(formatResponse, "formatResponse");
async function onRequestGet9({ env, data }) {
  const t = data.auth.tenantId;
  const userId = data.auth.userId || 0;
  const { u, tenant } = await loadAccount(env.DB, t, userId);
  return json(formatResponse(u, tenant));
}
__name(onRequestGet9, "onRequestGet9");
__name2(onRequestGet9, "onRequestGet");
async function onRequestPut5({ request, env, data }) {
  const t = data.auth.tenantId;
  const userId = data.auth.userId || 0;
  const b = await readJson(request);
  const DB = env.DB;
  const { u } = await loadAccount(DB, t, userId);
  if (!u)
    return error("Pengguna tidak ditemukan.", 404);
  if (b.new_password !== void 0 && b.new_password !== "") {
    if (!b.old_password)
      return error("Kata sandi saat ini wajib diisi.");
    if (String(b.new_password).length < 6)
      return error("Kata sandi baru minimal 6 karakter.");
    const ok = await verifyPassword(String(b.old_password), u.password_hash);
    if (!ok)
      return error("Kata sandi saat ini tidak sesuai.", 401);
    const newHash = await hashPassword(String(b.new_password));
    await DB.prepare("UPDATE users SET password_hash=? WHERE id=? AND tenant_id=?").bind(newHash, u.id, t).run();
  }
  const nextName = b.name !== void 0 ? String(b.name).trim() : b.nama !== void 0 ? String(b.nama).trim() : null;
  const nextEmail = b.email !== void 0 ? String(b.email).trim() : null;
  if (nextName || nextEmail) {
    await DB.prepare("UPDATE users SET name=?, email=? WHERE id=? AND tenant_id=?").bind(nextName || u.name, nextEmail || u.email, u.id, t).run();
  }
  const tenantSets = [];
  const tenantArgs = [];
  if (b.tenant_name !== void 0 || b.usaha !== void 0) {
    tenantSets.push("name=?");
    tenantArgs.push(String(b.tenant_name || b.usaha).trim());
  }
  if (b.phone !== void 0) {
    tenantSets.push("phone=?");
    tenantArgs.push(b.phone ? String(b.phone).trim() : null);
  }
  if (b.address !== void 0) {
    tenantSets.push("address=?");
    tenantArgs.push(b.address ? String(b.address).trim() : null);
  }
  if (b.logo_url !== void 0) {
    tenantSets.push("logo_url=?");
    tenantArgs.push(b.logo_url ? String(b.logo_url).trim() : null);
  }
  if (tenantSets.length) {
    tenantArgs.push(t);
    await DB.prepare(`UPDATE tenants SET ${tenantSets.join(", ")} WHERE id=?`).bind(...tenantArgs).run();
  }
  const updated = await loadAccount(DB, t, u.id);
  return json({ ok: true, ...formatResponse(updated.u, updated.tenant) });
}
__name(onRequestPut5, "onRequestPut5");
__name2(onRequestPut5, "onRequestPut");
async function onRequestGet10({ request, env, data }) {
  const t = data.auth.tenantId;
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);
  let sql = `SELECT c.id, c.name, c.phone, c.email, c.address,
                    COUNT(o.id) AS order_count,
                    COALESCE(SUM(o.price),0) AS total_value
               FROM customers c LEFT JOIN orders o ON o.customer_id=c.id AND o.tenant_id=c.tenant_id
              WHERE c.tenant_id=?`;
  const args = [t];
  if (q) {
    sql += " AND (c.name LIKE ? OR c.phone LIKE ?)";
    args.push(`%${q}%`, `%${q}%`);
  }
  sql += " GROUP BY c.id ORDER BY c.name ASC LIMIT ? OFFSET ?";
  args.push(limit, offset);
  const rows = await env.DB.prepare(sql).bind(...args).all();
  return json({ data: rows.results });
}
__name(onRequestGet10, "onRequestGet10");
__name2(onRequestGet10, "onRequestGet");
async function onRequestPost4({ request, env, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  if (!b.name)
    return error("Nama customer wajib diisi.");
  const c = await env.DB.prepare(
    "INSERT INTO customers (tenant_id, name, phone, email, address, notes) VALUES (?,?,?,?,?,?) RETURNING id"
  ).bind(t, b.name, b.phone || null, b.email || null, b.address || null, b.notes || null).first();
  return json({ id: c.id }, 201);
}
__name(onRequestPost4, "onRequestPost4");
__name2(onRequestPost4, "onRequestPost");
async function onRequestGet11({ env, data }) {
  const DB = env.DB;
  const t = data.auth.tenantId;
  const aktif = await DB.prepare(
    "SELECT COUNT(*) AS n FROM orders WHERE tenant_id=? AND production_status NOT IN ('Selesai','Diambil')"
  ).bind(t).first();
  const selesai = await DB.prepare(
    "SELECT COUNT(*) AS n FROM orders WHERE tenant_id=? AND production_status IN ('Selesai','Diambil') AND strftime('%Y-%m', updated_at)=strftime('%Y-%m','now')"
  ).bind(t).first();
  const pemasukan = await DB.prepare(
    "SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE tenant_id=? AND strftime('%Y-%m', created_at)=strftime('%Y-%m','now')"
  ).bind(t).first();
  const deadline = await DB.prepare(
    "SELECT COUNT(*) AS n FROM orders WHERE tenant_id=? AND production_status NOT IN ('Selesai','Diambil') AND deadline IS NOT NULL AND date(deadline) <= date('now','+3 day')"
  ).bind(t).first();
  const recent = await DB.prepare(
    `SELECT o.id, o.code, o.type, o.qty, o.price, o.deadline, o.production_status, o.payment_status,
            c.name AS customer
       FROM orders o LEFT JOIN customers c ON c.id=o.customer_id
      WHERE o.tenant_id=? ORDER BY o.id DESC LIMIT 6`
  ).bind(t).all();
  const dist = await DB.prepare(
    "SELECT production_status AS status, COUNT(*) AS n FROM orders WHERE tenant_id=? GROUP BY production_status"
  ).bind(t).all();
  const alerts = await DB.prepare(
    `SELECT o.code, o.type, o.deadline, o.production_status, c.name AS customer
       FROM orders o LEFT JOIN customers c ON c.id=o.customer_id
      WHERE o.tenant_id=? AND o.production_status NOT IN ('Selesai','Diambil')
        AND o.deadline IS NOT NULL AND date(o.deadline) <= date('now','+3 day')
      ORDER BY date(o.deadline) ASC LIMIT 5`
  ).bind(t).all();
  return json({
    kpi: {
      pesananAktif: aktif.n,
      selesaiBulanIni: selesai.n,
      pemasukanBulanIni: pemasukan.total,
      mendekatiDeadline: deadline.n
    },
    recentOrders: recent.results,
    statusDistribution: dist.results,
    deadlineAlerts: alerts.results
  });
}
__name(onRequestGet11, "onRequestGet11");
__name2(onRequestGet11, "onRequestGet");
async function onRequestGet12({ env }) {
  let db = "unknown";
  try {
    const r = await env.DB.prepare("SELECT COUNT(*) AS n FROM tenants").first();
    db = `ok (${r.n} tenant)`;
  } catch (e) {
    db = "error: " + e.message;
  }
  return json({ ok: true, service: "tailorhub-api", db, time: (/* @__PURE__ */ new Date()).toISOString() });
}
__name(onRequestGet12, "onRequestGet12");
__name2(onRequestGet12, "onRequestGet");
async function onRequestGet13({ request, env, data }) {
  const t = data.auth.tenantId;
  const unread = new URL(request.url).searchParams.get("unread");
  let sql = "SELECT id, title, body, type, is_read, created_at FROM notifications WHERE tenant_id=?";
  if (unread === "1")
    sql += " AND is_read=0";
  sql += " ORDER BY id DESC LIMIT 50";
  const rows = await env.DB.prepare(sql).bind(t).all();
  const count = await env.DB.prepare("SELECT COUNT(*) AS n FROM notifications WHERE tenant_id=? AND is_read=0").bind(t).first();
  return json({ data: rows.results, unread: count.n });
}
__name(onRequestGet13, "onRequestGet13");
__name2(onRequestGet13, "onRequestGet");
async function onRequestPatch({ request, env, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  if (b.all) {
    await env.DB.prepare("UPDATE notifications SET is_read=1 WHERE tenant_id=?").bind(t).run();
  } else if (Array.isArray(b.ids) && b.ids.length) {
    const ph = b.ids.map(() => "?").join(",");
    await env.DB.prepare(`UPDATE notifications SET is_read=1 WHERE tenant_id=? AND id IN (${ph})`).bind(t, ...b.ids).run();
  }
  return json({ ok: true });
}
__name(onRequestPatch, "onRequestPatch");
__name2(onRequestPatch, "onRequestPatch");
async function onRequestGet14({ request, env, data }) {
  const t = data.auth.tenantId;
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const payment = url.searchParams.get("payment");
  const assigneeId = url.searchParams.get("assignee_id");
  const code = url.searchParams.get("code");
  const q = url.searchParams.get("q");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);
  let sql = `SELECT o.id, o.code, o.type, o.qty, o.detail, o.entry_date, o.deadline, o.price,
                    o.production_status, o.payment_status, o.customer_id, o.assignee_id, o.notes,
                    c.name AS customer, c.phone AS customer_phone, u.name AS assignee,
                    COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.order_id=o.id AND p.tenant_id=o.tenant_id), 0) AS paid_amount
               FROM orders o
               LEFT JOIN customers c ON c.id=o.customer_id
               LEFT JOIN users u ON u.id=o.assignee_id
              WHERE o.tenant_id=?`;
  const args = [t];
  if (status) {
    sql += " AND o.production_status=?";
    args.push(status);
  }
  if (payment) {
    sql += " AND o.payment_status=?";
    args.push(payment);
  }
  if (assigneeId) {
    if (assigneeId === "unassigned") {
      sql += " AND o.assignee_id IS NULL";
    } else {
      sql += " AND o.assignee_id=?";
      args.push(assigneeId);
    }
  }
  if (code) {
    sql += " AND UPPER(o.code)=UPPER(?)";
    args.push(code.trim());
  }
  if (q) {
    sql += " AND (o.code LIKE ? OR c.name LIKE ? OR o.type LIKE ?)";
    args.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  sql += " ORDER BY o.id DESC LIMIT ? OFFSET ?";
  args.push(limit, offset);
  const rows = await env.DB.prepare(sql).bind(...args).all();
  const total = await env.DB.prepare("SELECT COUNT(*) AS n FROM orders WHERE tenant_id=?").bind(t).first();
  return json({ data: rows.results, total: total.n });
}
__name(onRequestGet14, "onRequestGet14");
__name2(onRequestGet14, "onRequestGet");
async function onRequestPost5({ request, env, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  if (!b.type)
    return error("Jenis pesanan wajib diisi.");
  const DB = env.DB;
  let customerId = b.customer_id ? Number(b.customer_id) : null;
  if (!customerId && b.customer_name) {
    const c = await DB.prepare(
      "INSERT INTO customers (tenant_id, name, phone, address) VALUES (?,?,?,?) RETURNING id"
    ).bind(t, b.customer_name, b.customer_phone || null, b.customer_address || null).first();
    customerId = c.id;
  }
  const code = await nextOrderCode(DB, t);
  const price = Number(b.price) || 0;
  const paymentStatus = b.payment_status || "Belum Bayar";
  const o = await DB.prepare(
    `INSERT INTO orders (tenant_id, code, customer_id, type, qty, detail, entry_date, deadline, price, production_status, payment_status, assignee_id, notes)
     VALUES (?,?,?,?,?,?,?,?,?,'Antrean',?,?,?) RETURNING id`
  ).bind(
    t,
    code,
    customerId,
    b.type,
    Number(b.qty) || 1,
    b.detail || null,
    b.entry_date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    b.deadline || null,
    price,
    paymentStatus,
    b.assignee_id ? Number(b.assignee_id) : null,
    b.notes || null
  ).first();
  await DB.prepare(
    "INSERT INTO order_status_history (tenant_id, order_id, status, note, changed_by) VALUES (?,?,?,?,?)"
  ).bind(t, o.id, "Antrean", "Pesanan dibuat", data.auth.userId || null).run();
  if (b.initial_payment && Number(b.initial_payment) > 0) {
    const payType = Number(b.initial_payment) >= price && price > 0 ? "pelunasan" : "dp";
    await DB.prepare(
      "INSERT INTO payments (tenant_id, order_id, type, amount, method, paid_at) VALUES (?,?,?,?,?, date('now'))"
    ).bind(t, o.id, payType, Number(b.initial_payment), b.payment_method || "transfer").run();
    await recomputePaymentStatus(DB, t, o.id);
  }
  await DB.prepare(
    "INSERT INTO notifications (tenant_id, title, body, type) VALUES (?,?,?, 'info')"
  ).bind(t, "Pesanan baru masuk", `${code} \xB7 ${b.type}`).run();
  return json({ id: o.id, code }, 201);
}
__name(onRequestPost5, "onRequestPost5");
__name2(onRequestPost5, "onRequestPost");
async function onRequestGet15({ request, env, data }) {
  const t = data.auth.tenantId;
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order_id");
  let sql = `SELECT p.id, p.order_id, o.code, p.type, p.amount, p.method, p.paid_at, p.created_at
               FROM payments p JOIN orders o ON o.id=p.order_id
              WHERE p.tenant_id=?`;
  const args = [t];
  if (orderId) {
    sql += " AND p.order_id=?";
    args.push(orderId);
  }
  sql += " ORDER BY p.id DESC LIMIT 200";
  const rows = await env.DB.prepare(sql).bind(...args).all();
  const sum = await env.DB.prepare("SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE tenant_id=?").bind(t).first();
  return json({ data: rows.results, totalDiterima: sum.total });
}
__name(onRequestGet15, "onRequestGet15");
__name2(onRequestGet15, "onRequestGet");
async function onRequestPost6({ request, env, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  if (!b.order_id || !b.amount)
    return error("order_id dan amount wajib diisi.");
  const order = await env.DB.prepare("SELECT id FROM orders WHERE id=? AND tenant_id=?").bind(b.order_id, t).first();
  if (!order)
    return error("Pesanan tidak ditemukan.", 404);
  await env.DB.prepare(
    "INSERT INTO payments (tenant_id, order_id, type, amount, method, paid_at) VALUES (?,?,?,?,?, date('now'))"
  ).bind(t, b.order_id, b.type || "dp", b.amount, b.method || null).run();
  const status = await recomputePaymentStatus(env.DB, t, b.order_id);
  return json({ ok: true, payment_status: status }, 201);
}
__name(onRequestPost6, "onRequestPost6");
__name2(onRequestPost6, "onRequestPost");
var VALID_ROLES2 = ["pemilik", "admin", "staff"];
var VALID_STATUSES2 = ["aktif", "nonaktif", "diundang"];
async function onRequestGet16({ env, data }) {
  const t = data.auth.tenantId;
  const rows = await env.DB.prepare(
    `SELECT u.id, u.name, u.email, u.role, u.status, u.created_at,
            COUNT(CASE WHEN o.production_status NOT IN ('Selesai','Diambil') THEN o.id END) AS active_orders,
            COUNT(o.id) AS total_orders
       FROM users u
       LEFT JOIN orders o ON o.assignee_id = u.id AND o.tenant_id = u.tenant_id
      WHERE u.tenant_id=?
      GROUP BY u.id
      ORDER BY u.id ASC`
  ).bind(t).all();
  return json({ data: rows.results });
}
__name(onRequestGet16, "onRequestGet16");
__name2(onRequestGet16, "onRequestGet");
async function onRequestPost7({ request, env, data }) {
  const t = data.auth.tenantId;
  const b = await readJson(request);
  const name = (b.name || b.nama || "").trim();
  const email = (b.email || "").trim().toLowerCase();
  if (!name || !email)
    return error("Nama dan email anggota wajib diisi.");
  const role = VALID_ROLES2.includes(b.role) ? b.role : "staff";
  const status = VALID_STATUSES2.includes(b.status) ? b.status : "aktif";
  const rawPass = b.password && String(b.password).length >= 6 ? String(b.password) : "password123";
  const exists = await env.DB.prepare(
    "SELECT id FROM users WHERE tenant_id=? AND LOWER(email)=?"
  ).bind(t, email).first();
  if (exists)
    return error("Email anggota sudah terdaftar di usaha ini.", 409);
  const hash = await hashPassword(rawPass);
  const created = await env.DB.prepare(
    "INSERT INTO users (tenant_id, name, email, password_hash, role, status) VALUES (?,?,?,?,?,?) RETURNING id"
  ).bind(t, name, email, hash, role, status).first();
  await env.DB.prepare(
    "INSERT INTO notifications (tenant_id, title, body, type) VALUES (?,?,?, 'info')"
  ).bind(t, "Anggota tim ditambahkan", `${name} (${role})`).run();
  return json({ id: created.id, name, email, role, status }, 201);
}
__name(onRequestPost7, "onRequestPost7");
__name2(onRequestPost7, "onRequestPost");
var PUBLIC_PATHS = ["/api/health", "/api/auth/login", "/api/auth/register"];
async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "OPTIONS")
    return cors(new Response(null, { status: 204 }));
  if (!env.DB) {
    return cors(json({ error: "Binding D1 'DB' tidak ditemukan. Cek wrangler.toml & database_id." }, 500));
  }
  const path = new URL(request.url).pathname;
  let auth = null;
  const token = getToken(request);
  if (token) {
    auth = await env.DB.prepare(
      `SELECT s.user_id AS userId, s.tenant_id AS tenantId, u.role, u.name
         FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.token = ? AND s.expires_at > datetime('now')`
    ).bind(token).first();
  }
  if (!auth && env.DEV_TENANT_ID) {
    auth = { userId: 0, tenantId: Number(env.DEV_TENANT_ID), role: "pemilik", name: "Dev" };
  }
  context.data.auth = auth;
  const isPublic = PUBLIC_PATHS.includes(path) || path.startsWith("/api/public/");
  if (!isPublic && !auth) {
    return cors(json({ error: "Tidak terotorisasi. Silakan login terlebih dahulu." }, 401));
  }
  const res = await context.next();
  return cors(res);
}
__name(onRequest, "onRequest");
__name2(onRequest, "onRequest");
var routes = [
  {
    routePath: "/api/auth/login",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/auth/logout",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/auth/me",
    mountPath: "/api/auth",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/auth/register",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/public/track",
    mountPath: "/api/public",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/reports/income",
    mountPath: "/api/reports",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/reports/orders",
    mountPath: "/api/reports",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/settings/tenant",
    mountPath: "/api/settings",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/settings/tenant",
    mountPath: "/api/settings",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut]
  },
  {
    routePath: "/api/customers/:id",
    mountPath: "/api/customers",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/customers/:id",
    mountPath: "/api/customers",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/api/customers/:id",
    mountPath: "/api/customers",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut2]
  },
  {
    routePath: "/api/orders/:id",
    mountPath: "/api/orders",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete2]
  },
  {
    routePath: "/api/orders/:id",
    mountPath: "/api/orders",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet7]
  },
  {
    routePath: "/api/orders/:id",
    mountPath: "/api/orders",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut3]
  },
  {
    routePath: "/api/team/:id",
    mountPath: "/api/team",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete3]
  },
  {
    routePath: "/api/team/:id",
    mountPath: "/api/team",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet8]
  },
  {
    routePath: "/api/team/:id",
    mountPath: "/api/team",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut4]
  },
  {
    routePath: "/api/account",
    mountPath: "/api/account",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet9]
  },
  {
    routePath: "/api/account",
    mountPath: "/api/account",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut5]
  },
  {
    routePath: "/api/customers",
    mountPath: "/api/customers",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet10]
  },
  {
    routePath: "/api/customers",
    mountPath: "/api/customers",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/dashboard",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet11]
  },
  {
    routePath: "/api/health",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet12]
  },
  {
    routePath: "/api/notifications",
    mountPath: "/api/notifications",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet13]
  },
  {
    routePath: "/api/notifications",
    mountPath: "/api/notifications",
    method: "PATCH",
    middlewares: [],
    modules: [onRequestPatch]
  },
  {
    routePath: "/api/orders",
    mountPath: "/api/orders",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet14]
  },
  {
    routePath: "/api/orders",
    mountPath: "/api/orders",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/payments",
    mountPath: "/api/payments",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet15]
  },
  {
    routePath: "/api/payments",
    mountPath: "/api/payments",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/team",
    mountPath: "/api/team",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet16]
  },
  {
    routePath: "/api/team",
    mountPath: "/api/team",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  },
  {
    routePath: "/api",
    mountPath: "/api",
    method: "",
    middlewares: [onRequest],
    modules: []
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: () => {
            isFailOpen = true;
          }
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error2) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error2;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error2 = reduceError(e);
    return Response.json(error2, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = /* @__PURE__ */ __name(class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
}, "__Facade_ScheduledController__");
__name2(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error2 = reduceError2(e);
    return Response.json(error2, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-0jbuWe/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-0jbuWe/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__2, "__Facade_ScheduledController__");
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.2606283814583954.js.map
