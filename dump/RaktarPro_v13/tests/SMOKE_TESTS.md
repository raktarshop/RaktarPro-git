# Smoke tesztek – checklist

## 1) Belépés / szerepkör
- [ ] Login sikeres (token + rp_user localStorage beáll)
- [ ] Admin user: dropdownban megjelenik az **Admin** menüpont
- [ ] Nem admin: Admin menüpont nem látszik

## 2) Header egységes viselkedés
Minden oldalon: products / product_details / cart / orders / account / admin* oldalak
- [ ] Theme gomb látszik, kattintásra vált (dark/light)
- [ ] Icon váltás működik (moon/sun)
- [ ] Kosár badge frissül (0 → nem látszik, >0 → szám)
- [ ] Dropdown üveges, nem fehér, nem csúszik el

## 3) Product details készlet jelzés
- [ ] stock > 5 → zöld „Készleten”
- [ ] stock 1–5 → narancs „Utolsó darabok!”
- [ ] stock 0 → piros „Nincs készleten”
- [ ] Pontos db szám csak adminnak látszik (Admin meta + badge zárójelben)

## 4) Kosár funkció
- [ ] Kosárba gomb hozzáad 1 db-ot
- [ ] Kosár oldal: mennyiségek módosíthatók
- [ ] Badge érték követi a kosár tartalmát

## 5) Light mode vizuál
- [ ] Háttér neutrális törtfehér (nem pink)
- [ ] Glass dropdown light módban is működik (áttetsző + blur)
