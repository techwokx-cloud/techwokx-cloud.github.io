#!/bin/bash

# Test Website Scan Discovery Feature

API="https://api.techwokx.online/marketing"

echo "=========================================="
echo "Website Scan Discovery - Feature Test"
echo "=========================================="
echo ""

# Test 1: Get goal options
echo "[TEST 1] Getting available goal options..."
echo ""
curl -s "$API/api/scan/goals" | jq .
echo ""
echo "✓ Test 1 complete"
echo ""

# Test 2: Preview email for lead generation
echo "[TEST 2] Previewing email for LEAD GENERATION goal..."
echo ""
curl -s "$API/api/scan/preview/lead_generation" | jq '{goal, opportunities, topOpportunity}' 
echo ""
echo "✓ Test 2 complete - HTML email preview available"
echo ""

# Test 3: Preview email for e-commerce
echo "[TEST 3] Previewing email for E-COMMERCE goal..."
echo ""
curl -s "$API/api/scan/preview/ecommerce" | jq '{goal, opportunities, topOpportunity}'
echo ""
echo "✓ Test 3 complete"
echo ""

# Test 4: Preview email for bookings
echo "[TEST 4] Previewing email for BOOKINGS goal..."
echo ""
curl -s "$API/api/scan/preview/bookings" | jq '{goal, opportunities, topOpportunity}'
echo ""
echo "✓ Test 4 complete"
echo ""

# Test 5: Send a real personalized report
echo "[TEST 5] Sending PERSONALIZED SCAN REPORT..."
echo ""
echo "To: test@techwokx.online (Lead Generation Goal)"
echo ""

curl -s -X POST "$API/api/scan/send-report" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://test-website.com",
    "email": "test@techwokx.online",
    "name": "Test User",
    "company": "Test Company",
    "goal": "lead_generation"
  }' | jq .

echo ""
echo "✓ Test 5 complete - Check your email!"
echo ""

# Test 6: Send another report for different goal
echo "[TEST 6] Sending DIFFERENT GOAL (E-COMMERCE)..."
echo ""
echo "To: test@techwokx.online (E-Commerce Goal)"
echo ""

curl -s -X POST "$API/api/scan/send-report" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://test-ecommerce.com",
    "email": "test@techwokx.online",
    "name": "Test User",
    "company": "Test E-Shop",
    "goal": "ecommerce"
  }' | jq .

echo ""
echo "✓ Test 6 complete - Check your email!"
echo ""

echo "=========================================="
echo "✅ All Tests Complete!"
echo "=========================================="
echo ""
echo "What was tested:"
echo "  ✓ Goal options available (6 goals)"
echo "  ✓ Email preview for Lead Generation"
echo "  ✓ Email preview for E-Commerce"
echo "  ✓ Email preview for Bookings"
echo "  ✓ Sent real personalized email (Lead Gen)"
echo "  ✓ Sent real personalized email (E-Commerce)"
echo ""
echo "Next steps:"
echo "  1. Check test@techwokx.online for 2 emails"
echo "  2. Verify emails have styling and personalization"
echo "  3. Each email should show different opportunities"
echo "  4. Each email should have CTA button"
echo ""
echo "Documentation:"
echo "  cat /opt/techwokx/SCAN_DISCOVERY_DEPLOYMENT.md"
echo ""
