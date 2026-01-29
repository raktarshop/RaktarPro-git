<?php
require_once __DIR__ . '/../models/RoleModel.php';
require_once __DIR__ . '/../utils/Validator.php';

class RoleService {
    private RoleModel $roleModel;
    
    public function __construct() {
        $this->roleModel = new RoleModel();
    }
    
    public function getAllRoles(): array {
        return $this->roleModel->getAllWithUserCounts();
    }
    
    public function getRoleById(int $id): ?array {
        $role = $this->roleModel->getRoleWithUserCount($id);
        if (!$role) {
            throw new Exception('Szerep nem található');
        }
        return $role;
    }
    
    public function createRole(array $data): int {
        $errors = Validator::required($data, ['name']);
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        if ($this->roleModel->nameExists($data['name'])) {
            throw new Exception('Ez a szerepnév már létezik');
        }
        
        $roleData = [
            'name' => Validator::sanitizeString($data['name']),
            'description' => Validator::sanitizeString($data['description'] ?? '')
        ];
        
        return $this->roleModel->create($roleData);
    }
    
    public function updateRole(int $id, array $data): bool {
        $role = $this->getRoleById($id);
        
        if (isset($data['name']) && $this->roleModel->nameExists($data['name'], $id)) {
            throw new Exception('Ez a szerepnév már létezik');
        }
        
        $updateData = [
            'name' => Validator::sanitizeString($data['name'] ?? $role['name']),
            'description' => Validator::sanitizeString($data['description'] ?? $role['description'])
        ];
        
        return $this->roleModel->update($id, $updateData);
    }
    
    public function deleteRole(int $id): bool {
        $this->getRoleById($id);
        
        if ($this->roleModel->hasUsers($id)) {
            throw new Exception('A szerep nem törölhető, mert vannak hozzárendelt felhasználók');
        }
        
        return $this->roleModel->delete($id);
    }
}
