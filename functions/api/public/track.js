// GET /api/public/track?slug=<tenant>&code=<kode>  — pelacakan publik (tanpa login)
// Dipakai portal customer. Hanya mengembalikan info status, bukan data sensitif.
import { json, error } from "../_utils.js";

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  const code = (url.searchParams.get("code") || "").trim().toUpperCase();
  if (!slug || !code) return error("Parameter 'slug' dan 'code' wajib diisi.");

  const tenant = await env.DB.prepare("SELECT id, name FROM tenants WHERE slug=?").bind(slug).first();
  if (!tenant) return error("Usaha tidak ditemukan.", 404);

  const order = await env.DB.prepare(
    `SELECT o.code, o.type, o.qty, o.deadline, o.production_status, o.payment_status, c.name AS customer
       FROM orders o LEFT JOIN customers c ON c.id=o.customer_id
      WHERE o.tenant_id=? AND o.code=?`
  ).bind(tenant.id, code).first();
  if (!order) return error("Kode pesanan tidak ditemukan.", 404);

  const history = await env.DB.prepare(
    "SELECT status, created_at FROM order_status_history h WHERE h.tenant_id=? AND h.order_id=(SELECT id FROM orders WHERE tenant_id=? AND code=?) ORDER BY h.id ASC"
  ).bind(tenant.id, tenant.id, code).all();

  return json({
    usaha: tenant.name,
    pesanan: {
      kode: order.code, jenis: order.type, jumlah: order.qty,
      customer: order.customer, deadline: order.deadline,
      statusProduksi: order.production_status, statusBayar: order.payment_status,
    },
    riwayat: history.results,
  });
}
