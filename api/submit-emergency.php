<?php
/**
 * TechWokx Ghana — Emergency IT Request Submission
 * POST /api/submit-emergency.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://techwokx.online');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }

require_once __DIR__ . '/../db/init.php';

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$email = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);

if (!$email) {
    http_response_code(400);
    echo json_encode(['success'=>false,'error'=>'Valid email required']);
    exit;
}

$fname   = htmlspecialchars(trim($input['first_name'] ?? ''), ENT_QUOTES);
$lname   = htmlspecialchars(trim($input['last_name']  ?? ''), ENT_QUOTES);
$phone   = htmlspecialchars(trim($input['phone']      ?? ''), ENT_QUOTES);
$company = htmlspecialchars(trim($input['company']    ?? ''), ENT_QUOTES);
$issue   = htmlspecialchars(trim($input['issue_type'] ?? ''), ENT_QUOTES);
$message = htmlspecialchars(trim($input['message']    ?? ''), ENT_QUOTES);
$ip      = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';

try {
    $db = getDB();
    $db->prepare("
        INSERT INTO emergency_requests
            (first_name,last_name,email,phone,company,issue_type,message,ip)
        VALUES (:fn,:ln,:email,:phone,:company,:issue,:msg,:ip)
    ")->execute([
        ':fn'=>$fname,':ln'=>$lname,':email'=>$email,
        ':phone'=>$phone,':company'=>$company,
        ':issue'=>$issue,':msg'=>$message,':ip'=>$ip
    ]);

    $subj = "EMERGENCY IT: $issue — $company";
    $body = "EMERGENCY REQUEST\nName: $fname $lname\nCompany: $company\n"
          . "Email: $email\nPhone: $phone\nIssue: $issue\n\nMessage:\n$message\n"
          . "Time: " . date('Y-m-d H:i:s');
    mail('hello@techwokx.online', $subj, $body,
         "From: noreply@techwokx.online\r\nReply-To: $email");

    echo json_encode(['success'=>true]);

} catch (Exception $e) {
    error_log('submit-emergency.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success'=>false,'error'=>'Server error']);
}
