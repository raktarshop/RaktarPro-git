<?php
/**
 * Order Model – RaktárPro
 * Táblák: orders (fejléc), order_items (tételek)
 * FONTOS: app_order_items-t NEM használunk (FK konfliktus).
 *         Futtatd a database/patch_order_items.sql fájlt EGYSZER phpMyAdminban.
 */

require_once __DIR__ . '/BaseModel.php';

class OrderModel extends BaseModel {
    protected string $table = 'orders';

    public function __construct() {
        parent::__construct();
    }

    // ── FELHASZNÁLÓ RENDELÉSEI ─────────────────────────────────────────────

    public function getUserOrders(int $userId, int $limit = 10, int $offset = 0): array {
        $sql = "
            SELECT
                o.*,
                COUNT(oi.id)                    AS items_count,
                COALESCE(SUM(oi.total_amount),0) AS items_total
            FROM {$this->table} o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?
        ";
        return $this->query($sql, [$userId, $limit, $offset], 'iii');
    }

    public function countUserOrders(int $userId): int {
        $result = $this->queryOne(
            "SELECT COUNT(*) AS total FROM {$this->table} WHERE user_id = ?",
            [$userId], 'i'
        );
        return (int)($result['total'] ?? 0);
    }

    // ── RENDELÉS RÉSZLETEI ────────────────────────────────────────────────

    public function getOrderDetails(int $orderId): ?array {
        $order = $this->queryOne("
            SELECT o.* FROM {$this->table} o WHERE o.id = ?
        ", [$orderId], 'i');

        if (!$order) return null;

        $items = $this->query("
            SELECT
                oi.*,
                p.name      AS product_name,
                p.sku,
                p.image_url
            FROM order_items oi
            LEFT JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = ?
        ", [$orderId], 'i');

        $order['items'] = $items;
        $order['items_total'] = array_sum(array_column($items, 'total_amount'));

        return $order;
    }

    // ── RENDELÉS LÉTREHOZÁSA (TRANZAKCIÓBAN) ──────────────────────────────

    public function createOrderWithItems(array $orderData, array $items): int {
        $this->db->begin_transaction();

        try {
            // 1. Fejléc mentése az `orders` táblába
            $orderId = $this->create($orderData);

            // 2. Tételek mentése az `order_items` táblába
            $stmt = $this->db->prepare("
                INSERT INTO order_items
                    (order_id, product_id, quantity, unit_price, total_amount)
                VALUES (?, ?, ?, ?, ?)
            ");

            foreach ($items as $item) {
                $stmt->bind_param(
                    'iiiii',
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

    // ── STÁTUSZ FRISSÍTÉS ─────────────────────────────────────────────────

    public function updateStatus(int $orderId, string $status): bool {
        return $this->update($orderId, ['status' => $status]);
    }

    // ── ADMIN: ÖSSZES RENDELÉS ────────────────────────────────────────────

    public function getAllOrders(array $filters = []): array {
        $where  = "WHERE 1=1";
        $params = [];
        $types  = '';

        if (!empty($filters['status'])) {
            $where .= " AND o.status = ?";
            $params[] = $filters['status'];
            $types   .= 's';
        }
        if (!empty($filters['from_date'])) {
            $where .= " AND o.created_at >= ?";
            $params[] = $filters['from_date'];
            $types   .= 's';
        }
        if (!empty($filters['to_date'])) {
            $where .= " AND o.created_at <= ?";
            $params[] = $filters['to_date'] . ' 23:59:59';
            $types   .= 's';
        }
        if (!empty($filters['search'])) {
            $where .= " AND (o.name LIKE ? OR o.email LIKE ? OR o.id = ?)";
            $s = '%' . $filters['search'] . '%';
            $params[] = $s; $params[] = $s;
            $params[] = (int)$filters['search'];
            $types   .= 'ssi';
        }

        $limit  = (int)($filters['limit']  ?? 20);
        $offset = (int)($filters['offset'] ?? 0);

        $sql = "
            SELECT
                o.*,
                COUNT(oi.id)                    AS items_count,
                COALESCE(SUM(oi.total_amount),0) AS items_total,
                CASE
                    WHEN o.gross_total IS NULL OR o.gross_total = 0
                        THEN COALESCE(SUM(oi.total_amount), 0)
                    ELSE o.gross_total
                END                              AS display_total,
                u.full_name                      AS user_full_name,
                u.email                          AS user_email
            FROM {$this->table} o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            LEFT JOIN users u        ON u.id = o.user_id
            {$where}
            GROUP BY o.id
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?
        ";

        $params[] = $limit;
        $params[] = $offset;
        $types   .= 'ii';

        return $this->query($sql, $params, $types);
    }

    // ── ADMIN: RENDELÉS SZÁM ──────────────────────────────────────────────

    public function countOrders(array $filters = []): int {
        $where  = "WHERE 1=1";
        $params = [];
        $types  = '';

        if (!empty($filters['status'])) {
            $where .= " AND status = ?";
            $params[] = $filters['status'];
            $types   .= 's';
        }
        if (!empty($filters['from_date'])) {
            $where .= " AND created_at >= ?";
            $params[] = $filters['from_date'];
            $types   .= 's';
        }
        if (!empty($filters['to_date'])) {
            $where .= " AND created_at <= ?";
            $params[] = $filters['to_date'] . ' 23:59:59';
            $types   .= 's';
        }

        $sql    = "SELECT COUNT(*) AS total FROM {$this->table} {$where}";
        $result = $this->queryOne($sql, $params, $types);
        return (int)($result['total'] ?? 0);
    }

    // ── ADMIN: STATISZTIKA ────────────────────────────────────────────────

    public function getStatistics(): array {
        $row = $this->queryOne("
            SELECT
                COUNT(DISTINCT o.id)                                          AS total_orders,
                COALESCE(SUM(oi.total_amount), 0)                            AS total_revenue,
                SUM(CASE WHEN o.status = 'uj'         THEN 1 ELSE 0 END)    AS pending_orders,
                SUM(CASE WHEN o.status = 'teljesitve' THEN 1 ELSE 0 END)    AS completed_orders
            FROM {$this->table} o
            LEFT JOIN order_items oi ON oi.order_id = o.id
        ");
        return $row ?: [];
    }
}
