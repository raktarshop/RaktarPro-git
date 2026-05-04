<?php
require_once __DIR__ . '/Env.php';

class JWT {
    
    const TYPE_ACCESS = 'access';
    const TYPE_REFRESH = 'refresh';
    
    public static function createAccessToken(array $payload): string {
        $secret = self::getAccessSecret();
        $expiresIn = Env::getInt('JWT_ACCESS_EXPIRY', 900);
        
        $payload['token_type'] = self::TYPE_ACCESS;
        
        return self::create($payload, $secret, $expiresIn);
    }
    
    public static function createRefreshToken(array $payload): string {
        $secret = self::getRefreshSecret();
        $expiresIn = Env::getInt('JWT_REFRESH_EXPIRY', 1209600);
        
        $payload['token_type'] = self::TYPE_REFRESH;
        
        return self::create($payload, $secret, $expiresIn);
    }
    
    public static function verifyAccessToken(string $token): ?array {
        $secret = self::getAccessSecret();
        $payload = self::verify($token, $secret);
        
        if ($payload && ($payload['token_type'] ?? '') === self::TYPE_ACCESS) {
            return $payload;
        }
        
        return null;
    }
    
    public static function verifyRefreshToken(string $token): ?array {
        $secret = self::getRefreshSecret();
        $payload = self::verify($token, $secret);
        
        if ($payload && ($payload['token_type'] ?? '') === self::TYPE_REFRESH) {
            return $payload;
        }
        
        return null;
    }
    
    public static function decode(string $token): ?array {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return null;
        }
        
        $payload = json_decode(self::base64UrlDecode($parts[1]), true);
        
        return $payload ?: null;
    }
    
    private static function create(array $payload, string $secret, int $expiresIn): string {
        $header = [
            'alg' => 'HS256',
            'typ' => 'JWT'
        ];
        
        $now = time();
        
        $payload['iat'] = $now;
        $payload['exp'] = $now + $expiresIn;
        
        $base64Header = self::base64UrlEncode(json_encode($header));
        $base64Payload = self::base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . '.' . $base64Payload, $secret, true);
        $base64Signature = self::base64UrlEncode($signature);
        
        return $base64Header . '.' . $base64Payload . '.' . $base64Signature;
    }
    
    private static function verify(string $token, string $secret): ?array {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return null;
        }
        
        [$base64Header, $base64Payload, $base64Signature] = $parts;
        
        $signature = hash_hmac('sha256', $base64Header . '.' . $base64Payload, $secret, true);
        $expectedSignature = self::base64UrlEncode($signature);
        
        if (!hash_equals($base64Signature, $expectedSignature)) {
            return null;
        }
        
        $payload = json_decode(self::base64UrlDecode($base64Payload), true);
        
        if (!$payload) {
            return null;
        }
        
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }
        
        return $payload;
    }
    
    private static function getAccessSecret(): string {
        if (!Env::isLoaded()) {
            Env::load();
        }
        
        $secret = Env::getString('JWT_ACCESS_SECRET');
        
        if (empty($secret) || strlen($secret) < 32) {
            throw new Exception('JWT_ACCESS_SECRET nincs beállítva vagy túl rövid!');
        }
        
        return $secret;
    }
    
    private static function getRefreshSecret(): string {
        if (!Env::isLoaded()) {
            Env::load();
        }
        
        $secret = Env::getString('JWT_REFRESH_SECRET');
        
        if (empty($secret) || strlen($secret) < 32) {
            throw new Exception('JWT_REFRESH_SECRET nincs beállítva vagy túl rövid!');
        }
        
        return $secret;
    }
    
    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private static function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}