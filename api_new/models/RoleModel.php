<?php
/**
 * Role Model
 * Tábla: roles
 * Szerepkörök kezelése
 */

require_once __DIR__ . '/../config/Database.php';

class RoleModel {
    private mysqli $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Get role by ID
     */
    public function getById(int $id): ?array {
        $stmt = $this->db->prepare("CALL roles_get(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        $this->db->next_result();
        
        return $result ?: null;
    }
    
    /**
     * Get all roles
     */
    public function getAll(): array {
        $result = $this->db->query("CALL roles_get_all()");
        $roles = $result->fetch_all(MYSQLI_ASSOC);
        $this->db->next_result();
        
        return $roles;
    }
    
    /**
     * Create new role
     */
    public function create(array $data): int {
        $stmt = $this->db->prepare("CALL roles_insert(?, ?)");
        $stmt->bind_param(
            "ss",
            $data['name'],
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
     * Update role
     */
    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare("CALL roles_update(?, ?, ?)");
        $stmt->bind_param(
            "iss",
            $id,
            $data['name'],
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
     * Delete role
     */
    public function delete(int $id): bool {
        $stmt = $this->db->prepare("CALL roles_delete(?)");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        $affected = $result['affected_rows'] > 0;
        $stmt->close();
        $this->db->next_result();
        
        return $affected;
    }
    
    /**
     * Get role by name
     */
    public function getByName(string $name): ?array {
        $stmt = $this->db->prepare("SELECT * FROM roles WHERE name = ? LIMIT 1");
        $stmt->bind_param("s", $name);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result ?: null;
    }
    
    /**
     * Check if role name exists
     */
    public function nameExists(string $name, ?int $excludeId = null): bool {
        if ($excludeId) {
            $stmt = $this->db->prepare("SELECT id FROM roles WHERE name = ? AND id != ?");
            $stmt->bind_param("si", $name, $excludeId);
        } else {
            $stmt = $this->db->prepare("SELECT id FROM roles WHERE name = ?");
            $stmt->bind_param("s", $name);
        }
        
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result !== null;
    }
    
    /**
     * Get role with user count
     */
    public function getRoleWithUserCount(int $id): ?array {
        $stmt = $this->db->prepare("
            SELECT 
                r.*,
                COUNT(u.id) as user_count
            FROM roles r
            LEFT JOIN users u ON u.role_id = r.id
            WHERE r.id = ?
            GROUP BY r.id
        ");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result ?: null;
    }
    
    /**
     * Get all roles with user counts
     */
    public function getAllWithUserCounts(): array {
        $stmt = $this->db->query("
            SELECT 
                r.*,
                COUNT(u.id) as user_count
            FROM roles r
            LEFT JOIN users u ON u.role_id = r.id
            GROUP BY r.id
            ORDER BY r.name ASC
        ");
        
        return $stmt->fetch_all(MYSQLI_ASSOC);
    }
    
    /**
     * Check if role has users
     */
    public function hasUsers(int $id): bool {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM users WHERE role_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        return $result['count'] > 0;
    }
    
    /**
     * Get users by role
     */
    public function getUsersByRole(int $roleId): array {
        $stmt = $this->db->prepare("
            SELECT id, email, full_name, company_name, created_at 
            FROM users 
            WHERE role_id = ?
            ORDER BY full_name ASC
        ");
        $stmt->bind_param("i", $roleId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        
        return $result;
    }
}
