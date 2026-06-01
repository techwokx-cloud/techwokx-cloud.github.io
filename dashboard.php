<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TechWokx Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>
:root{
  --bg:#060d1a;--panel:#0d1526;--panel2:#111e33;--border:rgba(255,255,255,0.07);
  --border2:rgba(255,255,255,0.12);--text:#e2e8f0;--muted:#64748b;
  --accent:#f97316;--red:#dc2626;--green:#16a34a;--blue:#0ea5e9;
  --font:'Outfit',sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh;}

/* ── LOGIN ── */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;}
.login-box{background:var(--panel);border:1px solid var(--border2);border-radius:14px;padding:2.5rem;width:380px;max-width:100%;}
.login-box h2{font-size:1.4rem;margin-bottom:0.25rem;}
.login-box p{font-size:0.83rem;color:var(--muted);margin-bottom:1.75rem;}
.lf{display:flex;flex-direction:column;gap:0.35rem;margin-bottom:0.85rem;}
.lf label{font-size:0.72rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;}
.lf input{background:rgba(255,255,255,0.05);border:1.5px solid var(--border);border-radius:8px;color:white;padding:.75rem .9rem;font-family:var(--font);font-size:.93rem;transition:border-color .2s;}
.lf input:focus{outline:none;border-color:var(--accent);}
.btn-login{width:100%;background:linear-gradient(135deg,var(--accent),var(--red));color:white;border:none;padding:.85rem;border-radius:8px;font-family:var(--font);font-size:.97rem;font-weight:700;cursor:pointer;margin-top:.25rem;}

/* ── LAYOUT ── */
.dash{display:none;}
.dash.show{display:flex;min-height:100vh;}
.sidebar{width:220px;background:var(--panel);border-right:1px solid var(--border);padding:1.25rem 0;flex-shrink:0;position:sticky;top:0;height:100vh;overflow-y:auto;}
.sb-logo{padding:0 1.25rem 1.25rem;border-bottom:1px solid var(--border);margin-bottom:1rem;}
.sb-logo img{height:32px;}
.sb-section{font-size:.65rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;padding:.5rem 1.25rem .25rem;}
.sb-link{display:flex;align-items:center;gap:.65rem;padding:.6rem 1.25rem;font-size:.83rem;color:rgba(255,255,255,.55);cursor:pointer;transition:all .2s;border-left:2px solid transparent;}
.sb-link:hover{color:white;background:rgba(255,255,255,.04);}
.sb-link.act{color:var(--accent);border-left-color:var(--accent);background:rgba(249,115,22,.06);}
.sb-link i{width:16px;text-align:center;font-size:.8rem;}

