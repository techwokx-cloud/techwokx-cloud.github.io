# TechWokx Marketing Integration Guide

Complete guide for Buffer (social posting) + OpenWA (WhatsApp) + VPS API (backend).

---

## 🎯 Complete Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (techwokx.online)                   │
│                   React Dashboard - Marketing Hub                    │
│  - Campaign metrics    - Social posting              - WhatsApp chats│
└────────────────────────────────┬────────────────────────────────────┘
                                 │ HTTPS
                                 ▼
         ┌───────────────────────────────────────────┐
         │    TechWokx VPS (Oracle Cloud)             │
         │    40.233.82.254                           │
         │                                            │
         │  /opt/techwokx/                            │
         │  ├── Marketing Dashboard API (3001)        │
         │  │   ├── /api/campaigns/*                 │
         │  │   ├── /api/adsets/*                    │
         │  │   ├── /api/dashboard/summary           │
         │  │   ├── /api/social/*  ←─────────┐       │
         │  │   └── /api/whatsapp/*  ←────┐   │       │
         │  │                             │   │       │
         │  └─ Caddy (Port 443)           │   │       │
         │     - SSL/TLS termination      │   │       │
         │     - Routing & load balancing │   │       │
         └─────────────────────────────────┼───┼──────┘
                                           │   │
                         ┌─────────────────┘   └────────────────┐
                         │                                      │
                         │                          ┌───────────▼──────────┐
                         │                          │   Local Machine      │
                         │                          │   ┌────────────────┐ │
                         │                          │   │ OpenWA         │ │
                         │                          │   │ (localhost)    │ │
                         │                          │   │ - QR scanning  │ │
                         │                          │   │ - Message Rx   │ │
                         │                          │   │ - Dashboard    │ │
                         │                          │   │   (2886)       │ │
                         │                          │   └────┬───────────┘ │
                         │                          │        │             │
                         │                          │   ngrok tunnel       │
                         │                          │        │             │
                         │                          └────────┼─────────────┘
                         │                                   │
                         │ Webhook                          │ Webhook
                         │ (receive messages)               │ (send to VPS)
                         │                                   │
         ┌───────────────▼──────────────────────────────────▼──────┐
         │  Buffer API                     OpenWA Webhook Receiver  │
         │  (Social Media Scheduling)      (Message Processing)     │
         │                                                          │
         │  - Schedule posts               - Lead intent detection  │
         │  - Facebook, Instagram          - Auto-replies           │
         │  - Twitter, LinkedIn            - Message logging        │
         │  - Analytics                    - Lead tracking          │
         └──────────────────────────────────────────────────────────┘
```

---

## 📱 Workflow: Receiving WhatsApp Message

### Flow Diagram

```
1. Customer sends WhatsApp message
   ▼
2. OpenWA (local) receives message via WhatsApp connection
   ▼
3. OpenWA sends webhook to VPS:
   POST https://api.techwokx.online/marketing/api/whatsapp/webhook
   {
     "phoneNumber": "233XXXXXXXXX",
     "message": "Hi, I'm interested in your services",
     "fromName": "John Doe",
     ...
   }
   ▼
4. VPS WhatsApp service processes:
   - Logs message to database
   - Detects lead intent ("interested", "quote")
   - Sends auto-reply
   - Updates statistics
   ▼
5. Dashboard updates in real-time
   - Recent messages list
   - Lead statistics
   - Engagement metrics
```

### Example: Customer sends "interested"

**Customer's WhatsApp:**
```
> Hi, I'm very interested in your AI automation services. Can we schedule a call?
```

**OpenWA receives:**
```json
POST http://localhost:2886/api/webhook
{
  "phoneNumber": "233XXXXXXXXX",
  "message": "Hi, I'm very interested in your AI automation services. Can we schedule a call?",
  "messageType": "text",
  "fromName": "Kwame Asante",
  "isGroup": false,
  "chatId": "233XXXXXXXXX@c.us",
  "timestamp": 1694078400000
}
```

**OpenWA sends to VPS:**
```bash
curl -X POST https://api.techwokx.online/marketing/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "233XXXXXXXXX",
    "message": "Hi, I'\''m very interested in your AI automation services. Can we schedule a call?",
    "messageType": "text",
    "fromName": "Kwame Asante",
    "isGroup": false,
    "chatId": "233XXXXXXXXX@c.us"
  }'
```

**VPS processing:**
1. ✅ Message received and logged
2. ✅ Lead intent detected ("interested") → Marked as qualified lead
3. ✅ Auto-reply sent:
   ```
   Thanks for your interest! 🎉
   
   We'll have our team reach out within 2 hours to schedule your consultation.
   
   In the meantime, check out our services:
   https://techwokx.online
   ```
4. ✅ Statistics updated:
   - Total messages: 1
   - Unique contacts: 1
   - Qualified leads: 1

**Dashboard updates:**
```json
GET /api/whatsapp/stats
{
  "totalMessages": 1,
  "uniqueContacts": 1,
  "qualifiedLeads": 1,
  "averageMessagesPerContact": "1.00"
}
```

---

## 📲 Workflow: Scheduling Social Media Post

### Flow Diagram

```
1. Marketing team opens dashboard at techwokx.online/dashboard/marketing
   ▼
2. Click "Schedule Post" → Fill in content and select platforms
   ▼
3. Frontend sends to VPS:
   POST /api/social/posts/schedule
   {
     "profileIds": ["fb_123", "ig_456", "tw_789"],
     "content": "Check out our latest AI insights! 🤖 #TechWokx",
     "scheduledTime": "2026-09-08T15:00:00Z",
     "mediaUrls": ["https://techwokx.online/image.jpg"]
   }
   ▼
4. VPS sends to Buffer API
   ▼
5. Buffer schedules post across Facebook, Instagram, Twitter, LinkedIn
   ▼
6. At scheduled time, posts go live automatically
   ▼
7. Dashboard shows engagement metrics (likes, shares, comments)
```

### Example: Schedule post to all platforms

**Frontend action:**
```javascript
// Schedule a post
fetch('https://api.techwokx.online/marketing/api/social/posts/schedule', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    profileIds: ['fb_123456789', 'ig_987654321', 'tw_112233445'],
    content: 'Excited to announce our new AI automation platform! 🚀\n\nLearn more: https://techwokx.online/ai-platform\n\n#TechWokx #AI #Automation',
    scheduledTime: '2026-09-08T10:00:00Z',
    mediaUrls: ['https://techwokx.online/blog/ai-platform-launch.jpg']
  })
})
```

**VPS sends to Buffer:**
```bash
curl -X POST https://api.bufferapp.com/1/updates/create.json \
  -d "access_token=YOUR_BUFFER_TOKEN" \
  -d "profile_ids[]=123456789" \
  -d "profile_ids[]=987654321" \
  -d "profile_ids[]=112233445" \
  -d "text=Excited to announce our new AI automation platform! 🚀..." \
  -d "scheduled_at=1694142000" \
  -d "shorten_url=true" \
  -d "media[link]=https://techwokx.online/blog/ai-platform-launch.jpg"
```

**Buffer responds:**
```json
{
  "buffer_update": "5f1a7b2c3d4e5f6g7h8i",
  "success": true,
  "message": "OK"
}
```

**VPS returns to frontend:**
```json
{
  "success": true,
  "updateId": "5f1a7b2c3d4e5f6g7h8i",
  "profiles": ["fb_123456789", "ig_987654321", "tw_112233445"],
  "scheduledFor": "2026-09-08T10:00:00Z",
  "status": "scheduled"
}
```

**At 10:00 AM on Sep 8:**
- Post automatically publishes to all 3 platforms
- Dashboard tracks engagement in real-time

---

## 🔧 Setup Checklist

### Part 1: VPS Backend (Already Deployed) ✅

- [x] Marketing Dashboard API running on port 3001
- [x] Caddy reverse proxy on ports 80/443
- [x] Meta Ads integration
- [x] Buffer API service
- [x] WhatsApp webhook receiver
- [x] All endpoints documented

### Part 2: Local OpenWA Setup

- [ ] Clone OpenWA: `git clone https://github.com/rmyndharis/OpenWA.git`
- [ ] Install: `npm install`
- [ ] Start: `npm run dev` (runs on http://localhost:2886)
- [ ] Scan QR code to authenticate WhatsApp

### Part 3: ngrok Tunnel Setup

- [ ] Install ngrok: `brew install ngrok` (or download)
- [ ] Sign up: https://ngrok.com
- [ ] Authenticate: `ngrok authtoken YOUR_TOKEN`
- [ ] Start tunnel: `ngrok http 2886` (in separate terminal)
- [ ] Copy ngrok URL: `https://abc123.ngrok.io`

### Part 4: Configure Webhook

- [ ] Open http://localhost:2886 (OpenWA Dashboard)
- [ ] Go to Settings → Webhooks
- [ ] Add endpoint: `https://api.techwokx.online/marketing/api/whatsapp/webhook`
- [ ] Enable events: message, message_sent, chat_opened, contact_added
- [ ] Save configuration

### Part 5: Configure Credentials

- [ ] Get Buffer access token: https://buffer.com/developers
- [ ] Get Meta Ads token: https://developers.facebook.com
- [ ] Update VPS `.env` with all credentials
- [ ] Restart API: `docker-compose restart marketing`

### Part 6: Test Integration

- [ ] Send test message to WhatsApp: `bash test-webhook.sh`
- [ ] Check VPS logs: `docker-compose logs -f marketing`
- [ ] Verify WhatsApp stats: `curl https://api.techwokx.online/marketing/api/whatsapp/stats`
- [ ] Test social posting: Schedule a post via API
- [ ] Verify in Buffer dashboard

---

## 💻 Quick Commands Reference

### Start Everything

```bash
# Terminal 1: Start OpenWA
cd ~/OpenWA
npm run dev
# Opens at http://localhost:2886

# Terminal 2: Start ngrok tunnel
ngrok http 2886

# Terminal 3: Monitor VPS logs
cd /opt/techwokx
docker-compose logs -f marketing

# Terminal 4: Run webhook tests
bash test-webhook.sh
```

### Monitor Stats

```bash
# WhatsApp stats (refresh every 5 seconds)
watch -n 5 'curl -s https://api.techwokx.online/marketing/api/whatsapp/stats | jq'

# Recent messages
curl -s https://api.techwokx.online/marketing/api/whatsapp/messages/recent | jq

# Top performing ads
curl -s https://api.techwokx.online/marketing/api/ads/top-performers | jq

# Social profiles
curl -s https://api.techwokx.online/marketing/api/social/profiles | jq
```

### Debugging

```bash
# Test webhook endpoint
curl -X POST https://api.techwokx.online/marketing/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"test","message":"test","messageType":"text"}'

# Check VPS API health
curl https://api.techwokx.online/health

# Check ngrok tunnel
curl -s http://localhost:4040/api/tunnels | jq '.tunnels[0].public_url'

# View OpenWA chats
curl http://localhost:2886/api/chats | jq

# Restart VPS services
docker-compose -p techwokx restart marketing
```

---

## 🎯 Data Flow Examples

### Example 1: New Lead via WhatsApp

```
Customer WhatsApp:
> Hi! Do you have any availability for a consultation next week?

↓

OpenWA captures and sends webhook:
POST /api/whatsapp/webhook
{
  "phoneNumber": "233501234567",
  "message": "Hi! Do you have any availability for a consultation next week?",
  "fromName": "Ama Osei",
  ...
}

↓

VPS processes:
- Logs message
- Detects no keyword intent (marks as "inquiry" not "qualified lead")
- Sends auto-reply: "Thanks! Our team will confirm availability soon."
- Updates stats

↓

Dashboard shows:
- New message from +233501234567 (Ama Osei)
- Message preview: "Hi! Do you have..."
- Status: "Inquiry"
- Response: "Auto-reply sent"
```

### Example 2: Campaign Performance Check

```
Marketing team opens dashboard:
https://techwokx.online/dashboard/marketing

↓

Clicks "Campaign Performance"

↓

Frontend requests:
GET /api/campaigns/23847234/performance

↓

VPS fetches from Meta Ads API:
- Spend: $1,250.00
- Impressions: 125,000
- Clicks: 2,500
- Conversions: 75
- ROI: 260%

↓

Dashboard displays metrics and charts
```

### Example 3: Schedule Post to 3 Platforms

```
Marketing team in dashboard:
- Types: "New feature: AI Chat Assistant now available! 🤖"
- Selects platforms: Facebook, Instagram, LinkedIn
- Picks time: Tomorrow at 2 PM
- Clicks "Schedule Post"

↓

Frontend sends:
POST /api/social/posts/schedule
{
  "profileIds": ["fb_123", "ig_456", "li_789"],
  "content": "New feature: AI Chat Assistant...",
  "scheduledTime": "2026-09-08T14:00:00Z"
}

↓

VPS sends to Buffer API

↓

Buffer schedules across 3 platforms

↓

Dashboard confirms:
"Post scheduled for 3 platforms on Sep 8 at 2:00 PM"

↓

At 2:00 PM tomorrow:
- Post automatically publishes
- Buffer tracks engagement (likes, shares, comments)
- Dashboard updates metrics in real-time
```

---

## 🚀 Next Steps

1. **Setup OpenWA locally** (this week)
   - Clone repo, install, start
   - Scan QR code to authenticate

2. **Configure ngrok tunnel** (this week)
   - Get authtoken, start tunnel
   - Test VPS webhook connectivity

3. **Build frontend dashboard** (next)
   - React component consuming API endpoints
   - Real-time message updates
   - Social post scheduler UI

4. **Enable analytics** (future)
   - Message sentiment analysis
   - Lead scoring algorithm
   - ROI attribution tracking

5. **Scale to production** (future)
   - Run OpenWA on VPS as Docker service
   - Replace ngrok with permanent IP/domain
   - Add database persistence
   - Implement message queue (Redis)

---

## 📚 Files & Documentation

- **API Reference**: `/opt/techwokx/API_REFERENCE.md`
- **OpenWA Setup**: `/opt/techwokx/OPENWA_SETUP.md`
- **Test Webhooks**: `/opt/techwokx/test-webhook.sh`
- **Main README**: `/opt/techwokx/README.md`
- **Buffer Service**: `/opt/techwokx/app/buffer-service.js`
- **WhatsApp Service**: `/opt/techwokx/app/whatsapp-service.js`

---

## 📞 Support Resources

- **OpenWA GitHub**: https://github.com/rmyndharis/OpenWA
- **Buffer API Docs**: https://buffer.com/developers/api
- **Meta Marketing API**: https://developers.facebook.com/docs/marketing-apis
- **ngrok Documentation**: https://ngrok.com/docs
- **TechWokx VPS**: `40.233.82.254` (Oracle Cloud)

---

Version: 1.0.0
Last Updated: September 7, 2026
