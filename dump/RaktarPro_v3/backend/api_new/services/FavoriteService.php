<?php
require_once __DIR__ . '/../models/FavoriteModel.php';
require_once __DIR__ . '/../utils/Validator.php';

class FavoriteService {
    private FavoriteModel $favoriteModel;
    
    public function __construct() {
        $this->favoriteModel = new FavoriteModel();
    }
    
    public function getUserFavorites(int $userId): array {
        return $this->favoriteModel->getUserFavorites($userId);
    }
    
    public function addFavorite(int $userId, int $productId): int {
        if ($this->favoriteModel->isFavorited($userId, $productId)) {
            throw new Exception('A termék már a kedvencek között van');
        }
        
        return $this->favoriteModel->create([
            'user_id' => $userId,
            'product_id' => $productId
        ]);
    }
    
    public function removeFavorite(int $id): bool {
        $favorite = $this->favoriteModel->getById($id);
        if (!$favorite) {
            throw new Exception('Kedvenc nem található');
        }
        
        return $this->favoriteModel->delete($id);
    }
    
    public function toggleFavorite(int $userId, int $productId): array {
        return $this->favoriteModel->toggle($userId, $productId);
    }
}
