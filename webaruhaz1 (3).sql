-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:8889
-- Létrehozás ideje: 2026. Jan 16. 08:44
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
-- Adatbázis: `webaruhaz1`
--

DELIMITER $$
--
-- Eljárások
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `recompute_product_stock` (IN `p_product_id` INT)   BEGIN
  UPDATE products p
  SET p.stock = (
    SELECT
      GREATEST(COALESCE(SUM(s.quantity - s.reserved_quantity), 0), 0)
    FROM stock s
    WHERE s.product_id = p_product_id
  )
  WHERE p.id = p_product_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_categories_delete` (IN `p_id` INT)   BEGIN
    DELETE FROM `categories` WHERE `id` = p_id;
    SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_categories_get` (IN `p_id` INT)   BEGIN
    SELECT * FROM `categories` WHERE `id` = p_id LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_categories_get_all` ()   BEGIN
    SELECT * FROM `categories`;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_categories_insert` (IN `p_name` VARCHAR(255), IN `p_parent_id` INT)   BEGIN
    INSERT INTO `categories` (
        `name`, `parent_id`, `created_at`, `updated_at`
    ) VALUES (
        p_name, p_parent_id, NOW(), NOW()
    );
    SELECT LAST_INSERT_ID() AS inserted_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_categories_update` (IN `p_id` INT, IN `p_name` VARCHAR(255), IN `p_parent_id` INT)   BEGIN
    UPDATE `categories`
    SET `name` = p_name, `parent_id` = p_parent_id, `updated_at` = NOW()
    WHERE `id` = p_id;
    SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_coupons_get` (IN `p_id` INT)   BEGIN
    SELECT * FROM `coupons` WHERE `id` = p_id LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_coupons_get_all` ()   BEGIN
    SELECT * FROM `coupons`;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_favorites_delete` (IN `p_id` INT)   BEGIN
    DELETE FROM `favorites` WHERE `id` = p_id;
    SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_favorites_get` (IN `p_id` INT)   BEGIN
    SELECT * FROM `favorites` WHERE `id` = p_id LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_favorites_get_all` ()   BEGIN
    SELECT * FROM `favorites`;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_favorites_insert` (IN `p_user_id` INT, IN `p_product_id` INT)   BEGIN
    INSERT INTO `favorites` (
        `user_id`, `product_id`, `created_at`
    ) VALUES (
        p_user_id, p_product_id, NOW()
    );
    SELECT LAST_INSERT_ID() AS inserted_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_favorites_update` (IN `p_id` INT, IN `p_user_id` INT, IN `p_product_id` INT)   BEGIN
    UPDATE `favorites`
    SET `user_id` = p_user_id, `product_id` = p_product_id
    WHERE `id` = p_id;
    SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_locations_delete` (IN `p_id` INT)   BEGIN
    DELETE FROM `locations` WHERE `id` = p_id;
    SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_locations_get` (IN `p_id` INT)   BEGIN
    SELECT * FROM `locations` WHERE `id` = p_id LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_locations_get_all` ()   BEGIN
    SELECT * FROM `locations`;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_locations_insert` (IN `p_warehouse_id` INT, IN `p_code` VARCHAR(100), IN `p_description` TEXT)   BEGIN
    INSERT INTO `locations` (
        `warehouse_id`, `code`, `description`, `created_at`, `updated_at`
    ) VALUES (
        p_warehouse_id, p_code, p_description, NOW(), NOW()
    );
    SELECT LAST_INSERT_ID() AS inserted_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_locations_update` (IN `p_id` INT, IN `p_warehouse_id` INT, IN `p_code` VARCHAR(100), IN `p_description` TEXT)   BEGIN
    UPDATE `locations`
    SET `warehouse_id` = p_warehouse_id, `code` = p_code, `description` = p_description, `updated_at` = NOW()
    WHERE `id` = p_id;
    SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_stock_delete` (IN `p_id` INT)   BEGIN
    DELETE FROM `stock` WHERE `id` = p_id;
    SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_stock_get` (IN `p_id` INT)   BEGIN
    SELECT * FROM `stock` WHERE `id` = p_id LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_stock_get_all` ()   BEGIN
    SELECT * FROM `stock`;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_stock_insert` (IN `p_product_id` INT, IN `p_location_id` INT, IN `p_quantity` INT, IN `p_reserved_quantity` INT, IN `p_reorder_level` INT)   BEGIN
    INSERT INTO `stock` (
        `product_id`, `location_id`, `quantity`, `reserved_quantity`, `reorder_level`, `created_at`, `updated_at`
    ) VALUES (
        p_product_id, p_location_id, p_quantity, p_reserved_quantity, p_reorder_level, NOW(), NOW()
    );
    SELECT LAST_INSERT_ID() AS inserted_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_stock_update` (IN `p_id` INT, IN `p_product_id` INT, IN `p_location_id` INT, IN `p_quantity` INT, IN `p_reserved_quantity` INT, IN `p_reorder_level` INT)   BEGIN
    UPDATE `stock`
    SET `product_id` = p_product_id, `location_id` = p_location_id, `quantity` = p_quantity, `reserved_quantity` = p_reserved_quantity, `reorder_level` = p_reorder_level, `updated_at` = NOW()
    WHERE `id` = p_id;
    SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_suppliers_delete` (IN `p_id` INT)   BEGIN
    DELETE FROM `suppliers` WHERE `id` = p_id;
    SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_suppliers_get` (IN `p_id` INT)   BEGIN
    SELECT * FROM `suppliers` WHERE `id` = p_id LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_suppliers_get_all` ()   BEGIN
    SELECT * FROM `suppliers`;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_suppliers_insert` (IN `p_name` VARCHAR(255), IN `p_contact_name` VARCHAR(255), IN `p_contact_email` VARCHAR(255), IN `p_phone` VARCHAR(50), IN `p_address` TEXT)   BEGIN
    INSERT INTO `suppliers` (
        `name`, `contact_name`, `contact_email`, `phone`, `address`, `created_at`, `updated_at`
    ) VALUES (
        p_name, p_contact_name, p_contact_email, p_phone, p_address, NOW(), NOW()
    );
    SELECT LAST_INSERT_ID() AS inserted_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_suppliers_update` (IN `p_id` INT, IN `p_name` VARCHAR(255), IN `p_contact_name` VARCHAR(255), IN `p_contact_email` VARCHAR(255), IN `p_phone` VARCHAR(50), IN `p_address` TEXT)   BEGIN
    UPDATE `suppliers`
    SET `name` = p_name, `contact_name` = p_contact_name, `contact_email` = p_contact_email, `phone` = p_phone, `address` = p_address, `updated_at` = NOW()
    WHERE `id` = p_id;
    SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_users_delete` (IN `p_id` INT)   BEGIN
    DELETE FROM `users` WHERE `id` = p_id;
    SELECT ROW_COUNT() AS affected_rows;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_users_get` (IN `p_id` INT)   BEGIN
    SELECT * FROM `users` WHERE `id` = p_id LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_users_get_all` ()   BEGIN
    SELECT * FROM `users`;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_users_insert` (IN `p_email` VARCHAR(255), IN `p_password_hash` VARCHAR(255), IN `p_full_name` VARCHAR(255), IN `p_company_name` VARCHAR(255), IN `p_role_id` INT)   BEGIN
    INSERT INTO `users` (
        `email`, `password_hash`, `full_name`, `company_name`, `role_id`, `created_at`, `updated_at`
    ) VALUES (
        p_email, p_password_hash, p_full_name, p_company_name, p_role_id, NOW(), NOW()
    );
    SELECT LAST_INSERT_ID() AS inserted_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_users_update` (IN `p_id` INT, IN `p_email` VARCHAR(255), IN `p_password_hash` VARCHAR(255), IN `p_full_name` VARCHAR(255), IN `p_company_name` VARCHAR(255), IN `p_role_id` INT)   BEGIN
    UPDATE `users`
    SET `email` = p_email, `password_hash` = p_password_hash, `full_name` = p_full_name, `company_name` = p_company_name, `role_id` = p_role_id, `updated_at` = NOW()
    WHERE `id` = p_id;
    SELECT ROW_COUNT() AS affected_rows;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `app_orders`
