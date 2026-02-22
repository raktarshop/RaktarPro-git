// nav.js – navbar, theme, cart badge, admin badge, language

function getCart() {
  try { return JSON.parse(localStorage.getItem('rp_cart') || '[]'); } catch { return []; }
}
function cartCount() {
  return getCart().reduce((s,it) => s + (Number(it.qty)||0), 0);
}
function getToken() { return localStorage.getItem('rp_token') || ''; }
function isGuest() { return localStorage.getItem('rp_guest') === '1'; }

function setTheme(theme) {
  const t = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('rp_theme', t);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.innerHTML = t === 'dark'
      ? '<i class="bi bi-moon-stars rp-icon"></i>'
      : '<i class="bi bi-sun rp-icon"></i>';
    btn.setAttribute('data-i18n-title', t === 'dark' ? 'theme_title_dark' : 'theme_title_light');
    window.lang?.apply?.();
  }
}
function initTheme() {
  const saved = localStorage.getItem('rp_theme') || 'dark';
  setTheme(saved);
}
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const n = cartCount();
  if (!badge) return;
  badge.style.display = n > 0 ? 'inline-block' : 'none';
  badge.textContent = String(n);
}
function getUser() {
  try { return JSON.parse(localStorage.getItem('rp_user') || 'null'); } catch { return null; }
}
function isAdminUser(user) {
  if (!user) return false;
  if (user.is_admin === true) return true;
  if (Number(user.is_admin) === 1) return true;
  if (Number(user.role_id) === 1) return true;
  if (typeof user.role === 'string' && user.role.toLowerCase() === 'admin') return true;
  return false;
}

// Show/hide admin menu item
function initAdminMenu() {
  const adminItem = document.getElementById('adminMenuItem');
  const adminDivider = document.getElementById('adminMenuDivider');
  if (!adminItem) return;
  if (isGuest()) {
    adminItem.style.display = 'none';
    if (adminDivider) adminDivider.style.display = 'none';
    return;
  }
  const ok = Boolean(getToken()) && isAdminUser(getUser());
  adminItem.style.display = ok ? 'block' : 'none';
  if (adminDivider) adminDivider.style.display = ok ? 'block' : 'none';
}

// Update avatar letter & show admin name
function initUserDisplay() {
  const user = getUser();
  const avatarEls = document.querySelectorAll('.rp-avatar');
  avatarEls.forEach(el => {
    if (user) {
      const name = user.full_name || user.name || user.email || 'U';
      el.textContent = name.charAt(0).toUpperCase();
    }
  });

  // Admin name pills on admin pages
  const adminNamePill = document.getElementById('adminNamePill');
  if (adminNamePill && user) {
    const n = user.full_name || user.name || user.email || 'Admin';
    adminNamePill.innerHTML = `
      <span class="rp-admin-pill">
        <i class="bi bi-person-fill me-1"></i>
        Bejelentkezve: <strong>${escapeNavHtml(n)}</strong>
      </span>`;
  }
}

function escapeNavHtml(s) {
  return String(s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

// Fetch and show pending orders / open support counts in admin nav tabs
async function updateAdminBadges() {
  const user = getUser();
  const ok = Boolean(getToken()) && isAdminUser(user) && window.api;
  if (!ok) return;

  // Nav tab badges (in admin pages)
  const ordersBadgeEl = document.getElementById('adminOrdersBadge');
  const supportBadgeEl = document.getElementById('adminSupportBadge');

  try {
    if (supportBadgeEl || document.querySelector('[data-admin-badge="support"]')) {
      const res = await window.api.get('/admin/support');
      const list = Array.isArray(res?.data?.tickets) ? res.data.tickets
        : Array.isArray(res?.tickets) ? res.tickets
        : Array.isArray(res?.data) ? res.data
        : Array.isArray(res) ? res : [];
      const openCount = list.filter(t => Number(t?.resolved) !== 1 && t?.resolved !== true).length;
      document.querySelectorAll('[data-admin-badge="support"]').forEach(el => {
        el.textContent = String(openCount);
        el.style.display = openCount > 0 ? 'inline-flex' : 'none';
      });
      if (supportBadgeEl) {
        supportBadgeEl.textContent = String(openCount);
        supportBadgeEl.style.display = openCount > 0 ? 'inline-flex' : 'none';
      }
    }

    if (ordersBadgeEl || document.querySelector('[data-admin-badge="orders"]')) {
      const res = await window.api.get('/admin/orders?limit=200');
      const list = Array.isArray(res?.data?.orders) ? res.data.orders
        : Array.isArray(res?.orders) ? res.orders
        : Array.isArray(res?.data) ? res.data
        : Array.isArray(res) ? res : [];
      const pending = list.filter(o => {
        const s = String(o?.status||'').toLowerCase();
        return s && s !== 'completed' && s !== 'delivered' && s !== 'kiszallitva' && s !== 'teljesitve' && s !== 'torolve';
      }).length;
      document.querySelectorAll('[data-admin-badge="orders"]').forEach(el => {
        el.textContent = String(pending);
        el.style.display = pending > 0 ? 'inline-flex' : 'none';
      });
      if (ordersBadgeEl) {
        ordersBadgeEl.textContent = String(pending);
        ordersBadgeEl.style.display = pending > 0 ? 'inline-flex' : 'none';
      }
    }
  } catch { /* silent */ }
}

function initNav() {
  initTheme();
  updateCartBadge();
  initAdminMenu();
  initUserDisplay();
  updateAdminBadges();

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
      initAdminMenu();
      updateAdminBadges();
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('rp_token');
      localStorage.removeItem('rp_user');
      localStorage.removeItem('rp_guest');
      window.location.href = './auth.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', initNav);
window.addEventListener('storage', () => {
  updateCartBadge();
  initAdminMenu();
  initUserDisplay();
  updateAdminBadges();
});
