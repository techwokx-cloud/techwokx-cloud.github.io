#!/bin/bash

# Test Webhook Sender
# Simulates OpenWA webhook messages to test VPS integration without real WhatsApp

VPS_API="https://api.techwokx.online/marketing/api/whatsapp/webhook"

echo "=========================================="
echo "TechWokx WhatsApp Webhook Test"
echo "=========================================="
echo ""

# Test 1: Basic message
echo "[TEST 1] Sending basic text message..."
curl -s -X POST "$VPS_API" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "233123456789",
    "message": "Hi, I am interested in your AI automation services",
    "messageType": "text",
    "fromName": "John Doe",
    "isGroup": false,
    "chatId": "233123456789@c.us"
  }' | jq .

echo ""
echo "✓ Test 1 complete"
echo ""

# Test 2: Quote request
echo "[TEST 2] Sending quote request..."
curl -s -X POST "$VPS_API" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "233987654321",
    "message": "Can you send me a quote for social media management?",
    "messageType": "text",
    "fromName": "Jane Smith",
    "isGroup": false,
    "chatId": "233987654321@c.us"
  }' | jq .

echo ""
echo "✓ Test 2 complete"
echo ""

# Test 3: Group message
echo "[TEST 3] Sending group message..."
curl -s -X POST "$VPS_API" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "233111222333",
    "message": "TechWokx team, this is great!",
    "messageType": "text",
    "fromName": "Alex Johnson",
    "isGroup": true,
    "chatId": "120363143123456789-1234567890@g.us"
  }' | jq .

echo ""
echo "✓ Test 3 complete"
echo ""

# Test 4: Generic inquiry
echo "[TEST 4] Sending generic inquiry..."
curl -s -X POST "$VPS_API" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "233444555666",
    "message": "What services do you offer?",
    "messageType": "text",
    "fromName": "Mike Chen",
    "isGroup": false,
    "chatId": "233444555666@c.us"
  }' | jq .

echo ""
echo "✓ Test 4 complete"
echo ""

# Check stats
echo "[CHECK] Getting WhatsApp statistics..."
echo ""
curl -s https://api.techwokx.online/marketing/api/whatsapp/stats | jq .

echo ""
echo "=========================================="
echo "Webhook Tests Complete! ✅"
echo "=========================================="
echo ""
echo "Next: Check VPS logs"
echo "  docker-compose -p techwokx logs -f marketing | grep whatsapp"
echo ""
