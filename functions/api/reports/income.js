// GET /api/reports/income — agregasi laporan pemasukan, metode bayar, DP vs pelunasan, dan piutang
import { json } from "../_utils.js";

export async function onRequestGet({ env, data }) {
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
      pesananBelumLunas: orderValueRow ? orderValueRow.unpaid_orders : 0,
    },
    byMethod: byMethod.results,
    payments: recentPayments.results,
  });
}