.main{flex:1;overflow-y:auto;}
.topbar{height:56px;background:var(--panel);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 1.75rem;gap:1rem;position:sticky;top:0;z-index:10;}
.topbar h1{font-size:1.05rem;font-weight:700;flex:1;}
.topbar-actions{display:flex;gap:.65rem;}
.btn-sm{padding:.4rem .9rem;border-radius:6px;font-size:.78rem;font-weight:600;border:none;cursor:pointer;font-family:var(--font);transition:all .2s;}
.btn-primary{background:var(--accent);color:white;}
.btn-primary:hover{opacity:.85;}
.btn-ghost{background:rgba(255,255,255,.05);color:var(--muted);border:1px solid var(--border2);}
.btn-ghost:hover{color:white;}
.btn-danger{background:rgba(220,38,38,.15);color:#fca5a5;border:1px solid rgba(220,38,38,.25);}
.btn-danger:hover{background:rgba(220,38,38,.25);}
.btn-success{background:rgba(22,163,74,.15);color:#86efac;border:1px solid rgba(22,163,74,.25);}
.btn-success:hover{background:rgba(22,163,74,.25);}

.page{display:none;padding:1.75rem;}
.page.act{display:block;}

/* ── KPI GRID ── */
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.85rem;margin-bottom:1.75rem;}
.kpi{background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:1.1rem;}
.kpi-label{font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:.35rem;}
.kpi-val{font-size:1.9rem;font-weight:700;color:white;line-height:1;margin-bottom:.2rem;}
.kpi-sub{font-size:.72rem;color:var(--muted);}

/* ── TABLES ── */
.panel{background:var(--panel);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:1.25rem;}
.panel-head{padding:.9rem 1.1rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:1rem;}
.panel-head h3{font-size:.87rem;font-weight:700;}
.panel-head p{font-size:.75rem;color:var(--muted);}
.tbl{width:100%;border-collapse:collapse;}
.tbl th{font-size:.67rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;padding:.5rem .85rem;text-align:left;border-bottom:1px solid var(--border);}
.tbl td{padding:.6rem .85rem;font-size:.82rem;border-bottom:1px solid rgba(255,255,255,.04);vertical-align:middle;}
.tbl tr:last-child td{border-bottom:none;}
.tbl tr:hover td{background:rgba(255,255,255,.02);}
.badge{display:inline-block;font-size:.65rem;font-weight:700;padding:.13rem .45rem;border-radius:3px;}
.badge-red{background:rgba(220,38,38,.18);color:#f87171;}
.badge-orange{background:rgba(234,88,12,.18);color:#fb923c;}
.badge-green{background:rgba(22,163,74,.18);color:#4ade80;}
.badge-blue{background:rgba(14,165,233,.18);color:#38bdf8;}
.badge-grey{background:rgba(255,255,255,.08);color:var(--muted);}

/* ── SERVICES / PRICING PAGE ── */
.currency-switcher{display:flex;align-items:center;gap:.65rem;flex-wrap:wrap;margin-bottom:1.5rem;padding:1rem 1.25rem;background:var(--panel);border:1px solid var(--border);border-radius:10px;}
.currency-switcher label{font-size:.75rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;}
.cur-btn{padding:.38rem .85rem;border-radius:20px;border:1.5px solid var(--border2);background:transparent;color:var(--muted);font-family:var(--font);font-size:.8rem;cursor:pointer;transition:all .2s;}
.cur-btn:hover{border-color:var(--accent);color:var(--accent);}
.cur-btn.act{background:rgba(249,115,22,.12);border-color:var(--accent);color:var(--accent);font-weight:600;}
.active-currency-badge{margin-left:auto;background:rgba(22,163,74,.12);border:1px solid rgba(22,163,74,.25);color:#4ade80;font-size:.72rem;font-weight:700;padding:.25rem .75rem;border-radius:20px;}

.svc-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;}
.svc-card{background:var(--panel);border:1px solid var(--border);border-radius:10px;overflow:hidden;}
.svc-card-head{padding:1rem 1.25rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start;}
.svc-card-head .left h3{font-size:.95rem;font-weight:700;margin-bottom:.2rem;}
.svc-card-head .left p{font-size:.75rem;color:var(--muted);line-height:1.4;}
.svc-toggle{background:rgba(255,255,255,.05);border:1px solid var(--border2);color:var(--muted);padding:.3rem .7rem;border-radius:5px;font-size:.72rem;cursor:pointer;font-family:var(--font);}
.svc-toggle.on{background:rgba(22,163,74,.12);border-color:rgba(22,163,74,.3);color:#4ade80;}

.price-table{width:100%;}
.price-row{display:flex;align-items:center;justify-content:space-between;padding:.6rem 1.25rem;border-bottom:1px solid rgba(255,255,255,.04);}
.price-row:last-child{border-bottom:none;}
.price-cur{display:flex;align-items:center;gap:.5rem;}
.price-cur-code{font-size:.72rem;font-weight:700;color:var(--muted);width:36px;}
.price-cur-name{font-size:.78rem;color:rgba(255,255,255,.5);}
.price-input-wrap{display:flex;align-items:center;gap:.45rem;}
.price-symbol{font-size:.85rem;color:var(--muted);}
.price-input{background:rgba(255,255,255,.05);border:1.5px solid var(--border);border-radius:6px;color:white;padding:.38rem .6rem;font-family:var(--font);font-size:.88rem;width:100px;text-align:right;transition:border-color .2s;}
.price-input:focus{outline:none;border-color:var(--accent);}
.period-select{background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:5px;color:var(--muted);padding:.35rem .5rem;font-family:var(--font);font-size:.75rem;}
.save-price-btn{background:rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.25);color:var(--accent);padding:.3rem .7rem;border-radius:5px;font-size:.72rem;font-weight:600;cursor:pointer;font-family:var(--font);transition:all .2s;white-space:nowrap;}
.save-price-btn:hover{background:rgba(249,115,22,.22);}
.save-price-btn.saved{background:rgba(22,163,74,.12);border-color:rgba(22,163,74,.3);color:#4ade80;}

.features-list{padding:.75rem 1.25rem;}
.feature-item{display:flex;align-items:center;gap:.5rem;padding:.35rem 0;border-bottom:1px solid rgba(255,255,255,.04);}
.feature-item:last-child{border-bottom:none;}
.feature-item input{flex:1;background:transparent;border:none;color:rgba(255,255,255,.7);font-family:var(--font);font-size:.8rem;padding:.2rem .3rem;border-radius:4px;transition:background .2s;}
.feature-item input:focus{outline:none;background:rgba(255,255,255,.05);}
.feature-save-btn{font-size:.65rem;color:var(--muted);background:transparent;border:none;cursor:pointer;padding:.2rem .4rem;opacity:0;transition:opacity .2s;}
.feature-item:hover .feature-save-btn{opacity:1;}

/* ── CURRENCY MANAGER ── */
.cur-form{display:grid;grid-template-columns:1fr 1fr 2fr auto;gap:.65rem;align-items:end;padding:1rem 1.25rem;border-bottom:1px solid var(--border);}
.cur-form .ff{display:flex;flex-direction:column;gap:.25rem;}
.cur-form label{font-size:.68rem;color:var(--muted);font-weight:600;text-transform:uppercase;}
.cur-form input{background:rgba(255,255,255,.05);border:1.5px solid var(--border);border-radius:6px;color:white;padding:.5rem .7rem;font-family:var(--font);font-size:.85rem;}
.cur-form input:focus{outline:none;border-color:var(--accent);}

/* ── MODAL ── */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);z-index:1000;display:none;align-items:center;justify-content:center;}
.modal-bg.open{display:flex;}
.modal{background:var(--panel2);border:1px solid var(--border2);border-radius:12px;padding:1.75rem;width:480px;max-width:90vw;}
.modal h3{font-size:1.1rem;margin-bottom:.25rem;}
.modal p{font-size:.82rem;color:var(--muted);margin-bottom:1.25rem;}
.mf{display:flex;flex-direction:column;gap:.3rem;margin-bottom:.75rem;}
.mf label{font-size:.7rem;color:var(--muted);text-transform:uppercase;font-weight:600;}
.mf input,.mf select,.mf textarea{background:rgba(255,255,255,.05);border:1.5px solid var(--border);border-radius:7px;color:white;padding:.65rem .85rem;font-family:var(--font);font-size:.88rem;}
.mf input:focus,.mf textarea:focus{outline:none;border-color:var(--accent);}
.mf textarea{resize:vertical;min-height:80px;}
.modal-actions{display:flex;justify-content:flex-end;gap:.5rem;margin-top:1rem;}

/* ── TOAST ── */
.toast{position:fixed;bottom:2rem;right:2rem;background:var(--panel2);border:1px solid var(--green);color:white;padding:.7rem 1.35rem;border-radius:8px;font-size:.85rem;opacity:0;transform:translateY(10px);transition:all .3s;z-index:9999;pointer-events:none;}
.toast.show{opacity:1;transform:translateY(0);}
.toast.err{border-color:var(--red);}

@media(max-width:768px){
  .svc-grid{grid-template-columns:1fr;}
  .kpi-grid{grid-template-columns:1fr 1fr;}
  .sidebar{display:none;}
  .cur-form{grid-template-columns:1fr 1fr;}
}
</style>
</head>
<body>

<!-- ── LOGIN ── -->
<div class="login-wrap" id="loginPage">
  <div class="login-box">
    <h2>TechWokx Dashboard</h2>
    <p>Sign in to manage your services, pricing, and leads.</p>
    <div class="lf"><label>Password</label><input type="password" id="loginPwd" placeholder="Enter password" onkeydown="if(event.key==='Enter')doLogin()"></div>
    <button class="btn-login" onclick="doLogin()">Sign In →</button>
    <p id="loginErr" style="color:#f87171;font-size:.8rem;margin-top:.75rem;display:none;">Incorrect password</p>
  </div>
</div>

<!-- ── DASHBOARD ── -->
<div class="dash" id="dash">
  <!-- Sidebar -->
  <nav class="sidebar">
    <div class="sb-logo">
      <img src="assets/images/logo/Techwokx_Logo_full_final.png" alt="TechWokx" onerror="this.style.display='none'">
      <div style="font-size:.78rem;font-weight:700;color:white;margin-top:.5rem;">TechWokx Admin</div>
    </div>
    <div class="sb-section">Main</div>
    <div class="sb-link act" data-page="overview" onclick="switchPage(this)"><i class="fas fa-th-large"></i> Overview</div>
    <div class="sb-link" data-page="leads" onclick="switchPage(this)"><i class="fas fa-users"></i> Leads</div>
    <div class="sb-link" data-page="emergency" onclick="switchPage(this)"><i class="fas fa-exclamation-triangle"></i> Emergency</div>
    <div class="sb-section">Content</div>
    <div class="sb-link" data-page="services" onclick="switchPage(this)"><i class="fas fa-cog"></i> Services & Pricing</div>
    <div class="sb-link" data-page="currencies" onclick="switchPage(this)"><i class="fas fa-dollar-sign"></i> Currencies</div>
    <div class="sb-section">Account</div>
    <div class="sb-link" onclick="window.open('index.html','_blank')"><i class="fas fa-external-link-alt"></i> View Site</div>
    <div class="sb-link" onclick="doLogout()"><i class="fas fa-sign-out-alt"></i> Sign Out</div>
  </nav>

  <div class="main">
    <div class="topbar">
      <h1 id="pageTitle">Overview</h1>
      <div class="topbar-actions">
        <button class="btn-sm btn-ghost" onclick="loadAllData()"><i class="fas fa-sync-alt"></i> Refresh</button>
        <button class="btn-sm btn-primary" onclick="window.open('index.html#audit','_blank')">View Audit →</button>
      </div>
    </div>

    <!-- OVERVIEW -->
    <div class="page act" id="page-overview">
      <div class="kpi-grid">
        <div class="kpi"><div class="kpi-label">Total Audit Leads</div><div class="kpi-val" id="kpiAudits">—</div><div class="kpi-sub">All time</div></div>
        <div class="kpi"><div class="kpi-label">Contact Enquiries</div><div class="kpi-val" id="kpiContacts">—</div><div class="kpi-sub">All time</div></div>
        <div class="kpi"><div class="kpi-label">Emergency Requests</div><div class="kpi-val" id="kpiEmergency">—</div><div class="kpi-sub">All time</div></div>
        <div class="kpi"><div class="kpi-label">Active Currency</div><div class="kpi-val" id="kpiCurrency" style="font-size:1.3rem;">—</div><div class="kpi-sub">Site display currency</div></div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Recent Audit Submissions</h3><span class="badge badge-blue" id="overviewCount">Loading...</span></div>
        <table class="tbl">
          <thead><tr><th>Name</th><th>Business</th><th>Email</th><th>Score</th><th>Risk</th><th>Date</th></tr></thead>
          <tbody id="overviewTable"><tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem;">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>

    <!-- LEADS -->
    <div class="page" id="page-leads">
      <div class="panel">
        <div class="panel-head">
          <div><h3>All Audit Leads</h3><p>Email audit submissions from your website</p></div>
          <button class="btn-sm btn-ghost" onclick="exportCSV('audits')"><i class="fas fa-download"></i> Export CSV</button>
        </div>
        <table class="tbl">
          <thead><tr><th>#</th><th>Name</th><th>Business</th><th>Email</th><th>Phone</th><th>Industry</th><th>Score</th><th>Risk</th><th>Date</th></tr></thead>
          <tbody id="leadsTable"><tr><td colspan="9" style="text-align:center;color:var(--muted);padding:2rem;">Loading...</td></tr></tbody>
        </table>
      </div>
      <div class="panel">
        <div class="panel-head">
          <div><h3>Contact Form Enquiries</h3></div>
          <button class="btn-sm btn-ghost" onclick="exportCSV('contacts')"><i class="fas fa-download"></i> Export CSV</button>
        </div>
        <table class="tbl">
          <thead><tr><th>#</th><th>Name</th><th>Business</th><th>Email</th><th>Service</th><th>Date</th></tr></thead>
          <tbody id="contactsTable"><tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem;">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>

    <!-- EMERGENCY -->
    <div class="page" id="page-emergency">
      <div class="panel">
        <div class="panel-head"><h3>Emergency IT Requests</h3><p>Submitted via the emergency form</p></div>
        <table class="tbl">
          <thead><tr><th>#</th><th>Name</th><th>Company</th><th>Email</th><th>Phone</th><th>Issue</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
          <tbody id="emergencyTable"><tr><td colspan="9" style="text-align:center;color:var(--muted);padding:2rem;">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>

    <!-- SERVICES & PRICING -->
    <div class="page" id="page-services">
      <div class="currency-switcher" id="currencySwitcher">
        <label>Display prices in:</label>
        <span id="curBtns"></span>
        <span class="active-currency-badge" id="activeCurBadge">Loading...</span>
        <button class="btn-sm btn-primary" onclick="setActiveCurrency()">Set as Site Default</button>
      </div>
      <div class="svc-grid" id="svcGrid">
        <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted);">Loading services...</div>
      </div>
    </div>

    <!-- CURRENCIES -->
    <div class="page" id="page-currencies">
      <div class="panel">
        <div class="panel-head"><h3>Add / Edit Currency</h3><p>Add a new currency or update an existing one</p></div>
        <div class="cur-form">
          <div class="ff"><label>Code (e.g. USD)</label><input type="text" id="newCurCode" placeholder="GBP" maxlength="3"></div>
          <div class="ff"><label>Symbol</label><input type="text" id="newCurSymbol" placeholder="£" maxlength="4"></div>
          <div class="ff"><label>Full Name</label><input type="text" id="newCurName" placeholder="British Pound"></div>
          <button class="btn-sm btn-primary" onclick="saveCurrency()" style="height:fit-content;align-self:flex-end;padding:.55rem 1rem;">Save Currency</button>
        </div>
        <table class="tbl">
          <thead><tr><th>Code</th><th>Symbol</th><th>Name</th><th>Status</th><th>Action</th></tr></thead>
          <tbody id="currenciesTable"><tr><td colspan="5" style="text-align:center;color:var(--muted);padding:2rem;">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>

  </div><!-- /main -->
</div><!-- /dash -->

<div class="toast" id="toast"></div>

<script>
// ── STATE ──
let state = { services:[], currencies:[], prices:[], features:[], settings:{}, audits:[], contacts:[], emergency:[] };
let selectedCurrency = 'GHS';

// ── AUTH ──
async function doLogin(){
  const pwd = document.getElementById('loginPwd').value;
  const res = await fetch('api/auth.php', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({password: pwd})
  });
  const data = await res.json();
  if(data.success){
    document.getElementById('loginPage').style.display='none';
    document.getElementById('dash').classList.add('show');
    loadAllData();
  } else {
    document.getElementById('loginErr').style.display='block';
  }
}

function doLogout(){
  fetch('api/auth.php', {method:'DELETE'});
  location.reload();
}

// ── NAVIGATION ──
function switchPage(el){
  document.querySelectorAll('.sb-link').forEach(l=>l.classList.remove('act'));
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('act'));
  el.classList.add('act');
  const page = el.dataset.page;
  document.getElementById('page-'+page).classList.add('act');
  document.getElementById('pageTitle').textContent = el.textContent.trim();
}

// ── DATA LOADING ──
async function loadAllData(){
  await Promise.all([loadServiceData(), loadLeadsData()]);
}

async function loadServiceData(){
  try {
    const res = await fetch('api/admin-services.php', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({action:'get_all'})
    });
    const data = await res.json();
    if(!data.success) throw new Error(data.error);
    state.services   = data.services;
    state.currencies = data.currencies;
    state.prices     = data.prices;
    state.features   = data.features;
    state.settings   = data.settings;
    selectedCurrency = data.settings.active_currency || 'GHS';
    renderServicesPage();
    renderCurrenciesPage();
    updateKpiCurrency();
  } catch(e){ toast('Error loading services: '+e.message, true); }
}

