const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const path = require('path');
const BufferService = require('./buffer-service');
const WhatsAppService = require('./whatsapp-service');
const WebsiteScanDiscovery = require('./website-scan-discovery');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

// Initialize services
const bufferService = new BufferService(process.env.BUFFER_ACCESS_TOKEN);
const whatsappService = new WhatsAppService({
  webhookSecret: process.env.WHATSAPP_WEBHOOK_SECRET,
  businessPhoneId: process.env.WHATSAPP_BUSINESS_PHONE_ID,
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN
});
const scanDiscovery = new WebsiteScanDiscovery();

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'marketing-dashboard' });
});

// ============================================================================
// CAMPAIGN PERFORMANCE ENDPOINTS
// ============================================================================

// Get all campaigns
app.get('/api/campaigns', async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.instagram.com/v18.0/${META_AD_ACCOUNT_ID}/campaigns`,
      {
        params: {
          access_token: META_ACCESS_TOKEN,
          fields: 'id,name,status,objective,budget_remaining,daily_budget,start_time,end_time'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns', details: error.message });
  }
});

// Get campaign performance metrics
app.get('/api/campaigns/:campaignId/performance', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const response = await axios.get(
      `https://graph.instagram.com/v18.0/${campaignId}/insights`,
      {
        params: {
          access_token: META_ACCESS_TOKEN,
          metrics: 'spend,impressions,clicks,actions,action_values'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performance metrics', details: error.message });
  }
});

// ============================================================================
// AD SET ENDPOINTS
// ============================================================================

// Get all ad sets
app.get('/api/adsets', async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.instagram.com/v18.0/${META_AD_ACCOUNT_ID}/adsets`,
      {
        params: {
          access_token: META_ACCESS_TOKEN,
          fields: 'id,name,campaign_id,status,billing_event,daily_budget,budget_remaining'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ad sets', details: error.message });
  }
});

// Get ad set performance
app.get('/api/adsets/:adsetId/performance', async (req, res) => {
  try {
    const { adsetId } = req.params;
    const { date_start, date_stop } = req.query;
    
    const response = await axios.get(
      `https://graph.instagram.com/v18.0/${adsetId}/insights`,
      {
        params: {
          access_token: META_ACCESS_TOKEN,
          metrics: 'spend,impressions,clicks,cpc,cpm,ctr,actions,action_values',
          date_preset: 'last_30d',
          ...(date_start && { date_start }),
          ...(date_stop && { date_stop })
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ad set performance', details: error.message });
  }
});

// ============================================================================
// DASHBOARD SUMMARY ENDPOINTS
// ============================================================================

// Get account-level dashboard summary
app.get('/api/dashboard/summary', async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.instagram.com/v18.0/${META_AD_ACCOUNT_ID}/insights`,
      {
        params: {
          access_token: META_ACCESS_TOKEN,
          metrics: 'spend,impressions,clicks,actions,action_values',
          date_preset: 'last_30d'
        }
      }
    );

    const data = response.data.data[0] || {};
    
    res.json({
      period: 'Last 30 Days',
      totalSpend: data.spend || 0,
      totalImpressions: data.impressions || 0,
      totalClicks: data.clicks || 0,
      totalActions: data.actions || 0,
      totalRevenue: data.action_values || 0,
      cpm: data.cpm || 0,
      cpc: data.cpc || 0,
      ctr: data.ctr || 0,
      roiPercentage: ((data.action_values - data.spend) / data.spend * 100) || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard summary', details: error.message });
  }
});

// ============================================================================
// ANALYTICS ENDPOINTS
// ============================================================================

// Get spend breakdown by campaign
app.get('/api/analytics/spend-by-campaign', async (req, res) => {
  try {
    const campaignsResponse = await axios.get(
      `https://graph.instagram.com/v18.0/${META_AD_ACCOUNT_ID}/campaigns`,
      {
        params: {
          access_token: META_ACCESS_TOKEN,
          fields: 'id,name'
        }
      }
    );

    const campaigns = campaignsResponse.data.data || [];
    const breakdown = await Promise.all(
      campaigns.map(async (campaign) => {
        try {
          const insightsResponse = await axios.get(
            `https://graph.instagram.com/v18.0/${campaign.id}/insights`,
            {
              params: {
                access_token: META_ACCESS_TOKEN,
                metrics: 'spend',
                date_preset: 'last_30d'
              }
            }
          );
          return {
            campaignName: campaign.name,
            campaignId: campaign.id,
            spend: insightsResponse.data.data[0]?.spend || 0
          };
        } catch (e) {
          return { campaignName: campaign.name, campaignId: campaign.id, spend: 0 };
        }
      })
    );

    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spend breakdown', details: error.message });
  }
});

