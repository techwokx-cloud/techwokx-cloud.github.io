<?php
/**
 * TechWokx Ghana — Admin Services & Pricing API
 * POST /api/admin-services.php
 * Requires dashboard login session
 */

header('Content-Type: application/json');
session_start();

if (empty($_SESSION['tw_admin'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorised']);
    exit;
}

require_once __DIR__ . '/../db/init.php';

$input  = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$action = $input['action'] ?? '';

try {
    $db = getDB();
    initServicesTables($db);

    switch ($action) {

        case 'get_all':
            $services   = $db->query("SELECT * FROM services ORDER BY sort_order")->fetchAll();
            $currencies = $db->query("SELECT * FROM currencies ORDER BY is_default DESC, code")->fetchAll();
            $prices     = $db->query("
                SELECT sp.*, s.slug, s.name AS service_name, c.code, c.symbol
                FROM service_prices sp
                JOIN services   s ON s.id = sp.service_id
                JOIN currencies c ON c.id = sp.currency_id
                ORDER BY s.sort_order, c.code
            ")->fetchAll();
            $features   = $db->query("
                SELECT sf.*, s.slug FROM service_features sf
                JOIN services s ON s.id = sf.service_id
                ORDER BY sf.service_id, sf.sort_order
            ")->fetchAll();
            $settings   = $db->query("SELECT key, value FROM site_settings")
                             ->fetchAll(PDO::FETCH_KEY_PAIR);

            echo json_encode([
                'success'    => true,
                'services'   => $services,
                'currencies' => $currencies,
                'prices'     => $prices,
                'features'   => $features,
                'settings'   => $settings
            ]);
            break;

        case 'update_price':
            $sid    = (int)($input['service_id']  ?? 0);
            $cid    = (int)($input['currency_id'] ?? 0);
            $amount = (float)($input['amount']    ?? 0);
            $period = trim($input['period']       ?? 'one-time');

            if (!$sid || !$cid || $amount < 0) throw new Exception('Invalid price data');

            $db->prepare("
                INSERT INTO service_prices (service_id, currency_id, amount, period, updated_at)
                VALUES (:sid, :cid, :amt, :per, CURRENT_TIMESTAMP)
                ON CONFLICT(service_id, currency_id)
                DO UPDATE SET amount=:amt, period=:per, updated_at=CURRENT_TIMESTAMP
            ")->execute([':sid'=>$sid,':cid'=>$cid,':amt'=>$amount,':per'=>$period]);

            echo json_encode(['success' => true]);
            break;

        case 'update_service':
            $id   = (int)($input['id'] ?? 0);
            $name = htmlspecialchars(trim($input['name']       ?? ''), ENT_QUOTES);
            $desc = htmlspecialchars(trim($input['short_desc'] ?? ''), ENT_QUOTES);
            $tag  = htmlspecialchars(trim($input['tier_tag']   ?? ''), ENT_QUOTES);

            if (!$id || !$name) throw new Exception('Invalid service data');

            $db->prepare("
                UPDATE services SET name=:n, short_desc=:d, tier_tag=:t,
                updated_at=CURRENT_TIMESTAMP WHERE id=:id
            ")->execute([':n'=>$name,':d'=>$desc,':t'=>$tag,':id'=>$id]);

            echo json_encode(['success' => true]);
            break;

        case 'toggle_service':
            $id = (int)($input['id'] ?? 0);
            if (!$id) throw new Exception('Invalid ID');

            $db->prepare("UPDATE services SET is_active = 1 - is_active WHERE id = ?")
               ->execute([$id]);

            $row = $db->prepare("SELECT is_active FROM services WHERE id = ?");
            $row->execute([$id]);

            echo json_encode(['success' => true, 'is_active' => (int)$row->fetchColumn()]);
            break;

        case 'set_active_currency':
            $code = strtoupper(trim($input['code'] ?? ''));
            if (!$code) throw new Exception('Code required');

            $check = $db->prepare("SELECT id FROM currencies WHERE code = ?");
            $check->execute([$code]);
            if (!$check->fetch()) throw new Exception('Currency not found');

            $db->prepare("
                INSERT INTO site_settings (key, value, updated_at)
                VALUES ('active_currency', :c, CURRENT_TIMESTAMP)
                ON CONFLICT(key) DO UPDATE SET value=:c, updated_at=CURRENT_TIMESTAMP
            ")->execute([':c' => $code]);

            echo json_encode(['success' => true, 'active_currency' => $code]);
            break;

        case 'save_currency':
            $code   = strtoupper(trim($input['code']   ?? ''));
            $symbol = trim($input['symbol'] ?? '');
            $name   = htmlspecialchars(trim($input['name'] ?? ''), ENT_QUOTES);

            if (!$code || !$symbol || !$name) throw new Exception('All fields required');

            $db->prepare("
                INSERT INTO currencies (code, symbol, name, is_active)
                VALUES (:c, :s, :n, 1)
                ON CONFLICT(code) DO UPDATE SET symbol=:s, name=:n
            ")->execute([':c'=>$code,':s'=>$symbol,':n'=>$name]);

            echo json_encode(['success' => true]);
            break;

        case 'update_feature':
            $id  = (int)($input['id'] ?? 0);
            $txt = htmlspecialchars(trim($input['feature'] ?? ''), ENT_QUOTES);

            if (!$id || !$txt) throw new Exception('Invalid feature');

            $db->prepare("UPDATE service_features SET feature = ? WHERE id = ?")
               ->execute([$txt, $id]);

            echo json_encode(['success' => true]);
            break;

        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Unknown action: ' . $action]);
    }

} catch (Exception $e) {
    error_log('admin-services.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
