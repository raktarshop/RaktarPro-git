<?php
/**
 * Product Service
 * Termék business logic
 */

require_once __DIR__ . '/../models/ProductModel.php';
require_once __DIR__ . '/../utils/Validator.php';

class ProductService {
    
    private ProductModel $productModel;
    
    public function __construct() {
        $this->productModel = new ProductModel();
    }
    
    /**
     * Get products with pagination and filters
     */
    public function getProducts(array $filters = []): array {
        $pagination = Validator::getPaginationParams($filters);
        
        $products = $this->productModel->getProducts([
            'search' => $filters['search'] ?? '',
            'category_id' => $filters['category_id'] ?? null,
            'sort' => $filters['sort'] ?? 'newest',
            'limit' => $pagination['limit'],
            'offset' => $pagination['offset']
        ]);
        
        $total = $this->productModel->countProducts([
            'search' => $filters['search'] ?? '',
            'category_id' => $filters['category_id'] ?? null
        ]);
        
        return [
            'products' => $products,
            'pagination' => [
                'page' => $pagination['page'],
                'limit' => $pagination['limit'],
                'total' => $total,
                'pages' => ceil($total / $pagination['limit'])
            ]
        ];
    }
    
    /**
     * Get product by ID
     */
    public function getProduct(int $id): ?array {
        return $this->productModel->getProductDetails($id);
    }
    
    /**
     * Create product (ADMIN)
     */
    public function createProduct(array $data): int {
        // Validate required
        $errors = Validator::required($data, ['sku', 'name', 'unit_price']);
        
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        // Check SKU uniqueness
        if ($this->productModel->skuExists($data['sku'])) {
            throw new Exception('Ez a cikkszám már létezik');
        }
        
        // Prepare data
        $productData = [
            'sku' => Validator::sanitizeString($data['sku']),
            'name' => Validator::sanitizeString($data['name']),
            'description' => $data['description'] ?? null,
            'unit_price' => (float)$data['unit_price'],
            'stock' => (int)($data['stock'] ?? 0),
            'category_id' => !empty($data['category_id']) ? (int)$data['category_id'] : null,
            'supplier_id' => !empty($data['supplier_id']) ? (int)$data['supplier_id'] : null,
            'weight' => !empty($data['weight']) ? (float)$data['weight'] : null,
            'image_url' => $data['image_url'] ?? null,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        return $this->productModel->create($productData);
    }
    
    /**
     * Update product (ADMIN)
     */
    public function updateProduct(int $id, array $data): bool {
        // Check product exists
        $product = $this->productModel->find($id);
        if (!$product) {
            throw new Exception('Termék nem található');
        }
        
        // Check SKU uniqueness if changed
        if (!empty($data['sku']) && $this->productModel->skuExists($data['sku'], $id)) {
            throw new Exception('Ez a cikkszám már létezik');
        }
        
        // Prepare update data (only provided fields)
        $updateData = [];
        
        if (isset($data['sku'])) $updateData['sku'] = Validator::sanitizeString($data['sku']);
        if (isset($data['name'])) $updateData['name'] = Validator::sanitizeString($data['name']);
        if (isset($data['description'])) $updateData['description'] = $data['description'];
        if (isset($data['unit_price'])) $updateData['unit_price'] = (float)$data['unit_price'];
        if (isset($data['stock'])) $updateData['stock'] = (int)$data['stock'];
        if (isset($data['category_id'])) $updateData['category_id'] = (int)$data['category_id'];
        if (isset($data['supplier_id'])) $updateData['supplier_id'] = (int)$data['supplier_id'];
        if (isset($data['weight'])) $updateData['weight'] = (float)$data['weight'];
        if (isset($data['image_url'])) $updateData['image_url'] = $data['image_url'];
        
        $updateData['updated_at'] = date('Y-m-d H:i:s');
        
        return $this->productModel->update($id, $updateData);
    }
    
    /**
     * Delete product (ADMIN)
     */
    public function deleteProduct(int $id): bool {
        // Check product exists
        $product = $this->productModel->find($id);
        if (!$product) {
            throw new Exception('Termék nem található');
        }
        
        return $this->productModel->delete($id);
    }
}
