<?php
/**
 * Supplier Model
 * Tábla: suppliers
 * Tárolt eljárások használata
 */

require_once __DIR__ . '/../config/Database.php';

class SupplierModel {
    private mysqli $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Get supplier by ID using stored procedure
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("CALL suppliers_get(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        $this->db->next_result(); // Clear multi-query
        
        return $result ?: null;
    }
    
    /**
     * Get all suppliers using stored procedure
     */
    public function getAll(): array {
        $result = $this->db->query("CALL suppliers_get_all()");
        $suppliers = $result->fetch_all(MYSQLI_ASSOC);
        $this->db->next_result();
        
        return $suppliers;
    }
    
    /**
     * Create new supplier using stored procedure
     */
    public function create(array $data): int {
        $stmt = $this->db->prepare("CALL suppliers_insert(?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "sssss",
            $data['name'],
            $data['contact_name'],
            $data['contact_email'],
            $data['phone'],
            $data['address']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $insertId = $result['inserted_id'];
        $stmt->close();
        $this->db->next_result();
        
        return $insertId;
    }
    
    /**
     * Update supplier using stored procedure
     */
    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("CALL suppliers_update(?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "isssss",
            $id,
            $data['name'],
            $data['contact_name'],
            $data['contact_email'],
            $data['phone'],
            $data['address']
        );
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Delete supplier using stored procedure
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("CALL suppliers_delete(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Check if supplier has products
     */
    public function hasProducts(int $id): bool {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM products WHERE supplier_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result['count'] > 0;
    }
    
    /**
     * Search suppliers by name
     */
    public function search(string $query): array {
        $search = "%{$query}%";
        $stmt = $this->db->prepare("
            SELECT * FROM suppliers 
            WHERE name LIKE ? OR contact_name LIKE ? OR contact_email LIKE ?
            ORDER BY name ASC
        ");
        $stmt->bind_param("sss", $search, $search, $search);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $result;
    }
}
