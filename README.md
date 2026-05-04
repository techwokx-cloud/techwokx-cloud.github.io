# TechWokx Ghana — GitHub Pages Deployment Guide

## Folder Structure

```
teckwokx-ghana/                    ← Your GitHub repository root
│
├── index.html                     ← MAIN WEBSITE (upload this)
├── dashboard.html                 ← Full marketing dashboard
├── signature.html                 ← Email signature generator
├── 404.html                       ← Custom error page
│
├── assets/
│   │
│   ├── images/
│   │   ├── logo/
│   │   │   ├── teckwokx-logo.png          ← Download from Cloudinary
│   │   │   ├── teckwokx-logo-white.png    ← White version for dark bg
│   │   │   └── favicon.ico                ← Download from Cloudinary
│   │   │
│   │   ├── hero/
│   │   │   ├── critical-error.jpeg        ← Your uploaded image (use in hero)
│   │   │   ├── hero-bg.webp               ← Optional hero background
│   │   │   └── og-image.jpg               ← Social sharing preview (1200x630)
│   │   │
│   │   ├── services/
│   │   │   ├── email-fix.png
│   │   │   ├── retainer.png
│   │   │   ├── audit.png
│   │   │   └── automation.png
│   │   │
│   │   ├── reports/
│   │   │   ├── report-red-preview.png     ← Mockup of RED report
│   │   │   ├── report-orange-preview.png  ← Mockup of ORANGE report
│   │   │   └── report-green-preview.png   ← Mockup of GREEN report
│   │   │
│   │   └── icons/
│   │       └── (SVG icons if needed)
│   │
│   ├── css/
│   │   └── (all styles are inline in HTML — no separate CSS needed)
│   │
│   ├── js/
│   │   └── (all scripts are inline in HTML — no separate JS needed)
│   │
│   └── downloads/
│       ├── audit-form.pdf                 ← Fillable PDF audit (CREATE THIS)
│       ├── disaster-recovery-guide.pdf    ← Lead magnet PDF (CREATE THIS)
│       ├── security-checklist.pdf         ← Checklist PDF (CREATE THIS)
│       └── email-signature-pack.zip       ← 4 HTML templates zipped
│
└── README.md                      ← This file
```

---

## GitHub Pages Setup Steps

### Step 1 — Create Repository
1. Go to github.com → New Repository
2. Name it: `teckwokx-ghana` (or your domain name)
3. Set to **Public** (required for free GitHub Pages)
4. Click Create Repository

### Step 2 — Upload Files
1. Upload `index.html` to the root
2. Create the `assets/` folder structure above
3. Upload all images to their correct folders
4. Upload PDFs to `assets/downloads/`

### Step 3 — Enable GitHub Pages
1. Go to Repository → Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` → `/root`
4. Save → Your site will be live at: `https://yourusername.github.io/teckwokx-ghana`

### Step 4 — Custom Domain (your TechWokx domain)
1. In Pages settings → Custom domain → enter `techwokx.online`
2. Create a CNAME file in root with your domain
3. Update your domain DNS: Add CNAME record pointing to `yourusername.github.io`
4. Enable "Enforce HTTPS"

---

## Files Analysis & What to Keep/Combine

### complete_dashboard.html
**What it has:**
- Daily Operation System with splash screen (time selector: 1hr, 2hr, 4hr, 6hr)
- 13 sections: Dashboard, Weekly, Services, Sales, CRM, Social, Content, AI Video, Assets, Tracking, Reports, Settings, Documents
- Platform tabs for LinkedIn, Facebook, Twitter, Instagram, TikTok, Threads
- Internet connectivity checker
- Chart.js integration

**What to do:** Keep as `dashboard.html` — this is your internal ops tool.
Merge the time selector splash and the CRM lead table into the main dashboard.

### marketing-tools.html
**What it has:**
- AI Content Generator (generates LinkedIn, Facebook, TikTok, Email content)
- Quote Generator (professional service quotes)
- Invoice Generator (with Ghana cedi pricing)
- Email Signature Scanner (checks email signatures from domains)

**What to do:** ADD these tools as extra tabs in `dashboard.html`.
The AI content generator and invoice generator are immediately useful.

### Email_Signature_Generator_Template_Updates.html
**What it has:**
- 9 templates: Modern, Compact, Professional, Creative, Banner Style, Profile & Banner, Premium, Elegant, Minimalist, Corporate
- Full form with photo upload, logo upload, social links, banner image
- Live preview panel
- Copy HTML, Download HTML, Send test email
- Platform-specific install guides (Gmail, Outlook, Apple Mail, Zoho)
- Colour picker and font options

