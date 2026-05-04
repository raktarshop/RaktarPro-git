<?php
require_once __DIR__ . '/../services/OrderItemService.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class OrderItemController {
    private OrderItemService $orderItemService;
    
    public function __construct() {
        $this->orderItemService = new OrderItemService();
    }
    
    public function index(): void {
        try {
            AuthMiddleware::requireAdmin();
            $items = $this->orderItemService->getAllOrderItems();
            Response::success(['order_items' => $items]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function show(int $id): void {
        try {
            AuthMiddleware::requireAuth();
            $item = $this->orderItemService->getOrderItemById($id);
            Response::success($item);
        } catch (Exception $e) {
            Response::error($e->getMessage(), $e->getMessage() === 'Rendelési tétel nem található' ? 404 : 500);
        }
    }
    
    public function create(): void {
        try {
            AuthMiddleware::requireAuth();
            $data = Validator::getJsonInput();
            $itemId = $this->orderItemService->createOrderItem($data);
            Response::success(['id' => $itemId], 'Rendelési tétel sikeresen létrehozva', 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function update(int $id): void {
        try {
            AuthMiddleware::requireAuth();
            $data = Validator::getJsonInput();
            $this->orderItemService->updateOrderItem($id, $data);
            Response::success(null, 'Rendelési tétel sikeresen frissítve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function delete(int $id): void {
        try {
            AuthMiddleware::requireAuth();
            $this->orderItemService->deleteOrderItem($id);
            Response::success(null, 'Rendelési tétel sikeresen törölve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function getByOrder(int $orderId): void {
        try {
            AuthMiddleware::requireAuth();
            $items = $this->orderItemService->getItemsByOrder($orderId);
            Response::success(['order_items' => $items]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function popular(): void {
        try {
            AuthMiddleware::requireAdmin();
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $products = $this->orderItemService->getPopularProducts($limit);
            Response::success(['products' => $products]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
}
