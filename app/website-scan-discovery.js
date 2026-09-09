/**
 * Website Scan Discovery Flow
 * 1. Scan website for AI opportunities
 * 2. Ask user: What's your primary goal?
 * 3. Generate personalized scan report
 * 4. Send beautiful HTML email with findings
 */

const axios = require('axios');

// Website goal options
const WEBSITE_GOALS = {
  lead_generation: {
    label: 'Lead Generation',
    description: 'Capture qualified leads automatically',
    focus_areas: ['AI chatbot for lead capture', 'Automated lead qualification', 'Smart lead routing']
  },
  ecommerce: {
    label: 'E-commerce / Sales',
    description: 'Increase online sales',
    focus_areas: ['AI product recommendations', 'Abandoned cart recovery', 'AI sales assistant']
  },
  bookings: {
    label: 'Bookings / Appointments',
    description: 'Automate scheduling and consultations',
    focus_areas: ['AI booking assistant', 'Calendar integration', 'Automated reminders']
  },
  support: {
    label: 'Customer Support',
    description: 'Provide 24/7 instant support',
    focus_areas: ['AI customer service bot', 'FAQ automation', 'Ticket routing']
  },
  knowledge_base: {
    label: 'Knowledge Base',
    description: 'Make information findable with AI search',
    focus_areas: ['AI-powered search', 'Intelligent documentation', 'Self-service portal']
  },
  content: {
    label: 'Content Generation',
    description: 'Create and optimize content faster',
    focus_areas: ['AI content writer', 'SEO optimization', 'Social media automation']
  }
};

class WebsiteScanDiscovery {
  constructor() {
    this.scanResults = {};
    this.userGoals = {};
  }

