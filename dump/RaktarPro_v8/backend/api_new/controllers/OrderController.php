<?php
/**
 * Order Controller
 * Rendelés endpointok (user + admin)
 */

require_once __DIR__ . '/../services/OrderService.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class OrderController {
    
    private OrderService $orderService;
    
    public function __construct() {
        $this->orderService = new OrderService();
    }
    
    /**
     * GET /orders
     * Saját rendelések listázása (USER)
     */
    public function index(): void {
        try {
            $user = AuthMiddleware::requireAuth();
            
            $filters = [
                'page' => $_GET['page'] ?? 1,
                'limit' => $_GET['limit'] ?? 10
            ];
            
            $result = $this->orderService->getUserOrders((int)$user['id'], $filters);
            
            Response::success($result);
            
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    /**
     * GET /orders/{id}
     * Rendelés részletei (USER)
     */
    public function show(int $id): void {
        try {
            $user = AuthMiddleware::requireAuth();
            
            $order = $this->orderService->getOrderDetails($id, (int)$user['id']);
            
            if (!$order) {
                Response::notFound('Rendelés nem található');
            }
            
            Response::success($order);
            
        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'jogosultság') !== false) {
                Response::forbidden($e->getMessage());
            } else {
                Response::error($e->getMessage(), 500);
            }
        }
    }
    
    /**
     * POST /orders
     * Új rendelés leadása - CHECKOUT (USER)
     */
    public function create(): void {
        try {
            $user = AuthMiddleware::requireAuth();
            
            $data = Validator::getJsonInput();
            
            // Order data
            $orderData = [
                'name' => $data['name'] ?? '',
                'email' => $data['email'] ?? '',
                'address' => $data['address'] ?? '',
                'payment_method' => $data['payment_method'] ?? 'utanvet'
            ];
            
            // Cart items
            $cartItems = $data['items'] ?? [];
            
            $orderId = $this->orderService->createOrder(
                $orderData,
                $cartItems,
                (int)$user['id']
            );
            
            Response::success(
                ['order_id' => $orderId],
                'Rendelés sikeresen leadva',
                201
            );
            
        } catch (Exception $e) {
            $decoded = json_decode($e->getMessage(), true);
            if (is_array($decoded)) {
                Response::validationError($decoded);
            } else {
                Response::error($e->getMessage(), 400);
            }
        }
    }
    
    /**
     * GET /admin/orders
     * Összes rendelés listázása (ADMIN)
     */
    public function adminIndex(): void {
        try {
            AuthMiddleware::requireAdmin();
            
            $filters = [
                'status' => $_GET['status'] ?? null,
                'from_date' => $_GET['from_date'] ?? null,
                'to_date' => $_GET['to_date'] ?? null,
                'search' => $_GET['search'] ?? null,
                'page' => $_GET['page'] ?? 1,
                'limit' => $_GET['limit'] ?? 20
            ];
            
            $result = $this->orderService->getAllOrders($filters);
            
            Response::success($result);
            
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    /**
     * PUT /admin/orders/{id}/status
     * Rendelés státusz módosítása (ADMIN)
     */
    public function updateStatus(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            
            $data = Validator::getJsonInput();
            
            if (empty($data['status'])) {
                Response::error('Státusz megadása kötelező', 400);
            }
            
            $success = $this->orderService->updateOrderStatus($id, $data['status']);
            
            if (!$success) {
                Response::error('Státusz frissítése sikertelen', 500);
            }
            
            Response::success(null, 'Státusz sikeresen frissítve');
            
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
}
