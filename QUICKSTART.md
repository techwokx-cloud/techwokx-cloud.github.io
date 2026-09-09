# TechWokx Marketing Dashboard — Quick Start Guide

Get your marketing platform running in 4 steps.

---

## 📋 Prerequisites

- [ ] VPS access (provided)
- [ ] Local machine (Mac/Linux/Windows)
- [ ] GitHub account for OpenWA
- [ ] Buffer account (free tier OK)
- [ ] ngrok account (free)
- [ ] Meta/Facebook business account

---

## ⚡ Step 1: VPS Backend (Already Running) ✅

**Status:** Your API is live!

```bash
# Verify it's working
curl https://api.techwokx.online/health
# Response: OK

# Check all endpoints are ready
curl https://api.techwokx.online/marketing/api/dashboard/summary
```

**What's running:**
- ✅ Marketing Dashboard API (port 3001)
- ✅ Caddy reverse proxy (ports 80/443)
- ✅ Meta Ads integration
- ✅ Buffer API service
- ✅ WhatsApp webhook receiver

---

## 🚀 Step 2: Setup Local OpenWA (Today)

```bash
# Clone OpenWA
git clone https://github.com/rmyndharis/OpenWA.git
cd OpenWA

# Install
npm install

# Start (will open dashboard automatically)
npm run dev

# You'll see:
# → http://localhost:2886
# → Click QR code button
# → Scan with your phone's WhatsApp
# → Done! Connected to your phone's WhatsApp
```

**Time: 5 minutes**

---

## 🌐 Step 3: Setup ngrok Tunnel (Today)

This makes your local OpenWA accessible to the VPS.

```bash
# Install ngrok
brew install ngrok              # macOS
# OR
sudo snap install ngrok         # Linux
# OR
# Download from https://ngrok.com/download  # Windows

# Sign up (free) at https://ngrok.com

# Authenticate
ngrok authtoken <YOUR_AUTH_TOKEN>

# Start tunnel (in separate terminal)
ngrok http 2886

# You'll see:
# Forwarding     https://abc123.ngrok.io -> http://localhost:2886
# Keep this running!
```

**Time: 5 minutes**

**Keep this URL for next step:** `https://abc123.ngrok.io`

---

## 🔐 Step 4: Connect Everything (Today)

### Option A: Via OpenWA Dashboard (Easiest)

1. Open http://localhost:2886
2. Go to **Settings → Webhooks**
3. Add new webhook:
   ```
   https://api.techwokx.online/marketing/api/whatsapp/webhook
   ```
4. Enable these events:
   - ✅ Message received
   - ✅ Message sent
   - ✅ Chat opened
   - ✅ Contact added
5. Click **Save**

**Time: 2 minutes**

### Option B: Via Command Line

```bash
# Run setup script
cd /opt/techwokx
bash openwa-webhook-config.sh
```

---

## ✅ Verify Everything Works

### Test 1: Check API Health

```bash
curl https://api.techwokx.online/health
# Should return: OK
```

### Test 2: Send Test Webhook

```bash
# In your local terminal
cd /opt/techwokx
bash test-webhook.sh

# Sends 4 test messages to VPS
# Check response
```

### Test 3: Check WhatsApp Stats

```bash
curl https://api.techwokx.online/marketing/api/whatsapp/stats | jq

# Should show:
# - totalMessages: 4 (from tests)
# - uniqueContacts: 4
# - qualifiedLeads: 1 or 2
```

### Test 4: Send Real WhatsApp Message

