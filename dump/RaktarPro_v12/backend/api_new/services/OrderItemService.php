<?php
require_once __DIR__ . '/../models/OrderItemModel.php';
require_once __DIR__ . '/../utils/Validator.php';

class OrderItemService {
    private OrderItemModel $orderItemModel;
    
    public function __construct() {
        $this->orderItemModel = new OrderItemModel();
    }
    
    public function getAllOrderItems(): array {
        return $this->orderItemModel->getAll();
    }
    
    public function getOrderItemById(int $id): ?array {
        $item = $this->orderItemModel->getById($id);
        if (!$item) {
            throw new Exception('Rendelési tétel nem található');
        }
        return $item;
    }
    
    public function createOrderItem(array $data): int {
        $errors = Validator::required($data, ['order_id', 'product_id', 'quantity', 'unit_price']);
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        // Validáció
        if ($data['quantity'] <= 0) {
            throw new Exception('A mennyiségnek pozitívnak kell lennie');
        }
        
        if ($data['unit_price'] < 0) {
            throw new Exception('Az egységár nem lehet negatív');
        }
        
        $itemData = [
            'order_id' => (int)$data['order_id'],
            'product_id' => (int)$data['product_id'],
            'quantity' => (int)$data['quantity'],
            'unit_price' => (int)$data['unit_price'],
            'total_amount' => (int)$data['quantity'] * (int)$data['unit_price']
        ];
        
        return $this->orderItemModel->create($itemData);
    }
    
    public function updateOrderItem(int $id, array $data): bool {
        $item = $this->getOrderItemById($id);
        
        $quantity = isset($data['quantity']) ? (int)$data['quantity'] : $item['quantity'];
        $unitPrice = isset($data['unit_price']) ? (int)$data['unit_price'] : $item['unit_price'];
        
        if ($quantity <= 0) {
            throw new Exception('A mennyiségnek pozitívnak kell lennie');
        }
        
        $updateData = [
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total_amount' => $quantity * $unitPrice
        ];
        
        return $this->orderItemModel->update($id, $updateData);
    }
    
    public function deleteOrderItem(int $id): bool {
        $this->getOrderItemById($id);
        return $this->orderItemModel->delete($id);
    }
    
    public function getItemsByOrder(int $orderId): array {
        return $this->orderItemModel->getByOrder($orderId);
    }
    
    public function getPopularProducts(int $limit = 10): array {
        return $this->orderItemModel->getMostPopularProducts($limit);
    }
}