async function loadLeadsData(){
  try {
    const res = await fetch('api/admin-leads.php');
    const data = await res.json();
    if(!data.success) throw new Error(data.error);
    state.audits    = data.audits    || [];
    state.contacts  = data.contacts  || [];
    state.emergency = data.emergency || [];
    renderOverview();
    renderLeads();
    renderEmergency();
    document.getElementById('kpiAudits').textContent   = state.audits.length;
    document.getElementById('kpiContacts').textContent = state.contacts.length;
    document.getElementById('kpiEmergency').textContent= state.emergency.length;
  } catch(e){ console.warn('Leads error:', e.message); }
}

// ── SERVICES PAGE ──
function renderServicesPage(){
  // Currency switcher buttons
  const btns = state.currencies.map(c =>
    `<button class="cur-btn${c.code===selectedCurrency?' act':''}"
      onclick="switchCurrency('${c.code}',this)">${c.symbol} ${c.code}</button>`
  ).join('');
  document.getElementById('curBtns').innerHTML = btns;
  document.getElementById('activeCurBadge').textContent = `Site default: ${state.settings.active_currency || 'GHS'}`;

  // Service cards
  const grid = document.getElementById('svcGrid');
  if(!state.services.length){ grid.innerHTML='<div style="color:var(--muted);padding:2rem;">No services found</div>'; return; }

  grid.innerHTML = state.services.map(svc => {
    // Get prices for this service
    const svcPrices = state.prices.filter(p => p.service_id == svc.id);
    const priceRows = state.currencies.map(cur => {
      const p = svcPrices.find(x => x.currency_id == cur.id) || {amount:0, period:'one-time', currency_id: cur.id};
      return `
        <div class="price-row">
          <div class="price-cur">
            <span class="price-cur-code">${cur.code}</span>
            <span class="price-cur-name">${cur.symbol}</span>
          </div>
          <div class="price-input-wrap">
            <input type="number" class="price-input" value="${p.amount||''}"
              id="price_${svc.id}_${cur.id}" placeholder="0" min="0" step="0.01">
            <select class="period-select" id="period_${svc.id}_${cur.id}">
              <option value="one-time"${p.period==='one-time'?' selected':''}>one-time</option>
              <option value="/month"${p.period==='/month'?' selected':''}>/month</option>
              <option value="/script"${p.period==='/script'?' selected':''}>/script</option>
              <option value="/year"${p.period==='/year'?' selected':''}>/year</option>
            </select>
            <button class="save-price-btn" id="savebtn_${svc.id}_${cur.id}"
              onclick="savePrice(${svc.id},${cur.id})">Save</button>
          </div>
        </div>`;
    }).join('');

    // Features
    const svcFeatures = state.features.filter(f => f.service_id == svc.id);
    const featureRows = svcFeatures.map(f =>
      `<div class="feature-item">
        <i class="fas fa-check" style="color:var(--green);font-size:.72rem;flex-shrink:0;"></i>
        <input type="text" value="${f.feature}" id="feat_${f.id}"
          onchange="saveFeature(${f.id})">
        <button class="feature-save-btn" onclick="saveFeature(${f.id})">
          <i class="fas fa-save"></i>
        </button>
      </div>`
    ).join('');

    const isOn = svc.is_active == 1;
    return `
      <div class="svc-card" id="svccard_${svc.id}">
        <div class="svc-card-head">
          <div class="left">
            <h3>${svc.name}</h3>
            <p>${svc.short_desc || ''}</p>
          </div>
          <button class="svc-toggle${isOn?' on':''}" id="toggle_${svc.id}"
            onclick="toggleService(${svc.id})">
            ${isOn ? '● Live' : '○ Hidden'}
          </button>
        </div>
        <div style="padding:.65rem 1.25rem;border-bottom:1px solid var(--border);">
          <div style="font-size:.68rem;color:var(--muted);text-transform:uppercase;font-weight:700;margin-bottom:.5rem;">Prices by Currency</div>
          <div class="price-table">${priceRows}</div>
        </div>
        <div class="features-list">
          <div style="font-size:.68rem;color:var(--muted);text-transform:uppercase;font-weight:700;margin-bottom:.35rem;">Features (click to edit)</div>
          ${featureRows}
        </div>
      </div>`;
  }).join('');
}

