/* =====================================================================
   stuarttufft.com — main.js
   Dark mode · Nav scroll state · Scroll reveal · Active nav link
   ===================================================================== */

// ── 1. Dark mode ──────────────────────────────────────────────────────
(function () {
  var saved = localStorage.getItem('st-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = saved || 'light';
  document.documentElement.setAttribute('data-bs-theme', theme);
})();

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-bs-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-bs-theme', next);
  localStorage.setItem('st-theme', next);
}

document.addEventListener('DOMContentLoaded', function () {
  ['themeToggle', 'themeToggleMobile'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', toggleTheme);
  });

  // ── 2. Nav scroll state ─────────────────────────────────────────────
  var nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ── 3. Scroll reveal ────────────────────────────────────────────────
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── 4. Active nav link ──────────────────────────────────────────────
  var path = window.location.pathname;
  var navLinks = document.querySelectorAll('#navMenu .nav-link');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    // Normalise: strip leading slash and .html for comparison
    var linkPath = href.replace(/^\//, '').replace(/\.html$/, '') || 'index';
    var currentPath = path.replace(/^\//, '').replace(/\.html$/, '').replace(/\/$/, '') || 'index';
    if (linkPath === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
});
