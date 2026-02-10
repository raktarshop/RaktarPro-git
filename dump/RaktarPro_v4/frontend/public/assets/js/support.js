(function () {
  function byId(id) { return document.getElementById(id); }

  function applyThemeFromStorage() {
    // ugyanaz a logika mint a többi oldalon: rp_theme -> data-theme
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

  function t(key) {
    return (window.lang && typeof window.lang.t === "function") ? window.lang.t(key) : key;
  }

  document.addEventListener("DOMContentLoaded", () => {
    // ✅ FIX: light mode működjön support oldalon is
    applyThemeFromStorage();

    // ha másik tabon átállítod a theme-et, itt is kövesse
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
        show(errBox, t("support_email_label") + ": " + "kötelező.");
        return;
      }
      if (!message || message.length < 3) {
        show(errBox, t("support_msg_label") + ": " + "túl rövid.");
        return;
      }

      try {
        await window.api.post("/support", { email, message });
        show(okBox, t("support_success"));
        byId("supportMessage").value = "";
      } catch (err) {
        show(errBox, err?.message || String(err));
      }
    });
  });
})();
