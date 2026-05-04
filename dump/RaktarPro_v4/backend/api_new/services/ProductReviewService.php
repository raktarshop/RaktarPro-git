<?php
require_once __DIR__ . '/../models/ProductReviewModel.php';
require_once __DIR__ . '/../utils/Validator.php';

class ProductReviewService {
    private ProductReviewModel $reviewModel;
    
    public function __construct() {
        $this->reviewModel = new ProductReviewModel();
    }
    
    public function getAllReviews(): array {
        return $this->reviewModel->getAll();
    }
    
    public function getReviewById(int $id): ?array {
        $review = $this->reviewModel->getWithDetails($id);
        if (!$review) {
            throw new Exception('Értékelés nem található');
        }
        return $review;
    }
    
    public function createReview(int $userId, array $data): int {
        $errors = Validator::required($data, ['product_id', 'rating']);
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        // Validáció: rating 1-5 között
        if ($data['rating'] < 1 || $data['rating'] > 5) {
            throw new Exception('Értékelés 1 és 5 között lehet');
        }
        
        // Ellenőrzés: user már értékelte-e
        if ($this->reviewModel->hasUserReviewedProduct($userId, (int)$data['product_id'])) {
            throw new Exception('Már értékelted ezt a terméket');
        }
        
        $reviewData = [
            'product_id' => (int)$data['product_id'],
            'user_id' => $userId,
            'rating' => (int)$data['rating'],
            'review' => Validator::sanitizeString($data['review'] ?? '')
        ];
        
        return $this->reviewModel->create($reviewData);
    }
    
    public function updateReview(int $id, int $userId, bool $isAdmin, array $data): bool {
        $review = $this->reviewModel->getById($id);
        if (!$review) {
            throw new Exception('Értékelés nem található');
        }
        
        // Jogosultság ellenőrzés
        if ($review['user_id'] != $userId && !$isAdmin) {
            throw new Exception('Nincs jogosultságod ehhez az értékeléshez');
        }
        
        // Validáció: rating 1-5 között
        if (isset($data['rating']) && ($data['rating'] < 1 || $data['rating'] > 5)) {
            throw new Exception('Értékelés 1 és 5 között lehet');
        }
        
        $updateData = [
            'rating' => isset($data['rating']) ? (int)$data['rating'] : $review['rating'],
            'review' => Validator::sanitizeString($data['review'] ?? $review['review'])
        ];
        
        return $this->reviewModel->update($id, $updateData);
    }
    
    public function deleteReview(int $id, int $userId, bool $isAdmin): bool {
        $review = $this->reviewModel->getById($id);
        if (!$review) {
            throw new Exception('Értékelés nem található');
        }
        
        // Jogosultság ellenőrzés
        if ($review['user_id'] != $userId && !$isAdmin) {
            throw new Exception('Nincs jogosultságod ehhez az értékeléshez');
        }
        
        return $this->reviewModel->delete($id);
    }
    
    public function getProductReviews(int $productId): array {
        return [
            'reviews' => $this->reviewModel->getByProduct($productId),
            'average_rating' => $this->reviewModel->getProductAverageRating($productId),
            'review_count' => $this->reviewModel->getProductReviewCount($productId),
            'rating_distribution' => $this->reviewModel->getProductRatingDistribution($productId)
        ];
    }
}