function switchCurrency(code, el){
  selectedCurrency = code;
  document.querySelectorAll('.cur-btn').forEach(b=>b.classList.remove('act'));
  el.classList.add('act');
}

async function setActiveCurrency(){
  const res = await fetch('api/admin-services.php', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({action:'set_active_currency', code: selectedCurrency})
  });
  const data = await res.json();
  if(data.success){
    state.settings.active_currency = selectedCurrency;
    document.getElementById('activeCurBadge').textContent = `Site default: ${selectedCurrency}`;
    document.getElementById('kpiCurrency').textContent = selectedCurrency;
    toast(`Site currency set to ${selectedCurrency}`);
  } else toast(data.error, true);
}

async function savePrice(serviceId, currencyId){
  const amount = parseFloat(document.getElementById(`price_${serviceId}_${currencyId}`).value);
  const period = document.getElementById(`period_${serviceId}_${currencyId}`).value;
  const btn    = document.getElementById(`savebtn_${serviceId}_${currencyId}`);

  if(isNaN(amount) || amount < 0){ toast('Invalid amount', true); return; }

  btn.textContent = '...';
  const res = await fetch('api/admin-services.php', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({action:'update_price', service_id:serviceId, currency_id:currencyId, amount, period})
  });
  const data = await res.json();
  if(data.success){
    btn.textContent = '✓ Saved'; btn.classList.add('saved');
    setTimeout(()=>{ btn.textContent='Save'; btn.classList.remove('saved'); }, 2000);
    toast('Price saved');
    // Update local state
    const idx = state.prices.findIndex(p=>p.service_id==serviceId && p.currency_id==currencyId);
    if(idx>=0){ state.prices[idx].amount=amount; state.prices[idx].period=period; }
    else state.prices.push({service_id:serviceId,currency_id:currencyId,amount,period});
  } else { btn.textContent='Save'; toast(data.error, true); }
}

