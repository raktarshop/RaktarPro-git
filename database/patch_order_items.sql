-- ====================================================
-- PATCH: order_items tábla létrehozása
-- Futtatd ezt phpMyAdminban EGYSZER az import után
-- ====================================================

-- Új order_items tábla, ami az `orders` táblára hivatkozik
CREATE TABLE IF NOT EXISTS `order_items` (
  `id`           int          NOT NULL AUTO_INCREMENT,
  `order_id`     int          NOT NULL,
  `product_id`   int          NOT NULL,
  `quantity`     int          NOT NULL DEFAULT 1,
  `unit_price`   int          NOT NULL DEFAULT 0,
  `total_amount` int          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order_id` (`order_id`),
  KEY `idx_order_items_product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_order`
    FOREIGN KEY (`order_id`)   REFERENCES `orders`   (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
