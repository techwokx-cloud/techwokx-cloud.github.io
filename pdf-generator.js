const PDFDocument = require("pdfkit");

const LEVEL_COLOR = { HIGH: "#dc2626", MEDIUM: "#d97706", LOW: "#64748b" };

function buildScanReportPdf({ businessName, websiteUrl, score, opportunities, businessCase }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
    });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header
    doc.fontSize(11).fillColor("#7c3aed").text("AI READINESS REPORT", { characterSpacing: 1 });
    doc.moveDown(0.3);
    doc.fontSize(22).fillColor("#1a1a2e").text(businessName, { continued: false });
    doc.fontSize(11).fillColor("#64748b").text(websiteUrl);
    doc.moveDown(1);

    // Score
    const scoreY = doc.y;
    doc.fontSize(48).fillColor("#1a1a2e").text(String(score), 60, scoreY, { continued: false });
    const scoreWidth = doc.widthOfString(String(score));
    doc.fontSize(16).fillColor("#94a3b8").text(" / 100", 60 + scoreWidth + 4, scoreY + 28);
    doc.y = scoreY + 60; // explicit gap below the large score number, avoids overlap
    doc.moveDown(0.5);

    if (businessCase?.summary) {
      doc.fontSize(11).fillColor("#334155").text(businessCase.summary, { width: 480 });
      doc.moveDown(1);
    }

    // Opportunity areas
    doc.fontSize(14).fillColor("#1a1a2e").text("Opportunity Areas");
    doc.moveDown(0.5);
    opportunities.forEach((o) => {
      doc
        .fontSize(11)
        .fillColor("#1a1a2e")
        .text(o.area, { continued: true, width: 480 })
        .fillColor(LEVEL_COLOR[o.level] || "#64748b")
        .text(`  ${o.level}`, { continued: false });
      doc.fontSize(10).fillColor("#64748b").text(o.reason, { width: 480 });
      doc.moveDown(0.4);
    });
    doc.moveDown(0.5);

    // Recommended package
    if (businessCase?.recommendedPackage) {
      const pkg = businessCase.recommendedPackage;
      doc.fontSize(14).fillColor("#1a1a2e").text("Recommended Package");
      doc.moveDown(0.3);
      doc
        .fontSize(11)
        .fillColor("#1a1a2e")
        .text(`${pkg.name} — ${pkg.price} (${pkg.period})`, { width: 480 });
      if (businessCase.estimatedTimeline) {
        doc.fontSize(10).fillColor("#64748b").text(`Estimated timeline: ${businessCase.estimatedTimeline}`);
      }
      doc.moveDown(1);
    }

    // Projected outcomes
    if (businessCase?.projectedOutcomes?.length) {
      doc.fontSize(14).fillColor("#1a1a2e").text("What This Means For You");
      doc.moveDown(0.3);
      businessCase.projectedOutcomes.forEach((outcome) => {
        doc.fontSize(10).fillColor("#334155").text(`•  ${outcome}`, { width: 480 });
      });
      doc.moveDown(1);
    }

    // Footer
    doc.moveDown(2);
    doc
      .fontSize(9)
      .fillColor("#94a3b8")
      .text("TechWokx AI Solutions  |  hello@techwokx.com  |  techwokx.online");

    doc.end();
  });
}

module.exports = { buildScanReportPdf };
