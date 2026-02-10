function getCart() {
  try { return JSON.parse(localStorage.getItem("rp_cart") || "[]"); }
  catch { return []; }
}

function cartCount() {
  return getCart().reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
}

function getToken() {
  return localStorage.getItem("rp_token") || "";
}

function isGuest() {
  return localStorage.getItem("rp_guest") === "1";
}

function setTheme(theme) {
  const t = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("rp_theme", t);

  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.textContent = t === "dark" ? "🌙" : "☀️";
    btn.setAttribute("data-i18n-title", t === "dark" ? "theme_title_dark" : "theme_title_light");
    window.lang?.apply?.();
  }
}

function initTheme() {
  const saved = localStorage.getItem("rp_theme") || "dark";
  setTheme(saved);
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  const n = cartCount();
  if (!badge) return;
  badge.style.display = n > 0 ? "inline-block" : "none";
  badge.textContent = String(n);
}

function getUser() {
  try { return JSON.parse(localStorage.getItem("rp_user") || "null"); }
  catch { return null; }
}

/**
 * ✅ Admin felismerés több backend formátumra:
 * - is_admin: true
 * - role: "admin"
 * - role_id: 1
 * - role: {id:1, name:"admin"}
 * - roles: [{id:1,name:"admin"}] vagy ["admin"]
 */
function isAdminUser(user) {
  if (!user) return false;

  if (user.is_admin === true) return true;

  // role string
  if (typeof user.role === "string" && user.role.toLowerCase() === "admin") return true;

  // role_id numeric (gyakori)
  if (Number(user.role_id) === 1) return true;

  // role object
  if (user.role && typeof user.role === "object") {
    const rid = Number(user.role.id);
    const rname = String(user.role.name || "").toLowerCase();
    if (rid === 1 || rname === "admin") return true;
  }

  // roles array
  if (Array.isArray(user.roles)) {
    for (const r of user.roles) {
      if (typeof r === "string" && r.toLowerCase() === "admin") return true;
      if (r && typeof r === "object") {
        const rid = Number(r.id);
        const rname = String(r.name || "").toLowerCase();
        if (rid === 1 || rname === "admin") return true;
      }
    }
  }

  return false;
}

function initAdminMenu() {
  const adminItem = document.getElementById("adminMenuItem");
  if (!adminItem) return;

  // vendégnek soha
  if (isGuest()) {
    adminItem.style.display = "none";
    return;
  }

  const ok = Boolean(getToken()) && isAdminUser(getUser());
  adminItem.style.display = ok ? "block" : "none";
}

function initNav() {
  initTheme();
  updateCartBadge();
  initAdminMenu();

  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
      initAdminMenu();
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("rp_token");
      localStorage.removeItem("rp_user");
      localStorage.removeItem("rp_guest");
      window.location.href = "./auth.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", initNav);
window.addEventListener("storage", () => {
  updateCartBadge();
  initAdminMenu();
});
