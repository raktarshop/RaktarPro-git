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
const CAT_RULES=[
  {cat:'Mobil',keys:['iphone','samsung galaxy','xiaomi','pixel','redmi','poco','galaxy s','oneplus','motorola']},
  {cat:'Laptop',keys:['laptop','macbook','thinkpad','xps','pavilion','inspiron','notebook','envy','zenbook','aspire','rog strix g']},
  {cat:'TV & Monitor',keys:['oled tv','qled tv','smart tv','odyssey','55"','65"','27"','monitor','qn90','c3 65']},
  {cat:'Fejhallgató',keys:['fejhallgató','airpods','wh-1000','jbl charge','jbl flip','hangszóró','quietcomfort','bose']},
  {cat:'Fotózás',keys:['eos r10','alpha a6400','gopro','nikon','canon','kamera','mirrorless']},
  {cat:'Okoseszközök',keys:['apple watch','smart band','echo dot','okosóra']},
  {cat:'PC Kiegészítők',keys:['mx master','keychron','990 pro','archer ax','tp-link','egér','billentyű','ssd','nvme','powercore','anker']},
  {cat:'Gaming',keys:['rog strix','rtx 4060','playstation','ps5','xbox series','nintendo switch']},
  {cat:'Hálózat',keys:['router','wifi 6','archer','mesh']},
];
const CAT_ICONS={'Mobil':'bi-phone','Laptop':'bi-laptop','TV & Monitor':'bi-display','Fejhallgató':'bi-headphones','Fotózás':'bi-camera','Okoseszközök':'bi-smartwatch','PC Kiegészítők':'bi-mouse','Gaming':'bi-controller','Hálózat':'bi-wifi','Elektronika':'bi-lightning'};

