# OpenWA Local Setup + TechWokx VPS Integration

Run OpenWA locally on your machine and connect it to the TechWokx VPS API for centralized message handling and lead tracking.

## 🎯 Architecture

```
Local Machine:
┌─────────────────────────────────────┐
│   OpenWA Instance (localhost:2886)  │
│   - WhatsApp message receiver       │
│   - QR code scanning                │
│   - Message routing                 │
└────────────────┬────────────────────┘
                 │
                 │ ngrok tunnel
                 │ (exposes localhost to internet)
                 ▼
         [internet.ngrok.io]
                 │
                 │ HTTPS
                 ▼
    ┌──────────────────────────────┐
    │    TechWokx VPS              │
    │  40.233.82.254 (Oracle Cloud)│
    │                              │
    │  POST /api/whatsapp/webhook  │
    │  - Lead tracking             │
    │  - Message logging           │
    │  - Auto-reply                │
    │  - Analytics                 │
    └──────────────────────────────┘
```

---

## ⚙️ Step 1: Clone and Install OpenWA

```bash
# Clone repository
git clone https://github.com/rmyndharis/OpenWA.git
cd OpenWA

# Install dependencies (includes dashboard)
npm install

# Start API + Dashboard with hot reload
npm run dev

# Dashboard opens at: http://localhost:2886
```

Verify OpenWA is running:
```bash
curl http://localhost:2886/api/version
```

---

## 🌐 Step 2: Setup ngrok Tunnel

ngrok exposes your local OpenWA instance to the internet so the VPS can reach it.

### Install ngrok

**Mac:**
```bash
brew install ngrok
```

**Linux:**
```bash
wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
unzip ngrok-stable-linux-amd64.zip
sudo mv ngrok /usr/local/bin
```

**Windows:**
Download from https://ngrok.com/download

### Authenticate ngrok

```bash
# Sign up at https://ngrok.com (free)
# Get your authtoken from https://dashboard.ngrok.com/auth/your-authtoken

ngrok authtoken YOUR_AUTH_TOKEN
```

### Start ngrok Tunnel

```bash
# Expose localhost:2886 to the internet
ngrok http 2886

# Output:
# Forwarding                    https://abc123.ngrok.io -> http://localhost:2886
# Keep this running in a separate terminal
```

**Save your ngrok URL** (e.g., `https://abc123.ngrok.io`) — you'll use it for webhook configuration.

---

## 📝 Step 3: Configure OpenWA Webhook

Configure OpenWA to send incoming messages to your TechWokx VPS API.

### Option A: Via OpenWA Dashboard

1. Open http://localhost:2886
2. Go to Settings → Webhooks
3. Add webhook endpoint:
   ```
   https://api.techwokx.online/marketing/api/whatsapp/webhook
   ```
4. Set webhook events:
   - ✅ Message received
   - ✅ Message sent
   - ✅ Chat opened
   - ✅ Contact added

### Option B: Via OpenWA API

```bash
# Send webhook configuration to OpenWA API
curl -X POST http://localhost:2886/api/webhook/set \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.techwokx.online/marketing/api/whatsapp/webhook",
    "events": ["message", "message_sent", "chat_opened", "contact_added"],
    "headers": {
      "x-webhook-signature": "your_webhook_secret_from_env"
    }
  }'
```

---

## 🔐 Step 4: Set Environment Variables

Update your VPS `.env` with OpenWA webhook credentials:

```bash
# On VPS
nano /opt/techwokx/app/.env
```

Add/update:
```bash
# OpenWA Configuration
OPENWA_INSTANCE_URL=http://localhost:2886    # For testing
WHATSAPP_WEBHOOK_SECRET=your_secure_secret_key_here
WHATSAPP_BUSINESS_PHONE_ID=254xxxxxxxxxx     # Your WhatsApp phone number
WHATSAPP_ACCESS_TOKEN=your_openwa_token
```

Save and restart:
```bash
docker-compose restart marketing
```

---

## 📲 Step 5: Configure WhatsApp in OpenWA

### Scan QR Code

1. Go to http://localhost:2886
2. Click "Scan QR Code"
3. Scan with your WhatsApp mobile device
4. OpenWA will authenticate and start receiving messages

### Verify Connection

```bash
# Check OpenWA is receiving messages
curl http://localhost:2886/api/chats

# Should return list of chats
```

---

## ✅ Step 6: Test Integration

### Send a Test Message to Your WhatsApp

From any WhatsApp contact, send a message to your number. You should see:

