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

  /* ---- Global Topbar Search Handler (Enter ke search.html) ---- */
  var topSearchInputs = document.querySelectorAll('header.top .search input');
  topSearchInputs.forEach(function (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var query = input.value.trim();
        if (query) {
          var path = window.location.pathname.replace(/\\/g, '/');
          var isSubfolder = path.indexOf('/app/reports/') !== -1 ||
                            path.indexOf('/app/notifications/') !== -1 ||
                            path.indexOf('/app/orders/') !== -1 ||
                            path.indexOf('/app/customers/') !== -1 ||
                            path.indexOf('/app/production/') !== -1 ||
                            path.indexOf('/app/payments/') !== -1 ||
                            path.indexOf('/app/team/') !== -1 ||
                            path.indexOf('/app/settings/') !== -1 ||
                            path.indexOf('/account/') !== -1;
          var target = isSubfolder ? '../search.html' : 'search.html';
          window.location.href = target + '?q=' + encodeURIComponent(query);
        }
      }
    });
  });
})();
