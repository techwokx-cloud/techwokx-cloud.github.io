<?php
/**
 * TechWokx — Portfolio Projects API
 * GET    /api/portfolio.php           → list all projects
 * POST   /api/portfolio.php           → add project
 * PUT    /api/portfolio.php           → update project
 * DELETE /api/portfolio.php?id=N      → delete project
 */
header('Content-Type: application/json');
session_start();

require_once __DIR__ . '/../db/init.php';

function initPortfolioTable(PDO $db): void {
    $db->exec("
        CREATE TABLE IF NOT EXISTS portfolio_projects (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            title       TEXT NOT NULL,
            category    TEXT NOT NULL DEFAULT 'infrastructure',
            status      TEXT NOT NULL DEFAULT 'live',
            short_desc  TEXT,
            long_desc   TEXT,
            metric1_val TEXT,
            metric1_lbl TEXT,
            metric2_val TEXT,
            metric2_lbl TEXT,
            metric3_val TEXT,
            metric3_lbl TEXT,
            tech_tags   TEXT,
            github_url  TEXT,
            live_url    TEXT,
            icon        TEXT DEFAULT 'fas fa-server',
            icon_color  TEXT DEFAULT '#0ea5e9',
            bg_color    TEXT DEFAULT '#0d1526',
            is_active   INTEGER DEFAULT 1,
            sort_order  INTEGER DEFAULT 0,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // Seed default projects if empty
    $count = $db->query("SELECT COUNT(*) FROM portfolio_projects")->fetchColumn();
    if ((int)$count === 0) {
        $db->exec("
        INSERT INTO portfolio_projects
            (title,category,status,short_desc,metric1_val,metric1_lbl,metric2_val,metric2_lbl,metric3_val,metric3_lbl,tech_tags,github_url,icon,icon_color,sort_order)
        VALUES
            ('eSignature Platform — Self-Hosted Documenso','infrastructure','live',
             'Deployed Documenso on Docker on a resource-constrained 2GB RAM VPS. Solved memory constraints, configured Nginx, SSL, and domain routing. Live in production.',
             '2GB','RAM VPS','100%','Uptime','£0/mo','SaaS saved',
             'Docker,Docker Compose,Nginx,Linux,SSL/TLS,DNS',
             'https://github.com/techwokx-cloud',
             'fas fa-file-signature','#0ea5e9',1),

            ('Email Infrastructure Migration — SMTP to Mailgun','email','delivered',
             'Resolved persistent email deliverability failure. Migrated to Mailgun, configured SPF/DKIM/DMARC from scratch. Fixed what two other engineers could not.',
             '100%','Inbox rate','0','Spam issues','3','DNS layers',
             'Mailgun,SPF,DKIM,DMARC,DNS,Python',
             '','fas fa-envelope-open-text','#f97316',2),

            ('National Election Print Production — 80,000 Units','operations','delivered',
             'Designed and managed full production environment from scratch. 10+ industrial printers, 6 workstations. Zero defects. Hard 3-week deadline met.',
             '80K+','Units delivered','3 wks','Deadline met','Zero','Defects',
             '10+ Printers,6 Workstations,Print Server,Team Leadership',
             '','fas fa-print','#16a34a',3),

            ('TechWokx Lead Intelligence Engine','platform','live',
             'Built 22-module Python/Streamlit app — DNS audit, lead scoring, Claude AI analysis, PDF proposal generation, CRM pipeline. Deployed on Streamlit Cloud.',
             '22','Modules','Claude','AI powered','Live','Production',
             'Python,Streamlit,Claude API,SQLite,SQLAlchemy,DNS',
             'https://github.com/techwokx-cloud',
             'fas fa-brain','#8b5cf6',4),

            ('Email Storage Cleanup Automation','email','live',
             'Python automation scripts for Yahoo Mail storage cleanup for a hospitality client. Eliminated a recurring weekly manual process entirely.',
             '100%','Automated','0 hrs','Manual work','Weekly','Auto-runs',
             'Python,SMTP,IMAP,Automation,Bash',
             'https://github.com/techwokx-cloud',
             'fas fa-robot','#f59e0b',5),

            ('TechWokx Business Website & Dashboard','platform','live',
             'Built full business website with email audit tool, proposal generator, admin dashboard, and PHP/SQLite backend with GitHub auto-deploy.',
             '5+','Tools built','PHP','Backend','CI/CD','Auto-deploy',
             'HTML/CSS/JS,PHP,SQLite,GitHub Actions,DNS',
             'https://github.com/techwokx-cloud',
             'fas fa-globe','#0ea5e9',6);
        ");
    }
}

$db = getDB();
initPortfolioTable($db);
$method = $_SERVER['REQUEST_METHOD'];

// Auth required for write operations
$isAdmin = !empty($_SESSION['tw_admin']);

// GET — public
if ($method === 'GET') {
    $active_only = isset($_GET['active']) ? (int)$_GET['active'] : 0;
    $cat = $_GET['category'] ?? '';
    $sql = "SELECT * FROM portfolio_projects WHERE 1=1";
    if ($active_only) $sql .= " AND is_active = 1";
    if ($cat && $cat !== 'all') $sql .= " AND category = " . $db->quote($cat);
    $sql .= " ORDER BY sort_order ASC, id ASC";
    $rows = $db->query($sql)->fetchAll();
    // Parse tech_tags to array
    foreach ($rows as &$r) {
        $r['tech_tags_arr'] = $r['tech_tags'] ? explode(',', $r['tech_tags']) : [];
    }
    echo json_encode(['success' => true, 'projects' => $rows]);
    exit;
}

// Write operations — admin only
if (!$isAdmin) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorised']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

// POST — create
if ($method === 'POST') {
    $stmt = $db->prepare("
        INSERT INTO portfolio_projects
            (title,category,status,short_desc,long_desc,
             metric1_val,metric1_lbl,metric2_val,metric2_lbl,metric3_val,metric3_lbl,
             tech_tags,github_url,live_url,icon,icon_color,bg_color,is_active,sort_order)
        VALUES
            (:title,:cat,:status,:sdesc,:ldesc,
             :m1v,:m1l,:m2v,:m2l,:m3v,:m3l,
             :tags,:gh,:live,:icon,:icolor,:bg,:active,:sort)
    ");
    $stmt->execute([
        ':title'  => htmlspecialchars($input['title'] ?? '', ENT_QUOTES),
        ':cat'    => $input['category'] ?? 'infrastructure',
        ':status' => $input['status']   ?? 'live',
        ':sdesc'  => htmlspecialchars($input['short_desc'] ?? '', ENT_QUOTES),
        ':ldesc'  => htmlspecialchars($input['long_desc']  ?? '', ENT_QUOTES),
        ':m1v'    => $input['metric1_val'] ?? '',
        ':m1l'    => $input['metric1_lbl'] ?? '',
        ':m2v'    => $input['metric2_val'] ?? '',
        ':m2l'    => $input['metric2_lbl'] ?? '',
        ':m3v'    => $input['metric3_val'] ?? '',
        ':m3l'    => $input['metric3_lbl'] ?? '',
        ':tags'   => $input['tech_tags'] ?? '',
        ':gh'     => $input['github_url'] ?? '',
        ':live'   => $input['live_url']   ?? '',
        ':icon'   => $input['icon']       ?? 'fas fa-server',
        ':icolor' => $input['icon_color'] ?? '#0ea5e9',
        ':bg'     => $input['bg_color']   ?? '#0d1526',
        ':active' => (int)($input['is_active'] ?? 1),
        ':sort'   => (int)($input['sort_order'] ?? 99),
    ]);
    echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
    exit;
}

// PUT — update
if ($method === 'PUT') {
    $id = (int)($input['id'] ?? 0);
    if (!$id) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'ID required']); exit; }
    $stmt = $db->prepare("
        UPDATE portfolio_projects SET
            title=:title, category=:cat, status=:status,
            short_desc=:sdesc, long_desc=:ldesc,
            metric1_val=:m1v, metric1_lbl=:m1l,
            metric2_val=:m2v, metric2_lbl=:m2l,
            metric3_val=:m3v, metric3_lbl=:m3l,
            tech_tags=:tags, github_url=:gh, live_url=:live,
            icon=:icon, icon_color=:icolor, bg_color=:bg,
            is_active=:active, sort_order=:sort,
            updated_at=CURRENT_TIMESTAMP
        WHERE id=:id
    ");
    $stmt->execute([
        ':id'     => $id,
        ':title'  => htmlspecialchars($input['title'] ?? '', ENT_QUOTES),
        ':cat'    => $input['category'] ?? 'infrastructure',
        ':status' => $input['status']   ?? 'live',
        ':sdesc'  => htmlspecialchars($input['short_desc'] ?? '', ENT_QUOTES),
        ':ldesc'  => htmlspecialchars($input['long_desc']  ?? '', ENT_QUOTES),
        ':m1v'    => $input['metric1_val'] ?? '',
        ':m1l'    => $input['metric1_lbl'] ?? '',
        ':m2v'    => $input['metric2_val'] ?? '',
        ':m2l'    => $input['metric2_lbl'] ?? '',
        ':m3v'    => $input['metric3_val'] ?? '',
        ':m3l'    => $input['metric3_lbl'] ?? '',
        ':tags'   => $input['tech_tags'] ?? '',
        ':gh'     => $input['github_url'] ?? '',
        ':live'   => $input['live_url']   ?? '',
        ':icon'   => $input['icon']       ?? 'fas fa-server',
        ':icolor' => $input['icon_color'] ?? '#0ea5e9',
        ':bg'     => $input['bg_color']   ?? '#0d1526',
        ':active' => (int)($input['is_active'] ?? 1),
        ':sort'   => (int)($input['sort_order'] ?? 99),
    ]);
    echo json_encode(['success' => true]);
    exit;
}

// DELETE
if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? $input['id'] ?? 0);
    if (!$id) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'ID required']); exit; }
    $db->prepare("DELETE FROM portfolio_projects WHERE id = ?")->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
