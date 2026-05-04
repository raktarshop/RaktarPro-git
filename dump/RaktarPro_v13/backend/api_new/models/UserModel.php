<?php
/**
 * User Model
 * Tábla: users
 * Mezők: id, email, password_hash, full_name, company_name, role_id, created_at, updated_at
 */

require_once __DIR__ . '/BaseModel.php';

class UserModel extends BaseModel {
    protected string $table = 'users';
    
    public function __construct() {
        parent::__construct();
    }
    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?array {
        return $this->queryOne(
            "SELECT * FROM {$this->table} WHERE email = ?",
            [$email],
            's'
        );
    }
    
    /**
     * Check if email exists
     */
    public function emailExists(string $email, ?int $excludeId = null): bool {
        if ($excludeId) {
            $result = $this->queryOne(
                "SELECT id FROM {$this->table} WHERE email = ? AND id != ?",
                [$email, $excludeId],
                'si'
            );
        } else {
            $result = $this->queryOne(
                "SELECT id FROM {$this->table} WHERE email = ?",
                [$email],
                's'
            );
        }
        
        return $result !== null;
    }
    
    /**
     * Create user with password hashing
     */
    public function createUser(string $email, string $password, string $fullName, ?string $companyName = null): int {
        $data = [
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'full_name' => $fullName,
            'company_name' => $companyName,
            'role_id' => 3, // default user role
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        return $this->create($data);
    }
    
    /**
     * Update password
     */
    public function updatePassword(int $id, string $newPassword): bool {
        return $this->update($id, [
            'password_hash' => password_hash($newPassword, PASSWORD_DEFAULT),
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }
    
    /**
     * Verify password
     */
    public function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }
    
    /**
     * Get user with role name
     */
    public function getUserWithRole(int $id): ?array {
        return $this->queryOne("
            SELECT u.*, r.name as role_name
            FROM {$this->table} u
            LEFT JOIN roles r ON r.id = u.role_id
            WHERE u.id = ?
        ", [$id], 'i');
    }
    
    /**
     * Is user admin?
     */
    public function isAdmin(int $userId): bool {
        $user = $this->find($userId);
        return $user && (int)$user['role_id'] === 1;
    }
}
