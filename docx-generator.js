const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  BorderStyle,
  AlignmentType,
} = require("docx");

const REAL_PRICING = [
  {
    name: "AI Assistant",
    price: "$79 one-time",
    fit: "Businesses wanting a website assistant that captures leads and answers questions 24/7.",
  },
  {
    name: "AI Business",
    price: "$199 one-time",
    fit: "Businesses that also want AI-qualified leads, CRM integration, and advanced analytics.",
  },
  {
    name: "AI Business Platform",
    price: "Custom quote",
    fit: "Businesses wanting full automation: support agent, booking agent, custom workflows.",
  },
];

function cell(text, { bold = false, shade = null, width } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: shade ? { type: ShadingType.CLEAR, fill: shade } : undefined,
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold })],
      }),
    ],
  });
}

function buildActionPlanDocx({
  businessName,
  websiteUrl,
  score,
  opportunities,
  businessCase,
  goal,
}) {
  const highOpp = opportunities.filter((o) => o.level === "HIGH");
  const recommendation = highOpp[0] || opportunities[0];

  const currentStateRows = opportunities.map((o) =>
    new TableRow({
      children: [cell(o.area, { width: 5000 }), cell(o.level, { width: 3000 })],
    })
  );

  const pricingRows = REAL_PRICING.map((tier) =>
    new TableRow({
      children: [
        cell(tier.name, { width: 2800, bold: true }),
        cell(tier.price, { width: 2200 }),
        cell(tier.fit, { width: 5000 }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: { size: { width: 12240, height: 15840 } }, // US Letter
        },
        children: [
          new Paragraph({
            text: "TechWokx AI Action Plan",
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `For: ${businessName}`, bold: true }),
              new TextRun({ text: `  |  ${websiteUrl}`, color: "666666" }),
            ],
            spacing: { after: 300 },
          }),

          new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
          new Paragraph({
            children: [
              new TextRun(
                `Your website scores ${score}/100 on AI Readiness. `
              ),
              new TextRun({
                text: `The highest-value opportunity is ${recommendation.area}`,
                bold: true,
              }),
              new TextRun(` — ${recommendation.reason}`),
            ],
            spacing: { after: 200 },
          }),
          ...(goal
            ? [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Stated goal: ", bold: true }),
                    new TextRun(goal),
                  ],
                  spacing: { after: 300 },
                }),
              ]
            : []),

          new Paragraph({ text: "Current State", heading: HeadingLevel.HEADING_1 }),
          new Table({
            width: { size: 8000, type: WidthType.DXA },
            columnWidths: [5000, 3000],
            rows: [
              new TableRow({
                children: [
                  cell("Opportunity Area", { width: 5000, bold: true, shade: "F5F3FF" }),
                  cell("Priority", { width: 3000, bold: true, shade: "F5F3FF" }),
                ],
              }),
              ...currentStateRows,
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 200 } }),
          new Paragraph({ text: "Recommended First Move", heading: HeadingLevel.HEADING_1 }),
          new Paragraph({
            children: [new TextRun({ text: recommendation.area, bold: true })],
            spacing: { after: 100 },
          }),
          new Paragraph({ text: recommendation.reason, spacing: { after: 200 } }),

          new Paragraph({ text: "What This Means For You", heading: HeadingLevel.HEADING_1 }),
          ...(businessCase?.projectedOutcomes || []).map(
            (outcome) =>
              new Paragraph({
                text: outcome,
                bullet: { level: 0 },
                spacing: { after: 80 },
              })
          ),

          new Paragraph({ text: "", spacing: { after: 100 } }),
          new Paragraph({ text: "Course of Action", heading: HeadingLevel.HEADING_1 }),
          ...(businessCase?.courseOfAction || []).map(
            (action, i) =>
              new Paragraph({
                text: `${i + 1}. ${action}`,
                spacing: { after: 80 },
              })
          ),

          new Paragraph({ text: "", spacing: { after: 200 } }),
          new Paragraph({ text: "Investment & Pricing", heading: HeadingLevel.HEADING_1 }),
          new Table({
            width: { size: 10000, type: WidthType.DXA },
            columnWidths: [2800, 2200, 5000],
            rows: [
              new TableRow({
                children: [
                  cell("Option", { width: 2800, bold: true, shade: "F5F3FF" }),
                  cell("Price", { width: 2200, bold: true, shade: "F5F3FF" }),
                  cell("Best For", { width: 5000, bold: true, shade: "F5F3FF" }),
                ],
              }),
              ...pricingRows,
            ],
          }),
          new Paragraph({
            text: "One-time project fee. No long-term contracts. Start with AI Assistant and scale up later if it's working.",
            spacing: { before: 150, after: 300 },
          }),

          new Paragraph({ text: "Next Steps", heading: HeadingLevel.HEADING_1 }),
          new Paragraph({
            text: "Reply to the email this was attached to, or reach out on WhatsApp, and we'll walk through this plan together — no obligation.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "TechWokx AI Solutions", bold: true }),
              new TextRun({ text: "  |  hello@techwokx.com  |  techwokx.online" }),
            ],
          }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

module.exports = { buildActionPlanDocx };
