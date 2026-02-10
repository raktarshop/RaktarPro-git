<?php
/**
 * Response Helper
 * JSON válaszok egységes formázása
 */

class Response {
    
    /**
     * Success response
     */
    public static function success($data = null, string $message = '', int $code = 200): void {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        
        $response = [
            'success' => true
        ];
        
        if ($message) {
            $response['message'] = $message;
        }
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    /**
     * Error response
     */
    public static function error(string $message, int $code = 400, ?string $errorCode = null, $details = null): void {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        
        $response = [
            'success' => false,
            'error' => [
                'message' => $message
            ]
        ];
        
        if ($errorCode) {
            $response['error']['code'] = $errorCode;
        }
        
        if ($details !== null) {
            $response['error']['details'] = $details;
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    /**
     * Validation error
     */
    public static function validationError(array $errors): void {
        self::error('Validációs hiba', 400, 'VALIDATION_ERROR', $errors);
    }
    
    /**
     * Unauthorized
     */
    public static function unauthorized(string $message = 'Nincs bejelentkezve'): void {
        self::error($message, 401, 'UNAUTHORIZED');
    }
    
    /**
     * Forbidden
     */
    public static function forbidden(string $message = 'Nincs jogosultság'): void {
        self::error($message, 403, 'FORBIDDEN');
    }
    
    /**
     * Not found
     */
    public static function notFound(string $message = 'Nem található'): void {
        self::error($message, 404, 'NOT_FOUND');
    }
    
    /**
     * Server error
     */
    public static function serverError(string $message = 'Szerver hiba'): void {
        self::error($message, 500, 'SERVER_ERROR');
    }
}
