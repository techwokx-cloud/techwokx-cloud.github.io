<?php
/**
 * TechWokx Ghana — Auth API
 * GET  /api/auth.php  → check session
 * POST /api/auth.php  → login
 * DELETE /api/auth.php → logout
 */
header('Content-Type: application/json');
session_start();
require_once __DIR__ . '/../db/init.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode(['authenticated' => !empty($_SESSION['tw_admin'])]);
    exit;
}

if ($method === 'DELETE') {
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $pwd   = $input['password'] ?? '';

    try {
        $db = getDB();
        initServicesTables($db);
        $stmt = $db->prepare("SELECT value FROM site_settings WHERE key = 'admin_password'");
        $stmt->execute();
        $storedPwd = $stmt->fetchColumn() ?: 'techwokx2025';

        if ($pwd === $storedPwd) {
            $_SESSION['tw_admin'] = true;
            echo json_encode(['success' => true]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Incorrect password']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false]);
    }
    exit;
}
