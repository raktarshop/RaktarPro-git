<?php
/**
 * Stock Model
 * Tábla: stock
 * Készletkezelés tárolt eljárásokkal
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/BaseModel.php';

class StockModel extends BaseModel{
    protected string $table = 'stock';
    
    public function __construct() {
        parent::__construct();
    }
    
    /**
     * Get stock by ID
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("CALL stock_get(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        $this->db->next_result();
        
        return $result ?: null;
    }
    
    /**
     * Get all stock
     */
    public function getAll(): array {
        $result = $this->db->query("CALL stock_get_all()");
        $stock = $result->fetch_all(MYSQLI_ASSOC);
        $this->db->next_result();
        
        return $stock;
    }
    
    /**
     * Create new stock entry
     */
    public function create(array $data): int {
        $stmt = $this->db->prepare("CALL stock_insert(?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "iiiii",
            $data['product_id'],
            $data['location_id'],
            $data['quantity'],
            $data['reserved_quantity'],
            $data['reorder_level']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $insertId = $result['inserted_id'];
        $stmt->close();
        $this->db->next_result();
        
        // Recompute product total stock
        $this->recomputeProductStock($data['product_id']);
        
        return $insertId;
    }
    
    /**
     * Update stock
     */
    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("CALL stock_update(?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "iiiiii",
            $id,
            $data['product_id'],
            $data['location_id'],
            $data['quantity'],
            $data['reserved_quantity'],
            $data['reorder_level']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        // Recompute product total stock
        if (isset($data['product_id'])) {
            $this->recomputeProductStock($data['product_id']);
        }
        
        return $affected;
    }
    
    /**
     * Delete stock
     */
    public function delete(int $id): bool {
        // Get product_id before delete for recompute
        $stock = $this->getById($id);
        $productId = $stock['product_id'] ?? null;
        
        $stmt = $this->db->prepare("CALL stock_delete(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        // Recompute product total stock
        if ($productId) {
            $this->recomputeProductStock($productId);
        }
        
        return $affected;
    }
    
    /**
     * Get stock with product and location details
     */
    public function getWithDetails(int $id): ?array {
        $stmt = $this->db->prepare("
            SELECT 
                s.*,
                p.name as product_name,
                p.sku as product_sku,
                l.code as location_code,
                l.description as location_description,
                w.name as warehouse_name
            FROM stock s
            LEFT JOIN products p ON p.id = s.product_id
            LEFT JOIN locations l ON l.id = s.location_id
            LEFT JOIN warehouses w ON w.id = l.warehouse_id
            WHERE s.id = ?
        ");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result ?: null;
    }
    
    /**
     * Get stock by product
     */
    public function getByProduct(int $productId): array {
        $stmt = $this->db->prepare("
            SELECT 
                s.*,
                l.code as location_code,
                l.description as location_description,
                w.name as warehouse_name,
                w.id as warehouse_id
            FROM stock s
            LEFT JOIN locations l ON l.id = s.location_id
            LEFT JOIN warehouses w ON w.id = l.warehouse_id
            WHERE s.product_id = ?
            ORDER BY w.name, l.code
        ");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Get stock by location
     */
    public function getByLocation(int $locationId): array {
        $stmt = $this->db->prepare("
            SELECT 
                s.*,
                p.name as product_name,
                p.sku as product_sku,
                p.unit_price
            FROM stock s
            LEFT JOIN products p ON p.id = s.product_id
            WHERE s.location_id = ?
            ORDER BY p.name
        ");
        $stmt->bind_param("i", $locationId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Increase stock quantity
     */
    public function increaseQuantity(int $id, int $amount): bool {
        $stmt = $this->db->prepare("
            UPDATE stock 
            SET quantity = quantity + ?, updated_at = NOW()
            WHERE id = ?
        ");
        $stmt->bind_param("ii", $amount, $id);
        $result = $stmt->execute();
        $stmt->close();
        
        // Recompute product stock
        $stock = $this->getById($id);
        if ($stock) {
            $this->recomputeProductStock($stock['product_id']);
        }
        
        return $result;
    }
    
    /**
     * Decrease stock quantity
     */
    public function decreaseQuantity(int $id, int $amount): bool {
        $stmt = $this->db->prepare("
            UPDATE stock 
            SET quantity = GREATEST(quantity - ?, 0), updated_at = NOW()
            WHERE id = ?
        ");
        $stmt->bind_param("ii", $amount, $id);
        $result = $stmt->execute();
        $stmt->close();
        
        // Recompute product stock
        $stock = $this->getById($id);
        if ($stock) {
            $this->recomputeProductStock($stock['product_id']);
        }
        
        return $result;
    }
    
    /**
     * Reserve stock
     */
    public function reserve(int $id, int $amount): bool {
        $stmt = $this->db->prepare("
            UPDATE stock 
            SET reserved_quantity = reserved_quantity + ?, updated_at = NOW()
            WHERE id = ? AND (quantity - reserved_quantity) >= ?
        ");
        $stmt->bind_param("iii", $amount, $id, $amount);
        $result = $stmt->execute();
        $affected = $stmt->affected_rows > 0;
        $stmt->close();
        
        return $affected;
    }
    
    /**
     * Release reserved stock
     */
    public function releaseReserved(int $id, int $amount): bool {
        $stmt = $this->db->prepare("
            UPDATE stock 
            SET reserved_quantity = GREATEST(reserved_quantity - ?, 0), updated_at = NOW()
            WHERE id = ?
        ");
        $stmt->bind_param("ii", $amount, $id);
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Move stock between locations
     */
    public function moveStock(int $fromLocationId, int $toLocationId, int $productId, int $quantity): bool {
        $this->db->begin_transaction();
        
        try {
            // Decrease from source
            $stmt = $this->db->prepare("
                UPDATE stock 
                SET quantity = quantity - ?, updated_at = NOW()
                WHERE location_id = ? AND product_id = ? AND (quantity - reserved_quantity) >= ?
            ");
            $stmt->bind_param("iiii", $quantity, $fromLocationId, $productId, $quantity);
            $stmt->execute();
            
            if ($stmt->affected_rows === 0) {
                throw new Exception("Insufficient stock at source location");
            }
            $stmt->close();
            
            // Check if stock exists at destination
            $stmt = $this->db->prepare("SELECT id FROM stock WHERE location_id = ? AND product_id = ?");
            $stmt->bind_param("ii", $toLocationId, $productId);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            
            if ($result) {
                // Update existing stock
                $stmt = $this->db->prepare("
                    UPDATE stock 
                    SET quantity = quantity + ?, updated_at = NOW()
                    WHERE id = ?
                ");
                $stmt->bind_param("ii", $quantity, $result['id']);
                $stmt->execute();
                $stmt->close();
            } else {
                // Create new stock entry
                $stmt = $this->db->prepare("
                    INSERT INTO stock (product_id, location_id, quantity, reserved_quantity, reorder_level, created_at, updated_at)
                    VALUES (?, ?, ?, 0, 0, NOW(), NOW())
                ");
                $stmt->bind_param("iii", $productId, $toLocationId, $quantity);
                $stmt->execute();
                $stmt->close();
            }
            
            $this->db->commit();
            
            // Recompute product stock
            $this->recomputeProductStock($productId);
            
            return true;
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    /**
     * Get products below reorder level
     */
    public function getBelowReorderLevel(): array {
        $stmt = $this->db->query("
            SELECT 
                s.*,
                p.name as product_name,
                p.sku as product_sku,
                l.code as location_code,
                w.name as warehouse_name
            FROM stock s
            LEFT JOIN products p ON p.id = s.product_id
            LEFT JOIN locations l ON l.id = s.location_id
            LEFT JOIN warehouses w ON w.id = l.warehouse_id
            WHERE s.quantity <= s.reorder_level AND s.reorder_level > 0
            ORDER BY (s.reorder_level - s.quantity) DESC
        ");
        
        return $stmt->fetch_all(MYSQLI_ASSOC);
    }
    
    /**
     * Recompute total stock for product
     * Uses stored procedure
     */
    public function recomputeProductStock(int $productId): bool {
        $stmt = $this->db->prepare("CALL recompute_product_stock(?)");
        $stmt->bind_param("i", $productId);
        $result = $stmt->execute();
        $stmt->close();
        $this->db->next_result();
        
        return $result;
    }
    
    /**
     * Get stock summary by warehouse
     */
    public function getStockSummaryByWarehouse(): array {
        $stmt = $this->db->query("
            SELECT 
                w.id as warehouse_id,
                w.name as warehouse_name,
                COUNT(DISTINCT s.product_id) as product_count,
                SUM(s.quantity) as total_quantity,
                SUM(s.reserved_quantity) as total_reserved,
                SUM(s.quantity - s.reserved_quantity) as available_quantity
            FROM warehouses w
            LEFT JOIN locations l ON l.warehouse_id = w.id
            LEFT JOIN stock s ON s.location_id = l.id
            GROUP BY w.id, w.name
            ORDER BY w.name
        ");
        
        return $stmt->fetch_all(MYSQLI_ASSOC);
    }
}
