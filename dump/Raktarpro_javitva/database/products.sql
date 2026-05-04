-- products.sql – RaktarPro
-- REPLACE INTO: bármikor újrafuttatható, nem dob hibát.
-- Importálás előtt importáld a db_schema.sql-t!

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

REPLACE INTO `products`
  (`id`, `sku`, `name`, `description`, `image_url`, `category_id`, `supplier_id`, `unit_price`, `weight`, `stock`)
VALUES

(1,  'P001', 'iPhone 15 Pro',
 'Ha komoly telefont keresel, az iPhone 15 Pro nehezen megkerülhető. Titánium kerete könnyű és tartós egyszerre, a 48 MP-es kamera pedig szinte bármilyen fényviszonyban szép képet csinál. Az USB-C port végre egységes töltést jelent, az Action gombbal meg gyorsan előhívhatsz bármit. Egy feltöltéssel egész nap kibír, és iOS frissítéseket évekig kap.',
 './imgs/iphone-15-pro.jpg',
 2, 1, 160000.00, 0.187, 21),

(2,  'P002', 'Samsung Galaxy S24 Ultra',
 'Az S24 Ultra az a telefon, amit ha egyszer kézbe veszel, nehéz letenni. A beépített S Pen minden más kiegészítőt feleslegessé tesz, a 200 MP-es kamera pedig annyira részletes képeket készít, hogy utólag is tudod vágni, közelíteni. Az AI funkciók napról napra megkönnyítik az életed. Nagy képernyő, erős akku, profi fotó.',
 './imgs/samsung-s24-ultra.jpg',
 2, 1, 170000.00, 0.232, 22),

(3,  'P003', 'ASUS ROG Strix G16 (2024)',
 'Ha gaming laptopot keresel, de nem akarsz kompromisszumot kötni a teljesítménnyel, az ROG Strix G16 jó választás. Az RTX 4060 videokártya simán elboldogul a modern játékokkal, a 165 Hz-es kijelző pedig valóban érezhetően simább képet ad. Hosszabb játékmenetekre is tervezett hűtése van, és persze RGB, amennyit csak akarsz.',
 './imgs/asus-rog-strix.jpg',
 3, 2, 180000.00, 2.500, 23),

(4,  'P004', 'MacBook Air M2 (2023)',
 'A MacBook Air M2 az a laptop, amit szinte mindenki szeretne, aki Macet akar. Ventilátor nincs benne, tehát teljesen csendben működik, mégis meglepően gyors. Egész napra elég az akkuja, 1.24 kilós, és a kijelző gyönyörű. Jó filmekhez, irodai munkához, kreatív feladatokhoz – megbízható, nap mint nap.',
 './imgs/macbook-air-m2.jpg',
 3, 2, 190000.00, 1.240, 24),

(5,  'P005', 'Dell XPS 13 Plus (2023)',
 'Az XPS 13 Plus az a laptop, amit a dizájnja miatt is megszeretsz. Szinte nincs kerete a kijelzőnek, a billentyűzeten nincs hagyományos érintőpad – beolvadt a lapba. Könnyű, stílusos, és az OLED panel olyan képet mutat, hogy egyszer sem fogod nézni az órádat unalomból. Utazáshoz, kávézóba, prezentációkhoz tökéletes.',
 './imgs/dell-xps-13-plus.jpg',
 3, 2, 200000.00, 1.240, 25),

(6,  'P006', 'HP Pavilion 15-eh3 (2023)',
 'Ha egyszerűen csak egy jól működő, megbízható laptopot keresel mindennapi használatra, a HP Pavilion 15 pontosan erre való. Nagy a kijelzője, kényelmes a billentyűzete, és elég erős ahhoz, hogy böngészés, dokumentumok, videóhívások és filmek mind gond nélkül menjenek rajta.',
 './imgs/hp-pavilion-15.jpg',
 3, 2, 210000.00, 1.750, 26),