1. **In OpenWA Dashboard** (http://localhost:2886)
   - New message appears in chat list
   - Real-time message updates

2. **In VPS Logs**
   ```bash
   docker-compose logs -f marketing
   ```
   Should show:
   ```
   Webhook received: POST /api/whatsapp/webhook
   Message logged from: +233XXXXXXXXX
   Lead intent detected: [message content]
   ```

3. **Check WhatsApp Stats**
   ```bash
   curl https://api.techwokx.online/marketing/api/whatsapp/stats
   ```
   Response:
   ```json
   {
     "totalMessages": 1,
     "uniqueContacts": 1,
     "qualifiedLeads": 0,
     "averageMessagesPerContact": "1.00"
   }
   ```

4. **Send Auto-Reply**
   ```bash
   curl -X POST https://api.techwokx.online/marketing/api/whatsapp/send \
     -H "Content-Type: application/json" \
     -d '{
       "toPhone": "233XXXXXXXXX",
       "message": "Thanks for reaching out! This is an automated reply. Our team will get back to you shortly."
     }'
   ```

---

## 🔄 Workflow

### Customer sends message on WhatsApp
```
Your WhatsApp ──→ OpenWA (localhost:2886) ──→ ngrok tunnel ──→ VPS API
                   │
                   └─→ OpenWA Dashboard for viewing
```

### VPS processes and responds
```
VPS API ──→ Auto-reply logic ──→ WhatsApp message ──→ OpenWA ──→ Send to contact
         ──→ Lead tracking
         ──→ Analytics update
```

---

## 📊 Monitoring

### Monitor OpenWA Activity
```bash
# Terminal 1: Watch ngrok traffic
ngrok http 2886 --log=stdout

# Terminal 2: Watch VPS logs
docker-compose -p techwokx logs -f marketing

# Terminal 3: Monitor message stats
watch -n 5 'curl -s https://api.techwokx.online/marketing/api/whatsapp/stats | jq'
```

### Check Recent Messages
```bash
curl https://api.techwokx.online/marketing/api/whatsapp/messages/recent
```

---

## 🚨 Troubleshooting

### Webhook Not Receiving Messages

1. **Verify ngrok is running**
   ```bash
   curl https://abc123.ngrok.io/api/health
   # Should return OK
   ```

2. **Check VPS webhook endpoint**
   ```bash
   curl -v https://api.techwokx.online/marketing/api/whatsapp/webhook
   # Should return 405 (method not allowed) — that's OK
   ```

3. **Check logs**
   ```bash
   # OpenWA logs
   npm run dev
   
   # VPS logs
   docker-compose logs -f marketing
   ```

### Messages Not Sending via OpenWA

1. **Verify QR code scan completed**
   - Go to http://localhost:2886
   - Check if authenticated (should show "Connected")

2. **Check OpenWA API**
   ```bash
   curl http://localhost:2886/api/chats
   # Should return list of chats
   ```

3. **Restart OpenWA**
   ```bash
   npm run dev
   ```

### VPS Not Receiving Webhooks

1. **Verify ngrok URL is correct**
   ```bash
   # In OpenWA settings, webhook should be one of:
   https://api.techwokx.online/marketing/api/whatsapp/webhook    # Production
   https://abc123.ngrok.io/api/whatsapp/webhook                  # Test via ngrok
   ```

2. **Check firewall/security rules**
   - Oracle Cloud: Verify ingress rule allows HTTPS from anywhere
   - VPS: Check Caddy is routing /marketing/* correctly

3. **Test webhook manually**
   ```bash
   curl -X POST https://api.techwokx.online/marketing/api/whatsapp/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "phoneNumber": "233XXXXXXXXX",
       "message": "Test message",
       "messageType": "text",
       "fromName": "Test User",
       "isGroup": false,
       "chatId": "233XXXXXXXXX@c.us"
     }'
   ```

---

## 🔐 Security Checklist

- [ ] ngrok authtoken configured
- [ ] Webhook secret in `.env`
- [ ] WHATSAPP_WEBHOOK_SECRET set on VPS
- [ ] Firewall rules allow HTTPS traffic
- [ ] ngrok URL kept private (don't commit to git)
- [ ] VPS logs monitored for errors
- [ ] Test webhook signature verification

---

## 📱 Production Deployment (Future)

When ready to move to production:

1. **Replace ngrok with permanent IP/domain**
   - Get static IP or use Cloudflare tunnel
   - Point webhook to `https://api.techwokx.online/marketing/api/whatsapp/webhook`

2. **Run OpenWA on VPS**
   ```bash
   # Add OpenWA as Docker service in docker-compose.yml
   openwa:
     image: node:18-alpine
     volumes:
       - ./openwa:/app
     environment:
       - WEBHOOK_URL=https://api.techwokx.online/marketing/api/whatsapp/webhook
     command: npm run dev
   ```

3. **Enable message queue**
   - Redis for reliable message delivery
   - Database persistence for message logs

---

## 📞 Quick Commands

```bash
# Start OpenWA
npm run dev

# Start ngrok tunnel (separate terminal)
ngrok http 2886

# Check VPS webhook logs
docker-compose logs -f marketing | grep whatsapp

# Get WhatsApp stats
curl https://api.techwokx.online/marketing/api/whatsapp/stats | jq

# List recent messages
curl https://api.techwokx.online/marketing/api/whatsapp/messages/recent | jq

# Send test message
curl -X POST https://api.techwokx.online/marketing/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{"toPhone":"233XXXXXXXXX","message":"Test from VPS"}'
```

---

## 📚 Resources

- OpenWA GitHub: https://github.com/rmyndharis/OpenWA
- ngrok Documentation: https://ngrok.com/docs
- TechWokx API Reference: `/opt/techwokx/API_REFERENCE.md`
- WhatsApp Business API: https://developers.facebook.com/docs/whatsapp

---

Version: 1.0.0
Last Updated: September 7, 2026
