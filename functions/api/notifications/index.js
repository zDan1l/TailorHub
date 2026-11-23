// GET   /api/notifications            — daftar notifikasi (filter: unread=1)
// PATCH /api/notifications             — tandai semua / sebagian dibaca
//        body: { ids: [1,2] }  atau  { all: true }
import { json, readJson } from "../_utils.js";

export async function onRequestGet({ request, env, data }) {
  const t = data.auth.tenantId;
  const unread = new URL(request.url).searchParams.get("unread");
  let sql = "SELECT id, title, body, type, is_read, created_at FROM notifications WHERE tenant_id=?";
  if (unread === "1") sql += " AND is_read=0";
  sql += " ORDER BY id DESC LIMIT 50";
  const rows = await env.DB.prepare(sql).bind(t).all();
  const count = await env.DB.prepare("SELECT COUNT(*) AS n FROM notifications WHERE tenant_id=? AND is_read=0").bind(t).first();
  return json({ data: rows.results, unread: count.n });
}

export async function onRequestPatch({ request, env, data }) {
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
