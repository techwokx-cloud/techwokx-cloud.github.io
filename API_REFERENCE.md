# TechWokx Marketing Dashboard — Complete API Reference

## Base URL

```
https://api.techwokx.online/marketing
```

---

## 📊 Meta Ads / Campaign Management

### Get All Campaigns
```http
GET /api/campaigns
```

Returns list of all Meta/Facebook ad campaigns.

### Get Campaign Performance
```http
GET /api/campaigns/:campaignId/performance
```

Returns detailed performance metrics for a specific campaign.

### Get Dashboard Summary
```http
GET /api/dashboard/summary
```

Returns account-level metrics for the last 30 days:
- Total spend
- Impressions, clicks, conversions
- CPM, CPC, CTR
- ROI percentage

### Get All Ad Sets
```http
GET /api/adsets
```

Returns all active ad sets.

### Get Ad Set Performance
```http
GET /api/adsets/:adsetId/performance?date_start=2026-08-01&date_stop=2026-09-07
```

Returns metrics for a specific ad set with optional date range.

### Get Spend Breakdown by Campaign
```http
GET /api/analytics/spend-by-campaign
```

Returns array of campaigns with spend totals.

### Get Performance Trends
```http
GET /api/analytics/trends
```

Returns performance data for the last 90 days broken down by country.

### Get Top Performing Ads
```http
GET /api/ads/top-performers
```

Returns top 10 ads ranked by ROAS (Return on Ad Spend).

**Response:**
```json
[
  {
    "adId": "120050594722190001",
    "adName": "Product Launch - Carousel",
    "spend": 200.00,
    "impressions": 50000,
    "clicks": 1200,
    "ctr": 2.4,
    "cpc": 0.17,
    "conversions": 45,
    "roas": 3.5
  }
]
```

### Get Budget Status
```http
GET /api/budget/status
```

Returns current account spend, balance, and spend cap.

---

## 📱 Social Media — Buffer API

### Get Connected Profiles
```http
GET /api/social/profiles
```

Returns all connected Buffer profiles (Facebook, Instagram, Twitter, LinkedIn).

### Get Profile Details
```http
GET /api/social/profiles/:profileId
```

Returns details for a specific social media profile.

### Get Pending Posts
```http
GET /api/social/posts/pending/:profileId
```

Returns all scheduled posts waiting to be published.

### Get Sent Posts
```http
GET /api/social/posts/sent/:profileId
```

Returns all published/sent posts.

### Schedule a New Post
```http
POST /api/social/posts/schedule
```

Schedule a post across multiple platforms.

**Request Body:**
```json
{
  "profileIds": ["123456", "789012"],
  "content": "Check out our latest blog post on AI automation! 🤖 #TechWokx #AI",
  "scheduledTime": "2026-09-08T14:30:00Z",
  "mediaUrls": ["https://example.com/image.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "updateId": "5f1a7b2c3d4e5f6g7h8i",
  "profiles": ["123456", "789012"],
  "scheduledFor": "2026-09-08T14:30:00Z"
}
```

### Delete Scheduled Post
```http
DELETE /api/social/posts/:updateId
```

Removes a scheduled post before it's published.

### Get Post Analytics
```http
GET /api/social/posts/:updateId/analytics
```

Returns performance metrics for a published post (likes, shares, comments, etc).

### Get Profile Statistics
```http
GET /api/social/stats/:profileId?days=7
```

Returns profile engagement statistics for the specified number of days.

---

## 💬 WhatsApp — OpenWA Integration

### WhatsApp Webhook Receiver
```http
POST /api/whatsapp/webhook
```

Receives incoming messages from OpenWA webhook.

**Headers:**
```
X-Webhook-Signature: [signature hash]
Content-Type: application/json
```

**Payload (from OpenWA):**
```json
{
  "phoneNumber": "233XXXXXXXXX",
  "message": "Hi, I'm interested in your services",
  "messageType": "text",
  "fromName": "John Doe",
  "isGroup": false,
  "chatId": "233XXXXXXXXX@c.us"
}
```

**Response:**
```json
{
  "success": true,
  "processed": true
}
```

### Send WhatsApp Message
```http
POST /api/whatsapp/send
```

Send a text message to a WhatsApp contact.

**Request Body:**
```json
{
  "toPhone": "233XXXXXXXXX",
  "message": "Thanks for your interest! We'll get back to you shortly.",
  "type": "text"
}
```

### Send Templated Message
```http
POST /api/whatsapp/send-template
```

Send predefined template messages.

