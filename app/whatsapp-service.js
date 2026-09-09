/**
 * WhatsApp Integration Service (OpenWA)
 * Handles incoming messages, webhooks, and WhatsApp automation
 * Works with rmyndharis/OpenWA framework
 */

const crypto = require('crypto');

/**
 * WhatsApp Message Handler
 * Processes incoming messages from OpenWA webhooks
 */
class WhatsAppService {
  constructor(config = {}) {
    this.webhookSecret = config.webhookSecret || process.env.WHATSAPP_WEBHOOK_SECRET || '';
    this.businessPhoneId = config.businessPhoneId || process.env.WHATSAPP_BUSINESS_PHONE_ID || '';
    this.accessToken = config.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.messageHandlers = {};
    this.messageLog = [];
  }

  /**
   * Verify webhook signature (security)
   */
  verifyWebhookSignature(body, signature) {
    const hash = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(body)
      .digest('hex');
    return hash === signature;
  }

  /**
   * Process incoming webhook from OpenWA
   * Webhook payload structure from OpenWA
   */
  async handleWebhook(payload) {
    try {
      // Log all incoming messages
      this.messageLog.push({
        timestamp: new Date(),
        payload,
        processed: false
      });

      const { phoneNumber, message, messageType, fromName, isGroup, chatId } = payload;

      // Route message to appropriate handler
      await this.routeMessage({
        phoneNumber,
        message,
        messageType,
        fromName,
        isGroup,
        chatId
      });

      return { success: true, processed: true };
    } catch (error) {
      console.error('WhatsApp webhook error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Route incoming messages to handlers
   */
  async routeMessage(messageData) {
    const { message, messageType, phoneNumber, isGroup } = messageData;

    // Check for registered handlers
    if (this.messageHandlers[messageType]) {
      await this.messageHandlers[messageType](messageData);
    }

    // Default handlers
    switch (messageType) {
      case 'text':
        return await this.handleTextMessage(messageData);
      case 'image':
      case 'video':
      case 'document':
        return await this.handleMediaMessage(messageData);
      case 'button':
        return await this.handleButtonMessage(messageData);
      default:
        console.log(`Unhandled message type: ${messageType}`);
    }
  }

  /**
   * Handle incoming text messages
   */
  async handleTextMessage(data) {
    const { message, phoneNumber, fromName, isGroup, chatId } = data;

    // Log lead intent
    if (message.toLowerCase().includes('interested') || message.toLowerCase().includes('quote')) {
      return await this.logLeadIntent({
        phone: phoneNumber,
        name: fromName,
        message,
        isGroup,
        chatId,
        timestamp: new Date()
      });
    }

    // Auto-reply to common questions
    const autoReply = this.getAutoReply(message);
    if (autoReply) {
      return await this.sendMessage(phoneNumber, autoReply);
    }

    return { logged: true };
  }

  /**
   * Handle media messages (images, videos, documents)
   */
  async handleMediaMessage(data) {
    const { phoneNumber, messageType, message } = data;

    // Log media submission (portfolio, samples, etc)
    return {
      mediaLogged: true,
      phoneNumber,
      type: messageType,
      timestamp: new Date()
    };
  }

  /**
   * Handle interactive button responses
   */
  async handleButtonMessage(data) {
    const { phoneNumber, message, chatId } = data;

    // Track button clicks for analytics
    return {
      buttonClicked: true,
      action: message,
      phoneNumber,
      timestamp: new Date()
    };
  }

  /**
   * Send a message via WhatsApp
   */
  async sendMessage(toPhone, message, options = {}) {
    try {
      // This would integrate with your WhatsApp API/OpenWA instance
      // For now, returns the structured request
      return {
        success: true,
        to: toPhone,
        message,
        type: options.type || 'text',
        timestamp: new Date(),
        status: 'queued'
      };
    } catch (error) {
      throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }
  }

  /**
   * Send templated message (common use cases)
   */
  async sendTemplateMessage(toPhone, templateType, variables = {}) {
    const templates = {
      welcome: `Welcome to TechWokx! 👋\n\nWe help businesses grow with AI automation and digital solutions.\n\nWhat can we help you with today?`,
      quote_request: `Thanks for your interest! 📋\n\nWe'll prepare a custom quote based on your needs.\n\nOne of our consultants will reach out shortly.`,
      booking_reminder: `Reminder: You have a consultation scheduled ${variables.time || 'soon'}.\n\nJoin here: ${variables.link || ''}`,
      support: `Thanks for contacting TechWokx support!\n\nWe typically respond within 2 hours.\n\nYour ticket ID: ${variables.ticketId || ''}`
    };

    const message = templates[templateType] || templates.welcome;
    return await this.sendMessage(toPhone, message);
  }

  /**
   * Auto-reply to common questions
   */
  getAutoReply(userMessage) {
    const responses = {
      'what services': 'We offer: Website Development, AI Automation, Social Media Management, Lead Generation, and Business Consulting. Reply with a number to learn more:\n1️⃣ Web Development\n2️⃣ AI Automation\n3️⃣ Social Media\n4️⃣ Lead Generation\n5️⃣ Consulting',
      'pricing': 'Pricing varies based on scope. We offer flexible packages starting from $500/month. Reply "quote" to get a custom quote.',
      'portfolio': 'Check out our work: https://techwokx.online/portfolio',
      'contact': 'Direct contact: george.jabley@gmail.com or call +233 XX XXX XXXX',
      'support': "Our support team is here to help! Please describe your issue and we'll get back to you shortly.",
      'hours': 'We\'re available Monday-Friday, 9 AM - 6 PM GMT'
    };

    for (const [keyword, reply] of Object.entries(responses)) {
      if (userMessage.toLowerCase().includes(keyword)) {
        return reply;
      }
    }

    return null;
  }

  /**
   * Log lead intent/inquiry
   */
  async logLeadIntent(leadData) {
    // This would save to database in production
    return {
      leadLogged: true,
      ...leadData,
      status: 'new_inquiry'
    };
  }

  /**
   * Register custom message handler
   */
  registerMessageHandler(messageType, handlerFunction) {
    this.messageHandlers[messageType] = handlerFunction;
  }

  /**
   * Get message history for a phone number
   */
  getMessageHistory(phoneNumber, limit = 50) {
    return this.messageLog
      .filter(entry => entry.payload.phoneNumber === phoneNumber)
      .slice(-limit)
      .map(entry => ({
        timestamp: entry.timestamp,
        message: entry.payload.message,
        type: entry.payload.messageType,
        fromName: entry.payload.fromName
      }));
  }

  /**
   * Get all recent messages (for dashboard)
   */
  getRecentMessages(limit = 20) {
    return this.messageLog
      .slice(-limit)
      .reverse()
      .map(entry => ({
        timestamp: entry.timestamp,
        phone: entry.payload.phoneNumber,
        name: entry.payload.fromName,
        message: entry.payload.message,
        type: entry.payload.messageType,
        isGroup: entry.payload.isGroup
      }));
  }

  /**
   * Get lead statistics
   */
  getLeadStats() {
    const uniquePhones = new Set();
    const intentMessages = [];

    this.messageLog.forEach(entry => {
      uniquePhones.add(entry.payload.phoneNumber);

      if (entry.payload.message.toLowerCase().includes('interested') ||
          entry.payload.message.toLowerCase().includes('quote')) {
        intentMessages.push(entry);
      }
    });

    return {
      totalMessages: this.messageLog.length,
      uniqueContacts: uniquePhones.size,
      qualifiedLeads: intentMessages.length,
      averageMessagesPerContact: (this.messageLog.length / uniquePhones.size).toFixed(2)
    };
  }
}

module.exports = WhatsAppService;
