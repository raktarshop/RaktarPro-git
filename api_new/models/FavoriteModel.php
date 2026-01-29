<?php
/**
 * Favorite Model
 * Tábla: favorites
 * Kedvencek kezelése
 */

require_once __DIR__ . '/../config/Database.php';

class FavoriteModel {
    private mysqli $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Get favorite by ID
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("CALL favorites_get(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        $this->db->next_result();
        
        return $result ?: null;
    }
    
    /**
     * Get all favorites
     */
    public function getAll(): array {
        $result = $this->db->query("CALL favorites_get_all()");
        $favorites = $result->fetch_all(MYSQLI_ASSOC);
        $this->db->next_result();
        
        return $favorites;
    }
    
    /**
     * Create new favorite
     */
    public function create(array $data): int {
        $stmt = $this->db->prepare("CALL favorites_insert(?, ?)");
        $stmt->bind_param(
            "ii",
            $data['user_id'],
            $data['product_id']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $insertId = $result['inserted_id'];
        $stmt->close();
        $this->db->next_result();
        
        return $insertId;
    }
    
    /**
     * Update favorite
     */
    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("CALL favorites_update(?, ?, ?)");
        $stmt->bind_param(
            "iii",
            $id,
            $data['user_id'],
            $data['product_id']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Delete favorite
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("CALL favorites_delete(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Get user's favorites with product details
     */
    public function getUserFavorites(int $userId): array {
        $stmt = $this->db->prepare("
            SELECT 
                f.*,
                p.sku,
                p.name as product_name,
                p.description,
                p.image_url,
                p.unit_price,
                p.stock,
                c.name as category_name
            FROM favorites f
            LEFT JOIN products p ON p.id = f.product_id
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Check if user has favorited product
     */
    public function isFavorited(int $userId, int $productId): bool {
        $stmt = $this->db->prepare("
            SELECT id FROM favorites 
            WHERE user_id = ? AND product_id = ?
        ");
        $stmt->bind_param("ii", $userId, $productId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result !== null;
    }
    
    /**
     * Get favorite ID by user and product
     */
    public function getFavoriteId(int $userId, int $productId): ?int {
        $stmt = $this->db->prepare("
            SELECT id FROM favorites 
            WHERE user_id = ? AND product_id = ?
        ");
        $stmt->bind_param("ii", $userId, $productId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result ? $result['id'] : null;
    }
    
    /**
     * Toggle favorite (add if not exists, remove if exists)
     */
    public function toggle(int $userId, int $productId): array {
        $favoriteId = $this->getFavoriteId($userId, $productId);
        
        if ($favoriteId) {
            // Remove favorite
            $this->delete($favoriteId);
            return ['action' => 'removed', 'favorited' => false];
        } else {
            // Add favorite
            $id = $this->create([
                'user_id' => $userId,
                'product_id' => $productId
            ]);
            return ['action' => 'added', 'favorited' => true, 'id' => $id];
        }
    }
    
    /**
     * Get favorite count for product
     */
    public function getProductFavoriteCount(int $productId): int {
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as count 
            FROM favorites 
            WHERE product_id = ?
        ");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return (int)$result['count'];
    }
}
