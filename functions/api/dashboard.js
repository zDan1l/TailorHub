// GET /api/dashboard — ringkasan untuk halaman dashboard
import { json } from "./_utils.js";

export async function onRequestGet({ env, data }) {
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
      mendekatiDeadline: deadline.n,
    },
    recentOrders: recent.results,
    statusDistribution: dist.results,
    deadlineAlerts: alerts.results,
  });
}
