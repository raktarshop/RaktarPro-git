-- 2026-02-08: Add multi-language product fields (HU/EN/DE)
-- Safe migration: keeps existing `name` and `description` columns intact.
-- After running this, you can fill name_en/description_en etc. later.

ALTER TABLE `products`
  ADD COLUMN `name_hu` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `name`,
  ADD COLUMN `name_en` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `name_hu`,
  ADD COLUMN `name_de` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `name_en`,
  ADD COLUMN `description_hu` TEXT COLLATE utf8mb4_unicode_ci AFTER `description`,
  ADD COLUMN `description_en` TEXT COLLATE utf8mb4_unicode_ci AFTER `description_hu`,
  ADD COLUMN `description_de` TEXT COLLATE utf8mb4_unicode_ci AFTER `description_en`;

-- Copy current values into HU fields (so Hungarian works immediately)
UPDATE `products`
SET
  `name_hu` = COALESCE(`name_hu`, `name`),
  `description_hu` = COALESCE(`description_hu`, `description`);
