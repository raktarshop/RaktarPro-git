// product_details_new.js — RaktárPro final
(function(){
function qs(s){return document.querySelector(s);}
function getParam(n){return new URL(location.href).searchParams.get(n);}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]||m));}
function pickPrice(p){return p.unit_price??p.price??0;}
function fmt(n){return Math.round(Number(n)||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' Ft';}
function getUser(){try{return JSON.parse(localStorage.getItem('rp_user')||'null');}catch{return null;}}
function isAdmin(u){if(!u)return false;return u.is_admin===true||Number(u.is_admin)===1||Number(u.role_id)===1||(u.role||'').toLowerCase()==='admin';}
function t(k,fb){return fb||k;}

// Scroll progress
window.addEventListener('scroll',()=>{const b=document.getElementById('progressBar');if(b){const p=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;b.style.width=Math.min(p,100)+'%';}},{passive:true});

// Real photos matching products_new.js
const PHOTOS={
  'iphone 15 pro':'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&h=700&fit=crop',
  'iphone 14':'https://images.unsplash.com/photo-1664478546384-d57bbe74a6ce?w=900&h=700&fit=crop',
  'iphone 13':'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=900&h=700&fit=crop',
  'samsung galaxy s24':'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=700&fit=crop',
  'samsung galaxy s23':'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=700&fit=crop',
  'xiaomi redmi':'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&h=700&fit=crop',
  'google pixel':'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&h=700&fit=crop',
  'macbook air m2':'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=700&fit=crop',
  'macbook pro m3':'https://images.unsplash.com/photo-1611186871525-5bd8c4012c3d?w=900&h=700&fit=crop',
  'dell xps':'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=700&fit=crop',
  'dell inspiron':'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=700&fit=crop',
  'hp envy':'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&h=700&fit=crop',
  'hp pavilion':'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&h=700&fit=crop',
  'thinkpad':'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=900&h=700&fit=crop',
  'zenbook':'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=900&h=700&fit=crop',
  'samsung 55':'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=900&h=700&fit=crop',
  'lg 65':'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=900&h=700&fit=crop',
  'asus tuf':'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=900&h=700&fit=crop',
  'odyssey':'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=900&h=700&fit=crop',
  'ultrawide':'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&h=700&fit=crop',
  'sony wh-1000':'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=700&fit=crop',
  'airpods pro':'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=900&h=700&fit=crop',
  'jbl charge':'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&h=700&fit=crop',
  'bose':'https://images.unsplash.com/photo-1545127398-14699f92334b?w=900&h=700&fit=crop',
  'jbl flip':'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&h=700&fit=crop',
  'canon eos':'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&h=700&fit=crop',
  'sony alpha':'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&h=700&fit=crop',
  'gopro':'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=900&h=700&fit=crop',
  'nikon':'https://images.unsplash.com/photo-1617526738882-1ea945ce3e56?w=900&h=700&fit=crop',
  'apple watch':'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=900&h=700&fit=crop',
  'echo dot':'https://images.unsplash.com/photo-1543512214-318c7553f230?w=900&h=700&fit=crop',
  'powercore':'https://images.unsplash.com/photo-1609592806596-b9e6c2e90e98?w=900&h=700&fit=crop',
  'logitech mx':'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=900&h=700&fit=crop',
  'keychron':'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&h=700&fit=crop',
  'samsung 990':'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=900&h=700&fit=crop',
  'tp-link':'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=900&h=700&fit=crop',
  'playstation':'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=900&h=700&fit=crop',
  'xbox':'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=900&h=700&fit=crop',
  'nintendo switch':'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=900&h=700&fit=crop',
  'smart band':'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=900&h=700&fit=crop',
  'bekant':'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&h=700&fit=crop',
  'nespresso':'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&h=700&fit=crop',
};
const FALLBACK=['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&h=700&fit=crop','https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=700&fit=crop','https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=900&h=700&fit=crop','https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&h=700&fit=crop'];

function getPhoto(p){
  if(p.image_url&&p.image_url.startsWith('./imgs/'))return p.image_url;
  if(p.image_url&&p.image_url.startsWith('http'))return p.image_url;
  const n=(p.name||'').toLowerCase();
  for(const[k,u]of Object.entries(PHOTOS)){if(n.includes(k))return u;}
  return FALLBACK[(p.id||0)%FALLBACK.length];
}

function getExtraPhotos(p){
  const main=getPhoto(p);
  const extras=[
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&h=700&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=700&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=900&h=700&fit=crop',
  ];
  return[main,...extras.filter(u=>u!==main)].slice(0,4);
}

// Extract specs from description
// ── MŰSZAKI ADATOK – MediaMarkt formátum, minden termékhez ──
const PRODUCT_SPECS = {
  1: [ // iPhone 15 Pro
    {icon:'bi-phone',          key:'Kijelző',             val:'6,1" Super Retina XDR OLED, 2556×1179 px'},
    {icon:'bi-cpu',            key:'Chip',                val:'Apple A17 Pro (3 nm)'},
    {icon:'bi-camera',         key:'Főkamera',            val:'48 MP + 12 MP + 12 MP (Triple)'},
    {icon:'bi-camera2',        key:'Előlapi kamera',      val:'12 MP TrueDepth'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz ProMotion'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'3274 mAh, MagSafe 15 W'},
    {icon:'bi-usb-c',          key:'Csatlakozó',          val:'USB-C (USB 3)'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G (Sub-6 GHz + mmWave)'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68 (6 m / 30 perc)'},
    {icon:'bi-apple',          key:'Operációs rendszer',  val:'iOS 17'},
  ],
  2: [ // Samsung Galaxy S24 Ultra
    {icon:'bi-phone',          key:'Kijelző',             val:'6,8" Dynamic AMOLED 2X, 3088×1440 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Snapdragon 8 Gen 3'},
    {icon:'bi-camera',         key:'Főkamera',            val:'200 MP + 12 MP + 50 MP + 10 MP'},
    {icon:'bi-memory',         key:'RAM',                 val:'12 GB'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'256 GB / 512 GB / 1 TB'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz adaptív'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'5000 mAh, 45 W gyorstöltés'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68'},
    {icon:'bi-pen',            key:'S Pen',               val:'Beépített, 2,8 ms késés'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G'},
  ],
  3: [ // ASUS ROG Strix G16
    {icon:'bi-display',        key:'Kijelző',             val:'16" QHD IPS, 2560×1600 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Intel Core i7-13650HX'},
    {icon:'bi-gpu-card',       key:'Videokártya',         val:'NVIDIA GeForce RTX 4060 8 GB'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB DDR5 4800 MHz'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'165 Hz, 3 ms válaszidő'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'90 Wh, 240 W adapter'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6E, Bluetooth 5.3'},
    {icon:'bi-keyboard',       key:'Billentyűzet',        val:'RGB háttérvilágítás (Aura Sync)'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'2,5 kg'},
  ],
  4: [ // MacBook Air M2 (2023)
    {icon:'bi-display',        key:'Kijelző',             val:'13,6" Liquid Retina, 2560×1664 px'},
    {icon:'bi-cpu',            key:'Chip',                val:'Apple M2 (8 mag CPU, 10 mag GPU)'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB / 16 GB / 24 GB egységes'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'256 GB – 2 TB SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'52,6 Wh, ~18 óra üzemidő'},
    {icon:'bi-plug',           key:'Töltés',              val:'MagSafe 3, 30–70 W'},
    {icon:'bi-thermometer',    key:'Hűtés',               val:'Passzív (ventilátor nélkül)'},
    {icon:'bi-camera',         key:'Webkamera',           val:'1080p FaceTime HD'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, Bluetooth 5.3'},
    {icon:'bi-apple',          key:'Operációs rendszer',  val:'macOS Ventura'},
  ],
  5: [ // Dell XPS 13 Plus
    {icon:'bi-display',        key:'Kijelző',             val:'13,4" OLED, 3456×2160 px, 60 Hz'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Intel Core i7-1360P'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB LPDDR5'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'55 Wh, ~10 óra üzemidő'},
    {icon:'bi-plug',           key:'Töltés',              val:'2× Thunderbolt 4 (60 W)'},
    {icon:'bi-camera',         key:'Webkamera',           val:'720p HD'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6E, Bluetooth 5.2'},
    {icon:'bi-palette2',       key:'Szín lefedettség',    val:'100% DCI-P3, HDR 400'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,24 kg'},
  ],
  6: [ // HP Pavilion 15-eh3
    {icon:'bi-display',        key:'Kijelző',             val:'15,6" FHD IPS, 1920×1080 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'AMD Ryzen 7 7730U'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB DDR4 3200 MHz'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'41 Wh, ~8 óra üzemidő'},
    {icon:'bi-usb-c',          key:'Csatlakozók',         val:'USB-C, 2× USB-A, HDMI'},
    {icon:'bi-camera',         key:'Webkamera',           val:'HP True Vision 720p'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 5, Bluetooth 5.0'},
    {icon:'bi-windows',        key:'Operációs rendszer',  val:'Windows 11 Home'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,75 kg'},
  ],
  7: [ // Lenovo ThinkPad X1 Carbon Gen 11
    {icon:'bi-display',        key:'Kijelző',             val:'14" 2.8K OLED, 2880×1800 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Intel Core i7-1365U vPro'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB LPDDR5 6000 MHz'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'57 Wh, ~15 óra üzemidő'},
    {icon:'bi-shield-check',   key:'Szabvány',            val:'MIL-STD-810H katonai'},
    {icon:'bi-fingerprint',    key:'Biztonság',           val:'Ujjlenyomatolvasó + IR kamera'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6E, Bluetooth 5.3'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'2× Thunderbolt 4, 2× USB-A'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,12 kg'},
  ],
  8: [ // Sony WH-1000XM5
    {icon:'bi-speaker',        key:'Hangszóró méret',     val:'30 mm'},
    {icon:'bi-soundwave',      key:'Frekvenciatartomány', val:'4 Hz – 40 kHz (LDAC)'},
    {icon:'bi-ear',            key:'Zajszűrés',           val:'Aktív ANC (8 processzor, 12 mikrofon)'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'30 óra ANC-vel, 3 h töltés'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.2, Multipoint (2 eszköz)'},
    {icon:'bi-plug',           key:'Töltés',              val:'USB-C, 3 perc → 3 óra'},
    {icon:'bi-mic',            key:'Mikrofon',            val:'8 mikrofon (Precise Voice Pickup)'},
    {icon:'bi-headphones',     key:'Viselet',             val:'Over-ear, összecsukható'},
    {icon:'bi-phone',          key:'Alkalmazás',          val:'Sony Headphones Connect'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'250 g'},
  ],
  9: [ // Apple AirPods Pro 2
    {icon:'bi-ear',            key:'Zajszűrés',           val:'Aktív (Adaptive Transparency)'},
    {icon:'bi-soundwave',      key:'Hang',                val:'Apple H2 chip, Spatial Audio'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'6 h (ANC), +30 h tokkal'},
    {icon:'bi-plug',           key:'Töltő tok',           val:'USB-C + MagSafe + Apple Watch'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.3'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP54 (fülhallgató + tok)'},
    {icon:'bi-hand-index',     key:'Vezérlés',            val:'Érintés + nyomás + csettintés'},
    {icon:'bi-apple',          key:'Kompatibilitás',      val:'iPhone / iPad / Mac / Apple Watch'},
    {icon:'bi-geo-alt',        key:'Helymeghatározás',    val:'Precision Finding (U1 chip)'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'5,3 g (fülhallgató)'},
  ],
  10: [ // JBL Charge 5
    {icon:'bi-speaker',        key:'Teljesítmény',        val:'40 W RMS'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'7500 mAh, ~20 óra lejátszás'},
    {icon:'bi-plug',           key:'Csatlakozó',          val:'USB-C töltés, USB-A kimenet'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.1, 10 m hatótáv'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP67 (vízálló + porálló)'},
    {icon:'bi-soundwave',      key:'Hangrendszer',        val:'2 JBL fullrange + 2 tweeter'},
    {icon:'bi-link-45deg',     key:'PartyBoost',          val:'Több hangszóró összekapcsolása'},
    {icon:'bi-mic',            key:'Speakerphone',        val:'Beépített mikrofon'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'960 g'},
    {icon:'bi-palette2',       key:'Szín',                val:'Fekete / Kék / Szürke / Piros'},
  ],
  11: [ // Samsung QLED 55" QN90C
    {icon:'bi-display',        key:'Kijelző',             val:'55" Neo QLED 4K, 3840×2160 px'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz, Motion Xcelerator Turbo+'},
    {icon:'bi-brightness-high',key:'Fényerő',             val:'2000 nit (Mini LED)'},
    {icon:'bi-soundwave',      key:'Hangrendszer',        val:'60 W, Dolby Atmos, OTS Lite'},
    {icon:'bi-cpu',            key:'Processzor',          val:'NQ4 AI Gen2'},
    {icon:'bi-controller',     key:'Gaming',              val:'4× HDMI 2.1, 144 Hz, VRR, ALLM'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 5, Bluetooth 5.2'},
    {icon:'bi-smart-home',     key:'Smart TV',            val:'Tizen OS, Alexa / Bixby'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'4× HDMI, 2× USB, LAN, optikai'},
    {icon:'bi-shield-check',   key:'HDR',                 val:'HDR10+, HDR10, HLG'},
  ],
  12: [ // LG OLED C3 65"
    {icon:'bi-display',        key:'Kijelző',             val:'65" OLED evo, 3840×2160 px'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz (144 Hz HDMI 2.1)'},
    {icon:'bi-brightness-high',key:'Kontraszt',           val:'∞:1 (önvilágító pixel)'},
    {icon:'bi-soundwave',      key:'Hangrendszer',        val:'60 W, Dolby Atmos, DTS:X'},
    {icon:'bi-cpu',            key:'Processzor',          val:'α9 Gen6 AI 4K'},
    {icon:'bi-controller',     key:'Gaming',              val:'4× HDMI 2.1, G-Sync, FreeSync'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6 (802.11ax), Bluetooth 5.0'},
    {icon:'bi-smart-home',     key:'Smart TV',            val:'webOS 23, ThinQ AI'},
    {icon:'bi-shield-check',   key:'HDR',                 val:'Dolby Vision IQ, HDR10, HLG'},
    {icon:'bi-box-seam',       key:'Tömeg (állv. nélkül)',val:'23 kg'},
  ],
  13: [ // iPhone 15
    {icon:'bi-phone',          key:'Kijelző',             val:'6,1" Super Retina XDR OLED, 2556×1179 px'},
    {icon:'bi-cpu',            key:'Chip',                val:'Apple A16 Bionic'},
    {icon:'bi-camera',         key:'Főkamera',            val:'48 MP + 12 MP (Dual)'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'60 Hz'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'3349 mAh, MagSafe 15 W'},
    {icon:'bi-usb-c',          key:'Csatlakozó',          val:'USB-C (USB 2)'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'128 GB / 256 GB / 512 GB'},
    {icon:'bi-apple',          key:'Operációs rendszer',  val:'iOS 17'},
  ],
  14: [ // Samsung Galaxy S24
    {icon:'bi-phone',          key:'Kijelző',             val:'6,2" Dynamic AMOLED 2X, 2340×1080 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Snapdragon 8 Gen 3'},
    {icon:'bi-camera',         key:'Főkamera',            val:'50 MP + 12 MP + 10 MP (Triple)'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'128 GB / 256 GB'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz adaptív'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'4000 mAh, 25 W töltés'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'167 g'},
  ],
  15: [ // Xiaomi Redmi Note 13 Pro
    {icon:'bi-phone',          key:'Kijelző',             val:'6,67" AMOLED, 2712×1220 px, 120 Hz'},
    {icon:'bi-cpu',            key:'Processzor',          val:'MediaTek Dimensity 7200 Ultra'},
    {icon:'bi-camera',         key:'Főkamera',            val:'200 MP + 8 MP + 2 MP'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB / 12 GB'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'256 GB'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'5100 mAh, 67 W gyorstöltés'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP54'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'4G LTE'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'187 g'},
  ],
  16: [ // Google Pixel 8
    {icon:'bi-phone',          key:'Kijelző',             val:'6,2" OLED, 2400×1080 px, 120 Hz'},
    {icon:'bi-cpu',            key:'Chip',                val:'Google Tensor G3'},
    {icon:'bi-camera',         key:'Főkamera',            val:'50 MP OIS + 12 MP ultraszéles'},
    {icon:'bi-camera2',        key:'Előlapi kamera',      val:'10,5 MP'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'4575 mAh, 27 W töltés'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G'},
    {icon:'bi-android2',       key:'Operációs rendszer',  val:'Android 14 (7 év frissítés)'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'187 g'},
  ],
  17: [ // MacBook Air M2 variant
    {icon:'bi-display',        key:'Kijelző',             val:'13,6" Liquid Retina, 2560×1664 px'},
    {icon:'bi-cpu',            key:'Chip',                val:'Apple M2 (8 mag CPU, 10 mag GPU)'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB / 16 GB unified'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'256 GB – 2 TB SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'52,6 Wh, ~18 óra üzemidő'},
    {icon:'bi-plug',           key:'Töltés',              val:'MagSafe 3, 30–70 W'},
    {icon:'bi-thermometer',    key:'Hűtés',               val:'Passzív (ventilátor nélkül)'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, Bluetooth 5.3'},
    {icon:'bi-apple',          key:'Operációs rendszer',  val:'macOS Ventura'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,24 kg'},
  ],
  18: [ // Dell XPS 13
    {icon:'bi-display',        key:'Kijelző',             val:'13,4" OLED, 2880×1800 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Intel Core i7-1355U'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB LPDDR5'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'54 Wh, ~12 óra üzemidő'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'2× Thunderbolt 4, microSD'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6E, Bluetooth 5.3'},
    {icon:'bi-windows',        key:'Operációs rendszer',  val:'Windows 11 Home'},
    {icon:'bi-palette2',       key:'Szín lefedettség',    val:'100% DCI-P3'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,17 kg'},
  ],
  19: [ // Lenovo ThinkPad E14
    {icon:'bi-display',        key:'Kijelző',             val:'14" IPS FHD+, 1920×1200 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'AMD Ryzen 5 7530U'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB DDR4'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'57 Wh, ~11 óra üzemidő'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'USB-C, 2× USB-A, HDMI 2.0'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, Bluetooth 5.1'},
    {icon:'bi-fingerprint',    key:'Biztonság',           val:'Ujjlenyomatolvasó'},
    {icon:'bi-windows',        key:'Operációs rendszer',  val:'Windows 11 Pro'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,59 kg'},
  ],
  20: [ // HP Envy 15
    {icon:'bi-display',        key:'Kijelző',             val:'15,6" OLED 4K, 3840×2160 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Intel Core i7-13700H'},
    {icon:'bi-memory',         key:'RAM',                 val:'16 GB DDR5'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'1 TB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'83 Wh, ~11 óra üzemidő'},
    {icon:'bi-plug',           key:'Töltés',              val:'USB-C 100 W, Thunderbolt 4'},
    {icon:'bi-camera',         key:'Webkamera',           val:'5 MP IR (Windows Hello)'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6E, Bluetooth 5.3'},
    {icon:'bi-windows',        key:'Operációs rendszer',  val:'Windows 11 Home'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,99 kg'},
  ],
  21: [ // Samsung 55" QLED TV
    {icon:'bi-display',        key:'Kijelző',             val:'55" QLED 4K, 3840×2160 px'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz'},
    {icon:'bi-brightness-high',key:'HDR',                 val:'HDR10+, HLG'},
    {icon:'bi-soundwave',      key:'Hangrendszer',        val:'40 W, Dolby Digital+'},
    {icon:'bi-controller',     key:'Gaming',              val:'2× HDMI 2.1, ALLM, FreeSync'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 5, Bluetooth 4.2'},
    {icon:'bi-smart-home',     key:'Smart TV',            val:'Tizen OS'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'4× HDMI, 2× USB, LAN'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Crystal 4K processzor'},
    {icon:'bi-box-seam',       key:'Tömeg (állv. nélkül)',val:'13,8 kg'},
  ],
  22: [ // LG 65" OLED TV
    {icon:'bi-display',        key:'Kijelző',             val:'65" OLED 4K, 3840×2160 px'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz'},
    {icon:'bi-brightness-high',key:'HDR',                 val:'Dolby Vision, HDR10, HLG'},
    {icon:'bi-soundwave',      key:'Hangrendszer',        val:'40 W, Dolby Atmos'},
    {icon:'bi-cpu',            key:'Processzor',          val:'α7 Gen6 AI 4K'},
    {icon:'bi-controller',     key:'Gaming',              val:'4× HDMI 2.1, G-Sync, VRR'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, Bluetooth 5.0'},
    {icon:'bi-smart-home',     key:'Smart TV',            val:'webOS 23, ThinQ AI'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'4× HDMI, 3× USB, LAN'},
    {icon:'bi-box-seam',       key:'Tömeg (állv. nélkül)',val:'19,5 kg'},
  ],
  23: [ // Sony WH-1000XM5 (variant)
    {icon:'bi-speaker',        key:'Hangszóró méret',     val:'30 mm'},
    {icon:'bi-soundwave',      key:'Frekvenciatartomány', val:'4 Hz – 40 kHz (LDAC)'},
    {icon:'bi-ear',            key:'Zajszűrés',           val:'Aktív ANC (8 processzor, 12 mikrofon)'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'30 óra ANC-vel, 3 h töltés'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.2, Multipoint (2 eszköz)'},
    {icon:'bi-plug',           key:'Töltés',              val:'USB-C, 3 perc → 3 óra'},
    {icon:'bi-mic',            key:'Mikrofon',            val:'8 mikrofon array'},
    {icon:'bi-headphones',     key:'Viselet',             val:'Over-ear, összecsukható'},
    {icon:'bi-phone',          key:'Alkalmazás',          val:'Sony Headphones Connect'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'250 g'},
  ],
  24: [ // Apple AirPods Pro 2 (variant)
    {icon:'bi-ear',            key:'Zajszűrés',           val:'Aktív (Adaptive Transparency)'},
    {icon:'bi-soundwave',      key:'Hang',                val:'Apple H2 chip, Spatial Audio'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'6 h (ANC), +30 h tokkal'},
    {icon:'bi-plug',           key:'Töltő tok',           val:'USB-C + MagSafe + Apple Watch'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.3'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP54'},
    {icon:'bi-hand-index',     key:'Vezérlés',            val:'Érintés + nyomás + csettintés'},
    {icon:'bi-apple',          key:'Kompatibilitás',      val:'iPhone / iPad / Mac'},
    {icon:'bi-geo-alt',        key:'Helymeghatározás',    val:'Precision Finding (U1)'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'5,3 g (fülhallgató)'},
  ],
  25: [ // JBL Charge 5 (variant)
    {icon:'bi-speaker',        key:'Teljesítmény',        val:'40 W RMS'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'7500 mAh, ~20 óra lejátszás'},
    {icon:'bi-plug',           key:'Csatlakozó',          val:'USB-C töltés, USB-A kimenet'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.1, 10 m hatótáv'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP67 (vízálló + porálló)'},
    {icon:'bi-soundwave',      key:'Hangrendszer',        val:'2 fullrange + 2 tweeter'},
    {icon:'bi-link-45deg',     key:'PartyBoost',          val:'Több hangszóró összekapcsolása'},
    {icon:'bi-mic',            key:'Speakerphone',        val:'Beépített mikrofon'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'960 g'},
    {icon:'bi-palette2',       key:'Szín',                val:'Fekete / Kék / Szürke / Piros'},
  ],
  26: [ // Logitech MX Master 3S
    {icon:'bi-mouse2',         key:'Érzékelő',            val:'Darkfield 8000 DPI'},
    {icon:'bi-lightning',      key:'Gördítőkerék',        val:'MagSpeed elektromágneses'},
    {icon:'bi-bluetooth',      key:'Csatlakozás',         val:'Bluetooth + Logi Bolt USB'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'500 mAh, ~70 nap üzemidő'},
    {icon:'bi-plug',           key:'Töltés',              val:'USB-C, 1 perc → 3 óra'},
    {icon:'bi-laptop',         key:'Multi-device',        val:'3 eszköz, Easy-Switch gomb'},
    {icon:'bi-hand-index',     key:'Gombok',              val:'7 programozható gomb'},
    {icon:'bi-wifi',           key:'Hatótáv',             val:'10 m'},
    {icon:'bi-app',            key:'Szoftver',            val:'Logi Options+'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'141 g'},
  ],
  27: [ // Keychron K8 Pro TKL
    {icon:'bi-keyboard',       key:'Elrendezés',          val:'TKL (87 billentyű)'},
    {icon:'bi-toggle-on',      key:'Kapcsolók',           val:'Gateron G Pro Red / Brown / Blue'},
    {icon:'bi-bluetooth',      key:'Csatlakozás',         val:'Bluetooth 5.1 + USB-C'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'4000 mAh'},
    {icon:'bi-lightbulb',      key:'Háttérvilágítás',     val:'Per-key RGB'},
    {icon:'bi-laptop',         key:'Kompatibilitás',      val:'macOS / Windows / Android'},
    {icon:'bi-wrench',         key:'Hot-swap',            val:'Igen (5-pin)'},
    {icon:'bi-layout-sidebar', key:'Keret',               val:'Alumínium felső keret'},
    {icon:'bi-laptop',         key:'Multi-device',        val:'3 eszköz Bluetooth'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'860 g'},
  ],
  28: [ // ASUS TUF Gaming Monitor
    {icon:'bi-display',        key:'Kijelző',             val:'27" IPS, 2560×1440 px (QHD)'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'170 Hz (OC)'},
    {icon:'bi-hourglass',      key:'Válaszidő',           val:'1 ms (MPRT)'},
    {icon:'bi-brightness-high',key:'Fényerő',             val:'400 nit, HDR400'},
    {icon:'bi-palette2',       key:'Szín lefedettség',    val:'130% sRGB, 95% DCI-P3'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'2× HDMI 2.0, 2× DisplayPort 1.2'},
    {icon:'bi-controller',     key:'Szinkron',            val:'G-Sync Compatible + FreeSync Premium'},
    {icon:'bi-usb-plug',       key:'USB Hub',             val:'USB-B bemenet, 2× USB-A 3.0'},
    {icon:'bi-aspect-ratio',   key:'Dőlésszög',           val:'-5° / +20°, VESA 100×100'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'6,2 kg'},
  ],
  29: [ // Samsung Odyssey G5
    {icon:'bi-display',        key:'Kijelző',             val:'27" VA Curved 1000R, 2560×1440 px'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'165 Hz'},
    {icon:'bi-hourglass',      key:'Válaszidő',           val:'1 ms (MPRT)'},
    {icon:'bi-brightness-high',key:'Fényerő',             val:'300 nit'},
    {icon:'bi-shield-check',   key:'HDR',                 val:'HDR10'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'1× HDMI 2.0, 1× DisplayPort 1.2'},
    {icon:'bi-controller',     key:'AMD FreeSync',        val:'FreeSync Premium (48–165 Hz)'},
    {icon:'bi-aspect-ratio',   key:'Görbület',            val:'1000R'},
    {icon:'bi-arrows-angle-expand', key:'Dőlésszög',     val:'-2° / +20°'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'5,9 kg'},
  ],
  30: [ // Canon EOS R10
    {icon:'bi-camera',         key:'Szenzor',             val:'24,2 MP APS-C CMOS'},
    {icon:'bi-cpu',            key:'Processzor',          val:'DIGIC X'},
    {icon:'bi-aspect-ratio',   key:'Sorozatkép',          val:'23 kép/mp (elektr. zár)'},
    {icon:'bi-film',           key:'Videó',               val:'4K 30fps / FHD 120fps'},
    {icon:'bi-eye',            key:'Autófókusz',          val:'Dual Pixel CMOS AF II, Eye AF'},
    {icon:'bi-display',        key:'Kijelző',             val:'3" érintőképernyő, forgatható'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'LP-E17, ~260 kép/töltés'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 5 GHz, Bluetooth 4.1'},
    {icon:'bi-usb-c',          key:'Csatlakozó',          val:'USB-C, micro HDMI, 3,5 mm'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'429 g (váz)'},
  ],
  31: [ // Sony Alpha A6400
    {icon:'bi-camera',         key:'Szenzor',             val:'24,2 MP APS-C Exmor R BSI CMOS'},
    {icon:'bi-cpu',            key:'Processzor',          val:'BIONZ X'},
    {icon:'bi-eye',            key:'Autófókusz',          val:'Real-time Eye AF, 0,02 mp'},
    {icon:'bi-aspect-ratio',   key:'Sorozatkép',          val:'11 kép/mp'},
    {icon:'bi-film',           key:'Videó',               val:'4K 30fps, FHD 120fps, HLG'},
    {icon:'bi-display',        key:'Kijelző',             val:'3" flip érintőkijelző, 921k pont'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'NP-FW50, ~400 kép/töltés'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi, NFC, Bluetooth 4.1'},
    {icon:'bi-camera2',        key:'Képformátum',         val:'RAW + JPEG, XAVC S videó'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'403 g (váz)'},
  ],
  32: [ // GoPro Hero 12 Black
    {icon:'bi-film',           key:'Videó',               val:'5,3K 60fps / 4K 120fps'},
    {icon:'bi-camera',         key:'Fotó',                val:'27 MP fénykép'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'10 m (tok nélkül)'},
    {icon:'bi-soundwave',      key:'Hang',                val:'3-mikrofon, szélzaj-szűrés'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'1720 mAh, ~85 perc 4K 60fps'},
    {icon:'bi-bluetooth',      key:'Csatlakozás',         val:'Bluetooth + WiFi (GoPro App)'},
    {icon:'bi-display',        key:'Kijelző',             val:'1,4" hátlap + 2,27" előlap érintő'},
    {icon:'bi-brightness-high',key:'HDR',                 val:'Auto HDR videó'},
    {icon:'bi-geo-alt',        key:'GPS',                 val:'Beépített'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'154 g'},
  ],
  33: [ // Anker PowerCore 20000
    {icon:'bi-battery-full',   key:'Kapacitás',           val:'20 000 mAh'},
    {icon:'bi-plug',           key:'USB-C PD kimenet',    val:'65 W (laptophoz is)'},
    {icon:'bi-usb-plug',       key:'USB-A kimenet',       val:'2× USB-A, 12 W'},
    {icon:'bi-lightning',      key:'Egyidejű töltés',     val:'3 eszköz egyszerre'},
    {icon:'bi-phone',          key:'Telefon feltöltés',   val:'~4× iPhone 15'},
    {icon:'bi-laptop',         key:'Laptop töltés',       val:'MacBook Air ~1×'},
    {icon:'bi-battery-half',   key:'Saját töltés',        val:'USB-C 65 W bemeneten ~3 h'},
    {icon:'bi-shield-check',   key:'Biztonság',           val:'MultiProtect (túltöltés-védelem)'},
    {icon:'bi-palette2',       key:'LED kijelző',         val:'Töltöttségi szint kijelzése'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'440 g'},
  ],
  34: [ // Samsung 990 Pro SSD
    {icon:'bi-device-hdd',     key:'Kapacitás',           val:'1 TB (2 TB is elérhető)'},
    {icon:'bi-speedometer2',   key:'Olvasási sebesség',   val:'7450 MB/s (PCIe 4.0 NVMe)'},
    {icon:'bi-speedometer',    key:'Írási sebesség',      val:'6900 MB/s'},
    {icon:'bi-cpu',            key:'Csatlakozó',          val:'M.2 2280, PCIe 4.0 × 4'},
    {icon:'bi-shield-check',   key:'Titkosítás',          val:'AES 256-bit (Samsung)'},
    {icon:'bi-thermometer',    key:'Hőkezelés',           val:'Dynamic Thermal Guard'},
    {icon:'bi-battery-half',   key:'MTBF',                val:'1 500 000 óra'},
    {icon:'bi-app',            key:'Szoftver',            val:'Samsung Magician'},
    {icon:'bi-graph-up',       key:'TBW',                 val:'600 TBW'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'9,8 g'},
  ],
  35: [ // TP-Link Archer AX55
    {icon:'bi-wifi',           key:'WiFi szabvány',       val:'WiFi 6 (802.11ax), AX3000'},
    {icon:'bi-speedometer2',   key:'Max sebesség',        val:'2402 Mbps (5 GHz) + 574 Mbps (2,4 GHz)'},
    {icon:'bi-broadcast-pin',  key:'Antenna',             val:'4× külső antenna'},
    {icon:'bi-cpu',            key:'Processzor',          val:'1,5 GHz dual-core'},
    {icon:'bi-hdd-network',    key:'LAN portok',          val:'4× Gigabit LAN + 1× Gigabit WAN'},
    {icon:'bi-plug',           key:'USB',                 val:'1× USB 3.0 (NAS / nyomtató)'},
    {icon:'bi-shield-check',   key:'Biztonság',           val:'WPA3, HomeCare, OneMesh'},
    {icon:'bi-people',         key:'Kapacitás',           val:'OFDMA + MU-MIMO, 128 eszköz'},
    {icon:'bi-arrow-repeat',   key:'Beamforming',         val:'Adaptív beamforming'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'305 g'},
  ],
  36: [ // Apple Watch Series 9
    {icon:'bi-smartwatch',     key:'Kijelző',             val:'1,9" Always-On Retina (LTPO OLED)'},
    {icon:'bi-cpu',            key:'Chip',                val:'Apple S9 SiP'},
    {icon:'bi-heart-pulse',    key:'Egészség',            val:'EKG, vér O₂, bőrhőmérséklet'},
    {icon:'bi-geo-alt',        key:'Navigáció',           val:'GPS + GLONASS + Galileo + BeiDou'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'~18 h (Low Power Mode: 36 h)'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'WR50 (50 m)'},
    {icon:'bi-bluetooth',      key:'Csatlakozás',         val:'Bluetooth 5.3, WiFi 802.11n'},
    {icon:'bi-hand-index',     key:'Gesztus',             val:'Double Tap (mutatóujj + hüvelyk)'},
    {icon:'bi-apple',          key:'Kompatibilitás',      val:'iPhone XS+, iOS 17+'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'39 g (alumínium)'},
  ],
  37: [ // Amazon Echo Dot 5
    {icon:'bi-speaker',        key:'Hangszóró',           val:'1,73" front-firing'},
    {icon:'bi-soundwave',      key:'Hang',                val:'Mélybőgő, tisztább közepes sáv'},
    {icon:'bi-mic',            key:'Mikrofon',            val:'4 mikrofon, Wake Word érzékelés'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, 2,4 + 5 GHz'},
    {icon:'bi-bluetooth',      key:'Bluetooth',           val:'5.0'},
    {icon:'bi-smart-home',     key:'Okosotthon',          val:'Alexa, Matter, Zigbee Hub'},
    {icon:'bi-clock',          key:'LED kijelző',         val:'Óra és értesítések'},
    {icon:'bi-plug',           key:'Tápellátás',          val:'Hálózati adapter (30 W)'},
    {icon:'bi-thermometer',    key:'Szenzor',             val:'Beépített hőmérséklet szenzor'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'304 g'},
  ],
  38: [ // iPhone 14
    {icon:'bi-phone',          key:'Kijelző',             val:'6,1" Super Retina XDR OLED, 2532×1170 px'},
    {icon:'bi-cpu',            key:'Chip',                val:'Apple A15 Bionic'},
    {icon:'bi-camera',         key:'Főkamera',            val:'12 MP + 12 MP (Dual, ƒ/1.5)'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'60 Hz'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'3279 mAh, MagSafe 15 W'},
    {icon:'bi-usb-c',          key:'Csatlakozó',          val:'Lightning'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'128 GB / 256 GB / 512 GB'},
    {icon:'bi-apple',          key:'Operációs rendszer',  val:'iOS 16 → iOS 17+'},
  ],
  39: [ // Samsung Galaxy S23
    {icon:'bi-phone',          key:'Kijelző',             val:'6,1" Dynamic AMOLED 2X, 2340×1080 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Snapdragon 8 Gen 2'},
    {icon:'bi-camera',         key:'Főkamera',            val:'50 MP + 12 MP + 10 MP'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'128 GB / 256 GB'},
    {icon:'bi-lightning',      key:'Frissítési ráta',     val:'120 Hz adaptív'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'3900 mAh, 25 W töltés'},
    {icon:'bi-shield-check',   key:'Vízállóság',          val:'IP68'},
    {icon:'bi-globe',          key:'Mobilhálózat',        val:'5G'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'168 g'},
  ],
  40: [ // Dell Inspiron 15
    {icon:'bi-display',        key:'Kijelző',             val:'15,6" FHD IPS, 1920×1080 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'Intel Core i5-1335U'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB DDR4'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'54 Wh, ~8 óra üzemidő'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'USB-C, 2× USB-A, HDMI, SD'},
    {icon:'bi-camera',         key:'Webkamera',           val:'720p HD'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, Bluetooth 5.2'},
    {icon:'bi-windows',        key:'Operációs rendszer',  val:'Windows 11 Home'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,83 kg'},
  ],
  41: [ // HP Pavilion 14
    {icon:'bi-display',        key:'Kijelző',             val:'14" FHD IPS micro-edge, 1920×1080 px'},
    {icon:'bi-cpu',            key:'Processzor',          val:'AMD Ryzen 5 7530U'},
    {icon:'bi-memory',         key:'RAM',                 val:'8 GB DDR4'},
    {icon:'bi-device-hdd',     key:'Tárhely',             val:'512 GB NVMe SSD'},
    {icon:'bi-battery-half',   key:'Akkumulátor',         val:'43 Wh, ~9 óra üzemidő'},
    {icon:'bi-plug',           key:'Csatlakozók',         val:'USB-C, USB-A 3.1, HDMI 2.0'},
    {icon:'bi-camera',         key:'Webkamera',           val:'HP True Vision 720p IR'},
    {icon:'bi-wifi',           key:'Hálózat',             val:'WiFi 6, Bluetooth 5.2'},
    {icon:'bi-windows',        key:'Operációs rendszer',  val:'Windows 11 Home'},
    {icon:'bi-box-seam',       key:'Tömeg',               val:'1,55 kg'},
  ],
};

function extractSpecs(p){
  // Use static specs lookup first (MediaMarkt-style, 10 adat/termék)
  if(p.id && PRODUCT_SPECS[p.id]){
    return PRODUCT_SPECS[p.id];
  }
  // Fallback: parse from description text
  const name=(p.name||''), desc=(p.description||''), tx=name+' '+desc;
  const specs=[];
  const add=(icon,key,val)=>specs.push({icon,key,val});
  const m=s=>tx.match(s);
  let r;
  if(r=m(/(\d+)\s*GB\s*RAM/i))                add('bi-memory','RAM',r[1]+' GB');
  if(r=m(/(\d+)\s*(GB|TB)\s*(SSD|NVMe|tárhely)/i)) add('bi-device-hdd','Tárhely',r[1]+' '+r[2].toUpperCase());
  if(r=m(/(\d+\.?\d*)"[^,\s]*(kijelző|Liquid|Retina|OLED|IPS|VA|FHD|QHD)?/i)||m(/(\d+\.?\d*)"\s/i)) add('bi-display','Képernyő',r[1]+'"');
  if(r=m(/(\d{3,4})x(\d{3,4})/))              add('bi-aspect-ratio','Felbontás',r[1]+'×'+r[2]);
  else if(r=m(/(4K|8K|FHD|QHD|UHD|UWQHD|2\.8K|2\.5K|2K|1080p|1440p|2160p)/i)) add('bi-aspect-ratio','Felbontás',r[1].toUpperCase());
  if(r=m(/(\d+)\s*Hz/i))                      add('bi-lightning','Frissítési ráta',r[1]+' Hz');
  if(r=m(/(\d+)\s*MP/i))                      add('bi-camera','Kamera',r[1]+' MP');
  if(r=m(/(\d+)\s*mAh/i))                     add('bi-battery-half','Akkumulátor',r[1]+' mAh');
  if(p.weight&&Number(p.weight)>0){const w=Number(p.weight);add('bi-box-seam','Tömeg',w>=1?w.toFixed(2)+' kg':Math.round(w*1000)+' g');}
  return specs;
}

let currentProduct=null,imgs=[];

function renderGallery(p){
  imgs=getExtraPhotos(p);
  const main=qs('#mainImg');const thumbs=qs('#thumbsRow');
  if(!main||!thumbs)return;
  main.src=imgs[0];main.alt=p.name;
  main.onerror=()=>{main.src=FALLBACK[0];};
  thumbs.innerHTML=imgs.map((src,i)=>`<button class="rp-thumb-btn${i===0?' active':''}" data-idx="${i}"><img src="${esc(src)}" alt="${esc(p.name)} ${i+1}" loading="lazy" onerror="this.src='${FALLBACK[0]}'"></button>`).join('');
  thumbs.querySelectorAll('.rp-thumb-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const idx=Number(btn.dataset.idx);
      main.style.opacity='0';main.style.transform='scale(0.97)';
      setTimeout(()=>{main.src=imgs[idx];main.style.opacity='1';main.style.transform='scale(1)';},160);
      thumbs.querySelectorAll('.rp-thumb-btn').forEach(b=>b.classList.toggle('active',b.dataset.idx==idx));
    });
  });
  main.style.transition='opacity .18s ease,transform .18s ease';
}

function renderSpecs(p){
  const specs=extractSpecs(p);
  const el=qs('#pdSpecs');if(!el)return;
  if(!specs.length){el.innerHTML='<div style="padding:12px;color:var(--muted-2);font-size:13px;">Nincsenek elérhető műszaki adatok.</div>';return;}
  el.innerHTML=specs.map((s,i)=>`<div class="rp-specs-row" style="animation:rp-fade-up .4s ${i*40}ms cubic-bezier(0.23,1,0.32,1) both;"><span class="rp-specs-icon"><i class="bi ${s.icon}"></i></span><span class="rp-specs-key">${esc(s.key)}</span><span class="rp-specs-val">${esc(s.val)}</span></div>`).join('');
}

function stockPill(stock){
  if(stock===null||stock===undefined)return`<span class="rp-stock-pill rp-stock--ok"><i class="bi bi-check-circle-fill"></i> Készleten</span>`;
  const n=Number(stock);
  if(n<=0)return`<span class="rp-stock-pill rp-stock--out"><i class="bi bi-x-circle-fill"></i> Elfogyott</span>`;
  if(n<=5)return`<span class="rp-stock-pill rp-stock--warn"><i class="bi bi-exclamation-circle-fill"></i> Utolsó darabok (${n} db)</span>`;
  return`<span class="rp-stock-pill rp-stock--ok"><i class="bi bi-check-circle-fill"></i> Készleten</span>`;
}

function setupTabs(){
  document.querySelectorAll('.rp-tab-pill').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const target=btn.dataset.tab;
      document.querySelectorAll('.rp-tab-pill').forEach(b=>b.classList.toggle('active',b.dataset.tab===target));
      document.querySelectorAll('.rp-tab-panel-content').forEach(p=>p.classList.toggle('active',p.dataset.tab===target));
    });
  });
}

function addToCart(p){
  if(!p)return;
  const cart=JSON.parse(localStorage.getItem('rp_cart')||'[]');
  const ex=cart.find(c=>c.id===p.id);
  if(ex)ex.qty=(ex.qty||1)+1;else cart.push({id:p.id,qty:1,name:p.name,price:pickPrice(p),image:imgs[0]||'',category:p.category_name||p.category||''});
  localStorage.setItem('rp_cart',JSON.stringify(cart));
  const badge=document.getElementById('cartBadge');
  if(badge){const tot=cart.reduce((s,c)=>s+(c.qty||1),0);badge.textContent=tot;badge.style.display=tot>0?'flex':'none';}
  window.rpToast?.(p.name,t('add_to_cart','Kosárba helyezve')+' ✓','success');
  const btn=qs('#pdAddBtn');
  if(btn){btn.innerHTML='<i class="bi bi-check-circle rp-icon"></i> Hozzáadva';setTimeout(()=>{btn.innerHTML='<i class="bi bi-cart-plus rp-icon"></i> Kosárba';},2000);}
}

function setupWish(p){
  const btn=qs('#pdWishBtn');if(!btn)return;
  const ws=new Set(JSON.parse(localStorage.getItem('rp_wishlist')||'[]'));
  const icon=btn.querySelector('i');
  if(ws.has(p.id)){icon.className='bi bi-heart-fill rp-icon';btn.style.color='#ef4444';}
  btn.addEventListener('click',()=>{
    const ws2=new Set(JSON.parse(localStorage.getItem('rp_wishlist')||'[]'));
    if(ws2.has(p.id)){ws2.delete(p.id);icon.className='bi bi-heart rp-icon';btn.style.color='';window.rpToast?.('','Eltávolítva a kedvencekből','info');}
    else{ws2.add(p.id);icon.className='bi bi-heart-fill rp-icon';btn.style.color='#ef4444';window.rpToast?.('♥ Kedvencekhez adva','','success');}
    localStorage.setItem('rp_wishlist',JSON.stringify([...ws2]));
  });
}

// ── DEMO ADATOK az ultra_real_products.sql alapján (P001–P012) ──
// Teljes, valódi műszaki leírásokkal
// ── TELJES TERMÉK LISTA – db_schema.sql + products.sql alapján (41 db) ──
// ── TELJES TERMÉK LISTA – 41 db, hosszú HU/EN/DE leírásokkal ──
function getDemoProducts(){return[
  {id:1,sku:'P001',name:'iPhone 15 Pro',
   description:'Ha komoly telefont keresel, az iPhone 15 Pro nehezen megkerülhető. Titánium kerete könnyű és tartós egyszerre, a 48 MP-es kamera pedig szinte bármilyen fényviszonyban szép képet csinál. Az USB-C port végre egységes töltést jelent, az Action gombbal meg gyorsan előhívhatsz bármit. Egy feltöltéssel egész nap kibír, és iOS frissítéseket évekig kap.',
   image_url:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&h=700&fit=crop',
   unit_price:160000,stock:21,weight:0.187,category_name:'Mobil',avg_rating:4.8,review_count:124},

  {id:2,sku:'P002',name:'Samsung Galaxy S24 Ultra',
   description:'Az S24 Ultra az a telefon, amit ha egyszer kézbe veszel, nehéz letenni. A beépített S Pen minden más kiegészítőt feleslegessé tesz, a 200 MP-es kamera pedig annyira részletes képeket készít, hogy utólag is tudod vágni, közelíteni. Az AI funkciók napról napra megkönnyítik az életed. Nagy képernyő, erős akku, profi fotó.',
   image_url:'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=700&fit=crop',
   unit_price:170000,stock:22,weight:0.232,category_name:'Mobil',avg_rating:4.8,review_count:124},

  {id:3,sku:'P003',name:'ASUS ROG Strix G16 (2024)',
   description:'Ha gaming laptopot keresel, de nem akarsz kompromisszumot kötni a teljesítménnyel, az ROG Strix G16 jó választás. Az RTX 4060 videokártya simán elboldogul a modern játékokkal, a 165 Hz-es kijelző pedig valóban érezhetően simább képet ad. Hosszabb játékmenetekre is tervezett hűtése van, és persze RGB, amennyit csak akarsz.',
   image_url:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=700&fit=crop',
   unit_price:180000,stock:23,weight:2.500,category_name:'Gaming',avg_rating:4.7,review_count:98},

  {id:4,sku:'P004',name:'MacBook Air M2 (2023)',
   description:'A MacBook Air M2 az a laptop, amit szinte mindenki szeretne, aki Macet akar. Ventilátor nincs benne, tehát teljesen csendben működik, mégis meglepően gyors. Egész napra elég az akkuja, 1.24 kilós, és a kijelző gyönyörű. Jó filmekhez, irodai munkához, kreatív feladatokhoz – megbízható, nap mint nap.',
   image_url:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=700&fit=crop',
   unit_price:190000,stock:24,weight:1.240,category_name:'Laptop',avg_rating:4.6,review_count:67},

  {id:5,sku:'P005',name:'Dell XPS 13 Plus (2023)',
   description:'Az XPS 13 Plus az a laptop, amit a dizájnja miatt is megszeretsz. Szinte nincs kerete a kijelzőnek, a billentyűzeten nincs hagyományos érintőpad – beolvadt a lapba. Könnyű, stílusos, és az OLED panel olyan képet mutat, hogy egyszer sem fogod nézni az órádat unalomból. Utazáshoz, kávézóba, prezentációkhoz tökéletes.',
   image_url:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=700&fit=crop',
   unit_price:200000,stock:25,weight:1.240,category_name:'Laptop',avg_rating:4.9,review_count:203},

  {id:6,sku:'P006',name:'HP Pavilion 15-eh3 (2023)',
   description:'Ha egyszerűen csak egy jól működő, megbízható laptopot keresel mindennapi használatra, a HP Pavilion 15 pontosan erre való. Nagy a kijelzője, kényelmes a billentyűzete, és elég erős ahhoz, hogy böngészés, dokumentumok, videóhívások és filmek mind gond nélkül menjenek rajta. Nem csinál semmi extravagánsat – csak működik, mindig.',
   image_url:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&h=700&fit=crop',
   unit_price:210000,stock:26,weight:1.750,category_name:'Laptop',avg_rating:4.5,review_count:55},

  {id:7,sku:'P007',name:'Lenovo ThinkPad X1 Carbon Gen 11',
   description:'A ThinkPad X1 Carbon az a laptop, amit az irodai emberek évek óta esküdnek rá – és nem véletlenül. Alig több mint egy kiló, mégis katonai teszteket állt ki. Az OLED kijelző gyönyörű, a billentyűzet a legjobb laptopbillentyűzetek közé tartozik, és ha bármikor leejted, valószínűleg túléli. Üzleti utakhoz, hosszú napokhoz kitalálva.',
   image_url:'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=900&h=700&fit=crop',
   unit_price:220000,stock:27,weight:1.120,category_name:'Laptop',avg_rating:4.7,review_count:89},

  {id:8,sku:'P008',name:'Sony WH-1000XM5',
   description:'Ha sokat utazol, dolgozol zajos helyen, vagy csak szeretnéd, ha a világ egy időre elhallgatna, a WH-1000XM5 az, amit kerestek. A zajszűrése annyira hatékony, hogy repülőn is úgy érzed, mintha egy hangstúdióban ülnél. A párnák puhák, órákon át kényelmes viselni, a hang mély és részletgazdag. 30 óra, egy feltöltéssel.',
   image_url:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=700&fit=crop',
   unit_price:230000,stock:28,weight:0.250,category_name:'Fejhallgató',avg_rating:4.8,review_count:156},

  {id:9,sku:'P009',name:'Apple AirPods Pro 2. gen',
   description:'Az AirPods Pro 2 az a fülhallgató, amit egyszer felteszel, aztán nem akarod levenni. A zajszűrés meglepően hatásos ilyen kis eszköznél, a térhangzás filmekhez és zenéhez egyaránt élvezetes. Az USB-C tok bárhol tölthető, és a teljes rendszer IP54 minősítéssel rendelkezik, tehát esőtől sem kell félni. Apple eszközöknél a legjobb választás.',
   image_url:'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=900&h=700&fit=crop',
   unit_price:240000,stock:29,weight:0.061,category_name:'Fejhallgató',avg_rating:4.8,review_count:312},

  {id:10,sku:'P010',name:'JBL Charge 5',
   description:'A JBL Charge 5 az a hangszóró, amit strandra, kertre, kirándulásra visznek az emberek, mert IP67 minősítéssel nemcsak a vízre, hanem a homokra és porra is immunis. A hang teli és basszusos, sokkal nagyobbnak hat, mint amekkora. 20 óra zene, és ha lemerül a telefonod, USB-A kimeneten tölt is.',
   image_url:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&h=700&fit=crop',
   unit_price:250000,stock:30,weight:0.960,category_name:'Fejhallgató',avg_rating:4.7,review_count:445},

  {id:11,sku:'P011',name:'Samsung QLED 55" QN90C',
   description:'Az QN90C nem csak egy tv – nappali ékszere is lehet. A Mini LED technológia miatt a fényes és sötét részek egyszerre tökéletesek a képen, és 144 Hz-en fut, tehát konzolon és PC-n is szép és gyors. A beépített Gaming Hub azt jelenti, hogy konzol nélkül is lehet felhőben játszani. Nappal sem mosódik el a kép az anti-reflection bevonat miatt.',
   image_url:'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=900&h=700&fit=crop',
   unit_price:260000,stock:31,weight:20.100,category_name:'TV & Monitor',avg_rating:4.6,review_count:89},

  {id:12,sku:'P012',name:'LG OLED C3 65"',
   description:'Az LG OLED C3 az a képernyő, ami után minden más kicsit fakónak tűnik. Az OLED technológia miatt minden egyes pixel maga kapcsol be és ki, így a feketék tényleg feketék – nem szürke. Filmekhez, sorozatokhoz ez a legjobb otthoni élmény. Gaminghez G-Sync és 120 Hz, okostv funkcióként pedig minden fontosabb streaming alkalmazás beépítve.',
   image_url:'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=900&h=700&fit=crop',
   unit_price:270000,stock:32,weight:24.700,category_name:'TV & Monitor',avg_rating:4.5,review_count:134},

  {id:13,sku:'E001',name:'iPhone 15',
   description:'Az iPhone 15 az a pont, ahol az Apple Pro funkciói elkezdtek leszivárogni a normál modellbe. A Dynamic Island már itt is van, USB-C-re váltottak, és a 48 MP-es kamera is ide került. Szép, könnyű, jól a kézben van, és hosszú az akkuja. Ha nem kell minden Pro feature, de Apple minőséget szeretnél, ez az okos választás.',
   image_url:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&h=700&fit=crop',
   unit_price:429999,stock:40,weight:0.171,category_name:'Mobil',avg_rating:4.8,review_count:219},

  {id:14,sku:'E002',name:'Samsung Galaxy S24',
   description:'A Galaxy S24 bizonyítja, hogy a kompakt méret nem jelent gyengébb telefont. Snapdragon 8 Gen 3 van benne, a Galaxy AI funkciók ugyanúgy elérhetők, és a kijelző 120 Hz-en fut. Kézre álló méret, erős teljesítmény, és a Samsung hét éves frissítési ígérete. Ha az Ultra túl nagy, ez a tökéletes alternatíva.',
   image_url:'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=700&fit=crop',
   unit_price:389999,stock:35,weight:0.167,category_name:'Mobil',avg_rating:4.5,review_count:50},

  {id:15,sku:'E003',name:'Xiaomi Redmi Note 13 Pro',
   description:'A Redmi Note 13 Pro az a telefon, amit nehéz megindokolni, hogy miért nem vesz meg mindenki – olyan jó az ára ahhoz képest, amit nyújt. 200 MP-es kamera, szép AMOLED kijelző, 67W gyorstöltés. Nem a legprémiumabb anyaghasználat, de az arc és ujjlenyomat-szenzor gyors, és az akkuja bírja. Praktikus, megbízható mindennapokra.',
   image_url:'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&h=700&fit=crop',
   unit_price:119999,stock:60,weight:0.187,category_name:'Mobil',avg_rating:4.5,review_count:50},

  {id:16,sku:'E004',name:'Google Pixel 8',
   description:'A Pixel 8 az a telefon, amit a Google saját maga tervezett – hardvertől szoftverig. Ez azt jelenti, hogy a legtisztább Android élményt kapod, gyors frissítésekkel és olyan AI funkciókkal, amiket más telefonon nem találsz. A Magic Eraser és a Photo Unblur valóban hasznos. Hét évig kap biztonsági frissítést.',
   image_url:'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&h=700&fit=crop',
   unit_price:349999,stock:25,weight:0.187,category_name:'Mobil',avg_rating:4.5,review_count:50},

  {id:17,sku:'E005',name:'MacBook Air M2',
   description:'Ugyanaz a MacBook Air M2 – ventilátor nélkül, csendes, gyors, gyönyörű Liquid Retina kijelző. Az Apple ökoszisztémán belül az egyik legjobb döntés, ha laptop kell. Ez a variáns esetlegesen eltérő konfigurációval érkezhet.',
   image_url:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=700&fit=crop',
   unit_price:549999,stock:15,weight:1.240,category_name:'Laptop',avg_rating:4.5,review_count:50},

  {id:18,sku:'E006',name:'Dell XPS 13',
   description:'A Dell XPS 13 évek óta az egyik legelismertebb ultrabook – és ez nem véletlen. Kis méretbe sűrített nagy teljesítmény, szinte keret nélküli kijelző, és az a fajta tartósság, ami azt érezteti veled, hogy tartós dolgot vettél. Utazóknak és dolgozóknak, akiknek fontos, hogy a laptop szép is legyen és jó is.',
   image_url:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=700&fit=crop',
   unit_price:499999,stock:12,weight:1.200,category_name:'Laptop',avg_rating:4.5,review_count:50},

  {id:19,sku:'E007',name:'Lenovo ThinkPad E14 Gen 5',
   description:'A ThinkPad E14 nem a legfeltűnőbb laptop a piacon, de pontosan ezt a célt szolgálja. Megbízható, tartós, a billentyűzete kényelmes, és fingerprint olvasóval is érkezik. Ha irodai munkára kell egy laptop, ami nem szokott problémákat okozni és nem merül le ebédre, ez a helyes irány.',
   image_url:'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=900&h=700&fit=crop',
   unit_price:329999,stock:18,weight:1.690,category_name:'Laptop',avg_rating:4.5,review_count:50},

  {id:20,sku:'E008',name:'HP Envy 15',
   description:'Az HP Envy 15 azoknak szól, akiknek az erős teljesítmény és a szép kép együtt kell. Az RTX 4060 videóexporthoz, fotószerkesztéshez és játékhoz is alkalmas, az OLED kijelző pedig megmutatja a munkád igazi színeit. Nagyobb és nehezebb, mint egy ultrabook, de cserébe sokkal többet tud.',
   image_url:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&h=700&fit=crop',
   unit_price:459999,stock:10,weight:2.100,category_name:'Laptop',avg_rating:4.5,review_count:50},

  {id:21,sku:'E009',name:'Samsung 55" QLED 4K TV',
   description:'Jó ár-érték arányú Samsung tévé, ha nem kell a legcsúcsabb panel, de szép képet és okostv funkciókat igen. A QLED élénk színeket hoz, 120 Hz-en fut, és a Tizen rendszeren minden fontos streaming alkalmazás ott van. Filmekhez, sorozatokhoz, sporthoz egyaránt megfelelő.',
   image_url:'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=900&h=700&fit=crop',
   unit_price:299999,stock:20,weight:14.500,category_name:'TV & Monitor',avg_rating:4.5,review_count:50},

  {id:22,sku:'E010',name:'LG 65" OLED TV',
   description:'Ha valaha láttál már OLED tévén filmet, és azóta a többi képernyő egy kicsit fakónak tűnik, ismered az érzést. Az LG 65 colos OLED-je pontosan ezt adja – tökéletes feketék, élénk színek, és elég nagy ahhoz, hogy valóban moziteremnek érezzed a nappalit. G-Sync-el gaminghez is tökéletes.',
   image_url:'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=900&h=700&fit=crop',
   unit_price:699999,stock:8,weight:19.400,category_name:'TV & Monitor',avg_rating:4.5,review_count:50},

  {id:23,sku:'E011',name:'Sony WH-1000XM5',
   description:'Az iparág legjobb zajszűrős fejhallgatója, 30 óra akku és Hi-Res LDAC audio. Ha csendre és minőségi hangra vágysz utazáshoz vagy irodához, ez az eszköz.',
   image_url:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=700&fit=crop',
   unit_price:149999,stock:50,weight:0.250,category_name:'Fejhallgató',avg_rating:4.5,review_count:50},

  {id:24,sku:'E012',name:'Apple AirPods Pro 2. gen',
   description:'Apple H2 chip, adaptív zajszűrés, Spatial Audio és USB-C MagSafe tok. Az Apple fülhallgató-piac csúcsa – felteszi az ember és nem akarja levenni.',
   image_url:'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=900&h=700&fit=crop',
   unit_price:119999,stock:70,weight:0.061,category_name:'Fejhallgató',avg_rating:4.5,review_count:50},

  {id:25,sku:'E013',name:'JBL Charge 5',
   description:'IP67 vízállóság, 40W hangzás, 20 óra akku és USB-A powerbank. A legnépszerűbb kerti és utazóhangszóró – bármilyen időben és helyszínen bevethető.',
   image_url:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&h=700&fit=crop',
   unit_price:69999,stock:45,weight:0.960,category_name:'Fejhallgató',avg_rating:4.5,review_count:50},

  {id:26,sku:'E014',name:'Logitech MX Master 3S',
   description:'Az MX Master 3S az a egér, amit ha egyszer kipróbálsz, az összes többi egyszerűnek tűnik mellette. A MagSpeed görgő az egyik legjobb dolog rajta – az ujjaid egy mozdulatával görgehetsz végig egy hosszú dokumentumon. Csendes kattintások, kényelmes ergonomikus forma, és üvegen is működik az érzékelője. Napokig tart az akkuja.',
   image_url:'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=900&h=700&fit=crop',
   unit_price:44999,stock:80,weight:0.141,category_name:'PC Kiegészítők',avg_rating:4.5,review_count:50},

  {id:27,sku:'E015',name:'Keychron K8 Pro TKL',
   description:'Ha valaha is megkérdőjelezted, érdemes-e rendes mechanikus billentyűzetre váltani – a Keychron K8 Pro megválaszolja a kérdést. A billentyűk tapintható visszajelzése valóban különbség a gépelésben, a Hot-Swap foglalat azt jelenti, hogy bármikor cserélhetsz switcht szerszám nélkül. Bluetooth és USB-C, RGB – minden megvan.',
   image_url:'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&h=700&fit=crop',
   unit_price:59999,stock:55,weight:0.850,category_name:'PC Kiegészítők',avg_rating:4.5,review_count:50},

  {id:28,sku:'E016',name:'ASUS TUF Gaming VG27AQL1A 27"',
   description:'Az ASUS TUF Gaming monitor az a megjelenítő, amelyik belefér a budgetbe, de teljesítményben nem marad le a drágábbaktól. 170 Hz QHD felbontáson, G-Sync kompatibilis, és az ergonomikus talp sokféle pozícióba állítható. 60 Hz-ről upgradelve az első pillanattól érezni fogod a különbséget.',
   image_url:'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=900&h=700&fit=crop',
   unit_price:179999,stock:22,weight:6.500,category_name:'TV & Monitor',avg_rating:4.5,review_count:50},

  {id:29,sku:'E017',name:'Samsung Odyssey G5 27"',
   description:'Az Odyssey G5 ívelt képernyője az első pillanattól befogja a látóteredet, és valóban bevon a játékba. 165 Hz, FreeSync Premium, és a VA panel mélyen fekete. Ha long session-ökre játszol, az ívelt forma kevésbé fárasztja a szemet. Egy gaming setup fontos és megfizethető eleme.',
   image_url:'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=900&h=700&fit=crop',
   unit_price:159999,stock:19,weight:6.200,category_name:'TV & Monitor',avg_rating:4.5,review_count:50},

  {id:30,sku:'E018',name:'Canon EOS R10',
   description:'Az EOS R10 az a kamera, amivel az emberek lépnek az okostelefon-fotózás után. Nem bonyolult, de azonnal érezni, hogy ez valami más: a Dual Pixel AF szinte mindent automatikusan tart fókuszban, a 4K videó éles, az RF objektívrendszer pedig hosszú távon bővíthető. Könnyű, kompakt, és élvezetes bánni vele.',
   image_url:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&h=700&fit=crop',
   unit_price:349999,stock:14,weight:0.429,category_name:'Fotózás',avg_rating:4.5,review_count:50},

  {id:31,sku:'E019',name:'Sony Alpha A6400',
   description:'Az A6400 a videósok és portréfotósok kedvence azért az egy dologért: az Eye AF. A fényképezőgép valóságos rátalál a szemen, és ott tartja a fókuszt – mozgás közben, rossz fényviszonyban, mindenhol. Ha embereket, gyerekeket, állatokat fotózol, ez az automatika önmagában megéri a vételárat.',
   image_url:'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&h=700&fit=crop',
   unit_price:329999,stock:11,weight:0.403,category_name:'Fotózás',avg_rating:4.5,review_count:50},

  {id:32,sku:'E020',name:'GoPro Hero 12 Black',
   description:'Ha extrém sport, utazás vagy kaland van a programban és szeretnéd megörökíteni, a GoPro Hero 12 Black az eszköz. Tok nélkül 10 méter mélységig vízálló, a HyperSmooth 6.0 stabilizáció azt jelenti, hogy futás, biciklizés, búvárkodás közben sem rázza össze a képet. Könnyű, robosztus, és könnyen szerkeszthető az anyag.',
   image_url:'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=900&h=700&fit=crop',
   unit_price:199999,stock:30,weight:0.154,category_name:'Fotózás',avg_rating:4.5,review_count:50},

  {id:33,sku:'E021',name:'Anker PowerCore 20000 PD 65W',
   description:'Az Anker PowerCore 20000 PD 65W az a powerbank, amibe a laptopod is belefér. 65W USB-C kimenettel MacBookot és szinte bármilyen modern laptopot tölteni tud, a két USB-A kimenet közben a telefonokról is gondoskodik. Hosszú utazásokra, konferenciákra – ahol nem mindig van dugaszoló – ez az egyetlen töltő, amire szükséged van.',
   image_url:'https://images.unsplash.com/photo-1609592806596-b9e6c2e90e98?w=900&h=700&fit=crop',
   unit_price:24999,stock:100,weight:0.420,category_name:'PC Kiegészítők',avg_rating:4.5,review_count:50},

  {id:34,sku:'E022',name:'Samsung 990 Pro 1TB NVMe SSD',
   description:'A számítógéped vagy PS5-öd lassabb, mint lehetne? A Samsung 990 Pro SSD az egyik leggyorsabb consumer tároló a piacon. A telepítés egyszerű, az operációs rendszer betöltése, a játékok indítása – minden érezhetően gyorsabb lesz. PS5-be is belerakható tárhelybővítésként. Egyszerű upgrade, nagy hatás.',
   image_url:'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=900&h=700&fit=crop',
   unit_price:49999,stock:75,weight:0.050,category_name:'PC Kiegészítők',avg_rating:4.5,review_count:50},

  {id:35,sku:'E023',name:'TP-Link Archer AX55 WiFi 6 Router',
   description:'Ha a lakásod sarkában már gyenge a WiFi, itt az ideje routert cserélni. A TP-Link Archer AX55 WiFi 6-os, tehát a modern eszközök ki tudják belőle hozni a maximum sebességet. A 2.5G WAN port a gyorsabb internet-előfizetéseknek is kedvez, az OneMesh támogatással pedig mesh hálózatot is ki lehet belőle alakítani.',
   image_url:'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=900&h=700&fit=crop',
   unit_price:39999,stock:40,weight:0.510,category_name:'Hálózat',avg_rating:4.5,review_count:50},

  {id:36,sku:'E024',name:'Apple Watch Series 9 (GPS, 45mm)',
   description:'Az Apple Watch Series 9 az az okosóra, amit ha egyszer elkezdesz hordani, furán fogod érezni magad nélküle. Az értesítések, az edzéskövetés, az EKG mind hasznos – de a Double Tap gesztus az, ami igazán meglepő. Érintés nélkül vezérelheted az órát, amikor tele van a kezed. Szép, tartós, és watchOS-t kap évekig.',
   image_url:'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=900&h=700&fit=crop',
   unit_price:189999,stock:28,weight:0.045,category_name:'Okoseszközök',avg_rating:4.5,review_count:50},

  {id:37,sku:'E025',name:'Amazon Echo Dot 5. generáció',
   description:'Az Echo Dot az a kis kütyü, ami eldöntetlen, hogy hangszóró-e vagy okosotthon-vezérlő – mert mindkettő. Alexa bármilyen kérdésre válaszol, irányítja a lámpákat és a thermosztátot, és zenét is játszik le. Az 5. generáció beépített Eero WiFi-kiterjesztővel is rendelkezik. Elképesztő ár, rengeteg tudás.',
   image_url:'https://images.unsplash.com/photo-1543512214-318c7553f230?w=900&h=700&fit=crop',
   unit_price:19999,stock:65,weight:0.304,category_name:'Okoseszközök',avg_rating:4.5,review_count:50},

  {id:38,sku:'T001',name:'iPhone 14',
   description:'Az iPhone 14 az a telefon, ami már megkapta az Emergency SOS via Satellite funkciót – tehát lefedettség nélküli területen is lehet segítséget kérni. Stabil, megbízható, iOS frissítéseket kap, és a kamera sötétben is szépen teljesít a Photonic Engine segítségével.',
   image_url:'https://images.unsplash.com/photo-1664478546384-d57bbe74a6ce?w=900&h=700&fit=crop',
   unit_price:399999,stock:45,weight:0.172,category_name:'Mobil',avg_rating:4.5,review_count:50},

  {id:39,sku:'T002',name:'Samsung Galaxy S23',
   description:'A Galaxy S23 az a Samsung, amivel semmit sem kockáztatsz. Bevált, stabil, gyors, és a 50 MP-es triple kamerarendszer szép képeket csinál napfényen és éjjel egyaránt. Kompakt méret, prémium minőség, egy napra bőven elég akku.',
   image_url:'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=900&h=700&fit=crop',
   unit_price:299999,stock:36,weight:0.168,category_name:'Mobil',avg_rating:4.5,review_count:50},

  {id:40,sku:'T003',name:'Dell Inspiron 15',
   description:'Az Inspiron 15 pontosan az, amire az ember gondol, ha mindennapi laptopot keres. Nem próbál semmi extrát mutatni – csak működik. Nagy kijelző, kényelmes billentyűzet, SD kártyaolvasó, HDMI a külső monitorhoz. Egyszerű, megbízható, jó ár.',
   image_url:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&h=700&fit=crop',
   unit_price:249999,stock:27,weight:1.920,category_name:'Laptop',avg_rating:4.5,review_count:50},

  {id:41,sku:'T004',name:'HP Pavilion 14',
   description:'A HP Pavilion 14 kisebb és könnyebb, mint a 15 colos társa, és ha nem kell akkora képernyő, ez az okos választás. 14 colos micro-edge kijelző, kényelmes billentyűzet, és a HP True Vision kamera videokonferenciákhoz is rendesen teljesít. Terjedelmes táskába is belefér, egész napra elég az akkuja.',
   image_url:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&h=700&fit=crop',
   unit_price:239999,stock:23,weight:1.550,category_name:'Laptop',avg_rating:4.5,review_count:50},
];}

async function load(){
  const id=Number(getParam('id'));
  const errEl=qs('#pdError'),wrap=qs('#pdWrap');
  if(!id){if(errEl){errEl.style.display='block';errEl.textContent='Hiányzó termék azonosító.';}return;}
  try{
    let p=null;
    if(window.api){try{
        const res=await window.api.get(`/products/${id}`);
        // Backend returns: {success:true, data: {...product...}}
        p=res?.data?.data??res?.data??res;
        if(p&&typeof p==='object'&&!p.id)p=null;
      }catch(e){console.log('API load error:',e.message);}}
    if(!p){p=getDemoProducts().find(x=>x.id===id);}
    if(!p){if(errEl){errEl.style.display='block';errEl.textContent='Termék nem található (ID: '+id+').';}return;}
    currentProduct=p;
    document.title='Raktár Pro – '+p.name;
    const user=getUser(),admin=isAdmin(user);

    // Populate
    qs('#pdTitle').textContent=p.name||'';
    qs('#pdPrice').textContent=fmt(pickPrice(p));
    // Star rating display
    const avg=parseFloat(p.avg_rating)||0;
    const cnt=parseInt(p.review_count)||0;
    const ratEl=qs('#pdRating');
    if(ratEl){
      const stars=[1,2,3,4,5].map(i=>{
        const r=Math.round(avg*2)/2;
        if(r>=i)return'<i class="bi bi-star-fill" style="color:#f59e0b;font-size:14px;"></i>';
        if(r>=i-0.5)return'<i class="bi bi-star-half" style="color:#f59e0b;font-size:14px;"></i>';
        return'<i class="bi bi-star" style="color:rgba(100,120,150,.3);font-size:14px;"></i>';
      }).join('');
      ratEl.innerHTML=avg>0
        ? `<span style="display:flex;align-items:center;gap:5px;">${stars}<span style="font-size:13px;font-weight:700;color:var(--text);">${avg.toFixed(1)}</span><span style="font-size:12px;color:var(--text-dim);">(${cnt} értékelés)</span></span>`
        : `<span style="font-size:12px;color:var(--text-dim);">Még nincs értékelés</span>`;
    }
    qs('#pdCategory').textContent=p.category_name||p.category||'Termék';
    // Leírás – mindig magyarul
    const rawDesc = p.description_hu || p.description || 'Nincs leírás.';
    const descEl = qs('#pdDesc');
    if (descEl) descEl.innerHTML = `<p style="line-height:1.8;color:var(--text);font-size:14px;margin:0;">${esc(rawDesc)}</p>`;
    const stock=p.stock!==undefined?Number(p.stock):null;
    if(qs('#pdStock'))qs('#pdStock').innerHTML=stockPill(stock);

    // Admin meta
    const adminMeta=qs('#pdAdminMeta');
    if(adminMeta){
      if(admin){
        if(qs('#pdSku'))qs('#pdSku').textContent=p.sku||'—';
        if(qs('#pdId'))qs('#pdId').textContent=String(p.id);
        if(qs('#pdStockExact'))qs('#pdStockExact').textContent=stock!==null?stock+' db':'—';
        if(qs('#pdWeight'))qs('#pdWeight').textContent=p.weight?Number(p.weight).toFixed(3)+' kg':'—';
      }else{adminMeta.style.display='none';}
    }

    renderGallery(p);
    renderSpecs(p);
    setupTabs();
    setupWish(p);

    const addBtn=qs('#pdAddBtn');
    if(addBtn){
      if(stock!==null&&stock<=0){addBtn.disabled=true;addBtn.innerHTML='<i class="bi bi-x-circle rp-icon"></i> Elfogyott';addBtn.style.opacity='.5';}
      else{addBtn.addEventListener('click',()=>addToCart(p));}
    }

    // Cart badge
    const cart=JSON.parse(localStorage.getItem('rp_cart')||'[]');
    const badge=document.getElementById('cartBadge');
    if(badge){const tot=cart.reduce((s,c)=>s+(c.qty||1),0);badge.textContent=tot;badge.style.display=tot>0?'flex':'none';}

    if(wrap)wrap.style.display='';
    if(errEl)errEl.style.display='none';
  }catch(e){
    if(errEl){errEl.style.display='block';errEl.textContent='Hiba: '+e.message;}
  }
}

document.addEventListener('DOMContentLoaded',load);
})();
