<?php
/**
 * TechWokx Ghana — Admin Leads API
 * GET  /api/admin-leads.php       → returns all leads
 * POST /api/admin-leads.php       → resolve_emergency action
 */

header('Content-Type: application/json');
session_start();

if (empty($_SESSION['tw_admin'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorised']);
    exit;
}

require_once __DIR__ . '/../db/init.php';

try {
    $db = getDB();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input  = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $action = $input['action'] ?? '';

        if ($action === 'resolve_emergency') {
            $id = (int)($input['id'] ?? 0);
            $db->prepare("UPDATE emergency_requests SET status='resolved' WHERE id=?")
               ->execute([$id]);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Unknown action']);
        }
        exit;
    }

    // GET — return all leads
    $audits = $db->query("
        SELECT id, name, business, email, phone, staff_count,
               industry, score, risk_status, created_at
        FROM audit_submissions ORDER BY created_at DESC
    ")->fetchAll();

    $contacts = $db->query("
        SELECT id, name, business, email, phone, service, message, created_at
        FROM contact_submissions ORDER BY created_at DESC
    ")->fetchAll();

    $emergency = $db->query("
        SELECT id, first_name, last_name, email, phone, company,
               issue_type, message, status, created_at
        FROM emergency_requests ORDER BY created_at DESC
    ")->fetchAll();

    echo json_encode([
        'success'   => true,
        'audits'    => $audits,
        'contacts'  => $contacts,
        'emergency' => $emergency
    ]);

} catch (Exception $e) {
    error_log('admin-leads.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
