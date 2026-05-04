// admin.js – termékek + kategóriák kezelése

let all = [];
let categories = [];

// ── UTILS ──────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, m =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])
  );
}

function normalizePrice(v) {
  const n = Number(String(v ?? '').replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function setMsg(txt) {
  const el = document.getElementById('adminMsg');
  if (el) el.textContent = txt || '';
}

function setCatMsg(txt, color) {
  const el = document.getElementById('catMsg');
  if (!el) return;
  el.textContent = txt || '';
  el.style.color = color || 'var(--text-dim)';
}

function getCategoryNameById(id) {
  return categories.find(x => String(x.id) === String(id))?.name || '';
}

function broadcastProductChange() {
  try { localStorage.setItem('rp_products_updated', String(Date.now())); } catch {}
}

function extractProductsList(res) {
  if (!res) return null;
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data?.products)) return res.data.products;
  if (Array.isArray(res?.products)) return res.products;
  const d = res.data ?? res;
  if (Array.isArray(d)) return d;
  return null;
}

function extractCategories(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data?.categories)) return res.data.categories;
  if (Array.isArray(res?.categories)) return res.categories;
  if (Array.isArray(res?.data)) return res.data;
  return [];
}

function isAdminUser(user) {
  if (!user) return false;
  return user.is_admin === true || Number(user.is_admin) === 1 ||
    Number(user.role_id) === 1 ||
    (typeof user.role === 'string' && user.role.toLowerCase() === 'admin');
}

// ── CATEGORY MANAGER ───────────────────────────────────────────────────────

function renderCategoryChips() {
  const list = document.getElementById('catList');
  if (!list) return;
  if (!categories.length) {
    list.innerHTML = '<span style="color:var(--text-dim);font-size:13px;">Még nincs kategória.</span>';
    return;
  }
  list.innerHTML = categories.map(c => `
    <span class="cat-chip">
      ${esc(c.name)}
      <button class="cat-chip-del" data-cat-id="${c.id}" title="Törlés">×</button>
    </span>
  `).join('');

  list.querySelectorAll('.cat-chip-del').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.catId;
      const cat = categories.find(x => String(x.id) === String(id));
      if (!confirm(`Biztosan törlöd: "${cat?.name}"?\nAz ehhez rendelt termékek kategória nélkül maradnak.`)) return;
      btn.disabled = true;
      try {
        await window.api.del(`/categories/${id}`);
        categories = categories.filter(x => String(x.id) !== String(id));
        renderCategoryChips();
        setCatMsg('✓ Kategória törölve.', '#10b981');
        apply(); // re-render product table with updated dropdowns
        setTimeout(() => setCatMsg(''), 2500);
      } catch(e) {
        setCatMsg('Hiba: ' + (e.message || e), '#ef4444');
        btn.disabled = false;
      }
    });
  });
}

async function initCategoryManager() {
  const addBtn = document.getElementById('catAddBtn');
  const input  = document.getElementById('catNewName');
  if (!addBtn || !input) return;

  addBtn.addEventListener('click', async () => {
    const name = input.value.trim();
    if (!name) { setCatMsg('Adj meg egy kategória nevet.', '#f59e0b'); return; }
    addBtn.disabled = true;
    setCatMsg('Mentés…');
    try {
      const res = await window.api.post('/categories', { name });
      const newId = res?.data?.id || res?.id;
      categories.push({ id: newId, name });
      categories.sort((a,b) => a.name.localeCompare(b.name, 'hu'));
      renderCategoryChips();
      input.value = '';
      setCatMsg('✓ Kategória hozzáadva.', '#10b981');
      apply();
      setTimeout(() => setCatMsg(''), 2500);
    } catch(e) {
      setCatMsg('Hiba: ' + (e.message || e), '#ef4444');
    } finally {
      addBtn.disabled = false;
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') addBtn.click();
  });
}

// ── PRODUCT TABLE ──────────────────────────────────────────────────────────

function buildCatOptions(selectedId) {
  return [
    `<option value="">(nincs)</option>`,
    ...categories.map(c =>
      `<option value="${c.id}"${String(c.id) === String(selectedId) ? ' selected' : ''}>${esc(c.name)}</option>`
    )
  ].join('');
}

function render(list) {
  const tbody = document.getElementById('adminTbody');
  tbody.innerHTML = '';

  for (const p of list) {
    const price = normalizePrice(p.unit_price ?? p.price ?? 0);
    const stock = Number(p.stock ?? 0);
    const catId  = p.category_id ?? '';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="small opacity-75">${esc(p.id)}</td>
      <td><strong>${esc(p.name || '')}</strong><br><span class="small opacity-60">${esc(p.sku||'')}</span></td>
      <td style="min-width:160px;">
        <select class="form-select form-select-sm" data-field="category_id" data-id="${p.id}">
          ${buildCatOptions(catId)}
        </select>
      </td>
      <td style="min-width:110px;">
        <input class="form-control form-control-sm" type="number" min="0" step="1"
          value="${price}" data-field="unit_price" data-id="${p.id}">
      </td>
      <td style="min-width:100px;">
        <input class="form-control form-control-sm" type="number" min="0" step="1"
          value="${stock}" data-field="stock" data-id="${p.id}">
      </td>
      <td style="min-width:90px;">
        <div class="d-flex gap-1">
          <button class="btn btn-sm rp-admin-btn rp-icon-btn" data-act="save" data-id="${p.id}" title="Mentés">
            <i class="bi bi-check2"></i>
          </button>
          <button class="btn btn-sm rp-admin-btn-danger rp-icon-btn" data-act="del" data-id="${p.id}" title="Törlés">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);

    // Save button
    tr.querySelector('[data-act="save"]').addEventListener('click', async btn => {
      btn = tr.querySelector('[data-act="save"]');
      const id = p.id;
      const unit_price = normalizePrice(tr.querySelector(`[data-field="unit_price"]`).value);
      const stock      = Math.max(0, Number(tr.querySelector(`[data-field="stock"]`).value) || 0);
      const catEl      = tr.querySelector(`[data-field="category_id"]`);
      const category_id = catEl?.value ? Number(catEl.value) : null;

      btn.disabled = true;
      setMsg('Mentés…');
      try {
        await window.api.put(`/products/${id}`, { unit_price, stock, category_id });
        setMsg(`✓ Mentve: #${id}`);
        const icon = btn.querySelector('i');
        if (icon) { icon.className = 'bi bi-check-circle-fill text-success'; setTimeout(() => icon.className = 'bi bi-check2', 1200); }
        const idx = all.findIndex(x => String(x.id) === String(id));
        if (idx >= 0) { all[idx].unit_price = unit_price; all[idx].stock = stock; all[idx].category_id = category_id; all[idx].category_name = getCategoryNameById(category_id); }
        broadcastProductChange();
      } catch(e) {
        setMsg('Hiba: ' + (e.message || e));
      } finally {
        btn.disabled = false;
      }
    });

    // Delete button
    tr.querySelector('[data-act="del"]').addEventListener('click', async () => {
      if (!confirm(`Biztosan törlöd: "${p.name}"?`)) return;
      try {
        await window.api.del(`/products/${p.id}`);
        all = all.filter(x => String(x.id) !== String(p.id));
        apply();
        setMsg(`✓ Törölve: #${p.id}`);
        broadcastProductChange();
      } catch(e) {
        setMsg('Hiba: ' + (e.message || e));
      }
    });
  }
}

