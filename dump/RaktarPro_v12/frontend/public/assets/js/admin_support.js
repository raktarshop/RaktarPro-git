let tickets = [];

function esc(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setMsg(t) {
  const el = document.getElementById("supportMsg");
  if (el) el.textContent = t || "";
}

function t(key) {
  return (window.lang && typeof window.lang.t === "function") ? window.lang.t(key) : key;
}

function formatDate(s) {
  if (!s) return "";
  // MySQL TIMESTAMP -> show readable
  return String(s).replace("T", " ").replace("Z", "");
}

function render() {
  const tbody = document.getElementById("supportTbody");
  tbody.innerHTML = "";

  if (!tickets.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" style="opacity:.75;">(Üres)</td>`;
    tbody.appendChild(tr);
    return;
  }

  for (const it of tickets) {
    const resolved = Number(it.resolved) === 1;
    const statusText = resolved ? t("admin_support_status_resolved") : t("admin_support_status_open");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${esc(it.id)}</td>
      <td>${esc(it.email)}</td>
      <td style="max-width:520px; white-space:pre-wrap;">${esc(it.message)}</td>
      <td>${esc(formatDate(it.created_at))}</td>
      <td>${esc(statusText)}</td>
      <td>
        ${resolved ? "" : `<button class="btn btn-sm rp-admin-btn" data-act="resolve" data-id="${esc(it.id)}">${esc(t("admin_support_resolve"))}</button>`}
      </td>
    `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll("button[data-act='resolve']").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      setMsg("Frissítés...");
      try {
        await window.api.put(`/admin/support/${id}`, {});
        await loadTickets();
        setMsg("Kész.");
      } catch (e) {
        setMsg(e?.message || String(e));
      }
    });
  });
}

async function loadTickets() {
  setMsg("Betöltés...");
  const res = await window.api.get("/admin/support");
  tickets = res?.data?.tickets || res?.tickets || [];
  setMsg("");
  render();
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("adminCategoriesBtn")?.addEventListener("click", () => {
    alert("Kategóriák – hamarosan.");
  });

  let user = null;
  try { user = JSON.parse(localStorage.getItem("rp_user") || "null"); } catch {}
  const isAdmin = user && (Number(user.role_id) === 1 || user.is_admin === true || user.role === "admin" || user.role === "ADMIN");
  if (!isAdmin) {
    alert("Ehhez admin jogosultság kell.");
    window.location.href = "./products.html";
    return;
  }

  const pill = document.getElementById("adminNamePill");
  if (pill) {
    const n = user?.full_name || user?.name || user?.email || "Admin";
    pill.textContent = `Admin: ${n}`;
  }

  try { await loadTickets(); }
  catch (e) { setMsg(e?.message || String(e)); }
});