1. Send a message to your WhatsApp number from any contact
2. Watch OpenWA dashboard (http://localhost:2886) — message appears
3. VPS auto-reply should come back within seconds
4. Check logs:
   ```bash
   docker-compose -p techwokx logs -f marketing | grep whatsapp
   ```

---

## 📊 Now You Have

### Dashboard API Endpoints

**Campaign Performance:**
```bash
curl https://api.techwokx.online/marketing/api/dashboard/summary
```

**Social Media Scheduling:**
```bash
curl https://api.techwokx.online/marketing/api/social/profiles
```

**WhatsApp Analytics:**
```bash
curl https://api.techwokx.online/marketing/api/whatsapp/stats
```

**Full Documentation:**
```bash
cat /opt/techwokx/API_REFERENCE.md
```

---

## 🔄 Daily Workflow

### Morning Routine

```bash
# Terminal 1: Start OpenWA (if not already running)
cd ~/OpenWA && npm run dev

# Terminal 2: Start ngrok tunnel (if not already running)
ngrok http 2886

# Terminal 3: Monitor VPS activity
docker-compose -p techwokx logs -f marketing

# Terminal 4: Watch WhatsApp stats
watch -n 5 'curl -s https://api.techwokx.online/marketing/api/whatsapp/stats | jq'
```

### Schedule a Social Post

```bash
curl -X POST https://api.techwokx.online/marketing/api/social/posts/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "profileIds": ["FACEBOOK_ID", "INSTAGRAM_ID"],
    "content": "Your post text here 📱",
    "scheduledTime": "2026-09-08T10:00:00Z"
  }'
```

### Send WhatsApp Message

```bash
curl -X POST https://api.techwokx.online/marketing/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "toPhone": "233123456789",
    "message": "Hi! Thanks for reaching out."
  }'
```

### Check Recent Messages

```bash
curl https://api.techwokx.online/marketing/api/whatsapp/messages/recent | jq
```

---

## 🛠️ Troubleshooting

### Issue: OpenWA won't start

```bash
cd ~/OpenWA
npm install
npm run dev
```

### Issue: ngrok tunnel down

```bash
# Restart ngrok in new terminal
ngrok http 2886
```

### Issue: No messages being received

1. Check ngrok is running: `ps aux | grep ngrok`
2. Check OpenWA dashboard: http://localhost:2886
3. Check VPS logs: `docker-compose logs -f marketing`
4. Re-scan QR code if needed

### Issue: VPS API not responding

```bash
# Check API is running
curl https://api.techwokx.online/health

# Check containers
docker ps | grep techwokx

# Restart if needed
docker-compose -p techwokx restart marketing
```

---

## 📱 What Each Part Does

| Component | Location | Purpose |
|-----------|----------|---------|
| **OpenWA** | localhost:2886 | Receive WhatsApp messages via QR auth |
| **ngrok** | Your machine | Tunnel local → internet → VPS |
| **VPS API** | 40.233.82.254 | Process messages, schedule posts, track metrics |
| **Buffer** | buffer.com | Schedule posts to Facebook, Instagram, Twitter, LinkedIn |
| **Meta Ads** | Facebook/Instagram | Campaign performance tracking |

---

## 📚 Documentation

```bash
# Main README
cat /opt/techwokx/README.md

# Complete API Reference
cat /opt/techwokx/API_REFERENCE.md

# OpenWA Setup Details
cat /opt/techwokx/OPENWA_SETUP.md

# Integration Architecture
cat /opt/techwokx/INTEGRATION_GUIDE.md
```

---

## 🎯 Next: Build Frontend Dashboard

Once this is working, we'll build the React frontend at:
```
https://techwokx.online/dashboard/marketing/
```

It will:
- Display real-time WhatsApp messages
- Show campaign performance metrics
- Schedule social posts with one click
- Track lead statistics
- Display analytics dashboards

---

## ⏱️ Time Investment

- **Initial setup**: ~20 minutes
- **Daily maintenance**: ~5 minutes
- **Creating posts**: ~5 minutes per post

---

## 🚀 You're Ready!

Everything is deployed and ready. Start with:

```bash
# 1. Start OpenWA
npm run dev

# 2. Start ngrok (separate terminal)
ngrok http 2886

# 3. Send test message
bash test-webhook.sh

# 4. Send real WhatsApp message to yourself

# 5. Check dashboard
curl https://api.techwokx.online/marketing/api/whatsapp/stats | jq
```

**Questions?** Check the full docs:
- API_REFERENCE.md
- OPENWA_SETUP.md
- INTEGRATION_GUIDE.md

---

Version: 1.0.0
Last Updated: September 7, 2026