**What to do:** This is a complete tool. Keep as `signature.html`.
The free signature request in the main website links here.
This becomes a paid/freemium product.

### dashboard.php
**What it has:**
- E-commerce dashboard (orders, inventory, profit calculator, pre-orders, flash sale)
- Social scheduler, video manager, SEO visibility
- Shipping label printer
- SQLite database backend

**What to do:** This is from a different business context (e-commerce/product sales).
The social scheduler, video manager, and SEO sections are useful.
Extract those three sections only and merge into dashboard.html.
Skip orders/inventory/shipping — not relevant to TechWokx.

### BrandAuditPro.exe
**What it is:** Windows executable — cannot run in browser or GitHub Pages.
**What to do:** This may be a desktop audit tool. 
For web use, your HTML audit form replaces this entirely.
If you want a desktop version later, consider Electron.js wrapper.

---

## PDFs to Create for Downloads

### 1. audit-form.pdf (Fillable)
Create in Google Docs or Adobe Acrobat:
- Same questions as the web audit form
- Fillable fields for each answer
- Scoring table at the bottom (hidden from client)
- Return address: hello@techwokx.online
- TechWokx branding

### 2. disaster-recovery-guide.pdf
Content:
- Step 1: Immediately change all passwords
- Step 2: Enable 2FA on all accounts
- Step 3: Remove unknown device access
- Step 4: Check email forwarding rules
- Step 5: Contact your email host
- Step 6: Notify clients if data was exposed
- Emergency contacts: hello@techwokx.online / WhatsApp +233 555 087 407

### 3. security-checklist.pdf
Content (5-minute checklist):
□ Are you using a custom domain email?
□ Is SPF record configured?
□ Is DKIM configured?
□ Is DMARC configured?
□ Do former staff have access?
□ Is admin account centrally controlled?
□ Do all staff use the same email signature?
□ Is email backed up?
□ Are mailboxes cleaned regularly?
□ Is 2FA enabled on admin account?

---

## Social Media Auto-Posting Options (Free/Low Cost)

Since you want zero manual posting:

### Option 1 — Buffer (Free up to 3 channels)
- Connect: LinkedIn, Facebook, Instagram
- Schedule posts weeks in advance
- Best for: LinkedIn + Facebook + Instagram
- Cost: Free

### Option 2 — Later (Free plan)
- Best for: Instagram + TikTok
- Visual calendar
- Auto-publish to Instagram
- Cost: Free (limited)

### Option 3 — Zapier + Google Sheets
- Write posts in Google Sheet
- Zapier auto-posts to Buffer/social platforms
- Trigger: new row in sheet → post scheduled
- Cost: Free tier available

### Option 4 — Make.com (Formerly Integromat)
- Most powerful free automation
- Connect Google Sheets → Buffer → Email
- Can trigger on form submissions
- Cost: Free 1,000 operations/month

### Recommended Stack (Free, zero manual posting):
1. Write weekly content in Google Sheets (Sunday, 20 mins)
2. Zapier posts to Buffer automatically
3. Buffer auto-publishes to LinkedIn, Facebook, Instagram
4. Later handles TikTok
5. WhatsApp Status — manual (30 seconds)

---

## What Makes the Combined System Powerful

When index.html + dashboard.html + signature.html work together:

1. **Visitor lands on index.html** → Takes free audit
2. **Audit auto-emails result** → RED/ORANGE/GREEN report sent
3. **Lead captured in dashboard.html** → You see them immediately
4. **Automated email sequence starts** → 5 follow-up emails over 14 days
5. **Social content posts automatically** → Brand stays visible 24/7
6. **Signature request submitted** → signature.html generates it
7. **Invoice generated in dashboard** → Client pays, project starts
8. **Retainer client onboarded** → Monthly income locked in

This is a complete pipeline from stranger → paying client with minimal manual intervention.

---

## Quick Deploy Checklist

- [ ] Upload index.html to GitHub root
- [ ] Create assets/ folder structure
- [ ] Download logo from Cloudinary → assets/images/logo/
- [ ] Upload critical-error.jpeg → assets/images/hero/
- [ ] Create 3 PDFs → assets/downloads/
- [ ] Enable GitHub Pages
- [ ] Connect custom domain techwokx.online
- [ ] Test audit form end-to-end
- [ ] Set up Google Apps Script for form emails
- [ ] Connect Buffer for social scheduling
- [ ] Test WhatsApp float button
- [ ] Test dashboard login

---

*TechWokx Ghana — techwokx.online — hello@techwokx.online*