(7,  'P007', 'Lenovo ThinkPad X1 Carbon Gen 11',
 'A ThinkPad X1 Carbon az a laptop, amit az irodai emberek évek óta esküdnek rá – és nem véletlenül. Alig több mint egy kiló, mégis katonai teszteket állt ki. Az OLED kijelző gyönyörű, a billentyűzet a legjobb laptopbillentyűzetek közé tartozik, és ha bármikor leejted, valószínűleg túléli.',
 './imgs/thinkpad-x1.jpg',
 3, 2, 220000.00, 1.120, 27),

(8,  'P008', 'Sony WH-1000XM5',
 'Ha sokat utazol, dolgozol zajos helyen, vagy csak szeretnéd, ha a világ egy időre elhallgatna, a WH-1000XM5 az, amit kerestek. A zajszűrése annyira hatékony, hogy repülőn is úgy érzed, mintha egy hangstúdióban ülnél. A párnák puhák, órákon át kényelmes viselni, a hang mély és részletgazdag. 30 óra, egy feltöltéssel.',
 './imgs/sony-wh1000xm5.jpg',
 4, 3, 230000.00, 0.250, 28),

(9,  'P009', 'Apple AirPods Pro 2. gen',
 'Az AirPods Pro 2 az a fülhallgató, amit egyszer felteszel, aztán nem akarod levenni. A zajszűrés meglepően hatásos ilyen kis eszköznél, a térhangzás filmekhez és zenéhez egyaránt élvezetes. Az USB-C tok bárhol tölthető, és a teljes rendszer IP54 minősítéssel rendelkezik.',
 './imgs/airpods-pro-2.jpg',
 4, 3, 120000.00, 0.061, 29),

(10, 'P010', 'JBL Charge 5',
 'A JBL Charge 5 az a bluetooth hangszóró, ami mindenhova jön veled. IP67 védettséggel nem kell félni az esőtől vagy a homokos strandtól. 20 óra akkumulátor, mély bassz és közepes méret – pontosan annyi, amennyit egy jó hordozható hangszórótól elvársz.',
 './imgs/jbl-charge-5.jpg',
 4, 3, 50000.00, 0.960, 30),

(11, 'P011', 'Samsung QLED 55" QN90C',
 'A QN90C Neo QLED televízió pontosan azt nyújtja, amit egy prémium tévétől elvársz: rendkívül élénk színeket, mély feketéket, és 120 Hz-es frissítési rátát, ami játékhoz és filmhez egyaránt tökéletes. A mini LED technológia 2000 nit fényerőt biztosít, napfényes szobában is láthatóan.',
 './imgs/samsung-qled-55.jpg',
 5, 4, 280000.00, 16.000, 18),

(12, 'P012', 'LG OLED C3 65"',
 'Az LG OLED C3 az egyik legjobb televízió, amit pénzért venni lehet. Az OLED panel minden pixele önmaga világít, így a fekete tényleg fekete, és a kontraszt végtelen. Filmekhez, sorozatokhoz, és komoly játékosoknak egyaránt az első választás.',
 './imgs/lg-oled-c3-65.jpg',
 5, 4, 290000.00, 18.500, 19),

(13, 'E001', 'iPhone 15',
 'Az iPhone 15 az első iPhone USB-C csatlakozóval, és ez önmagában megér egy upgrade-et. A 48 MP-es kamera jelentős ugrás a korábbi modellekhez képest, az A16 chip pedig gyors és hatékony. Ha nem kell minden a Próból, ez az okos választás.',
 './imgs/iphone-15.jpg',
 2, 1, 150000.00, 0.171, 40),

(14, 'E002', 'Samsung Galaxy S24',
 'A Galaxy S24 a Samsung belépőszintű csúcstelefonja 2024-ben, és ez már nagyon komoly. Snapdragon 8 Gen 3 chip, 50 MP-es kamera, és Galaxy AI funkciók – mindez kompakt, 167 grammos házban. 120 Hz-es kijelző, 5G, IP68.',
 './imgs/samsung-s24.jpg',
 2, 1, 160000.00, 0.167, 35),

