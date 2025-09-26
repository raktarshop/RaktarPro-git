-- 1. Szerepkörök
CREATE TABLE szerepkorok (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nev VARCHAR(100) NOT NULL UNIQUE,
  leiras TEXT,
  letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP,
  modositva DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO szerepkorok (nev, leiras) VALUES
('admin', 'Teljes hozzáférés az adatbázishoz'),
('raktarvezeto', 'Raktár kezelése és készlet nyomon követése'),
('felhasznalo', 'Általános felhasználó, rendeléseket adhat le'),
('penzugy', 'Számlák kezelése'),
('marketing', 'Marketing feladatok'),
('logisztika', 'Szállítás szervezése'),
('ugyfelszolgalat', 'Vásárlói kapcsolatok kezelése'),
('hr', 'HR adminisztráció'),
('karbantarto', 'Rendszerkarbantartás'),
('elemzo', 'Adat- és teljesítményanalízis'),
('tanacsado', 'Tanácsadás'),
('projektvezeto', 'Projektek koordinálása'),
('minosegellenor', 'Termékellenőrzés'),
('beszerzo', 'Beszerzések kezelése'),
('termekadmin', 'Termékadatok kezelése');

-- 2. Felhasználók
CREATE TABLE felhasznalok (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  jelszo VARCHAR(255) NOT NULL,
  teljes_nev VARCHAR(255),
  szerepkor_id INT,
  letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP,
  modositva DATETIME,
  CONSTRAINT fk_felhasznalo_szerepkor FOREIGN KEY (szerepkor_id) REFERENCES szerepkorok(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO felhasznalok (email, jelszo, teljes_nev, szerepkor_id) VALUES
('admin@bolt.hu','jelszo1','Admin Felhasználó',1),
('vezeto@bolt.hu','jelszo2','Raktár Vezető',2),
('user@bolt.hu','jelszo3','Nagy Béla',3),
('penz@bolt.hu','jelszo4','Pénzügyes Anna',4),
('mark@bolt.hu','jelszo5','Marketing Márk',5),
('log@bolt.hu','jelszo6','Logisztikás Lili',6),
('ugyf@bolt.hu','jelszo7','Ügyfélszolgálat Zoli',7),
('hr@bolt.hu','jelszo8','HR Emese',8),
('karb@bolt.hu','jelszo9','Karbantartó Ádám',9),
('elemzo@bolt.hu','jelszo10','Elemző Éva',10),
('tan@bolt.hu','jelszo11','Tanácsadó Tomi',11),
('proj@bolt.hu','jelszo12','Projekt Vera',12),
('minoseg@bolt.hu','jelszo13','Minőség Misi',13),
('besz@bolt.hu','jelszo14','Beszerző Betti',14),
('termek@bolt.hu','jelszo15','Termék Tibor',15);

-- 3. Beszállítók
CREATE TABLE beszallitok (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nev VARCHAR(255) NOT NULL,
  kapcsolattarto_nev VARCHAR(255),
  kapcsolattarto_email VARCHAR(255),
  telefon VARCHAR(50),
  cim TEXT,
  letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP,
  modositva DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO beszallitok (nev, kapcsolattarto_nev, kapcsolattarto_email, telefon, cim) VALUES
('Tech Kft.', 'Péter Kiss', 'peter@tech.hu', '061111111', 'Budapest'),
('Élelmiszer Bt.', 'Anna Nagy', 'anna@etel.hu', '062222222', 'Debrecen'),
('Ruházat Kft.', 'Béla Molnár', 'bela@ruha.hu', '063333333', 'Szeged'),
('Gép Kft.', 'József Varga', 'jozsef@gep.hu', '064444444', 'Győr'),
('Autó Bt.', 'Ágnes Tóth', 'agnes@auto.hu', '065555555', 'Pécs'),
('Bútor Kft.', 'Gábor Horváth', 'gabor@butor.hu', '066666666', 'Miskolc'),
('Papír Bt.', 'Eszter Fekete', 'eszter@papir.hu', '067777777', 'Nyíregyháza'),
('Konyha Kft.', 'Zoltán Kiss', 'zoltan@konyha.hu', '068888888', 'Szolnok'),
('Sport Bt.', 'László Németh', 'laszlo@sport.hu', '069999999', 'Sopron'),
('Ékszer Bt.', 'János Szabó', 'janos@ekszer.hu', '0610101010', 'Eger'),
('Kert Bt.', 'Krisztina Török', 'krisztina@kert.hu', '0620202020', 'Békéscsaba'),
('Szerszám Bt.', 'Ferenc Balogh', 'ferenc@szerszam.hu', '0630303030', 'Tatabánya'),
('Építő Bt.', 'Veronika Simon', 'veronika@epito.hu', '0640404040', 'Kaposvár'),
('Játék Bt.', 'Imre Bálint', 'imre@jatek.hu', '0650505050', 'Veszprém'),
('Iroda Bt.', 'Beáta Lukács', 'beata@iroda.hu', '0660606060', 'Zalaegerszeg');

-- 4. Kategóriák
CREATE TABLE kategoriak (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nev VARCHAR(255) NOT NULL,
  szulo_id INT,
  letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP,
  modositva DATETIME,
  CONSTRAINT fk_kategoria_szulo FOREIGN KEY (szulo_id) REFERENCES kategoriak(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO kategoriak (nev, szulo_id) VALUES
('Elektronika', NULL),
('Mobil', 1),
('Laptop', 1),
('Ruházat', NULL),
('Férfi ruházat', 4),
('Női ruházat', 4),
('Sporteszközök', NULL),
('Élelmiszer', NULL),
('Ital', 8),
('Játék', NULL),
('Bútor', NULL),
('Papír', NULL),
('Konyha', NULL),
('Szerszám', NULL),
('Autóalkatrész', NULL);

-- 5. Termékek
CREATE TABLE termekek (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nev VARCHAR(255) NOT NULL,
  leiras TEXT,
  ar DECIMAL(10,2) NOT NULL,
  keszlet INT DEFAULT 0,
  kategoria_id INT,
  beszallito_id INT,
  cikkszam VARCHAR(100) UNIQUE,
  letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP,
  modositva DATETIME,
  CONSTRAINT fk_termek_kategoria FOREIGN KEY (kategoria_id) REFERENCES kategoriak(id),
  CONSTRAINT fk_termek_beszallito FOREIGN KEY (beszallito_id) REFERENCES beszallitok(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6. Raktárak
CREATE TABLE raktarak (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nev VARCHAR(255) NOT NULL,
  cim TEXT,
  kapacitas INT,
  vezeto_id INT,
  letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP,
  modositva DATETIME,
  CONSTRAINT fk_raktar_vezeto FOREIGN KEY (vezeto_id) REFERENCES felhasznalok(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 7. Helyek
CREATE TABLE helyek (
  id INT AUTO_INCREMENT PRIMARY KEY,
  raktar_id INT,
  kod VARCHAR(100) NOT NULL,
  leiras TEXT,
  letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP,
  modositva DATETIME,
  CONSTRAINT fk_hely_raktar FOREIGN KEY (raktar_id) REFERENCES raktarak(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 8. Készlet
CREATE TABLE keszlet (
  id INT AUTO_INCREMENT PRIMARY KEY,
  termek_id INT NOT NULL,
  hely_id INT NOT NULL,
  mennyiseg INT NOT NULL,
  letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP,
  modositva DATETIME,
  CONSTRAINT fk_keszlet_termek FOREIGN KEY (termek_id) REFERENCES termekek(id),
  CONSTRAINT fk_keszlet_hely FOREIGN KEY (hely_id) REFERENCES helyek(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 9. Kedvencek
CREATE TABLE kedvencek (
  id INT AUTO_INCREMENT PRIMARY KEY,
  felhasznalo_id INT NOT NULL,
  termek_id INT NOT NULL,
  letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (felhasznalo_id, termek_id),
  CONSTRAINT fk_kedv_felhasznalo FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalok(id),
  CONSTRAINT fk_kedv_termek FOREIGN KEY (termek_id) REFERENCES termekek(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 10. Kuponok
CREATE TABLE kuponok (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kod VARCHAR(50) NOT NULL UNIQUE,
  kedvezmeny_szazalek INT NOT NULL,
  ervenyes_tol DATE,
  ervenyes_ig DATE,
  letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP,
  modositva DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 11. Termék értékelések
CREATE TABLE termek_ertekelesek (
  id INT AUTO_INCREMENT PRIMARY KEY,
  termek_id INT NOT NULL,
  felhasznalo_id INT NOT NULL,
  ertekeles INT NOT NULL CHECK (ertekeles BETWEEN 1 AND 5),
  velemeny TEXT,
  letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ertekeles_termek FOREIGN KEY (termek_id) REFERENCES termekek(id),
  CONSTRAINT fk_ertekeles_felhasznalo FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalok(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
