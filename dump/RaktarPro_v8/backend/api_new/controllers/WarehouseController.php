<?php
require_once __DIR__ . '/../services/WarehouseService.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class WarehouseController {
    private WarehouseService $warehouseService;
    
    public function __construct() {
        $this->warehouseService = new WarehouseService();
    }
    
    public function index(): void {
        try {
            AuthMiddleware::requireAuth();
            $warehouses = $this->warehouseService->getAllWarehouses();
            Response::success(['warehouses' => $warehouses]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function show(int $id): void {
        try {
            AuthMiddleware::requireAuth();
            $warehouse = $this->warehouseService->getWarehouseById($id);
            Response::success($warehouse);
        } catch (Exception $e) {
            Response::error($e->getMessage(), $e->getMessage() === 'Raktár nem található' ? 404 : 500);
        }
    }
    
    public function create(): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $warehouseId = $this->warehouseService->createWarehouse($data);
            Response::success(['id' => $warehouseId], 'Raktár sikeresen létrehozva', 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function update(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $this->warehouseService->updateWarehouse($id, $data);
            Response::success(null, 'Raktár sikeresen frissítve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function delete(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $this->warehouseService->deleteWarehouse($id);
            Response::success(null, 'Raktár sikeresen törölve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
}
