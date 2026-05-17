function renderStars(avg){
  const r=Math.round((parseFloat(avg)||0)*2)/2;
  return [1,2,3,4,5].map(i=>{
    if(r>=i)return'<i class="bi bi-star-fill" style="color:#f59e0b;font-size:11px;"></i>';
    if(r>=i-0.5)return'<i class="bi bi-star-half" style="color:#f59e0b;font-size:11px;"></i>';
    return'<i class="bi bi-star" style="color:rgba(148,163,184,.3);font-size:11px;"></i>';
  }).join('');
}
// products_new.js — RaktárPro v21 — CLEAN REWRITE

// ── KATEGÓRIA SZABÁLYOK ──
const CAT_HARDCODE={1:'Mobil',2:'Mobil',3:'Gaming',4:'Laptop',5:'Laptop',6:'Laptop',7:'Laptop',8:'Fejhallgató',9:'Fejhallgató',10:'Hangszóró',12:'TV & Monitor',13:'Mobil',14:'Mobil',15:'Mobil',16:'Mobil',17:'Laptop',18:'Laptop',19:'Laptop',20:'Laptop',22:'TV & Monitor',23:'Fejhallgató',24:'Fejhallgató',25:'Hangszóró',26:'PC Kiegészítők',27:'PC Kiegészítők',28:'TV & Monitor',29:'TV & Monitor',30:'Fotózás',31:'Fotózás',32:'Fotózás',34:'PC Kiegészítők',35:'Hálózat',36:'Okoseszközök',37:'Okoseszközök',39:'Mobil',40:'Laptop',41:'Laptop'};
const CAT_ICONS={'Mobil':'bi-phone','Laptop':'bi-laptop','TV & Monitor':'bi-display','Fejhallgató':'bi-headphones','Hangszóró':'bi-speaker','Fotózás':'bi-camera','Okoseszközök':'bi-smartwatch','PC Kiegészítők':'bi-mouse','Gaming':'bi-controller','Hálózat':'bi-wifi','Elektronika':'bi-lightning'};

// ── KÉPEK ──



// ── MÁRKA DETEKTÁLÁS ──
const BRAND_RULES=['Apple','Samsung','Google','Xiaomi','Sony','LG','Dell','HP','Lenovo','ASUS','Canon','Nikon','JBL','Bose','Logitech','Keychron','Anker','TP-Link','Amazon','GoPro'];
function detectBrand(p){
  // Check product NAME first (most reliable), then SKU prefix, then description
  const name=(p.name||'').toLowerCase();
  const sku=(p.sku||'').toUpperCase();
  // Explicit name-based detection (order matters: longer/more-specific first)
  if(name.includes('apple watch')||name.includes('airpods')||name.includes('macbook')||name.startsWith('iphone'))return 'Apple';
  if(name.includes('samsung'))return 'Samsung';
  if(name.includes('lg '))return 'LG';
  if(name.includes('sony'))return 'Sony';
  if(name.includes('dell'))return 'Dell';
  if(name.includes('hp ')||name.startsWith('hp'))return 'HP';
  if(name.includes('lenovo')||name.includes('thinkpad'))return 'Lenovo';
  if(name.includes('asus')||name.includes('rog '))return 'ASUS';
  if(name.includes('xiaomi')||name.includes('redmi'))return 'Xiaomi';
  if(name.includes('google pixel'))return 'Google';
  if(name.includes('canon'))return 'Canon';
  if(name.includes('nikon'))return 'Nikon';
  if(name.includes('sony alpha')||name.includes('sony wh'))return 'Sony';
  if(name.includes('jbl'))return 'JBL';
  if(name.includes('bose'))return 'Bose';
  if(name.includes('logitech'))return 'Logitech';
  if(name.includes('keychron'))return 'Keychron';
  if(name.includes('anker'))return 'Anker';
  if(name.includes('tp-link')||name.includes('archer'))return 'TP-Link';
  if(name.includes('amazon')||name.includes('echo dot'))return 'Amazon';
  if(name.includes('gopro'))return 'GoPro';
  // Fallback: check description (less reliable)
  const desc=(p.description||'').split('\n')[0].toLowerCase();
  for(const b of BRAND_RULES){if(desc.includes(b.toLowerCase()))return b;}
  return null;
}

// ── SEGÉDFÜGGVÉNYEK ──
function detectCat(p){
  const id=Number(p.id);
  if(CAT_HARDCODE[id])return CAT_HARDCODE[id];
  // API product: use category_name from DB directly
  const db=(p.category_name||p.category||'').trim();
  const VALID=['Mobil','Laptop','TV & Monitor','Fejhallgató','Hangszóró','Fotózás','Okoseszközök','PC Kiegészítők','Gaming','Hálózat'];
  return VALID.includes(db)?db:'Egyéb';
}
function getPhoto(p){return p.image_url||'';}
function t(k,fb){return window.lang?.t?.(k)||fb||k;}
function fmt(n){return Math.round(Number(n)||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Ft';}
function price(p){return p.unit_price??p.price??p.ar??0;}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function isAdmin(){try{const u=JSON.parse(localStorage.getItem('rp_user')||'null');if(!u)return false;return u.is_admin===true||Number(u.is_admin)===1||Number(u.role_id)===1||(u.role||'').toLowerCase()==='admin';}catch{return false;}}

// ── ÁLLAPOT ──
let all=[], activeCat='all', activeBrand='all', pMin=null, pMax=null, searchQ='', sortMode='default', listView=false, minRating=0, inStockOnly=false;

// ── PROGRESS BAR ──
window.addEventListener('scroll',()=>{
  const b=document.getElementById('progressBar');
  if(b){const p=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;b.style.width=Math.min(p,100)+'%';}
},{passive:true});

// ── REVEAL ──
const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});},{threshold:0.04,rootMargin:'0px 0px -10px 0px'});

