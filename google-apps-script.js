/**
 * TechWokx Ghana — Google Apps Script
 * Paste this into: script.google.com → New Project
 * Connect to your Google Form via: Triggers → On Form Submit
 * 
 * This script:
 * 1. Reads audit form responses
 * 2. Calculates RED/ORANGE/GREEN score
 * 3. Sends personalised report to client email
 * 4. Sends full technical report to hello@techwokx.online
 */

function onFormSubmit(e) {
  const responses = e.values; // Array of form response values
  
  // COLUMN MAPPING — adjust indexes to match your Google Form column order
  const timestamp   = responses[0];
  const bizName     = responses[1] || 'Unknown Business';
  const contactName = responses[2] || 'Client';
  const clientEmail = responses[3];
  const phone       = responses[4] || '';
  const staffCount  = responses[5] || '';
  const industry    = responses[6] || '';
  
  // AUDIT ANSWERS (adjust column indexes)
  const emailType       = responses[7] || '';  // Step 1
  const formerAccess    = responses[8] || '';  // Step 2
  const signatures      = responses[9] || '';  // Step 3
  const deliverability  = responses[10] || ''; // Step 4
  
  // SCORING
  let score = 0;
  
  // Email type scoring (max 20)
  if (emailType.includes('Professional Domain')) score += 20;
  else if (emailType.includes('Google Workspace') || emailType.includes('Microsoft')) score += 10;
  else if (emailType.includes('Not Sure')) score += 3;
  else score += 0; // Gmail/Yahoo = 0
  
  // Former access scoring (max 20)
  if (formerAccess.includes('No') && formerAccess.includes('immediately')) score += 20;
  else if (formerAccess.includes('Sometimes')) score += 6;
  else score += 0; // Yes or don't know = 0
  
  // Signatures scoring (max 20)
  if (signatures.includes('Yes') && signatures.includes('all')) score += 20;
  else if (signatures.includes('Some')) score += 8;
  else score += 0;
  
  // Deliverability scoring (max 20)
  if (deliverability.includes('Never')) score += 20;
  else if (deliverability.includes('Occasionally')) score += 8;
  else score += 0;
  
  const maxScore = 80;
  const pct = Math.round((score / maxScore) * 100);
  
  // DETERMINE STATUS
  let status, statusEmoji, pkg, price, pkgDesc, recs;
  
  if (pct < 40) {
    status = 'CRITICAL RISK';
    statusEmoji = '🔴';
    pkg = 'Full Brand & Systems Reset';
    price = '₵3,950';
    pkgDesc = 'Email system cleanup, access control, security setup, signature standardisation, and documentation.';
    recs = [
      'Email security records not configured — messages likely going to spam',
      'Former staff access risk detected — immediate review and removal required',
      'Inconsistent or absent professional email signatures across staff'
    ];
  } else if (pct < 70) {
    status = 'MODERATE RISK';
    statusEmoji = '🟠';
    pkg = 'Email & Brand Systems Setup';
    price = '₵2,450';
    pkgDesc = 'Signature standardisation, access review, email cleanup and optimisation.';
    recs = [
      'Partial email security — some messages may not reach clients reliably',
      'Access control gaps that will grow as your team changes',
      'Inconsistent branding across staff email communication'
    ];
  } else {
    status = 'STABLE';
    statusEmoji = '🟢';
    pkg = 'Optimisation & Cleanup';
    price = '₵1,250';
    pkgDesc = 'Signature polish, inbox cleanup, minor access improvements.';
    recs = [
      'Good foundation — minor optimisations will improve reliability',
      'Periodic reviews recommended to maintain standards',
      'Small branding consistency improvements available'
    ];
  }
  
  // SEND CLIENT EMAIL
  if (clientEmail) {
    const clientSubject = `${statusEmoji} Your TechWokx Email Audit Result — ${status}`;
    const clientBody = `
Hello ${contactName},

Thank you for completing the TechWokx Business Email Risk Audit.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR AUDIT RESULT: ${statusEmoji} ${status}
Score: ${score} / ${maxScore} (${pct}%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY FINDINGS:
• ${recs[0]}
• ${recs[1]}
• ${recs[2]}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDED SERVICE: ${pkg}
Investment: ${price}
${pkgDesc}
━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT STEPS:
Reply to this email with YES and our team will contact you within 4 hours to walk you through the recommended solution and timeline.

No obligation. No hard sell.

Best regards,
George Jabley
Founder & IT Operations Lead
TechWokx Ghana — Intelligent Solutions. Secure Futures.

📞 +233 264 375 628
📱 WhatsApp: +233 555 087 407
✉️ hello@techwokx.online
🌐 techwokx.online
`;
    
    GmailApp.sendEmail(clientEmail, clientSubject, clientBody);
  }
  
  // SEND INTERNAL TECHNICAL REPORT
  const internalSubject = `[${statusEmoji} ${status}] New Audit Lead — ${bizName}`;
  const internalBody = `
NEW AUDIT SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━

BUSINESS: ${bizName}
CONTACT: ${contactName}
EMAIL: ${clientEmail}
PHONE: ${phone}
STAFF: ${staffCount}
INDUSTRY: ${industry}
SUBMITTED: ${timestamp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
RISK STATUS: ${statusEmoji} ${status}
SCORE: ${score} / ${maxScore} (${pct}%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANSWERS:
• Email Type: ${emailType}
• Former Staff Access: ${formerAccess}
• Email Signatures: ${signatures}
• Deliverability Issues: ${deliverability}

RECOMMENDED PACKAGE: ${pkg}
PRICE: ${price}

ACTION REQUIRED:
Priority: ${pct < 40 ? 'HIGH — Contact within 24 hours' : pct < 70 ? 'MEDIUM — Contact within 48 hours' : 'LOW — Add to nurture sequence'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
TechWokx Dashboard: https://techwokx.online/dashboard.html
`;
  
  GmailApp.sendEmail('hello@techwokx.online', internalSubject, internalBody);
}

/**
 * SETUP INSTRUCTIONS:
 * 1. Go to script.google.com → New Project
 * 2. Paste this entire script
 * 3. Click Save (Ctrl+S)
 * 4. Click Triggers (clock icon) → Add Trigger
 * 5. Function: onFormSubmit
 * 6. Event source: From spreadsheet
 * 7. Event type: On form submit
 * 8. Save → Authorise with your Google account
 * 
 * Make sure your Google Form is linked to a Google Sheet.
 * The column indexes (responses[0], responses[1] etc.) must match
 * the order of questions in your form.
 */
