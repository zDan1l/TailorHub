/* ============================================================
   TAILORHUB — APP JS
   Script bersama untuk semua halaman internal (app/ & account/).
   ============================================================ */

(function () {
  var app    = document.getElementById('app');
  var burger = document.getElementById('burger');
  var scrim  = document.getElementById('scrim');

  /* ---- Sidebar toggle (mobile) ---- */
  if (burger && app) {
    burger.addEventListener('click', function () {
      app.classList.toggle('nav-open');
    });
  }

  if (scrim && app) {
    scrim.addEventListener('click', function () {
      app.classList.remove('nav-open');
    });
  }

  /* ---- Toast auto-hide (3 detik) ---- */
  var toast = document.getElementById('toast');
  if (toast) {
    setTimeout(function () {
      toast.style.transition = 'opacity .4s, transform .4s';
      toast.style.opacity    = '0';
      toast.style.transform  = 'translateY(16px)';
      setTimeout(function () { toast.remove(); }, 420);
    }, 3200);
  }

  /* ---- Tooltip hover pada chart batang ---- */
  var chart   = document.getElementById('incomeChart');
  var tip     = document.getElementById('chartTip');
  var tipLbl  = document.getElementById('chartTipLabel');
  var tipVal  = document.getElementById('chartTipVal');

  if (chart && tip) {
    var bars = chart.querySelectorAll('rect.bar');
    bars.forEach(function (bar) {
      bar.addEventListener('mouseenter', function (e) {
        tipLbl.textContent = bar.dataset.label || '';
        tipVal.textContent = bar.dataset.val   || '';
        /* posisi tooltip relatif terhadap wrapper parent */
        var wrap    = chart.parentElement;
        var wrapR   = wrap.getBoundingClientRect();
        var barR    = bar.getBoundingClientRect();
        var left    = barR.left - wrapR.left + barR.width / 2;
        var top     = barR.top  - wrapR.top;
        tip.style.left    = left + 'px';
        tip.style.top     = top  + 'px';
        tip.style.display = 'block';
      });
      bar.addEventListener('mouseleave', function () {
        tip.style.display = 'none';
      });
    });
  }

  /* ---- Global Topbar Search Form Normalization (submit native GET ke /app/search.html) ---- */
  var topSearchForms = document.querySelectorAll('header.top form.search');
  topSearchForms.forEach(function (form) {
    form.setAttribute('action', '/app/search.html');
    form.setAttribute('method', 'GET');
  });

  /* ---- Sinkronisasi Identitas User & Tenant di App Shell (Sidebar & Topbar) ---- */
  function initials(name) {
    var parts = String(name || '').trim().split(/\s+/);
    if (!parts[0]) return 'TH';
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }

  function applyShellUser(info) {
    if (!info || !info.user) return;
    var uName = info.user.nama || info.user.name || 'Pengguna';
    var role = info.user.role === 'pemilik' ? 'Pemilik' : info.user.role === 'admin' ? 'Admin' : 'Staff';
    var tName = (info.tenant && (info.tenant.nama || info.tenant.name)) || 'TailorHub';
    var init = initials(uName);

    document.querySelectorAll('.side-user b, .top-dropdown-meta b').forEach(function (el) { el.textContent = uName; });
    document.querySelectorAll('.side-user small, .top-dropdown-meta small').forEach(function (el) { el.textContent = role + ' · ' + tName; });
    document.querySelectorAll('.side-user .avatar, .side-user .top-avatar, header.top .top-avatar, .top-dropdown-ava').forEach(function (el) {
      el.textContent = init;
    });
  }

  if (window.TH) {
    var cached = window.TH.me();
    if (cached) applyShellUser(cached);
    window.TH.get('/api/auth/me').then(function (d) {
      if (d && d.user) applyShellUser(d);
    }).catch(function () {});
  }
})();
