function setMsg(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || "";
}

function safeJson(s) {
  try { return JSON.parse(s); } catch { return null; }
}

function loadUser() {
  return safeJson(localStorage.getItem("rp_user") || "null");
}

function saveUser(u) {
  localStorage.setItem("rp_user", JSON.stringify(u));
}

// best-effort parser: "1234 Város, Utca 12, Extra"
function parseAddressString(addr) {
  const s = String(addr || "").trim();
  if (!s) return { zip: "", city: "", street: "", house: "", extra: "" };

  // split by commas first
  const parts = s.split(",").map(x => x.trim()).filter(Boolean);
  const first = parts[0] || "";
  const extra = parts.slice(2).join(", ").trim() || (parts[2] || "");

  // first part: "1234 Város"
  let zip = "", city = "";
  const m = first.match(/^(\d{4})\s+(.*)$/);
  if (m) { zip = m[1]; city = m[2]; }
  else { city = first; }

  // second part: "Utca 12" (or anything)
  const second = parts[1] || "";
  let street = "", house = "";
  if (second) {
    // house = last token if looks like number/number+letter
    const tokens = second.split(/\s+/).filter(Boolean);
    if (tokens.length >= 2) {
      const last = tokens[tokens.length - 1];
      if (/[0-9]/.test(last)) {
        house = last;
        street = tokens.slice(0, -1).join(" ");
      } else {
        street = second;
      }
    } else {
      street = second;
    }
  }

  // if we couldn't split, push leftovers to street/extra
  if (!street && !house && parts.length >= 2) street = parts[1];

  return { zip, city, street, house, extra };
}

