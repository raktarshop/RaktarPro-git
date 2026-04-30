(function () {
  const { origin, pathname } = window.location;

  // Detect project root by finding 'frontend' in the path
  // e.g. /RaktarPro_9/frontend/public/auth.html -> /RaktarPro_9
  const parts = pathname.split("/").filter(Boolean);
  const frontendIdx = parts.indexOf("frontend");
  const projectRoot = frontendIdx > 0 ? "/" + parts.slice(0, frontendIdx).join("/") : (parts.length >= 1 ? `/${parts[0]}` : "");

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
      // Auto-logout on 401 Unauthorized (expired/invalid token)
      if (res.status === 401) {
        localStorage.removeItem('rp_token');
        localStorage.removeItem('rp_user');
        localStorage.removeItem('rp_guest');
        // Only redirect if not already on auth page
        if (!window.location.pathname.includes('auth.html')) {
          window.location.href = './auth.html';
        }
      }
      // Backend: { success:false, error:{ message:"...", code:"..." } }
      // Prefer the inner message field first, so we don't print objects like {"message":"..."}
      let msg =
        data?.message ??
        data?.error?.message ??
        data?.error ??
        data?.raw ??
        `HTTP ${res.status} hiba`;

      // If we still got an object, try to unwrap common shapes
      if (msg && typeof msg === "object") {
        const inner = msg?.message || msg?.error || msg?.details;
        if (typeof inner === "string") msg = inner;
      }

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