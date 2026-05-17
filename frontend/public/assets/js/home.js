// home.js – RaktárPro Home Page Script

// ── ADATOK (szinkron a products_new.js demo()-val) ──
const PRODUCTS = (function(){
const CAT_HARDCODE={1:'Mobil',2:'Mobil',3:'Gaming',4:'Laptop',5:'Laptop',6:'Laptop',7:'Laptop',8:'Fejhallgató',9:'Fejhallgató',10:'Hangszóró',12:'TV & Monitor',13:'Mobil',14:'Mobil',15:'Mobil',16:'Mobil',17:'Laptop',18:'Laptop',19:'Laptop',20:'Laptop',22:'TV & Monitor',23:'Fejhallgató',24:'Fejhallgató',25:'Hangszóró',26:'PC Kiegészítők',27:'PC Kiegészítők',28:'TV & Monitor',29:'TV & Monitor',30:'Fotózás',31:'Fotózás',32:'Fotózás',34:'PC Kiegészítők',35:'Hálózat',36:'Okoseszközök',37:'Okoseszközök',39:'Mobil',40:'Laptop',41:'Laptop'};
const BRANDS=['Apple','Samsung','Google','Xiaomi','Sony','LG','Dell','HP','Lenovo','ASUS','Canon','Nikon','JBL','Bose','Logitech','Keychron','Anker','TP-Link','Amazon','GoPro'];
function dCat(p){const tx=((p.name||'')+(p.description||'')).toLowerCase();for(const r of CAT_RULES){if(r.keys.some(k=>tx.includes(k)))return r.cat;}return 'Elektronika';}
function dBrand(p){const tx=((p.name||'')+(p.description||'')).toLowerCase();for(const b of BRANDS){if(tx.includes(b.toLowerCase()))return b;}return null;}

const raw=[
  {id:1, name:'iPhone 15 Pro',           price:589999, cat:'Mobil',          img:'https://image.alza.cz/products/HRI045b1/HRI045b1.jpg?width=500&height=500'},
  {id:2, name:'Samsung Galaxy S24 Ultra', price:469999, cat:'Mobil',          img:'https://p1.akcdn.net/full/1240638079.samsung-galaxy-s24-ultra-5g-1tb-12gb-ram-dual-sm-s928b.jpg'},
  {id:3, name:'ASUS ROG Strix G16',       price:749999, cat:'Gaming',         img:'https://images.euronics.hu/product_images/800x600/resize/1_jm1148rk.png?v=3'},
  {id:4, name:'MacBook Air M2',           price:549999, cat:'Laptop',         img:'https://images.euronics.hu/product_images/800x600/resize/s1_0gljqn0o.jpeg?v=3'},
  {id:5, name:'Dell XPS 13 Plus',         price:699999, cat:'Laptop',         img:'https://images.euronics.hu/product_images/800x600/resize/1dell_140rqx64.png?v=3'},
  {id:6, name:'HP Pavilion 15',           price:299999, cat:'Laptop',         img:'https://images.euronics.hu/product_images/800x600/resize/1_0bxnxfwe.png?v=3'},
  {id:7, name:'Lenovo ThinkPad X1 Carbon',price:799999, cat:'Laptop',         img:'https://images.euronics.hu/product_images/800x600/resize/1_9bm45yxi.jpg?v=3'},
  {id:8, name:'Sony WH-1000XM5',          price:129999, cat:'Fejhallgató',    img:'https://images.euronics.hu/product_images/800x600/resize/111_wx83ssf0.jpg?v=4'},
  {id:9, name:'Apple AirPods Pro 2',      price:109999, cat:'Fejhallgató',    img:'https://images.euronics.hu/product_images/800x600/resize/1_rcr2ctja.jpg?v=3'},
  {id:10,name:'JBL Charge 5',             price:54999,  cat:'Hangszóró',    img:'https://images.euronics.hu/product_images/800x600/resize/6_rru9cyfo.png?v=3'},
  {id:12,name:'LG OLED C3 65"',          price:899999, cat:'TV & Monitor',   img:'https://images.euronics.hu/product_images/800x600/resize/1_qa5u5m70.png?v=4'},
  {id:13,name:'iPhone 15',                price:399999, cat:'Mobil',          img:'https://image.alza.cz/products/HRI045b1/HRI045b1.jpg?width=500&height=500'},
  {id:14,name:'Samsung Galaxy S24',       price:319999, cat:'Mobil',          img:'https://s13emagst.akamaized.net/products/64817/64816439/images/res_fdecd9733172144ab6b418e28f699e1c.jpg?width=720&height=720&hash=91C5F7015A569F5237D415DE60CD1451'},
  {id:15,name:'Xiaomi Redmi Note 13 Pro', price:99999,  cat:'Mobil',          img:'https://www.bestbyte.hu/Xiaomi_Redmi_Note_13_Pro_667_LTE_8256GB_DualSIM_fekete_okostelefon-i40357342.webp'},
  {id:16,name:'Google Pixel 8',           price:289999, cat:'Mobil',          img:'https://p1.akcdn.net/full/1201801729.google-pixel-8-5g-128gb-8gb-ram-dual.jpg'},
  {id:17,name:'MacBook Air M2',           price:549999, cat:'Laptop',         img:'https://images.euronics.hu/product_images/800x600/resize/s1_0gljqn0o.jpeg?v=3'},
  {id:18,name:'Dell XPS 13',              price:649999, cat:'Laptop',         img:'https://images.euronics.hu/product_images/800x600/resize/1dell_140rqx64.png?v=3'},
  {id:19,name:'Lenovo ThinkPad E14 Gen 5',price:349999, cat:'Laptop',         img:'https://images.euronics.hu/product_images/800x600/resize/1_9bm45yxi.jpg?v=3'},
  {id:20,name:'HP Envy 15',               price:499999, cat:'Laptop',         img:'https://images.euronics.hu/product_images/800x600/resize/1_0bxnxfwe.png?v=3'},
  {id:22,name:'LG 65" OLED TV',          price:799999, cat:'TV & Monitor',   img:'https://images.euronics.hu/product_images/800x600/resize/1_qa5u5m70.png?v=4'},
  {id:23,name:'Sony WH-1000XM5',          price:129999, cat:'Fejhallgató',    img:'https://images.euronics.hu/product_images/800x600/resize/111_wx83ssf0.jpg?v=4'},
  {id:24,name:'Apple AirPods Pro 2',      price:109999, cat:'Fejhallgató',    img:'https://images.euronics.hu/product_images/800x600/resize/1_rcr2ctja.jpg?v=3'},
  {id:25,name:'JBL Charge 5',             price:54999,  cat:'Hangszóró',    img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'},
  {id:26,name:'Logitech MX Master 3S',    price:44999,  cat:'PC Kiegészítők', img:'https://images.euronics.hu/product_images/800x600/resize/s1_fbk4fyf7.jpg?v=2'},
  {id:27,name:'Keychron K8 Pro TKL',      price:59999,  cat:'PC Kiegészítők', img:'https://image.alza.cz/products/KCHRON30HU/KCHRON30HU.jpg?width=500&height=500'},
  {id:28,name:'ASUS TUF Monitor 27"',    price:149999, cat:'TV & Monitor',   img:'https://images.euronics.hu/product_images/800x600/resize/1_ats7x339.jpg?v=3'},
  {id:29,name:'Samsung Odyssey G5 27"',  price:119999, cat:'TV & Monitor',   img:'https://images.euronics.hu/product_images/800x600/resize/s1_gfnzsulc.jpg?v=4'},
  {id:30,name:'Canon EOS R10',            price:329999, cat:'Fotózás',        img:'https://image.alza.cz/products/OC0989a3/OC0989a3.jpg?width=500&height=500'},
  {id:31,name:'Sony Alpha A6400',         price:279999, cat:'Fotózás',        img:'https://image.alza.cz/products/OS072i1m12/OS072i1m12.jpg?width=500&height=500'},
  {id:32,name:'GoPro Hero 12 Black',      price:169999, cat:'Fotózás',        img:'https://image.alza.cz/products/OG012a1ce/OG012a1ce.jpg?width=500&height=500'},
  {id:34,name:'Samsung 990 Pro 1TB SSD',  price:34999,  cat:'PC Kiegészítők', img:'https://image.alza.cz/products/SAS990ep4/SAS990ep4.jpg?width=500&height=500'},
  {id:35,name:'TP-Link Archer AX55',      price:24999,  cat:'Hálózat',        img:'https://image.alza.cz/products/TP23_007/TP23_007.jpg?width=500&height=500'},
  {id:36,name:'Apple Watch Series 9',     price:179999, cat:'Okoseszközök',   img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_AV1?wid=800&hei=800&fmt=jpeg&qlt=90'},
  {id:37,name:'Amazon Echo Dot 5.',       price:14999,  cat:'Okoseszközök',   img:'https://image.alza.cz/products/AMAECHDO5TH/AMAECHDO5TH.jpg?width=500&height=500'},
  {id:39,name:'Samsung Galaxy S23',       price:259999, cat:'Mobil',          img:'https://s13emagst.akamaized.net/products/52576/52575504/images/res_675b5c9d6f650e7c7c6d275f906d8f6e.jpg?width=720&height=720&hash=BA59C6D73AB2704CC4825815A0759290'},
  {id:40,name:'Dell Inspiron 15',         price:219999, cat:'Laptop',         img:'https://images.euronics.hu/product_images/800x600/resize/1dell_140rqx64.png?v=3'},
  {id:41,name:'HP Pavilion 14',           price:199999, cat:'Laptop',         img:'https://images.euronics.hu/product_images/800x600/resize/1_0bxnxfwe.png?v=3'},
];
raw.forEach(p=>{p._cat=p.cat||dCat(p); p._brand=dBrand(p);});
return {products:raw, dBrand};
})();

function getPhoto(p){return p.image_url||p.img||'';}



const CAT_ICONS_HP={'Mobil':'bi-phone','Laptop':'bi-laptop','TV & Monitor':'bi-display','Fejhallgató':'bi-headphones','Hangszóró':'bi-speaker','Fotózás':'bi-camera','Okoseszközök':'bi-smartwatch','PC Kiegészítők':'bi-mouse','Gaming':'bi-controller','Hálózat':'bi-wifi','Elektronika':'bi-lightning'};
const CAT_DESCS={'Mobil':'iPhone, Samsung, Xiaomi…','Laptop':'MacBook, ThinkPad, HP…','TV & Monitor':'OLED, QLED, Gaming…','Fejhallgató':'Sony, AirPods, Bose…','Hangszóró':'JBL, Marshall, Sonos…','Fotózás':'Canon, Sony, GoPro…','Okoseszközök':'Apple Watch, Echo…','PC Kiegészítők':'SSD, Egér, Router…','Gaming':'PS5, Xbox, Switch…','Hálózat':'WiFi 6, Mesh…','Elektronika':'Egyéb eszközök…'};
// Short display names for cards/nav where space is tight
const CAT_SHORT={'TV & Monitor':'TV & Monitor','PC Kiegészítők':'PC Kiegészítők','Okoseszközök':'Okoseszközök','Fotózás':'Fotózás','Gaming':'Gaming','Mobil':'Mobil','Laptop':'Laptop','Hálózat':'Hálózat','Fejhallgató':'Fejhallgató','Hangszóró':'Hangszóró','Elektronika':'Elektronika'};

// Dinamikus kategória grid
function buildHomeCats() {
  const cats = {};
  PRODUCTS.products.forEach(p => { if(!p._cat)p._cat=CAT_HARDCODE[Number(p.id)]||p.cat||'Egyéb'; cats[p._cat] = (cats[p._cat]||0)+1; });
  const el = document.getElementById('homeCatGrid'); if(!el) return;
  el.innerHTML = Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([cat,cnt])=>{
    const icon = CAT_ICONS_HP[cat]||'bi-tag';
    const desc = CAT_DESCS[cat]||'';
    const displayName = CAT_SHORT[cat]||cat;
    return `<a href="./products.html?cat=${encodeURIComponent(cat)}" class="hp-cat-item">
      <i class="bi ${icon}"></i>
      <div class="hp-cat-item-name">${displayName}</div>
      <div class="hp-cat-item-count">${cnt} termék · ${desc}</div>
    </a>`;
  }).join('');
}

// Dinamikus márka grid
function buildHomeBrands() {
  const brands = {};
  PRODUCTS.products.forEach(p => { if(p._brand) brands[p._brand]=(brands[p._brand]||0)+1; });
  const el = document.getElementById('homeBrandGrid'); if(!el) return;
  el.innerHTML = Object.entries(brands).sort((a,b)=>b[1]-a[1]).map(([b])=>
    `<a href="./products.html?brand=${encodeURIComponent(b)}" class="hp-brand-pill">${b}</a>`
  ).join('');
}

// Kiemelt termékek (random 8 a listából)
async function buildFeatured() {
  const grid = document.getElementById('featuredGrid'); if(!grid) return;
  grid.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-dim);font-size:13px;"><div class="spinner-border spinner-border-sm text-primary me-2"></div>Betöltés...</div>`;
  let products=[];
  try{
    if(window.api){
      const res=await window.api.get('/products?limit=200');
      const d=res?.data??res;
      if(Array.isArray(d))products=d;
      else if(Array.isArray(d?.products))products=d.products;
      else if(Array.isArray(d?.items))products=d.items;
    }
  }catch(e){console.log('Home API error:',e.message);}
  if(!products.length) products=PRODUCTS.products;
  // Normalize API fields
  const demoProds=PRODUCTS.products;
  products=products.map(p=>{
    const d=demoProds.find(x=>Number(x.id)===Number(p.id));
    return {
      ...(d||{}), ...p,
      img:(p.image_url&&p.image_url.startsWith('http'))?p.image_url:(d?.img||p.img||''),
      price:p.unit_price??p.price??d?.price??0,
      cat:p.category_name||p.cat||d?.cat||'Termék',
    };
  });
  const shuffled = [...products].sort(()=>Math.random()-.5).slice(0,8);
  function fmt(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Ft';}
  grid.innerHTML = shuffled.map((p,i)=>`
    <a href="./product_details.html?id=${p.id}" class="hp-prod-card reveal" data-id="${p.id}" style="animation-delay:${i*50}ms;text-decoration:none;">
      <div style="width:100%;aspect-ratio:1;overflow:hidden;background:#fff;"><img class="hp-prod-img" src="${getPhoto(p)}" alt="${p.name}" onerror="this.style.opacity=0" ></div>
      <div class="hp-prod-body">
        <div class="hp-prod-brand">${p._brand||p._cat}</div>
        <div class="hp-prod-name">${p.name}</div>
        <div class="hp-prod-bottom">
          <div class="hp-prod-price">${fmt(p.price)} Ft</div>
          <button class="hp-prod-add" onclick="event.preventDefault()"><i class="bi bi-plus-lg"></i></button>
        </div>
      </div>
    </a>`).join('');
  // re-observe reveals
  document.querySelectorAll('.reveal:not(.visible)').forEach(el=>obs?.observe(el));
}

// Theme toggle
const themeBtn = document.getElementById('themeBtn');
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('rp_theme', t);
  if(themeBtn) themeBtn.innerHTML = t === 'dark' ? '<i class="bi bi-moon-stars"></i>' : '<i class="bi bi-sun"></i>';
}
themeBtn?.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(cur === 'dark' ? 'light' : 'dark');
});
applyTheme(localStorage.getItem('rp_theme') || 'dark');