async function toggleService(id){
  const res = await fetch('api/admin-services.php', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({action:'toggle_service', id})
  });
  const data = await res.json();
  if(data.success){
    const btn = document.getElementById(`toggle_${id}`);
    const isOn = data.is_active === 1;
    btn.textContent = isOn ? '● Live' : '○ Hidden';
    btn.className   = 'svc-toggle' + (isOn?' on':'');
    toast(isOn ? 'Service is now live' : 'Service hidden from site');
  } else toast(data.error, true);
}

async function saveFeature(id){
  const val = document.getElementById(`feat_${id}`).value;
  const res = await fetch('api/admin-services.php', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({action:'update_feature', id, feature:val})
  });
  const data = await res.json();
  if(data.success) toast('Feature updated');
  else toast(data.error, true);
}

// ── CURRENCIES PAGE ──
function renderCurrenciesPage(){
  const tbody = document.getElementById('currenciesTable');
  tbody.innerHTML = state.currencies.map(c => `
    <tr>
      <td><strong>${c.code}</strong></td>
      <td>${c.symbol}</td>
      <td>${c.name}</td>
      <td><span class="badge ${c.is_active?'badge-green':'badge-grey'}">${c.is_active?'Active':'Inactive'}</span>
          ${c.is_default?'<span class="badge badge-blue" style="margin-left:.3rem;">Default</span>':''}</td>
      <td>
        <button class="btn-sm btn-ghost" onclick="prefillCurrency('${c.code}','${c.symbol}','${c.name}')">Edit</button>
      </td>
    </tr>
  `).join('');
}