// Get performance trends
app.get('/api/analytics/trends', async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.instagram.com/v18.0/${META_AD_ACCOUNT_ID}/insights`,
      {
        params: {
          access_token: META_ACCESS_TOKEN,
          metrics: 'spend,impressions,clicks,actions',
          date_preset: 'last_90d',
          breakdown: 'country'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends', details: error.message });
  }
});

// ============================================================================
// CONTENT PERFORMANCE
// ============================================================================

// Get top performing ads
app.get('/api/ads/top-performers', async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.instagram.com/v18.0/${META_AD_ACCOUNT_ID}/ads`,
      {
        params: {
          access_token: META_ACCESS_TOKEN,
          fields: 'id,name,adset_id,status,creative',
          limit: 20
        }
      }
    );

    const ads = response.data.data || [];
    
    const adsWithMetrics = await Promise.all(
      ads.map(async (ad) => {
        try {
          const insightsResponse = await axios.get(
            `https://graph.instagram.com/v18.0/${ad.id}/insights`,
            {
              params: {
                access_token: META_ACCESS_TOKEN,
                metrics: 'spend,impressions,clicks,ctr,cpc,actions,action_values',
                date_preset: 'last_30d'
              }
            }
          );
          const metrics = insightsResponse.data.data[0] || {};
          return {
            adId: ad.id,
            adName: ad.name,
            spend: metrics.spend || 0,
            impressions: metrics.impressions || 0,
            clicks: metrics.clicks || 0,
            ctr: metrics.ctr || 0,
            cpc: metrics.cpc || 0,
            conversions: metrics.actions || 0,
            roas: (metrics.action_values / metrics.spend) || 0
          };
        } catch (e) {
          return { adId: ad.id, adName: ad.name, error: 'Failed to fetch metrics' };
        }
      })
    );

    // Sort by ROAS descending
    const topPerformers = adsWithMetrics
      .filter(ad => !ad.error && ad.roas > 0)
      .sort((a, b) => b.roas - a.roas)
      .slice(0, 10);

    res.json(topPerformers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top performers', details: error.message });
  }
});

// ============================================================================
// BUDGET & SPEND TRACKING
// ============================================================================

