(function () {
  function byId(id) { return document.getElementById(id); }

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
