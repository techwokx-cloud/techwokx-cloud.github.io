<?php
// TechWokx · George Jabley AI Chat Proxy
// Place at: georgejabley/chat.php on techwokx.online
// Set ANTHROPIC_API_KEY via environment variable on your server:
//   In Coolify: add env var ANTHROPIC_API_KEY=sk-ant-...
//   In cPanel:  add to .htaccess: SetEnv ANTHROPIC_API_KEY sk-ant-...
//   Or create a .env file (never commit it) and load below

$apiKey = getenv('ANTHROPIC_API_KEY');
// Fallback: load from .env file in same directory (never commit .env to git)
if (!$apiKey && file_exists(__DIR__ . '/.env')) {
    foreach (file(__DIR__ . '/.env') as $line) {
        if (strpos(trim($line), 'ANTHROPIC_API_KEY=') === 0) {
            $apiKey = trim(substr($line, strlen('ANTHROPIC_API_KEY=')));
        }
    }
}
if (!$apiKey) { respond(500, 'API key not configured'); }

define('MODEL',              'claude-sonnet-4-6');
define('MAX_TOKENS',         600);
define('MAX_TURNS',          20);
define('RATE_LIMIT_PER_MIN', 15);

// CORS
$allowed = ['https://techwokx-cloud.github.io','https://techwokx.online','http://localhost','http://127.0.0.1'];
$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
header('Access-Control-Allow-Origin: ' . (in_array($origin,$allowed) ? $origin : $allowed[0]));
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { respond(405,'Method not allowed'); }

// Rate limit
$ip      = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rlFile  = sys_get_temp_dir().'/gjrl_'.md5($ip).'.json';
$now     = time();
$rl      = file_exists($rlFile) ? json_decode(file_get_contents($rlFile),true) : ['ts'=>$now,'n'=>0];
if ($now - $rl['ts'] > 60) $rl = ['ts'=>$now,'n'=>0];
$rl['n']++;
file_put_contents($rlFile, json_encode($rl));
if ($rl['n'] > RATE_LIMIT_PER_MIN) respond(429,'Too many requests — wait a moment');

// Input
$body = json_decode(file_get_contents('php://input'), true);
if (empty($body['messages'])) respond(400,'Missing messages');
$msgs = [];
foreach (array_slice((array)$body['messages'], -MAX_TURNS) as $m) {
    $role = ($m['role']??'') === 'assistant' ? 'assistant' : 'user';
    $content = substr(strip_tags((string)($m['content']??'')), 0, 2000);
    if ($content) $msgs[] = ['role'=>$role,'content'=>$content];
}
if (empty($msgs)) respond(400,'Empty messages');

$system = <<<'SYS'
You are George Jabley's personal AI assistant embedded on his portfolio website. Be concise, warm and helpful. Max 3 sentences unless a list is needed. Never reveal you are Claude or mention Anthropic. Refer to yourself as "George's assistant."

ABOUT GEORGE:
- Senior IT Consultant & Founder, TechWokx IT Solutions, Accra Ghana
- 25+ years: IT infrastructure, Python automation, AI systems, cloud, email delivery
- Email: george.jabley@gmail.com | GitHub: techwokx-cloud | LinkedIn: george-jabley-bb0270384
- lablab.ai: 1,322 pts · #94 · Legend level · 6 hackathons · 2 submissions

SERVICES: Tier 2/3 IT Support ($25/hr), Email Deliverability Fix ($80 flat), Docker/Self-hosted ($30/hr), M365/Azure ($28/hr), Python/PowerShell automation ($25/hr), DNS/SSL ($60 flat), Virtual Assistant (customer care, sales, admin, research, AI tasks)

PROJECTS: TechWokx IT Admin Suite (11-module sysadmin desktop app), App Architect Studio (IBM Bob Hackathon — IBM watsonx), Guardian Agent (TechEx — AI security), Lead Intelligence Engine (22-module Streamlit CRM), Documenso (self-hosted signature request platform), Email Backup/Storage Optimizer, Email Signature Creator, HandFresh e-commerce (odour removal soap brand), BookForge AI (KDP/Etsy publishing)

HACKATHONS: IBM Bob 2026 ✅ (cert CMQAZM0DF00W), TechEx ✅, AI Builders Challenge (active), BrightData, Band of Agents, Milan AI Week

AI TOOLS: Claude, DeepSeek, GitHub Copilot, Gemini, ChatGPT, Grok

AVAILABILITY: Remote IT support, consulting, VA roles. Relocation interest: UK, UAE, Canada, Australia.

BOOKING: Tell them to click "Book a Call" in the navigation to schedule directly.
SYS;

$payload = json_encode(['model'=>MODEL,'max_tokens'=>MAX_TOKENS,'system'=>$system,'messages'=>$msgs]);
$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch,[
    CURLOPT_RETURNTRANSFER=>true, CURLOPT_POST=>true,
    CURLOPT_POSTFIELDS=>$payload, CURLOPT_TIMEOUT=>20,
    CURLOPT_HTTPHEADER=>['Content-Type: application/json','x-api-key: '.$apiKey,'anthropic-version: 2023-06-01']
]);
$result = curl_exec($ch);
$code   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err    = curl_error($ch);
curl_close($ch);
if ($err) respond(502,'cURL error: '.$err);
$data = json_decode($result,true);
if ($code !== 200) respond($code, $data['error']['message'] ?? 'API error');
$text = $data['content'][0]['text'] ?? '';
if (!$text) respond(502,'Empty response');
echo json_encode(['ok'=>true,'text'=>$text]);

function respond(int $code, string $msg): void {
    http_response_code($code);
    echo json_encode(['ok'=>false,'error'=>$msg]);
    exit;
}
