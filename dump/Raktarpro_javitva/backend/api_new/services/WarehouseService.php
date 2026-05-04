<?php
require_once __DIR__ . '/../models/WarehouseModel.php';
require_once __DIR__ . '/../utils/Validator.php';

class WarehouseService {
    private WarehouseModel $warehouseModel;
    
    public function __construct() {
        $this->warehouseModel = new WarehouseModel();
    }
    
    public function getAllWarehouses(): array {
        return $this->warehouseModel->getAll();
    }
    
    public function getWarehouseById(int $id): ?array {
        $warehouse = $this->warehouseModel->getWithManager($id);
        if (!$warehouse) {
            throw new Exception('Raktár nem található');
        }
        return $warehouse;
    }
    
    public function createWarehouse(array $data): int {
        $errors = Validator::required($data, ['name', 'address']);
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        $warehouseData = [
            'name' => Validator::sanitizeString($data['name']),
            'address' => Validator::sanitizeString($data['address']),
            'manager_id' => isset($data['manager_id']) ? (int)$data['manager_id'] : null
        ];
        
        return $this->warehouseModel->create($warehouseData);
    }
    
    public function updateWarehouse(int $id, array $data): bool {
        $warehouse = $this->warehouseModel->getById($id);
        if (!$warehouse) {
            throw new Exception('Raktár nem található');
        }
        
        $updateData = [
            'name' => Validator::sanitizeString($data['name'] ?? $warehouse['name']),
            'address' => Validator::sanitizeString($data['address'] ?? $warehouse['address']),
            'manager_id' => isset($data['manager_id']) ? (int)$data['manager_id'] : $warehouse['manager_id']
        ];
        
        return $this->warehouseModel->update($id, $updateData);
    }
    
    public function deleteWarehouse(int $id): bool {
        $this->getWarehouseById($id);
        
        if ($this->warehouseModel->hasLocations($id)) {
            throw new Exception('A raktár nem törölhető, mert vannak hozzá tartozó helyek');
        }
        
        return $this->warehouseModel->delete($id);
    }
}