function prefillCurrency(code, symbol, name){
  document.getElementById('newCurCode').value   = code;
  document.getElementById('newCurSymbol').value = symbol;
  document.getElementById('newCurName').value   = name;
}

async function saveCurrency(){
  const code   = document.getElementById('newCurCode').value.trim().toUpperCase();
  const symbol = document.getElementById('newCurSymbol').value.trim();
  const name   = document.getElementById('newCurName').value.trim();
  if(!code||!symbol||!name){ toast('All fields required', true); return; }

  const res = await fetch('api/admin-services.php', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({action:'save_currency', code, symbol, name})
  });
  const data = await res.json();
  if(data.success){
    toast(`Currency ${code} saved`);
    document.getElementById('newCurCode').value='';
    document.getElementById('newCurSymbol').value='';
    document.getElementById('newCurName').value='';
    await loadServiceData();
  } else toast(data.error, true);
}

// ── LEADS TABLES ──
function renderOverview(){
  const recent = state.audits.slice(0,10);
  document.getElementById('overviewCount').textContent = state.audits.length + ' total';
  document.getElementById('overviewTable').innerHTML = recent.length
    ? recent.map(r => `<tr>
        <td>${r.name||'—'}</td>
        <td>${r.business||'—'}</td>
        <td><a href="mailto:${r.email}" style="color:var(--accent);">${r.email}</a></td>
        <td>${r.score||0}/80</td>
        <td>${riskBadge(r.risk_status)}</td>
        <td style="color:var(--muted);font-size:.75rem;">${formatDate(r.created_at)}</td>
      </tr>`).join('')
    : '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem;">No submissions yet</td></tr>';
}

