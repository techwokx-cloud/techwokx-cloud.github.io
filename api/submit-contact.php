<?php
/**
 * TechWokx Ghana — Contact Form Submission
 * POST /api/submit-contact.php
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

$name    = htmlspecialchars(trim($input['name']    ?? ''), ENT_QUOTES);
$biz     = htmlspecialchars(trim($input['business']?? ''), ENT_QUOTES);
$phone   = htmlspecialchars(trim($input['phone']   ?? ''), ENT_QUOTES);
$service = htmlspecialchars(trim($input['service'] ?? ''), ENT_QUOTES);
$message = htmlspecialchars(trim($input['message'] ?? ''), ENT_QUOTES);
$ip      = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';

try {
    $db = getDB();
    $db->prepare("
        INSERT INTO contact_submissions (name,business,email,phone,service,message,ip)
        VALUES (:name,:biz,:email,:phone,:service,:msg,:ip)
    ")->execute([
        ':name'=>$name,':biz'=>$biz,':email'=>$email,
        ':phone'=>$phone,':service'=>$service,':msg'=>$message,':ip'=>$ip
    ]);

    $subj = "Website Enquiry — " . ($biz ?: $name ?: $email);
    $body = "CONTACT FORM\nName: $name\nBusiness: $biz\nEmail: $email\n"
          . "Phone: $phone\nService: $service\n\nMessage:\n$message\n"
          . "Time: " . date('Y-m-d H:i:s');
    mail('hello@techwokx.online', $subj, $body,
         "From: noreply@techwokx.online\r\nReply-To: $email");

    echo json_encode(['success'=>true]);

} catch (Exception $e) {
    error_log('submit-contact.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success'=>false,'error'=>'Server error']);
}
