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
        
        // IMPORTANT:
        // ProductModel->update() stored procedure expects *all* fields.
        // So we merge current DB values with incoming partial payload,
        // otherwise missing keys would overwrite fields with NULL/0.

        $merged = [
            'sku' => $product['sku'] ?? '',
            'name' => $product['name'] ?? '',
            'description' => $product['description'] ?? null,
            'image_url' => $product['image_url'] ?? null,
            'category_id' => $product['category_id'] ?? null,
            'supplier_id' => $product['supplier_id'] ?? null,
            'unit_price' => $product['unit_price'] ?? 0,
            'weight' => $product['weight'] ?? null,
            'stock' => $product['stock'] ?? 0,
        ];

        if (array_key_exists('sku', $data)) $merged['sku'] = Validator::sanitizeString($data['sku']);
        if (array_key_exists('name', $data)) $merged['name'] = Validator::sanitizeString($data['name']);
        if (array_key_exists('description', $data)) $merged['description'] = $data['description'];
        if (array_key_exists('image_url', $data)) $merged['image_url'] = $data['image_url'] ?: null;

        if (array_key_exists('category_id', $data)) {
            $merged['category_id'] = ($data['category_id'] === null || $data['category_id'] === '' ) ? null : (int)$data['category_id'];
        }
        if (array_key_exists('supplier_id', $data)) {
            $merged['supplier_id'] = ($data['supplier_id'] === null || $data['supplier_id'] === '' ) ? null : (int)$data['supplier_id'];
        }

        if (array_key_exists('unit_price', $data)) $merged['unit_price'] = (float)$data['unit_price'];
        if (array_key_exists('weight', $data)) $merged['weight'] = ($data['weight'] === null || $data['weight'] === '') ? null : (float)$data['weight'];
        if (array_key_exists('stock', $data)) $merged['stock'] = (int)$data['stock'];

        $merged['updated_at'] = date('Y-m-d H:i:s');

        return $this->productModel->update($id, $merged);
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