// ── SIDEBAR ──
function buildSidebar(products){
  // Kategória számok
  const counts={};
  products.forEach(p=>{const c=p._cat||'Egyéb';counts[c]=(counts[c]||0)+1;});
  const allEl=document.getElementById('cnt-all');if(allEl)allEl.textContent=products.length;
  const list=document.getElementById('catList');
  if(list){
    list.innerHTML='';
    Object.entries(counts).sort((a,b)=>b[1]-a[1]).forEach(([cat,cnt])=>{
      const icon=CAT_ICONS[cat]||'bi-tag';
      const btn=document.createElement('button');
      btn.className='rp-filter-btn'+(activeCat===cat?' active':'');
      btn.dataset.cat=cat;
      btn.innerHTML=`<span class="rp-filter-name"><i class="bi ${icon} me-1" style="font-size:11px;opacity:.7;"></i>${esc(cat)}</span><span class="rp-filter-count">${cnt}</span>`;
      btn.addEventListener('click',()=>selectCat(cat));
      list.appendChild(btn);
    });
  }
  // Márka chipek
  const brandEl=document.getElementById('brandList');
  if(brandEl){
    const bc={};
    products.forEach(p=>{const b=detectBrand(p);if(b)bc[b]=(bc[b]||0)+1;});
    brandEl.innerHTML=Object.entries(bc).sort((a,b)=>b[1]-a[1]).map(([b,cnt])=>
      `<button class="rp-brand-chip${activeBrand===b?' active':''}" onclick="selectBrand('${b}')">${esc(b)} <span style="opacity:.55;font-size:10px;">${cnt}</span></button>`
    ).join('');
  }
}

function selectCat(cat){
  activeCat=cat;
  document.querySelectorAll('.rp-filter-btn[data-cat]').forEach(b=>b.classList.toggle('active',b.dataset.cat===cat));
  // all btn
  const allBtn=document.querySelector('.rp-filter-btn[data-cat="all"]');
  if(allBtn)allBtn.classList.toggle('active',cat==='all');
  render();chips();
}
window.selectCat=selectCat;

window.selectBrand=function(b){
  activeBrand=(activeBrand===b)?'all':b;
  document.querySelectorAll('.rp-brand-chip').forEach(c=>{
    const label=c.textContent.trim().split(/\s+/)[0];
    c.classList.toggle('active',activeBrand!=='all'&&label===b);
  });
  render();chips();
};

// ── SZŰRÉS + RENDEZÉS ──
function getFiltered(){
  return all.filter(p=>{
    if(activeCat!=='all'&&(p._cat||'')!==activeCat)return false;
    if(activeBrand!=='all'&&detectBrand(p)!==activeBrand)return false;
    if(searchQ){const q=searchQ.toLowerCase();if(!(p.name||'').toLowerCase().includes(q)&&!(p.description||'').toLowerCase().includes(q)&&!(p._cat||'').toLowerCase().includes(q))return false;}
    const pr=price(p);
    if(pMin!==null&&pr<pMin)return false;
    if(pMax!==null&&pr>pMax)return false;
    if(minRating>0){const avg=parseFloat(p.avg_rating)||0; if(avg<minRating)return false;}
    if(inStockOnly&&(p.stock===0||(p.stock!==undefined&&p.stock<=0)))return false;
    return true;
  });
}
function getSorted(arr){
  const a=[...arr];
  switch(sortMode){
    case'price_asc':return a.sort((x,y)=>price(x)-price(y));
    case'price_desc':return a.sort((x,y)=>price(y)-price(x));
    case'name_asc':return a.sort((x,y)=>(x.name||'').localeCompare(y.name||'','hu'));
    case'stock_desc':return a.sort((x,y)=>(y.stock||0)-(x.stock||0));
    default:return a;
  }
}

function stockDot(stock){
  const s=stock??999;
  if(s===0)return`<span class="rp-stock-dot out">✕ Nincs készleten</span>`;
  if(s<=5)return`<span class="rp-stock-dot low">⚡ Utolsó ${s} db!</span>`;
  return`<span class="rp-stock-dot ok">✓ Készleten</span>`;
}

// ── RENDER ──
function render(){
  const products=getSorted(getFiltered());
  const cntEl=document.getElementById('productCount');
  if(cntEl)cntEl.textContent=products.length+' termék';
  const grid=document.getElementById('productsGrid');
  if(!grid)return;
  grid.className='rp-products-grid'+(listView?' list-view':'');
  if(!products.length){
    grid.innerHTML=`<div class="rp-empty" style="grid-column:1/-1"><i class="bi bi-search"></i><h3>${t('empty_no_results','Nincs találat')}</h3><p>Próbálj más szűrőket</p></div>`;
    return;
  }
  const admin=isAdmin();
  grid.innerHTML=products.map((p,i)=>{
    const img=getPhoto(p), pr=price(p), cat=p._cat||'Termék', stock=p.stock??999, out=stock===0;
    const delay=0;
    const adminBadge=admin?`<span style="position:absolute;bottom:9px;left:9px;z-index:2;font-size:10px;background:rgba(0,0,0,.6);color:#ddd;padding:2px 7px;border-radius:6px;">SKU: ${esc(p.sku||'-')} · ${stock} db</span>`:'';
    return`<div class="rp-lux-card" data-id="${p.id}">
  <div class="rp-lux-img" onclick="goDetail(${p.id})" style="cursor:pointer;">
    <img src="${esc(img)}" alt="${esc(p.name)}" loading="eager" onerror="this.src='${''}'">
    <span class="rp-img-badge">${esc(cat)}</span>
    ${adminBadge}
    <button class="rp-wish-btn" data-id="${p.id}" onclick="event.stopPropagation();toggleWish(this,${p.id})"><i class="bi bi-heart"></i></button>
    <div class="rp-quick-add">
      <button class="rp-qadd-btn"${out?' disabled':''} onclick="event.stopPropagation();addCart(${p.id})">${out?t('out_of_stock','Elfogyott'):t('add_to_cart','Kosárba')}</button>
      <button class="rp-qdetail-btn" onclick="event.stopPropagation();goDetail(${p.id})"><i class="bi bi-arrows-angle-expand"></i></button>
    </div>
  </div>
  <div class="rp-lux-body" onclick="goDetail(${p.id})" style="cursor:pointer;">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:6px;">
      <div class="rp-lux-cat">${esc(cat)}</div>
      ${stockDot(stock)}
    </div>
    <div class="rp-lux-name">${esc(p.name)}</div>
    <div style="display:flex;align-items:center;gap:4px;margin:4px 0 6px;min-height:16px;">${renderStars(p.avg_rating)}<span style="font-size:11px;color:var(--text-dim);margin-left:2px;">${parseFloat(p.avg_rating)>0?(parseFloat(p.avg_rating).toFixed(1)+' ('+(p.review_count||0)+')'):'Értékelés nélkül'}</span></div>
    <div class="rp-lux-desc">${esc((p.description||'').split('\n\n')[0]||p.description||'')}</div>
    <div class="rp-lux-price">${fmt(pr)}</div>
  </div>
</div>`;
  }).join('');
  // Observe for fade-in
  
  // Restore wishlist state
  const ws=new Set(JSON.parse(localStorage.getItem('rp_wishlist')||'[]'));
  ws.forEach(id=>{const b=grid.querySelector(`.rp-wish-btn[data-id="${id}"]`);if(b){b.classList.add('active');b.querySelector('i').className='bi bi-heart-fill';}});
}