// Get account spend status
app.get('/api/budget/status', async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.instagram.com/v18.0/${META_AD_ACCOUNT_ID}`,
      {
        params: {
          access_token: META_ACCESS_TOKEN,
          fields: 'name,account_id,amount_spent,balance,spend_cap'
        }
      }
    );
    
    res.json({
      accountId: response.data.account_id,
      accountName: response.data.name,
      totalSpent: response.data.amount_spent || 0,
      balance: response.data.balance || 0,
      spendCap: response.data.spend_cap || 0,
      percentageUsed: ((response.data.amount_spent / response.data.spend_cap) * 100).toFixed(2) || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budget status', details: error.message });
  }
});

// ============================================================================
// SOCIAL MEDIA ENDPOINTS (Buffer API)
// ============================================================================

// Get all connected social profiles
app.get('/api/social/profiles', async (req, res) => {
  try {
    const profiles = await bufferService.getProfiles();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get profile details
app.get('/api/social/profiles/:profileId', async (req, res) => {
  try {
    const profile = await bufferService.getProfile(req.params.profileId);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending scheduled posts
app.get('/api/social/posts/pending/:profileId', async (req, res) => {
  try {
    const pendingPosts = await bufferService.getPendingPosts(req.params.profileId);
    res.json(pendingPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sent/published posts
app.get('/api/social/posts/sent/:profileId', async (req, res) => {
  try {
    const sentPosts = await bufferService.getSentPosts(req.params.profileId);
    res.json(sentPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule a new post
app.post('/api/social/posts/schedule', async (req, res) => {
  try {
    const { profileIds, content, scheduledTime, mediaUrls } = req.body;
    
    if (!profileIds || !content) {
      return res.status(400).json({ error: 'Missing required fields: profileIds, content' });
    }

    const result = await bufferService.schedulePost(
      profileIds,
      content,
      scheduledTime || new Date(),
      mediaUrls
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete scheduled post
app.delete('/api/social/posts/:updateId', async (req, res) => {
  try {
    const result = await bufferService.deletePost(req.params.updateId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get post analytics
app.get('/api/social/posts/:updateId/analytics', async (req, res) => {
  try {
    const analytics = await bufferService.getPostAnalytics(req.params.updateId);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get profile statistics
app.get('/api/social/stats/:profileId', async (req, res) => {
  try {
    const { days } = req.query;
    const stats = await bufferService.getProfileStats(req.params.profileId, days || 7);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// WHATSAPP ENDPOINTS (OpenWA Webhooks)
// ============================================================================

// Webhook receiver for OpenWA messages
app.post('/api/whatsapp/webhook', async (req, res) => {
  try {
    // Verify webhook signature if provided
    if (req.headers['x-webhook-signature']) {
      const body = JSON.stringify(req.body);
      if (!whatsappService.verifyWebhookSignature(body, req.headers['x-webhook-signature'])) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }
    }

    const result = await whatsappService.handleWebhook(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send WhatsApp message
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { toPhone, message, type } = req.body;

    if (!toPhone || !message) {
      return res.status(400).json({ error: 'Missing required fields: toPhone, message' });
    }

    const result = await whatsappService.sendMessage(toPhone, message, { type });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send templated message
app.post('/api/whatsapp/send-template', async (req, res) => {
  try {
    const { toPhone, templateType, variables } = req.body;

    if (!toPhone || !templateType) {
      return res.status(400).json({ error: 'Missing required fields: toPhone, templateType' });
    }

    const result = await whatsappService.sendTemplateMessage(toPhone, templateType, variables);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get message history
app.get('/api/whatsapp/messages/:phoneNumber', (req, res) => {
  try {
    const { limit } = req.query;
    const messages = whatsappService.getMessageHistory(req.params.phoneNumber, limit || 50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent messages dashboard
app.get('/api/whatsapp/messages/recent', (req, res) => {
  try {
    const { limit } = req.query;
    const messages = whatsappService.getRecentMessages(limit || 20);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get WhatsApp lead statistics
app.get('/api/whatsapp/stats', (req, res) => {
  try {
    const stats = whatsappService.getLeadStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// WEBSITE SCAN DISCOVERY
// ============================================================================

// Get available goal options
app.get('/api/scan/goals', (req, res) => {
  try {
    const discovery = scanDiscovery.getGoalDiscoveryMessage();
    res.json(discovery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Scan website and return discovery options
app.post('/api/scan', async (req, res) => {
  try {
    const { url, email, name, company } = req.body;

    if (!url || !email || !name || !company) {
      return res.status(400).json({
        error: 'Missing required fields: url, email, name, company'
      });
    }

    const result = await scanDiscovery.completeScanFlow(url, email, name, company);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send personalized scan report after user selects goal
app.post('/api/scan/send-report', async (req, res) => {
  try {
    const { url, email, name, company, goal } = req.body;

    if (!url || !email || !name || !company || !goal) {
      return res.status(400).json({
        error: 'Missing required fields: url, email, name, company, goal'
      });
    }

    const result = await scanDiscovery.sendPersonalizedReport(url, email, name, company, goal);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Preview scan report for specific goal
app.get('/api/scan/preview/:goal', async (req, res) => {
  try {
    const { goal } = req.params;

    // Create sample scan data for preview
    const sampleScan = {
      url: 'https://example.com',
      domain: 'example.com',
      timestamp: new Date().toISOString(),
      opportunities: [
        {
          id: 'ai_booking',
          title: 'AI Booking Assistant',
          priority: 'HIGH',
          cost: 79,
          timeline: '1-2 weeks',
          description: 'Service/appointment language found on the page, but no booking system',
          benefits: [
            'More qualified leads captured automatically',
            'Instant answers to common questions',
            'Visitors get faster responses instead of browsing',
            'Appointments captured without back-and-forth emails'
          ]
        },
        {
          id: 'ai_chatbot',
          title: 'AI Customer Support Bot',
          priority: 'MEDIUM',
          cost: 99,
          timeline: '2-3 weeks',
          description: 'No visible live chat or support automation detected',
          benefits: [
            'Answer questions 24/7 even outside business hours',
            'Reduce support team workload by 60%',
            'Faster response times increase customer satisfaction'
          ]
        },
        {
          id: 'ai_sales',
          title: 'AI Sales Assistant',
          priority: 'MEDIUM',
          cost: 89,
          timeline: '1-2 weeks',
          description: 'No automated sales funnel or recommendation system detected',
          benefits: [
            'Guide visitors to right products/services',
            'Answer pricing and feature questions instantly',
            'Reduce time-to-first-response for sales inquiries'
          ]
        }
      ]
    };

    // Filter for preview
    const filteredResults = scanDiscovery.filterOpportunitiesByGoal(sampleScan, goal);
    const htmlPreview = scanDiscovery.generateScanEmailHTML(
      'John Doe',
      'Example Company',
      sampleScan,
      filteredResults
    );

    res.json({
      goal: filteredResults.goal.label,
      opportunities: filteredResults.opportunities.length,
      topOpportunity: filteredResults.topOpportunity.title,
      htmlPreview: htmlPreview
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve scan goal discovery form
app.get('/scan-form', (req, res) => {
  res.sendFile(path.join(__dirname, 'scan-goal-discovery.html'));
});

// ============================================================================
// ERROR HANDLING & 404
// ============================================================================

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Marketing Dashboard API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
