(function () {
  const { origin, pathname } = window.location;

  // /RaktarPro_v2/frontend/public/products.html -> /RaktarPro_v2
  const parts = pathname.split("/").filter(Boolean);
  const projectRoot = parts.length >= 1 ? `/${parts[0]}` : "";

  // API folder (rewritten by .htaccess to index.php)
  const API_BASE = `${origin}${projectRoot}/backend/api_new`;

  function normPath(p) {
    if (!p) return "";
    return p.startsWith("/") ? p : `/${p}`;
  }

  async function request(path, { method = "GET", body = null, headers = {} } = {}) {
    const url = API_BASE + normPath(path);

    const token = localStorage.getItem("rp_token");
    const finalHeaders = { "Content-Type": "application/json", ...headers };
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
      let msg =
        data?.message ||
        data?.error?.message ||
        data?.error ||
        data?.raw ||
        `HTTP ${res.status} hiba`;

      if (typeof msg === "object") {
        try { msg = JSON.stringify(msg); } catch { msg = "Ismeretlen hiba (objektum)"; }
      }

      throw new Error(String(msg).slice(0, 800));
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
