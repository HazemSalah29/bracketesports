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
            'version' => '1.0.0'
        ]);
        break;
        
    case 'users':
        // Mock users data for demonstration
        echo json_encode([
            'success' => true,
            'data' => [
                [
                    'id' => 1,
                    'username' => 'pro_gamer',
                    'email' => 'pro@example.com',
                    'coins' => 1500,
                    'level' => 25
                ],
                [
                    'id' => 2,
                    'username' => 'esports_champ',
                    'email' => 'champ@example.com', 
                    'coins' => 2300,
                    'level' => 42
                ]
            ],
            'count' => 2
        ]);
        break;
        
    case 'tournaments':
        // Mock tournaments data
        echo json_encode([
            'success' => true,
            'data' => [
                [
                    'id' => 1,
                    'name' => 'League of Legends Championship',
                    'game' => 'League of Legends',
                    'status' => 'active',
                    'participants' => 128,
                    'prize' => '$10,000'
                ],
                [
                    'id' => 2,
                    'name' => 'Valorant Masters',
                    'game' => 'Valorant', 
                    'status' => 'upcoming',
                    'participants' => 64,
                    'prize' => '$5,000'
                ]
            ],
            'count' => 2
        ]);
        break;
        
    default:
        http_response_code(404);
        echo json_encode([
            'error' => 'Not Found',
            'message' => 'API endpoint not found',
            'path' => $path
        ]);
        break;
}
?>
