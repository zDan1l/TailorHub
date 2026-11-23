// GET /api/reports/orders — agregasi laporan pesanan, distribusi status produksi, kategori busana, dan ketepatan deadline
import { json } from "../_utils.js";

export async function onRequestGet({ env, data }) {
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
  const ontimePct = total > 0 ? Math.max(0, Math.round(((total - terlambat) / total) * 1000) / 10) : 100;

  return json({
    kpi: {
      totalPesanan: total,
      totalOmzet,
      pesananSelesai: summary ? summary.selesai : 0,
      pesananAktif: summary ? summary.aktif : 0,
      terlambat,
      mendekatiDeadline: summary ? summary.mendekati_deadline : 0,
      aov,
      ontimePct,
    },
    byStatus: byStatus.results,
    byType: byType.results,
    byStaff: byStaff.results,
    orders: orders.results,
  });
}
