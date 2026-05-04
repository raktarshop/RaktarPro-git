<?php
require_once __DIR__ . '/../models/LocationModel.php';
require_once __DIR__ . '/../utils/Validator.php';

class LocationService {
    private LocationModel $locationModel;
    
    public function __construct() {
        $this->locationModel = new LocationModel();
    }
    
    public function getAllLocations(): array {
        return $this->locationModel->getAll();
    }
    
    public function getLocationById(int $id): ?array {
        $location = $this->locationModel->getWithWarehouse($id);
        if (!$location) {
            throw new Exception('Hely nem található');
        }
        return $location;
    }
    
    public function createLocation(array $data): int {
        $errors = Validator::required($data, ['warehouse_id', 'code']);
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        // Kód egyediség ellenőrzés
        if ($this->locationModel->codeExistsInWarehouse($data['code'], $data['warehouse_id'])) {
            throw new Exception('Ez a kód már létezik ebben a raktárban');
        }
        
        $locationData = [
            'warehouse_id' => (int)$data['warehouse_id'],
            'code' => Validator::sanitizeString($data['code']),
            'description' => Validator::sanitizeString($data['description'] ?? '')
        ];
        
        return $this->locationModel->create($locationData);
    }
    
    public function updateLocation(int $id, array $data): bool {
        $location = $this->locationModel->getById($id);
        if (!$location) {
            throw new Exception('Hely nem található');
        }
        
        $updateData = [
            'warehouse_id' => isset($data['warehouse_id']) ? (int)$data['warehouse_id'] : $location['warehouse_id'],
            'code' => Validator::sanitizeString($data['code'] ?? $location['code']),
            'description' => Validator::sanitizeString($data['description'] ?? $location['description'])
        ];
        
        // Kód egyediség ellenőrzés
        if (isset($data['code']) && $this->locationModel->codeExistsInWarehouse($data['code'], $updateData['warehouse_id'], $id)) {
            throw new Exception('Ez a kód már létezik ebben a raktárban');
        }
        
        return $this->locationModel->update($id, $updateData);
    }
    
    public function deleteLocation(int $id): bool {
        $this->getLocationById($id);
        
        if ($this->locationModel->hasStock($id)) {
            throw new Exception('A hely nem törölhető, mert van készlet hozzárendelve');
        }
        
        return $this->locationModel->delete($id);
    }
}