// Cart badge
function updateHomeCartBadge() {
  const cart = JSON.parse(localStorage.getItem('rp_cart') || '[]');
  const total = cart.reduce((s,i) => s + (i.qty||1), 0);
  const badge = document.getElementById('cartBadge');
  if (badge) { badge.textContent = total; badge.style.display = total > 0 ? 'inline-block' : 'none'; }
  const cnt = document.getElementById('cartCount');
  if (cnt && total > 0) { cnt.textContent = total; cnt.style.display = ''; }
}
updateHomeCartBadge();

// Fav badge
function updateHomeFavBadge() {
  try {
    const ws = JSON.parse(localStorage.getItem('rp_wishlist') || '[]');
    const badge = document.getElementById('favBadge');
    if (badge) { badge.textContent = ws.length; badge.style.display = ws.length > 0 ? 'inline-block' : 'none'; }
  } catch {}
}
updateHomeFavBadge();

// ── HOME NAV USER DROPDOWN ──
function homeInitNav() {
  const token = localStorage.getItem('rp_token');
  const guest = localStorage.getItem('rp_guest') === '1';
  let u = null;
  try { u = JSON.parse(localStorage.getItem('rp_user') || 'null'); } catch {}

  const authBtn      = document.getElementById('authBtn');
  const userDropdown = document.getElementById('userDropdown');
  const navAvatar    = document.getElementById('navAvatar');
  const navUserName  = document.getElementById('navUserName');
  const adminNavBtn  = document.getElementById('adminNavBtn');   // icon button in nav bar
  const logoutBtn    = document.getElementById('logoutBtn');

  const isAd = u && (Number(u.role_id) === 1 || u.is_admin === true || Number(u.is_admin) === 1 || (u.role||'').toLowerCase() === 'admin');
  const loggedIn = Boolean(token) && !guest && Boolean(u);

  if (authBtn)      authBtn.style.display      = loggedIn ? 'none' : '';
  if (userDropdown) userDropdown.style.display = loggedIn ? '' : 'none';

  // Admin shortcut icon: visible only to admins when logged in
  if (adminNavBtn) adminNavBtn.style.display = (loggedIn && isAd) ? '' : 'none';

  if (loggedIn && u) {
    const name = u.full_name || u.name || u.email || 'U';
    if (navAvatar)   navAvatar.textContent   = name.charAt(0).toUpperCase();
    if (navUserName) navUserName.textContent = name.split(' ')[0];
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('rp_token'); localStorage.removeItem('rp_user');
      localStorage.removeItem('rp_guest'); localStorage.removeItem('rp_cart');
      window.location.replace('./auth.html');
    });
  }
  try {
    const cart = JSON.parse(localStorage.getItem('rp_cart') || '[]');
    const n = cart.reduce((s, it) => s + (Number(it.qty)||0), 0);
    const b = document.getElementById('cartBadge');
    if (b) { b.textContent = n; b.style.display = n > 0 ? 'inline-block' : 'none'; }
  } catch {}
}
homeInitNav();

