<?php
/**
 * TechWokx Ghana — SQLite Database Init
 * Railway: SQLite file lives in /data volume (persistent)
 * Local:   Falls back to db/ folder
 */

// Railway mounts a persistent volume at /data
// Locally it uses the db/ folder
define('DB_PATH', is_dir('/data') ? '/data/techwokx.sqlite' : __DIR__ . '/techwokx.sqlite');

function getDB(): PDO {
    static $db = null;
    if ($db === null) {
        $db = new PDO('sqlite:' . DB_PATH);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $db->exec('PRAGMA journal_mode=WAL;');
        $db->exec('PRAGMA foreign_keys=ON;');
        initTables($db);
    }
    return $db;
}

function initTables(PDO $db): void {
    $db->exec("
        CREATE TABLE IF NOT EXISTS audit_submissions (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT,
            business    TEXT,
            email       TEXT NOT NULL,
            phone       TEXT,
            staff_count TEXT,
            industry    TEXT,
            score       INTEGER DEFAULT 0,
            max_score   INTEGER DEFAULT 80,
            risk_status TEXT,
            step1_val   INTEGER,
            step2_val   INTEGER,
            step3_val   INTEGER,
            step4_val   INTEGER,
            ip          TEXT,
            user_agent  TEXT,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS contact_submissions (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT,
            business    TEXT,
            email       TEXT NOT NULL,
            phone       TEXT,
            service     TEXT,
            message     TEXT,
            ip          TEXT,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS emergency_requests (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name  TEXT,
            last_name   TEXT,
            email       TEXT NOT NULL,
            phone       TEXT,
            company     TEXT,
            issue_type  TEXT,
            message     TEXT,
            status      TEXT DEFAULT 'new',
            ip          TEXT,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS magnet_signups (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            email       TEXT NOT NULL,
            magnet_type TEXT,
            ip          TEXT,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_audit_email   ON audit_submissions(email);
        CREATE INDEX IF NOT EXISTS idx_audit_date    ON audit_submissions(created_at);
        CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
        CREATE INDEX IF NOT EXISTS idx_emerg_status  ON emergency_requests(status);
    ");
}

function initServicesTables(PDO $db): void {
    $db->exec("
        CREATE TABLE IF NOT EXISTS currencies (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            code        TEXT NOT NULL UNIQUE,
            symbol      TEXT NOT NULL,
            name        TEXT NOT NULL,
            is_active   INTEGER DEFAULT 1,
            is_default  INTEGER DEFAULT 0,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS services (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            slug        TEXT NOT NULL UNIQUE,
            name        TEXT NOT NULL,
            short_desc  TEXT,
            long_desc   TEXT,
            tier_tag    TEXT,
            tier_class  TEXT,
            is_active   INTEGER DEFAULT 1,
            sort_order  INTEGER DEFAULT 0,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS service_prices (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            service_id  INTEGER NOT NULL REFERENCES services(id),
            currency_id INTEGER NOT NULL REFERENCES currencies(id),
            amount      REAL NOT NULL,
            period      TEXT DEFAULT 'one-time',
            updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(service_id, currency_id)
        );

        CREATE TABLE IF NOT EXISTS service_features (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            service_id  INTEGER NOT NULL REFERENCES services(id),
            feature     TEXT NOT NULL,
            sort_order  INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS site_settings (
            key         TEXT PRIMARY KEY,
            value       TEXT,
            updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_prices_service ON service_prices(service_id);
        CREATE INDEX IF NOT EXISTS idx_features_svc   ON service_features(service_id);
    ");

    // Seed currencies
    $db->exec("
        INSERT OR IGNORE INTO currencies (code,symbol,name,is_default) VALUES
            ('GHS','₵','Ghanaian Cedi',1),
            ('USD','\$','US Dollar',0),
            ('GBP','£','British Pound',0),
            ('EUR','€','Euro',0),
            ('NGN','₦','Nigerian Naira',0),
            ('CAD','CA\$','Canadian Dollar',0),
            ('AUD','A\$','Australian Dollar',0);
    ");

    // Seed services
    $db->exec("
        INSERT OR IGNORE INTO services (slug,name,short_desc,tier_tag,tier_class,sort_order) VALUES
            ('email-fix','Business Email Health Fix',
             'Emails landing in spam, bouncing, or failing to reach clients. Permanent fix.',
             'Entry — Fast Fix','tag-entry',1),
            ('retainer','Monthly IT Retainer for Hotels & SMEs',
             'No IT department? We become your on-call IT team — remote-first, fixed monthly fee.',
             'Recurring','tag-pro',2),
            ('audit','Infrastructure Audit + Fix Report',
             'Structured audit with RED/ORANGE/GREEN risk status and specific fixes.',
             'Professional','tag-pro',3),
            ('automation','Business Process Automation Scripts',
             'Python or Bash scripts that handle repetitive tasks automatically.',
             'High Value','tag-ent',4);
    ");

    // Seed GHS prices
    $db->exec("
        INSERT OR IGNORE INTO service_prices (service_id,currency_id,amount,period)
        SELECT s.id,c.id,p.amount,p.period FROM (
            SELECT 'email-fix' AS slug,1500.0 AS amount,'one-time' AS period UNION ALL
            SELECT 'retainer',800.0,'/month' UNION ALL
            SELECT 'audit',2000.0,'one-time' UNION ALL
            SELECT 'automation',800.0,'/script'
        ) p JOIN services s ON s.slug=p.slug JOIN currencies c ON c.code='GHS';
    ");

    // Seed USD prices
    $db->exec("
        INSERT OR IGNORE INTO service_prices (service_id,currency_id,amount,period)
        SELECT s.id,c.id,p.amount,p.period FROM (
            SELECT 'email-fix' AS slug,120.0 AS amount,'one-time' AS period UNION ALL
            SELECT 'retainer',65.0,'/month' UNION ALL
            SELECT 'audit',160.0,'one-time' UNION ALL
            SELECT 'automation',65.0,'/script'
        ) p JOIN services s ON s.slug=p.slug JOIN currencies c ON c.code='USD';
    ");

    // Seed GBP prices
    $db->exec("
        INSERT OR IGNORE INTO service_prices (service_id,currency_id,amount,period)
        SELECT s.id,c.id,p.amount,p.period FROM (
            SELECT 'email-fix' AS slug,95.0 AS amount,'one-time' AS period UNION ALL
            SELECT 'retainer',50.0,'/month' UNION ALL
            SELECT 'audit',125.0,'one-time' UNION ALL
            SELECT 'automation',50.0,'/script'
        ) p JOIN services s ON s.slug=p.slug JOIN currencies c ON c.code='GBP';
    ");

    // Seed features
    $db->exec("
        INSERT OR IGNORE INTO service_features (service_id,feature,sort_order)
        SELECT s.id,f.feature,f.n FROM (
            SELECT 'email-fix' AS slug,'Full email infrastructure audit' AS feature,1 AS n UNION ALL
            SELECT 'email-fix','Email security records configured',2 UNION ALL
            SELECT 'email-fix','Email migration if needed',3 UNION ALL
            SELECT 'email-fix','Professional signatures for all staff',4 UNION ALL
            SELECT 'email-fix','Deliverability test before and after',5 UNION ALL
            SELECT 'email-fix','Written fix summary report',6 UNION ALL
            SELECT 'retainer','Remote support for all staff devices',1 UNION ALL
            SELECT 'retainer','WiFi and network troubleshooting',2 UNION ALL
            SELECT 'retainer','POS and booking software support',3 UNION ALL
            SELECT 'retainer','Email and communication issues',4 UNION ALL
            SELECT 'retainer','Monthly system health check',5 UNION ALL
            SELECT 'retainer','4-hour priority response weekdays',6 UNION ALL
            SELECT 'audit','Email, network and access control review',1 UNION ALL
            SELECT 'audit','Former staff risk assessment',2 UNION ALL
            SELECT 'audit','Backup and recovery check',3 UNION ALL
            SELECT 'audit','Security and device management',4 UNION ALL
            SELECT 'audit','RED/ORANGE/GREEN risk status',5 UNION ALL
            SELECT 'audit','Top 5 risks with fix costs',6 UNION ALL
            SELECT 'automation','Invoice and payment reminder automation',1 UNION ALL
            SELECT 'automation','Email cleanup and archiving scripts',2 UNION ALL
            SELECT 'automation','File processing and report generation',3 UNION ALL
            SELECT 'automation','Staff access audit scripts',4 UNION ALL
            SELECT 'automation','Website uptime monitoring',5 UNION ALL
            SELECT 'automation','Delivered, tested and documented',6
        ) f JOIN services s ON s.slug=f.slug;
    ");

    // Default settings
    $db->exec("
        INSERT OR IGNORE INTO site_settings (key,value) VALUES
            ('active_currency','GHS'),
            ('site_name','TechWokx Ghana'),
            ('admin_password','techwokx2025');
    ");
}
