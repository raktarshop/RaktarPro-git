// nav.js – navbar, theme, cart badge, admin badge

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
function updateFavBadge() {
  const badge = document.getElementById('favBadge');
  if (!badge) return;
  try {
    const ws = JSON.parse(localStorage.getItem('rp_wishlist') || '[]');
    const n = Array.isArray(ws) ? ws.length : 0;
    badge.style.display = n > 0 ? 'inline-block' : 'none';
    badge.textContent = String(n);
  } catch { badge.style.display = 'none'; }
}
function getUser() {
  try { return JSON.parse(localStorage.getItem('rp_user') || 'null'); } catch { return null; }
}
function isAdminUser(user) {
  if (!user) return false;
  // role_id === 1 = admin (is_admin column may not exist in DB)
  if (Number(user.role_id) === 1) return true;
  if (user.is_admin === true || Number(user.is_admin) === 1) return true;
  if (typeof user.role === 'string' && user.role.toLowerCase() === 'admin') return true;
  return false;
}

function initAdminMenu() {
  const adminItem = document.getElementById('adminMenuItem');
  const adminDivider = document.getElementById('adminMenuDivider');
  const adminNavBtn = document.getElementById('adminNavBtn');
  const user = getUser();
  const show = !isGuest() && user && isAdminUser(user);
  if (adminItem) adminItem.style.display = show ? '' : 'none';
  if (adminDivider) adminDivider.style.display = show ? '' : 'none';
  if (adminNavBtn) adminNavBtn.style.display = show ? '' : 'none';
}

function initUserDisplay() {
  const user = getUser();
  const avatarEls = document.querySelectorAll('.rp-avatar');
  avatarEls.forEach(el => {
    if (user) {
      const name = user.full_name || user.name || user.email || 'U';
      el.textContent = name.charAt(0).toUpperCase();
    }
  });

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

async function updateAdminBadges() {
  const user = getUser();
  const ok = Boolean(getToken()) && isAdminUser(user) && window.api;
  if (!ok) return;

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
    }
  } catch { /* silent */ }
}

function initNav() {
  initTheme();
  updateCartBadge();
  updateFavBadge();
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
      localStorage.removeItem('rp_cart');
      localStorage.setItem('rp_logged_out_at', Date.now().toString());
      window.location.replace('./auth.html');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  // Re-run admin check after a tick in case rp_user was set async
  setTimeout(initAdminMenu, 50);
  setTimeout(initAdminMenu, 300);
});
// Re-run when localStorage changes (e.g. after login)
window.addEventListener('storage', (e) => {
  if (e.key === 'rp_user' || e.key === 'rp_token') {
    initAdminMenu();
  }
});
window.addEventListener('storage', () => {
  updateCartBadge();
  updateFavBadge();
  initAdminMenu();
  initUserDisplay();
  updateAdminBadges();
});
