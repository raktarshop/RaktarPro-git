<?php
require_once __DIR__ . '/../models/StockModel.php';
require_once __DIR__ . '/../utils/Validator.php';

class StockService {
    private StockModel $stockModel;
    
    public function __construct() {
        $this->stockModel = new StockModel();
    }
    
    public function getAllStock(): array {
        return $this->stockModel->getAll();
    }
    
    public function getStockById(int $id): ?array {
        $stock = $this->stockModel->getWithDetails($id);
        if (!$stock) {
            throw new Exception('Készlet tétel nem található');
        }
        return $stock;
    }
    
    public function createStock(array $data): int {
        $errors = Validator::required($data, ['product_id', 'location_id', 'quantity']);
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        // Validáció: mennyiség nem lehet negatív
        if ($data['quantity'] < 0) {
            throw new Exception('A mennyiség nem lehet negatív');
        }
        
        $stockData = [
            'product_id' => (int)$data['product_id'],
            'location_id' => (int)$data['location_id'],
            'quantity' => (int)$data['quantity'],
            'reserved_quantity' => (int)($data['reserved_quantity'] ?? 0),
            'reorder_level' => (int)($data['reorder_level'] ?? 0)
        ];
        
        return $this->stockModel->create($stockData);
    }
    
    public function updateStock(int $id, array $data): bool {
        $stock = $this->stockModel->getById($id);
        if (!$stock) {
            throw new Exception('Készlet tétel nem található');
        }
        
        $updateData = [
            'product_id' => isset($data['product_id']) ? (int)$data['product_id'] : $stock['product_id'],
            'location_id' => isset($data['location_id']) ? (int)$data['location_id'] : $stock['location_id'],
            'quantity' => isset($data['quantity']) ? (int)$data['quantity'] : $stock['quantity'],
            'reserved_quantity' => isset($data['reserved_quantity']) ? (int)$data['reserved_quantity'] : $stock['reserved_quantity'],
            'reorder_level' => isset($data['reorder_level']) ? (int)$data['reorder_level'] : $stock['reorder_level']
        ];
        
        // Validáció
        if ($updateData['quantity'] < 0 || $updateData['reserved_quantity'] < 0) {
            throw new Exception('A mennyiségek nem lehetnek negatívak');
        }
        
        return $this->stockModel->update($id, $updateData);
    }
    
    public function deleteStock(int $id): bool {
        $this->getStockById($id);
        return $this->stockModel->delete($id);
    }
    
    // Speciális funkciók
    
    public function increaseQuantity(int $id, int $amount): bool {
        if ($amount <= 0) {
            throw new Exception('Érvényes mennyiség szükséges');
        }
        
        $this->getStockById($id);
        return $this->stockModel->increaseQuantity($id, $amount);
    }
    
    public function decreaseQuantity(int $id, int $amount): bool {
        if ($amount <= 0) {
            throw new Exception('Érvényes mennyiség szükséges');
        }
        
        $stock = $this->getStockById($id);
        $availableQty = $stock['quantity'] - $stock['reserved_quantity'];
        
        if ($amount > $availableQty) {
            throw new Exception('Nincs elegendő elérhető készlet');
        }
        
        return $this->stockModel->decreaseQuantity($id, $amount);
    }
    
    public function moveStock(int $fromLocationId, int $toLocationId, int $productId, int $quantity): bool {
        $errors = Validator::required([
            'from_location_id' => $fromLocationId,
            'to_location_id' => $toLocationId,
            'product_id' => $productId,
            'quantity' => $quantity
        ], ['from_location_id', 'to_location_id', 'product_id', 'quantity']);
        
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        if ($quantity <= 0) {
            throw new Exception('A mennyiségnek pozitívnak kell lennie');
        }
        
        if ($fromLocationId === $toLocationId) {
            throw new Exception('A forrás és cél hely nem lehet ugyanaz');
        }
        
        return $this->stockModel->moveStock($fromLocationId, $toLocationId, $productId, $quantity);
    }
    
    public function getStockByProduct(int $productId): array {
        return $this->stockModel->getByProduct($productId);
    }
    
    public function getStockByLocation(int $locationId): array {
        return $this->stockModel->getByLocation($locationId);
    }
    
    public function getAlerts(): array {
        return $this->stockModel->getBelowReorderLevel();
    }
    
    public function getSummary(): array {
        return $this->stockModel->getStockSummaryByWarehouse();
    }
}
