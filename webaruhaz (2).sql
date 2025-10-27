-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:8889
-- Létrehozás ideje: 2025. Okt 27. 09:04
-- Kiszolgáló verziója: 8.0.40
-- PHP verzió: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `webaruhaz`
--

DELIMITER $$
--
-- Eljárások
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `OsszesTermek` ()   BEGIN
  SELECT * FROM termekek;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `TermekekBeszallitoSzerint` (IN `beszallitoId` INT)   BEGIN
  SELECT * FROM termekek
  WHERE beszallito_id = beszallitoId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `TermekekKategoriaAlapjan` (IN `kat_id` INT)   BEGIN
  SELECT * FROM termekek WHERE kategoria_id = kat_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UjKedvenc` (IN `felhasznaloId` INT, IN `termekId` INT)   BEGIN
  -- Ellenőrzés, hogy már létezik-e
  IF (SELECT COUNT(*) FROM kedvencek WHERE felhasznalo_id = felhasznaloId AND termek_id = termekId) = 0 THEN
    INSERT INTO kedvencek (felhasznalo_id, termek_id, letrehozva)
    VALUES (felhasznaloId, termekId, NOW());
  END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UjTermekErtekeles` (IN `p_termek_id` INT, IN `p_felhasznalo_id` INT, IN `p_ertekeles` INT, IN `p_velemeny` TEXT, OUT `p_uj_id` INT)   BEGIN
  DECLARE v_err VARCHAR(255);

  -- Alap validáció
  IF p_ertekeles < 1 OR p_ertekeles > 5 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Értékelésnek 1 és 5 között kell lennie.';
  END IF;

  -- Termék létezik?
  IF (SELECT COUNT(*) FROM termekek WHERE id = p_termek_id) = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A megadott termék nem létezik.';
  END IF;

  -- (Felhasználó létezik?)
  IF p_felhasznalo_id IS NOT NULL AND (SELECT COUNT(*) FROM felhasznalok WHERE id = p_felhasznalo_id) = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A megadott felhasználó nem létezik.';
  END IF;

  INSERT INTO termek_ertekelesek (termek_id, felhasznalo_id, ertekeles, velemeny)
  VALUES (p_termek_id, p_felhasznalo_id, p_ertekeles, p_velemeny);

  SET p_uj_id = LAST_INSERT_ID();
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `beszallitok`
--

