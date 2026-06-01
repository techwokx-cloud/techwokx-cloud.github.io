<?php
/**
 * TechWokx Ghana — Public Services & Prices API
 * GET /api/services.php?currency=GHS
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=300');

require_once __DIR__ . '/../db/init.php';

$currency = strtoupper(trim($_GET['currency'] ?? 'GHS'));

try {
    $db = getDB();
    initServicesTables($db);

    // Get currency
    $cur = $db->prepare("SELECT * FROM currencies WHERE code = ? AND is_active = 1");
    $cur->execute([$currency]);
    $currencyData = $cur->fetch();

    // Fallback to default currency if not found
    if (!$currencyData) {
        $cur = $db->prepare("SELECT * FROM currencies WHERE is_default = 1");
        $cur->execute();
        $currencyData = $cur->fetch();
    }

    // Get services with prices
    $stmt = $db->prepare("
        SELECT
            s.id, s.slug, s.name, s.short_desc,
            s.tier_tag, s.tier_class, s.sort_order,
            COALESCE(sp.amount, 0)  AS price,
            COALESCE(sp.period, '') AS period,
            c.symbol                AS currency_symbol,
            c.code                  AS currency_code
        FROM services s
        LEFT JOIN currencies c ON c.code = :currency AND c.is_active = 1
        LEFT JOIN service_prices sp
               ON sp.service_id  = s.id
              AND sp.currency_id = c.id
        WHERE s.is_active = 1
        ORDER BY s.sort_order ASC
    ");
    $stmt->execute([':currency' => $currency]);
    $services = $stmt->fetchAll();

    // Attach features to each service
    foreach ($services as &$svc) {
        $feat = $db->prepare("
            SELECT feature FROM service_features
            WHERE service_id = ? ORDER BY sort_order ASC
        ");
        $feat->execute([$svc['id']]);
        $svc['features'] = $feat->fetchAll(PDO::FETCH_COLUMN);
    }

    // All currencies for switcher
    $allCur = $db->query("
        SELECT code, symbol, name FROM currencies
        WHERE is_active = 1
        ORDER BY is_default DESC, code ASC
    ")->fetchAll();

    echo json_encode([
        'success'    => true,
        'currency'   => $currencyData,
        'currencies' => $allCur,
        'services'   => $services
    ]);

} catch (Exception $e) {
    error_log('services.php error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
