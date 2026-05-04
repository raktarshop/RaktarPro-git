// =====================================================================
//  auth.js – JAVÍTOTT VERZIÓ
//  Bug fix: a regisztráció "company" mezőt küldött, de a backend
//  "company_name"-t vár → most már helyesen küldi a company_name-t
// =====================================================================

function byId(id) { return document.getElementById(id); }

function showBox(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
}
function hideBox(el) {
  if (!el) return;
  el.textContent = "";
  el.style.display = "none";
}

function getErrorMessage(err) {
  if (!err) return "Ismeretlen hiba.";
  if (typeof err === "string") return err;
  if (err instanceof Error && typeof err.message === "string") return err.message;

  if (typeof err === "object") {
    const c = err.message || err.error || err?.data?.message || err?.data?.error;
    if (typeof c === "string") return c;
    try { return JSON.stringify(err); } catch {}
  }
  return "Ismeretlen hiba.";
}

function setupPasswordToggle(inputId, btnId) {
  const input = byId(inputId);
  const btn = byId(btnId);
  if (!input || !btn) return;

  btn.addEventListener("click", () => {
    const isPw = input.getAttribute("type") === "password";
    input.setAttribute("type", isPw ? "text" : "password");
    const hideTxt = window.lang?.t ? window.lang.t("hide_btn") : "Rejt";
    const showTxt = window.lang?.t ? window.lang.t("show_btn") : "Mutat";
    btn.textContent = isPw ? hideTxt : showTxt;
  });
}

function setThemeOnAuth(theme) {
  const t = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("rp_theme", t);

  const btn = byId("authThemeToggle");
  if (btn) {
    btn.textContent = t === "dark" ? "🌙" : "☀️";
    btn.setAttribute("data-i18n-title", t === "dark" ? "theme_title_dark" : "theme_title_light");
    window.lang?.apply?.();
  }
}

function initThemeOnAuth() {
  const saved = localStorage.getItem("rp_theme") || "dark";
  setThemeOnAuth(saved);
}

function setupGuestLink() {
  const link = document.getElementById("guestBtn");
  if (!link) return;

  link.addEventListener("click", () => {
    localStorage.setItem("rp_guest", "1");
    localStorage.removeItem("rp_token");
    localStorage.removeItem("rp_user");
  });
}

function setupSupportLinkGuard() {
  document.addEventListener(
    "click",
    function (e) {
      const a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!a) return;

      const href = a.getAttribute("href") || "";
      const isSupport = a.id === "supportLink" || href.includes("support.html");
      if (!isSupport) return;

      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();

      localStorage.removeItem("rp_guest");
      window.location.href = href || "./support.html";
    },
    true
  );
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeOnAuth();
  setupSupportLinkGuard();
  setupGuestLink();

  const themeBtn = byId("authThemeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      setThemeOnAuth(current === "dark" ? "light" : "dark");
    });
  }

  setupPasswordToggle("loginPassword", "toggleLoginPw");
  setupPasswordToggle("regPassword", "toggleRegPw");
  setupPasswordToggle("regPassword2", "toggleRegPw2");

  const showTxt = window.lang?.t ? window.lang.t("show_btn") : "Mutat";
  ["toggleLoginPw", "toggleRegPw", "toggleRegPw2"].forEach((id) => {
    const b = byId(id);
    if (b) b.textContent = showTxt;
  });

  // ── LOGIN ──
  const loginForm = byId("loginForm");
  const loginError = byId("loginError");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideBox(loginError);

      const email = (byId("loginEmail")?.value || "").trim();
      const password = (byId("loginPassword")?.value || "").trim();

      if (!email || !password) {
        showBox(loginError, "Kérlek töltsd ki az e-mail címet és a jelszót.");
        return;
      }

      try {
        const res = await window.api.post("/auth/login", { email, password });

        const token =
          res?.data?.access_token ||
          res?.access_token ||
          res?.token ||
          res?.data?.token;

        if (!token) {
          showBox(loginError, "Sikeres válasz jött, de nincs token a response-ban.");
          return;
        }

        localStorage.removeItem("rp_guest");
        localStorage.setItem("rp_token", token);

        const user = res?.data?.user || res?.user || null;
        if (user) localStorage.setItem("rp_user", JSON.stringify(user));
        else localStorage.removeItem("rp_user");

        window.location.href = "./products.html";
      } catch (err) {
        showBox(loginError, getErrorMessage(err));
      }
    });
  }

  // ── REGISTER ──
  const registerForm = byId("registerForm");
  const regError = byId("regError");
  const regSuccess = byId("regSuccess");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideBox(regError);
      hideBox(regSuccess);

      const full_name = (byId("regName")?.value || "").trim();
      const email = (byId("regEmail")?.value || "").trim();
      // 🔧 FIX: a backend "company_name" mezőt vár, nem "company"-t
      const company_name = (byId("regCompany")?.value || "").trim();
      const password = (byId("regPassword")?.value || "").trim();
      const password2 = (byId("regPassword2")?.value || "").trim();

      if (!full_name || !email || !password || !password2) {
        showBox(regError, "Kérlek tölts ki minden kötelező mezőt.");
        return;
      }
      if (password.length < 6) {
        showBox(regError, "A jelszónak legalább 6 karakter hosszúnak kell lennie.");
        return;
      }
      if (password !== password2) {
        showBox(regError, "A két jelszó nem egyezik.");
        return;
      }

      try {
        // 🔧 FIX: "company_name" kulcsot küldünk (nem "company"-t)
        await window.api.post("/auth/register", {
          full_name,
          email,
          company_name,  // ← JAVÍTVA: company → company_name
          password
        });
        showBox(regSuccess, "Sikeres regisztráció! Most már be tudsz lépni.");
        registerForm.reset();
      } catch (err) {
        showBox(regError, getErrorMessage(err));
      }
    });
  }
});
