# Enable rewrite engine
RewriteEngine On

# If the request is for a real file or directory, don't rewrite
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Rewrite all other requests to index.php
RewriteRule ^(.*)$ index.php [QSA,L]

# Handle OPTIONS requests (CORS preflight)
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
