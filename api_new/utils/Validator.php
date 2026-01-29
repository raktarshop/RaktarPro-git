<?php
/**
 * Validator Helper
 * Input validáció és sanitization
 */

class Validator {
    
    /**
     * Validate required fields
     */
    public static function required(array $data, array $fields): array {
        $errors = [];
        
        foreach ($fields as $field) {
            if (!isset($data[$field]) || trim($data[$field]) === '') {
                $errors[$field] = "A(z) {$field} mező kötelező";
            }
        }
        
        return $errors;
    }
    
    /**
     * Validate email
     */
    public static function email(string $email): bool {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    /**
     * Validate password strength
     */
    public static function password(string $password): array {
        $errors = [];
        
        if (strlen($password) < 6) {
            $errors[] = "A jelszó legalább 6 karakter legyen";
        }
        
        return $errors;
    }
    
    /**
     * Validate positive integer
     */
    public static function positiveInt($value): bool {
        return is_numeric($value) && (int)$value > 0;
    }
    
    /**
     * Sanitize string
     */
    public static function sanitizeString(string $str): string {
        return htmlspecialchars(trim($str), ENT_QUOTES, 'UTF-8');
    }
    
    /**
     * Get JSON input
     */
    public static function getJsonInput(): array {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        return is_array($data) ? $data : [];
    }
    
    /**
     * Validate and sanitize pagination params
     */
    public static function getPaginationParams(array $input): array {
        $page = max(1, (int)($input['page'] ?? 1));
        $limit = min(100, max(1, (int)($input['limit'] ?? 12)));
        $offset = ($page - 1) * $limit;
        
        return [
            'page' => $page,
            'limit' => $limit,
            'offset' => $offset
        ];
    }
}
