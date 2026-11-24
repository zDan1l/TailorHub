/* ============================================================
   TailorHub — Helper API frontend (vanilla JS)
   Dipakai halaman app/ dan portal/ untuk bicara ke Pages Functions.
   Muat SEBELUM skrip halaman:
     <script src="/assets/js/api.js"></script>
   Lalu panggil: TH.get('/api/orders'), TH.post('/api/orders', {...}), dst.
   ============================================================ */
(function (global) {
  "use strict";

  var TOKEN_KEY = "th_token";
  var USER_KEY = "th_user";

  function token() {
    try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; }
  }
  function setSession(data) {
    try {
      if (data && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      if (data && data.user) localStorage.setItem(USER_KEY, JSON.stringify({ user: data.user, tenant: data.tenant }));
    } catch (e) {}
  }
  function currentUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch (e) { return null; }
  }
  function clearSession() {
    try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); } catch (e) {}
  }

  async function request(method, path, body) {
    var headers = { "Content-Type": "application/json" };
    var tk = token();
    if (tk) headers["Authorization"] = "Bearer " + tk;
    var res = await fetch(path, {
      method: method,
      headers: headers,
      body: body != null ? JSON.stringify(body) : undefined,
    });
    var data = null;
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) {
      var msg = (data && data.error) || ("Gagal (" + res.status + ")");
      if (res.status === 401) { clearSession(); }
      var err = new Error(msg); err.status = res.status; err.data = data;
      throw err;
    }
    return data;
  }

  var TH = {
    get: function (p) { return request("GET", p); },
    post: function (p, b) { return request("POST", p, b); },
    put: function (p, b) { return request("PUT", p, b); },
    patch: function (p, b) { return request("PATCH", p, b); },
    del: function (p) { return request("DELETE", p); },
    api: function (p, opts) {
      opts = opts || {};
      return request(opts.method || "GET", p, opts.body);
    },
    initials: function (name) {
      var parts = String(name || "").trim().split(/\s+/);
      if (!parts[0]) return "TH";
      return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
    },

    // --- Auth ---
    login: async function (email, password) {
      var d = await request("POST", "/api/auth/login", { email: email, password: password });
      setSession(d); return d;
    },
    register: async function (payload) {
      var d = await request("POST", "/api/auth/register", payload);
      setSession(d); return d;
    },
    logout: async function () {
      try { await request("POST", "/api/auth/logout"); } catch (e) {}
      clearSession();
    },
    me: currentUser,
    isLoggedIn: function () { return !!token(); },
    /* Panggil di atas halaman app/: jika belum login, lempar ke login. */
    requireAuth: function () {
      if (!token()) { location.href = "/auth/login.html"; return false; }
      return true;
    },

    // --- Format ---
    rupiah: function (n) {
      n = Number(n) || 0;
      return "Rp" + n.toLocaleString("id-ID");
    },
    /* kelas chip SOLID sesuai style-guide (lihat Peta Status). */
    statusChip: function (status) {
      var map = {
        "Antrean": "chip--queue", "Pemotongan": "chip--cut", "Penjahitan": "chip--sew",
        "Finishing": "chip--finish", "QC": "chip--qc", "Selesai": "chip--done", "Diambil": "chip--taken",
        "Belum Bayar": "chip--unpaid", "DP": "chip--dp", "Lunas": "chip--paid",
      };
      return map[status] || "chip--soft";
    },
    /* escape teks agar aman dimasukkan ke innerHTML */
    esc: function (s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    },
  };

  global.TH = TH;
})(window);
