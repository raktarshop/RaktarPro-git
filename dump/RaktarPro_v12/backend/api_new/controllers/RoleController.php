<?php
require_once __DIR__ . '/../services/RoleService.php';
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class RoleController {
    private RoleService $roleService;
    
    public function __construct() {
        $this->roleService = new RoleService();
    }
    
    public function index(): void {
        try {
            AuthMiddleware::requireAdmin();
            $roles = $this->roleService->getAllRoles();
            Response::success(['roles' => $roles]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
    
    public function show(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $role = $this->roleService->getRoleById($id);
            Response::success($role);
        } catch (Exception $e) {
            Response::error($e->getMessage(), $e->getMessage() === 'Szerep nem található' ? 404 : 500);
        }
    }
    
    public function create(): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $roleId = $this->roleService->createRole($data);
            Response::success(['id' => $roleId], 'Szerep sikeresen létrehozva', 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function update(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $data = Validator::getJsonInput();
            $this->roleService->updateRole($id, $data);
            Response::success(null, 'Szerep sikeresen frissítve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
    
    public function delete(int $id): void {
        try {
            AuthMiddleware::requireAdmin();
            $this->roleService->deleteRole($id);
            Response::success(null, 'Szerep sikeresen törölve');
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
}
