/* Multilingual product descriptions: HU, EN, DE */
START TRANSACTION;
SET NAMES utf8mb4;

/* Add columns if not exist */
ALTER TABLE `products`
ADD COLUMN IF NOT EXISTS `description_en` TEXT,
ADD COLUMN IF NOT EXISTS `description_de` TEXT;

/* Example product 1 */
UPDATE `products` SET 
`description_en` = 'The iPhone 14 is a reliable and well-balanced smartphone designed for everyday use. Its 6.1-inch Super Retina XDR display delivers sharp visuals and vibrant colors, making it ideal for browsing, streaming, and communication. The performance is smooth and responsive, ensuring a premium user experience.

The advanced camera system allows you to capture high-quality photos and videos effortlessly. Whether you are documenting everyday moments or special occasions, the iPhone 14 delivers consistent and impressive results.',
`description_de` = 'Das iPhone 14 ist ein zuverlässiges und ausgewogenes Smartphone für den täglichen Gebrauch. Das 6,1-Zoll Super Retina XDR Display bietet eine scharfe Darstellung und lebendige Farben, ideal für Surfen, Streaming und Kommunikation. Die Leistung ist schnell und reaktionsschnell und sorgt für ein hochwertiges Nutzungserlebnis.

Das fortschrittliche Kamerasystem ermöglicht hochwertige Fotos und Videos. Egal ob im Alltag oder bei besonderen Momenten, das iPhone 14 liefert konstant hervorragende Ergebnisse.'
WHERE `id` = 1;

/* Example product 2 */
UPDATE `products` SET 
`description_en` = 'The Samsung Galaxy smartphone offers a modern Android experience with reliable performance and a vibrant display. It is ideal for social media, video streaming, and everyday communication.

The camera makes it easy to capture important moments, while the customizable interface allows you to tailor the phone to your personal needs.',
`description_de` = 'Das Samsung Galaxy Smartphone bietet ein modernes Android-Erlebnis mit zuverlässiger Leistung und einem lebendigen Display. Es eignet sich ideal für soziale Medien, Video-Streaming und tägliche Kommunikation.

Die Kamera ermöglicht es, wichtige Momente einfach festzuhalten, während die anpassbare Benutzeroberfläche eine individuelle Nutzung erlaubt.'
WHERE `id` = 2;

COMMIT;