(15, 'E003', 'Xiaomi Redmi Note 13 Pro',
 'A Redmi Note 13 Pro az ár-érték kategória egyik legjobb telefonja. 200 MP-es kamera, AMOLED kijelző, 67 W-os töltés – ezeket a számokat más márkáknál dupla áron kapod. Ha nem akarsz sokat költeni, de sok mindent akarsz kapni, itt a helyed.',
 './imgs/xiaomi-redmi.jpg',
 2, 1, 80000.00, 0.187, 45),

(16, 'E004', 'Google Pixel 8',
 'A Pixel 8 a legtisztább Android élményt adja, amit kaphatsz – friss frissítések 7 évig, Tensor G3 chip, és a legjobb kameraalgoritmus a piacon. 50 MP-es főkamera, Kíséreti Fotó funkció, Magic Eraser. Ha Androidon maradsz, ez az okos választás.',
 './imgs/google-pixel-8.jpg',
 2, 1, 140000.00, 0.187, 32),

(17, 'E005', 'MacBook Air M2',
 'A MacBook Air M2 a legjobb mindennapi laptop, ha Macet akarsz. Csendes, gyors, egész napos akkumulátor. Nincs szellőző, mégis minden feladattal megbirkózik.',
 './imgs/macbook-air-m2-2.jpg',
 3, 2, 190000.00, 1.240, 20),

(18, 'E006', 'Dell XPS 13',
 'Az XPS 13 a Dell prémium ultrabookja, minimális kerettel és OLED kijelzővel. Könnyű, gyors és gyönyörű – utazáshoz és irodai munkához egyaránt tökéletes.',
 './imgs/dell-xps-13.jpg',
 3, 2, 210000.00, 1.170, 18),

(19, 'E007', 'Lenovo ThinkPad E14 Gen 5',
 'A ThinkPad E14 a megbízható irodai laptop, amit Lenovo évtizedek óta tökéletesít. Ryzen processzor, kényelmes billentyűzet, ujjlenyomatolvasó és megbízható felépítés – mindennapos munkára kitalálva.',
 './imgs/thinkpad-e14.jpg',
 3, 2, 175000.00, 1.590, 22),

(20, 'E008', 'HP Envy 15',
 'A HP Envy 15 a kreatívoknak és az igényes felhasználóknak szól. 4K OLED kijelző, erős processzor, és 5 MP-es webkamera Windows Hello arcfelismeréssel. Ha nem elég egy átlagos laptop, de nem kell gaming gép sem.',
 './imgs/hp-envy-15.jpg',
 3, 2, 250000.00, 1.990, 15),

(21, 'E009', 'Samsung 55" QLED 4K TV',
 'A Samsung QLED technológia élénk, telített színeket ad még napfényes szobában is. 120 Hz, HDR10+, és Smart TV funkciók – Netflix, YouTube, minden beépítve. Játékhoz és filmhez egyaránt kiváló választás.',
 './imgs/samsung-qled-4k.jpg',
 5, 4, 180000.00, 13.800, 12),

(22, 'E010', 'LG 65" OLED TV',
 'Az LG OLED tévék a tökéletes fekete és végtelen kontraszt szimbólumai. 65 colos, 4K, Dolby Vision, Dolby Atmos, és 4 HDMI 2.1 port játékosoknak. Ha egyszer OLED-et látsz, nincs visszaút.',
 './imgs/lg-oled-65.jpg',
 5, 4, 220000.00, 19.500, 10),

(23, 'E011', 'Sony WH-1000XM5',
 'Ugyanaz a világ legjobb zajszűrős fejhallgatója, kicsit más kialakításban. 30 óra akku, Multipoint Bluetooth, 8 mikrofon a kristálytiszta hívásokhoz. Ha repülsz, vonaton jársz vagy nyílt irodában dolgozol – ez a megoldás.',
 './imgs/sony-wh1000xm5-2.jpg',
 4, 3, 125000.00, 0.250, 25),

