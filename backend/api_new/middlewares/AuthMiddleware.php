<?php
/**
 * Auth Middleware
 * JWT token ellenőrzés minden védett endpointra
 */

require_once __DIR__ . '/../utils/JWT.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/UserModel.php';

class AuthMiddleware {

    /**
     * Extract and verify access token payload from the current request.
     */
    private static function getAccessPayload(): array {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        if (empty($authHeader)) {
            Response::unauthorized('Hiányzó Authorization header');
        }

        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            Response::unauthorized('Érvénytelen Authorization formátum');
        }

        $token = $matches[1];
        $payload = JWT::verifyAccessToken($token);
        if (!$payload) {
            Response::unauthorized('Érvénytelen vagy lejárt token');
        }

        return $payload;
    }
    
    /**
     * Optional auth — returns user or null for guests, never exits
     */
    public static function optionalAuth(): ?array {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        if (empty($authHeader)) return null;
        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) return null;
        $token = $matches[1];
        $payload = JWT::verifyAccessToken($token);
        if (!$payload) return null;
        $userModel = new UserModel();
        return $userModel->find((int)$payload['user_id']) ?: null;
    }

    /**
     * Require authentication
     * Ellenőrzi a JWT tokent és visszaadja a user adatokat
     */
    public static function requireAuth(): array {
        $payload = self::getAccessPayload();
        
        // Get user from database
        $userModel = new UserModel();
        $user = $userModel->find((int)$payload['user_id']);
        
        if (!$user) {
            Response::unauthorized('Felhasználó nem található');
        }
        
        return $user;
    }
    
    /**
     * Require admin role
     */
    public static function requireAdmin(): array {
        // ✅ elsődlegesen a JWT tokenben lévő is_admin claim alapján döntünk
        $payload = self::getAccessPayload();
        $user = self::requireAuth();

        $isAdmin = false;

        if (isset($payload['is_admin']) && (int)$payload['is_admin'] === 1) {
            $isAdmin = true;
        }

        // fallback: DB mezők (régi kompatibilitás)
        if (!$isAdmin && isset($user['is_admin']) && (int)$user['is_admin'] === 1) {
            $isAdmin = true;
        }
        if (!$isAdmin && isset($user['role_id']) && (int)$user['role_id'] === 1) {
            $isAdmin = true;
        }

        if (!$isAdmin) {
            Response::forbidden('Admin jogosultság szükséges');
        }

        return $user;
    }
}
