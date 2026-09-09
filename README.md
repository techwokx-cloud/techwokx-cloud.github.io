# TechWokx Marketing Dashboard

Production deployment for TechWokx VPS with integrated marketing analytics, campaign performance tracking, and ad spend management.

## Quick Start

### 1. Configure Environment

```bash
# Edit configuration
nano /opt/techwokx/app/.env
```

**Required:**
- `META_ACCESS_TOKEN`: Your Meta Business Account access token
- `META_AD_ACCOUNT_ID`: Your Ad Account ID (format: `act_xxxxxxxxxxxxx`)

### 2. Deploy Services

```bash
cd /opt/techwokx
chmod +x deploy.sh
./deploy.sh
```

This will:
- Set up directory structure
- Check Docker installation
- Configure environment
- Start all services (Caddy, API Gateway, Marketing Dashboard)

### 3. Verify Deployment

```bash
# Health check
curl https://api.techwokx.online/health

# Check running containers
docker ps | grep techwokx
```

## Architecture

```
┌─────────────────────────────────────┐
│   TechWokx Frontend (GitHub Pages)  │
│      techwokx.online                │
└────────────────┬────────────────────┘
                 │ HTTPS
                 ▼
         ┌──────────────┐
         │ Caddy (443)  │  SSL/TLS
         └──────┬───────┘
                │
      ┌─────────┴──────────┐
      │                    │
      ▼                    ▼
┌──────────────┐    ┌──────────────────┐
│   Gateway    │    │ Marketing API    │
│  (Port 3000) │    │ (Port 3001)      │
└──────────────┘    └──────────────────┘
                           │
                           ▼
                   ┌──────────────────┐
                   │  Meta Ads API    │
                   └──────────────────┘
```

## API Endpoints

### Health & Status

```
GET /health
```
Check API service status.

**Response:**
```json
{
  "status": "OK",
  "service": "marketing-dashboard"
}
```

### Campaigns

#### List all campaigns
```
GET /api/campaigns
```

#### Campaign performance
```
GET /api/campaigns/:campaignId/performance
```

### Ad Sets

#### List all ad sets
```
GET /api/adsets
```

#### Ad set performance
```
GET /api/adsets/:adsetId/performance?date_start=2026-08-01&date_stop=2026-09-07
```

### Dashboard Summary

#### Account-level metrics (last 30 days)
```
GET /api/dashboard/summary
```

**Response:**
```json
{
  "period": "Last 30 Days",
  "totalSpend": 1500.00,
  "totalImpressions": 125000,
  "totalClicks": 2500,
  "totalActions": 150,
  "totalRevenue": 4500.00,
  "cpm": 12.00,
  "cpc": 0.60,
  "ctr": 2.0,
  "roiPercentage": 200
}
```

### Analytics

#### Spend breakdown by campaign
```
GET /api/analytics/spend-by-campaign
```

**Response:**
```json
[
  {
    "campaignName": "Summer Sale 2026",
    "campaignId": "23847234",
    "spend": 750.00
  },
  {
    "campaignName": "Brand Awareness",
    "campaignId": "23847235",
    "spend": 750.00
  }
]
```

#### Performance trends
```
GET /api/analytics/trends
```

### Top Performing Ads

#### Get top 10 ads by ROAS
```
GET /api/ads/top-performers
```

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
  },
  ...
]
```

### Budget Tracking

#### Account spend status
```
GET /api/budget/status
```

**Response:**
```json
{
  "accountId": "act_123456789",
  "accountName": "TechWokx Account",
  "totalSpent": 1500.00,
  "balance": 3500.00,
  "spendCap": 5000.00,
  "percentageUsed": "30.00"
}
```

## Service Management

### View logs
```bash
# All services
docker-compose -p techwokx logs -f

# Marketing API only
docker-compose -p techwokx logs -f marketing

# Follow in real-time
docker-compose -p techwokx logs -f --tail=50
```

### Restart services
```bash
# Restart all
docker-compose -p techwokx restart

# Restart specific service
docker-compose -p techwokx restart marketing
```

### Stop services
```bash
docker-compose -p techwokx down
```

### Start services
```bash
cd /opt/techwokx/config
docker-compose -p techwokx up -d
```

## Configuration Files

### `/opt/techwokx/app/.env`
Environment variables for API services.

### `/opt/techwokx/config/Caddyfile`
Caddy reverse proxy configuration with SSL/TLS termination.

### `/opt/techwokx/config/docker-compose.yml`
Docker Compose orchestration for all services.

## Monitoring

### Check service health
```bash
# Caddy
docker exec techwokx-caddy wget -q -O - https://api.techwokx.online/health

# Marketing API
docker exec techwokx-marketing wget -q -O - http://localhost:3001/health

# Gateway
docker exec techwokx-gateway wget -q -O - http://localhost:3000/health
```

### View container stats
```bash
docker stats techwokx-*
```

## Troubleshooting

### SSL Certificate Issues

If Caddy can't obtain certificates:

1. Verify firewall rules allow ports 80 and 443 from 0.0.0.0/0
2. Check DNS is pointing to 40.233.82.254
3. View Caddy logs: `docker-compose logs caddy`

### API Connection Issues

Check if the API is accessible:
```bash
curl -v https://api.techwokx.online/health
```

### Meta Ads API Errors

Verify credentials in `.env`:
```bash
# Check token validity
curl -i "https://graph.instagram.com/debug_token?input_token=YOUR_TOKEN&access_token=YOUR_TOKEN"
```

## Deployment Timeline

- **Phase 1** (Complete): API infrastructure, Docker setup, Caddy configuration
- **Phase 2** (Next): Frontend dashboard integration with API
- **Phase 3**: Real-time analytics and reporting features
- **Phase 4**: Client portal and multi-account management

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Review configuration: `/opt/techwokx/app/.env`
- Verify connectivity: `curl https://api.techwokx.online/health`

## Version History

- **v1.0.0** (Sep 7, 2026): Initial production deployment
  - Meta Ads API integration
  - Campaign performance tracking
  - Ad spend analytics
  - Content performance metrics
  - Budget monitoring
