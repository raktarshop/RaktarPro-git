// animate.js – dependency-free scroll reveal animations
// Usage: add class "rp-reveal" to elements you want to animate.

(function () {
  let obs = null;

  function ensureObserver() {
    if (obs) return obs;
    if (!('IntersectionObserver' in window)) return null;

    obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -10% 0px',
      }
    );
    return obs;
  }

  function refresh(root = document) {
    const els = Array.from(root.querySelectorAll('.rp-reveal:not(.is-visible)'));
    if (els.length === 0) return;

    const o = ensureObserver();
    if (!o) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    els.forEach((el) => o.observe(el));
  }

  function run() {
    refresh(document);
  }

  window.rpAnimate = { refresh };
  document.addEventListener('DOMContentLoaded', run);
})();