// Scroll reveal
const obs = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
}, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Init all dynamic sections
buildHomeCats();
buildHomeBrands();
buildFeatured();

// Handle ?brand= and ?cat= URL params from brand pills linking to products page
// (products_new.js handles these on the products page)

// Auth button label
// auth button is always fixed: Bejelentkezés / Regisztráció → auth.html

// Footer auth guard
function rpFooterGuard(url) {
  const token = localStorage.getItem('rp_token');
  if (token) {
    window.location.href = url;
  } else {
    window.rpToast('Ehhez előbb jelentkezz be!', '', 'info');
    window.location.href = './auth.html';
  }
}


// ── ÜDVÖZLŐ MODAL ──────────────────────────────────────────────────────
const welcomeName = localStorage.getItem('rp_show_welcome');
if (welcomeName !== null) {
  localStorage.removeItem('rp_show_welcome');
  setTimeout(() => {
    if (window.rpShowWelcome) window.rpShowWelcome(welcomeName);
  }, 400);
}

// ── DINAMIKUS NAV (bejelentkezés függvényében) ──────────────────────────
(function updateHomeNav() {
  const token  = localStorage.getItem('rp_token');
  const guest  = localStorage.getItem('rp_guest') === '1';
  const user   = JSON.parse(localStorage.getItem('rp_user') || 'null');
  const loggedIn = !!token && !guest;
  const navRight = document.querySelector('.hp-nav-right');
  if (!navRight) return;

  if (loggedIn) {
    // Bejelentkezve: kosár + fiók dropdown (mint products oldalon)
    const initial = (user?.full_name || user?.name || user?.email || 'F').charAt(0).toUpperCase();
    const name    = user?.full_name || user?.name || '';
    navRight.innerHTML = `
      <button class="hp-nav-btn" id="themeBtn" title="Téma váltás"><i class="bi bi-moon-stars"></i></button>
      <a class="hp-nav-btn position-relative" href="./favorites.html" title="Kedvencek">
        <i class="bi bi-heart"></i>
        <span class="hp-badge" id="favBadge" style="display:none;">0</span>
      </a>
      <a class="hp-nav-btn position-relative" href="./cart.html" title="Kosár">
        <i class="bi bi-cart3"></i>
        <span class="hp-badge" id="cartBadge" style="display:none;">0</span>
      </a>
      <div class="dropdown">
        <button class="btn rp-pill-btn d-flex align-items-center gap-2 dropdown-toggle" data-bs-toggle="dropdown" style="min-height:38px;">
          <span class="rp-avatar" style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#3b5cff,#0bc5ff);color:#fff;font-weight:800;font-size:12px;display:grid;place-items:center;flex-shrink:0;">${initial}</span>
          <span class="d-none d-md-inline" style="font-size:13px;font-weight:700;">${name ? name.split(' ')[0] : 'Fiókom'}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow">
          <li class="dropdown-item-text small text-muted px-3 py-1">${name || ''}</li>
          <li><hr class="dropdown-divider my-1"></li>
          <li><a class="dropdown-item" href="./account.html"><i class="bi bi-person-gear me-2"></i>Fiókbeállítások</a></li>
          <li><a class="dropdown-item" href="./orders.html"><i class="bi bi-receipt me-2"></i>Rendeléseim</a></li>
          <li><a class="dropdown-item" href="./favorites.html"><i class="bi bi-heart me-2"></i>Kedvencek</a></li>
          <li><hr class="dropdown-divider my-1"></li>
          <li><a class="dropdown-item text-danger" href="#" id="homeLogoutBtn"><i class="bi bi-box-arrow-right me-2"></i>Kijelentkezés</a></li>
        </ul>
      </div>`;

    // Init Bootstrap dropdown on dynamically created element
    const dropToggle = navRight.querySelector('.dropdown-toggle');
    if (dropToggle && window.bootstrap?.Dropdown) {
      new window.bootstrap.Dropdown(dropToggle);
    } else if (dropToggle) {
      // Fallback: manual toggle if Bootstrap not ready yet
      const dropMenu = navRight.querySelector('.dropdown-menu');
      dropToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const open = dropMenu.classList.toggle('show');
        dropToggle.setAttribute('aria-expanded', open);
      });
      document.addEventListener('click', function() {
        dropMenu.classList.remove('show');
        dropToggle.setAttribute('aria-expanded', 'false');
      });
    }

    // Logout
    document.getElementById('homeLogoutBtn')?.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('rp_token');
      localStorage.removeItem('rp_user');
      localStorage.removeItem('rp_cart');
      localStorage.setItem('rp_logged_out_at', Date.now().toString());
      window.location.replace('./auth.html');
    });

    // Cart badge
    try {
      const cart = JSON.parse(localStorage.getItem('rp_cart') || '[]');
      const n    = cart.reduce((s,i) => s+(i.qty||1), 0);
      const cb   = document.getElementById('cartBadge');
      if (cb && n > 0) { cb.textContent = n; cb.style.display = 'inline-flex'; }
    } catch {}

    // Fav badge
    try {
      const ws = JSON.parse(localStorage.getItem('rp_wishlist') || '[]');
      const fb = document.getElementById('favBadge');
      if (fb && ws.length > 0) { fb.textContent = ws.length; fb.style.display = 'inline-flex'; }
    } catch {}

  } else {
    // Vendég / nincs bejelentkezve: csak auth gomb
    navRight.innerHTML = `
      <button class="hp-nav-btn" id="themeBtn" title="Téma váltás"><i class="bi bi-moon-stars"></i></button>
      <a class="hp-auth-btn" href="./auth.html" id="authBtn">
        <i class="bi bi-person"></i>
        <span>Bejelentkezés / Regisztráció</span>
      </a>`;
  }

  // Theme toggle (mindig kell)
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    themeBtn.querySelector('i').className = cur === 'dark' ? 'bi bi-moon-stars' : 'bi bi-sun';
    themeBtn?.addEventListener('click', () => {
      const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('rp_theme', t);
      themeBtn.querySelector('i').className = t === 'dark' ? 'bi bi-moon-stars' : 'bi bi-sun';
    });
  }
})();
