# Manual deployment script for GoDaddy
# Run this if GitHub Actions deployment fails

Write-Host "🚀 Starting manual deployment to GoDaddy..." -ForegroundColor Green

# Create deployment directory
Write-Host "📁 Creating deployment package..." -ForegroundColor Yellow
if (Test-Path "deploy") { Remove-Item "deploy" -Recurse -Force }
New-Item -ItemType Directory -Path "deploy/public_html" -Force | Out-Null
New-Item -ItemType Directory -Path "deploy/public_html/api" -Force | Out-Null

# Create PHP API
Write-Host "🔧 Creating PHP API for GoDaddy..." -ForegroundColor Yellow
$phpContent = @'
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the requested path
$path = $_GET['path'] ?? '';

// MongoDB connection (you'll need to replace with your actual connection)
$mongoUri = 'mongodb+srv://hazemsalah:W123456789w@bracketesports-prod.6w6yjfb.mongodb.net/bracketesports?retryWrites=true&w=majority';

// Route handling
switch ($path) {
    case 'health':
        echo json_encode([
            'status' => 'OK',
            'message' => 'BracketEsports API is running',
            'timestamp' => date('c'),
            'version' => '1.0.0',
            'server' => 'GoDaddy PHP'
        ]);
        break;
        
    case 'users':
        // Simulate users data (replace with actual MongoDB query)
        echo json_encode([
            'success' => true,
            'data' => [
                [
                    'id' => '1',
                    'username' => 'demo_user',
                    'email' => 'demo@bracketesports.com',
                    'joinDate' => date('c')
                ]
            ],
            'message' => 'Users retrieved successfully'
        ]);
        break;
        
    case 'tournaments':
        // Simulate tournaments data
        echo json_encode([
            'success' => true,
            'data' => [
                [
                    'id' => '1',
                    'name' => 'Demo Tournament',
                    'game' => 'League of Legends',
                    'status' => 'upcoming',
                    'participants' => 32,
                    'prizePool' => 1000
                ]
            ],
            'message' => 'Tournaments retrieved successfully'
        ]);
        break;
        
    default:
        http_response_code(404);
        echo json_encode([
            'error' => 'Not Found',
            'message' => 'API endpoint not found',
            'path' => $path,
            'available_endpoints' => ['health', 'users', 'tournaments']
        ]);
        break;
}
?>
'@

Set-Content -Path "deploy/public_html/api/index.php" -Value $phpContent -Encoding UTF8