// ── LOAD / APPLY ───────────────────────────────────────────────────────────

async function loadCategories() {
  const res = await window.api.get('/categories');
  categories = extractCategories(res);
}

async function loadProducts() {
  setMsg('Betöltés…');
  const res = await window.api.get('/products?limit=200');
  const list = extractProductsList(res);
  if (!Array.isArray(list)) throw new Error('A /products nem listát adott.');
  all = list;
  setMsg('');
}

function apply() {
  const q = (document.getElementById('adminSearch')?.value || '').trim().toLowerCase();
  const list = (q ? all.filter(p => (p.name||'').toLowerCase().includes(q) || (p.sku||'').toLowerCase().includes(q)) : all)
    .slice().sort((a,b) => Number(a.id) - Number(b.id));
  render(list);
}

// ── NEW PRODUCT MODAL ──────────────────────────────────────────────────────

function initNewProductModal() {
  const modalEl  = document.getElementById('newProductModal');
  const newPSave = document.getElementById('newPSave');
  const newPCat  = document.getElementById('newPCategory');
  const newPMsg  = document.getElementById('newPMsg');
  let bsModal = null;
  if (modalEl && window.bootstrap?.Modal) bsModal = new window.bootstrap.Modal(modalEl);

  function setNewMsg(txt) { if (newPMsg) newPMsg.textContent = txt || ''; }

  function fillCatSelect() {
    if (!newPCat) return;
    newPCat.innerHTML = categories.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('') || '<option value="">–</option>';
  }

  document.getElementById('adminAddProduct')?.addEventListener('click', () => {
    document.getElementById('newPId').value = '';
    document.getElementById('modalTitle').textContent = 'Új termék';
    ['newPName','newPSku','newPPrice','newPStock'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
    fillCatSelect();
    setNewMsg('');
    bsModal?.show();
  });

  newPSave?.addEventListener('click', async () => {
    const name      = (document.getElementById('newPName')?.value || '').trim();
    const sku       = (document.getElementById('newPSku')?.value  || '').trim();
    const unit_price = normalizePrice(document.getElementById('newPPrice')?.value);
    const stock      = Math.max(0, Number(document.getElementById('newPStock')?.value) || 0);
    const category_id = Number(newPCat?.value || 0) || null;

    if (!name || !sku || unit_price <= 0) {
      setNewMsg('Kérlek töltsd ki: Név, SKU, Ár (>0).');
      return;
    }

    newPSave.disabled = true;
    setNewMsg('Mentés…');
    try {
      await window.api.post('/products', { name, sku, unit_price, stock, category_id });
      await loadProducts();
      apply();
      broadcastProductChange();
      setNewMsg('✓ Sikeres létrehozás!');
      setTimeout(() => bsModal?.hide(), 800);
    } catch(e) {
      setNewMsg('Hiba: ' + (e?.message || String(e)));
    } finally {
      newPSave.disabled = false;
    }
  });
}

// ── INIT ───────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  // Auth check
  let user = null;
  try { user = JSON.parse(localStorage.getItem('rp_user') || 'null'); } catch {}
  if (!isAdminUser(user)) {
    window.rpToast('Ehhez admin jogosultság kell.', '', 'info');
    window.location.href = './products.html';
    return;
  }

  document.getElementById('adminSearch')?.addEventListener('input', apply);
  document.getElementById('adminReload')?.addEventListener('click', async () => {
    try { await loadCategories(); await loadProducts(); renderCategoryChips(); apply(); }
    catch(e) { setMsg('Hiba: ' + (e.message || e)); }
  });

  initCategoryManager();
  initNewProductModal();

  try {
    await loadCategories();
    await loadProducts();
    renderCategoryChips();
    apply();
  } catch(e) {
    setMsg('⚠️ API nem elérhető – ellenőrizd a backend kapcsolatot.');
    console.error(e);
  }
});
