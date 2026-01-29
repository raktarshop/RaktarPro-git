<?php
/**
 * Order Item Model
 * Tábla: app_order_items
 * Rendelési tételek kezelése
 */

require_once __DIR__ . '/../config/Database.php';

class OrderItemModel {
    private mysqli $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Get order item by ID
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("CALL order_items_get(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        $this->db->next_result();
        
        return $result ?: null;
    }
    
    /**
     * Get all order items
     */
    public function getAll(): array {
        $result = $this->db->query("CALL order_items_get_all()");
        $items = $result->fetch_all(MYSQLI_ASSOC);
        $this->db->next_result();
        
        return $items;
    }
    
    /**
     * Create new order item
     */
    public function create(array $data): int {
        $stmt = $this->db->prepare("CALL order_items_insert(?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "iiiii",
            $data['order_id'],
            $data['product_id'],
            $data['quantity'],
            $data['unit_price'],
            $data['total_amount']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $insertId = $result['inserted_id'];
        $stmt->close();
        $this->db->next_result();
        
        return $insertId;
    }
    
    /**
     * Update order item
     */
    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("CALL order_items_update(?, ?, ?, ?)");
        $stmt->bind_param(
            "iiii",
            $id,
            $data['quantity'],
            $data['unit_price'],
            $data['total_amount']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Delete order item
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("CALL order_items_delete(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Get items by order
     */
    public function getByOrder(int $orderId): array {
        $stmt = $this->db->prepare("CALL order_items_get_by_order(?)");
        $stmt->bind_param("i", $orderId);
        $stmt->execute();
        
        $items = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        $this->db->next_result();
        
        return $items;
    }
    
    /**
     * Get items by product
     */
    public function getByProduct(int $productId): array {
        $stmt = $this->db->prepare("
            SELECT 
                oi.*,
                o.name as customer_name,
                o.email as customer_email,
                o.status as order_status,
                o.created_at as order_date
            FROM app_order_items oi
            LEFT JOIN orders o ON o.id = oi.order_id
            WHERE oi.product_id = ?
            ORDER BY o.created_at DESC
        ");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Delete all items for order
     */
    public function deleteByOrder(int $orderId): bool {
        $stmt = $this->db->prepare("DELETE FROM app_order_items WHERE order_id = ?");
        $stmt->bind_param("i", $orderId);
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Calculate order total
     */
    public function calculateOrderTotal(int $orderId): int {
        $stmt = $this->db->prepare("
            SELECT SUM(total_amount) as total 
            FROM app_order_items 
            WHERE order_id = ?
        ");
        $stmt->bind_param("i", $orderId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return (int)($result['total'] ?? 0);
    }
    
    /**
     * Get most popular products
     */
    public function getMostPopularProducts(int $limit = 10): array {
        $stmt = $this->db->prepare("
            SELECT 
                oi.product_id,
                p.name as product_name,
                p.sku as product_sku,
                p.image_url as product_image,
                SUM(oi.quantity) as total_quantity,
                COUNT(DISTINCT oi.order_id) as order_count,
                SUM(oi.total_amount) as total_revenue
            FROM app_order_items oi
            LEFT JOIN products p ON p.id = oi.product_id
            GROUP BY oi.product_id, p.name, p.sku, p.image_url
            ORDER BY total_quantity DESC
            LIMIT ?
        ");
        $stmt->bind_param("i", $limit);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Get product sales statistics
     */
    public function getProductSalesStats(int $productId): array {
        $stmt = $this->db->prepare("
            SELECT 
                COUNT(DISTINCT order_id) as order_count,
                SUM(quantity) as total_quantity,
                SUM(total_amount) as total_revenue,
                AVG(unit_price) as avg_price,
                MIN(unit_price) as min_price,
                MAX(unit_price) as max_price
            FROM app_order_items
            WHERE product_id = ?
        ");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result ?: [
            'order_count' => 0,
            'total_quantity' => 0,
            'total_revenue' => 0,
            'avg_price' => 0,
            'min_price' => 0,
            'max_price' => 0
        ];
    }
}
