<?php
class Env {
    
    private static array $variables = [];
    private static bool $loaded = false;
    
    public static function load(?string $path = null): void {
        if (self::$loaded) {
            return;
        }
        
        if ($path === null) {
            $path = __DIR__ . '/../.env';
        }
        
        if (!file_exists($path)) {
            throw new Exception(".env fájl nem található: {$path}");
        }
        
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) {
                continue;
            }
            
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                
                $key = trim($key);
                $value = trim($value);
                $value = trim($value, '"\'');
                
                self::$variables[$key] = $value;
                putenv("{$key}={$value}");
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
        
        self::$loaded = true;
    }
    
    public static function get(string $key, $default = null) {
        if (isset(self::$variables[$key])) {
            return self::$variables[$key];
        }
        
        if (isset($_ENV[$key])) {
            return $_ENV[$key];
        }
        
        $value = getenv($key);
        if ($value !== false) {
            return $value;
        }
        
        return $default;
    }
    
    public static function getString(string $key, string $default = ''): string {
        return (string) self::get($key, $default);
    }
    
    public static function getInt(string $key, int $default = 0): int {
        return (int) self::get($key, $default);
    }
    
    public static function getBool(string $key, bool $default = false): bool {
        $value = self::get($key, $default);
        
        if (is_bool($value)) {
            return $value;
        }
        
        $value = strtolower((string) $value);
        
        return in_array($value, ['true', '1', 'yes', 'on'], true);
    }
    
    public static function isLoaded(): bool {
        return self::$loaded;
    }
}