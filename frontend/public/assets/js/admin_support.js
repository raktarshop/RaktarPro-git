let tickets = [];

function esc(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function setMsg(text) {
  const el = document.getElementById("supportMsg");
  if (el) el.textContent = text || "";
}
function formatDate(s) {
  if (!s) return "";
  return String(s).replace("T", " ").replace("Z", "").slice(0, 16);
}
function truncate(str, max) {
  return str && str.length > max ? str.slice(0, max) + "…" : str || "";
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
    setTimeout(() => { icon.className = "bi bi-check2"; }, 1200);
  }
}

// ── Részlet modal ──────────────────────────────────────────
function showModal(it) {
  const resolved = Number(it.resolved) === 1;
  let overlay = document.getElementById('rpSupportModal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'rpSupportModal';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);padding:20px;';
    overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div style="background:var(--card,#161b2e);border:1px solid var(--glass-border,rgba(255,255,255,.1));border-radius:20px;max-width:500px;width:100%;box-shadow:0 24px 70px rgba(0,0,0,.5);padding:28px 28px 24px;position:relative;">
      <button onclick="document.getElementById('rpSupportModal').remove()"
        style="position:absolute;top:14px;right:16px;background:none;border:none;color:var(--text-dim,#888);font-size:22px;cursor:pointer;line-height:1;">&times;</button>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
        <i class="bi ${resolved?'bi-check-circle-fill text-success':'bi-envelope-fill'}" style="font-size:22px;"></i>
        <div>
          <div style="font-weight:700;font-size:15px;">${esc(it.email)}</div>
          <div style="font-size:11px;color:var(--text-dim,#888);">#${it.id} · ${formatDate(it.created_at)}</div>
        </div>
        <span style="margin-left:auto;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;${resolved?'background:rgba(34,197,94,.15);color:#4ade80;':'background:rgba(251,191,36,.15);color:#fbbf24;'}">
          ${resolved ? '✓ Megoldva' : '⏳ Nyitott'}
        </span>
      </div>
      <div style="background:var(--glass,rgba(255,255,255,.04));border-radius:12px;padding:16px;font-size:14px;line-height:1.7;color:var(--text,#e8edf5);white-space:pre-wrap;margin-bottom:${resolved?'0':'16px'};">${esc(it.message)}</div>
      ${resolved ? '' : `
      <button class="btn btn-sm rp-admin-btn w-100" id="modalResolveBtn" data-id="${it.id}" style="margin-top:4px;">
        <i class="bi bi-check2 me-2"></i>Megoldottnak jelölés
      </button>`}
    </div>`;

  const resolveBtn = overlay.querySelector('#modalResolveBtn');
  if (resolveBtn) {
    resolveBtn.addEventListener('click', async () => {
      resolveBtn.disabled = true;
      resolveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Folyamatban...';
      try {
        await window.api.put(`/admin/support/${it.id}`, {});
        overlay.remove();
        await loadTickets();
        setMsg("✓ Jegy lezárva.");
      } catch(e) {
        resolveBtn.disabled = false;
        resolveBtn.innerHTML = '<i class="bi bi-check2 me-2"></i>Megoldottnak jelölés';
        setMsg(e?.message || String(e));
      }
    });
  }
}

// ── Render ─────────────────────────────────────────────────
function render() {
  const tbody = document.getElementById("supportTbody");
  tbody.innerHTML = "";

  if (!tickets.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;opacity:.6;padding:30px;">Nincsenek support jegyek</td></tr>`;
    return;
  }

  for (const it of tickets) {
    const resolved = Number(it.resolved) === 1;
    const tr = document.createElement("tr");
    tr.style.cursor = "pointer";
    tr.title = "Kattints a részletekért";
    tr.innerHTML = `
      <td style="font-weight:600;width:40px;">${esc(it.id)}</td>
      <td style="font-size:13px;">${esc(it.email)}</td>
      <td style="max-width:260px;">
        <span style="color:var(--text-dim,#888);font-size:13px;">${esc(truncate(it.message, 60))}</span>
      </td>
      <td style="font-size:12px;white-space:nowrap;">${formatDate(it.created_at)}</td>
      <td>
        ${resolved
          ? `<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;background:rgba(34,197,94,.15);color:#4ade80;"><i class="bi bi-check-circle-fill"></i> Megoldva</span>`
          : `<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;background:rgba(251,191,36,.15);color:#fbbf24;"><i class="bi bi-clock"></i> Nyitott</span>`
        }
      </td>`;
    tr.addEventListener('click', () => showModal(it));
    tbody.appendChild(tr);
  }
}

async function loadTickets() {
  setMsg("Betöltés...");
  try {
    const res = await window.api.get("/admin/support");
    tickets = res?.data?.tickets || res?.tickets || [];
    setMsg("");
    render();
  } catch(e) {
    setMsg(e?.message || String(e));
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let user = null;
  try { user = JSON.parse(localStorage.getItem("rp_user") || "null"); } catch {}
  const isAdmin = user && (Number(user.role_id) === 1 || user.is_admin === true || user.role === "admin");
  if (!isAdmin) {
    window.rpToast?.('Ehhez admin jogosultság kell.', '', 'info');
    window.location.href = "./products.html";
    return;
  }

  const pill = document.getElementById("adminNamePill");
  if (pill) {
    const n = user?.full_name || user?.name || user?.email || "Admin";
    pill.innerHTML = `<span class="rp-admin-pill"><i class="bi bi-person-fill me-1"></i>Bejelentkezve: <strong>${esc(n)}</strong></span>`;
  }

  window.addEventListener("storage", e => { if (!e?.key || e.key === "rp_lang") render(); });

  try { await loadTickets(); }
  catch (e) { setMsg(e?.message || String(e)); }
});