// ── NAVIGÁCIÓ ──
window.goDetail=id=>{window.location.href=`./product_details.html?id=${id}`;};

// ── WISHLIST ──
window.toggleWish=(btn,id)=>{
  const ws=new Set(JSON.parse(localStorage.getItem('rp_wishlist')||'[]'));
  const icon=btn.querySelector('i');
  if(ws.has(id)){ws.delete(id);btn.classList.remove('active');icon.className='bi bi-heart';window.rpToast?.('',t('removed_wishlist','Eltávolítva'),'info');}
  else{ws.add(id);btn.classList.add('active');icon.className='bi bi-heart-fill';window.rpToast?.('♥','Kedvencekhez adva','success');}
  localStorage.setItem('rp_wishlist',JSON.stringify([...ws]));
  // Badge frissítés
  const fb=document.getElementById('favBadge');
  if(fb){const n=ws.size;fb.textContent=n;fb.style.display=n>0?'':'none';}
};

// ── KOSÁR ──
window.addCart=id=>{
  const p=all.find(x=>x.id===id);
  if(!p||(p.stock!==undefined&&p.stock===0)){window.rpToast?.(t('out_of_stock','Elfogyott'),'Nem elérhető.','error');return;}
  const cart=JSON.parse(localStorage.getItem('rp_cart')||'[]');
  const ex=cart.find(c=>c.id===id);
  if(ex)ex.qty=(ex.qty||1)+1;
  else cart.push({id,qty:1,name:p.name,price:price(p),image:getPhoto(p)});
  localStorage.setItem('rp_cart',JSON.stringify(cart));
  updateBadge(cart);
  window.rpToast?.(p.name,t('add_to_cart','Kosárba helyezve')+' ✓','success');
  document.querySelectorAll(`[data-id="${id}"] .rp-qadd-btn`).forEach(b=>{const o=b.textContent;b.textContent='✓';setTimeout(()=>b.textContent=o,1200);});
};

function updateBadge(cart){
  const b=document.getElementById('cartBadge');if(!b)return;
  const tot=cart.reduce((s,c)=>s+(c.qty||1),0);
  b.textContent=tot;b.style.display=tot>0?'flex':'none';
}

// ── CHIP ROW ──
function chips(){
  const el=document.getElementById('activeFilters');if(!el)return;
  const c=[];
  if(activeCat!=='all')c.push(`<span class="rp-chip">${esc(activeCat)}<button class="rp-chip-x" onclick="selectCat('all')">×</button></span>`);
  if(activeBrand!=='all')c.push(`<span class="rp-chip">🏷 ${esc(activeBrand)}<button class="rp-chip-x" onclick="selectBrand('${activeBrand}')">×</button></span>`);
  if(pMin!==null)c.push(`<span class="rp-chip">Min: ${fmt(pMin)}<button class="rp-chip-x" onclick="clearPMin()">×</button></span>`);
  if(minRating>0)c.push(`<span class="rp-chip">⭐ ${minRating}+ csillag<button class="rp-chip-x" onclick="clearRating()">×</button></span>`);
  if(inStockOnly)c.push(`<span class="rp-chip">✓ Készleten<button class="rp-chip-x" onclick="clearInStock()">×</button></span>`);
  if(pMax!==null)c.push(`<span class="rp-chip">Max: ${fmt(pMax)}<button class="rp-chip-x" onclick="clearPMax()">×</button></span>`);
  el.innerHTML=c.join('');
}
window.clearPMin=()=>{pMin=null;const el=document.getElementById('priceMin');if(el)el.value='';render();chips();};
window.clearPMax=()=>{pMax=null;const el=document.getElementById('priceMax');if(el)el.value='';render();chips();};

// ── INIT ──

