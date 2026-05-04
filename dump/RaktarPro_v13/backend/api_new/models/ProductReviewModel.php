<?php
/**
 * Product Review Model
 * Tábla: product_reviews
 * Termék értékelések kezelése
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/BaseModel.php';

class ProductReviewModel extends BaseModel {    protected string $table = 'product_reviews';
    
    public function __construct() {
        parent::__construct();
    }
    
    /**
     * Get review by ID
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("CALL product_reviews_get(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        $this->db->next_result();
        
        return $result ?: null;
    }
    
    /**
     * Get all reviews
     */
    public function getAll(): array {
        $result = $this->db->query("CALL product_reviews_get_all()");
        $reviews = $result->fetch_all(MYSQLI_ASSOC);
        $this->db->next_result();
        
        return $reviews;
    }
    
    /**
     * Create new review
     */
    public function create(array $data): int {
        $stmt = $this->db->prepare("CALL product_reviews_insert(?, ?, ?, ?)");
        $stmt->bind_param(
            "iiis",
            $data['product_id'],
            $data['user_id'],
            $data['rating'],
            $data['review']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $insertId = $result['inserted_id'];
        $stmt->close();
        $this->db->next_result();
        
        return $insertId;
    }
    
    /**
     * Update review
     */
    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("CALL product_reviews_update(?, ?, ?)");
        $stmt->bind_param(
            "iis",
            $id,
            $data['rating'],
            $data['review']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Delete review
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("CALL product_reviews_delete(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Get reviews by product
     */
    public function getByProduct(int $productId): array {
        $stmt = $this->db->prepare("CALL product_reviews_get_by_product(?)");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        
        $reviews = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        $this->db->next_result();
        
        return $reviews;
    }
    
    /**
     * Get reviews by user
     */
    public function getByUser(int $userId): array {
        $stmt = $this->db->prepare("
            SELECT 
                pr.*,
                p.name as product_name,
                p.sku as product_sku,
                p.image_url as product_image
            FROM product_reviews pr
            LEFT JOIN products p ON p.id = pr.product_id
            WHERE pr.user_id = ?
            ORDER BY pr.created_at DESC
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Get average rating for product
     */
    public function getProductAverageRating(int $productId): ?float {
        $stmt = $this->db->prepare("
            SELECT AVG(rating) as avg_rating 
            FROM product_reviews 
            WHERE product_id = ?
        ");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result['avg_rating'] ? round($result['avg_rating'], 2) : null;
    }
    
    /**
     * Get review count for product
     */
    public function getProductReviewCount(int $productId): int {
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as count 
            FROM product_reviews 
            WHERE product_id = ?
        ");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return (int)$result['count'];
    }
    
    /**
     * Get rating distribution for product
     */
    public function getProductRatingDistribution(int $productId): array {
        $stmt = $this->db->prepare("
            SELECT 
                rating,
                COUNT(*) as count
            FROM product_reviews
            WHERE product_id = ?
            GROUP BY rating
            ORDER BY rating DESC
        ");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        // Fill in missing ratings with 0
        $distribution = array_fill(1, 5, 0);
        foreach ($result as $row) {
            $distribution[$row['rating']] = (int)$row['count'];
        }
        
        return $distribution;
    }
    
    /**
     * Check if user has reviewed product
     */
    public function hasUserReviewedProduct(int $userId, int $productId): bool {
        $stmt = $this->db->prepare("
            SELECT id FROM product_reviews 
            WHERE user_id = ? AND product_id = ?
        ");
        $stmt->bind_param("ii", $userId, $productId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result !== null;
    }
    
    /**
     * Get review with full details
     */
    public function getWithDetails(int $id): ?array {
        $stmt = $this->db->prepare("
            SELECT 
                pr.*,
                u.full_name as user_name,
                u.email as user_email,
                p.name as product_name,
                p.sku as product_sku
            FROM product_reviews pr
            LEFT JOIN users u ON u.id = pr.user_id
            LEFT JOIN products p ON p.id = pr.product_id
            WHERE pr.id = ?
        ");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result ?: null;
    }
}