function renderLeads(){
  document.getElementById('leadsTable').innerHTML = state.audits.length
    ? state.audits.map((r,i) => `<tr>
        <td style="color:var(--muted);">${i+1}</td>
        <td>${r.name||'—'}</td>
        <td>${r.business||'—'}</td>
        <td><a href="mailto:${r.email}" style="color:var(--accent);">${r.email}</a></td>
        <td>${r.phone||'—'}</td>
        <td>${r.industry||'—'}</td>
        <td>${r.score||0}/80</td>
        <td>${riskBadge(r.risk_status)}</td>
        <td style="color:var(--muted);font-size:.75rem;">${formatDate(r.created_at)}</td>
      </tr>`).join('')
    : '<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:2rem;">No leads yet</td></tr>';

  document.getElementById('contactsTable').innerHTML = state.contacts.length
    ? state.contacts.map((r,i) => `<tr>
        <td style="color:var(--muted);">${i+1}</td>
        <td>${r.name||'—'}</td>
        <td>${r.business||'—'}</td>
        <td><a href="mailto:${r.email}" style="color:var(--accent);">${r.email}</a></td>
        <td>${r.service||'—'}</td>
        <td style="color:var(--muted);font-size:.75rem;">${formatDate(r.created_at)}</td>
      </tr>`).join('')
    : '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem;">No enquiries yet</td></tr>';
}

