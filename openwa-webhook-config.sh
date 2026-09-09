#!/bin/bash

# OpenWA Webhook Configuration Script
# Connects local OpenWA instance to TechWokx VPS API

set -e

echo "=========================================="
echo "OpenWA → TechWokx VPS Webhook Setup"
echo "=========================================="
echo ""

# Check ngrok tunnel
echo "[1/3] Checking ngrok tunnel..."
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'https://[^"]*' | head -1)

if [ -z "$NGROK_URL" ]; then
  echo "⚠️  ngrok not detected on localhost:4040"
  echo ""
  echo "Start ngrok in another terminal:"
  echo "  ngrok http 2886"
  echo ""
  echo "Then run this script again."
  exit 1
fi

echo "✓ ngrok tunnel found: $NGROK_URL"
echo ""

# Check OpenWA API
echo "[2/3] Checking OpenWA API..."
if curl -s http://localhost:2886/api/version &> /dev/null; then
  echo "✓ OpenWA running on localhost:2886"
else
  echo "✗ OpenWA not responding on localhost:2886"
  echo "Start OpenWA first: npm run dev"
  exit 1
fi
echo ""

# Configure webhook
echo "[3/3] Configuring webhook..."
echo ""
echo "Webhook Configuration:"
echo "  URL: https://api.techwokx.online/marketing/api/whatsapp/webhook"
echo "  Events: message, message_sent, chat_opened, contact_added"
echo ""

# Test webhook configuration
echo "Testing webhook endpoint..."
WEBHOOK_TEST=$(curl -s -X POST https://api.techwokx.online/marketing/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "test",
    "message": "webhook test",
    "messageType": "text",
    "fromName": "Test",
    "isGroup": false,
    "chatId": "test@c.us"
  }' 2>/dev/null || echo "error")

if [ "$WEBHOOK_TEST" != "error" ]; then
  echo "✓ Webhook endpoint is reachable"
else
  echo "⚠️  Could not reach webhook endpoint"
  echo "Verify VPS is running and API is accessible"
fi

echo ""
echo "=========================================="
echo "Setup Complete! ✅"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Open OpenWA Dashboard:"
echo "   http://localhost:2886"
echo ""
echo "2. Go to Settings → Webhooks"
echo ""
echo "3. Add webhook:"
echo "   https://api.techwokx.online/marketing/api/whatsapp/webhook"
echo ""
echo "4. Enable these events:"
echo "   ✓ Message received"
echo "   ✓ Message sent"
echo "   ✓ Chat opened"
echo "   ✓ Contact added"
echo ""
echo "5. Send a test message to your WhatsApp"
echo ""
echo "6. Check logs:"
echo "   docker-compose -p techwokx logs -f marketing"
echo ""
echo "7. View stats:"
echo "   curl https://api.techwokx.online/marketing/api/whatsapp/stats | jq"
echo ""
