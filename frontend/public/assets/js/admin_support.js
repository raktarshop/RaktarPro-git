let tickets = [];

function esc(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setMsg(text) {
  const el = document.getElementById("supportMsg");
  if (el) el.textContent = text || "";
}

function t(key) {
  return (window.lang && typeof window.lang.t === "function") ? window.lang.t(key) : key;
}

function formatDate(s) {
  if (!s) return "";
  return String(s).replace("T", " ").replace("Z", "");
}

function flashBtn(btn, success) {
  const icon = btn.querySelector("i");
  if (!icon) return;
  if (success) {
    icon.className = "bi bi-check-circle-fill text-success";
    btn.style.transform = "scale(1.2)";
    setTimeout(() => { icon.className = "bi bi-check2"; btn.style.transform = ""; }, 1200);
  } else {
    icon.className = "bi bi-x-circle-fill text-danger";
    setTimeout(() => { icon.className = "bi bi-check2"; btn.style.transform = ""; }, 1200);
  }
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
    tr.style.animation = "rp-fade-in 0.25s ease both";
    tr.innerHTML = `
      <td>${esc(it.id)}</td>
      <td>${esc(it.email)}</td>
      <td style="max-width:520px; white-space:pre-wrap;">${esc(it.message)}</td>
      <td>${esc(formatDate(it.created_at))}</td>
      <td>${esc(statusText)}</td>
      <td>
        ${resolved ? `<span class="text-success"><i class="bi bi-check-circle-fill me-1"></i>${esc(t("admin_support_status_resolved"))}</span>` 
          : `<button class="btn btn-sm rp-admin-btn rp-icon-btn" data-act="resolve" data-id="${esc(it.id)}" 
               title="${esc(t('admin_support_resolve'))}" style="transition: all 200ms ease;">
              <i class="bi bi-check2"></i>
            </button>`}
      </td>
    `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll("button[data-act='resolve']").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      btn.disabled = true;
      setMsg(t("admin_support_resolve") + "...");
      try {
        await window.api.put(`/admin/support/${id}`, {});
        flashBtn(btn, true);
        setTimeout(async () => {
          await loadTickets();
          setMsg("✓ Kész.");
        }, 600);
      } catch (e) {
        flashBtn(btn, false);
        setMsg(e?.message || String(e));
        btn.disabled = false;
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
    pill.innerHTML = `<span class="rp-admin-pill"><i class="bi bi-person-fill me-1"></i>${esc(t('admin_logged_in_as'))} <strong>${esc(n)}</strong></span>`;
  }

  // Re-render on lang change
  window.addEventListener("storage", (e) => {
    if (!e?.key || e.key === "rp_lang") render();
  });

  try { await loadTickets(); }
  catch (e) { setMsg(e?.message || String(e)); }
});
