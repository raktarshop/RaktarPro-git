<?php
/**
 * Supplier Controller
 * Beszállítók kezelése - service réteggel
 */

require_once __DIR__ . '/../services/SupplierService.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class SupplierController {
    
    private SupplierService $supplierService;
    
    public function __construct() {
        $this->supplierService = new SupplierService();
    }
    
    /**
     * GET /suppliers - Beszállítók listázása (ADMIN)
     */
    public function index(): void {
        try {
            AuthMiddleware::requireAdmin();
            $suppliers = $this->supplierService->getAllSuppliers();
            Response::success(['suppliers' => $suppliers]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    /**
     * GET /suppliers/{id} - Beszállító részletei (ADMIN)
     */
    public function show(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $supplier = $this->supplierService->getSupplierById($id);
            Response::success($supplier);
        } catch (Exception $e) {
            Response::error($e->getMessage(), $e->getMessage() === 'Beszállító nem található' ? 404 : 500);
        }
    }
    
    /**
     * POST /suppliers - Új beszállító (ADMIN)
     */
    public function create(): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $supplierId = $this->supplierService->createSupplier($data);
            Response::success(['id' => $supplierId], 'Beszállító sikeresen létrehozva', 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    /**
     * PUT /suppliers/{id} - Beszállító módosítása (ADMIN)
     */
    public function update(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $this->supplierService->updateSupplier($id, $data);
            Response::success(null, 'Beszállító sikeresen frissítve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    /**
     * DELETE /suppliers/{id} - Beszállító törlése (ADMIN)
     */
    public function delete(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $this->supplierService->deleteSupplier($id);
            Response::success(null, 'Beszállító sikeresen törölve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    /**
     * GET /suppliers/search - Beszállítók keresése (ADMIN)
     */
    public function search(): void {
        try {
            AuthMiddleware::requireAdmin();
            $query = $_GET['q'] ?? '';
            $suppliers = $this->supplierService->searchSuppliers($query);
            Response::success(['suppliers' => $suppliers]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
}
