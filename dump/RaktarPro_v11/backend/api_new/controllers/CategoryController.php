<?php
/**
 * Category Controller - service réteggel
 */

require_once __DIR__ . '/../services/CategoryService.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class CategoryController {
    
    private CategoryService $categoryService;
    
    public function __construct() {
        $this->categoryService = new CategoryService();
    }
    
    /**
     * GET /categories - Kategóriák listázása (PUBLIC)
     */
    public function index(): void {
        try {
            $categories = $this->categoryService->getAllCategories();
            Response::success(['categories' => $categories]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    /**
     * GET /categories/{id} - Kategória részletei (PUBLIC)
     */
    public function show(int $id): void {
        try {
            $category = $this->categoryService->getCategoryById($id);
            Response::success($category);
        } catch (Exception $e) {
            Response::error($e->getMessage(), $e->getMessage() === 'Kategória nem található' ? 404 : 500);
        }
    }
    
    /**
     * POST /categories - Új kategória (ADMIN)
     */
    public function create(): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $categoryId = $this->categoryService->createCategory($data);
            Response::success(['id' => $categoryId], 'Kategória sikeresen létrehozva', 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    /**
     * PUT /categories/{id} - Kategória módosítása (ADMIN)
     */
    public function update(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $this->categoryService->updateCategory($id, $data);
            Response::success(null, 'Kategória sikeresen frissítve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    /**
     * DELETE /categories/{id} - Kategória törlése (ADMIN)
     */
    public function delete(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $this->categoryService->deleteCategory($id);
            Response::success(null, 'Kategória sikeresen törölve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    /**
     * GET /categories/tree - Kategória fa struktúra (PUBLIC)
     */
    public function tree(): void {
        try {
            $tree = $this->categoryService->getCategoryTree();
            Response::success(['categories' => $tree]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
}