function buildAddressString({ zip, city, street, house, extra }) {
  const z = String(zip || "").trim();
  const c = String(city || "").trim();
  const s = String(street || "").trim();
  const h = String(house || "").trim();
  const e = String(extra || "").trim();

  let base = `${z} ${c}, ${s} ${h}`.trim();
  base = base.replace(/\s+/g, " ");
  if (e) base += `, ${e}`;
  return base;
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = loadUser();
  if (!user?.email) {
    window.location.href = "./auth.html";
    return;
  }

  const userLine = document.getElementById("accUserLine");
  if (userLine) userLine.textContent = user.email;

  const nameEl = document.getElementById("accName");
  const emailEl = document.getElementById("accEmail");

  const zipEl = document.getElementById("accZip");
  const cityEl = document.getElementById("accCity");
  const streetEl = document.getElementById("accStreet");
  const houseEl = document.getElementById("accHouse");
  const extraEl = document.getElementById("accExtra");

  if (nameEl) nameEl.value = user.full_name || user.name || "";
  if (emailEl) emailEl.value = user.email || "";

  // Load account from backend
  try {
    const res = await window.api.get("/account");
    const data = res?.data?.data ?? res?.data ?? res;

    if (data?.full_name && nameEl) nameEl.value = data.full_name;

    if (data?.address) {
      const parsed = parseAddressString(data.address);
      if (zipEl) zipEl.value = parsed.zip || "";
      if (cityEl) cityEl.value = parsed.city || "";
      if (streetEl) streetEl.value = parsed.street || "";
      if (houseEl) houseEl.value = parsed.house || "";
      if (extraEl) extraEl.value = parsed.extra || "";

      // cache for checkout prefill
      try {
        const cached = safeJson(localStorage.getItem("rp_account_cached") || "null") || {};
        cached.address_parts = parsed;
        localStorage.setItem("rp_account_cached", JSON.stringify(cached));
      } catch {}
    }
  } catch {}

  document.getElementById("accSaveProfile")?.addEventListener("click", async () => {
    const full_name = (nameEl?.value || "").trim();
    if (!full_name) {
      setMsg("accMsgProfile", "Add meg a nevet.");
      return;
    }

    setMsg("accMsgProfile", "Mentés...");
    try {
      const res = await window.api.put("/account/profile", { full_name });
      const data = res?.data?.data ?? res?.data ?? res;

      const u = loadUser() || {};
      u.full_name = data?.full_name ?? full_name;
      u.name = u.full_name;
      saveUser(u);

      setMsg("accMsgProfile", "Mentve.");
    } catch (e) {
      setMsg("accMsgProfile", `Hiba: ${e?.message || String(e)}`);
    }
  });

  document.getElementById("accSaveAddress")?.addEventListener("click", async () => {
    const zip = (zipEl?.value || "").trim();
    const city = (cityEl?.value || "").trim();
    const street = (streetEl?.value || "").trim();
    const house = (houseEl?.value || "").trim();
    const extra = (extraEl?.value || "").trim();

    if (!zip || !city || !street || !house) {
      setMsg("accMsgAddress", "Töltsd ki: irányítószám, város, utca, házszám.");
      return;
    }

    const address = buildAddressString({ zip, city, street, house, extra });

    setMsg("accMsgAddress", "Mentés...");
    try {
      await window.api.put("/account/address", { address });

      // cache for checkout prefill
      try {
        const cached = safeJson(localStorage.getItem("rp_account_cached") || "null") || {};
        cached.address_parts = { zip, city, street, house, extra };
        localStorage.setItem("rp_account_cached", JSON.stringify(cached));
      } catch {}

      window.rpToast?.("Cím mentve", "Szállítási adatok frissítve.", "success");
      setMsg("accMsgAddress", "Cím mentve.");
    } catch (e) {
      const msg = e?.message || String(e);
      window.rpToast?.("Mentési hiba", msg, "error");
      setMsg("accMsgAddress", `Hiba: ${msg}`);
    }
  });

  document.getElementById("accSavePw")?.addEventListener("click", async () => {
    const old_password = (document.getElementById("accPwOld")?.value || "").trim();
    const new_password = (document.getElementById("accPwNew")?.value || "").trim();
    const new_password2 = (document.getElementById("accPwNew2")?.value || "").trim();

    if (!old_password) {
      window.rpToast?.("Hiba", "Kérlek add meg a jelenlegi jelszót.", "error");
      setMsg("accMsgPw", "Kérlek add meg a jelenlegi jelszót.");
      return;
    }
    if (new_password.length < 6) {
      window.rpToast?.("Hiba", "Az új jelszónak legalább 6 karakter kell.", "error");
      setMsg("accMsgPw", "Az új jelszónak legalább 6 karakter kell.");
      return;
    }
    if (new_password2 && new_password !== new_password2) {
      window.rpToast?.("Hiba", "A két jelszó nem egyezik.", "error");
      setMsg("accMsgPw", "A két jelszó nem egyezik.");
      return;
    }

    setMsg("accMsgPw", "Mentés...");
    try {
      if (window.api) {
        await window.api.put("/account/password", { old_password, new_password });
      }
      window.rpToast?.("Jelszó megváltoztatva", "Sikeresen frissítve!", "success");
      setMsg("accMsgPw", "Jelszó sikeresen megváltoztatva!");
      ["accPwOld","accPwNew","accPwNew2"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
    } catch (e) {
      const msg = e?.message || String(e);
      window.rpToast?.("Jelszó hiba", msg, "error");
      setMsg("accMsgPw", `Hiba: ${msg}`);
    }
  });

  document.getElementById("accLogoutAll")?.addEventListener("click", async () => {
    setMsg("accMsgSec", "Kiléptetés...");
    try { await window.api.post("/logout", {}); } catch {}

    localStorage.removeItem("rp_token");
    localStorage.removeItem("rp_user");
    setMsg("accMsgSec", "Kijelentkezve.");
    setTimeout(() => window.location.href = "./auth.html", 400);
  });
});
// Re-apply translations on language change
window.addEventListener("storage", (e) => {
  if (!e?.key || e.key === "rp_lang") {
    if (window.lang?.apply) window.lang.apply();
  }
});
window.addEventListener("rp:langchange", () => {
  if (window.lang?.apply) window.lang.apply();
});