// ── KÉPEK ──
const PHOTOS={
  'iphone 15 pro':'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop',
  'iphone 15':'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop',
  'iphone 14':'https://images.unsplash.com/photo-1664478546384-d57bbe74a6ce?w=600&h=600&fit=crop',
  'samsung galaxy s24':'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop',
  'samsung galaxy s23':'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop',
  'xiaomi redmi':'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop',
  'google pixel':'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop',
  'macbook air m2':'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
  'dell xps':'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop',
  'dell inspiron':'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop',
  'hp envy':'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
  'hp pavilion':'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
  'thinkpad':'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=600&h=600&fit=crop',
  'asus rog':'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop',
  'asus tuf':'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=600&h=600&fit=crop',
  'samsung 55':'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&h=600&fit=crop',
  'samsung qled':'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&h=600&fit=crop',
  'lg oled':'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600&h=600&fit=crop',
  'odyssey':'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=600&fit=crop',
  'sony wh-1000':'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
  'airpods pro':'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=600&h=600&fit=crop',
  'jbl charge':'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
  'canon eos':'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop',
  'sony alpha':'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop',
  'gopro':'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600&h=600&fit=crop',
  'apple watch':'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&h=600&fit=crop',
  'echo dot':'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&h=600&fit=crop',
  'logitech mx':'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
  'keychron':'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop',
  'samsung 990':'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&h=600&fit=crop',
  'tp-link':'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&h=600&fit=crop',
  'anker':'https://images.unsplash.com/photo-1609592806596-b9e6c2e90e98?w=600&h=600&fit=crop',
};
const FALLBACK=['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop'];

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
function detectCat(p){const tx=((p.name||'')+(p.description||'')).toLowerCase();for(const r of CAT_RULES){if(r.keys.some(k=>tx.includes(k)))return r.cat;}return p.category_name||p.category||'Elektronika';}
function getPhoto(p){if(p.image_url&&p.image_url.startsWith('http'))return p.image_url;const n=(p.name||'').toLowerCase();for(const[k,u]of Object.entries(PHOTOS)){if(n.includes(k))return u;}return FALLBACK[(p.id||0)%FALLBACK.length];}
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
  if(s===0)return`<span class="rp-stock-dot out">${t('out_of_stock','Elfogyott')}</span>`;
  if(s<=5)return`<span class="rp-stock-dot low">${t('low_stock','Utolsó')} (${s})</span>`;
  return`<span class="rp-stock-dot ok">${t('in_stock','Készleten')}</span>`;
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
    const delay=Math.min(i*20,300);
    const adminBadge=admin?`<span style="position:absolute;bottom:9px;left:9px;z-index:2;font-size:10px;background:rgba(0,0,0,.6);color:#ddd;padding:2px 7px;border-radius:6px;">SKU: ${esc(p.sku||'-')} · ${stock} db</span>`:'';
    return`<div class="rp-lux-card rp-reveal" style="transition-delay:${delay}ms" data-id="${p.id}">
  <div class="rp-lux-img" onclick="goDetail(${p.id})" style="cursor:pointer;">
    <img src="${esc(img)}" alt="${esc(p.name)}" loading="${i<8?'eager':'lazy'}" onerror="this.src='${FALLBACK[0]}'">
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
  grid.querySelectorAll('.rp-lux-card').forEach(c=>obs.observe(c));
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
    if(lo>hi){[lo,hi]=[hi,lo];}
    const total=parseInt(rMax.max);
    const pctLo=(lo/total)*100;
    const pctHi=(hi/total)*100;
    if(fill){fill.style.left=pctLo+'%';fill.style.width=(pctHi-pctLo)+'%';}
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
  document.getElementById('mobileFilterBtn')?.addEventListener('click',()=>{
    document.getElementById('filterSidebar')?.classList.toggle('open');
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
  try{
    const base=demo();
    let apiProducts=[];
    if(window.api){
      try{
        const res=await window.api.get('/products?limit=200');
        const d=res?.data??res;
        if(Array.isArray(d))apiProducts=d;
        else if(Array.isArray(d?.products))apiProducts=d.products;
        else if(Array.isArray(d?.items))apiProducts=d.items;
      }catch(e){/* API nem elérhető, marad a demo */}
    }
    // Merge: API felülírja az árat/készletet ahol egyezik az id
    const merged=base.map(p=>{
      const live=apiProducts.find(a=>Number(a.id)===Number(p.id));
      if(!live)return p;
      return{...p,
        unit_price:live.unit_price??live.price??p.unit_price,
        stock:live.stock??p.stock,
        image_url:(live.image_url&&live.image_url.startsWith('http'))?live.image_url:p.image_url,
        name:live.name||p.name,
      };
    });
    // Extra API termékek hozzáadása
    apiProducts.forEach(a=>{
      if(!merged.find(m=>Number(m.id)===Number(a.id)))merged.push(a);
    });
    merged.sort((a,b)=>Number(a.id)-Number(b.id));
    merged.forEach(p=>{p._cat=detectCat(p);});
    all=merged;
    buildSidebar(all);
    chips();
    render();
  }catch(err){
    console.error('Load error:',err);
    // Fallback: csak demo
    const fallback=demo();
    fallback.forEach(p=>{p._cat=detectCat(p);});
    all=fallback;
    buildSidebar(all);
    chips();
    render();
  }
}

// ── TELJES TERMÉK LISTA – 41 db, hosszú HU/EN/DE leírásokkal ──
function demo(){return[
  {id:1,sku:'P001',name:'iPhone 15 Pro',
   description:'Ha komoly telefont keresel, az iPhone 15 Pro nehezen megkerülhető. Titánium kerete könnyű és tartós egyszerre, a 48 MP-es kamera pedig szinte bármilyen fényviszonyban szép képet csinál. Az USB-C port végre egységes töltést jelent, az Action gombbal meg gyorsan előhívhatsz bármit. Egy feltöltéssel egész nap kibír, és iOS frissítéseket évekig kap.',
   image_url:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&h=700&fit=crop',
   unit_price:160000,stock:21,weight:0.187,category_name:'Mobil',avg_rating:4.8,review_count:124},

  {id:2,sku:'P002',name:'Samsung Galaxy S24 Ultra',
   description:'Az S24 Ultra az a telefon, amit ha egyszer kézbe veszel, nehéz letenni. A beépített S Pen minden más kiegészítőt feleslegessé tesz, a 200 MP-es kamera pedig annyira részletes képeket készít, hogy utólag is tudod vágni, közelíteni. Az AI funkciók napról napra megkönnyítik az életed. Nagy képernyő, erős akku, profi fotó.',
   image_url:'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=700&fit=crop',
   unit_price:170000,stock:22,weight:0.232,category_name:'Mobil',avg_rating:4.7,review_count:98},

  {id:3,sku:'P003',name:'ASUS ROG Strix G16 (2024)',
   description:'Ha gaming laptopot keresel, de nem akarsz kompromisszumot kötni a teljesítménnyel, az ROG Strix G16 jó választás. Az RTX 4060 videokártya simán elboldogul a modern játékokkal, a 165 Hz-es kijelző pedig valóban érezhetően simább képet ad. Hosszabb játékmenetekre is tervezett hűtése van, és persze RGB, amennyit csak akarsz.',
   image_url:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=700&fit=crop',
   unit_price:180000,stock:23,weight:2.500,category_name:'Gaming',avg_rating:4.6,review_count:67},

  {id:4,sku:'P004',name:'MacBook Air M2 (2023)',
   description:'A MacBook Air M2 az a laptop, amit szinte mindenki szeretne, aki Macet akar. Ventilátor nincs benne, tehát teljesen csendben működik, mégis meglepően gyors. Egész napra elég az akkuja, 1.24 kilós, és a kijelző gyönyörű. Jó filmekhez, irodai munkához, kreatív feladatokhoz – megbízható, nap mint nap.',
   image_url:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=700&fit=crop',
   unit_price:190000,stock:24,weight:1.240,category_name:'Laptop',avg_rating:4.9,review_count:203},

  {id:5,sku:'P005',name:'Dell XPS 13 Plus (2023)',
   description:'Az XPS 13 Plus az a laptop, amit a dizájnja miatt is megszeretsz. Szinte nincs kerete a kijelzőnek, a billentyűzeten nincs hagyományos érintőpad – beolvadt a lapba. Könnyű, stílusos, és az OLED panel olyan képet mutat, hogy egyszer sem fogod nézni az órádat unalomból. Utazáshoz, kávézóba, prezentációkhoz tökéletes.',
   image_url:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=700&fit=crop',
   unit_price:200000,stock:25,weight:1.240,category_name:'Laptop',avg_rating:4.5,review_count:55},

  {id:6,sku:'P006',name:'HP Pavilion 15-eh3 (2023)',
   description:'Ha egyszerűen csak egy jól működő, megbízható laptopot keresel mindennapi használatra, a HP Pavilion 15 pontosan erre való. Nagy a kijelzője, kényelmes a billentyűzete, és elég erős ahhoz, hogy böngészés, dokumentumok, videóhívások és filmek mind gond nélkül menjenek rajta. Nem csinál semmi extravagánsat – csak működik, mindig.',
   image_url:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&h=700&fit=crop',
   unit_price:210000,stock:26,weight:1.750,category_name:'Laptop',avg_rating:4.8,review_count:312},

  {id:7,sku:'P007',name:'Lenovo ThinkPad X1 Carbon Gen 11',
   description:'A ThinkPad X1 Carbon az a laptop, amit az irodai emberek évek óta esküdnek rá – és nem véletlenül. Alig több mint egy kiló, mégis katonai teszteket állt ki. Az OLED kijelző gyönyörű, a billentyűzet a legjobb laptopbillentyűzetek közé tartozik, és ha bármikor leejted, valószínűleg túléli. Üzleti utakhoz, hosszú napokhoz kitalálva.',
   image_url:'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=900&h=700&fit=crop',
   unit_price:220000,stock:27,weight:1.120,category_name:'Laptop',avg_rating:4.7,review_count:445},

  {id:8,sku:'P008',name:'Sony WH-1000XM5',
   description:'Ha sokat utazol, dolgozol zajos helyen, vagy csak szeretnéd, ha a világ egy időre elhallgatna, a WH-1000XM5 az, amit kerestek. A zajszűrése annyira hatékony, hogy repülőn is úgy érzed, mintha egy hangstúdióban ülnél. A párnák puhák, órákon át kényelmes viselni, a hang mély és részletgazdag. 30 óra, egy feltöltéssel.',
   image_url:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=700&fit=crop',
   unit_price:230000,stock:28,weight:0.250,category_name:'Fejhallgató',avg_rating:4.6,review_count:89},

  {id:9,sku:'P009',name:'Apple AirPods Pro 2. gen',
   description:'Az AirPods Pro 2 az a fülhallgató, amit egyszer felteszel, aztán nem akarod levenni. A zajszűrés meglepően hatásos ilyen kis eszköznél, a térhangzás filmekhez és zenéhez egyaránt élvezetes. Az USB-C tok bárhol tölthető, és a teljes rendszer IP54 minősítéssel rendelkezik, tehát esőtől sem kell félni. Apple eszközöknél a legjobb választás.',
   image_url:'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=900&h=700&fit=crop',
   unit_price:240000,stock:29,weight:0.061,category_name:'Fejhallgató',avg_rating:4.8,review_count:176},

  {id:10,sku:'P010',name:'JBL Charge 5',
   description:'A JBL Charge 5 az a hangszóró, amit strandra, kertre, kirándulásra visznek az emberek, mert IP67 minősítéssel nemcsak a vízre, hanem a homokra és porra is immunis. A hang teli és basszusos, sokkal nagyobbnak hat, mint amekkora. 20 óra zene, és ha lemerül a telefonod, USB-A kimeneten tölt is.',
   image_url:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&h=700&fit=crop',
   unit_price:250000,stock:30,weight:0.960,category_name:'Fejhallgató',avg_rating:4.9,review_count:534},

  {id:11,sku:'P011',name:'Samsung QLED 55" QN90C',
   description:'Az QN90C nem csak egy tv – nappali ékszere is lehet. A Mini LED technológia miatt a fényes és sötét részek egyszerre tökéletesek a képen, és 144 Hz-en fut, tehát konzolon és PC-n is szép és gyors. A beépített Gaming Hub azt jelenti, hogy konzol nélkül is lehet felhőben játszani. Nappal sem mosódik el a kép az anti-reflection bevonat miatt.',
   image_url:'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=900&h=700&fit=crop',
   unit_price:260000,stock:31,weight:20.100,category_name:'TV & Monitor',avg_rating:4.4,review_count:23},

  {id:12,sku:'P012',name:'LG OLED C3 65"',
   description:'Az LG OLED C3 az a képernyő, ami után minden más kicsit fakónak tűnik. Az OLED technológia miatt minden egyes pixel maga kapcsol be és ki, így a feketék tényleg feketék – nem szürke. Filmekhez, sorozatokhoz ez a legjobb otthoni élmény. Gaminghez G-Sync és 120 Hz, okostv funkcióként pedig minden fontosabb streaming alkalmazás beépítve.',
   image_url:'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=900&h=700&fit=crop',
   unit_price:270000,stock:32,weight:24.700,category_name:'TV & Monitor',avg_rating:4.7,review_count:156},

  {id:13,sku:'E001',name:'iPhone 15',
   description:'Az iPhone 15 az a pont, ahol az Apple Pro funkciói elkezdtek leszivárogni a normál modellbe. A Dynamic Island már itt is van, USB-C-re váltottak, és a 48 MP-es kamera is ide került. Szép, könnyű, jól a kézben van, és hosszú az akkuja. Ha nem kell minden Pro feature, de Apple minőséget szeretnél, ez az okos választás.',
   image_url:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&h=700&fit=crop',
   unit_price:429999,stock:40,weight:0.171,category_name:'Mobil',avg_rating:4.5,review_count:134},

  {id:14,sku:'E002',name:'Samsung Galaxy S24',
   description:'A Galaxy S24 bizonyítja, hogy a kompakt méret nem jelent gyengébb telefont. Snapdragon 8 Gen 3 van benne, a Galaxy AI funkciók ugyanúgy elérhetők, és a kijelző 120 Hz-en fut. Kézre álló méret, erős teljesítmény, és a Samsung hét éves frissítési ígérete. Ha az Ultra túl nagy, ez a tökéletes alternatíva.',
   image_url:'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=700&fit=crop',
   unit_price:389999,stock:35,weight:0.167,category_name:'Mobil',avg_rating:4.7,review_count:98},

  {id:15,sku:'E003',name:'Xiaomi Redmi Note 13 Pro',
   description:'A Redmi Note 13 Pro az a telefon, amit nehéz megindokolni, hogy miért nem vesz meg mindenki – olyan jó az ára ahhoz képest, amit nyújt. 200 MP-es kamera, szép AMOLED kijelző, 67W gyorstöltés. Nem a legprémiumabb anyaghasználat, de az arc és ujjlenyomat-szenzor gyors, és az akkuja bírja. Praktikus, megbízható mindennapokra.',
   image_url:'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&h=700&fit=crop',
   unit_price:119999,stock:60,weight:0.187,category_name:'Mobil',avg_rating:4.8,review_count:219},

  {id:16,sku:'E004',name:'Google Pixel 8',
   description:'A Pixel 8 az a telefon, amit a Google saját maga tervezett – hardvertől szoftverig. Ez azt jelenti, hogy a legtisztább Android élményt kapod, gyors frissítésekkel és olyan AI funkciókkal, amiket más telefonon nem találsz. A Magic Eraser és a Photo Unblur valóban hasznos. Hét évig kap biztonsági frissítést.',
   image_url:'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&h=700&fit=crop',
   unit_price:349999,stock:25,weight:0.187,category_name:'Mobil',avg_rating:4.6,review_count:67},

  {id:17,sku:'E005',name:'MacBook Air M2',
   description:'Ugyanaz a MacBook Air M2 – ventilátor nélkül, csendes, gyors, gyönyörű Liquid Retina kijelző. Az Apple ökoszisztémán belül az egyik legjobb döntés, ha laptop kell. Ez a variáns esetlegesen eltérő konfigurációval érkezhet.',
   image_url:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=700&fit=crop',
   unit_price:549999,stock:15,weight:1.240,category_name:'Laptop',avg_rating:4.9,review_count:203},

  {id:18,sku:'E006',name:'Dell XPS 13',
   description:'A Dell XPS 13 évek óta az egyik legelismertebb ultrabook – és ez nem véletlen. Kis méretbe sűrített nagy teljesítmény, szinte keret nélküli kijelző, és az a fajta tartósság, ami azt érezteti veled, hogy tartós dolgot vettél. Utazóknak és dolgozóknak, akiknek fontos, hogy a laptop szép is legyen és jó is.',
   image_url:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=700&fit=crop',
   unit_price:499999,stock:12,weight:1.200,category_name:'Laptop',avg_rating:4.4,review_count:55},

  {id:19,sku:'E007',name:'Lenovo ThinkPad E14 Gen 5',
   description:'A ThinkPad E14 nem a legfeltűnőbb laptop a piacon, de pontosan ezt a célt szolgálja. Megbízható, tartós, a billentyűzete kényelmes, és fingerprint olvasóval is érkezik. Ha irodai munkára kell egy laptop, ami nem szokott problémákat okozni és nem merül le ebédre, ez a helyes irány.',
   image_url:'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=900&h=700&fit=crop',
   unit_price:329999,stock:18,weight:1.690,category_name:'Laptop',avg_rating:4.7,review_count:312},

  {id:20,sku:'E008',name:'HP Envy 15',
   description:'Az HP Envy 15 azoknak szól, akiknek az erős teljesítmény és a szép kép együtt kell. Az RTX 4060 videóexporthoz, fotószerkesztéshez és játékhoz is alkalmas, az OLED kijelző pedig megmutatja a munkád igazi színeit. Nagyobb és nehezebb, mint egy ultrabook, de cserébe sokkal többet tud.',
   image_url:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&h=700&fit=crop',
   unit_price:459999,stock:10,weight:2.100,category_name:'Laptop',avg_rating:4.5,review_count:445},

  {id:21,sku:'E009',name:'Samsung 55" QLED 4K TV',
   description:'Jó ár-érték arányú Samsung tévé, ha nem kell a legcsúcsabb panel, de szép képet és okostv funkciókat igen. A QLED élénk színeket hoz, 120 Hz-en fut, és a Tizen rendszeren minden fontos streaming alkalmazás ott van. Filmekhez, sorozatokhoz, sporthoz egyaránt megfelelő.',
   image_url:'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=900&h=700&fit=crop',
   unit_price:299999,stock:20,weight:14.500,category_name:'TV & Monitor',avg_rating:4.8,review_count:89},

  {id:22,sku:'E010',name:'LG 65" OLED TV',
   description:'Ha valaha láttál már OLED tévén filmet, és azóta a többi képernyő egy kicsit fakónak tűnik, ismered az érzést. Az LG 65 colos OLED-je pontosan ezt adja – tökéletes feketék, élénk színek, és elég nagy ahhoz, hogy valóban moziteremnek érezzed a nappalit. G-Sync-el gaminghez is tökéletes.',
   image_url:'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=900&h=700&fit=crop',
   unit_price:699999,stock:8,weight:19.400,category_name:'TV & Monitor',avg_rating:4.6,review_count:176},

  {id:23,sku:'E011',name:'Sony WH-1000XM5',
   description:'Az iparág legjobb zajszűrős fejhallgatója, 30 óra akku és Hi-Res LDAC audio. Ha csendre és minőségi hangra vágysz utazáshoz vagy irodához, ez az eszköz.',
   image_url:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=700&fit=crop',
   unit_price:149999,stock:50,weight:0.250,category_name:'Fejhallgató',avg_rating:4.3,review_count:534},

  {id:24,sku:'E012',name:'Apple AirPods Pro 2. gen',
   description:'Apple H2 chip, adaptív zajszűrés, Spatial Audio és USB-C MagSafe tok. Az Apple fülhallgató-piac csúcsa – felteszi az ember és nem akarja levenni.',
   image_url:'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=900&h=700&fit=crop',
   unit_price:119999,stock:70,weight:0.061,category_name:'Fejhallgató',avg_rating:4.7,review_count:23},

  {id:25,sku:'E013',name:'JBL Charge 5',
   description:'IP67 vízállóság, 40W hangzás, 20 óra akku és USB-A powerbank. A legnépszerűbb kerti és utazóhangszóró – bármilyen időben és helyszínen bevethető.',
   image_url:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&h=700&fit=crop',
   unit_price:69999,stock:45,weight:0.960,category_name:'Fejhallgató',avg_rating:4.5,review_count:134},

  {id:26,sku:'E014',name:'Logitech MX Master 3S',
   description:'Az MX Master 3S az a egér, amit ha egyszer kipróbálsz, az összes többi egyszerűnek tűnik mellette. A MagSpeed görgő az egyik legjobb dolog rajta – az ujjaid egy mozdulatával görgehetsz végig egy hosszú dokumentumon. Csendes kattintások, kényelmes ergonomikus forma, és üvegen is működik az érzékelője. Napokig tart az akkuja.',
   image_url:'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=900&h=700&fit=crop',
   unit_price:44999,stock:80,weight:0.141,category_name:'PC Kiegészítők',avg_rating:4.7,review_count:98},

  {id:27,sku:'E015',name:'Keychron K8 Pro TKL',
   description:'Ha valaha is megkérdőjelezted, érdemes-e rendes mechanikus billentyűzetre váltani – a Keychron K8 Pro megválaszolja a kérdést. A billentyűk tapintható visszajelzése valóban különbség a gépelésben, a Hot-Swap foglalat azt jelenti, hogy bármikor cserélhetsz switcht szerszám nélkül. Bluetooth és USB-C, RGB – minden megvan.',
   image_url:'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&h=700&fit=crop',
   unit_price:59999,stock:55,weight:0.850,category_name:'PC Kiegészítők',avg_rating:4.8,review_count:219},

  {id:28,sku:'E016',name:'ASUS TUF Gaming VG27AQL1A 27"',
   description:'Az ASUS TUF Gaming monitor az a megjelenítő, amelyik belefér a budgetbe, de teljesítményben nem marad le a drágábbaktól. 170 Hz QHD felbontáson, G-Sync kompatibilis, és az ergonomikus talp sokféle pozícióba állítható. 60 Hz-ről upgradelve az első pillanattól érezni fogod a különbséget.',
   image_url:'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=900&h=700&fit=crop',
   unit_price:179999,stock:22,weight:6.500,category_name:'TV & Monitor',avg_rating:4.6,review_count:67},

  {id:29,sku:'E017',name:'Samsung Odyssey G5 27"',
   description:'Az Odyssey G5 ívelt képernyője az első pillanattól befogja a látóteredet, és valóban bevon a játékba. 165 Hz, FreeSync Premium, és a VA panel mélyen fekete. Ha long session-ökre játszol, az ívelt forma kevésbé fárasztja a szemet. Egy gaming setup fontos és megfizethető eleme.',
   image_url:'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=900&h=700&fit=crop',
   unit_price:159999,stock:19,weight:6.200,category_name:'TV & Monitor',avg_rating:4.9,review_count:203},

  {id:30,sku:'E018',name:'Canon EOS R10',
   description:'Az EOS R10 az a kamera, amivel az emberek lépnek az okostelefon-fotózás után. Nem bonyolult, de azonnal érezni, hogy ez valami más: a Dual Pixel AF szinte mindent automatikusan tart fókuszban, a 4K videó éles, az RF objektívrendszer pedig hosszú távon bővíthető. Könnyű, kompakt, és élvezetes bánni vele.',
   image_url:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&h=700&fit=crop',
   unit_price:349999,stock:14,weight:0.429,category_name:'Fotózás',avg_rating:4.4,review_count:55},

  {id:31,sku:'E019',name:'Sony Alpha A6400',
   description:'Az A6400 a videósok és portréfotósok kedvence azért az egy dologért: az Eye AF. A fényképezőgép valóságos rátalál a szemen, és ott tartja a fókuszt – mozgás közben, rossz fényviszonyban, mindenhol. Ha embereket, gyerekeket, állatokat fotózol, ez az automatika önmagában megéri a vételárat.',
   image_url:'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&h=700&fit=crop',
   unit_price:329999,stock:11,weight:0.403,category_name:'Fotózás',avg_rating:4.7,review_count:312},

  {id:32,sku:'E020',name:'GoPro Hero 12 Black',
   description:'Ha extrém sport, utazás vagy kaland van a programban és szeretnéd megörökíteni, a GoPro Hero 12 Black az eszköz. Tok nélkül 10 méter mélységig vízálló, a HyperSmooth 6.0 stabilizáció azt jelenti, hogy futás, biciklizés, búvárkodás közben sem rázza össze a képet. Könnyű, robosztus, és könnyen szerkeszthető az anyag.',
   image_url:'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=900&h=700&fit=crop',
   unit_price:199999,stock:30,weight:0.154,category_name:'Fotózás',avg_rating:4.5,review_count:445},

  {id:33,sku:'E021',name:'Anker PowerCore 20000 PD 65W',
   description:'Az Anker PowerCore 20000 PD 65W az a powerbank, amibe a laptopod is belefér. 65W USB-C kimenettel MacBookot és szinte bármilyen modern laptopot tölteni tud, a két USB-A kimenet közben a telefonokról is gondoskodik. Hosszú utazásokra, konferenciákra – ahol nem mindig van dugaszoló – ez az egyetlen töltő, amire szükséged van.',
   image_url:'https://images.unsplash.com/photo-1609592806596-b9e6c2e90e98?w=900&h=700&fit=crop',
   unit_price:24999,stock:100,weight:0.420,category_name:'PC Kiegészítők',avg_rating:4.8,review_count:89},

  {id:34,sku:'E022',name:'Samsung 990 Pro 1TB NVMe SSD',
   description:'A számítógéped vagy PS5-öd lassabb, mint lehetne? A Samsung 990 Pro SSD az egyik leggyorsabb consumer tároló a piacon. A telepítés egyszerű, az operációs rendszer betöltése, a játékok indítása – minden érezhetően gyorsabb lesz. PS5-be is belerakható tárhelybővítésként. Egyszerű upgrade, nagy hatás.',
   image_url:'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=900&h=700&fit=crop',
   unit_price:49999,stock:75,weight:0.050,category_name:'PC Kiegészítők',avg_rating:4.6,review_count:176},

  {id:35,sku:'E023',name:'TP-Link Archer AX55 WiFi 6 Router',
   description:'Ha a lakásod sarkában már gyenge a WiFi, itt az ideje routert cserélni. A TP-Link Archer AX55 WiFi 6-os, tehát a modern eszközök ki tudják belőle hozni a maximum sebességet. A 2.5G WAN port a gyorsabb internet-előfizetéseknek is kedvez, az OneMesh támogatással pedig mesh hálózatot is ki lehet belőle alakítani.',
   image_url:'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=900&h=700&fit=crop',
   unit_price:39999,stock:40,weight:0.510,category_name:'Hálózat',avg_rating:4.3,review_count:534},

  {id:36,sku:'E024',name:'Apple Watch Series 9 (GPS, 45mm)',
   description:'Az Apple Watch Series 9 az az okosóra, amit ha egyszer elkezdesz hordani, furán fogod érezni magad nélküle. Az értesítések, az edzéskövetés, az EKG mind hasznos – de a Double Tap gesztus az, ami igazán meglepő. Érintés nélkül vezérelheted az órát, amikor tele van a kezed. Szép, tartós, és watchOS-t kap évekig.',
   image_url:'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=900&h=700&fit=crop',
   unit_price:189999,stock:28,weight:0.045,category_name:'Okoseszközök',avg_rating:4.7,review_count:23},

  {id:37,sku:'E025',name:'Amazon Echo Dot 5. generáció',
   description:'Az Echo Dot az a kis kütyü, ami eldöntetlen, hogy hangszóró-e vagy okosotthon-vezérlő – mert mindkettő. Alexa bármilyen kérdésre válaszol, irányítja a lámpákat és a thermosztátot, és zenét is játszik le. Az 5. generáció beépített Eero WiFi-kiterjesztővel is rendelkezik. Elképesztő ár, rengeteg tudás.',
   image_url:'https://images.unsplash.com/photo-1543512214-318c7553f230?w=900&h=700&fit=crop',
   unit_price:19999,stock:65,weight:0.304,category_name:'Okoseszközök',avg_rating:4.5,review_count:134},

  {id:38,sku:'T001',name:'iPhone 14',
   description:'Az iPhone 14 az a telefon, ami már megkapta az Emergency SOS via Satellite funkciót – tehát lefedettség nélküli területen is lehet segítséget kérni. Stabil, megbízható, iOS frissítéseket kap, és a kamera sötétben is szépen teljesít a Photonic Engine segítségével.',
   image_url:'https://images.unsplash.com/photo-1664478546384-d57bbe74a6ce?w=900&h=700&fit=crop',
   unit_price:399999,stock:45,weight:0.172,category_name:'Mobil',avg_rating:4.7,review_count:98},

  {id:39,sku:'T002',name:'Samsung Galaxy S23',
   description:'A Galaxy S23 az a Samsung, amivel semmit sem kockáztatsz. Bevált, stabil, gyors, és a 50 MP-es triple kamerarendszer szép képeket csinál napfényen és éjjel egyaránt. Kompakt méret, prémium minőség, egy napra bőven elég akku.',
   image_url:'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=700&fit=crop',
   unit_price:299999,stock:36,weight:0.168,category_name:'Mobil',avg_rating:4.8,review_count:219},

  {id:40,sku:'T003',name:'Dell Inspiron 15',
   description:'Az Inspiron 15 pontosan az, amire az ember gondol, ha mindennapi laptopot keres. Nem próbál semmi extrát mutatni – csak működik. Nagy kijelző, kényelmes billentyűzet, SD kártyaolvasó, HDMI a külső monitorhoz. Egyszerű, megbízható, jó ár.',
   image_url:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=700&fit=crop',
   unit_price:249999,stock:27,weight:1.920,category_name:'Laptop',avg_rating:4.6,review_count:67},

  {id:41,sku:'T004',name:'HP Pavilion 14',
   description:'A HP Pavilion 14 kisebb és könnyebb, mint a 15 colos társa, és ha nem kell akkora képernyő, ez az okos választás. 14 colos micro-edge kijelző, kényelmes billentyűzet, és a HP True Vision kamera videokonferenciákhoz is rendesen teljesít. Terjedelmes táskába is belefér, egész napra elég az akkuja.',
   image_url:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&h=700&fit=crop',
   unit_price:239999,stock:23,weight:1.550,category_name:'Laptop',avg_rating:4.9,review_count:203},
];}
