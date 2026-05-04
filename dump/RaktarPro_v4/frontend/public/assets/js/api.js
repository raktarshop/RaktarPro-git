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