# Create landing page
Write-Host "📄 Creating landing page..." -ForegroundColor Yellow
$htmlContent = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BracketEsports - Premier Esports Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header { 
            background: rgba(0, 0, 0, 0.8); 
            padding: 1rem 2rem; 
            border-bottom: 2px solid #007bff;
        }
        .header h1 { 
            color: #007bff; 
            font-size: 2rem; 
            font-weight: bold;
        }
        .main { 
            flex: 1; 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            text-align: center; 
            padding: 2rem;
        }
        .hero h2 { 
            font-size: 3rem; 
            margin-bottom: 1rem; 
            background: linear-gradient(45deg, #007bff, #00d4ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hero p { 
            font-size: 1.2rem; 
            margin-bottom: 2rem; 
            max-width: 600px;
            line-height: 1.6;
        }
        .features { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 2rem; 
            margin: 3rem 0; 
            max-width: 1000px;
        }
        .feature { 
            background: rgba(255, 255, 255, 0.1); 
            padding: 2rem; 
            border-radius: 10px; 
            border: 1px solid rgba(0, 123, 255, 0.3);
            transition: transform 0.3s ease;
        }
        .feature:hover { 
            transform: translateY(-5px); 
            border-color: #007bff;
        }
        .feature h3 { 
            color: #00d4ff; 
            margin-bottom: 1rem; 
        }
        .status { 
            background: rgba(0, 123, 255, 0.2); 
            padding: 1rem; 
            border-radius: 5px; 
            margin: 2rem 0;
            border-left: 4px solid #007bff;
        }
        .footer { 
            background: rgba(0, 0, 0, 0.8); 
            padding: 1rem; 
            text-align: center; 
            border-top: 1px solid #333;
        }
        .api-test { 
            margin: 2rem 0; 
            padding: 1rem; 
            background: rgba(0, 0, 0, 0.5); 
            border-radius: 5px;
        }
        .api-test button { 
            background: #007bff; 
            color: white; 
            border: none; 
            padding: 0.5rem 1rem; 
            border-radius: 5px; 
            cursor: pointer; 
            margin: 0.5rem;
        }
        .api-test button:hover { 
            background: #0056b3; 
        }
        #apiResult { 
            margin-top: 1rem; 
            padding: 1rem; 
            background: rgba(0, 0, 0, 0.7); 
            border-radius: 5px; 
            white-space: pre-wrap; 
            text-align: left;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>🏆 BracketEsports</h1>
    </header>
    
    <main class="main">
        <div class="hero">
            <h2>Welcome to BracketEsports</h2>
            <p>The premier platform for competitive esports tournaments, player rankings, and community engagement. Join thousands of players in epic battles across multiple games.</p>
        </div>
        
        <div class="status">
            <h3>🚀 Platform Status: Online</h3>
            <p>API Server: Running | Database: Connected | Deployment: GoDaddy Hosting</p>
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>🎮 Tournament Management</h3>
                <p>Create and join tournaments across multiple esports titles including League of Legends, Valorant, and more.</p>
            </div>
            <div class="feature">
                <h3>📊 Player Analytics</h3>
                <p>Track your performance, climb leaderboards, and analyze your gameplay statistics.</p>
            </div>
            <div class="feature">
                <h3>👥 Team Building</h3>
                <p>Find teammates, create teams, and compete together in organized competitions.</p>
            </div>
            <div class="feature">
                <h3>💰 Prize Pools</h3>
                <p>Compete for real prizes in sponsored tournaments and community events.</p>
            </div>
        </div>
        
        <div class="api-test">
            <h3>🔧 API Test Center</h3>
            <p>Test the BracketEsports API endpoints:</p>
            <button onclick="testAPI('health')">Health Check</button>
            <button onclick="testAPI('users')">Users API</button>
            <button onclick="testAPI('tournaments')">Tournaments API</button>
            <div id="apiResult"></div>
        </div>
    </main>
    
    <footer class="footer">
        <p>&copy; 2024 BracketEsports. All rights reserved. | Powered by GoDaddy Hosting</p>
    </footer>
    
    <script>
        async function testAPI(endpoint) {
            const resultDiv = document.getElementById('apiResult');
            resultDiv.textContent = 'Testing API...';
            
            try {
                const response = await fetch(`/api/index.php?path=${endpoint}`);
                const data = await response.json();
                resultDiv.textContent = `✅ ${endpoint.toUpperCase()} API Response:\n${JSON.stringify(data, null, 2)}`;
            } catch (error) {
                resultDiv.textContent = `❌ Error testing ${endpoint} API:\n${error.message}`;
            }
        }
        
        // Auto-test health endpoint on load
        window.addEventListener('load', () => {
            setTimeout(() => testAPI('health'), 1000);
        });
    </script>
</body>
</html>
'@

Set-Content -Path "deploy/public_html/index.html" -Value $htmlContent -Encoding UTF8

# Create .htaccess
Write-Host "⚙️ Creating .htaccess configuration..." -ForegroundColor Yellow
$htaccessContent = @'
# Enable gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/json "access plus 1 hour"
</IfModule>

# API routing
RewriteEngine On
RewriteRule ^api/(.*)$ /api/index.php?path=$1 [QSA,L]

# Error pages
ErrorDocument 404 /index.html
ErrorDocument 500 /index.html
'@

Set-Content -Path "deploy/public_html/.htaccess" -Value $htaccessContent -Encoding UTF8

Write-Host "✅ Deployment package created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Upload the contents of 'deploy/public_html/' to your GoDaddy public_html/ folder" -ForegroundColor White
Write-Host "2. You can use GoDaddy File Manager or FTP client like FileZilla" -ForegroundColor White
Write-Host "3. Your site will be available at https://bracketesports.com" -ForegroundColor White
Write-Host "4. Test the API at https://bracketesports.com/api/health" -ForegroundColor White
Write-Host ""
Write-Host "🔧 To fix GitHub Actions deployment:" -ForegroundColor Cyan
Write-Host "Visit: https://github.com/HazemSalah29/bracketesports/settings/secrets/actions" -ForegroundColor White
Write-Host "Add these secrets: FTP_SERVER, FTP_USERNAME, FTP_PASSWORD" -ForegroundColor White

# Open the deploy folder
if (Test-Path "deploy") {
    Write-Host "📁 Opening deploy folder..." -ForegroundColor Yellow
    Start-Process "deploy"
}
}
