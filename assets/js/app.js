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
})();