function renderEmergency(){
  document.getElementById('emergencyTable').innerHTML = state.emergency.length
    ? state.emergency.map((r,i) => `<tr>
        <td style="color:var(--muted);">${i+1}</td>
        <td>${r.first_name||''} ${r.last_name||''}</td>
        <td>${r.company||'—'}</td>
        <td><a href="mailto:${r.email}" style="color:var(--accent);">${r.email}</a></td>
        <td>${r.phone||'—'}</td>
        <td>${r.issue_type||'—'}</td>
        <td><span class="badge ${r.status==='new'?'badge-red':'badge-green'}">${r.status}</span></td>
        <td style="color:var(--muted);font-size:.75rem;">${formatDate(r.created_at)}</td>
        <td><button class="btn-sm btn-success" onclick="markResolved(${r.id})">✓ Resolve</button></td>
      </tr>`).join('')
    : '<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:2rem;">No requests yet</td></tr>';
}

async function markResolved(id){
  const res = await fetch('api/admin-leads.php', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({action:'resolve_emergency', id})
  });
  const data = await res.json();
  if(data.success){ toast('Marked as resolved'); await loadLeadsData(); }
}

// ── CSV EXPORT ──
function exportCSV(type){
  const data = type === 'audits' ? state.audits : state.contacts;
  if(!data.length){ toast('No data to export', true); return; }
  const keys = Object.keys(data[0]);
  const rows = [keys.join(','), ...data.map(r => keys.map(k => `"${(r[k]||'').toString().replace(/"/g,'""')}"`).join(','))];
  const blob = new Blob([rows.join('\n')], {type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `techwokx-${type}-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

// ── HELPERS ──
function riskBadge(risk){
  if(!risk) return '<span class="badge badge-grey">—</span>';
  if(risk.includes('RED'))    return `<span class="badge badge-red">🔴 Critical</span>`;
  if(risk.includes('ORANGE')) return `<span class="badge badge-orange">🟠 Moderate</span>`;
  return `<span class="badge badge-green">🟢 Stable</span>`;
}

function formatDate(dt){
  if(!dt) return '—';
  return new Date(dt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
}

function updateKpiCurrency(){
  document.getElementById('kpiCurrency').textContent = state.settings.active_currency || '—';
}

function toast(msg, isErr=false){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (isErr?' err':'');
  setTimeout(()=>t.className='toast', 3000);
}

// Check if already logged in on load
window.addEventListener('load', async () => {
  try {
    const res = await fetch('api/auth.php');
    const data = await res.json();
    if(data.authenticated){
      document.getElementById('loginPage').style.display='none';
      document.getElementById('dash').classList.add('show');
      loadAllData();
    }
  } catch(e){}
});
</script>
</body>
</html>
