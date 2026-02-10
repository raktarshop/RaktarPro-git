<?php
/**
 * Location Model
 * Tábla: locations
 * Tárolt eljárások használata
 */

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/BaseModel.php';

class LocationModel extends BaseModel {    protected string $table = 'locations';
    
    public function __construct() {
        parent::__construct();
    }
    
    /**
     * Get location by ID
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("CALL locations_get(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        $this->db->next_result();
        
        return $result ?: null;
    }
    
    /**
     * Get all locations
     */
    public function getAll(): array {
        $result = $this->db->query("CALL locations_get_all()");
        $locations = $result->fetch_all(MYSQLI_ASSOC);
        $this->db->next_result();
        
        return $locations;
    }
    
    /**
     * Create new location
     */
    public function create(array $data): int {
        $stmt = $this->db->prepare("CALL locations_insert(?, ?, ?)");
        $stmt->bind_param(
            "iss",
            $data['warehouse_id'],
            $data['code'],
            $data['description']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $insertId = $result['inserted_id'];
        $stmt->close();
        $this->db->next_result();
        
        return $insertId;
    }
    
    /**
     * Update location
     */
    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("CALL locations_update(?, ?, ?, ?)");
        $stmt->bind_param(
            "iiss",
            $id,
            $data['warehouse_id'],
            $data['code'],
            $data['description']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Delete location
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("CALL locations_delete(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Get location with warehouse details
     */
    public function getWithWarehouse(int $id): ?array {
        $stmt = $this->db->prepare("
            SELECT 
                l.*,
                w.name as warehouse_name,
                w.address as warehouse_address
            FROM locations l
            LEFT JOIN warehouses w ON w.id = l.warehouse_id
            WHERE l.id = ?
        ");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result ?: null;
    }
    
    /**
     * Get locations by warehouse
     */
    public function getByWarehouse(int $warehouseId): array {
        $stmt = $this->db->prepare("
            SELECT * FROM locations 
            WHERE warehouse_id = ?
            ORDER BY code ASC
        ");
        $stmt->bind_param("i", $warehouseId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Check if location code exists in warehouse
     */
    public function codeExistsInWarehouse(string $code, int $warehouseId, ?int $excludeId = null): bool {
        if ($excludeId) {
            $stmt = $this->db->prepare("
                SELECT id FROM locations 
                WHERE code = ? AND warehouse_id = ? AND id != ?
            ");
            $stmt->bind_param("sii", $code, $warehouseId, $excludeId);
        } else {
            $stmt = $this->db->prepare("
                SELECT id FROM locations 
                WHERE code = ? AND warehouse_id = ?
            ");
            $stmt->bind_param("si", $code, $warehouseId);
        }
        
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result !== null;
    }
    
    /**
     * Check if location has stock
     */
    public function hasStock(int $id): bool {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM stock WHERE location_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result['count'] > 0;
    }
}
