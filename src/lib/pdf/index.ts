import { jsPDF } from 'jspdf';
import type { Calculation, PriceConfig } from '@/types';
import { formatDate } from '@/lib/utils';

/** Generate quotation PDF on-demand from estimation calculation and global price configuration. Returns a base64 string. */
export async function generateQuotationPdf(
  calculation: Calculation,
  priceConfig: PriceConfig
): Promise<string> {
  // Use jsPDF inside Node/Server side environment
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Page Dimensions: A4 is 210mm x 297mm
  const marginX = 20;
  let currentY = 25;

  // Helpers
  const addText = (text: string, x: number, y: number, fontSize = 10, isBold = false, color = '#334155') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    // Set color (hex to rgb approximation or default hex)
    if (color === '#ffffff' || color === '#fff') {
      doc.setTextColor(255, 255, 255);
    } else if (color === '#1e293b' || color === '#0f172a') {
      doc.setTextColor(15, 23, 42);
    } else if (color === '#475569' || color === '#64748b') {
      doc.setTextColor(100, 116, 139);
    } else if (color === '#6366f1') {
      doc.setTextColor(99, 102, 241);
    } else {
      doc.setTextColor(51, 65, 85);
    }
    doc.text(text, x, y);
  };

  const drawLine = (y: number, strokeColor = '#e2e8f0', thickness = 0.2) => {
    if (strokeColor === '#cbd5e1') {
      doc.setDrawColor(203, 213, 225);
    } else {
      doc.setDrawColor(226, 232, 240);
    }
    doc.setLineWidth(thickness);
    doc.line(marginX, y, 210 - marginX, y);
  };

  // 1. Header Band (Gradient Accent Panel)
  doc.setFillColor(99, 102, 241); // Indigo color
  doc.rect(0, 0, 210, 15, 'F');
  addText('OFFICIAL PROJECT ESTIMATE', 20, 10, 10, true, '#ffffff');

  // 2. Company Info (Left) vs Quote Meta (Right)
  currentY += 10;
  addText(priceConfig.companyName, marginX, currentY, 16, true, '#1e293b');
  
  // Quote meta right-aligned text helper
  const rightAlignText = (text: string, y: number, fontSize = 10, isBold = false, color = '#334155') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    // Align right at 190mm
    const textWidth = doc.getTextWidth(text);
    addText(text, 190 - textWidth, y, fontSize, isBold, color);
  };

  rightAlignText(`Quotation ID: ${calculation.id}`, currentY, 11, true, '#6366f1');
  
  currentY += 6;
  addText(priceConfig.companyAddress, marginX, currentY, 9, false, '#64748b');
  rightAlignText(`Date Generated: ${formatDate(calculation.createdAt)}`, currentY, 9, false, '#64748b');
  
  currentY += 5;
  addText(`Email: ${priceConfig.companyEmail} | Phone: ${priceConfig.companyPhone}`, marginX, currentY, 9, false, '#64748b');
  
  const validityDate = new Date(calculation.createdAt);
  validityDate.setDate(validityDate.getDate() + priceConfig.quotationValidityDays);
  rightAlignText(`Validity Period: ${priceConfig.quotationValidityDays} Days (till ${formatDate(validityDate)})`, currentY, 9, false, '#64748b');

  // Divider
  currentY += 10;
  drawLine(currentY);

  // 3. Client & Project Details
  currentY += 10;
  addText('PREPARED FOR CLIENT', marginX, currentY, 10, true, '#6366f1');
  addText('PROJECT ESTIMATION SUMMARY', 115, currentY, 10, true, '#6366f1');
  
  currentY += 7;
  addText(`Business Name: ${calculation.businessName}`, marginX, currentY, 10, true, '#1e293b');
  addText(`Industry Sector: ${calculation.industryName}`, 115, currentY, 9, false, '#334155');
  
  currentY += 5;
  addText(`Client Email: ${calculation.businessEmail}`, marginX, currentY, 9, false, '#475569');
  addText(`Website Category: ${calculation.websiteType.toUpperCase()}`, 115, currentY, 9, false, '#334155');
  
  currentY += 5;
  addText(`Client Phone: ${calculation.businessPhone || 'N/A'}`, marginX, currentY, 9, false, '#475569');
  addText(`Pages Configured: ${calculation.pages} unique pages`, 115, currentY, 9, false, '#334155');

  // Divider
  currentY += 10;
  drawLine(currentY);

  // 4. Line Items Grid (TableHeader)
  currentY += 10;
  doc.setFillColor(248, 250, 252);
  doc.rect(marginX, currentY, 170, 8, 'F');
  addText('DESCRIPTION', marginX + 4, currentY + 5.5, 9, true, '#1e293b');
  addText('PRICING MODEL', 110, currentY + 5.5, 9, true, '#1e293b');
  rightAlignText('ESTIMATED COST', currentY + 5.5, 9, true, '#1e293b');

  // Line items loop
  currentY += 8;
  drawLine(currentY, '#cbd5e1', 0.4);

  // Item 1: Package Base Price
  currentY += 8;
  addText(`${calculation.packageName} Package Baseline`, marginX + 4, currentY, 9, true, '#1e293b');
  addText('Fixed (Tier baseline)', 110, currentY, 9, false, '#64748b');
  rightAlignText(calculation.basePrice ? calculation.basePrice.toLocaleString() : '0', currentY, 9, true, '#1e293b');

  // Loop features
  calculation.selectedFeatures.forEach((feat) => {
    currentY += 8;
    addText(feat.featureName, marginX + 4, currentY, 9, false, '#334155');
    
    let rateLabel = 'Fixed';
    if (feat.pricingType === 'per_page') {
      rateLabel = `Per Page rate (${feat.unitPrice}/pg)`;
    } else if (feat.pricingType === 'percentage') {
      rateLabel = `Percentage of Base (${feat.unitPrice}%)`;
    }
    addText(rateLabel, 110, currentY, 9, false, '#64748b');
    rightAlignText(feat.calculatedPrice.toLocaleString(), currentY, 9, false, '#334155');
  });

  currentY += 6;
  drawLine(currentY);

  // 5. Totals panel
  currentY += 8;
  const renderPriceRow = (label: string, value: number, isTotal = false) => {
    addText(label, 110, currentY, 9, isTotal, isTotal ? '#1e293b' : '#64748b');
    rightAlignText(`INR ${value.toLocaleString()}`, currentY, 9, isTotal, isTotal ? '#6366f1' : '#1e293b');
    currentY += 6;
  };

  renderPriceRow('Subtotal', calculation.subtotal);
  if (calculation.rushMarkup && calculation.rushMarkup > 0) {
    renderPriceRow('Rush Processing Charge', calculation.rushMarkup);
  }
  renderPriceRow(`Integrated GST (${priceConfig.gstPercentage}%)`, calculation.gstAmount);
  
  drawLine(currentY, '#cbd5e1', 0.4);
  currentY += 7;
  renderPriceRow('Total Cost Estimate (Gross)', calculation.total, true);

  // 6. Footer Terms & Signature Notes
  currentY += 15;
  addText('TERMS & PROJECT AGREEMENT', marginX, currentY, 10, true, '#6366f1');
  
  currentY += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  
  const termsText = priceConfig.termsAndConditions || '1. All pricing estimations are estimates subject to review.\n2. Invoices are subject to GST registration outlines.\n3. Content and branding assets are to be provided by the client.';
  const lines = doc.splitTextToSize(termsText, 170);
  doc.text(lines, marginX, currentY);

  currentY += (lines.length * 4) + 12;
  addText('Generated dynamically via WebCost Pro quotation engines.', marginX, currentY, 8, false, '#94a3b8');

  // Return base64 string
  const base64Pdf = doc.output('datauristring');
  return base64Pdf;
}
