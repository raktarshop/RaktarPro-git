<?php
/**
 * Product Model
 * Tábla: products
 * Mezők: id, sku, name, description, image_url, category_id, supplier_id, unit_price, weight, created_at, updated_at, stock
 */

require_once __DIR__ . '/../config/Database.php';

class ProductModel {
    private mysqli $db;
    protected string $table = 'products';
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Get product by ID using stored procedure
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("CALL products_get(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        $this->db->next_result();
        
        return $result ?: null;
    }
    
    /**
     * Get all products using stored procedure
     */
    public function getAll(): array {
        $result = $this->db->query("CALL products_get_all()");
        $products = $result->fetch_all(MYSQLI_ASSOC);
        $this->db->next_result();
        
        return $products;
    }
    
    /**
     * Create new product using stored procedure
     */
    public function create(array $data): int {
        $stmt = $this->db->prepare("CALL products_insert(?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssssiiidi",
            $data['sku'],
            $data['name'],
            $data['description'],
            $data['image_url'],
            $data['category_id'],
            $data['supplier_id'],
            $data['unit_price'],
            $data['weight'],
            $data['stock']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $insertId = $result['inserted_id'];
        $stmt->close();
        $this->db->next_result();
        
        return $insertId;
    }
    
    /**
     * Update product using stored procedure
     */
    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("CALL products_update(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "issssiiidi",
            $id,
            $data['sku'],
            $data['name'],
            $data['description'],
            $data['image_url'],
            $data['category_id'],
            $data['supplier_id'],
            $data['unit_price'],
            $data['weight'],
            $data['stock']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Delete product using stored procedure
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("CALL products_delete(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Get products with filters, search, pagination
     */
    public function getProducts(array $filters = []): array {
        $where = "WHERE 1=1";
        $params = [];
        $types = '';
        
        // Search
        if (!empty($filters['search'])) {
            $where .= " AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)";
            $search = '%' . $filters['search'] . '%';
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
            $types .= 'sss';
        }
        
        // Category filter
        if (!empty($filters['category_id'])) {
            $where .= " AND p.category_id = ?";
            $params[] = (int)$filters['category_id'];
            $types .= 'i';
        }
        
        // Sorting
        $orderBy = match($filters['sort'] ?? 'newest') {
            'price_asc' => 'p.unit_price ASC',
            'price_desc' => 'p.unit_price DESC',
            'name_asc' => 'p.name ASC',
            'name_desc' => 'p.name DESC',
            'newest' => 'p.created_at DESC',
            default => 'p.id DESC'
        };
        
        // Pagination
        $limit = (int)($filters['limit'] ?? 12);
        $offset = (int)($filters['offset'] ?? 0);
        
        $sql = "
            SELECT 
                p.*,
                c.name as category_name,
                s.name as supplier_name
            FROM {$this->table} p
            LEFT JOIN categories c ON c.id = p.category_id
            LEFT JOIN suppliers s ON s.id = p.supplier_id
            {$where}
            ORDER BY {$orderBy}
            LIMIT ? OFFSET ?
        ";
        
        $params[] = $limit;
        $params[] = $offset;
        $types .= 'ii';
        
        return $this->query($sql, $params, $types);
    }
    
    /**
     * Count products with filters
     */
    public function countProducts(array $filters = []): int {
        $where = "WHERE 1=1";
        $params = [];
        $types = '';
        
        if (!empty($filters['search'])) {
            $where .= " AND (name LIKE ? OR description LIKE ? OR sku LIKE ?)";
            $search = '%' . $filters['search'] . '%';
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
            $types .= 'sss';
        }
        
        if (!empty($filters['category_id'])) {
            $where .= " AND category_id = ?";
            $params[] = (int)$filters['category_id'];
            $types .= 'i';
        }
        
        $sql = "SELECT COUNT(*) as total FROM {$this->table} {$where}";
        $result = $this->queryOne($sql, $params, $types);
        
        return (int)$result['total'];
    }
    
    /**
     * Get product with details (category, supplier)
     */
    public function getProductDetails(int $id): ?array {
        return $this->queryOne("
            SELECT 
                p.*,
                c.id as category_id,
                c.name as category_name,
                s.id as supplier_id,
                s.name as supplier_name
            FROM {$this->table} p
            LEFT JOIN categories c ON c.id = p.category_id
            LEFT JOIN suppliers s ON s.id = p.supplier_id
            WHERE p.id = ?
        ", [$id], 'i');
    }
    
    /**
     * Check SKU exists
     */
    public function skuExists(string $sku, ?int $excludeId = null): bool {
        if ($excludeId) {
            $result = $this->queryOne(
                "SELECT id FROM {$this->table} WHERE sku = ? AND id != ?",
                [$sku, $excludeId],
                'si'
            );
        } else {
            $result = $this->queryOne(
                "SELECT id FROM {$this->table} WHERE sku = ?",
                [$sku],
                's'
            );
        }
        
        return $result !== null;
    }
    
    /**
     * Update stock quantity
     */
    public function updateStock(int $id, int $quantity): bool {
        return $this->update($id, ['stock' => $quantity]);
    }
    
    /**
     * Decrease stock (for checkout)
     */
    public function decreaseStock(int $id, int $quantity): bool {
        $sql = "UPDATE {$this->table} SET stock = GREATEST(stock - ?, 0) WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("ii", $quantity, $id);
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Get products by IDs (for cart)
     */
    public function getByIds(array $ids): array {
        if (empty($ids)) {
            return [];
        }
        
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $types = str_repeat('i', count($ids));
        
        $sql = "SELECT * FROM {$this->table} WHERE id IN ({$placeholders})";
        
        return $this->query($sql, $ids, $types);
    }
}
