<?php
/**
 * Product Controller
 * Termék CRUD endpointok
 */

require_once __DIR__ . '/../services/ProductService.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class ProductController {
    
    private ProductService $productService;
    
    public function __construct() {
        $this->productService = new ProductService();
    }
    

    /**
     * Detect language from query (?lang=hu/en/de) or headers.
     */
    private function detectLang(): string {
        $q = $_GET['lang'] ?? '';
        if (is_string($q) && $q !== '') {
            $q = strtolower(substr($q, 0, 2));
            if (in_array($q, ['hu','en','de'], true)) return $q;
        }
        $h = $_SERVER['HTTP_X_RP_LANG'] ?? ($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '');
        if (is_string($h) && $h !== '') {
            $h = strtolower(substr(trim($h), 0, 2));
            if (in_array($h, ['hu','en','de'], true)) return $h;
        }
        return 'hu';
    }


    /**
     * GET /products
     * Termékek listázása (PUBLIC)
     */
    public function index(): void {
        try {
            $filters = [
                'search' => $_GET['search'] ?? '',
                'category_id' => $_GET['category_id'] ?? null,
                'sort' => $_GET['sort'] ?? 'newest',
                'page' => $_GET['page'] ?? 1,
                'limit' => $_GET['limit'] ?? 12
            ];
            
            $lang = $this->detectLang();
            $result = $this->productService->getProducts($filters, $lang);
            
            Response::success($result);
            
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    /**
     * GET /products/{id}
     * Termék részletei (PUBLIC)
     */
    public function show(int $id): void {
        try {
            $lang = $this->detectLang();
            $product = $this->productService->getProduct($id, $lang);
            
            if (!$product) {
                Response::notFound('Termék nem található');
            }
            
            Response::success($product);
            
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    /**
     * POST /products
     * Új termék létrehozása (ADMIN)
     */
    public function create(): void {
        try {
            // Check admin
            AuthMiddleware::requireAdmin();
            
            $data = Validator::getJsonInput();
            
            $productId = $this->productService->createProduct($data);
            
            Response::success(
                ['id' => $productId],
                'Termék sikeresen létrehozva',
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
     * PUT /products/{id}
     * Termék módosítása (ADMIN)
     */
    public function update(int $id): void {
        try {
            // Check admin
            AuthMiddleware::requireAdmin();
            
            $data = Validator::getJsonInput();
            
            $success = $this->productService->updateProduct($id, $data);
            
            if (!$success) {
                Response::error('Termék frissítése sikertelen', 500);
            }
            
            Response::success(null, 'Termék sikeresen frissítve');
            
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    /**
     * DELETE /products/{id}
     * Termék törlése (ADMIN)
     */
    public function delete(int $id): void {
        try {
            // Check admin
            AuthMiddleware::requireAdmin();
            
            $success = $this->productService->deleteProduct($id);
            
            if (!$success) {
                Response::error('Termék törlése sikertelen', 500);
            }
            
            Response::success(null, 'Termék sikeresen törölve');
            
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
}
