<?php
/**
 * Auth Controller
 * Authentikációs endpointok: register, login
 */

require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

class AuthController {
    
    private AuthService $authService;
    
    public function __construct() {
        $this->authService = new AuthService();
    }
    
    /**
     * POST /auth/register
     */
    public function register(): void {
        try {
            $data = Validator::getJsonInput();
            
            $result = $this->authService->register($data);
            
            Response::success($result, 'Sikeres regisztráció', 201);
            
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
     * POST /auth/login
     */
    public function login(): void {
        try {
            $data = Validator::getJsonInput();
            
            $result = $this->authService->login($data);
            
            Response::success($result, 'Sikeres bejelentkezés');
            
        } catch (Exception $e) {
            $decoded = json_decode($e->getMessage(), true);
            if (is_array($decoded)) {
                Response::validationError($decoded);
            } else {
                Response::error($e->getMessage(), 401);
            }
        }
    }
    
    /**
     * POST /auth/logout
     */
    public function logout(): void {
        // Simple logout (token-based, nincs szerver oldali session)
        Response::success(null, 'Sikeres kijelentkezés');
    }
}
