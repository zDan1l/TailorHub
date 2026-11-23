/* ============================================================
   TAILORHUB — public.js
   Interaksi untuk halaman publik (header, menu mobile, reveal).
   Sertakan di akhir <body>: <script src="assets/js/public.js"></script>
   ============================================================ */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  /* Header jadi "stuck" setelah scroll sedikit */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-stuck", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Toggle menu mobile */
  var burger = document.querySelector(".burger");
  var mobileNav = document.getElementById("mobileNav");
  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) mobileNav.classList.remove("open");
    });
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el, i) {
      el.style.setProperty("--i", (i % 6).toString());
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }
})();