(24, 'E012', 'Apple AirPods Pro 2. gen',
 'Az AirPods Pro 2 a legjobb iOS-kompatibilis fülhallgató. Adaptive Transparency, Spatial Audio, USB-C töltőtok. Ha iPhone-od van, ez a természetes választás.',
 './imgs/airpods-pro-2-2.jpg',
 4, 3, 120000.00, 0.061, 30),

(25, 'E013', 'JBL Charge 5',
 'A JBL Charge 5 mindenhova jön veled – vízálló, tartós, erős hang. 20 óra lejátszás, PartyBoost több hangszóróhoz, és USB-A kimenet a telefon töltéséhez. Strandhoz, kiránduláshoz, teraszra.',
 './imgs/jbl-charge-5-2.jpg',
 4, 3, 50000.00, 0.960, 28),

(26, 'E014', 'Logitech MX Master 3S',
 'Az MX Master 3S a legjobb irodai egér, amit ma kapni lehet. Darkfield szenzor üvegen is működik, MagSpeed görgő egy másodperc alatt lapozza át a dokumentumot, és 70 napig bírja egy töltéssel. Programozható gombok, három eszköz egyszerre.',
 './imgs/logitech-mx-master.jpg',
 6, 5, 45000.00, 0.141, 50),

(27, 'E015', 'Keychron K8 Pro TKL',
 'A Keychron K8 Pro a mechanikus billentyűzet-rajongók kedvence. Hot-swap foglalatokkal bármilyen kapcsolót berakhat, RGB háttérvilágítás, alumínium keret, és Bluetooth 5.1 – Mac és Windows kompatibilis.',
 './imgs/keychron-k8-pro.jpg',
 6, 5, 38000.00, 0.860, 35),

(28, 'E016', 'ASUS TUF Gaming VG27AQL1A 27"',
 'A TUF Gaming monitor 27 colos QHD IPS panelt kínál 170 Hz-es frissítési rátával. G-Sync Compatible és FreeSync Premium, 1 ms válaszidő, HDR400 – komoly gaming kijelző komoly áron.',
 './imgs/asus-tuf-monitor.jpg',
 7, 4, 120000.00, 6.200, 15),

(29, 'E017', 'Samsung Odyssey G5 27"',
 'A Samsung Odyssey G5 ívelt VA panel 1000R görbülettel, ami körbeöleli a látóteret. 165 Hz, 1 ms, QHD felbontás – mindezt kompetitív áron. Gaming monitornak nehéz jobbat találni ezen az áron.',
 './imgs/samsung-odyssey-g5.jpg',
 7, 4, 90000.00, 5.900, 20),

(30, 'E018', 'Canon EOS R10',
 'A Canon EOS R10 a legjobb belépő tükör nélküli fényképezőgép kezdőknek és haladóknak egyaránt. 24 MP APS-C szenzor, 23 kép/mp, 4K videó, és Eye AF – mindez kompakt, könnyű házban. Portréhoz, sporteseményekhez és utazáshoz.',
 './imgs/canon-eos-r10.jpg',
 8, 5, 160000.00, 0.429, 12),

(31, 'E019', 'Sony Alpha A6400',
 'A Sony A6400 az Eye AF technológia miatt vált legendássá. Portréfotókhoz, gyerekekhez, állatokhoz – bármilyen mozgó alanyhoz ez a legokosabb választás ebben az árkategóriában. 24 MP, 4K videó, forgatható kijelző.',
 './imgs/sony-a6400.jpg',
 8, 5, 140000.00, 0.403, 15),

(32, 'E020', 'GoPro Hero 12 Black',
 'A GoPro Hero 12 a kalandok kamerája. 5.3K videó, vízálló 10 méterig tok nélkül, beépített GPS és Horizon Lock. Ha síelsz, búvárkodol, bringázol vagy utazol – ez a kamera mindenhova jön veled.',
 './imgs/gopro-hero12.jpg',
 8, 5, 90000.00, 0.154, 20),

