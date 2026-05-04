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
 * ✅ Admin felismerés: nálatok is_admin 1/0 és role_id 1 is van
 */
function isAdminUser(user) {
  if (!user) return false;
  if (user.is_admin === true) return true;
  if (Number(user.is_admin) === 1) return true;
  if (Number(user.role_id) === 1) return true;

  if (typeof user.role === "string" && user.role.toLowerCase() === "admin") return true;

  if (user.role && typeof user.role === "object") {
    const rid = Number(user.role.id);
    const rname = String(user.role.name || "").toLowerCase();
    if (rid === 1 || rname === "admin") return true;
  }

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

/**
 * Próbál beszúrni a dropdownba ott, ahol biztos: a logout gomb elé.
 * Ha nem található, visszatér null-lal.
 */
function ensureAdminInDropdown() {
  // ha már van
  let existing = document.getElementById("adminMenuItem");
  if (existing) return existing;

  const logout = document.getElementById("logoutBtn");
  if (!logout) return null;

  // Keressük meg a logout gomb “menü konténerét”
  // (Bootstrapnál ez tipikusan .dropdown-menu)
  const menu = logout.closest(".dropdown-menu") || logout.parentElement?.closest(".dropdown-menu");
  if (!menu) return null;

  // Létrehozunk egy admin sort a logout elé
  const isUl = menu.tagName.toLowerCase() === "ul";

  if (isUl) {
    const li = document.createElement("li");
    li.id = "adminMenuItem";
    li.style.display = "none";

    const a = document.createElement("a");
    a.className = "dropdown-item";
    a.href = "./admin.html";
    a.textContent = "🛠️ Admin";

    li.appendChild(a);

    // logout általában li-ben van, tegyük elé
    const logoutLi = logout.closest("li");
    if (logoutLi && logoutLi.parentElement === menu) {
      menu.insertBefore(li, logoutLi);
    } else {
      menu.insertBefore(li, menu.firstChild);
    }
    return li;
  } else {
    // div-alapú dropdown
    const wrap = document.createElement("div");
    wrap.id = "adminMenuItem";
    wrap.style.display = "none";

    const a = document.createElement("a");
    a.className = "dropdown-item";
    a.href = "./admin.html";
    a.textContent = "🛠️ Admin";

    wrap.appendChild(a);

    // logout elé
    menu.insertBefore(wrap, logout.closest(".dropdown-item") || menu.firstChild);
    return wrap;
  }
}

/**
 * ✅ Biztos fallback: külön Admin gomb a navbar jobb oldalára
 */
function ensureAdminNavButton() {
  let btn = document.getElementById("rpAdminNavBtn");
  if (btn) return btn;

  // Jobb oldali gombsor konténer: keressük a themeToggle szülőjét,
  // mert az biztos ott van.
  const themeBtn = document.getElementById("themeToggle");
  const rightGroup = themeBtn?.parentElement;
  if (!rightGroup) return null;

  btn = document.createElement("a");
  btn.id = "rpAdminNavBtn";
  btn.href = "./admin.html";
  btn.className = "btn rp-pill-btn";
  btn.style.display = "none";
  btn.textContent = "🛠️ Admin";

  // theme gomb elé szúrjuk (vagy utána, mindegy)
  rightGroup.insertBefore(btn, themeBtn);
  return btn;
}

function applyAdminVisibility() {
  const user = getUser();
  const ok = Boolean(getToken()) && !isGuest() && isAdminUser(user);

  // 1) dropdownba próbáljuk (ha lehet)
  const dd = ensureAdminInDropdown();
  if (dd) dd.style.display = ok ? "" : "none";

  // 2) biztos navbar gomb
  const navBtn = ensureAdminNavButton();
  if (navBtn) navBtn.style.display = ok ? "" : "none";
}

function initNav() {
  initTheme();
  updateCartBadge();
  applyAdminVisibility();

  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
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
  applyAdminVisibility();
});