**Request Body:**
```json
{
  "toPhone": "233XXXXXXXXX",
  "templateType": "welcome",
  "variables": {}
}
```

**Available Templates:**
- `welcome` — Welcome message
- `quote_request` — Quote request acknowledgment
- `booking_reminder` — Appointment reminder
- `support` — Support ticket confirmation

### Get Message History
```http
GET /api/whatsapp/messages/:phoneNumber?limit=50
```

Returns message history for a specific contact.

**Response:**
```json
[
  {
    "timestamp": "2026-09-07T10:23:45Z",
    "message": "Hi, I'm interested in your services",
    "type": "text",
    "fromName": "John Doe"
  }
]
```

### Get Recent Messages (Dashboard)
```http
GET /api/whatsapp/messages/recent?limit=20
```

Returns the 20 most recent WhatsApp messages across all contacts.

### Get WhatsApp Lead Statistics
```http
GET /api/whatsapp/stats
```

Returns WhatsApp engagement metrics.

**Response:**
```json
{
  "totalMessages": 156,
  "uniqueContacts": 28,
  "qualifiedLeads": 12,
  "averageMessagesPerContact": "5.57"
}
```

---

## 🔌 Authentication & Configuration

### Environment Variables

```bash
# Meta Ads
META_ACCESS_TOKEN=your_token
META_AD_ACCOUNT_ID=act_xxxxx

# Buffer (Social Media)
BUFFER_ACCESS_TOKEN=your_buffer_token

# WhatsApp/OpenWA
WHATSAPP_WEBHOOK_SECRET=your_secret
WHATSAPP_BUSINESS_PHONE_ID=your_phone_id
WHATSAPP_ACCESS_TOKEN=your_token
```

### Getting Credentials

**Meta Ads API:**
- Visit: https://developers.facebook.com
- Create an app → Business type
- Generate access token in App Roles → Test Users
- Find Ad Account ID in Ads Manager → Settings

**Buffer API:**
- Visit: https://buffer.com/developers
- Create app and get access token
- Note: Generate token with read/write permissions

**OpenWA WhatsApp:**
- GitHub: https://github.com/rmyndharis/OpenWA
- Setup instance and configure webhook
- Document webhook secret and phone ID

---

## ✅ Health & Status

### Service Health Check
```http
GET /health
```

Returns service status.

**Response:**
```json
{
  "status": "OK",
  "service": "marketing-dashboard"
}
```

---

## 📈 Usage Examples

### Example 1: Schedule a post to all social platforms
```bash
curl -X POST https://api.techwokx.online/marketing/api/social/posts/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "profileIds": ["fb_profile_123", "ig_profile_456", "tw_profile_789"],
    "content": "New blog: AI Automation Trends 2026 🚀 #AI #TechWokx",
    "scheduledTime": "2026-09-08T15:00:00Z",
    "mediaUrls": ["https://techwokx.online/blog/ai-trends.jpg"]
  }'
```

### Example 2: Get campaign performance metrics
```bash
curl https://api.techwokx.online/marketing/api/campaigns/23847234/performance \
  -H "Content-Type: application/json"
```

### Example 3: Send WhatsApp message to lead
```bash
curl -X POST https://api.techwokx.online/marketing/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "toPhone": "233123456789",
    "message": "Hi! Thanks for your interest in our AI automation services. Can we schedule a call tomorrow?"
  }'
```

### Example 4: Get WhatsApp lead stats
```bash
curl https://api.techwokx.online/marketing/api/whatsapp/stats
```

---

## 🚀 Quick Integration Checklist

- [ ] Configure `.env` with all credentials
- [ ] Restart API service: `docker-compose restart marketing`
- [ ] Test health endpoint: `curl https://api.techwokx.online/health`
- [ ] Connect Buffer account and test social scheduling
- [ ] Setup OpenWA webhook and test message receiving
- [ ] Build frontend dashboard to consume API endpoints
- [ ] Monitor logs: `docker-compose logs -f marketing`

---

## 🔒 Security Notes

1. **Webhook Signature Verification**: Always verify signatures on WhatsApp webhooks
2. **Rate Limiting**: Buffer has rate limits (typically 100 requests/hour)
3. **Token Rotation**: Refresh Meta access tokens regularly
4. **Secret Management**: Never commit `.env` to version control
5. **HTTPS Only**: All endpoints use HTTPS in production

---

## 📞 Support

For issues:
- Check logs: `docker-compose logs marketing`
- Verify `.env` configuration
- Test individual endpoints with curl
- Check service status: `GET /health`

Version: 1.0.0
Last Updated: September 7, 2026
