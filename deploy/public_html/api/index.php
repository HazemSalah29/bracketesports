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
