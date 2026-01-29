<?php
/**
 * Base Model
 * Minden model ebből az osztályból örököl
 * Tartalmazza az alap CRUD műveleteket
 */

require_once __DIR__ . '/../config/Database.php';

abstract class BaseModel {
    protected mysqli $db;
    protected string $table; // Ezt a child classok állítják be
    protected string $primaryKey = 'id';
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Find by ID
     */
    public function find(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE {$this->primaryKey} = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result ?: null;
    }
    
    /**
     * Find all with pagination
     */
    public function findAll(int $limit = 100, int $offset = 0): array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} LIMIT ? OFFSET ?");
        $stmt->bind_param("ii", $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Count total records
     */
    public function count(): int {
        $result = $this->db->query("SELECT COUNT(*) as total FROM {$this->table}")->fetch_assoc();
        return (int)$result['total'];
    }
    
    /**
     * Create new record
     */
    public function create(array $data): int {
        $fields = array_keys($data);
        $placeholders = implode(',', array_fill(0, count($fields), '?'));
        $fieldNames = implode(',', $fields);
        
        $sql = "INSERT INTO {$this->table} ({$fieldNames}) VALUES ({$placeholders})";
        $stmt = $this->db->prepare($sql);
        
        // Bind parameters dinamikusan
        $types = '';
        $values = [];
        foreach ($data as $value) {
            if (is_int($value)) $types .= 'i';
            elseif (is_float($value)) $types .= 'd';
            else $types .= 's';
            $values[] = $value;
        }
        
        $stmt->bind_param($types, ...$values);
        $stmt->execute();
        $insertId = $stmt->insert_id;
        $stmt->close();
        
        return $insertId;
    }
    
    /**
     * Update record
     */
    public function update(int $id, array $data): bool {
        $sets = [];
        $values = [];
        $types = '';
        
        foreach ($data as $key => $value) {
            $sets[] = "{$key} = ?";
            $values[] = $value;
            if (is_int($value)) $types .= 'i';
            elseif (is_float($value)) $types .= 'd';
            else $types .= 's';
        }
        
        $sql = "UPDATE {$this->table} SET " . implode(', ', $sets) . " WHERE {$this->primaryKey} = ?";
        $values[] = $id;
        $types .= 'i';
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param($types, ...$values);
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Delete record
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE {$this->primaryKey} = ?");
        $stmt->bind_param("i", $id);
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Custom query helper
     */
    protected function query(string $sql, array $params = [], string $types = ''): array {
        $stmt = $this->db->prepare($sql);
        
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Custom query single row
     */
    protected function queryOne(string $sql, array $params = [], string $types = ''): ?array {
        $stmt = $this->db->prepare($sql);
        
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result ?: null;
    }
}