(33, 'E021', 'Anker PowerCore 20000 PD 65W',
 'Az Anker PowerCore 20000 az a powerbank, ami laptopot is tölt. 65 W USB-C PD kimenet, 20 000 mAh kapacitás, két USB-A port – egyszerre három eszközt tölthetsz. Utazáshoz, üzleti utakhoz nélkülözhetetlen.',
 './imgs/anker-powercore.jpg',
 6, 5, 18000.00, 0.440, 60),

(34, 'E022', 'Samsung 990 Pro 1TB NVMe SSD',
 'A Samsung 990 Pro a leggyorsabb fogyasztói SSD, amit ma kapni lehet. 7450 MB/s olvasási sebesség PCIe 4.0-val, és Samsung garanciával. Ha a számítógéped lassul, ez az egyik legjobb upgrade.',
 './imgs/samsung-990-pro.jpg',
 6, 5, 35000.00, 0.010, 40),

(35, 'E023', 'TP-Link Archer AX55 WiFi 6 Router',
 'Az Archer AX55 WiFi 6 routerrel a teljes otthon lefedhető gyors és stabil internettel. AX3000 sebesség, 4 antenna, USB 3.0 NAS funkcióval – és beállítása 10 perc alatt megvan a Tether alkalmazással.',
 './imgs/tp-link-ax55.jpg',
 6, 5, 22000.00, 0.305, 25),

(36, 'E024', 'Apple Watch Series 9 (GPS, 45mm)',
 'Az Apple Watch Series 9 a legjobb okosóra iPhone mellé. EKG, vér oxigénszint mérés, Double Tap gesztus, és Always-On kijelző. 18 óra akku, WR50 vízállóság, alumínium ház – naponta viselhető.',
 './imgs/apple-watch-s9.jpg',
 9, 3, 140000.00, 0.039, 22),

(37, 'E025', 'Amazon Echo Dot 5. generáció',
 'Az Echo Dot 5 a legjobb belépő okosotthon eszköz. Alexa segítségével zenét játszhat, okoseszközöket vezérelhet, és kérdésekre válaszolhat – mindezt 7 000 Ft-ért. Beépített hőmérséklet szenzor és jobb hang mint az előző generációban.',
 './imgs/amazon-echo-dot.jpg',
 6, 5, 14000.00, 0.304, 55),

(38, 'T001', 'iPhone 14',
 'Az iPhone 14 az Apple megbízható középkategóriás modellje. A15 Bionic chip, 12 MP dual kamera, és MagSafe töltés. Ha nem kell a Pro, de Apple minőséget akarsz – jó választás.',
 './imgs/iphone-14.jpg',
 2, 1, 130000.00, 0.172, 30),

(39, 'T002', 'Samsung Galaxy S23',
 'A Galaxy S23 a tavalyi csúcstelefon, idei áron. Snapdragon 8 Gen 2, 50 MP kamera, kompakt 6,1 colos méret. Ha nem kell a legújabb, de flagshipet akarsz – ez az okos vásárlás.',
 './imgs/samsung-s23.jpg',
 2, 1, 140000.00, 0.168, 20),

(40, 'T003', 'Dell Inspiron 15',
 'A Dell Inspiron 15 az egyszerű, megbízható mindennapi laptop. Intel Core i5, 8 GB RAM, 512 GB SSD – semmi extra, csak ami kell. Böngészéshez, dokumentumokhoz, videóhívásokhoz tökéletes.',
 './imgs/dell-inspiron-15.jpg',
 3, 2, 120000.00, 1.830, 18),

(41, 'T004', 'HP Pavilion 14',
 'A HP Pavilion 14 kisebb és könnyebb, mint a 15 colos társa. 14 colos micro-edge kijelző, kényelmes billentyűzet, és a HP True Vision kamera videokonferenciákhoz is rendesen teljesít. Táskába is belefér, egész napra elég az akkuja.',
 './imgs/hp-pavilion-14.jpg',
 3, 2, 110000.00, 1.550, 23);

SET FOREIGN_KEY_CHECKS = 1;