window.clearRating=function(){
  minRating=0;
  document.querySelectorAll('.rp-star-btn').forEach(b=>b.classList.toggle('active',b.dataset.rating==='0'));
  render();chips();
};
window.clearInStock=function(){
  inStockOnly=false;
  const cb=document.getElementById('inStockFilter');
  if(cb)cb.checked=false;
  render();chips();
};
document.addEventListener('DOMContentLoaded',()=>{
  // URL paraméterek
  const params=new URLSearchParams(window.location.search);
  if(params.get('cat'))activeCat=decodeURIComponent(params.get('cat'));
  if(params.get('brand'))activeBrand=decodeURIComponent(params.get('brand'));
  if(params.get('q')){searchQ=params.get('q');const si=document.getElementById('searchInput');if(si)si.value=searchQ;}

  document.getElementById('searchInput')?.addEventListener('input',e=>{searchQ=e.target.value;render();});
  document.getElementById('sortSelect')?.addEventListener('change',e=>{sortMode=e.target.value;render();});
  // ── PRICE RANGE SLIDER ──
  function syncSlider(){
    const rMin=document.getElementById('priceRangeMin');
    const rMax=document.getElementById('priceRangeMax');
    const nMin=document.getElementById('priceMin');
    const nMax=document.getElementById('priceMax');
    const fill=document.getElementById('rangeFill');
    const lMin=document.getElementById('sliderMinLabel');
    const lMax=document.getElementById('sliderMaxLabel');
    if(!rMin||!rMax)return;
    let lo=parseInt(rMin.value),hi=parseInt(rMax.value);
    const minBound=parseInt(rMin.min)||0;
    const maxBound=parseInt(rMax.max)||900000;
    const range=maxBound-minBound;
    lo=Math.max(minBound,Math.min(lo,hi));
    hi=Math.min(maxBound,Math.max(hi,lo));
    rMin.value=lo;rMax.value=hi;
    const pctLo=((lo-minBound)/range)*100;
    const pctHi=((hi-minBound)/range)*100;
    if(fill){fill.style.left=pctLo+'%';fill.style.width=(pctHi-pctLo)+'%';}
    rMin.style.zIndex=(lo>(maxBound/2))?3:2;
    rMax.style.zIndex=(lo>(maxBound/2))?2:3;
    if(lMin)lMin.textContent=lo.toLocaleString('hu-HU')+' Ft';
    if(lMax)lMax.textContent=hi.toLocaleString('hu-HU')+' Ft';
    if(nMin)nMin.value=lo;
    if(nMax)nMax.value=hi;
  }
  document.getElementById('priceRangeMin')?.addEventListener('input',e=>{
    const rMax=document.getElementById('priceRangeMax');
    if(rMax&&parseInt(e.target.value)>parseInt(rMax.value))e.target.value=rMax.value;
    syncSlider();
    pMin=parseInt(document.getElementById('priceRangeMin').value)||null;
    pMax=parseInt(document.getElementById('priceRangeMax').value)||null;
    render();chips();
  });
  document.getElementById('priceRangeMax')?.addEventListener('input',e=>{
    const rMin=document.getElementById('priceRangeMin');
    if(rMin&&parseInt(e.target.value)<parseInt(rMin.value))e.target.value=rMin.value;
    syncSlider();
    pMin=parseInt(document.getElementById('priceRangeMin').value)||null;
    pMax=parseInt(document.getElementById('priceRangeMax').value)||null;
    render();chips();
  });
  syncSlider();

  document.getElementById('applyPrice')?.addEventListener('click',()=>{
    pMin=parseFloat(document.getElementById('priceMin')?.value)||null;
    pMax=parseFloat(document.getElementById('priceMax')?.value)||null;
    // sync sliders to typed values
    const rMin=document.getElementById('priceRangeMin');
    const rMax=document.getElementById('priceRangeMax');
    if(rMin&&pMin!==null)rMin.value=Math.min(pMin,700000);
    if(rMax&&pMax!==null)rMax.value=Math.min(pMax,700000);
    syncSlider();
    render();chips();
  });

  // ── STAR FILTER ──
  document.querySelectorAll('.rp-star-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.rp-star-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      minRating=parseFloat(btn.dataset.rating)||0;
      render();chips();
    });
  });

  // ── IN-STOCK TOGGLE ──
  document.getElementById('inStockFilter')?.addEventListener('change',e=>{
    inStockOnly=e.target.checked;
    render();chips();
  });
  document.getElementById('gridViewBtn')?.addEventListener('click',()=>{
    listView=false;
    document.getElementById('gridViewBtn')?.classList.add('active');
    document.getElementById('listViewBtn')?.classList.remove('active');
    render();
  });
  document.getElementById('listViewBtn')?.addEventListener('click',()=>{
    listView=true;
    document.getElementById('listViewBtn')?.classList.add('active');
    document.getElementById('gridViewBtn')?.classList.remove('active');
    render();
  });
  // Mobile filter open/close
  const _sidebar = document.getElementById('filterSidebar');
  const _closeRow = document.getElementById('filterCloseRow');

  function openFilter() {
    _sidebar?.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (_closeRow) _closeRow.style.display = 'flex';
  }
  function closeFilter() {
    _sidebar?.classList.remove('open');
    document.body.style.overflow = '';
    if (_closeRow) _closeRow.style.display = 'none';
  }

  document.getElementById('mobileFilterBtn')?.addEventListener('click', () => {
    _sidebar?.classList.contains('open') ? closeFilter() : openFilter();
  });
  document.getElementById('filterCloseBtn')?.addEventListener('click', closeFilter);

  // Close on backdrop tap
  document.addEventListener('click', e => {
    if (_sidebar?.classList.contains('open') &&
        !_sidebar.contains(e.target) &&
        !e.target.closest('#mobileFilterBtn')) {
      closeFilter();
    }
  });
  updateBadge(JSON.parse(localStorage.getItem('rp_cart')||'[]'));
  // Also update fav badge on page load
  (function(){
    try{
      const ws=JSON.parse(localStorage.getItem('rp_wishlist')||'[]');
      const fb=document.getElementById('favBadge');
      if(fb){fb.textContent=ws.length;fb.style.display=ws.length>0?'inline-flex':'none';}
    }catch{}
  })();
  load();
  window.addEventListener('rp:langchange',()=>render());
});

