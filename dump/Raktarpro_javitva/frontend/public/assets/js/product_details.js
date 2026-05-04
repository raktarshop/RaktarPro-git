(function(){
  function qs(sel){ return document.querySelector(sel); }
  function getUser(){ try{ return JSON.parse(localStorage.getItem('rp_user')||'null'); }catch{ return null; } }
  function isAdmin(u){ if(!u) return false; if(u.is_admin===true) return true; if(Number(u.is_admin)===1) return true; if(Number(u.role_id)===1) return true; if(typeof u.role==='string'&&u.role.toLowerCase()==='admin') return true; return false; }
  function getParam(n){ return new URL(window.location.href).searchParams.get(n); }
  function esc(s){ return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]||m)); }
  function pickPrice(p){ return p.unit_price??p.price??p.unitPrice??0; }
  function formatFt(n){
    const x=Number(n)||0;
    const suffix=window.lang?.t('currency_suffix')||'Ft';
    return x.toLocaleString('hu-HU')+' '+suffix;
  }
  function t(key){ return window.lang?.t ? window.lang.t(key) : key; }

  // ──────────────────────────────────────────────
  // Curated multi-angle Unsplash sets per keyword
  // ──────────────────────────────────────────────
  const PRODUCT_IMAGE_SETS = {
    laptop: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&h=700&fit=crop',
    ],
    notebook: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&h=700&fit=crop',
    ],
    macbook: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1605134513573-384dcf99a44c?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&h=700&fit=crop',
    ],
    iphone: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1611791485032-313ab94da6f6?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=700&fit=crop',
    ],
    samsung: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&h=700&fit=crop',
    ],
    galaxy: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&h=700&fit=crop',
    ],
    telefon: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&h=700&fit=crop',
    ],
    phone: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&h=700&fit=crop',
    ],
    mobil: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&h=700&fit=crop',
    ],
    tablet: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=700&fit=crop',
    ],
    ipad: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=700&fit=crop',
    ],
    fejhallgató: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&h=700&fit=crop',
    ],
    headphone: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&h=700&fit=crop',
    ],
    watch: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&h=700&fit=crop',
    ],
    óra: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&h=700&fit=crop',
    ],
    monitor: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=900&h=700&fit=crop',
    ],
    speaker: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1525099120919-278594ef12b5?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1596460107916-430662021049?w=900&h=700&fit=crop',
    ],
    hangszóró: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1525099120919-278594ef12b5?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1596460107916-430662021049?w=900&h=700&fit=crop',
    ],
    kamera: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1617526738882-1ea945ce3e56?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1621520291095-aa6c7137f048?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=900&h=700&fit=crop',
    ],
    camera: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1617526738882-1ea945ce3e56?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1621520291095-aa6c7137f048?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=900&h=700&fit=crop',
    ],
  };

  // Generic fallback sets for categories
  const CATEGORY_FALLBACK_SETS = {
    elektronika: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&h=700&fit=crop',
    ],
    electronics: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&h=700&fit=crop',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&h=700&fit=crop',
    ],
  };

  // Generic product fallback (6 different product shots)
  const GENERIC_FALLBACK = [
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&h=700&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=700&fit=crop',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=900&h=700&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=900&h=700&fit=crop',
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=900&h=700&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&h=700&fit=crop',
  ];

  function getProductImageSet(p) {
    // 1. Use product's own image_url as first image, fill rest from matched set
    const ownImg = (p.image_url || p.imageUrl || '').trim();

    const name = String(p.name || '').toLowerCase();
    const cat = String(p.category_name || p.category || p.categoryName || '').toLowerCase();

    // 2. Find matching curated set by name keyword
    for (const [kw, set] of Object.entries(PRODUCT_IMAGE_SETS)) {
      if (name.includes(kw)) {
        if (ownImg) return [ownImg, ...set.filter(u => u !== ownImg)].slice(0, 6);
        return set;
      }
    }

    // 3. Find matching set by category
    for (const [kw, set] of Object.entries(CATEGORY_FALLBACK_SETS)) {
      if (cat.includes(kw)) {
        if (ownImg) return [ownImg, ...set.filter(u => u !== ownImg)].slice(0, 6);
        return set;
      }
    }

    // 4. Use own image + generic fallbacks
    if (ownImg) return [ownImg, ...GENERIC_FALLBACK.filter(u => u !== ownImg)].slice(0, 6);

    // 5. Pure generic fallback
    return GENERIC_FALLBACK;
  }

  function renderCarousel(images, alt){
    const wrap=qs('#pdCarouselWrap');
    if(!wrap) return;
    const id='pdCarousel';
    const indicators=images.map((_,i)=>
      `<button type="button" data-bs-target="#${id}" data-bs-slide-to="${i}" class="${i===0?'active':''}" aria-label="Slide ${i+1}"></button>`
    ).join('');
    const items=images.map((src,i)=>
      `<div class="carousel-item ${i===0?'active':''}">
        <div class="rp-carousel-img-wrap">
          <img src="${esc(src)}" class="d-block" alt="${esc(alt)} – ${i+1}" loading="${i===0?'eager':'lazy'}"
               onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&h=700&fit=crop';">
        </div>
       </div>`
    ).join('');
    wrap.innerHTML=`
      <div id="${id}" class="carousel slide rp-carousel" data-bs-ride="false">
        <div class="carousel-indicators">${indicators}</div>
        <div class="carousel-inner">${items}</div>
        <button class="carousel-control-prev" type="button" data-bs-target="#${id}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span><span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${id}" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span><span class="visually-hidden">Next</span>
        </button>
      </div>
      <div class="rp-carousel-thumbs mt-2 d-flex gap-2 flex-wrap">
        ${images.map((src,i)=>`
          <button class="rp-thumb ${i===0?'active':''}" type="button" data-bs-target="#${id}" data-bs-slide-to="${i}">
            <img src="${esc(src)}" alt="${esc(alt)} ${i+1}" loading="lazy"
                 onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=150&fit=crop';">
          </button>`).join('')}
      </div>`;

    const carousel=document.getElementById(id);
    if(carousel){
      carousel.addEventListener('slid.bs.carousel', e=>{
        document.querySelectorAll('.rp-thumb').forEach((th,idx)=>{
          th.classList.toggle('active', idx===e.to);
        });
      });
    }
  }

  function getStockPill(stock, admin){
    const n = stock === null || stock === undefined ? null : Number(stock);
    if(n === null){
      return `<span class="rp-stock-pill rp-stock--ok"><i class="bi bi-check-circle-fill"></i> ${esc(t('in_stock'))}</span>`;
    } else if(n <= 0){
      return `<span class="rp-stock-pill rp-stock--out"><i class="bi bi-x-circle-fill"></i> ${esc(t('out_of_stock'))}</span>`;
    } else if(n <= 5){
      return `<span class="rp-stock-pill rp-stock--warn"><i class="bi bi-exclamation-circle-fill"></i> ${esc(t('low_stock'))}${admin ? ` (${n} ${esc(t('pcs'))})` : ''}</span>`;
    } else {
      return `<span class="rp-stock-pill rp-stock--ok"><i class="bi bi-check-circle-fill"></i> ${esc(t('in_stock'))}${admin ? ` (${n} ${esc(t('pcs'))})` : ''}</span>`;
    }
  }

  function getCart(){ try{ return JSON.parse(localStorage.getItem('rp_cart')||'[]'); }catch{ return []; } }
  function setCart(items){ localStorage.setItem('rp_cart',JSON.stringify(items)); window.dispatchEvent(new Event('storage')); }
  function addToCart(productId){ const id=String(productId); const cart=getCart(); const found=cart.find(x=>String(x.id)===id); if(found) found.qty=(Number(found.qty)||0)+1; else cart.push({id:Number(id),qty:1}); setCart(cart); }

  async function load(){
    const idRaw=getParam('id'); const id=Number(idRaw);
    const err=qs('#pdError'); const wrap=qs('#pdWrap');
    if(!id){ if(err){err.style.display='block';err.textContent='Hiányzó termék azonosító.';} return; }

    try{
      const res=await window.api.get(`/products/${id}`);
      const p=res?.data?.data??res?.data??res;
      if(!p||!p.id){ if(err){err.style.display='block';err.textContent='Termék nem található.';} return; }

      const user=getUser(); const admin=isAdmin(user);
      const adminMeta=qs('#pdAdminMeta');
      if(adminMeta&&!admin) adminMeta.style.display='none';

      qs('#pdTitle').textContent=p.name||'Termék';
      qs('#pdPrice').textContent=formatFt(pickPrice(p));
      qs('#pdCategory').textContent=p.category_name||p.category||t('category_default');

      const stock=(p.stock!==undefined&&p.stock!==null)?Number(p.stock):null;
      const stockEl=qs('#pdStock');
      if(stockEl) stockEl.innerHTML=getStockPill(stock, admin);

      const skuEl=qs('#pdSku'); if(skuEl) skuEl.textContent=p.sku||'-';
      const idEl=qs('#pdId'); if(idEl) idEl.textContent=String(p.id||'-');
      const stockExact=qs('#pdStockExact'); if(stockExact) stockExact.textContent=admin&&stock!==null?String(stock):'-';

      const desc=(p.long_description||p.longDescription||p.description||'').toString();
      qs('#pdDesc').textContent=desc;

      const images=getProductImageSet(p);
      renderCarousel(images, p.name||'Termék');

      const addBtn=qs('#pdAddBtn');
      if(addBtn){
        if(stock!==null&&stock<=0){ addBtn.disabled=true; addBtn.style.opacity='.5'; }
        addBtn.addEventListener('click',()=>addToCart(p.id));
      }

      if(wrap) wrap.style.display='';
      if(err) err.style.display='none';
    } catch(e){
      if(err){ err.style.display='block'; err.textContent='Nem sikerült betölteni a terméket. Kérjük próbáld újra.'; }
    }
  }

  document.addEventListener('DOMContentLoaded', load);
})();
