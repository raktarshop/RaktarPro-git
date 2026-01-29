<?php
/**
 * Warehouse Model
 * Tábla: warehouses
 * Tárolt eljárások használata
 */

require_once __DIR__ . '/../config/Database.php';

class WarehouseModel {
    private mysqli $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Get warehouse by ID
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("CALL warehouses_get(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        $this->db->next_result();
        
        return $result ?: null;
    }
    
    /**
     * Get all warehouses
     */
    public function getAll(): array {
        $result = $this->db->query("CALL warehouses_get_all()");
        $warehouses = $result->fetch_all(MYSQLI_ASSOC);
        $this->db->next_result();
        
        return $warehouses;
    }
    
    /**
     * Create new warehouse
     */
    public function create(array $data): int {
        $stmt = $this->db->prepare("CALL warehouses_insert(?, ?, ?)");
        $stmt->bind_param(
            "ssi",
            $data['name'],
            $data['address'],
            $data['manager_id']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $insertId = $result['inserted_id'];
        $stmt->close();
        $this->db->next_result();
        
        return $insertId;
    }
    
    /**
     * Update warehouse
     */
    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("CALL warehouses_update(?, ?, ?, ?)");
        $stmt->bind_param(
            "issi",
            $id,
            $data['name'],
            $data['address'],
            $data['manager_id']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Delete warehouse
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("CALL warehouses_delete(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Get warehouse with manager details
     */
    public function getWithManager(int $id): ?array {
        $stmt = $this->db->prepare("
            SELECT 
                w.*,
                u.full_name as manager_name,
                u.email as manager_email
            FROM warehouses w
            LEFT JOIN users u ON u.id = w.manager_id
            WHERE w.id = ?
        ");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result ?: null;
    }
    
    /**
     * Get locations count for warehouse
     */
    public function getLocationsCount(int $id): int {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM locations WHERE warehouse_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return (int)$result['count'];
    }
    
    /**
     * Check if warehouse has locations
     */
    public function hasLocations(int $id): bool {
        return $this->getLocationsCount($id) > 0;
    }
}
