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

    // --- Deadline ---
    daysUntil: function (dateStr) {
      if (!dateStr) return null;
      var s = String(dateStr).trim();
      var d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(s + "T00:00:00") : new Date(s);
      if (isNaN(d.getTime())) return null;
      d.setHours(0, 0, 0, 0);
      var now = new Date();
      now.setHours(0, 0, 0, 0);
      return Math.round((d - now) / 86400000);
    },
    formatShortDate: function (dateStr, withYear) {
      if (!dateStr) return "—";
      var s = String(dateStr).trim();
      var d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(s + "T00:00:00") : new Date(s);
      if (isNaN(d.getTime())) return s;
      var months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      var day = (d.getDate() < 10 ? "0" : "") + d.getDate();
      var base = day + " " + months[d.getMonth()];
      return withYear ? base + " " + d.getFullYear() : base;
    },
    deadlineMeta: function (deadline, productionStatus) {
      if (productionStatus === "Selesai") {
        return {
          cat: "normal", cls: "chip--done", kanbanCls: "", icon: "i-check",
          text: deadline ? TH.formatShortDate(deadline) : "Selesai",
          chipText: "Siap Diambil", detailText: "Siap Diambil"
        };
      }
      if (productionStatus === "Diambil") {
        var shortD = deadline ? TH.formatShortDate(deadline) : "";
        return {
          cat: "normal", cls: "chip--taken", kanbanCls: "", icon: "i-check",
          text: shortD || "Diambil",
          chipText: shortD ? "Diambil " + shortD : "Diambil",
          detailText: deadline ? "Diambil " + TH.formatShortDate(deadline, true) : "Sudah Diambil"
        };
      }
      var dd = TH.daysUntil(deadline);
      if (dd === null) {
        return {
          cat: "normal", cls: "chip--soft", kanbanCls: "", icon: "i-clock",
          text: "—", chipText: "—", detailText: "Deadline: —"
        };
      }
      if (dd < 0) {
        var lateDays = Math.abs(dd);
        return {
          cat: "late", cls: "chip--danger", kanbanCls: "is-late", icon: "i-warn",
          text: lateDays + " hr lewat",
          chipText: "Lewat " + lateDays + " hari",
          detailText: "Lewat Deadline (-" + lateDays + " hari)"
        };
      }
      if (dd === 0) {
        return {
          cat: "soon", cls: "chip--clay", kanbanCls: "is-soon", icon: "i-clock",
          text: "Hari ini",
          chipText: "Hari ini",
          detailText: "Deadline: Hari ini · " + TH.formatShortDate(deadline, true)
        };
      }
      if (dd === 1) {
        return {
          cat: "soon", cls: "chip--clay", kanbanCls: "is-soon", icon: "i-clock",
          text: TH.formatShortDate(deadline),
          chipText: "Besok (H-1)",
          detailText: "Deadline: Besok · " + TH.formatShortDate(deadline, true)
        };
      }
      if (dd <= 3) {
        var shortSoon = TH.formatShortDate(deadline);
        return {
          cat: "soon", cls: "chip--clay", kanbanCls: "is-soon", icon: "i-clock",
          text: shortSoon,
          chipText: shortSoon + " (H-" + dd + ")",
          detailText: "Deadline: " + TH.formatShortDate(deadline, true) + " (H-" + dd + ")"
        };
      }
      return {
        cat: "normal", cls: "chip--soft", kanbanCls: "", icon: "i-clock",
        text: TH.formatShortDate(deadline),
        chipText: TH.formatShortDate(deadline, true),
        detailText: "Deadline: " + TH.formatShortDate(deadline, true)
      };
    },
    countUrgentDeadlines: function (orders) {
      return (orders || []).filter(function (o) {
        var cat = TH.deadlineMeta(o.deadline, o.production_status).cat;
        return cat === "late" || cat === "soon";
      }).length;
    },

    // --- Safe DOM helpers ---
    el: function (tag, attrs, children) {
      var node = document.createElement(tag);
      if (attrs) {
        Object.keys(attrs).forEach(function (k) {
          var v = attrs[k];
          if (v == null || v === false) return;
          if (k === "className") node.className = v;
          else if (k === "text") node.textContent = v;
          else node.setAttribute(k, String(v));
        });
      }
      if (children != null) {
        var list = Array.isArray(children) ? children : [children];
        list.forEach(function (c) {
          if (c == null || c === false) return;
          node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
        });
      }
      return node;
    },
    svgUse: function (iconId, size) {
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", String(size || 14));
      svg.setAttribute("height", String(size || 14));
      var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", "#" + iconId);
      svg.appendChild(use);
      return svg;
    },
    chipEl: function (cls, text) {
      return TH.el("span", { className: "chip " + cls }, [
        TH.el("span", { className: "d" }),
        text
      ]);
    },
    populateStaffSelect: function (sel, orders) {
      if (!sel) return;
      var current = sel.value;
      sel.textContent = "";
      sel.appendChild(TH.el("option", { value: "", text: "Semua Staf" }));
      var seen = {};
      (orders || []).forEach(function (o) {
        if (o.assignee) {
          var init = TH.initials(o.assignee);
          if (!seen[init]) {
            seen[init] = 1;
            sel.appendChild(TH.el("option", { value: init, text: o.assignee + " (" + init + ")" }));
          }
        }
      });
      sel.appendChild(TH.el("option", { value: "unassigned", text: "Belum Ditugaskan" }));
      if (current) sel.value = current;
    },

    // --- Log Catatan Produksi (Shared) ---
    ROLE_LABELS: { pemilik: "Pemilik", admin: "Admin", staff: "Staf Produksi" },
    formatNoteTime: function (str) {
      if (!str) return "Baru saja";
      var m = String(str).match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/);
      if (m) return TH.formatShortDate(m[1], true) + " · " + m[2];
      return str;
    },
    buildNoteItemEl: function (n) {
      var roleText = TH.ROLE_LABELS[n.author_role] || "";
      var authorLabel = (n.author_name || "Tim Produksi") + (roleText ? " (" + roleText + ")" : "");
      return TH.el("div", { className: "note-item" }, [
        TH.el("div", { className: "note-head" }, [
          TH.el("b", { text: authorLabel }),
          TH.el("span", { text: TH.formatNoteTime(n.created_at) })
        ]),
        TH.el("p", { text: n.body || "" })
      ]);
    },
    renderNotesList: function (containerEl, notes, emptyText) {
      if (!containerEl) return;
      containerEl.textContent = "";
      if (!Array.isArray(notes) || !notes.length) {
        containerEl.appendChild(TH.el("div", { className: "note-item note-empty" }, [
          TH.el("p", {
            style: "color:var(--ink-45);",
            text: emptyText || "Belum ada catatan produksi untuk pesanan ini."
          })
        ]));
        return;
      }
      var frag = document.createDocumentFragment();
      notes.forEach(function (n) { frag.appendChild(TH.buildNoteItemEl(n)); });
      containerEl.appendChild(frag);
    },
    prependNoteItem: function (containerEl, note) {
      if (!containerEl || !note) return;
      var emptyEl = containerEl.querySelector(".note-empty");
      if (emptyEl) emptyEl.remove();
      containerEl.insertBefore(TH.buildNoteItemEl(note), containerEl.firstChild);
    },
    bindOrderNoteForm: function (opts) {
      if (!opts || !opts.formEl || !opts.inputEl || !opts.listEl) return;
      opts.formEl.addEventListener("submit", async function (e) {
        e.preventDefault();
        var val = opts.inputEl.value.trim();
        if (!val) return;
        var submitBtn = opts.formEl.querySelector('button[type="submit"]');
        var code = typeof opts.getCode === "function" ? opts.getCode() : "";
        if (!code) return;
        if (submitBtn) submitBtn.disabled = true;
        try {
          var res = await TH.post("/api/orders/" + encodeURIComponent(code) + "/notes", { body: val });
          TH.prependNoteItem(opts.listEl, (res && res.note) || { body: val, author_name: "Anda" });
          opts.inputEl.value = "";
          if (typeof opts.onSaved === "function") opts.onSaved(res && res.note);
        } catch (err) {
          if (typeof opts.onError === "function") opts.onError(err);
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    },
  };

  global.TH = TH;
})(window);
