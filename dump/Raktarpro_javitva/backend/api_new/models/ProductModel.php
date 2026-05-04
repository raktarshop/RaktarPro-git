<?php
/**
 * Product Model – RaktárPro
 * avg_rating és review_count mindig a product_reviews JOIN-ból jön,
 * NEM p.avg_rating / p.review_count oszlopokból (nem feltétlenül léteznek).
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/BaseModel.php';

class ProductModel extends BaseModel {
    protected string $table = 'products';

    public function __construct() {
        parent::__construct();
    }

    // ── STORED PROCEDURE WRAPPERS ──────────────────────────────────────────

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("CALL products_get(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        $this->db->next_result();
        return $result ?: null;
    }

    public function getAll(): array {
        $result = $this->db->query("CALL products_get_all()");
        $products = $result->fetch_all(MYSQLI_ASSOC);
        $this->db->next_result();
        return $products;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare("CALL products_insert(?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssssiiidi",
            $data['sku'], $data['name'], $data['description'],
            $data['image_url'], $data['category_id'], $data['supplier_id'],
            $data['unit_price'], $data['weight'], $data['stock']
        );
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $insertId = $result['inserted_id'];
        $stmt->close();
        $this->db->next_result();
        return $insertId;
    }

    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("CALL products_update(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "issssiiidi",
            $id, $data['sku'], $data['name'], $data['description'],
            $data['image_url'], $data['category_id'], $data['supplier_id'],
            $data['unit_price'], $data['weight'], $data['stock']
        );
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        return $affected;
    }

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

    // ── RATING SUBQUERY – újrafelhasználható, nem hivatkozik p.avg_rating-re ──

    private function ratingSubquery(): string {
        return "LEFT JOIN (
            SELECT product_id,
                   ROUND(AVG(rating), 2) AS avg_r,
                   COUNT(*)              AS cnt
            FROM product_reviews
            WHERE rating IS NOT NULL
            GROUP BY product_id
        ) r ON r.product_id = p.id";
    }

    private function ratingSelect(): string {
        return "COALESCE(r.avg_r, 0)   AS avg_rating,
                COALESCE(r.cnt,   0)   AS review_count";
    }

    // ── getProducts – szűrők, rendezés, lapozás ────────────────────────────

    public function getProducts(array $filters = []): array {
        $where  = "WHERE 1=1";
        $params = [];
        $types  = '';

        if (!empty($filters['search'])) {
            $where .= " AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)";
            $s = '%' . $filters['search'] . '%';
            $params[] = $s; $params[] = $s; $params[] = $s;
            $types .= 'sss';
        }

        if (!empty($filters['category_id'])) {
            $where .= " AND p.category_id = ?";
            $params[] = (int)$filters['category_id'];
            $types .= 'i';
        }

        if (isset($filters['price_min']) && $filters['price_min'] !== '') {
            $where .= " AND p.unit_price >= ?";
            $params[] = (float)$filters['price_min'];
            $types .= 'd';
        }
        if (isset($filters['price_max']) && $filters['price_max'] !== '') {
            $where .= " AND p.unit_price <= ?";
            $params[] = (float)$filters['price_max'];
            $types .= 'd';
        }

        if (!empty($filters['min_rating'])) {
            $where .= " AND COALESCE(r.avg_r, 0) >= ?";
            $params[] = (float)$filters['min_rating'];
            $types .= 'd';
        }

        if (!empty($filters['in_stock'])) {
            $where .= " AND p.stock > 0";
        }

        // rating_desc rendez az alias alapján – biztonságos mert mi generáljuk
        $orderBy = match($filters['sort'] ?? 'newest') {
            'price_asc'   => 'p.unit_price ASC',
            'price_desc'  => 'p.unit_price DESC',
            'name_asc'    => 'p.name ASC',
            'name_desc'   => 'p.name DESC',
            'rating_desc' => 'COALESCE(r.avg_r, 0) DESC',
            'newest'      => 'p.created_at DESC',
            default       => 'p.id DESC'
        };

        $limit  = (int)($filters['limit']  ?? 100);
        $offset = (int)($filters['offset'] ?? 0);

        $sql = "
            SELECT
                p.*,
                c.name AS category_name,
                s.name AS supplier_name,
                {$this->ratingSelect()}
            FROM {$this->table} p
            LEFT JOIN categories c ON c.id = p.category_id
            LEFT JOIN suppliers  s ON s.id = p.supplier_id
            {$this->ratingSubquery()}
            {$where}
            ORDER BY {$orderBy}
            LIMIT ? OFFSET ?
        ";

        $params[] = $limit;
        $params[] = $offset;
        $types   .= 'ii';

        return $this->query($sql, $params, $types);
    }

    // ── countProducts ──────────────────────────────────────────────────────

    public function countProducts(array $filters = []): int {
        $where  = "WHERE 1=1";
        $params = [];
        $types  = '';

        if (!empty($filters['search'])) {
            $where .= " AND (name LIKE ? OR description LIKE ? OR sku LIKE ?)";
            $s = '%' . $filters['search'] . '%';
            $params[] = $s; $params[] = $s; $params[] = $s;
            $types .= 'sss';
        }
        if (!empty($filters['category_id'])) {
            $where .= " AND category_id = ?";
            $params[] = (int)$filters['category_id'];
            $types .= 'i';
        }

        $sql    = "SELECT COUNT(*) AS total FROM {$this->table} {$where}";
        $result = $this->queryOne($sql, $params, $types);
        return (int)($result['total'] ?? 0);
    }

    // ── getProductDetails – egyedi termék ─────────────────────────────────

    public function getProductDetails(int $id): ?array {
        return $this->queryOne("
            SELECT
                p.*,
                c.id   AS category_id,
                c.name AS category_name,
                s.id   AS supplier_id,
                s.name AS supplier_name,
                {$this->ratingSelect()}
            FROM {$this->table} p
            LEFT JOIN categories c ON c.id = p.category_id
            LEFT JOIN suppliers  s ON s.id = p.supplier_id
            {$this->ratingSubquery()}
            WHERE p.id = ?
        ", [$id], 'i');
    }

    // ── SKU ellenőrzés ─────────────────────────────────────────────────────

    public function skuExists(string $sku, ?int $excludeId = null): bool {
        if ($excludeId) {
            $result = $this->queryOne(
                "SELECT id FROM {$this->table} WHERE sku = ? AND id != ?",
                [$sku, $excludeId], 'si'
            );
        } else {
            $result = $this->queryOne(
                "SELECT id FROM {$this->table} WHERE sku = ?",
                [$sku], 's'
            );
        }
        return $result !== null;
    }

    // ── Készlet frissítés ──────────────────────────────────────────────────

    public function updateStock(int $id, int $quantity): bool {
        return $this->update($id, ['stock' => $quantity]);
    }

    public function decreaseStock(int $id, int $quantity): bool {
        $sql  = "UPDATE {$this->table} SET stock = GREATEST(stock - ?, 0) WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param("ii", $quantity, $id);
        $ok   = $stmt->execute();
        $stmt->close();
        return $ok;
    }

    // ── getByIds – kosárhoz / kedvencekhez ─────────────────────────────────

    public function getByIds(array $ids): array {
        if (empty($ids)) return [];
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $types        = str_repeat('i', count($ids));

        $sql = "
            SELECT
                p.*,
                c.name AS category_name,
                {$this->ratingSelect()}
            FROM {$this->table} p
            LEFT JOIN categories c ON c.id = p.category_id
            {$this->ratingSubquery()}
            WHERE p.id IN ({$placeholders})
        ";

        return $this->query($sql, $ids, $types);
    }
}
