/* ============================================================
   TailorHub — App Shell (sidebar + topbar) TUNGGAL
   Sumber kebenaran satu-satunya untuk kerangka halaman internal.
   Dipakai semua halaman app/ & account/:
     <aside class="side" id="appSidebar"></aside>   (di dalam .app)
     <header class="top" id="appTopbar"></header>   (di dalam .main)
     <script src="/assets/js/app-shell.js"></script> (sebelum </body>)
   Menu otomatis difilter sesuai PERAN user (Pemilik/Admin/Staff).
   ============================================================ */
(function () {
  "use strict";

  // ---------- Definisi menu (sumber tunggal) ----------
  var MENU = [
    { sec: "Utama", items: [
      { label: "Dashboard", icon: "i-home",     href: "/app/dashboard.html",        match: "/app/dashboard", roles: ["pemilik", "admin", "staff"] },
      { label: "Pesanan",   icon: "i-order",    href: "/app/orders/index.html",     match: "/app/orders",    roles: ["pemilik", "admin"] },
      { label: "Produksi",  icon: "i-scissors", href: "/app/production/board.html",  match: "/app/production",roles: ["pemilik", "admin", "staff"] },
      { label: "Tugas Saya",icon: "i-clipboard",href: "/app/staff/my-tasks.html",    match: "/app/staff",     roles: ["staff"] },
      { label: "Customer",  icon: "i-users",    href: "/app/customers/index.html",   match: "/app/customers", roles: ["pemilik", "admin"] },
    ]},
    { sec: "Keuangan", items: [
      { label: "Pembayaran",icon: "i-pay",      href: "/app/payments/index.html",    match: "/app/payments",  roles: ["pemilik", "admin"] },
      { label: "Laporan",   icon: "i-chart",    href: "/app/reports/index.html",     match: "/app/reports",   roles: ["pemilik", "admin"] },
    ]},
    { sec: "Akun", items: [
      { label: "Notifikasi",icon: "i-bell",     href: "/app/notifications/index.html",match: "/app/notifications", roles: ["pemilik", "admin", "staff"], badge: true },
      { label: "Tim",       icon: "i-team",     href: "/app/team/index.html",        match: "/app/team",      roles: ["pemilik"] },
      { label: "Pengaturan",icon: "i-gear",     href: "/app/settings/tenant.html",   match: "/app/settings",  roles: ["pemilik"] },
    ]},
  ];

  var ROLE_LABEL = { pemilik: "Pemilik", admin: "Admin", staff: "Staff" };

  // ---------- Ikon (mandiri, tak bergantung sprite halaman) ----------
  var SPRITE =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<symbol id="sh-i-home" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></symbol>' +
    '<symbol id="sh-i-order" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 3.6h9a1.8 1.8 0 0 1 1.8 1.8v13.2a1.8 1.8 0 0 1-1.8 1.8h-9a1.8 1.8 0 0 1-1.8-1.8V5.4a1.8 1.8 0 0 1 1.8-1.8Z"/><path d="M9.3 3.6V2.4h5.4v1.2"/><path d="M8.9 9.1h6.2M8.9 12.4h6.2M8.9 15.7h3.7"/></symbol>' +
    '<symbol id="sh-i-scissors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.1" cy="18" r="2.6"/><circle cx="17.9" cy="18" r="2.6"/><path d="M7.9 16.1 18.6 4.2M16.1 16.1 5.4 4.2"/></symbol>' +
    '<symbol id="sh-i-clipboard" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="4.5" width="11" height="16" rx="2"/><path d="M9 4.5V3h6v1.5"/><path d="m9.3 12.2 2 2 3.6-3.6"/></symbol>' +
    '<symbol id="sh-i-users" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 19.5c0-3.3 2.9-5.6 6.5-5.6s6.5 2.3 6.5 5.6"/></symbol>' +
    '<symbol id="sh-i-team" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="9" r="2.5"/><circle cx="16" cy="9" r="2.5"/><path d="M3.5 19c0-2.4 2-4.1 4.5-4.1s4.5 1.7 4.5 4.1"/><path d="M14.5 15.1c2.2.2 4 1.9 4 3.9"/></symbol>' +
    '<symbol id="sh-i-pay" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.4 7.6a2 2 0 0 1 2-2h13.2a2 2 0 0 1 2 2v8.8a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2Z"/><path d="M3.4 10.2h17.2"/><path d="M6.6 14.6h3.1M13.6 14.6h3.8"/></symbol>' +
    '<symbol id="sh-i-chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 20.4h16.8"/><rect x="5.2" y="12.1" width="3.5" height="8.3" rx="1.1"/><rect x="10.3" y="7.4" width="3.5" height="13" rx="1.1"/><rect x="15.4" y="3.6" width="3.5" height="16.8" rx="1.1"/></symbol>' +
    '<symbol id="sh-i-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.2 10.3a5.8 5.8 0 1 1 11.6 0c0 3.4.9 5.1 1.9 6.1H4.3c1-1 1.9-2.7 1.9-6.1Z"/><path d="M10 19.3a2.3 2.3 0 0 0 4 0"/></symbol>' +
    '<symbol id="sh-i-gear" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.3"/><path d="M12 2.6v2.6M12 18.8v2.6M21.4 12h-2.6M5.2 12H2.6M18.6 5.4l-1.9 1.9M7.3 16.7l-1.9 1.9M18.6 18.6l-1.9-1.9M7.3 7.3 5.4 5.4"/></symbol>' +
    '<symbol id="sh-i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></symbol>' +
    '<symbol id="sh-i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>' +
    '<symbol id="sh-i-logout" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8"/><path d="M18 12H9"/><path d="m15 9 3 3-3 3"/></symbol>' +
    "</defs></svg>";

  function ic(name, size) {
    return '<svg width="' + (size || 19) + '" height="' + (size || 19) + '" aria-hidden="true"><use href="#sh-' + name + '"/></svg>';
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function initials(name) {
    var p = String(name || "").trim().split(/\s+/);
    if (!p[0]) return "TH";
    return (p.length > 1 ? p[0][0] + p[1][0] : p[0].slice(0, 2)).toUpperCase();
  }
  function tokenHeader() {
    try { var t = localStorage.getItem("th_token"); return t ? { Authorization: "Bearer " + t } : {}; }
    catch (e) { return {}; }
  }

  function currentPath() {
    return (location.pathname || "").replace(/\/index\.html$/, "/").toLowerCase();
  }
  function isActive(item) {
    var p = currentPath();
    if (item.match === "/app/dashboard") return p.indexOf("/app/dashboard") > -1 || p.indexOf("/app/search") > -1;
    return p.indexOf(item.match) > -1;
  }

  // ---------- Render sidebar ----------
  function renderSidebar(role, info) {
    var brand =
      '<a class="side-brand" href="/app/dashboard.html" aria-label="TailorHub">' +
      '<svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">' +
      '<rect width="40" height="40" rx="12" fill="#C05424"/>' +
      '<path d="M13.2 27.6 25.6 11.8" stroke="#FFF8EF" stroke-width="2.4" stroke-linecap="round"/>' +
      '<circle cx="26.4" cy="10.8" r="2.1" fill="none" stroke="#FFF8EF" stroke-width="2"/>' +
      '<circle cx="30.4" cy="28.6" r="2.6" fill="#495ECD"/></svg>' +
      "<span>Tailor<em>Hub</em></span></a>";

    var nav = "<nav>";
    MENU.forEach(function (group) {
      var vis = group.items.filter(function (it) { return it.roles.indexOf(role) > -1; });
      if (!vis.length) return;
      nav += '<div class="side-sec">' + esc(group.sec) + "</div>";
      vis.forEach(function (it) {
        var badge = it.badge ? '<span class="n-badge" data-badge="notif" hidden></span>' : "";
        nav += '<a class="nav-i' + (isActive(it) ? " is-on" : "") + '" href="' + it.href + '">' +
          ic(it.icon) + " " + esc(it.label) + badge + "</a>";
      });
    });
    nav += "</nav>";

    var tenant = (info && info.tenant && (info.tenant.nama || info.tenant.name)) || "";
    var name = (info && info.user && (info.user.nama || info.user.name)) || "Pengguna";
    var roleName = ROLE_LABEL[role] || "Pengguna";

    var foot =
      '<div class="side-foot">' +
      '<a class="side-user" href="/account/profile.html">' +
      '<span class="side-ava">' + esc(initials(name)) + "</span>" +
      "<span class=\"side-user-meta\"><b>" + esc(name) + "</b><small>" + esc(roleName) + (tenant ? " · " + esc(tenant) : "") + "</small></span>" +
      "</a>" +
      '<button type="button" class="side-logout" id="shLogout" aria-label="Keluar">' + ic("i-logout", 18) + "<span>Keluar</span></button>" +
      "</div>";

    return brand + nav + foot;
  }

  // ---------- Render topbar ----------
  function renderTopbar(info) {
    var name = (info && info.user && (info.user.nama || info.user.name)) || "Pengguna";
    return (
      '<button class="burger" id="shBurger" aria-label="Buka menu">' + ic("i-menu", 24) + "</button>" +
      '<form class="search" action="/app/search.html" method="GET" role="search">' +
      ic("i-search", 18) +
      '<input type="search" name="q" placeholder="Cari pesanan, customer, kode…" aria-label="Cari">' +
      "</form>" +
      '<div class="top-actions">' +
      '<a href="/app/notifications/index.html" class="icon-btn" aria-label="Notifikasi">' + ic("i-bell", 20) + '<span class="dot" data-badge="dot" hidden></span></a>' +
      '<a href="/account/profile.html" class="top-avatar" title="' + esc(name) + '">' + esc(initials(name)) + "</a>" +
      "</div>"
    );
  }

  // ---------- Auth ----------
  async function fetchMe() {
    try {
      var r = await fetch("/api/auth/me", { headers: tokenHeader() });
      if (r.status === 401) return null;           // belum login (server nyata)
      if (!r.ok) return "offline";                 // API tak tersedia (mis. Live Server)
      return await r.json();
    } catch (e) { return "offline"; }
  }
  function logout() {
    try { fetch("/api/auth/logout", { method: "POST", headers: tokenHeader() }); } catch (e) {}
    try { localStorage.removeItem("th_token"); localStorage.removeItem("th_user"); } catch (e) {}
    location.href = "/auth/login.html";
  }

  // ---------- Badge notifikasi ----------
  async function loadBadges() {
    try {
      var r = await fetch("/api/notifications?unread=1", { headers: tokenHeader() });
      if (!r.ok) return;
      var d = await r.json();
      var n = d && d.unread ? d.unread : 0;
      document.querySelectorAll('[data-badge="notif"]').forEach(function (el) {
        if (n > 0) { el.textContent = n > 99 ? "99+" : n; el.hidden = false; } else { el.hidden = true; }
      });
      document.querySelectorAll('[data-badge="dot"]').forEach(function (el) { el.hidden = n === 0; });
    } catch (e) {}
  }

  // ---------- Wiring (burger, scrim, logout) ----------
  function wire() {
    var app = document.querySelector(".app");
    if (!app) return;
    var scrim = app.querySelector(".scrim");
    if (!scrim) { scrim = document.createElement("div"); scrim.className = "scrim"; app.insertBefore(scrim, app.firstChild); }
    var burger = document.getElementById("shBurger");
    if (burger) burger.addEventListener("click", function () { app.classList.toggle("nav-open"); });
    scrim.addEventListener("click", function () { app.classList.remove("nav-open"); });
    app.querySelectorAll(".side a").forEach(function (a) {
      a.addEventListener("click", function () { app.classList.remove("nav-open"); });
    });
    var lo = document.getElementById("shLogout");
    if (lo) lo.addEventListener("click", logout);
  }

  // ---------- Init ----------
  async function init() {
    var side = document.getElementById("appSidebar");
    var top = document.getElementById("appTopbar");
    if (!side && !top) return; // bukan halaman shell

    document.body.insertAdjacentHTML("afterbegin", SPRITE);

    var info = await fetchMe();
    if (info === null) { location.href = "/auth/login.html"; return; }
    if (info === "offline" || !info) info = { user: { nama: "Pengguna", role: "pemilik" }, tenant: {} };
    var role = (info.user && info.user.role) || "pemilik";

    if (side) side.innerHTML = renderSidebar(role, info);
    if (top) top.innerHTML = renderTopbar(info);
    wire();
    loadBadges();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
