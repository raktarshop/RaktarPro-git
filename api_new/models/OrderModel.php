<?php
/**
 * Order Model
 * Tábla: orders, app_order_items
 * Mezők orders: id, user_id, name, email, address, payment_method, gross_total, status, created_at
 * Mezők app_order_items: id, order_id, product_id, quantity, unit_price, total_amount
 */

require_once __DIR__ . '/BaseModel.php';

class OrderModel extends BaseModel {
    protected string $table = 'orders';
    
    /**
     * Get user's orders with pagination
     */
    public function getUserOrders(int $userId, int $limit = 10, int $offset = 0): array {
        $sql = "
            SELECT 
                o.*,
                COUNT(oi.id) as items_count
            FROM {$this->table} o
            LEFT JOIN app_order_items oi ON oi.order_id = o.id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?
        ";
        
        return $this->query($sql, [$userId, $limit, $offset], 'iii');
    }
    
    /**
     * Count user's orders
     */
    public function countUserOrders(int $userId): int {
        $result = $this->queryOne(
            "SELECT COUNT(*) as total FROM {$this->table} WHERE user_id = ?",
            [$userId],
            'i'
        );
        
        return (int)$result['total'];
    }
    
    /**
     * Get order details with items
     */
    public function getOrderDetails(int $orderId): ?array {
        $order = $this->queryOne("
            SELECT o.*
            FROM {$this->table} o
            WHERE o.id = ?
        ", [$orderId], 'i');
        
        if (!$order) {
            return null;
        }
        
        // Get order items
        $items = $this->query("
            SELECT 
                oi.*,
                p.name as product_name,
                p.sku,
                p.image_url
            FROM app_order_items oi
            LEFT JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = ?
        ", [$orderId], 'i');
        
        $order['items'] = $items;
        
        return $order;
    }
    
    /**
     * Create order with items (TRANSACTION)
     */
    public function createOrderWithItems(array $orderData, array $items): int {
        $this->db->begin_transaction();
        
        try {
            // 1. Create order
            $orderId = $this->create($orderData);
            
            // 2. Create order items
            $stmt = $this->db->prepare("
                INSERT INTO app_order_items (order_id, product_id, quantity, unit_price, total_amount)
                VALUES (?, ?, ?, ?, ?)
            ");
            
            foreach ($items as $item) {
                $stmt->bind_param(
                    "iiiii",
                    $orderId,
                    $item['product_id'],
                    $item['quantity'],
                    $item['unit_price'],
                    $item['total_amount']
                );
                $stmt->execute();
            }
            $stmt->close();
            
            $this->db->commit();
            return $orderId;
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    /**
     * Update order status
     */
    public function updateStatus(int $orderId, string $status): bool {
        return $this->update($orderId, ['status' => $status]);
    }
    
    /**
     * Get all orders (ADMIN) with filters
     */
    public function getAllOrders(array $filters = []): array {
        $where = "WHERE 1=1";
        $params = [];
        $types = '';
        
        // Status filter
        if (!empty($filters['status'])) {
            $where .= " AND o.status = ?";
            $params[] = $filters['status'];
            $types .= 's';
        }
        
        // Date range
        if (!empty($filters['from_date'])) {
            $where .= " AND o.created_at >= ?";
            $params[] = $filters['from_date'];
            $types .= 's';
        }
        
        if (!empty($filters['to_date'])) {
            $where .= " AND o.created_at <= ?";
            $params[] = $filters['to_date'] . ' 23:59:59';
            $types .= 's';
        }
        
        // Search (name, email, id)
        if (!empty($filters['search'])) {
            $where .= " AND (o.name LIKE ? OR o.email LIKE ? OR o.id = ?)";
            $search = '%' . $filters['search'] . '%';
            $params[] = $search;
            $params[] = $search;
            $params[] = (int)$filters['search'];
            $types .= 'ssi';
        }
        
        $limit = (int)($filters['limit'] ?? 20);
        $offset = (int)($filters['offset'] ?? 0);
        
        $sql = "
            SELECT 
                o.*,
                COUNT(oi.id) as items_count,
                u.full_name as user_full_name,
                u.email as user_email
            FROM {$this->table} o
            LEFT JOIN app_order_items oi ON oi.order_id = o.id
            LEFT JOIN users u ON u.id = o.user_id
            {$where}
            GROUP BY o.id
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?
        ";
        
        $params[] = $limit;
        $params[] = $offset;
        $types .= 'ii';
        
        return $this->query($sql, $params, $types);
    }
    
    /**
     * Count orders with filters
     */
    public function countOrders(array $filters = []): int {
        $where = "WHERE 1=1";
        $params = [];
        $types = '';
        
        if (!empty($filters['status'])) {
            $where .= " AND status = ?";
            $params[] = $filters['status'];
            $types .= 's';
        }
        
        if (!empty($filters['from_date'])) {
            $where .= " AND created_at >= ?";
            $params[] = $filters['from_date'];
            $types .= 's';
        }
        
        if (!empty($filters['to_date'])) {
            $where .= " AND created_at <= ?";
            $params[] = $filters['to_date'] . ' 23:59:59';
            $types .= 's';
        }
        
        $sql = "SELECT COUNT(*) as total FROM {$this->table} {$where}";
        $result = $this->queryOne($sql, $params, $types);
        
        return (int)$result['total'];
    }
    
    /**
     * Get order statistics (ADMIN)
     */
    public function getStatistics(): array {
        return $this->queryOne("
            SELECT 
                COUNT(*) as total_orders,
                SUM(gross_total) as total_revenue,
                SUM(CASE WHEN status = 'uj' THEN 1 ELSE 0 END) as pending_orders,
                SUM(CASE WHEN status = 'teljesitve' THEN 1 ELSE 0 END) as completed_orders
            FROM {$this->table}
        ") ?: [];
    }
}