  /**
   * Step 1: Scan website and get initial results
   */
  async scanWebsite(url) {
    try {
      // This would call your actual scanning service
      const scanData = {
        url: url,
        domain: new URL(url).hostname,
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
              'Faster response times increase customer satisfaction',
              'Capture leads while providing support'
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
              'Reduce time-to-first-response for sales inquiries',
              'Increase average order value with recommendations'
            ]
          }
        ]
      };

      this.scanResults[url] = scanData;
      return scanData;
    } catch (error) {
      throw new Error(`Failed to scan website: ${error.message}`);
    }
  }

  /**
   * Step 2: Ask user about their primary goal
   */
  getGoalDiscoveryMessage() {
    const goals = Object.entries(WEBSITE_GOALS).map(([ key, value ]) => ({
      id: key,
      label: value.label,
      description: value.description
    }));

    return {
      message: 'To personalize your AI scan report, what\'s your website\'s PRIMARY goal?',
      options: goals,
      followUp: 'We\'ll focus our recommendations on opportunities that drive your specific goal.'
    };
  }

  /**
   * Step 3: Filter scan results based on user goal
   */
  filterOpportunitiesByGoal(scanData, goalId) {
    const goal = WEBSITE_GOALS[goalId];
    
    if (!goal) {
      throw new Error(`Unknown goal: ${goalId}`);
    }

    // Score each opportunity based on relevance to goal
    const scoredOpportunities = scanData.opportunities.map(opp => {
      const relevance = goal.focus_areas.some(area => 
        opp.description.toLowerCase().includes(area.toLowerCase()) ||
        opp.title.toLowerCase().includes(area.toLowerCase())
      ) ? 1 : 0.5;

      return {
        ...opp,
        relevanceScore: relevance
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);

    return {
      goal: goal,
      opportunities: scoredOpportunities,
      topOpportunity: scoredOpportunities[0]
    };
  }

  /**
   * Step 4: Generate styled HTML email with scan results
   */
  generateScanEmailHTML(contactName, company, scanData, filteredResults) {
    const topOpp = filteredResults.topOpportunity;
    const opportunitiesHTML = filteredResults.opportunities
      .slice(0, 3) // Show top 3
      .map((opp, index) => `
        <div style="margin-bottom: 24px; border-left: 4px solid #7c3aed; padding-left: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <div>
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                ${index + 1}. ${opp.title}
              </h3>
              <p style="margin: 0; font-size: 13px; color: #6b7280;">
                ${opp.description}
              </p>
            </div>
            <span style="background-color: ${opp.priority === 'HIGH' ? '#fee2e2' : '#fef3c7'}; color: ${opp.priority === 'HIGH' ? '#dc2626' : '#d97706'}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
              ${opp.priority}
            </span>
          </div>
          
          <div style="margin-top: 8px; font-size: 13px; color: #6b7280;">
            <strong>Implementation:</strong> $${opp.cost} • ${opp.timeline}
          </div>
          
          <ul style="margin: 12px 0 0 0; padding-left: 20px; font-size: 13px; color: #4b5563;">
            ${opp.benefits.map(benefit => `<li style="margin-bottom: 6px;">${benefit}</li>`).join('')}
          </ul>
        </div>
      `).join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Website AI Scan Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 32px 24px; border-radius: 8px; margin-bottom: 24px; }
    .header h1 { margin: 0 0 8px 0; font-size: 24px; }
    .header p { margin: 0; font-size: 14px; opacity: 0.9; }
    .goal-badge { background-color: #f3f4f6; border-left: 4px solid #7c3aed; padding: 12px 16px; margin-bottom: 24px; border-radius: 4px; }
    .goal-badge p { margin: 0; font-size: 13px; color: #6b7280; }
    .goal-badge strong { color: #1f2937; }
    .opportunities-section { margin-bottom: 32px; }
    .opportunities-section h2 { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 16px; }
    .top-opportunity { background-color: #fafafa; border: 2px solid #7c3aed; padding: 20px; border-radius: 8px; margin-bottom: 24px; }
    .top-opportunity .label { display: inline-block; background-color: #ede9fe; color: #7c3aed; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 8px; }
    .top-opportunity h3 { margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #1f2937; }
    .cta-section { background-color: #f8fafc; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px; }
    .cta-button { display: inline-block; background-color: #7c3aed; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .cta-button:hover { background-color: #6d28d9; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Your Website AI Scan Report</h1>
      <p>We found ${filteredResults.opportunities.length} ways AI can improve your ${filteredResults.goal.label}</p>
    </div>

    <!-- Goal Context -->
    <div class="goal-badge">
      <p><strong>Your Goal:</strong> ${filteredResults.goal.label}</p>
      <p>${filteredResults.goal.description}</p>
    </div>

    <!-- Top Opportunity Highlight -->
    <div class="top-opportunity">
      <div class="label">🎯 HIGHEST IMPACT</div>
      <h3>${topOpp.title}</h3>
      <p style="margin: 12px 0; color: #4b5563; font-size: 14px;">${topOpp.description}</p>
      <div style="margin: 16px 0; padding: 12px; background-color: white; border-radius: 6px; font-size: 13px;">
        <strong>Quick Facts:</strong><br>
        💰 Investment: $${topOpp.cost}<br>
        ⏱️ Timeline: ${topOpp.timeline}<br>
        📈 Priority: <span style="color: #dc2626; font-weight: 600;">${topOpp.priority}</span>
      </div>
      <p style="margin: 12px 0 0 0; font-size: 13px; color: #6b7280;"><strong>What this means for you:</strong></p>
      <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 13px; color: #4b5563;">
        ${topOpp.benefits.slice(0, 2).map(benefit => `<li>${benefit}</li>`).join('')}
      </ul>
    </div>

    <!-- All Opportunities -->
    <div class="opportunities-section">
      <h2>All Opportunities (${filteredResults.opportunities.length})</h2>
      ${opportunitiesHTML}
    </div>

    <!-- CTA -->
    <div class="cta-section">
      <p style="margin-bottom: 16px; font-size: 14px; color: #4b5563;">Ready to see the full impact of AI on your business?</p>
      <a href="https://techwokx.online/book-consultation?utm_source=scan&utm_campaign=${encodeURIComponent(company)}" class="cta-button">
        Get a Free AI Consultation →
      </a>
      <p style="margin-top: 16px; font-size: 12px; color: #6b7280;">15 minutes to discuss your opportunities and next steps</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>TechWokx AI Solutions | https://techwokx.online</p>
      <p>This scan was performed on ${new Date(scanData.timestamp).toLocaleDateString()} for ${scanData.domain}</p>
      <p>Want the detailed report? <a href="https://techwokx.online/scan-results?utm_source=email" style="color: #7c3aed;">View Full Report</a></p>
    </div>
  </div>
</body>
</html>
    `;

    return html;
  }

  /**
   * Step 5: Send email via Resend
   */
  async sendScanEmail(contactEmail, contactName, company, scanData, filteredResults) {
    try {
      const htmlContent = this.generateScanEmailHTML(contactName, company, scanData, filteredResults);
      
      // This would call Resend API (which you're already using)
      const response = await axios.post('https://api.resend.com/emails', {
        from: 'scans@techwokx.online',
        to: contactEmail,
        subject: `${contactName}, we found ${filteredResults.opportunities.length} AI opportunities for ${company}`,
        html: htmlContent,
        reply_to: 'george.jabley@gmail.com',
        tags: [
          { name: 'scan_report', value: 'true' },
          { name: 'goal', value: filteredResults.goal.label },
          { name: 'company', value: company }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        }
      });

      return {
        success: true,
        emailId: response.data.id,
        sentTo: contactEmail,
        goal: filteredResults.goal.label
      };
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Complete flow: Scan → Ask Goal → Send Report
   */
  async completeScanFlow(url, contactEmail, contactName, company) {
    // Step 1: Scan the website
    const scanData = await this.scanWebsite(url);

    // Step 2: Get goal discovery options (return to user)
    const discoveryMessage = this.getGoalDiscoveryMessage();

    // This would return to user asking them to select a goal
    // Then on callback:
    // Step 3: Filter based on goal
    // Step 4: Generate email
    // Step 5: Send email

    return {
      scanCompleted: true,
      scanData: scanData,
      discoveryMessage: discoveryMessage,
      nextStep: 'Please select your primary business goal'
    };
  }

  /**
   * After user selects goal, complete the flow
   */
  async sendPersonalizedReport(url, contactEmail, contactName, company, goalId) {
    const scanData = this.scanResults[url];
    
    if (!scanData) {
      throw new Error('No scan data found for this URL');
    }

    // Filter opportunities based on goal
    const filteredResults = this.filterOpportunitiesByGoal(scanData, goalId);

    // Send the email
    const emailResult = await this.sendScanEmail(contactEmail, contactName, company, scanData, filteredResults);

    return {
      success: true,
      emailSent: emailResult,
      report: {
        goal: filteredResults.goal.label,
        topOpportunity: filteredResults.topOpportunity.title,
        opportunitiesCount: filteredResults.opportunities.length
      }
    };
  }
}

module.exports = WebsiteScanDiscovery;
