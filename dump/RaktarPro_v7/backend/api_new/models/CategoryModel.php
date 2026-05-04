<?php
/**
 * Category Model
 * Tábla: categories
 * Mezők: id, name, parent_id, created_at, updated_at
 */

require_once __DIR__ . '/BaseModel.php';

class CategoryModel extends BaseModel  {
    protected string $table = 'categories';
    
    public function __construct() {
        parent::__construct();
    }
    /**
     * Get all categories with product count
     */
    public function getAllWithProductCount(): array {
        return $this->query("
            SELECT 
                c.*,
                COUNT(p.id) as product_count
            FROM {$this->table} c
            LEFT JOIN products p ON p.category_id = c.id
            GROUP BY c.id
            ORDER BY c.name ASC
        ");
    }
    
    /**
     * Get category with parent info
     */
    public function getCategoryWithParent(int $id): ?array {
        return $this->queryOne("
            SELECT 
                c.*,
                parent.name as parent_name
            FROM {$this->table} c
            LEFT JOIN {$this->table} parent ON parent.id = c.parent_id
            WHERE c.id = ?
        ", [$id], 'i');
    }
    
    /**
     * Get subcategories
     */
    public function getSubcategories(int $parentId): array {
        return $this->query(
            "SELECT * FROM {$this->table} WHERE parent_id = ? ORDER BY name",
            [$parentId],
            'i'
        );
    }
    
    /**
     * Check if category has products
     */
    public function hasProducts(int $id): bool {
        $result = $this->queryOne(
            "SELECT COUNT(*) as cnt FROM products WHERE category_id = ?",
            [$id],
            'i'
        );
        
        return (int)$result['cnt'] > 0;
    }

    /**
     * Backwards-compatible wrapper: get all categories
     */
    public function getAll(): array {
        return $this->query("SELECT * FROM {$this->table} ORDER BY name ASC");
    }

    /**
     * Backwards-compatible wrapper: get by id
     */
    public function getById(int $id): ?array {
        return $this->queryOne("SELECT * FROM {$this->table} WHERE id = ?", [$id], 'i');
    }

    /**
     * Build category tree (nested children)
     */
    public function getCategoryTree(): array {
        $all = $this->query("SELECT * FROM {$this->table} ORDER BY name ASC");

        $map = [];
        foreach ($all as $row) {
            $row['children'] = [];
            $map[$row['id']] = $row;
        }

        $tree = [];
        foreach ($map as $id => $node) {
            $parentId = $node['parent_id'];
            if ($parentId !== null && $parentId !== '' && isset($map[$parentId])) {
                $map[$parentId]['children'][] = &$map[$id];
            } else {
                $tree[] = &$map[$id];
            }
        }

        return $tree;
    }

    /**
     * Check if category has child categories
     */
    public function hasChildren(int $id): bool {
        $result = $this->queryOne(
            "SELECT COUNT(*) as cnt FROM {$this->table} WHERE parent_id = ?",
            [$id],
            'i'
        );

        return (int)$result['cnt'] > 0;
    }
}
