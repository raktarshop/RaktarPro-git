(function(){
  function qs(sel){ return document.querySelector(sel); }

  function getUser(){
    try{ return JSON.parse(localStorage.getItem('rp_user') || 'null'); }catch{ return null; }
  }

  function isAdmin(user){
    if(!user) return false;
    if(user.is_admin === true) return true;
    if(Number(user.is_admin) === 1) return true;
    if(Number(user.role_id) === 1) return true;
    if(typeof user.role === 'string' && user.role.toLowerCase() === 'admin') return true;
    return false;
  }

  function getParam(name){
    const u = new URL(window.location.href);
    return u.searchParams.get(name);
  }

  function escapeHtml(s){
    return String(s ?? '').replace(/[&<>"]+/g, (m)=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'
    }[m] || m));
  }

  function formatFt(n){
    const x = Number(n)||0;
    return x.toLocaleString('hu-HU') + ' Ft';
  }

  function pickPrice(p){
    return p.unit_price ?? p.price ?? p.unitPrice ?? 0;
  }

  function normalizeImages(p){
    const out = [];
    const push = (u)=>{ if(typeof u === 'string' && u.trim()) out.push(u.trim()); };

    if(Array.isArray(p?.images)) p.images.forEach(push);

    const raw = p?.image_urls ?? p?.imageUrls ?? '';
    if(typeof raw === 'string' && raw.trim()){
      try{
        const dec = JSON.parse(raw);
        if(Array.isArray(dec)) dec.forEach(push);
      }catch{
        raw.split(',').forEach(push);
      }
    }

    push(p?.image_url);
    push(p?.imageUrl);

    const uniq = [...new Set(out)].filter(Boolean);
    if(uniq.length) return uniq.slice(0,5);

    const seed = String(p?.sku || p?.id || 'rp');
    return [1,2,3,4,5].map(i => `https://picsum.photos/seed/${encodeURIComponent(seed)}-${i}/900/700`);
  }

  function renderCarousel(images, alt){
    const wrap = qs('#pdCarouselWrap');
    if(!wrap) return;

    const id = 'pdCarousel';
    const indicators = images.map((_,i)=>
      `<button type="button" data-bs-target="#${id}" data-bs-slide-to="${i}" class="${i===0?'active':''}" aria-current="${i===0?'true':'false'}" aria-label="Slide ${i+1}"></button>`
    ).join('');

    const items = images.map((src,i)=>
      `<div class="carousel-item ${i===0?'active':''}">
        <img src="${escapeHtml(src)}" class="d-block w-100" alt="${escapeHtml(alt)}" loading="lazy"
             onerror="this.onerror=null;this.src='https://picsum.photos/seed/rp-fallback-${i+1}/900/700';">
      </div>`
    ).join('');

    wrap.innerHTML = `
      <div id="${id}" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">${indicators}</div>
        <div class="carousel-inner">${items}</div>
        <button class="carousel-control-prev" type="button" data-bs-target="#${id}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${id}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    `;
  }

  function getCart(){
    try{ return JSON.parse(localStorage.getItem('rp_cart') || '[]'); }
    catch{ return []; }
  }

  function setCart(items){
    localStorage.setItem('rp_cart', JSON.stringify(items));
    window.dispatchEvent(new Event('storage'));
  }

  function addToCart(productId){
    const id = String(productId);
    const cart = getCart();
    const found = cart.find(x => String(x.id) === id);
    if(found) found.qty = (Number(found.qty)||0) + 1;
    else cart.push({ id: Number(id), qty: 1 });
    setCart(cart);
  }

  async function load(){
    const idRaw = getParam('id');
    const id = Number(idRaw);

    const err = qs('#pdError');
    const wrap = qs('#pdWrap');

    if(!id){
      if(err){ err.style.display='block'; err.textContent='Hiányzó termék azonosító.'; }
      return;
    }

    try{
      const res = await window.api.get(`/products/${id}`);
      const p = res?.data?.data ?? res?.data ?? res;
      if(!p || !p.id){
        if(err){ err.style.display='block'; err.textContent='Termék nem található.'; }
        return;
      }

      const user = getUser();
      const admin = isAdmin(user);

      // admin meta
      const adminMeta = qs('#pdAdminMeta');
      if(adminMeta && !admin) adminMeta.style.display='none';

      // fill
      qs('#pdTitle').textContent = p.name || 'Termék';
      qs('#pdPrice').textContent = formatFt(pickPrice(p));
      qs('#pdCategory').textContent = p.category_name || p.category || 'Kategória';

      const stock = (p.stock !== undefined && p.stock !== null) ? Number(p.stock) : null;

      // Stock badge (public: no exact number, admin: show exact)
      const stockEl = qs('#pdStock');
      const exactEl = qs('#pdStockExact');

      if (exactEl) {
        exactEl.textContent = admin && stock !== null ? String(stock) : '-';
      }

      if (stockEl) {
        stockEl.classList.remove('rp-stock--ok', 'rp-stock--warn', 'rp-stock--out');

        if (stock === null) {
          stockEl.textContent = 'Készleten';
          stockEl.classList.add('rp-stock--ok');
        } else if (stock <= 0) {
          stockEl.textContent = 'Nincs készleten';
          stockEl.classList.add('rp-stock--out');
        } else if (stock <= 5) {
          stockEl.textContent = admin ? `Utolsó darabok! (${stock} db)` : 'Utolsó darabok!';
          stockEl.classList.add('rp-stock--warn');
        } else {
          stockEl.textContent = admin ? `Készleten (${stock} db)` : 'Készleten';
          stockEl.classList.add('rp-stock--ok');
        }
      }


      const skuEl = qs('#pdSku');
      if(skuEl) skuEl.textContent = p.sku || '-';
      const idEl = qs('#pdId');
      if(idEl) idEl.textContent = String(p.id || '-');

      const desc = (p.long_description || p.longDescription || p.description || '').toString();
      qs('#pdDesc').textContent = desc;

      const images = normalizeImages(p);
      renderCarousel(images, p.name || 'Termék');

      // buttons
      const addBtn = qs('#pdAddBtn');
      const addBtnTop = qs('#pdAddBtnTop');
      const onAdd = ()=>{
        addToCart(p.id);
      };
      if(addBtn) addBtn.addEventListener('click', onAdd);
      if(addBtnTop) addBtnTop.addEventListener('click', onAdd);

      if(wrap) wrap.style.display='';
      if(err) err.style.display='none';

    } catch(e){
      if(err){
        err.style.display='block';
        err.textContent='Nem sikerült betölteni a terméket.';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', load);
})();
