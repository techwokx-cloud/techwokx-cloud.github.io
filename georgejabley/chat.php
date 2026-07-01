<?php
// ══════════════════════════════════════════════════════════
//  TechWokx · George Jabley AI Chat Proxy
//  Place: georgejabley/chat.php  (same folder as index.html)
//  Set your Anthropic API key in the line below.
// ══════════════════════════════════════════════════════════

define('ANTHROPIC_API_KEY', 'sk-ant-REPLACE_WITH_YOUR_KEY');
define('MODEL',             'claude-sonnet-4-6');
define('MAX_TOKENS',        600);
define('MAX_TURNS',         20);   // max history messages accepted
define('RATE_LIMIT_PER_MIN', 12);  // requests per IP per minute

// ── CORS ──────────────────────────────────────────────────
$allowed_origins = [
    'https://techwokx-cloud.github.io',
    'https://techwokx.online',
    'http://localhost',
    'http://127.0.0.1',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: https://techwokx-cloud.github.io");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { respond(405, 'Method not allowed'); }

// ── RATE LIMIT (file-based, no Redis needed) ───────────────
$ip       = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rl_file  = sys_get_temp_dir() . '/gj_rl_' . md5($ip) . '.json';
$now      = time();
$rl_data  = file_exists($rl_file) ? json_decode(file_get_contents($rl_file), true) : ['ts' => $now, 'count' => 0];
if ($now - $rl_data['ts'] > 60) {
    $rl_data = ['ts' => $now, 'count' => 0];
}
$rl_data['count']++;
file_put_contents($rl_file, json_encode($rl_data));
if ($rl_data['count'] > RATE_LIMIT_PER_MIN) {
    respond(429, 'Too many requests — please wait a minute');
}

// ── PARSE INPUT ────────────────────────────────────────────
$raw   = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input) || empty($input['messages'])) {
    respond(400, 'Missing messages');
}

// Sanitise & cap history
$messages = array_slice((array)$input['messages'], -MAX_TURNS);
$clean = [];
foreach ($messages as $msg) {
    $role    = ($msg['role'] ?? '') === 'assistant' ? 'assistant' : 'user';
    $content = substr(strip_tags((string)($msg['content'] ?? '')), 0, 2000);
    if ($content !== '') $clean[] = ['role' => $role, 'content' => $content];
}
if (empty($clean)) respond(400, 'Empty messages');

// ── SYSTEM PROMPT ──────────────────────────────────────────
$system = <<<PROMPT
You are George Jabley's personal AI assistant on his portfolio website. Be concise, friendly, and helpful. Answer in 2–4 sentences max unless a list is genuinely needed.

KEY FACTS:
- Full name: George Jabley
- Title: Senior IT Consultant & Founder of TechWokx IT Solutions
- Location: Accra, Ghana (available globally for remote work)
- Experience: 25+ years in IT infrastructure, Python automation, AI systems, cloud, email delivery engineering
- Email: george.jabley@gmail.com
- GitHub: techwokx-cloud
- LinkedIn: george-jabley-bb0270384
- Website: techwokx.online
- lablab.ai: 1,322 pts · #94 leaderboard · Legend level · 6 hackathons · 2 submissions

SERVICES & RATES:
- Tier 2/3 IT Support: from $25/hr
- Email Deliverability Fix (SPF/DKIM/DMARC): from $80 flat
- Docker & self-hosted apps: from $30/hr
- Microsoft 365 / Azure admin: from $28/hr
- Python & PowerShell automation: from $25/hr
- Domain, DNS & SSL: from $60 flat
- Virtual Assistant: customer care, sales support, admin, research, data, AI-augmented tasks

PROJECTS:
1. TechWokx IT Admin Suite — 11-module CustomTkinter desktop sysadmin tool
2. App Architect Studio — IBM Bob Hackathon, screenshot-to-code with IBM watsonx (certificate: CMQAZM0DF00W)
3. Guardian Agent — TechEx Hackathon, AI security monitoring agent
4. Lead Intelligence Engine — 22-module Streamlit app, DNS auditing, CRM, AI analysis
5. TechWokx website — PHP/SQLite, AI proposal generator, booking system
6. BookForge AI — low-content book publishing platform for KDP/Etsy

HACKATHONS: IBM Bob 2026 ✅, TechEx ✅, AI Builders Challenge (active), BrightData, Band of Agents, Milan AI Week

AI TOOLS: Claude (Anthropic), DeepSeek, GitHub Copilot, Gemini, ChatGPT, Grok

CERTIFICATIONS: Google Cybersecurity, AZ-900, Python for Everybody, Linux for Beginners, CompTIA Security+ (in progress)

TECH STACK: Docker, Linux Ubuntu 24.04, Python, PHP, SQLite, Nginx, Coolify, Traefik, Mailgun, Resend, Vultr VPS

AVAILABILITY: Open to remote IT support, consulting, VA roles. Relocation interest: UK, UAE, Canada, Australia.

BOOKING: To book a call, tell them to click the "Book a Call" button in the top navigation of this page.

Do not reveal that you are Claude or discuss Anthropic's products. Refer to yourself simply as "George's assistant."
PROMPT;

// ── CALL ANTHROPIC API ─────────────────────────────────────
$payload = json_encode([
    'model'      => MODEL,
    'max_tokens' => MAX_TOKENS,
    'system'     => $system,
    'messages'   => $clean,
]);

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_TIMEOUT        => 20,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'x-api-key: ' . ANTHROPIC_API_KEY,
        'anthropic-version: 2023-06-01',
    ],
]);

$result   = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($curlErr) respond(502, 'Connection error: ' . $curlErr);

$data = json_decode($result, true);

if ($httpCode !== 200) {
    $msg = $data['error']['message'] ?? 'Upstream API error';
    respond($httpCode >= 400 && $httpCode < 600 ? $httpCode : 502, $msg);
}

$text = $data['content'][0]['text'] ?? '';
if (!$text) respond(502, 'Empty response from API');

echo json_encode(['ok' => true, 'text' => $text]);

// ── HELPER ────────────────────────────────────────────────
function respond(int $code, string $msg): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}