CREATE TABLE `beszallitok` (
  `id` int NOT NULL,
  `nev` varchar(255) NOT NULL,
  `kapcsolattarto_nev` varchar(255) DEFAULT NULL,
  `kapcsolattarto_email` varchar(255) DEFAULT NULL,
  `telefon` varchar(50) DEFAULT NULL,
  `cim` text,
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP,
  `modositva` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `beszallitok`
--

INSERT INTO `beszallitok` (`id`, `nev`, `kapcsolattarto_nev`, `kapcsolattarto_email`, `telefon`, `cim`, `letrehozva`, `modositva`) VALUES
(1, 'Tech Kft.', 'Péter Kiss', 'peter@tech.hu', '061111111', 'Budapest', '2025-08-28 17:21:19', NULL),
(2, 'Élelmiszer Bt.', 'Anna Nagy', 'anna@etel.hu', '062222222', 'Debrecen', '2025-08-28 17:21:19', NULL),
(3, 'Ruházat Kft.', 'Béla Molnár', 'bela@ruha.hu', '063333333', 'Szeged', '2025-08-28 17:21:19', NULL),
(4, 'Gép Kft.', 'József Varga', 'jozsef@gep.hu', '064444444', 'Győr', '2025-08-28 17:21:19', NULL),
(5, 'Autó Bt.', 'Ágnes Tóth', 'agnes@auto.hu', '065555555', 'Pécs', '2025-08-28 17:21:19', NULL),
(6, 'Bútor Kft.', 'Gábor Horváth', 'gabor@butor.hu', '066666666', 'Miskolc', '2025-08-28 17:21:19', NULL),
(7, 'Papír Bt.', 'Eszter Fekete', 'eszter@papir.hu', '067777777', 'Nyíregyháza', '2025-08-28 17:21:19', NULL),
(8, 'Konyha Kft.', 'Zoltán Kiss', 'zoltan@konyha.hu', '068888888', 'Szolnok', '2025-08-28 17:21:19', NULL),
(9, 'Sport Bt.', 'László Németh', 'laszlo@sport.hu', '069999999', 'Sopron', '2025-08-28 17:21:19', NULL),
(10, 'Ékszer Bt.', 'János Szabó', 'janos@ekszer.hu', '0610101010', 'Eger', '2025-08-28 17:21:19', NULL),
(11, 'Kert Bt.', 'Krisztina Török', 'krisztina@kert.hu', '0620202020', 'Békéscsaba', '2025-08-28 17:21:19', NULL),
(12, 'Szerszám Bt.', 'Ferenc Balogh', 'ferenc@szerszam.hu', '0630303030', 'Tatabánya', '2025-08-28 17:21:19', NULL),
(13, 'Építő Bt.', 'Veronika Simon', 'veronika@epito.hu', '0640404040', 'Kaposvár', '2025-08-28 17:21:19', NULL),
(14, 'Játék Bt.', 'Imre Bálint', 'imre@jatek.hu', '0650505050', 'Veszprém', '2025-08-28 17:21:19', NULL),
(15, 'Iroda Bt.', 'Beáta Lukács', 'beata@iroda.hu', '0660606060', 'Zalaegerszeg', '2025-08-28 17:21:19', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `teljes_nev` varchar(255) DEFAULT NULL,
  `cegnev` varchar(255) DEFAULT NULL,
  `szerepkor_id` int DEFAULT NULL,
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP,
  `modositva` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `felhasznalok`
--

INSERT INTO `felhasznalok` (`id`, `email`, `jelszo`, `teljes_nev`, `cegnev`, `szerepkor_id`, `letrehozva`, `modositva`) VALUES
(1, 'admin@bolt.hu', 'jelszo1', 'Admin Felhasználó', NULL, 1, '2025-08-28 17:21:19', NULL),
(2, 'vezeto@bolt.hu', 'jelszo2', 'Raktár Vezető', NULL, 2, '2025-08-28 17:21:19', NULL),
(3, 'user@bolt.hu', 'jelszo3', 'Nagy Béla', NULL, 3, '2025-08-28 17:21:19', NULL),
(4, 'penz@bolt.hu', 'jelszo4', 'Pénzügyes Anna', NULL, 4, '2025-08-28 17:21:19', NULL),
(5, 'mark@bolt.hu', 'jelszo5', 'Marketing Márk', NULL, 5, '2025-08-28 17:21:19', NULL),
(6, 'log@bolt.hu', 'jelszo6', 'Logisztikás Lili', NULL, 6, '2025-08-28 17:21:19', NULL),
(7, 'ugyf@bolt.hu', 'jelszo7', 'Ügyfélszolgálat Zoli', NULL, 7, '2025-08-28 17:21:19', NULL),
(8, 'hr@bolt.hu', 'jelszo8', 'HR Emese', NULL, 8, '2025-08-28 17:21:19', NULL),
(9, 'karb@bolt.hu', 'jelszo9', 'Karbantartó Ádám', NULL, 9, '2025-08-28 17:21:19', NULL),
(10, 'elemzo@bolt.hu', 'jelszo10', 'Elemző Éva', NULL, 10, '2025-08-28 17:21:19', NULL),
(11, 'tan@bolt.hu', 'jelszo11', 'Tanácsadó Tomi', NULL, 11, '2025-08-28 17:21:19', NULL),
(12, 'proj@bolt.hu', 'jelszo12', 'Projekt Vera', NULL, 12, '2025-08-28 17:21:19', NULL),
(13, 'minoseg@bolt.hu', 'jelszo13', 'Minőség Misi', NULL, 13, '2025-08-28 17:21:19', NULL),
(14, 'besz@bolt.hu', 'jelszo14', 'Beszerző Betti', NULL, 14, '2025-08-28 17:21:19', NULL),
(15, 'termek@bolt.hu', 'jelszo15', 'Termék Tibor', NULL, 15, '2025-08-28 17:21:19', NULL),
(17, 'mmate06625@gmail.com', '$2y$10$0rb7V4rEqhtvIcGU4kR3l..bRZidcq3I6cxPltTVXyWw3uEFC/TYu', 'Molnar Mate', 'molnar es tarsa', 1, '2025-09-26 11:10:25', '2025-10-17 12:47:02'),
(18, 'mmate2577@gmail.com', '$2y$10$A5Wen0DvvPVtxcC5Sf05Xeh1M9toNNUGpsSctcjS5yQ.yfzSZhWHO', 'Molnar Mate', 'mmate', 3, '2025-10-17 10:12:27', '2025-10-17 10:12:38');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `helyek`
--

CREATE TABLE `helyek` (
  `id` int NOT NULL,
  `raktar_id` int NOT NULL,
  `kod` varchar(100) NOT NULL,
  `leiras` text,
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP,
  `modositva` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `helyek`
--

INSERT INTO `helyek` (`id`, `raktar_id`, `kod`, `leiras`, `letrehozva`, `modositva`) VALUES
(1, 1, 'A1', 'Mobilok polca', '2025-08-28 17:21:19', NULL),
(2, 2, 'A2', 'Laptop szekció', '2025-08-28 17:21:19', NULL),
(3, 3, 'B1', 'Ruhák szekció', '2025-08-28 17:21:19', NULL),
(4, 4, 'B2', 'Sporteszközök', '2025-08-28 17:21:19', NULL),
(5, 5, 'C1', 'Élelmiszerek', '2025-08-28 17:21:19', NULL),
(6, 6, 'C2', 'Italok', '2025-08-28 17:21:19', NULL),
(7, 7, 'D1', 'Játékok', '2025-08-28 17:21:19', NULL),
(8, 8, 'D2', 'Bútor', '2025-08-28 17:21:19', NULL),
(9, 9, 'E1', 'Papíráruk', '2025-08-28 17:21:19', NULL),
(10, 10, 'E2', 'Konyhai eszközök', '2025-08-28 17:21:19', NULL),
(11, 11, 'F1', 'Szerszámok', '2025-08-28 17:21:19', NULL),
(12, 12, 'F2', 'Autóalkatrészek', '2025-08-28 17:21:19', NULL),
(13, 13, 'G1', 'Vegyes', '2025-08-28 17:21:19', NULL),
(14, 14, 'G2', 'Karbantartás', '2025-08-28 17:21:19', NULL),
(15, 15, 'H1', 'Központi kiadás', '2025-08-28 17:21:19', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoriak`
--

CREATE TABLE `kategoriak` (
  `id` int NOT NULL,
  `nev` varchar(255) NOT NULL,
  `szulo_id` int DEFAULT NULL,
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP,
  `modositva` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `kategoriak`
--

INSERT INTO `kategoriak` (`id`, `nev`, `szulo_id`, `letrehozva`, `modositva`) VALUES
(1, 'Elektronika', NULL, '2025-08-28 17:21:19', NULL),
(2, 'Mobil', 1, '2025-08-28 17:21:19', NULL),
(3, 'Laptop', 1, '2025-08-28 17:21:19', NULL),
(4, 'Ruházat', NULL, '2025-08-28 17:21:19', NULL),
(5, 'Férfi ruházat', 4, '2025-08-28 17:21:19', NULL),
(6, 'Női ruházat', 4, '2025-08-28 17:21:19', NULL),
(7, 'Sporteszközök', NULL, '2025-08-28 17:21:19', NULL),
(8, 'Élelmiszer', NULL, '2025-08-28 17:21:19', NULL),
(9, 'Ital', 8, '2025-08-28 17:21:19', NULL),
(10, 'Játék', NULL, '2025-08-28 17:21:19', NULL),
(11, 'Bútor', NULL, '2025-08-28 17:21:19', NULL),
(12, 'Papír', NULL, '2025-08-28 17:21:19', NULL),
(14, 'Szerszám', NULL, '2025-08-28 17:21:19', NULL),
(15, 'Autóalkatrész', NULL, '2025-08-28 17:21:19', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kedvencek`
--

CREATE TABLE `kedvencek` (
  `id` int NOT NULL,
  `felhasznalo_id` int NOT NULL,
  `termek_id` int NOT NULL,
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `kedvencek`
--

INSERT INTO `kedvencek` (`id`, `felhasznalo_id`, `termek_id`, `letrehozva`) VALUES
(1, 14, 7, '2025-09-20 00:00:00'),
(2, 3, 15, '2025-09-15 00:00:00'),
(3, 11, 15, '2025-09-12 00:00:00'),
(4, 13, 6, '2025-09-14 00:00:00'),
(6, 2, 12, '2025-09-02 00:00:00'),
(7, 6, 12, '2025-09-11 00:00:00'),
(8, 1, 1, '2025-09-03 00:00:00'),
(9, 14, 15, '2025-09-02 00:00:00'),
(10, 8, 2, '2025-09-20 00:00:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `keszlet`
--

CREATE TABLE `keszlet` (
  `id` int NOT NULL,
  `termek_id` int NOT NULL,
  `hely_id` int NOT NULL,
  `mennyiseg` int DEFAULT '0',
  `lefoglalt_mennyiseg` int DEFAULT '0',
  `ujrarendelesi_szint` int DEFAULT '0',
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP,
  `modositva` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `keszlet`
--

INSERT INTO `keszlet` (`id`, `termek_id`, `hely_id`, `mennyiseg`, `lefoglalt_mennyiseg`, `ujrarendelesi_szint`, `letrehozva`, `modositva`) VALUES
(1, 1, 1, 50, 5, 10, '2025-08-28 17:21:19', NULL),
(2, 2, 1, 40, 4, 8, '2025-08-28 17:21:19', NULL),
(3, 3, 2, 30, 3, 6, '2025-08-28 17:21:19', NULL),
(4, 4, 2, 25, 2, 5, '2025-08-28 17:21:19', NULL),
(5, 5, 3, 60, 6, 12, '2025-08-28 17:21:19', NULL),
(6, 6, 3, 70, 7, 14, '2025-08-28 17:21:19', NULL),
(7, 7, 4, 35, 3, 7, '2025-08-28 17:21:19', NULL),
(8, 8, 5, 80, 8, 16, '2025-08-28 17:21:19', NULL),
(9, 9, 6, 90, 9, 18, '2025-08-28 17:21:19', NULL),
(10, 10, 7, 20, 2, 4, '2025-08-28 17:21:19', NULL),
(11, 11, 8, 15, 1, 3, '2025-08-28 17:21:19', NULL),
(12, 12, 9, 100, 10, 20, '2025-08-28 17:21:19', NULL),
(14, 14, 11, 120, 12, 24, '2025-08-28 17:21:19', NULL),
(15, 15, 12, 130, 13, 26, '2025-08-28 17:21:19', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kuponok`
--

CREATE TABLE `kuponok` (
  `id` int NOT NULL,
  `kod` varchar(50) NOT NULL,
  `tipus` enum('szazalek','osszeg') DEFAULT 'szazalek',
  `ertek` decimal(10,2) NOT NULL,
  `ervenyes_tol` date DEFAULT NULL,
  `ervenyes_ig` date DEFAULT NULL,
  `aktiv` tinyint(1) DEFAULT '1',
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `kuponok`
--

INSERT INTO `kuponok` (`id`, `kod`, `tipus`, `ertek`, `ervenyes_tol`, `ervenyes_ig`, `aktiv`, `letrehozva`) VALUES
(1, 'KEDVEZMENY1', 'osszeg', 20.26, '2025-09-01', '2025-10-01', 1, '2025-09-01 10:00:00'),
(2, 'KEDVEZMENY2', 'szazalek', 14.30, '2025-09-01', '2025-10-01', 1, '2025-09-01 10:00:00'),
(3, 'KEDVEZMENY3', 'osszeg', 23.07, '2025-09-01', '2025-10-01', 1, '2025-09-01 10:00:00'),
(4, 'KEDVEZMENY4', 'szazalek', 14.02, '2025-09-01', '2025-10-01', 1, '2025-09-01 10:00:00'),
(5, 'KEDVEZMENY5', 'szazalek', 21.82, '2025-09-01', '2025-10-01', 1, '2025-09-01 10:00:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `raktarak`
--

CREATE TABLE `raktarak` (
  `id` int NOT NULL,
  `nev` varchar(255) NOT NULL,
  `cim` text,
  `vezeto_id` int DEFAULT NULL,
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP,
  `modositva` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `raktarak`
--

INSERT INTO `raktarak` (`id`, `nev`, `cim`, `vezeto_id`, `letrehozva`, `modositva`) VALUES
(1, 'Budapest Raktár', 'Budapest, Raktár u. 1', 2, '2025-08-28 17:21:19', NULL),
(2, 'Debrecen Raktár', 'Debrecen, Logisztika tér 4', 2, '2025-08-28 17:21:19', NULL),
(3, 'Szeged Raktár', 'Szeged, Fő u. 3', 2, '2025-08-28 17:21:19', NULL),
(4, 'Győr Raktár', 'Győr, Ipari park 5', 2, '2025-08-28 17:21:19', NULL),
(5, 'Pécs Raktár', 'Pécs, Szállítmány u. 6', 2, '2025-08-28 17:21:19', NULL),
(6, 'Miskolc Raktár', 'Miskolc, Teher u. 7', 2, '2025-08-28 17:21:19', NULL),
(7, 'Sopron Raktár', 'Sopron, Áru tér 2', 2, '2025-08-28 17:21:19', NULL),
(8, 'Veszprém Raktár', 'Veszprém, Csomag u. 8', 2, '2025-08-28 17:21:19', NULL),
(9, 'Kecskemét Raktár', 'Kecskemét, Fő tér 9', 2, '2025-08-28 17:21:19', NULL),
(10, 'Eger Raktár', 'Eger, Központi út 1', 2, '2025-08-28 17:21:19', NULL),
(11, 'Tatabánya Raktár', 'Tatabánya, Árukiadó köz 4', 2, '2025-08-28 17:21:19', NULL),
(12, 'Szolnok Raktár', 'Szolnok, Raktár u. 10', 2, '2025-08-28 17:21:19', NULL),
(13, 'Zalaegerszeg Raktár', 'Zalaegerszeg, Ipari zóna', 2, '2025-08-28 17:21:19', NULL),
(14, 'Kaposvár Raktár', 'Kaposvár, Teher köz 6', 2, '2025-08-28 17:21:19', NULL),
(15, 'Békéscsaba Raktár', 'Békéscsaba, Fő u. 2', 2, '2025-08-28 17:21:19', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `token_hash` char(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `revoked` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_agent` varchar(255) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token_hash`, `expires_at`, `revoked`, `created_at`, `user_agent`, `ip`) VALUES
(1, 17, '4b9a63f9060e9e0e6f5b3a40883648ea292a171c8da0aed888b3e3c890a744a4', '2025-10-31 11:42:29', 0, '2025-10-17 12:42:29', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(2, 17, '1e608186f86f07539c1245896b66355a1501e6e064dc7cd1619649ba31531c2d', '2025-10-31 11:42:48', 0, '2025-10-17 12:42:48', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(3, 17, 'c8188b2417d410969ad71c30fd9b4a12829e0399c054d9ec39ce2ce0401e12a4', '2025-10-31 11:43:01', 0, '2025-10-17 12:43:01', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(4, 17, '19572a9cee0204d0d20c137f739d7c632ca9a3a0af0f708cd96e0fe142969567', '2025-10-31 11:47:02', 0, '2025-10-17 12:47:02', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendelesek`
--

CREATE TABLE `rendelesek` (
  `id` int NOT NULL,
  `felhasznalo_id` int DEFAULT NULL,
  `nev` varchar(120) NOT NULL DEFAULT 'Vásárló',
  `email` varchar(120) NOT NULL DEFAULT '',
  `cim` varchar(255) NOT NULL DEFAULT '',
  `fizetes_mod` varchar(50) NOT NULL DEFAULT 'utanvet',
  `osszeg_brutt` int NOT NULL DEFAULT '0',
  `statusz` varchar(30) NOT NULL DEFAULT 'uj',
  `letrehozva` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `rendelesek`
--

INSERT INTO `rendelesek` (`id`, `felhasznalo_id`, `nev`, `email`, `cim`, `fizetes_mod`, `osszeg_brutt`, `statusz`, `letrehozva`) VALUES
(1, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pécs', 'utanvet', 3798, 'teljesitve', '2025-10-10 10:39:41'),
(2, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pécs', 'utanvet', 799, 'uj', '2025-10-10 10:39:48');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendelesek_app`
--

CREATE TABLE `rendelesek_app` (
  `id` int NOT NULL,
  `felhasznalo_id` int NOT NULL,
  `statusz` enum('uj','fizetve','feldolgozas','kiszallitva','torolve') DEFAULT 'uj',
  `osszeg` decimal(12,2) NOT NULL,
  `letrehozva` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendeles_tetelek_app`
--

CREATE TABLE `rendeles_tetelek_app` (
  `id` int NOT NULL,
  `rendeles_id` int NOT NULL,
  `termek_id` int NOT NULL,
  `mennyiseg` int NOT NULL,
  `egysegar` int NOT NULL,
  `osszeg` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `rendeles_tetelek_app`
--

INSERT INTO `rendeles_tetelek_app` (`id`, `rendeles_id`, `termek_id`, `mennyiseg`, `egysegar`, `osszeg`) VALUES
(1, 1, 12, 1, 799, 799),
(2, 1, 15, 1, 2999, 2999),
(3, 2, 12, 1, 799, 799);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szerepkorok`
--

CREATE TABLE `szerepkorok` (
  `id` int NOT NULL,
  `nev` varchar(100) NOT NULL,
  `leiras` text,
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP,
  `modositva` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `szerepkorok`
--

INSERT INTO `szerepkorok` (`id`, `nev`, `leiras`, `letrehozva`, `modositva`) VALUES
(1, 'admin', 'Teljes hozzáférés az adatbázishoz', '2025-08-28 17:21:19', NULL),
(2, 'raktarvezeto', 'Raktár kezelése és készlet nyomon követése', '2025-08-28 17:21:19', NULL),
(3, 'felhasznalo', 'Általános felhasználó, rendeléseket adhat le', '2025-08-28 17:21:19', NULL),
(4, 'penzugy', 'Számlák kezelése', '2025-08-28 17:21:19', NULL),
(5, 'marketing', 'Marketing feladatok', '2025-08-28 17:21:19', NULL),
(6, 'logisztika', 'Szállítás szervezése', '2025-08-28 17:21:19', NULL),
(7, 'ugyfelszolgalat', 'Vásárlói kapcsolatok kezelése', '2025-08-28 17:21:19', NULL),
(8, 'hr', 'HR adminisztráció', '2025-08-28 17:21:19', NULL),
(9, 'karbantarto', 'Rendszerkarbantartás', '2025-08-28 17:21:19', NULL),
(10, 'elemzo', 'Adat- és teljesítményanalízis', '2025-08-28 17:21:19', NULL),
(11, 'tanacsado', 'Tanácsadás', '2025-08-28 17:21:19', NULL),
(12, 'projektvezeto', 'Projektek koordinálása', '2025-08-28 17:21:19', NULL),
(13, 'minosegellenor', 'Termékellenőrzés', '2025-08-28 17:21:19', NULL),
(14, 'beszerzo', 'Beszerzések kezelése', '2025-08-28 17:21:19', NULL),
(15, 'termekadmin', 'Termékadatok kezelése', '2025-08-28 17:21:19', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek`
--

CREATE TABLE `termekek` (
  `id` int NOT NULL,
  `cikkszam` varchar(100) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `leiras` text,
  `kep_url` varchar(500) DEFAULT NULL,
  `kategoria_id` int DEFAULT NULL,
  `beszallito_id` int DEFAULT NULL,
  `egysegar` decimal(12,2) DEFAULT '0.00',
  `tomeg` decimal(10,3) DEFAULT NULL,
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP,
  `modositva` datetime DEFAULT NULL,
  `keszlet` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `termekek`
--

INSERT INTO `termekek` (`id`, `cikkszam`, `nev`, `leiras`, `kep_url`, `kategoria_id`, `beszallito_id`, `egysegar`, `tomeg`, `letrehozva`, `modositva`, `keszlet`) VALUES
(1, 'T001', 'iPhone 14', 'Okostelefon Apple', 'https://picsum.photos/400?random=1', 2, 1, 399999.00, 0.180, '2025-08-28 17:21:19', NULL, 0),
(2, 'T002', 'Samsung Galaxy', 'Androidos mobil', NULL, 2, 1, 299999.00, 0.170, '2025-08-28 17:21:19', NULL, 0),
(3, 'T003', 'Dell Inspiron', 'Laptop 15\"', '/raktar_pro/uploads/termekek/3_1760010683.jpg', 3, 1, 249999.00, 2.100, '2025-08-28 17:21:19', NULL, 0),
(4, 'T004', 'HP Pavilion', 'Laptop 14\"', NULL, 3, 1, 239999.00, 2.000, '2025-08-28 17:21:19', NULL, 0),
(5, 'T005', 'Férfi póló', 'Fekete, pamut', NULL, 5, 3, 4999.00, 0.250, '2025-08-28 17:21:19', NULL, 0),
(6, 'T006', 'Női póló', 'Fehér, pamut', NULL, 6, 3, 5999.00, 0.240, '2025-08-28 17:21:19', NULL, 0),
(7, 'T007', 'Foci labda', '5-ös méret', NULL, 7, 3, 8999.00, 0.500, '2025-08-28 17:21:19', NULL, 0),
(8, 'T008', 'Tej 1L', 'Friss tej', NULL, 8, 2, 299.00, 1.000, '2025-08-28 17:21:19', NULL, 0),
(9, 'T009', 'Narancslé', '100% gyümölcslé', NULL, 9, 2, 399.00, 1.200, '2025-08-28 17:21:19', NULL, 0),
(10, 'T010', 'Lego Classic', 'Készlet 500db', NULL, 10, 14, 14999.00, 2.000, '2025-08-28 17:21:19', NULL, 0),
(11, 'T011', 'Étkezőasztal', 'Fa, 6 személyes', NULL, 11, 6, 99999.00, 30.000, '2025-08-28 17:21:19', NULL, 0),
(12, 'T012', 'Jegyzetfüzet', 'A5, 100 lap', NULL, 12, 7, 799.00, 0.300, '2025-08-28 17:21:19', NULL, 0),
(14, 'T014', 'Csavarhúzó készlet', '10 db-os', NULL, 14, 13, 5999.00, 2.500, '2025-08-28 17:21:19', NULL, 0),
(15, 'T015', 'Olajszűrő', 'Autóhoz', NULL, 15, 15, 2999.00, 0.700, '2025-08-28 17:21:19', NULL, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termek_ertekelesek`
--

CREATE TABLE `termek_ertekelesek` (
  `id` int NOT NULL,
  `termek_id` int NOT NULL,
  `felhasznalo_id` int DEFAULT NULL,
  `ertekeles` int DEFAULT NULL,
  `velemeny` text,
  `letrehozva` datetime DEFAULT CURRENT_TIMESTAMP
) ;

--
-- A tábla adatainak kiíratása `termek_ertekelesek`
--

INSERT INTO `termek_ertekelesek` (`id`, `termek_id`, `felhasznalo_id`, `ertekeles`, `velemeny`, `letrehozva`) VALUES
(1, 14, 10, 2, 'Nagyon jó!', '2025-09-17 00:00:00'),
(2, 10, 8, 2, 'Nagyon jó!', '2025-09-03 00:00:00'),
(3, 3, 1, 4, 'Megfelelő', '2025-09-16 00:00:00'),
(4, 14, 5, 3, 'Nagyon jó!', '2025-09-12 00:00:00'),
(5, 12, 12, 5, 'Szuper ár-érték arány!', '2025-09-07 00:00:00'),
(6, 10, 5, 2, 'Megfelelő', '2025-09-19 00:00:00'),
(7, 8, 14, 4, 'Szuper ár-érték arány!', '2025-09-03 00:00:00'),
(8, 14, 5, 2, 'Nem ajánlom', '2025-09-04 00:00:00'),
(9, 4, 11, 4, 'Szuper ár-érték arány!', '2025-09-05 00:00:00'),
(10, 8, 4, 2, 'Megfelelő', '2025-09-06 00:00:00');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `beszallitok`
--
ALTER TABLE `beszallitok`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `szerepkor_id` (`szerepkor_id`);

--
-- A tábla indexei `helyek`
--
ALTER TABLE `helyek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `raktar_id` (`raktar_id`);

--
-- A tábla indexei `kategoriak`
--
ALTER TABLE `kategoriak`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `kedvencek`
--
ALTER TABLE `kedvencek`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `felhasznalo_id` (`felhasznalo_id`,`termek_id`),
  ADD KEY `termek_id` (`termek_id`);

--
-- A tábla indexei `keszlet`
--
ALTER TABLE `keszlet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hely_id` (`hely_id`),
  ADD KEY `keszlet_ibfk_1` (`termek_id`);

--
-- A tábla indexei `kuponok`
--
ALTER TABLE `kuponok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kod` (`kod`);

--
-- A tábla indexei `raktarak`
--
ALTER TABLE `raktarak`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vezeto_id` (`vezeto_id`);

--
-- A tábla indexei `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `rendelesek`
--
ALTER TABLE `rendelesek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rend_statusz` (`statusz`),
  ADD KEY `idx_rend_letrehozva` (`letrehozva`),
  ADD KEY `idx_rend_email` (`email`),
  ADD KEY `idx_rend_nev` (`nev`);

--
-- A tábla indexei `rendelesek_app`
--
ALTER TABLE `rendelesek_app`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `rendeles_tetelek_app`
--
ALTER TABLE `rendeles_tetelek_app`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rendeles_id` (`rendeles_id`),
  ADD KEY `termek_id` (`termek_id`);

--
-- A tábla indexei `szerepkorok`
--
ALTER TABLE `szerepkorok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nev` (`nev`);

--
-- A tábla indexei `termekek`
--
ALTER TABLE `termekek`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cikkszam` (`cikkszam`),
  ADD KEY `kategoria_id` (`kategoria_id`),
  ADD KEY `beszallito_id` (`beszallito_id`);

--
-- A tábla indexei `termek_ertekelesek`
--
ALTER TABLE `termek_ertekelesek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `termek_id` (`termek_id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `beszallitok`
--
ALTER TABLE `beszallitok`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT a táblához `helyek`
--
ALTER TABLE `helyek`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `kategoriak`
--
ALTER TABLE `kategoriak`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `kedvencek`
--
ALTER TABLE `kedvencek`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `keszlet`
--
ALTER TABLE `keszlet`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `kuponok`
--
ALTER TABLE `kuponok`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `raktarak`
--
ALTER TABLE `raktarak`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `rendelesek`
--
ALTER TABLE `rendelesek`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `rendelesek_app`
--
ALTER TABLE `rendelesek_app`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `rendeles_tetelek_app`
--
ALTER TABLE `rendeles_tetelek_app`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `szerepkorok`
--
ALTER TABLE `szerepkorok`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `termekek`
--
ALTER TABLE `termekek`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `termek_ertekelesek`
--
ALTER TABLE `termek_ertekelesek`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD CONSTRAINT `felhasznalok_ibfk_1` FOREIGN KEY (`szerepkor_id`) REFERENCES `szerepkorok` (`id`);

--
-- Megkötések a táblához `helyek`
--
ALTER TABLE `helyek`
  ADD CONSTRAINT `helyek_ibfk_1` FOREIGN KEY (`raktar_id`) REFERENCES `raktarak` (`id`);

--
-- Megkötések a táblához `kedvencek`
--
ALTER TABLE `kedvencek`
  ADD CONSTRAINT `kedvencek_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`id`),
  ADD CONSTRAINT `kedvencek_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`);

--
-- Megkötések a táblához `keszlet`
--
ALTER TABLE `keszlet`
  ADD CONSTRAINT `keszlet_ibfk_1` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `keszlet_ibfk_2` FOREIGN KEY (`hely_id`) REFERENCES `helyek` (`id`);

--
-- Megkötések a táblához `raktarak`
--
ALTER TABLE `raktarak`
  ADD CONSTRAINT `raktarak_ibfk_1` FOREIGN KEY (`vezeto_id`) REFERENCES `felhasznalok` (`id`);

--
-- Megkötések a táblához `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `felhasznalok` (`id`);

--
-- Megkötések a táblához `rendeles_tetelek_app`
--
ALTER TABLE `rendeles_tetelek_app`
  ADD CONSTRAINT `rendeles_tetelek_app_ibfk_1` FOREIGN KEY (`rendeles_id`) REFERENCES `rendelesek` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rendeles_tetelek_app_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`);

--
-- Megkötések a táblához `termekek`
--
ALTER TABLE `termekek`
  ADD CONSTRAINT `termekek_ibfk_1` FOREIGN KEY (`kategoria_id`) REFERENCES `kategoriak` (`id`),
  ADD CONSTRAINT `termekek_ibfk_2` FOREIGN KEY (`beszallito_id`) REFERENCES `beszallitok` (`id`);

--
-- Megkötések a táblához `termek_ertekelesek`
--
ALTER TABLE `termek_ertekelesek`
  ADD CONSTRAINT `termek_ertekelesek_ibfk_1` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`),
  ADD CONSTRAINT `termek_ertekelesek_ibfk_2` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
