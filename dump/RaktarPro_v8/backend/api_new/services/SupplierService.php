<?php
require_once __DIR__ . '/../models/SupplierModel.php';
require_once __DIR__ . '/../utils/Validator.php';

class SupplierService {
    private SupplierModel $supplierModel;
    
    public function __construct() {
        $this->supplierModel = new SupplierModel();
    }
    
    public function getAllSuppliers(): array {
        return $this->supplierModel->getAll();
    }
    
    public function getSupplierById(int $id): ?array {
        $supplier = $this->supplierModel->getById($id);
        if (!$supplier) {
            throw new Exception('Beszállító nem található');
        }
        return $supplier;
    }
    
    public function createSupplier(array $data): int {
        // Validáció
        $errors = Validator::required($data, ['name', 'contact_name', 'contact_email', 'phone']);
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        if (!Validator::isEmail($data['contact_email'])) {
            throw new Exception('Érvénytelen email cím');
        }
        
        // Adat előkészítés
        $supplierData = [
            'name' => Validator::sanitizeString($data['name']),
            'contact_name' => Validator::sanitizeString($data['contact_name']),
            'contact_email' => Validator::sanitizeString($data['contact_email']),
            'phone' => Validator::sanitizeString($data['phone']),
            'address' => Validator::sanitizeString($data['address'] ?? '')
        ];
        
        return $this->supplierModel->create($supplierData);
    }
    
    public function updateSupplier(int $id, array $data): bool {
        $supplier = $this->getSupplierById($id);
        
        // Email validáció ha meg van adva
        if (isset($data['contact_email']) && !Validator::isEmail($data['contact_email'])) {
            throw new Exception('Érvénytelen email cím');
        }
        
        $updateData = [
            'name' => Validator::sanitizeString($data['name'] ?? $supplier['name']),
            'contact_name' => Validator::sanitizeString($data['contact_name'] ?? $supplier['contact_name']),
            'contact_email' => Validator::sanitizeString($data['contact_email'] ?? $supplier['contact_email']),
            'phone' => Validator::sanitizeString($data['phone'] ?? $supplier['phone']),
            'address' => Validator::sanitizeString($data['address'] ?? $supplier['address'])
        ];
        
        return $this->supplierModel->update($id, $updateData);
    }
    
    public function deleteSupplier(int $id): bool {
        $this->getSupplierById($id);
        
        if ($this->supplierModel->hasProducts($id)) {
            throw new Exception('A beszállító nem törölhető, mert vannak hozzá tartozó termékek');
        }
        
        return $this->supplierModel->delete($id);
    }
    
    public function searchSuppliers(string $query): array {
        if (empty($query)) {
            throw new Exception('Keresési kifejezés szükséges');
        }
        return $this->supplierModel->search($query);
    }
}
