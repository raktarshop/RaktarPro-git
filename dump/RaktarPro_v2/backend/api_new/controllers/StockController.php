<?php
require_once __DIR__ . '/../services/StockService.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class StockController {
    private StockService $stockService;
    
    public function __construct() {
        $this->stockService = new StockService();
    }
    
    public function index(): void {
        try {
            AuthMiddleware::requireAuth();
            $stock = $this->stockService->getAllStock();
            Response::success(['stock' => $stock]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function show(int $id): void {
        try {
            AuthMiddleware::requireAuth();
            $stock = $this->stockService->getStockById($id);
            Response::success($stock);
        } catch (Exception $e) {
            Response::error($e->getMessage(), $e->getMessage() === 'Készlet tétel nem található' ? 404 : 500);
        }
    }
    
    public function create(): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $stockId = $this->stockService->createStock($data);
            Response::success(['id' => $stockId], 'Készlet tétel sikeresen létrehozva', 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function update(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $this->stockService->updateStock($id, $data);
            Response::success(null, 'Készlet sikeresen frissítve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function delete(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $this->stockService->deleteStock($id);
            Response::success(null, 'Készlet sikeresen törölve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function getByProduct(int $productId): void {
        try {
            AuthMiddleware::requireAuth();
            $stock = $this->stockService->getStockByProduct($productId);
            Response::success(['stock' => $stock]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function getByLocation(int $locationId): void {
        try {
            AuthMiddleware::requireAuth();
            $stock = $this->stockService->getStockByLocation($locationId);
            Response::success(['stock' => $stock]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function increase(int $id): void {
        try {
            AuthMiddleware::requireAuth();
            $data = Validator::getJsonInput();
            $this->stockService->increaseQuantity($id, (int)$data['amount']);
            Response::success(null, 'Készlet sikeresen növelve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function decrease(int $id): void {
        try {
            AuthMiddleware::requireAuth();
            $data = Validator::getJsonInput();
            $this->stockService->decreaseQuantity($id, (int)$data['amount']);
            Response::success(null, 'Készlet sikeresen csökkentve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function move(): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $this->stockService->moveStock(
                (int)$data['from_location_id'],
                (int)$data['to_location_id'],
                (int)$data['product_id'],
                (int)$data['quantity']
            );
            Response::success(null, 'Készlet sikeresen áthelyezve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function alerts(): void {
        try {
            AuthMiddleware::requireAuth();
            $alerts = $this->stockService->getAlerts();
            Response::success(['alerts' => $alerts]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function summary(): void {
        try {
            AuthMiddleware::requireAuth();
            $summary = $this->stockService->getSummary();
            Response::success(['summary' => $summary]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
}
