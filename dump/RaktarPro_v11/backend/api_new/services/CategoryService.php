<?php
require_once __DIR__ . '/../models/CategoryModel.php';
require_once __DIR__ . '/../utils/Validator.php';

class CategoryService {
    private CategoryModel $categoryModel;
    
    public function __construct() {
        $this->categoryModel = new CategoryModel();
    }
    
    public function getAllCategories(): array {
        return $this->categoryModel->getAll();
    }
    
    public function getCategoryById(int $id): ?array {
        $category = $this->categoryModel->getById($id);
        if (!$category) {
            throw new Exception('Kategória nem található');
        }
        return $category;
    }
    
    public function createCategory(array $data): int {
        // Validáció
        $errors = Validator::required($data, ['name']);
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        // Név üres string ellenőrzés
        if (empty(trim($data['name']))) {
            throw new Exception('A kategória neve nem lehet üres');
        }
        
        $categoryData = [
            'name' => Validator::sanitizeString($data['name']),
            'parent_id' => isset($data['parent_id']) ? (int)$data['parent_id'] : null
        ];
        
        // Ha van parent_id, ellenőrizzük hogy létezik-e
        if ($categoryData['parent_id'] !== null) {
            $parent = $this->categoryModel->getById($categoryData['parent_id']);
            if (!$parent) {
                throw new Exception('A szülő kategória nem létezik');
            }
        }
        
        return $this->categoryModel->create($categoryData);
    }
    
    public function updateCategory(int $id, array $data): bool {
        $category = $this->getCategoryById($id);
        
        // Név validáció ha meg van adva
        if (isset($data['name']) && empty(trim($data['name']))) {
            throw new Exception('A kategória neve nem lehet üres');
        }
        
        $updateData = [
            'name' => Validator::sanitizeString($data['name'] ?? $category['name']),
            'parent_id' => isset($data['parent_id']) ? (int)$data['parent_id'] : $category['parent_id']
        ];
        
        // Szülő kategória létezésének ellenőrzése
        if ($updateData['parent_id'] !== null) {
            // Ellenőrizzük hogy nem önmagára hivatkozik-e
            if ($updateData['parent_id'] == $id) {
                throw new Exception('A kategória nem lehet saját szülője');
            }
            
            $parent = $this->categoryModel->getById($updateData['parent_id']);
            if (!$parent) {
                throw new Exception('A szülő kategória nem létezik');
            }
        }
        
        return $this->categoryModel->update($id, $updateData);
    }
    
    public function deleteCategory(int $id): bool {
        $this->getCategoryById($id);
        
        // Ellenőrizzük hogy vannak-e gyerek kategóriák
        if ($this->categoryModel->hasChildren($id)) {
            throw new Exception('A kategória nem törölhető, mert vannak alkategóriái');
        }
        
        // Ellenőrizzük hogy vannak-e termékek hozzárendelve
        if ($this->categoryModel->hasProducts($id)) {
            throw new Exception('A kategória nem törölhető, mert vannak hozzárendelt termékek');
        }
        
        return $this->categoryModel->delete($id);
    }
    
    public function getCategoryTree(): array {
        return $this->categoryModel->getCategoryTree();
    }
}