--

CREATE TABLE `app_orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('uj','fizetve','feldolgozas','kiszallitva','torolve') DEFAULT 'uj',
  `total_amount` decimal(12,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `app_orders`
--

INSERT INTO `app_orders` (`id`, `user_id`, `status`, `total_amount`, `created_at`) VALUES
(4, 1, 'uj', 1.00, '2025-12-15 09:41:43');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `app_order_items`
--

CREATE TABLE `app_order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` int NOT NULL,
  `total_amount` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `app_order_items`
--

INSERT INTO `app_order_items` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`, `total_amount`) VALUES
(1, 1, 12, 1, 799, 799),
(3, 2, 12, 1, 799, 799),
(4, 3, 15, 3, 2999, 8997),
(6, 4, 15, 3, 2999, 8997),
(7, 4, 16, 3, 3222, 9666),
(8, 5, 15, 1, 2999, 2999),
(9, 5, 16, 1, 3222, 3222),
(10, 6, 15, 1, 2999, 2999),
(11, 7, 16, 3, 3222, 9666),
(12, 8, 16, 5, 3222, 16110),
(13, 9, 7, 1, 8999, 8999),
(14, 9, 12, 1, 799, 799),
(15, 9, 14, 17, 5999, 101983),
(16, 9, 15, 13, 2999, 38987),
(17, 10, 12, 1, 799, 799),
(18, 11, 15, 1, 2999, 2999),
(19, 12, 14, 1, 5999, 5999),
(20, 13, 14, 1, 5999, 5999),
(21, 14, 12, 1, 799, 799),
(22, 15, 6, 2, 5999, 11998),
(23, 15, 12, 2, 799, 1598),
(24, 15, 14, 2, 5999, 11998),
(25, 16, 11, 1, 99999, 99999),
(26, 16, 12, 1, 799, 799),
(27, 16, 14, 2, 5999, 11998),
(28, 16, 15, 4, 2999, 11996),
(29, 17, 1, 1, 399999, 399999),
(30, 17, 12, 1, 799, 799),
(31, 18, 12, 1, 799, 799),
(32, 18, 14, 1, 5999, 5999),
(33, 19, 14, 1, 5999, 5999),
(34, 20, 16, 2, 3222, 6444);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`id`, `name`, `parent_id`, `created_at`, `updated_at`) VALUES
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
(15, 'Autóalkatrész', NULL, '2025-08-28 17:21:19', NULL),
(17, 'kurzus', NULL, '2026-01-13 11:28:46', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `coupons`
--

CREATE TABLE `coupons` (
  `id` int NOT NULL,
  `code` varchar(50) NOT NULL,
  `type` enum('szazalek','total_amount') DEFAULT 'szazalek',
  `value` decimal(10,2) NOT NULL,
  `valid_from` date DEFAULT NULL,
  `valid_to` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `type`, `value`, `valid_from`, `valid_to`, `is_active`, `created_at`) VALUES
(2, 'KEDVEZMENY2', 'szazalek', 14.30, '2025-09-01', '2025-10-01', 1, '2025-09-01 10:00:00'),
(3, 'KEDVEZMENY3', 'total_amount', 23.07, '2025-09-01', '2025-10-01', 1, '2025-09-01 10:00:00'),
(4, 'KEDVEZMENY4', 'szazalek', 14.02, '2025-09-01', '2025-10-01', 1, '2025-09-01 10:00:00'),
(5, 'KEDVEZMENY5', 'szazalek', 21.82, '2025-09-01', '2025-10-01', 1, '2025-09-01 10:00:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `favorites`
--

CREATE TABLE `favorites` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `product_id`, `created_at`) VALUES
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
-- Tábla szerkezet ehhez a táblához `locations`
--

CREATE TABLE `locations` (
  `id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  `code` varchar(100) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `locations`
--

INSERT INTO `locations` (`id`, `warehouse_id`, `code`, `description`, `created_at`, `updated_at`) VALUES
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
-- Tábla szerkezet ehhez a táblához `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `name` varchar(120) NOT NULL DEFAULT 'Vásárló',
  `email` varchar(120) NOT NULL DEFAULT '',
  `address` varchar(255) NOT NULL DEFAULT '',
  `payment_method` varchar(50) NOT NULL DEFAULT 'utanvet',
  `gross_total` int NOT NULL DEFAULT '0',
  `status` varchar(30) NOT NULL DEFAULT 'uj',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `name`, `email`, `address`, `payment_method`, `gross_total`, `status`, `created_at`) VALUES
(1, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pécs', 'utanvet', 3798, 'teljesitve', '2025-10-10 10:39:41'),
(2, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pécs', 'utanvet', 799, 'uj', '2025-10-10 10:39:48'),
(3, NULL, 'Molnar Mate', 'teszt@valami.hu', 'pécs', 'utanvet', 8997, 'uj', '2025-11-07 10:26:02'),
(4, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pécs', 'utanvet', 18663, 'kiszallitva', '2026-01-13 11:21:42'),
(5, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pécs', 'utanvet', 6221, 'uj', '2026-01-13 11:22:47'),
(6, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pécs', 'utanvet', 2999, 'uj', '2026-01-13 11:23:36'),
(7, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pécs', 'utanvet', 9666, 'uj', '2026-01-13 11:29:16'),
(8, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pécs', 'utanvet', 16110, 'uj', '2026-01-13 11:42:41'),
(9, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pécs', 'utanvet', 150768, 'uj', '2026-01-13 13:39:56'),
(10, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pecs', 'utanvet', 799, 'uj', '2026-01-13 13:40:09'),
(11, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pecs', 'utanvet', 2999, 'uj', '2026-01-13 13:41:32'),
(12, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pecs', 'utanvet', 5999, 'uj', '2026-01-13 13:41:47'),
(13, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pecs', 'utanvet', 5999, 'uj', '2026-01-13 13:49:03'),
(14, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pecs', 'utanvet', 799, 'uj', '2026-01-13 16:41:25'),
(15, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pecs', 'utanvet', 25594, 'uj', '2026-01-13 16:52:04'),
(16, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pecs', 'utanvet', 124792, 'uj', '2026-01-13 17:13:36'),
(17, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pecs', 'utanvet', 400798, 'uj', '2026-01-13 17:30:59'),
(18, 18, 'Molnar Mate', 'mmate2577@gmail.com', 'pecs', 'utanvet', 6798, 'uj', '2026-01-14 10:54:51'),
(19, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pecs', 'utanvet', 5999, 'kiszallitva', '2026-01-14 11:09:34'),
(20, 17, 'Molnar Mate', 'mmate06625@gmail.com', 'pecs', 'utanvet', 6444, 'uj', '2026-01-14 12:52:33');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `sku` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `image_url` varchar(500) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  `unit_price` decimal(12,2) DEFAULT '0.00',
  `weight` decimal(10,3) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `products`
--

INSERT INTO `products` (`id`, `sku`, `name`, `description`, `image_url`, `category_id`, `supplier_id`, `unit_price`, `weight`, `created_at`, `updated_at`, `stock`) VALUES
(1, 'T001', 'iPhone 14', 'Okostelefon Apple', NULL, 2, 1, 399999.00, 0.180, '2025-08-28 17:21:19', '2026-01-16 09:33:39', 45),
(2, 'T002', 'Samsung Galaxy', 'Androidos mobil', NULL, 2, 1, 299999.00, 0.170, '2025-08-28 17:21:19', NULL, 36),
(3, 'T003', 'Dell Inspiron', 'Laptop 15\"', NULL, 3, 1, 249999.00, 2.100, '2025-08-28 17:21:19', '2026-01-16 09:33:34', 27),
(4, 'T004', 'HP Pavilion', 'Laptop 14\"', NULL, 3, 1, 239999.00, 2.000, '2025-08-28 17:21:19', NULL, 23),
(5, 'T005', 'Férfi póló', 'Fekete, pamut', NULL, 5, 3, 4999.00, 0.250, '2025-08-28 17:21:19', NULL, 54),
(6, 'T006', 'Női póló', 'Fehér, pamut', NULL, 6, 3, 5999.00, 0.240, '2025-08-28 17:21:19', NULL, 63),
(7, 'T007', 'Foci labda', '5-ös méret', NULL, 7, 3, 8999.00, 0.500, '2025-08-28 17:21:19', NULL, 31),
(8, 'T008', 'Tej 1L', 'Friss tej', NULL, 8, 2, 299.00, 1.000, '2025-08-28 17:21:19', NULL, 72),
(9, 'T009', 'Narancslé', '100% gyümölcslé', NULL, 9, 2, 399.00, 1.200, '2025-08-28 17:21:19', NULL, 81),
(10, 'T010', 'Lego Classic', 'Készlet 500db', NULL, 10, 14, 14999.00, 2.000, '2025-08-28 17:21:19', NULL, 18),
(11, 'T011', 'Étkezőasztal', 'Fa, 6 személyes', NULL, 11, 6, 99999.00, 30.000, '2025-08-28 17:21:19', NULL, 14),
(12, 'T012', 'Jegyzetfüzet', 'A5, 100 lap', NULL, 12, 7, 799.00, 0.300, '2025-08-28 17:21:19', NULL, 88),
(14, 'T014', 'Csavarhúzó készlet', '10 db-os', NULL, 14, 13, 5999.00, 2.500, '2025-08-28 17:21:19', '2026-01-16 09:33:25', 90),
(15, 'T015', 'Olajszűrő', 'Autóhoz', NULL, 15, 15, 2999.00, 0.700, '2025-08-28 17:21:19', '2026-01-13 11:23:36', 103),
(16, '211', 'olaj', 'finomitott', NULL, 3, 3, 3222.00, 0.500, '2025-12-10 11:07:51', '2026-01-16 09:33:29', 122);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `product_reviews`
--

CREATE TABLE `product_reviews` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `review` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `product_reviews`
--

INSERT INTO `product_reviews` (`id`, `product_id`, `user_id`, `rating`, `review`, `created_at`) VALUES
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
(4, 17, '19572a9cee0204d0d20c137f739d7c632ca9a3a0af0f708cd96e0fe142969567', '2025-10-31 11:47:02', 0, '2025-10-17 12:47:02', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(5, 17, '0389bfe67b878ac9617898a9914856ce2b4db79a2cfd531cd275a4c6da573e5c', '2025-11-18 09:58:06', 0, '2025-11-04 09:58:06', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(6, 17, '08a1bae1ad8f85dc62f1481869c2b08c0bae4b90967d15a44a53b568da74ea30', '2025-11-18 09:58:09', 0, '2025-11-04 09:58:09', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(7, 17, '7c8c82c6e1e9d014d8ad886cb364f114d20ee0b0381acb1768b86f44e006bd5d', '2025-11-18 09:58:10', 0, '2025-11-04 09:58:10', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(8, 17, '5e7d272d73083e0d6286129e3f2b9b0f61ef156681ed4f4df0fd557f98fddad6', '2025-11-18 09:58:15', 0, '2025-11-04 09:58:15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(9, 17, '49ac330e595e21b6bf7b3b79cacb93c56de12d112b33015af88a72503066c514', '2025-11-18 09:58:16', 0, '2025-11-04 09:58:16', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(10, 17, 'e46185630ed453b62f9a767d6f1932b93ddc166382e581557d2a20ff071654b3', '2025-11-18 09:58:17', 0, '2025-11-04 09:58:17', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(11, 18, '52b9d697cf333d022fca92c16b75329d9cd8452fed94731acc526c7221d5e37d', '2025-11-18 09:58:20', 0, '2025-11-04 09:58:20', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(12, 17, '48e3bf58c45303a1e82e071e839bb42b2fe7e581cda1c4e5fc611e3d3559e63f', '2025-11-18 09:58:47', 0, '2025-11-04 09:58:47', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(13, 18, '0f80c99099379e3bc0ed47c4518288474a91eafd00691900888f02eee6037d38', '2025-11-18 09:58:48', 0, '2025-11-04 09:58:48', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(14, 17, 'ad63af4d19a1665a3012d60bc68b3c535500c122974679201b4b225f92d22564', '2025-11-18 09:58:57', 0, '2025-11-04 09:58:57', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(15, 18, '754e96f24c98899a9b0d6b146a5e46822fed14f78c1c41395654faf0c01462df', '2025-11-18 09:58:59', 0, '2025-11-04 09:58:59', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(16, 18, '3d8a4076fff6a0b98706ce64aa76862981b1f2d18793a47297b4b83a9fa1c8ff', '2025-11-18 10:00:16', 0, '2025-11-04 10:00:16', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(17, 17, '8796b0d5d2d112f3b31adffd2220d23b357c915d804156b9c339eb60f5bd989b', '2025-11-18 10:00:52', 0, '2025-11-04 10:00:52', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(18, 17, '3b13192b1937965126891f80be651eb3b9104a845db42de319eb922068458462', '2025-11-18 10:01:51', 0, '2025-11-04 10:01:51', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(19, 17, '0391e685bf929c7649eb55b1cc9391f522bc8c79ab8773377cdcb1f3243ff92a', '2025-11-18 10:01:52', 0, '2025-11-04 10:01:52', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(20, 17, '83d14e673635abbf7b235393b584d3c96c72a849322863b3a1e96866b0d0f77e', '2025-11-18 10:02:38', 0, '2025-11-04 10:02:38', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(21, 17, '5617b2fb6df2ef3277f8af1f72de265a351d24d43e76e07c1771e2de84dbc5fc', '2025-11-18 10:03:30', 0, '2025-11-04 10:03:30', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(22, 17, '3a9b110ba165a5738ee4aba31e27a2254aba1c771f66d5152aaf3f3d2325b8ee', '2025-11-18 10:03:59', 0, '2025-11-04 10:03:59', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(23, 17, '1e9a6c3d7a0012fffffdcd7ddddd6178983beb81c15eaa9977b0a399648c9199', '2025-11-18 10:08:14', 0, '2025-11-04 10:08:14', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(24, 17, 'b37d1dbb1af5de32a3103b5a2152a6f3ad7e55abedca19c6467ad5828c61f58b', '2025-11-18 10:08:16', 0, '2025-11-04 10:08:16', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(25, 17, '8441a8776d159b0ed3e48f5afe5d4dcc1ae9916f0eb2271662eeaa022ee6eca3', '2025-11-18 10:08:18', 0, '2025-11-04 10:08:18', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(26, 17, '802cfdd9ebfd7050049bca9e7e76773d4bc9cce2ba079ce2ab7709d817fc1e5a', '2025-11-18 10:08:44', 0, '2025-11-04 10:08:44', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(27, 17, 'eec09eaf54ae012fe0057516f939bdbd466046e19f4d81e9f8af92745e656554', '2025-11-18 10:09:00', 0, '2025-11-04 10:09:00', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(28, 17, '26a9b52b7333bc7b7825ffc28a8e34b2bc4c99fa9b47d9344682da2b2729a9ae', '2025-11-18 10:11:01', 0, '2025-11-04 10:11:01', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(29, 17, 'bfbcf1e044b719123125f5e73aa5a2d629b02ff10b1e8634210af7a84f505bfb', '2025-11-18 10:11:19', 0, '2025-11-04 10:11:19', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(30, 17, 'cfbe9baba5a63e70ae77d67a37c289fb8718d256fcb6cee658a00be9e7f4facc', '2025-11-18 10:11:22', 0, '2025-11-04 10:11:22', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(31, 17, '324a0e9c9bcf78cb7f1d9885cf2344f6fce30df93ca025fa5c604a5e2a763a95', '2025-11-18 10:13:57', 0, '2025-11-04 10:13:57', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(32, 17, '4fd80da626539fc35be0b0015f8d9da334e639eb98368f2d5ceee23b04a0ec4a', '2025-11-18 10:13:58', 0, '2025-11-04 10:13:58', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(33, 17, 'aeeb3d300305042cbea78958e41a264bd9e4a53da9b99935b96c048adc7074e8', '2025-11-18 10:13:58', 0, '2025-11-04 10:13:58', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(34, 17, '247ac448595d1e11c0ae43f1d4e63b1d6a500b1c7c8171e031d26714ee86a5f2', '2025-11-18 10:13:58', 0, '2025-11-04 10:13:58', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(35, 17, '1cd8b34dbacaf6e2fc6c60f2dcf9ef66388d66da5cdc5fa081e1842c41bd1e96', '2025-11-18 10:13:59', 0, '2025-11-04 10:13:59', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(36, 17, '78249e296161c484443c27e22cb9253fd5e3c4f0327254b520a78c62ee88d6fd', '2025-11-18 10:13:59', 0, '2025-11-04 10:13:59', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(37, 17, '1495f3001d19464f5eaae047474021c16a2954e4d6cd4e4f2b1fc042cad014ce', '2025-11-18 10:13:59', 0, '2025-11-04 10:13:59', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(38, 17, 'bf7846b2a63d1f5beeb26f143649c7cf26d7148e4b0ffcbda059d08425dc1bde', '2025-11-18 10:14:15', 0, '2025-11-04 10:14:15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(39, 17, '58c4c70bd2dac887e8a97f82f127a500cf7af90d9006d6e3a6e3538da955f288', '2025-11-18 10:14:15', 0, '2025-11-04 10:14:15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(40, 17, 'ae341dfecc5cc33cab29653c4b4d724b4bdb8e76613e0a840a2da999a1fa0581', '2025-11-18 10:14:15', 0, '2025-11-04 10:14:15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(41, 17, '0c2d057722977e0705cc8de0da0a120c0a5f5167179ca162b082faa887379275', '2025-11-18 10:14:16', 0, '2025-11-04 10:14:16', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(42, 17, '4e849c25b73d67afef67b42beab9862b7cfa4bb3c6b1503676f8017f9418552e', '2025-11-18 10:14:16', 0, '2025-11-04 10:14:16', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(43, 17, '89b3b748ff5d58c40d260cf14f18ad185f3d6f81a8ec77ecb9c0e084f10f11a7', '2025-11-18 10:14:16', 0, '2025-11-04 10:14:16', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(44, 17, 'aa02d0d932f9ffa5f05eae2a016901675486dbd28494f2c4a846cd94bd1287cd', '2025-11-18 10:14:16', 0, '2025-11-04 10:14:16', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(45, 17, '058708adc2b0409c6e88222fed049a05d71a05b89a4a0b4e2998c8888539ca08', '2025-11-18 10:14:16', 0, '2025-11-04 10:14:16', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(46, 17, 'e12b4721c4850c61efaff883c90f33bdf5e4b5cc0fd6a8f56d0afbf498c2ad70', '2025-11-18 10:14:17', 0, '2025-11-04 10:14:17', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(47, 17, 'e329dad6d2b93f3c760570ecd6ecace0e975f243dc13af3af5ed2cdf4d34b48b', '2025-11-18 10:17:54', 0, '2025-11-04 10:17:54', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(48, 17, 'be2d567fd2e4cf8daea6b5d58da34f5bfd867eb17c832ebd6171e7137aac3be3', '2025-11-18 10:17:55', 0, '2025-11-04 10:17:55', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(49, 17, '1ca238e44e188e4611139be2f292a6ec3688993b7b19aba85d161c39c63a734f', '2025-11-18 10:17:55', 0, '2025-11-04 10:17:55', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(50, 18, '4c3a8b1206e7ffc68b39daa9b653d977ca0cedb12e90fdd76007e850b60418e6', '2025-11-18 10:18:11', 0, '2025-11-04 10:18:11', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(51, 18, '5bb11ba6aca6f7f6d36fc7ee1a10a0bc8366a36b1575f2b6b21da552c88175fd', '2025-11-18 10:18:14', 0, '2025-11-04 10:18:14', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(52, 18, '6dcaf2c616a3d772ba984468e370045022a249e7e44e1f79e94da116aae306bf', '2025-11-18 10:18:14', 0, '2025-11-04 10:18:14', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(53, 17, 'ca528c2bb1d9f3f4f47b288e2b1116848014a2d42f4297367b70598f9dcecfd2', '2025-11-18 10:19:05', 0, '2025-11-04 10:19:05', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(54, 18, '474afe1a5f44ae17954e70c203e4be7c6c8120f4cd090e4fc0e634a1838195b1', '2025-11-18 10:19:06', 0, '2025-11-04 10:19:06', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(55, 18, '4d776f2216fe25d022f06446077b0a156b92b29de28d840bcdf1fd2be77afac5', '2025-11-18 10:19:14', 0, '2025-11-04 10:19:14', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(56, 17, 'cabfe6736eef394b995494b24c3d8dc4560d309b9b846efe5b7b71415e8a20a2', '2025-11-18 10:24:21', 0, '2025-11-04 10:24:21', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(57, 17, '0232a21950053a06b16d00261806b366ca529c1cc3292e57642e59daf79619bb', '2025-11-18 10:24:48', 0, '2025-11-04 10:24:48', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(58, 17, '7eca9454c01212e1b7a7e4ab694ad1181586c13c489c16917198f03e68b2cf55', '2025-11-18 10:24:49', 0, '2025-11-04 10:24:49', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(59, 17, 'ddad0aefeb3e8bab6ec8926cdd8e5313c987af0866a0a54bdfbede4e6b396e73', '2025-11-18 10:24:49', 0, '2025-11-04 10:24:49', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(60, 17, '4d15f67e41440fe6129ef7818d2e2c1b9ac08a5a1b4850d8c1fe01eece0ee9a6', '2025-11-18 10:24:50', 0, '2025-11-04 10:24:50', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(61, 17, '4ac0ba13d1ae63f563cef2883f35344f9840007f76fab4b1639be0f7ba7e37fe', '2025-11-18 10:24:51', 0, '2025-11-04 10:24:51', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(62, 17, '66da7d178a0aab23867dba7e9b5498e55dfe96f1bb9f7fe208d600f413fae89a', '2025-11-18 10:24:52', 0, '2025-11-04 10:24:52', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(63, 17, '036eecd3c6aa686fe3d031a86ab3580d3f44e093ae53185a5ff25702f4a70f76', '2025-11-18 11:32:58', 0, '2025-11-04 11:32:58', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(64, 17, '01d06f476b170723832442751bca243aa0603c88790d14475a9a2637c69418ab', '2025-11-18 11:32:58', 0, '2025-11-04 11:32:58', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(65, 17, 'd5b0dfac3050d42e553757ca8dc99514e707d6d53282e0e098323928e96edd10', '2025-11-18 11:32:59', 0, '2025-11-04 11:32:59', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(66, 17, '783f60066da30a77f7ba38a5fc5e8c268e7a7b26b8f6d229d3c19d809fbb6589', '2025-11-18 11:33:25', 0, '2025-11-04 11:33:25', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(67, 17, '5531f5646223f1932f0b6201974bb2b0eef64a18d55c0ed516eabfe7b765b152', '2025-11-18 11:33:26', 0, '2025-11-04 11:33:26', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(68, 17, 'cb61369d6fc9e49f146c3af731063241f028303bf07acd9ee4c0390c891e7c49', '2025-11-18 11:33:27', 0, '2025-11-04 11:33:27', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(69, 17, 'd155ab77479f1d3dc9713b6259af32b1aa47cd104454a091da6330d197228084', '2025-11-18 11:33:28', 0, '2025-11-04 11:33:28', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(70, 17, 'c3e9108ab038886a95937a18029601c7194d7e2b094317d2952442b18bf1897f', '2025-11-18 11:33:28', 0, '2025-11-04 11:33:28', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(71, 17, '958f77844adffbf7b366df7e10d8296959415f1821cf6d64b6d965d63759a6d0', '2025-11-18 11:33:28', 0, '2025-11-04 11:33:28', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(72, 17, 'a3004bd6bc38f5e52bb9e449923881c9a7676abcb5dcc16b1313928d717adac8', '2025-11-18 11:33:29', 0, '2025-11-04 11:33:29', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(73, 17, '76dbb4bf97819204b47ccfd8bde46c26301104e1d3a8273a57a929e1e63212c9', '2025-11-18 11:33:29', 0, '2025-11-04 11:33:29', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(74, 17, '9c9b2256c5ab8148d9fc82817748907aac1dc7d92409b6467d76ec1760c69c90', '2025-11-18 12:55:16', 0, '2025-11-04 12:55:16', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(75, 17, '12c7a549fd4a5acb901abe3fa07e87b40d4d5aa38350e46b72c82e4d5275caa7', '2025-11-18 12:55:17', 0, '2025-11-04 12:55:17', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(76, 17, 'ddb9a8adbe9573b977fe71383b1550ed345cc3ace4c82840f4ee3390c3816e11', '2025-11-18 12:55:18', 0, '2025-11-04 12:55:18', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(77, 17, '53fbcef56cab3757a632c85e1c3ee5a4b64c79bf68a8d5990b92edbf7b0d5eca', '2025-11-18 12:57:07', 0, '2025-11-04 12:57:07', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(78, 17, '0ff348b507540d9b1c6458fa5751225850f6d2c1ac6bb059d7ca241e730582ea', '2025-11-18 13:04:52', 0, '2025-11-04 13:04:52', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(79, 17, 'ccad1967675f13c2487632f9303e1955bdff8793755ba19d41f780390459afb6', '2025-11-18 13:04:53', 0, '2025-11-04 13:04:53', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(80, 17, '7813d838107a191d15d4b664c3a78e4b5b8b7bf537fe1d033f6ec3ff857388db', '2025-11-18 13:04:53', 0, '2025-11-04 13:04:53', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(81, 17, '96bc6c62ef946999082c311df615d08cae495216ba266e57bc2280836e6b7062', '2025-11-18 13:04:54', 0, '2025-11-04 13:04:54', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(82, 17, '6f8ae8c3880af7351f4db4abc80fd6dfb6bfd5d381b274023438cc4b2fcd941a', '2025-11-18 13:05:03', 0, '2025-11-04 13:05:03', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(83, 17, '99e5e0cece3bee24c826211c9af274c8e9d17f3671fd6e06d8581aa6f3dbd6b9', '2025-11-18 13:05:12', 0, '2025-11-04 13:05:12', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(84, 17, '61afd089fde51a3eae529db1dbe937fc2efb03654e57b4fb4327070fa5b78826', '2025-11-18 13:05:17', 0, '2025-11-04 13:05:17', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(85, 17, '6ad740dd59281ee33395cb9d1a65ce66639360c4e88457cb7d72ac7ff64543a6', '2025-11-18 13:12:15', 0, '2025-11-04 13:12:15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(86, 17, 'e28763d044d74fe35a2b52a66035f5e7bab929ded3f61352b1e3964171c7bf59', '2025-11-18 13:16:56', 0, '2025-11-04 13:16:56', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(87, 17, '60cd1299ccc3455b8551f2869e60cc89d345ddc3acbc15f9aebed2704baee472', '2025-11-18 13:18:30', 0, '2025-11-04 13:18:30', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(88, 17, 'd3a00890426cd4bb69232643c20e5e58985995440d3127bd5d1b02e2cffb2b5d', '2025-11-18 13:18:51', 0, '2025-11-04 13:18:51', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(89, 17, 'e795443b2fe4c2f63144424a8515e816df72fb6fba6e52aabde4841363837122', '2025-11-18 13:18:57', 0, '2025-11-04 13:18:57', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(90, 17, 'ca96ea7253715bc68ab9e6aa8b670dbc44beced6a42e5570c2034a7140529a30', '2025-11-18 13:27:20', 0, '2025-11-04 13:27:20', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(91, 17, '2d0a21fb9ee91916c0604570cdfe7e5c76004713da77682d1aff0e8db45123f2', '2025-11-18 13:27:34', 0, '2025-11-04 13:27:34', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(92, 17, '6594284f59b9b05d2a0ba624a1268412c83661b99f85a63420123cca82d65fdd', '2025-11-18 13:28:23', 0, '2025-11-04 13:28:23', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(93, 17, 'e4c8d478185a0d47505cd876a158abc16a8299b53c38604d1ea2f93d4c10b65b', '2025-11-18 13:30:35', 0, '2025-11-04 13:30:35', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(94, 17, 'd6538038ced8f5478b6607ef9b5113a9a51486e0828d81e41fc8ac30c2a581c4', '2025-11-18 13:31:15', 0, '2025-11-04 13:31:15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(95, 17, '1bf301b961393ad9c6ea24aaf1387ce5b2716874a5d058160b988491ee1e224f', '2025-11-18 13:31:27', 0, '2025-11-04 13:31:27', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(96, 17, 'cce5442009f17f2ddc109148ccec67ea311c06b58103eada76fbadffc74ec7e7', '2025-11-18 13:34:15', 0, '2025-11-04 13:34:15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(97, 17, '7dadc23ec10450a8fe68948509373e3b3fd4e4aae83e7afd6d7e414bd11e9998', '2025-11-18 13:34:35', 0, '2025-11-04 13:34:35', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(98, 17, '8830689873db11b5c27dad876cf3f3268f851c40132c31f5797d0fc1849e9bd2', '2025-11-18 13:34:39', 0, '2025-11-04 13:34:39', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(99, 17, '8685b7679d462a2675da1ba8637402f8dabf4f7d520a5442ae4bfc10f1cb7acb', '2025-11-18 13:34:44', 0, '2025-11-04 13:34:44', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(100, 17, '71b14cd6cf54afe887375f3aa982aa98798e7ea82854ec547bbf9ed425a46575', '2025-11-18 13:35:46', 0, '2025-11-04 13:35:46', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(101, 17, '76763eb1b4ff2049098a0b5aeca3f05bc0e1d475128a1b619924d85e28f8fcb7', '2025-11-18 13:50:16', 0, '2025-11-04 13:50:16', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(102, 17, 'ed87cd70035e401a966fce4b10c1b4c2d0d141255ef163cfefe52a2912dfde69', '2025-11-18 13:54:10', 0, '2025-11-04 13:54:10', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(103, 17, '98f4744f66f11b2c4cf4cbdc5aaa95256b260961f0fdbe7919e20bf239fb079d', '2025-11-18 20:11:08', 0, '2025-11-04 20:11:08', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(104, 17, '7ffe56c3128531fb3974c4c4a3d55aa99b705c89262e96574254f4fe2c564281', '2025-11-18 20:11:18', 0, '2025-11-04 20:11:18', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(105, 17, '3569b82d8bd56957e3a978d7d2f67e7a1168d1d99aacacc28ad5a4ceeb14cf25', '2025-11-18 20:14:57', 0, '2025-11-04 20:14:57', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(106, 17, '39d93e38cb9e16fe1fb5c6031b80f23aa3114cad7e2e5a2b8af05bb33d74ce6b', '2025-11-18 20:16:19', 0, '2025-11-04 20:16:19', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(107, 17, '977b3f625b65706e355b2562b420be1ef44ca648f54191e60a44355926fd9dcf', '2025-11-18 20:17:08', 0, '2025-11-04 20:17:08', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(108, 17, '76dfdd08f3a26037da613894cfcb947b391e5ef71a960f48e6665fdb231aaf3c', '2025-11-18 20:18:44', 0, '2025-11-04 20:18:44', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(109, 17, 'dc09cb63502923cbd06dcd76c87a21b44b8c921f75ef8e060127f188b692f088', '2025-11-18 20:20:22', 0, '2025-11-04 20:20:22', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(110, 17, '043aa0766632cd9493aa3e115094566e91f677548034c4fefabeedeb6fd583e9', '2025-11-18 20:20:50', 0, '2025-11-04 20:20:50', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(111, 17, '81354c77d6825048f9b5254136a3c4c1b5622f482fb06e629488e59c48dfd9a6', '2025-11-18 20:20:56', 0, '2025-11-04 20:20:56', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(112, 17, '1e708e710732bd3a46647f4d7dacf16bddeae30293027efad088a8d6b1261088', '2025-11-18 20:26:02', 0, '2025-11-04 20:26:02', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(113, 17, '32b946114a38890076e588077c5a60b95363a4e30c6e147a978c876496b5a96f', '2025-11-18 20:32:33', 0, '2025-11-04 20:32:33', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(114, 17, '3922b775cb4fb661fba0d12a33991d9d8181504370d858cdccc71d3e92b16b1d', '2025-11-18 20:32:54', 0, '2025-11-04 20:32:54', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(115, 17, 'c275c55baa881af192ec9fc48a04d725093ee88bc698db63a17be16ee48069a9', '2025-11-18 20:33:10', 0, '2025-11-04 20:33:10', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(116, 17, 'aa4467edf1510762e729859f5695a3381afc6453c47478e79b225beb3b82caa9', '2025-11-18 20:40:34', 0, '2025-11-04 20:40:34', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(117, 17, '878c2b6188ba61e698837d065fa67b07230123ebc0de48fea3691900b91e3271', '2025-11-18 20:40:38', 0, '2025-11-04 20:40:38', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(118, 17, 'ae40823c3d35d46571c02dc48c4b320abbb23e016b1c689633b14c8db6fce20d', '2025-11-18 20:44:48', 0, '2025-11-04 20:44:48', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(119, 17, 'dc10ae7fc425498438c16f10a8452938e57afb5c33b49c96d2bd388c0b3c4569', '2025-11-18 20:44:58', 0, '2025-11-04 20:44:58', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(120, 17, '141b5efd2d4fd18f4e37c7df77f732f166a8b69626db959b2dbe2f8c1cf33277', '2025-11-18 20:47:33', 0, '2025-11-04 20:47:33', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(121, 17, '8328e11f5d64e6cc5455e137e36d915725f6d3035e803c8202e9d2df490d2e8d', '2025-11-18 20:50:18', 0, '2025-11-04 20:50:18', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(122, 17, 'f0b709997ba6a5f2c7c81e3ddf8c1ddb0facf926244dd5f3a98d61d33b8bfc4b', '2025-11-18 20:50:28', 0, '2025-11-04 20:50:28', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(123, 17, '96263d81e6019bc6204db8659324f253b5086aa6663eae8ddecaf37a23a09967', '2025-11-21 09:22:05', 0, '2025-11-07 09:22:05', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(124, 17, '11d4b2891e50d05aa5182881b64fc675c6c8e1299fc17ad3134ce114af9a3b5b', '2025-11-21 09:28:07', 0, '2025-11-07 09:28:07', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(125, 19, 'dec96e4b92c9334f2acf1684d04b668b36104dc8e3d17bfaf7fcd12d83bcb549', '2025-11-21 09:34:01', 0, '2025-11-07 09:34:01', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(126, 17, '1093abc26886a92a13e1200cbcbd5de73c846ee42bcecb6371374513aaaa5429', '2025-11-21 09:45:24', 0, '2025-11-07 09:45:24', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(127, 17, 'c34938e73186eb670469ba832bd2a0916118466a17a5a6790ca81f3e228ae9b3', '2025-11-21 09:47:28', 0, '2025-11-07 09:47:28', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(128, 17, 'deee23027c147f906dbdedf17225eed19189aff29138c2c0ce3c0bac458ba522', '2025-11-21 09:54:42', 0, '2025-11-07 09:54:42', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(129, 17, 'c0b1a788374197dbfc3e4230fdde8a5dc7ec67d0ece4a2a1e07fbc09cb790355', '2025-11-21 10:11:33', 0, '2025-11-07 10:11:33', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(130, 17, 'a5ea18d2e21ed2c0e1c30221a55a4554ed1976b85b9d0bcdbf97e68dafa7bc10', '2025-11-21 10:14:39', 0, '2025-11-07 10:14:39', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(131, 20, '05e5366eafea44a024cac7cae21c6fc7ff0bbcd1c4910943082e3d87ac70e734', '2025-11-21 10:15:17', 0, '2025-11-07 10:15:17', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(132, 20, '36fc11fad1beb2c5fd0b4684936ef2cb9c9e6ba3be4c8d241a3976d6f6ec511a', '2025-11-21 10:20:21', 0, '2025-11-07 10:20:21', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(133, 17, '6e8163b8aa9913310a37aa635b6243f2390e6e7953e353f6ab70c06360e544b5', '2025-11-21 10:22:01', 0, '2025-11-07 10:22:01', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(134, 20, '81ceabb3d528e4cbc9c3cc7128b06b0c6d8a3a53e27941056e61d0f296b3d802', '2025-11-21 10:22:17', 0, '2025-11-07 10:22:17', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(135, 17, '4f6beca1ef79fbc7e05a2a3572e4b7de02308a292a7035034abe54ed963d7107', '2025-11-21 10:22:47', 0, '2025-11-07 10:22:47', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(136, 17, 'ad0cd92ad142138dd0e9a712d5bc8e19f84245b359f662036523b08e5436253b', '2025-11-21 10:24:30', 0, '2025-11-07 10:24:30', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(137, 17, 'e2ea332353366eb870450309b9306b4a1a6b3e1d5e18fff6694faa5b563110e3', '2025-11-21 11:12:22', 0, '2025-11-07 11:12:22', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(138, 18, '170e4766f4f234f8421f2db7e8647ae0917fbdf788adf19b9c7f4df9aec5df4a', '2025-11-21 11:12:30', 0, '2025-11-07 11:12:30', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(139, 17, 'f52f30886f29e13cbea57a755651b81a3e3d5fb0b42c12dc43558abb495f991f', '2025-11-21 11:14:39', 0, '2025-11-07 11:14:39', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(140, 17, '5784235b9d92a95a38ca45cb098c6d5039847c799e3ea4d882f111e8e8c9f3d1', '2025-11-21 12:56:11', 0, '2025-11-07 12:56:11', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(141, 17, 'fdd89068b7d6ead3ef57d15d7bf1345b53f30f61efe85685fbf1bc3d447250cf', '2025-11-21 12:56:29', 0, '2025-11-07 12:56:29', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(142, 17, '313bc0901d29b0090e9a96c165769e6091fcefa551f098cfc93cd8f9fcc5b3fb', '2025-11-25 09:49:16', 0, '2025-11-11 09:49:16', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(143, 18, '61bc378747a862fbc3d3dc94edc6e23596cb153ca7a545f7cfa9776bea298887', '2025-11-25 09:51:59', 0, '2025-11-11 09:51:59', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(144, 17, '98da6c481c1133d44be74aa7d4f399479965514714d594c5d9adedb1be72f1d8', '2025-11-25 09:52:29', 0, '2025-11-11 09:52:29', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(145, 17, 'dd56033b233482b877987e7a9e542db866123c4d410fe75aee7953e7edc7576a', '2025-11-25 09:55:26', 0, '2025-11-11 09:55:26', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1'),
(146, 17, 'eaa83b92494cc5685b5fc72942fdee3e10c7ba63e39bbd97d2838909d09873e0', '2025-12-01 09:51:08', 0, '2025-11-17 09:51:08', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1'),
(147, 17, '15e163877d913215a00f29ffc1727215e3bbcd2fe8c9ef0fbc281254abbfd640', '2025-12-05 09:58:14', 0, '2025-11-21 09:58:14', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1'),
(148, 17, 'e31c16ee718bd4fe8a0d21f41e85478bf96b8c4efd82248ec26921472ac9db7a', '2025-12-07 14:57:43', 0, '2025-11-23 14:57:43', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1'),
(149, 17, '1ce199915791564f93e389bbcac8dffdec92a4d994bac6907af57cdd90e0139d', '2025-12-07 14:58:13', 0, '2025-11-23 14:58:13', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '::1'),
(150, 17, '7df07303198b745fd4620aaec9d73959c31bc0ed1ccfdab32f5e91442fbf9a3d', '2025-12-24 10:55:36', 0, '2025-12-10 10:55:36', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '::1'),
(151, 17, 'c1067335f4a6dbbaaa7b84e80941a8d09c0cf1dc4880814273651f4f5abbd3f2', '2026-01-27 10:30:27', 0, '2026-01-13 10:30:27', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '::1'),
(152, 17, '680592c92f717bb22ec6a5df544b0a8a71dd58bcf41a42082a72d957edc69ab1', '2026-01-27 10:43:06', 0, '2026-01-13 10:43:06', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '::1'),
(153, 17, 'a42e69925fe3607247be8ef5209959d28e8b222e07c13c38107161678da9779c', '2026-01-27 16:41:13', 0, '2026-01-13 16:41:13', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '::1'),
(154, 17, 'afa19cf5d4ab7a3ae018158cdc7a9e7c1a5e72109dc8f31bd376fb32e909c6f3', '2026-01-28 10:48:10', 0, '2026-01-14 10:48:10', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '::1'),
(155, 17, '7c3d71129bde16df5bed7fea6a8f16d1ed2a8989d6fa020fe4dfbf49ce908c73', '2026-01-28 10:54:13', 0, '2026-01-14 10:54:13', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '::1'),
(156, 17, '81ee4e01ad5a136c03efd8b9cc3b8ba482b66085bff465e3b44f7373b1458dcc', '2026-01-28 10:54:19', 0, '2026-01-14 10:54:19', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '::1'),
(157, 18, 'aa7b1677e5dfaaeb05cfe95cfd7a168e087f198f7dd9c852003b15c41bb8cca5', '2026-01-28 10:54:30', 0, '2026-01-14 10:54:30', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '::1'),
(158, 17, '30563d787c2175e951cf394a731cfade0f9a39f2e2befbe7870dc40e6058ea57', '2026-01-28 10:56:19', 0, '2026-01-14 10:56:19', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '::1'),
(159, 17, '4125fd9baa15af91e426accf8127aa49a3544a5b2aa5d711fb353e3698417ba5', '2026-01-29 10:20:22', 0, '2026-01-15 10:20:22', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '::1'),
(160, 17, '0040e05703ed0b4056dc27c7780b161e26db75df1c9c526259e914729db629fa', '2026-01-30 09:28:42', 0, '2026-01-16 09:28:42', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '::1');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
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
-- Tábla szerkezet ehhez a táblához `stock`
--

CREATE TABLE `stock` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `location_id` int NOT NULL,
  `quantity` int DEFAULT '0',
  `reserved_quantity` int DEFAULT '0',
  `reorder_level` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `stock`
--

INSERT INTO `stock` (`id`, `product_id`, `location_id`, `quantity`, `reserved_quantity`, `reorder_level`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 49, 5, 10, '2025-08-28 17:21:19', '2026-01-13 17:30:59'),
(2, 2, 1, 40, 4, 8, '2025-08-28 17:21:19', NULL),
(3, 3, 2, 30, 3, 6, '2025-08-28 17:21:19', NULL),
(4, 4, 2, 25, 2, 5, '2025-08-28 17:21:19', NULL),
(5, 5, 3, 60, 6, 12, '2025-08-28 17:21:19', NULL),
(6, 6, 3, 68, 7, 14, '2025-08-28 17:21:19', '2026-01-13 16:52:04'),
(7, 7, 4, 34, 3, 7, '2025-08-28 17:21:19', '2026-01-13 13:39:56'),
(8, 8, 5, 80, 8, 16, '2025-08-28 17:21:19', NULL),
(9, 9, 6, 90, 9, 18, '2025-08-28 17:21:19', NULL),
(10, 10, 7, 20, 2, 4, '2025-08-28 17:21:19', NULL),
(11, 11, 8, 14, 1, 3, '2025-08-28 17:21:19', '2026-01-13 17:13:36'),
(12, 12, 9, 92, 10, 20, '2025-08-28 17:21:19', '2026-01-14 10:54:51'),
(14, 14, 11, 97, 12, 24, '2025-08-28 17:21:19', '2026-01-13 17:13:36'),
(15, 15, 12, 112, 13, 26, '2025-08-28 17:21:19', '2026-01-13 17:13:36'),
(16, 1, 9, 45, 10, 0, '2026-01-13 17:30:16', NULL),
(17, 2, 9, 36, 0, 0, '2026-01-13 17:30:16', NULL),
(18, 3, 9, 27, 0, 0, '2026-01-13 17:30:16', NULL),
(19, 4, 9, 23, 0, 0, '2026-01-13 17:30:16', NULL),
(20, 5, 9, 54, 0, 0, '2026-01-13 17:30:16', NULL),
(21, 6, 9, 63, 0, 0, '2026-01-13 17:30:16', NULL),
(22, 7, 9, 31, 0, 0, '2026-01-13 17:30:16', NULL),
(23, 8, 9, 72, 0, 0, '2026-01-13 17:30:16', NULL),
(24, 9, 9, 81, 0, 0, '2026-01-13 17:30:16', NULL),
(25, 10, 9, 18, 0, 0, '2026-01-13 17:30:16', NULL),
(26, 11, 9, 14, 0, 0, '2026-01-13 17:30:16', NULL),
(27, 14, 9, 88, 0, 0, '2026-01-13 17:30:16', '2026-01-14 11:09:34'),
(28, 15, 9, 103, 0, 0, '2026-01-13 17:30:16', NULL),
(29, 16, 9, 104, 10, 0, '2026-01-13 17:30:16', '2026-01-14 12:52:33');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `contact_name`, `contact_email`, `phone`, `address`, `created_at`, `updated_at`) VALUES
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
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `company_name`, `role_id`, `created_at`, `updated_at`) VALUES
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
(11, 'mmate', 'asd', 'Molnár Máté', 'asd', 1, '2025-08-28 17:21:19', '2026-01-12 11:09:54'),
(12, 'proj@bolt.hu', 'jelszo12', 'Projekt Vera', NULL, 12, '2025-08-28 17:21:19', NULL),
(13, 'minoseg@bolt.hu', 'jelszo13', 'Minőség Misi', NULL, 13, '2025-08-28 17:21:19', NULL),
(14, 'besz@bolt.hu', 'jelszo14', 'Beszerző Betti', NULL, 14, '2025-08-28 17:21:19', NULL),
(15, 'termek@bolt.hu', 'jelszo15', 'Termék Tibor', NULL, 15, '2025-08-28 17:21:19', NULL),
(17, 'mmate06625@gmail.com', '$2y$10$0rb7V4rEqhtvIcGU4kR3l..bRZidcq3I6cxPltTVXyWw3uEFC/TYu', 'Molnar Mate', 'molnar es tarsa', 1, '2025-09-26 11:10:25', '2025-12-10 10:55:36'),
(18, 'mmate2577@gmail.com', '$2y$10$A5Wen0DvvPVtxcC5Sf05Xeh1M9toNNUGpsSctcjS5yQ.yfzSZhWHO', 'Molnar Mate', 'mmate', 3, '2025-10-17 10:12:27', '2025-11-11 09:51:59'),
(19, 'molnar.mate@szechenyi.hu', '$2y$10$jCbCtZevIYfqTJh85rL2TOW/JyHvPz5HkO6y85z4V8Q1cEwUTQk36', 'trubics', 'asd', 3, '2025-11-07 09:32:55', '2025-11-07 09:34:01'),
(20, 'trubics@gmail.com', '$2y$10$M8qffQo2kCVVps25Cu8kue0igk8WWFprvPnhXaMavDYuzIHFA6Zxm', 'Molnar Mate', 'mmate', 3, '2025-11-07 10:15:07', '2025-11-07 10:22:17');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `warehouses`
--

CREATE TABLE `warehouses` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text,
  `manager_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `warehouses`
--

INSERT INTO `warehouses` (`id`, `name`, `address`, `manager_id`, `created_at`, `updated_at`) VALUES
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

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `app_orders`
--
ALTER TABLE `app_orders`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `app_order_items`
--
ALTER TABLE `app_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- A tábla indexei `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- A tábla indexei `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `warehouse_id` (`warehouse_id`);

--
-- A tábla indexei `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rend_statusz` (`status`),
  ADD KEY `idx_rend_letrehozva` (`created_at`),
  ADD KEY `idx_rend_email` (`email`),
  ADD KEY `idx_rend_nev` (`name`);

--
-- A tábla indexei `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- A tábla indexei `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- A tábla indexei `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `keszlet_ibfk_1` (`product_id`);

--
-- A tábla indexei `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- A tábla indexei `warehouses`
--
ALTER TABLE `warehouses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `manager_id` (`manager_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `app_orders`
--
ALTER TABLE `app_orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `app_order_items`
--
ALTER TABLE `app_order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT a táblához `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT a táblához `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT a táblához `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT a táblához `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT a táblához `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT a táblához `warehouses`
--
ALTER TABLE `warehouses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `app_order_items`
--
ALTER TABLE `app_order_items`
  ADD CONSTRAINT `rendeles_tetelek_app_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rendeles_tetelek_app_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Megkötések a táblához `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `kedvencek_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `kedvencek_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Megkötések a táblához `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `helyek_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`);

--
-- Megkötések a táblához `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `termekek_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `termekek_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);

--
-- Megkötések a táblához `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `termek_ertekelesek_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `termek_ertekelesek_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Megkötések a táblához `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `keszlet_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `keszlet_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Megkötések a táblához `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `felhasznalok_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Megkötések a táblához `warehouses`
--
ALTER TABLE `warehouses`
  ADD CONSTRAINT `raktarak_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
