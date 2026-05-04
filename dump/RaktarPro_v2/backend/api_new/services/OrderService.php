<?php
/**
 * Order Service
 * Rendelés business logic (kosár -> checkout -> order)
 */

require_once __DIR__ . '/../models/OrderModel.php';
require_once __DIR__ . '/../models/ProductModel.php';
require_once __DIR__ . '/../utils/Validator.php';

class OrderService {
    
    private OrderModel $orderModel;
    private ProductModel $productModel;
    
    public function __construct() {
        $this->orderModel = new OrderModel();
        $this->productModel = new ProductModel();
    }
    
    /**
     * Get user orders
     */
    public function getUserOrders(int $userId, array $filters = []): array {
        $pagination = Validator::getPaginationParams($filters);
        
        $orders = $this->orderModel->getUserOrders(
            $userId,
            $pagination['limit'],
            $pagination['offset']
        );
        
        $total = $this->orderModel->countUserOrders($userId);
        
        return [
            'orders' => $orders,
            'pagination' => [
                'page' => $pagination['page'],
                'limit' => $pagination['limit'],
                'total' => $total,
                'pages' => ceil($total / $pagination['limit'])
            ]
        ];
    }
    
    /**
     * Get order details
     */
    public function getOrderDetails(int $orderId, int $userId): ?array {
        $order = $this->orderModel->getOrderDetails($orderId);
        
        if (!$order) {
            return null;
        }
        
        // Check ownership
        if ((int)$order['user_id'] !== $userId) {
            throw new Exception('Nincs jogosultság ehhez a rendeléshez');
        }
        
        return $order;
    }
    
    /**
     * Create order from cart (CHECKOUT)
     */
    public function createOrder(array $orderData, array $cartItems, ?int $userId = null): int {
        // Validate order data
        $errors = Validator::required($orderData, ['name', 'email', 'address', 'payment_method']);
        
        if (!empty($errors)) {
            throw new Exception(json_encode($errors));
        }
        
        if (empty($cartItems)) {
            throw new Exception('A kosár üres');
        }
        
        // Validate email
        if (!Validator::email($orderData['email'])) {
            throw new Exception('Érvénytelen email cím');
        }
        
        // Get products from DB
        $productIds = array_column($cartItems, 'product_id');
        $products = $this->productModel->getByIds($productIds);
        
        // Create product map
        $productMap = [];
        foreach ($products as $product) {
            $productMap[$product['id']] = $product;
        }
        
        // Validate stock and calculate total
        $items = [];
        $total = 0;
        
        foreach ($cartItems as $cartItem) {
            $productId = (int)$cartItem['product_id'];
            $quantity = (int)$cartItem['quantity'];
            
            if (!isset($productMap[$productId])) {
                throw new Exception("Termék nem található: {$productId}");
            }
            
            $product = $productMap[$productId];
            $stock = (int)$product['stock'];
            
            if ($quantity > $stock) {
                throw new Exception("Nincs elegendő készlet: {$product['name']} (van: {$stock}, kért: {$quantity})");
            }
            
            $unitPrice = (int)$product['unit_price'];
            $subtotal = $unitPrice * $quantity;
            $total += $subtotal;
            
            $items[] = [
                'product_id' => $productId,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_amount' => $subtotal
            ];
        }
        
        // Prepare order data
        $orderInsertData = [
            'user_id' => $userId,
            'name' => Validator::sanitizeString($orderData['name']),
            'email' => Validator::sanitizeString($orderData['email']),
            'address' => Validator::sanitizeString($orderData['address']),
            'payment_method' => Validator::sanitizeString($orderData['payment_method']),
            'gross_total' => $total,
            'status' => 'uj',
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        // Create order with transaction
        $orderId = $this->orderModel->createOrderWithItems($orderInsertData, $items);
        
        // Decrease stock
        foreach ($items as $item) {
            $this->productModel->decreaseStock($item['product_id'], $item['quantity']);
        }
        
        return $orderId;
    }
    
    /**
     * Get all orders (ADMIN)
     */
    public function getAllOrders(array $filters = []): array {
        $pagination = Validator::getPaginationParams($filters);
        
        $orders = $this->orderModel->getAllOrders([
            'status' => $filters['status'] ?? null,
            'from_date' => $filters['from_date'] ?? null,
            'to_date' => $filters['to_date'] ?? null,
            'search' => $filters['search'] ?? null,
            'limit' => $pagination['limit'],
            'offset' => $pagination['offset']
        ]);
        
        $total = $this->orderModel->countOrders([
            'status' => $filters['status'] ?? null,
            'from_date' => $filters['from_date'] ?? null,
            'to_date' => $filters['to_date'] ?? null
        ]);
        
        $statistics = $this->orderModel->getStatistics();
        
        return [
            'orders' => $orders,
            'statistics' => $statistics,
            'pagination' => [
                'page' => $pagination['page'],
                'limit' => $pagination['limit'],
                'total' => $total,
                'pages' => ceil($total / $pagination['limit'])
            ]
        ];
    }
    
    /**
     * Update order status (ADMIN)
     */
    public function updateOrderStatus(int $orderId, string $status): bool {
        $validStatuses = ['uj', 'feldolgozas', 'kiszallitva', 'teljesitve', 'torolve'];
        
        if (!in_array($status, $validStatuses)) {
            throw new Exception('Érvénytelen státusz');
        }
        
        $order = $this->orderModel->find($orderId);
        if (!$order) {
            throw new Exception('Rendelés nem található');
        }
        
        return $this->orderModel->updateStatus($orderId, $status);
    }
}
