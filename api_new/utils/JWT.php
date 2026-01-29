<?php
/**
 * JWT Helper
 * JSON Web Token kezelés (egyszerűsített verzió)
 * Production-ben használj firebase/php-jwt library-t!
 */

class JWT {
    
    private static string $secret = 'valtoztatsd-meg-ezt-egy-hosszu-random-kulcsra-12345';
    
    /**
     * Create JWT token
     */
    public static function create(array $payload, int $expiresIn = 900): string {
        $header = [
            'alg' => 'HS256',
            'typ' => 'JWT'
        ];
        
        $payload['iat'] = time();
        $payload['exp'] = time() + $expiresIn;
        
        $base64Header = self::base64UrlEncode(json_encode($header));
        $base64Payload = self::base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . '.' . $base64Payload, self::$secret, true);
        $base64Signature = self::base64UrlEncode($signature);
        
        return $base64Header . '.' . $base64Payload . '.' . $base64Signature;
    }
    
    /**
     * Verify and decode JWT token
     */
    public static function verify(string $token): ?array {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return null;
        }
        
        [$base64Header, $base64Payload, $base64Signature] = $parts;
        
        // Verify signature
        $signature = hash_hmac('sha256', $base64Header . '.' . $base64Payload, self::$secret, true);
        $expectedSignature = self::base64UrlEncode($signature);
        
        if ($base64Signature !== $expectedSignature) {
            return null;
        }
        
        // Decode payload
        $payload = json_decode(self::base64UrlDecode($base64Payload), true);
        
        if (!$payload) {
            return null;
        }
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }
        
        return $payload;
    }
    
    /**
     * Base64 URL encode
     */
    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    /**
     * Base64 URL decode
     */
    private static function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
