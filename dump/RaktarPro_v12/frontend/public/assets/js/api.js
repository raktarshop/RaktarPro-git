(function () {
  const { origin, pathname } = window.location;

  // /RaktarPro_n/frontend/public/auth.html -> /RaktarPro_n
  const parts = pathname.split("/").filter(Boolean);
  const projectRoot = parts.length >= 1 ? `/${parts[0]}` : "";

  const API_BASE = `${origin}${projectRoot}/backend/api_new`;

  async function request(path, { method = "GET", body = null, headers = {} } = {}) {
    const url = API_BASE + path;

    const token = localStorage.getItem("rp_token");
    const finalHeaders = { "Content-Type": "application/json", ...headers };
    // language for backend (product translations etc.)
    const rpLang = localStorage.getItem("rp_lang") || "hu";
    finalHeaders["Accept-Language"] = rpLang;
    finalHeaders["X-RP-Lang"] = rpLang;
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : null,
    });

    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      // Backend: { success:false, error:{ message:"...", code:"..." } }
      let msg =
        data?.message ||
        data?.error ||
        data?.error?.message ||
        data?.raw ||
        `HTTP ${res.status} hiba`;

      // If backend returned an Apache/HTML error page, show a clean message
      if (typeof msg === "string" && (msg.includes("<!DOCTYPE") || msg.includes("<html"))) {
        msg = "A backend API útvonala nem elérhető (404). Ellenőrizd a MAMP útvonalat és az api_new/.htaccess rewrite beállításait.";
      }

      if (typeof msg === "object") {
        try { msg = JSON.stringify(msg); } catch { msg = "Ismeretlen hiba (objektum)"; }
      }

      throw new Error(String(msg).slice(0, 600));
    }

    return data;
  }

  window.api = {
    base: API_BASE,
    get: (p) => request(p, { method: "GET" }),
    post: (p, b) => request(p, { method: "POST", body: b }),
    put: (p, b) => request(p, { method: "PUT", body: b }),
    del: (p) => request(p, { method: "DELETE" }),
  };
})();
