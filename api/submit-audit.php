<?php
/**
 * TechWokx Ghana — Audit Submission API
 * POST /api/submit-audit.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://techwokx.online');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/../db/init.php';

// Parse JSON body
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) $input = $_POST;

// Validate required field
$email = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);
if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Valid email required']);
    exit;
}

// Sanitise inputs
$name       = htmlspecialchars(trim($input['name']       ?? ''), ENT_QUOTES);
$business   = htmlspecialchars(trim($input['business']   ?? ''), ENT_QUOTES);
$phone      = htmlspecialchars(trim($input['phone']      ?? ''), ENT_QUOTES);
$staff      = htmlspecialchars(trim($input['staff']      ?? ''), ENT_QUOTES);
$industry   = htmlspecialchars(trim($input['industry']   ?? ''), ENT_QUOTES);
$score      = (int)($input['score']    ?? 0);
$step1      = (int)($input['step1']    ?? 0);
$step2      = (int)($input['step2']    ?? 0);
$step3      = (int)($input['step3']    ?? 0);
$step4      = (int)($input['step4']    ?? 0);

// Calculate risk status
$pct = round(($score / 80) * 100);
if ($pct < 40)       $risk = 'RED - CRITICAL RISK';
elseif ($pct < 70)   $risk = 'ORANGE - MODERATE RISK';
else                  $risk = 'GREEN - STABLE';

$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';

try {
    $db = getDB();
    $stmt = $db->prepare("
        INSERT INTO audit_submissions
            (name, business, email, phone, staff_count, industry,
             score, risk_status, step1_val, step2_val, step3_val, step4_val, ip, user_agent)
        VALUES
            (:name, :business, :email, :phone, :staff, :industry,
             :score, :risk, :s1, :s2, :s3, :s4, :ip, :ua)
    ");
    $stmt->execute([
        ':name' => $name, ':business' => $business, ':email' => $email,
        ':phone' => $phone, ':staff' => $staff, ':industry' => $industry,
        ':score' => $score, ':risk' => $risk,
        ':s1' => $step1, ':s2' => $step2, ':s3' => $step3, ':s4' => $step4,
        ':ip' => $ip, ':ua' => $ua
    ]);

    // Send notification email to TechWokx
    $subject = "[$risk] Audit: " . ($business ?: $name ?: $email);
    $body  = "NEW AUDIT SUBMISSION\n";
    $body .= "==================\n";
    $body .= "Name:     $name\n";
    $body .= "Business: $business\n";
    $body .= "Email:    $email\n";
    $body .= "Phone:    $phone\n";
    $body .= "Industry: $industry\n";
    $body .= "Staff:    $staff\n";
    $body .= "Score:    $score / 80 ($pct%)\n";
    $body .= "Risk:     $risk\n";
    $body .= "Time:     " . date('Y-m-d H:i:s') . "\n";
    $headers = "From: noreply@techwokx.online\r\nReply-To: $email";
    mail('hello@techwokx.online', $subject, $body, $headers);

    echo json_encode([
        'success'     => true,
        'risk_status' => $risk,
        'score'       => $score,
        'pct'         => $pct
    ]);

} catch (Exception $e) {
    error_log('Audit DB error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error — please try again']);
}
