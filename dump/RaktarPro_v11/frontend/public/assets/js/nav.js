function getCart() {
  try { return JSON.parse(localStorage.getItem('rp_cart') || '[]'); }
  catch { return []; }
}

function cartCount() {
  return getCart().reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
}

function getToken() {
  return localStorage.getItem('rp_token') || '';
}

function isGuest() {
  return localStorage.getItem('rp_guest') === '1';
}

function setTheme(theme) {
  const t = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('rp_theme', t);

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = t === 'dark' ? '🌙' : '☀️';
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
  try { return JSON.parse(localStorage.getItem('rp_user') || 'null'); }
  catch { return null; }
}

/**
 * ✅ Admin felismerés az új backendhez is:
 * - is_admin lehet 1/0 vagy true/false
 * - role_id = 1 admin
 * - role lehet 'admin'
 */
function isAdminUser(user) {
  if (!user) return false;
  if (user.is_admin === true) return true;
  if (Number(user.is_admin) === 1) return true;
  if (Number(user.role_id) === 1) return true;
  if (typeof user.role === 'string' && user.role.toLowerCase() === 'admin') return true;
  return false;
}

function initAdminMenu() {
  const adminItem = document.getElementById('adminMenuItem');
  if (!adminItem) return;

  if (isGuest()) {
    adminItem.style.display = 'none';
    return;
  }

  const ok = Boolean(getToken()) && isAdminUser(getUser());
  adminItem.style.display = ok ? 'block' : 'none';
}

async function updateAdminBadges() {
  const ordersBadge = document.getElementById('adminOrdersBadge');
  const supportBadge = document.getElementById('adminSupportBadge');
  if (!ordersBadge && !supportBadge) return;

  const user = getUser();
  const ok = Boolean(getToken()) && isAdminUser(user) && window.api;
  if (!ok) {
    if (ordersBadge) ordersBadge.style.display = 'none';
    if (supportBadge) supportBadge.style.display = 'none';
    return;
  }

  try {
    if (supportBadge) {
      const res = await window.api.get('/admin/support');
      const list = Array.isArray(res?.data?.tickets) ? res.data.tickets
        : Array.isArray(res?.tickets) ? res.tickets
        : Array.isArray(res?.data) ? res.data
        : Array.isArray(res) ? res : [];
      const openCount = list.filter(t => Number(t?.resolved) !== 1 && t?.resolved !== true).length;
      supportBadge.textContent = String(openCount);
      supportBadge.style.display = openCount > 0 ? 'inline-block' : 'none';
    }

    if (ordersBadge) {
      const res = await window.api.get('/admin/orders?limit=200');
      const list = Array.isArray(res?.data?.orders) ? res.data.orders
        : Array.isArray(res?.orders) ? res.orders
        : Array.isArray(res?.data) ? res.data
        : Array.isArray(res) ? res : [];
      const pending = list.filter(o => {
        const s = String(o?.status || '').toLowerCase();
        return s && s !== 'completed' && s !== 'delivered' && s !== 'kiszallitva' && s !== 'kesz';
      }).length;
      ordersBadge.textContent = String(pending);
      ordersBadge.style.display = pending > 0 ? 'inline-block' : 'none';
    }
  } catch {
    // silent
  }
}

function initNav() {
  initTheme();
  updateCartBadge();
  initAdminMenu();
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
    logoutBtn.addEventListener('click', (e) => {
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
  updateAdminBadges();
});