// ── LOAD (API + demo merge) ──
async function load(){
  const grid=document.getElementById('productsGrid');
  if(grid) grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-dim);font-size:14px;"><div class="spinner-border text-primary mb-3" role="status"></div><p>Termékek betöltése...</p></div>`;
  const _removedSkus=['T001','E021','E009','P011','E013'], _removedIds=[11,21,25,33,38];
  function applyAndRender(products){
    products.forEach(p=>{
      // Normalize API fields to match demo field names
      if(!p.image_url && p.img) p.image_url=p.img;
      if(!p.unit_price && p.price) p.unit_price=p.price;
      if(!p.category_name && p.cat) p.category_name=p.cat;
      p._cat=detectCat(p);
    });
    all=products.filter(p=>!_removedSkus.includes(p.sku||'') && !_removedIds.includes(Number(p.id)));
    buildSidebar(all);
    chips();
    render();
  }
  try{
    if(!window.api) throw new Error('API nem elérhető');
    const res=await window.api.get('/products?limit=200');
    const d=res?.data??res;
    let apiProducts=[];
    if(Array.isArray(d))apiProducts=d;
    else if(Array.isArray(d?.products))apiProducts=d.products;
    else if(Array.isArray(d?.items))apiProducts=d.items;
    if(!apiProducts.length) throw new Error('Nincs termék az adatbázisban');
    // Merge: API data + demo image_url/description fallback
    const demoData=demo();
    const merged=apiProducts.map(p=>{
      const d=demoData.find(x=>Number(x.id)===Number(p.id));
      return {
        ...(d||{}), ...p,
        image_url:(p.image_url&&p.image_url.startsWith('http'))?p.image_url:(d?.image_url||''),
        description:p.description||d?.description||'',
      };
    });
    applyAndRender(merged);
  }catch(e){
    console.error('Load error:',e);
    if(grid) grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
      <div class="alert alert-danger d-inline-block text-start" style="max-width:480px;border-radius:14px;">
        <h6 class="mb-2"><i class="bi bi-exclamation-triangle-fill me-2"></i>Backend kapcsolati hiba</h6>
        <p class="mb-2 small">${e.message}</p>
        <p class="mb-0 small opacity-75">Ellenőrizd hogy a MAMP/XAMPP fut és az adatbázis importálva van.</p>
      </div>
    </div>`;
  }
}

// ── TELJES TERMÉK LISTA – 41 db, hosszú HU/EN/DE leírásokkal ──
function demo(){return[
  {id:1,sku:'P001',name:'iPhone 15 Pro',
   description:'Az iPhone 15 Pro a mobilfotózás és a prémium okostelefonok új mércéje. A titánium keret egyszerre a legkönnyebb és a legerősebb, amit Apple valaha használt – kézben fogva azonnal érzed a különbséget. A 48 MP-es főkamera ProRAW és ProRes felvételekre is képes, a háromszoros optikai zoom teleportrékhoz és tájképekhez egyaránt tökéletes. Az Action gomb egyetlen kattintással előhívja a leghasznosabb funkciót. Az A17 Pro chip 3 nm-es gyártástechnológiával a világ legerősebb mobilprocesszora.',
   image_url:'https://image.alza.cz/products/HRI045b1/HRI045b1.jpg?width=500&height=500',
   unit_price:589999,stock:21,weight:0.187,category_name:'Mobil',avg_rating:4.8,review_count:124},

  {id:2,sku:'P002',name:'Samsung Galaxy S24 Ultra',
   description:'Az S24 Ultra az a telefon, amit ha egyszer kézbe veszel, nehéz letenni. A beépített S Pen minden más kiegészítőt feleslegessé tesz – szövegszerkesztéstől vázlatrajzolásig. A 200 MP-es kamera olyan részletes képeket ad, hogy 8K felbontásból is kivághatod a tökéletes pillanatot. A Galaxy AI funkciók körlevélfordítástól valós idejű értelmezésig napról napra megkönnyítik az életedet. A Snapdragon 8 Gen 3 chip és az 5000 mAh akku gondoskodik arról, hogy soha ne fogyjon le.',
   image_url:'https://p1.akcdn.net/full/1240638079.samsung-galaxy-s24-ultra-5g-1tb-12gb-ram-dual-sm-s928b.jpg',
   unit_price:469999,stock:22,weight:0.232,category_name:'Mobil',avg_rating:4.7,review_count:98},

  {id:3,sku:'P003',name:'ASUS ROG Strix G16 (2024)',
   description:'Ha gaming laptopot keresel és nem akarsz kompromisszumot a teljesítménnyel, az ROG Strix G16 a tökéletes választás. Az NVIDIA GeForce RTX 4060 videokártya gond nélkül kezeli a modern AAA játékokat, a 165 Hz-es QHD kijelző folyékony és éles képet ad. Az Intel Core i7-13650HX és 16 GB DDR5 RAM párosítása gyors és hatékony. A háromzónás RGB háttérvilágítás és az Aura Sync rendszer teljesen személyre szabható.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_jm1148rk.png?v=3',
   unit_price:749999,stock:4,weight:2.500,category_name:'Gaming',avg_rating:4.6,review_count:67},

  {id:4,sku:'P004',name:'MacBook Air M2 (2023)',
   description:'A MacBook Air M2 az a laptop, amit szinte mindenki szeretne, aki Macet akar. Az Apple M2 chip hihetetlen teljesítményt nyújt ventilátor nélkül – teljesen csendes, mégis gyors. A 13,6 colos Liquid Retina kijelző gyönyörű, a 52,6 Wh-s akku akár 18 óráig kitart. Mindössze 1,24 kg és 11,3 mm vékony. MagSafe 3 töltő, két Thunderbolt 4 port, 1080p webkamera. Tökéletes kreatívoknak, fejlesztőknek, diákoknak.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/s1_0gljqn0o.jpeg?v=3',
   unit_price:549999,stock:24,weight:1.240,category_name:'Laptop',avg_rating:4.9,review_count:203},

  {id:5,sku:'P005',name:'Dell XPS 13 Plus (2023)',
   description:'Az XPS 13 Plus az a laptop, amit a dizájnja miatt is megszeretsz. Szinte nincs kerete a kijelzőnek, a billentyűzetbe olvadt kapacitív érintősáv más kategóriát képvisel. A 13,4 colos OLED panel vibrálóan élénk képet ad, az Intel Core i7-1360P és 16 GB LPDDR5 RAM hatékony munkavégzést biztosít. Két Thunderbolt 4 port, 55 Wh akku kb. 10 óra üzemidővel. Mindössze 1,24 kg.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1dell_140rqx64.png?v=3',
   unit_price:699999,stock:25,weight:1.240,category_name:'Laptop',avg_rating:4.5,review_count:55},

  {id:6,sku:'P006',name:'HP Pavilion 15-eh3 (2023)',
   description:'A HP Pavilion 15 mindent tud, amire egy mindennapi felhasználónak szüksége van. A 15,6 colos FHD IPS kijelző elegendő helyet ad több ablakhoz egyszerre, az AMD Ryzen 7 gyors és energiahatékony. 16 GB RAM és 512 GB NVMe SSD gondoskodik a gyors indulásról. USB-C, USB-A, HDMI mind rajta van. Windows 11 Home előtelepítve. Böngészés, iroda, videóhívás – minden gond nélkül megy.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_0bxnxfwe.png?v=3',
   unit_price:299999,stock:26,weight:1.750,category_name:'Laptop',avg_rating:4.8,review_count:312},

  {id:7,sku:'P007',name:'Lenovo ThinkPad X1 Carbon Gen 11',
   description:'A ThinkPad X1 Carbon Gen 11 az a laptop, amire az irodai emberek évek óta esküsznek. Mindössze 1,12 kg és megfelel a MIL-STD-810H katonai szabványnak. A 14 colos 2,8K OLED kijelző éles és pontos, a billentyűzet az egyik legjobb laptop-billentyűzet a piacon. Az Intel Core i7-1365U vPro és a 57 Wh akku kb. 15 óra üzemidőt biztosít. Ujjlenyomatolvasó, IR kamera, két Thunderbolt 4 port.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_9bm45yxi.jpg?v=3',
   unit_price:799999,stock:3,weight:1.120,category_name:'Laptop',avg_rating:4.7,review_count:445},

  {id:8,sku:'P008',name:'Sony WH-1000XM5',
   description:'A WH-1000XM5 az iparág legelismertebb zajszűrős fejhallgatója. A 8 processzoros rendszer és 12 mikrofon repülőn is stúdiócsendbe von. A memóriahab párnák puhák és szellőzők, órákon át viselhető fáradtság nélkül. Az LDAC codec Hi-Res audió minőséget biztosít. 30 óra ANC-vel, 3 perc töltés = 3 óra extra üzemidő. Multipoint: egyszerre két eszközzel párosítható.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/111_wx83ssf0.jpg?v=4',
   unit_price:129999,stock:28,weight:0.250,category_name:'Fejhallgató',avg_rating:4.6,review_count:89},

  {id:9,sku:'P009',name:'Apple AirPods Pro 2. gen',
   description:'Az AirPods Pro 2 az a fülhallgató, amit egyszer felteszel és nem akarod levenni. Az Adaptív Transparencia mód átengedi a fontos hangokat, a Spatial Audio fizikailag körülötted helyezi el a zenét. USB-C töltőtok MagSafe-fel és Apple Watch töltővel is kompatibilis. IP54-es besorolás az egész rendszerre. 6 óra önálló üzemidő, a tokkal összesen 30+ óra. Az Apple H2 chip vezérli az egész rendszert.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_rcr2ctja.jpg?v=3',
   unit_price:109999,stock:29,weight:0.061,category_name:'Fejhallgató',avg_rating:4.8,review_count:176},

  {id:10,sku:'P010',name:'JBL Charge 5',
   description:'A JBL Charge 5 az a hangszóró, ami mindenhova jön veled és sosem hagy cserben. Az IP67-es besorolás teljes vízállóságot és porállóságot jelent. A 7500 mAh belső akku 20 óra zenét ad, és közben a telefont is töltheted USB-A kimeneten. A JBL Pro Sound basszusa mélyen tömör és részletgazdag. PartyBoost: akár 100+ JBL hangszórót köthetsz össze egyszerre. Négy színben elérhető.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/6_rru9cyfo.png?v=3',
   unit_price:54999,stock:30,weight:0.960,category_name:'Hangszóró',avg_rating:4.9,review_count:534},

  {id:12,sku:'P012',name:'LG OLED C3 65"',
   description:'Az LG OLED C3 az egyik legjobb televízió a világon. Az OLED evo panel minden pixele önmaga állítja elő a fényt – tökéletes fekete, korlátlan kontraszt. Az α9 Gen6 AI processzor valós időben javítja a képet és a hangot. 120 Hz és négy HDMI 2.1 port PS5-höz, Xbox-hoz és PC-hez. Dolby Vision IQ, HDR10, HLG, G-Sync, FreeSync Premium Pro. webOS 23 gyors és intuitív kezelőfelülettel.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_qa5u5m70.png?v=4',
   unit_price:899999,stock:5,weight:24.700,category_name:'TV & Monitor',avg_rating:4.7,review_count:156},

  {id:13,sku:'E001',name:'iPhone 15',
   description:'Az iPhone 15 az első iPhone USB-C csatlakozóval – végre egy töltő mindenhez. A 48 MP-es főkamera és a Photonic Engine minden fényviszonyban részletgazdag képet ad. Az A16 Bionic chip gyors és hatékony, az akku egész napra elegendő. Dynamic Island az értesítésekhez és az élő tevékenységekhez. MagSafe-kompatibilis. iOS frissítések évekig az Apple-től.',
   image_url:'https://image.alza.cz/products/HRI045b1/HRI045b1.jpg?width=500&height=500',
   unit_price:399999,stock:40,weight:0.171,category_name:'Mobil',avg_rating:4.5,review_count:134},

  {id:14,sku:'E002',name:'Samsung Galaxy S24',
   description:'A Galaxy S24 a Samsung legkompaktabb csúcstelefonja 2024-ben. A Snapdragon 8 Gen 3 és a Galaxy AI – körlevélfordítás, valós idejű értelmezés, AI képszerkesztés – napról napra megkönnyítik az életet. Az 50 MP-es háromkamerás rendszer éjszaka is megbízható. 4000 mAh akku 25 W töltéssel. Kompakt 167 g, IP68 vízállóság.',
   image_url:'https://s13emagst.akamaized.net/products/64817/64816439/images/res_fdecd9733172144ab6b418e28f699e1c.jpg?width=720&height=720&hash=91C5F7015A569F5237D415DE60CD1451',
   unit_price:319999,stock:35,weight:0.167,category_name:'Mobil',avg_rating:4.7,review_count:98},

  {id:15,sku:'E003',name:'Xiaomi Redmi Note 13 Pro',
   description:'A Redmi Note 13 Pro az ár-érték kategória abszolút győztese. A 200 MP-es kamera, a 120 Hz-es AMOLED kijelző és a 67 W-os gyorstöltés mind olyat nyújtanak, amiért más márkáknál kétszer annyit kellene fizetni. A MediaTek Dimensity 7200 Ultra gyors és hatékony, a 5100 mAh-s akku bőven két napig kitart.',
   image_url:'https://www.bestbyte.hu/Xiaomi_Redmi_Note_13_Pro_667_LTE_8256GB_DualSIM_fekete_okostelefon-i40357342.webp',
   unit_price:99999,stock:60,weight:0.187,category_name:'Mobil',avg_rating:4.8,review_count:219},

  {id:16,sku:'E004',name:'Google Pixel 8',
   description:'A Pixel 8 a legtisztább Android élményt adja – 7 éves frissítési garancia és AI funkciók, amiket más még nem tud. Magic Eraser, Best Take, Video Boost – a Tensor G3 chip teszi lehetővé. Az 50 MP-es kamera optikai stabilizációval minden körülményben megbízható. 4575 mAh akku 27 W töltéssel. IP68 vízállóság.',
   image_url:'https://p1.akcdn.net/full/1201801729.google-pixel-8-5g-128gb-8gb-ram-dual.jpg',
   unit_price:289999,stock:25,weight:0.187,category_name:'Mobil',avg_rating:4.6,review_count:67},

  {id:17,sku:'E005',name:'MacBook Air M2',
   description:'A MacBook Air M2 a legjobb laptop, ha Macet akarsz. Ventilátor nélkül, teljesen csendben, az M2 chip felülmúlja az Intel laptopokat. Liquid Retina kijelző, MagSafe 3 töltő, 18 óra akkumulátor. 1,24 kg, 11 mm vékony. Két Thunderbolt 4 port, 1080p FaceTime kamera. Tökéletes minden felhasználónak.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/s1_0gljqn0o.jpeg?v=3',
   unit_price:549999,stock:15,weight:1.240,category_name:'Laptop',avg_rating:4.9,review_count:203},

  {id:18,sku:'E006',name:'Dell XPS 13',
   description:'Az XPS 13 a Dell prémium ultrabookja, szinte keret nélküli OLED kijelzővel. Könnyű, gyors és gyönyörű – utazáshoz és irodához egyaránt tökéletes. Intel Core i7, 16 GB RAM, 512 GB SSD. Két Thunderbolt 4 port, 54 Wh akku kb. 12 óra üzemidővel. 1,17 kg.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1dell_140rqx64.png?v=3',
   unit_price:649999,stock:12,weight:1.200,category_name:'Laptop',avg_rating:4.4,review_count:55},

  {id:19,sku:'E007',name:'Lenovo ThinkPad E14 Gen 5',
   description:'A ThinkPad E14 Gen 5 a megbízható irodai laptop. AMD Ryzen 5, 16 GB RAM, 512 GB SSD. Ujjlenyomatolvasó, kényelmes billentyűzet, 57 Wh akku kb. 11 óra üzemidővel. USB-C, USB-A, HDMI 2.0. 1,59 kg. Windows 11 Pro előtelepítve. Lenovo évtizedes minősége mindennapi munkához.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_9bm45yxi.jpg?v=3',
   unit_price:349999,stock:18,weight:1.690,category_name:'Laptop',avg_rating:4.7,review_count:312},

  {id:20,sku:'E008',name:'HP Envy 15',
   description:'A HP Envy 15 a kreatívoknak és az igényes felhasználóknak szól. A 15,6 colos 4K OLED kijelző tökéletes fotó- és videószerkesztéshez, az Intel Core i7-13700H erős processzor. 16 GB DDR5 RAM, 1 TB NVMe SSD. 5 MP-es IR webkamera Windows Hello arcfelismeréssel. 83 Wh akku kb. 11 óra üzemidővel. USB-C 100 W Thunderbolt 4 töltés.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_0bxnxfwe.png?v=3',
   unit_price:499999,stock:0,weight:2.100,category_name:'Laptop',avg_rating:4.5,review_count:445},

  {id:22,sku:'E010',name:'LG 65" OLED TV',
   description:'Az LG 65 colos OLED televízió a tökéletes fekete és végtelen kontraszt szimbóluma. 4K, Dolby Vision, Dolby Atmos, és négy HDMI 2.1 port játékosoknak és filmeseknek. Az α7 Gen6 AI processzor valós időben optimalizál. G-Sync és VRR support PC-hez. webOS 23 gyors és intuitív. Ha egyszer OLED-et látsz, nincs visszaút.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_qa5u5m70.png?v=4',
   unit_price:799999,stock:8,weight:19.400,category_name:'TV & Monitor',avg_rating:4.6,review_count:176},

  {id:23,sku:'E011',name:'Sony WH-1000XM5',
   description:'A Sony WH-1000XM5 a világ legjobb zajszűrős fejhallgatójának legújabb kiadása. Az XM4-hez képest könnyebb és kényelmesebb viselés hosszú órákon át. LDAC codec CD-minőség közelébe hozza a Bluetooth hangátvitelt. Multipoint: egyszerre két eszközzel párosítható és automatikusan vált. 30 óra ANC-vel. Speak-to-Chat: megszólalásnál automatikusan beengedi a hangokat.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/111_wx83ssf0.jpg?v=4',
   unit_price:129999,stock:50,weight:0.250,category_name:'Fejhallgató',avg_rating:4.3,review_count:534},

  {id:24,sku:'E012',name:'Apple AirPods Pro 2. gen',
   description:'Az AirPods Pro 2 a legjobb iOS-kompatibilis fülhallgató. Adaptive Transparency, Spatial Audio fejkövetéssel, USB-C töltőtok MagSafe-fel. IP54 az egész rendszerre. 6 óra önálló üzemidő + 30 óra tokkal. Az Apple H2 chip az ipar legjobb zajszűrési algoritmusát futtatja.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_rcr2ctja.jpg?v=3',
   unit_price:109999,stock:70,weight:0.061,category_name:'Fejhallgató',avg_rating:4.7,review_count:23},

  {id:26,sku:'E014',name:'Logitech MX Master 3S',
   description:'Az MX Master 3S a világ legjobb irodai egere. Darkfield szenzor üvegen is működik. MagSpeed görgő egy másodperc alatt lapozza végig a dokumentumot. Logi Options+ szoftverrel minden gomb testre szabható. Három eszköz között Easy-Switch gombbal vált. 500 mAh akku, kb. 70 nap üzemidő. USB-C töltés.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/s1_fbk4fyf7.jpg?v=2',
   unit_price:44999,stock:80,weight:0.141,category_name:'PC Kiegészítők',avg_rating:4.7,review_count:98},

  {id:27,sku:'E015',name:'Keychron K8 Pro TKL',
   description:'A Keychron K8 Pro a mechanikus billentyűzet-rajongók első számú választása. Hot-swap: bármilyen 5-pin MX-kompatibilis kapcsoló berakható csere nélkül. Alumínium keret, per-key RGB. Bluetooth 5.1 – egyszerre három eszközzel. USB-C kábeles üzemmód is. Mac és Windows kompatibilis, mindkét rendszerhez tartalmaz billentyűkupakokat.',
   image_url:'https://image.alza.cz/products/KCHRON30HU/KCHRON30HU.jpg?width=500&height=500',
   unit_price:59999,stock:55,weight:0.850,category_name:'PC Kiegészítők',avg_rating:4.8,review_count:219},

  {id:28,sku:'E016',name:'ASUS TUF Gaming VG27AQL1A 27"',
   description:'Az ASUS TUF Gaming VG27AQL1A 27 colos QHD IPS panel 170 Hz-es frissítéssel. G-Sync Compatible és FreeSync Premium, 1 ms válaszidő, HDR400. 130% sRGB, 95% DCI-P3 szín. USB hub: 2x USB-A 3.0. VESA 100x100 mm. Komoly gaming monitor komoly áron, de megéri.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_ats7x339.jpg?v=3',
   unit_price:149999,stock:22,weight:6.500,category_name:'TV & Monitor',avg_rating:4.6,review_count:67},

  {id:29,sku:'E017',name:'Samsung Odyssey G5 27"',
   description:'A Samsung Odyssey G5 ívelt VA panel 1000R görbülettel – ez a legerősebb görbeség a piacon, és tényleg körbeöleli a látóteret. 165 Hz, 1 ms, QHD felbontás. HDR10. FreeSync Premium 48-165 Hz tartományban. HDMI és DisplayPort. 5,9 kg. Gaming monitornak nehéz jobbat találni ezen az áron.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/s1_gfnzsulc.jpg?v=4',
   unit_price:119999,stock:19,weight:6.200,category_name:'TV & Monitor',avg_rating:4.9,review_count:203},

  {id:30,sku:'E018',name:'Canon EOS R10',
   description:'A Canon EOS R10 a legjobb belépő tükör nélküli fényképezőgép. 24 MP APS-C szenzor, 23 kép/mp sorozatfotó, 4K 30fps és FHD 120fps videó. Dual Pixel CMOS AF II Eye AF portréhoz és mozgó alanyokhoz egyaránt. 3 colos forgatható érintőkijelző. WiFi és Bluetooth. LP-E17 akku kb. 260 képhez. 429 g.',
   image_url:'https://image.alza.cz/products/OC0989a3/OC0989a3.jpg?width=500&height=500',
   unit_price:329999,stock:2,weight:0.429,category_name:'Fotózás',avg_rating:4.4,review_count:55},

  {id:31,sku:'E019',name:'Sony Alpha A6400',
   description:'A Sony Alpha A6400 az Eye AF miatt vált legendássá – 0,02 mp-es AF, real-time arcfelismerés és szemkövetés. Portréhoz, gyerekekhez, állatokhoz a legjobb választás ebben az árkategóriában. 24 MP APS-C Exmor R BSI CMOS, 4K 30fps HLG videó, 11 kép/mp sorozat. 180 fokos flip kijelző selfie-hez és vloghoz. NFC, WiFi.',
   image_url:'https://image.alza.cz/products/OS072i1m12/OS072i1m12.jpg?width=500&height=500',
   unit_price:279999,stock:11,weight:0.403,category_name:'Fotózás',avg_rating:4.7,review_count:312},

  {id:32,sku:'E020',name:'GoPro Hero 12 Black',
   description:'A GoPro Hero 12 a kalandok kamerája. 5,3K 60fps és 4K 120fps videó, 27 MP fotó. Vízálló 10 méterig tok nélkül. 3 mikrofon szélzaj-szűréssel. Horizon Lock és Horizon Leveling stabilizáció. Beépített GPS. GoPro Quik app a telefonon. 1,4 colos hátlap és 2,27 colos előlap érintőkijelző. 154 g.',
   image_url:'https://image.alza.cz/products/OG012a1ce/OG012a1ce.jpg?width=500&height=500',
   unit_price:169999,stock:0,weight:0.154,category_name:'Fotózás',avg_rating:4.5,review_count:445},

  {id:34,sku:'E022',name:'Samsung 990 Pro 1TB NVMe SSD',
   description:'A Samsung 990 Pro a leggyorsabb fogyasztói NVMe SSD. 7450 MB/s olvasás, 6900 MB/s írás PCIe 4.0-val. M.2 2280 formátum. AES 256-bit titkosítás. Dynamic Thermal Guard védi a hőmérsékletét. Samsung Magician szoftver ingyenesen. MTBF: 1,5 millió óra. 600 TBW élettartam garancia. Ideális frissítésre PC-be vagy laptopba.',
   image_url:'https://image.alza.cz/products/SAS990ep4/SAS990ep4.jpg?width=500&height=500',
   unit_price:34999,stock:75,weight:0.050,category_name:'PC Kiegészítők',avg_rating:4.6,review_count:176},

  {id:35,sku:'E023',name:'TP-Link Archer AX55 WiFi 6 Router',
   description:'Az Archer AX55 WiFi 6 routerrel az egész otthon lefedhető gyors és stabil internettel. AX3000: 2402 Mbps 5 GHz-en + 574 Mbps 2,4 GHz-en. 4 külső antenna, OFDMA, MU-MIMO. 1,5 GHz dual-core processzor. USB 3.0 NAS funkcióval. WPA3 biztonság, OneMesh, HomeCare szülői felügyelet. Tether app-pal 10 perc alatt beállítható.',
   image_url:'https://image.alza.cz/products/TP23_007/TP23_007.jpg?width=500&height=500',
   unit_price:24999,stock:40,weight:0.510,category_name:'Hálózat',avg_rating:4.3,review_count:534},

  {id:36,sku:'E024',name:'Apple Watch Series 9 (GPS, 45mm)',
   description:'Az Apple Watch Series 9 a legjobb okosóra iPhone mellé. EKG, vér oxigénszint, bőrhőmérséklet, esés érzékelés. GPS + GLONASS + Galileo navigáció. Double Tap gesztus – mutatóujj és hüvelykujj összeérintésével kezelhető. Always-On Retina kijelző. 18 óra akku, Low Power módban 36 óra. WR50 vízállóság. S9 SiP chip.',
   image_url:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_AV1?wid=800&hei=800&fmt=jpeg&qlt=90',
   unit_price:179999,stock:28,weight:0.045,category_name:'Okoseszközök',avg_rating:4.7,review_count:23},

  {id:37,sku:'E025',name:'Amazon Echo Dot 5. generáció',
   description:'Az Echo Dot 5. generáció a legjobb belépő okosotthon eszköz. Alexa vezérlés – zenehallgatás, okoseszköz-vezérlés, időjárás, emlékeztetők. Beépített Zigbee hub – közvetlenül vezérelhet más okoseszközöket. WiFi 6, Bluetooth 5.0. Beépített hőmérséklet szenzor. Mélybőgő erősítve az előző generációhoz képest. LED órakijelző.',
   image_url:'https://image.alza.cz/products/AMAECHDO5TH/AMAECHDO5TH.jpg?width=500&height=500',
   unit_price:14999,stock:65,weight:0.304,category_name:'Okoseszközök',avg_rating:4.5,review_count:134},

  {id:39,sku:'T002',name:'Samsung Galaxy S23',
   description:'A Galaxy S23 a tavalyi csúcstelefon, idei áron. A Snapdragon 8 Gen 2 az egyik leggyorsabb mobilprocesszor valaha, az 50 MP-es kamera éjszaka is kiváló képeket készít. Kompakt 6,1 colos méret, 120 Hz AMOLED, IP68 vízállóság. 3900 mAh akku 25 W töltéssel. Ha nem kell a legújabb modell, ez az okos vásárlás.',
   image_url:'https://s13emagst.akamaized.net/products/52576/52575504/images/res_675b5c9d6f650e7c7c6d275f906d8f6e.jpg?width=720&height=720&hash=BA59C6D73AB2704CC4825815A0759290',
   unit_price:259999,stock:36,weight:0.168,category_name:'Mobil',avg_rating:4.8,review_count:219},

  {id:40,sku:'T003',name:'Dell Inspiron 15',
   description:'A Dell Inspiron 15 az egyszerű, megbízható mindennapi laptop. Intel Core i5-1335U, 8 GB RAM, 512 GB NVMe SSD – semmi extra, csak ami kell. 15,6 colos FHD IPS kijelző, USB-C, USB-A, HDMI, SD kártya. 54 Wh akku kb. 8 óra üzemidővel. WiFi 6, Bluetooth 5.2. Windows 11 Home. Böngészés, dokumentumok, videóhívások – tökéletes.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1dell_140rqx64.png?v=3',
   unit_price:219999,stock:27,weight:1.920,category_name:'Laptop',avg_rating:4.6,review_count:67},

  {id:41,sku:'T004',name:'HP Pavilion 14',
   description:'A HP Pavilion 14 kisebb és könnyebb laptopot keres? Ez az. 14 colos micro-edge FHD IPS kijelző, AMD Ryzen 5 processzor, 8 GB RAM, 512 GB SSD. 43 Wh akku kb. 9 óra üzemidővel. HP True Vision IR webkamera Windows Hello arcfelismeréssel. USB-C, USB-A 3.1, HDMI 2.0. 1,55 kg. Windows 11 Home.',
   image_url:'https://images.euronics.hu/product_images/800x600/resize/1_0bxnxfwe.png?v=3',
   unit_price:199999,stock:23,weight:1.550,category_name:'Laptop',avg_rating:4.9,review_count:203},
];}
