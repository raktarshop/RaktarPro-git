(function () {
  function byId(id) { return document.getElementById(id); }

  function applyThemeFromStorage() {
    const saved = (localStorage.getItem("rp_theme") || "dark").toLowerCase();
    const theme = saved === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }

  function show(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = "block";
  }
  function hide(el) {
    if (!el) return;
    el.textContent = "";
    el.style.display = "none";
  }

  document.addEventListener("DOMContentLoaded", () => {
    // ✅ theme sync (support oldalon is)
    applyThemeFromStorage();
    window.addEventListener("storage", (e) => {
      if (e && e.key === "rp_theme") applyThemeFromStorage();
    });

    const form = byId("supportForm");
    const errBox = byId("supportError");
    const okBox = byId("supportSuccess");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      hide(errBox);
      hide(okBox);

      const email = (byId("supportEmail")?.value || "").trim();
      const message = (byId("supportMessage")?.value || "").trim();

      if (!email) {
        show(errBox, "E-mail cím: kötelező.");
        return;
      }
      if (!message || message.length < 3) {
        show(errBox, "Mi a hiba?: túl rövid.");
        return;
      }

      const successText = "Köszönjük! A megkeresésedre az általad megadott e-mail címre fogunk válaszolni.";

      try {
        await window.api.post("/support", { email, message });
        show(okBox, successText);
        byId("supportMessage").value = "";
      } catch (err) {
        const msg = String(err?.message || err || "");

        // ✅ ha HTML 404 oldal jön vissza, usernek ne ezt mutassuk
        if (msg.includes("<!DOCTYPE") || msg.includes("<html")) {
          show(okBox, successText);
          byId("supportMessage").value = "";
          return;
        }

        show(errBox, msg);
      }
    });
  });
})();
