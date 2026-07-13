import { jsPDF } from 'jspdf';
import type { Calculation, PriceConfig } from '@/types';
import { formatDate } from '@/lib/utils';
import { getPackageById } from '@/lib/packages';

/** Generate quotation PDF on-demand from estimation calculation and global price configuration. Returns a base64 string. */
export async function generateQuotationPdf(
  calculation: Calculation,
  priceConfig: PriceConfig
): Promise<string> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Try to lookup package dynamically to obtain pages included
  const selectedPkg = await getPackageById(calculation.packageId);
  const pagesIncluded = selectedPkg ? selectedPkg.pagesIncluded : 5;

  // Formatting helper for Indian Rupee/INR in PDF
  const formatPdfCurrency = (value: number) => {
    return `Rs. ${value.toLocaleString('en-IN')}`;
  };

  // Custom alignment helper with themed colors
  const addText = (
    text: string, 
    x: number, 
    y: number, 
    fontSize = 10, 
    isBold = false, 
    color: 'primary' | 'secondary' | 'dark' | 'light' | 'muted' = 'dark',
    align: 'left' | 'right' | 'center' = 'left'
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    if (color === 'primary') {
      doc.setTextColor(27, 107, 74); // #1B6B4A
    } else if (color === 'secondary') {
      doc.setTextColor(51, 65, 85); // slate-700
    } else if (color === 'muted') {
      doc.setTextColor(100, 116, 139); // slate-500
    } else if (color === 'light') {
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setTextColor(15, 23, 42); // slate-900
    }
    doc.text(text, x, y, { align });
  };

  // 1. Decorative Brand Border (Top & Left Edge Accent)
  doc.setFillColor(27, 107, 74); // Brand Green
  doc.rect(0, 0, 210, 4, 'F');
  doc.setFillColor(240, 253, 244); // Light tint green background on left margin accent
  doc.rect(0, 4, 6, 293, 'F');
  doc.setFillColor(27, 107, 74);
  doc.rect(0, 4, 1.5, 293, 'F'); // Dark green left border line

  // 2. Document Title and Corporate Header
  addText(priceConfig.companyName || 'AdaptWeb HQ', 20, 18, 16, true, 'primary');
  addText('ENTERPRISE WEB SOLUTIONS & APPS', 20, 23, 7.5, false, 'secondary');

  addText('OFFICIAL ESTIMATE', 190, 18, 14, true, 'dark', 'right');
  
  // Ref ID Badge Background
  doc.setFillColor(240, 253, 244);
  doc.rect(142, 21.5, 48, 5.5, 'F');
  doc.setDrawColor(27, 107, 74);
  doc.setLineWidth(0.2);
  doc.rect(142, 21.5, 48, 5.5, 'D');
  addText(`Ref ID: ${calculation.id.substring(0, 14).toUpperCase()}`, 188, 25.5, 7.5, true, 'primary', 'right');

  // Divider line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.line(20, 29.5, 190, 29.5);

  // 3. Three-column Metadata Block with Left Accents
  let currentY = 37;
  
  // Col 1: Provider
  doc.setFillColor(27, 107, 74);
  doc.rect(20, currentY - 1, 1, 19, 'F'); // Left vertical green bar
  addText('SERVICE PROVIDER', 24, currentY, 7.5, true, 'primary');
  addText(priceConfig.companyName, 24, currentY + 5, 9.5, true, 'dark');
  addText(priceConfig.companyAddress || 'Bangalore, Karnataka', 24, currentY + 9, 7.5, false, 'secondary');
  addText(`Email: ${priceConfig.companyEmail}`, 24, currentY + 13, 7.5, false, 'secondary');
  addText(`Phone: ${priceConfig.companyPhone}`, 24, currentY + 17, 7.5, false, 'secondary');

  // Col 2: Client
  doc.setFillColor(27, 107, 74);
  doc.rect(90, currentY - 1, 1, 19, 'F'); // Left vertical green bar
  addText('PREPARED FOR CLIENT', 94, currentY, 7.5, true, 'primary');
  addText(calculation.businessName, 94, currentY + 5, 9.5, true, 'dark');
  addText(`Email: ${calculation.businessEmail}`, 94, currentY + 9, 7.5, false, 'secondary');
  addText(`Phone: ${calculation.businessPhone || 'N/A'}`, 94, currentY + 13, 7.5, false, 'secondary');

  // Col 3: Details
  doc.setFillColor(27, 107, 74);
  doc.rect(150, currentY - 1, 1, 19, 'F'); // Left vertical green bar
  addText('ESTIMATE DETAILS', 154, currentY, 7.5, true, 'primary');
  addText(`Date: ${formatDate(calculation.createdAt)}`, 154, currentY + 5, 8, false, 'dark');
  
  const validityDate = new Date(calculation.createdAt);
  validityDate.setDate(validityDate.getDate() + priceConfig.quotationValidityDays);
  addText(`Expires: ${formatDate(validityDate)}`, 154, currentY + 9, 8, false, 'dark');
  addText('Status: Active Quotation', 154, currentY + 13, 8, true, 'primary');

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 62, 190, 62);

  // 4. Project Parameter Highlights (Styled grid card)
  doc.setFillColor(248, 250, 252); // Very soft gray/blue (slate-50)
  doc.rect(20, 66, 170, 17, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(20, 66, 170, 17, 'D'); // border

  addText('WEBSITE ARCHITECTURE', 24, 71, 7, true, 'muted');
  addText(calculation.websiteType.toUpperCase(), 24, 76.5, 9, true, 'dark');

  addText('INDUSTRY SECTOR', 70, 71, 7, true, 'muted');
  addText(calculation.industryName, 70, 76.5, 9, true, 'dark');

  addText('ESTIMATE TIER', 120, 71, 7, true, 'muted');
  addText(calculation.packageName, 120, 76.5, 9, true, 'dark');

  addText('TOTAL PAGES', 160, 71, 7, true, 'muted');
  addText(`${calculation.pages} Pages`, 160, 76.5, 9, true, 'dark');

  // 5. Line Items Table (Boxed Grid Layout with Zebra Rows)
  currentY = 91;
  const headerHeight = 9;
  
  // Table Header Row
  doc.setFillColor(27, 107, 74); // Brand Green Header
  doc.rect(20, currentY, 170, headerHeight, 'F');
  addText('DESCRIPTION', 24, currentY + 6, 8.5, true, 'light');
  addText('BILLING MODEL', 115, currentY + 6, 8.5, true, 'light');
  addText('INVESTMENT COST', 186, currentY + 6, 8.5, true, 'light', 'right');

  let itemY = currentY + headerHeight;
  const rowHeight = 8.5;

  const drawRowBackground = (y: number, index: number) => {
    // Zebra striping: alternate slate-50 background for odd index rows
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20.2, y, 169.6, rowHeight, 'F');
    }
  };

  const drawRowDivider = (y: number) => {
    doc.setDrawColor(241, 245, 249); // slate-100
    doc.setLineWidth(0.2);
    doc.line(20, y + rowHeight, 190, y + rowHeight);
  };

  // Row 0: Base Package
  drawRowBackground(itemY, 0);
  addText(`${calculation.packageName} Package Baseline`, 24, itemY + 5.5, 8.5, true, 'dark');
  addText(`Fixed Base Tier (Includes ${pagesIncluded} pages)`, 115, itemY + 5.5, 8, false, 'secondary');
  addText(formatPdfCurrency(calculation.basePrice || 0), 186, itemY + 5.5, 8.5, true, 'dark', 'right');
  drawRowDivider(itemY);
  itemY += rowHeight;

  // Row 1+: Dynamic selected features
  calculation.selectedFeatures.forEach((feat, index) => {
    drawRowBackground(itemY, index + 1);
    addText(feat.featureName, 24, itemY + 5.5, 8.5, false, 'dark');

    let rateLabel = 'Fixed Integration';
    if (feat.featureId === 'feat-extra-page') {
      const extraPagesCount = Math.max(0, calculation.pages - pagesIncluded);
      rateLabel = `Page Increment (x${extraPagesCount})`;
    } else if (feat.pricingType === 'per_page') {
      rateLabel = `Per-Page Dynamic`;
    } else if (feat.pricingType === 'percentage') {
      rateLabel = `${feat.unitPrice}% of Package Base`;
    }

    addText(rateLabel, 115, itemY + 5.5, 8, false, 'secondary');
    addText(formatPdfCurrency(feat.calculatedPrice || 0), 186, itemY + 5.5, 8.5, false, 'dark', 'right');
    drawRowDivider(itemY);
    itemY += rowHeight;
  });

  const tableBottomY = itemY;

  // Draw outline box for the table to complete grid design
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.35);
  doc.rect(20, currentY, 170, tableBottomY - currentY, 'D');

  // 6. Totals Panel
  let totalY = tableBottomY + 7;
  const totalRowHeight = 5.5;

  const addTotalRow = (label: string, value: string | number, isFinal = false) => {
    const formattedVal = typeof value === 'number' ? formatPdfCurrency(value) : value;

    if (isFinal) {
      totalY += 2;
      // Highlight total box
      doc.setFillColor(240, 253, 244); // Light brand green
      doc.rect(100, totalY - 4.5, 90, 9.5, 'F');
      doc.setDrawColor(27, 107, 74);
      doc.setLineWidth(0.4);
      doc.rect(100, totalY - 4.5, 90, 9.5, 'D'); // Solid outline
      
      addText(label, 104, totalY + 1.5, 9, true, 'primary');
      addText(formattedVal, 186, totalY + 1.5, 11, true, 'primary', 'right');
      totalY += 9.5;
    } else {
      addText(label, 104, totalY, 8.5, false, 'secondary');
      addText(formattedVal, 186, totalY, 8.5, true, 'dark', 'right');
      totalY += totalRowHeight;
    }
  };

  addTotalRow('Subtotal Investment', calculation.subtotal);
  if (calculation.rushMarkup && calculation.rushMarkup > 0) {
    addTotalRow(`Rush Delivery Markup (${priceConfig.rushDeliveryPercentage}%)`, calculation.rushMarkup);
  }
  addTotalRow(`GST (${priceConfig.gstPercentage}%)`, calculation.gstAmount);

  // Divide line before final total
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(100, totalY - 1, 190, totalY - 1);
  totalY += 2.5;

  addTotalRow('Total Estimate (Inclusive of GST)', calculation.total, true);

  // 7. Terms & Project Agreement Card
  let bottomY = totalY + 6;
  
  // Wrap Terms & Project Agreement in a light bordered container
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(241, 245, 249);
  doc.rect(20, bottomY - 1, 170, 23, 'F');
  doc.rect(20, bottomY - 1, 170, 23, 'D');

  addText('TERMS & PROJECT AGREEMENT', 23, bottomY + 3.5, 7.5, true, 'primary');

  const termsText = priceConfig.termsAndConditions || '1. All pricing estimations are estimates subject to review.\n2. Invoices are subject to GST registration outlines.\n3. Content and branding assets are to be provided by the client.';
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // slate-500
  const lines = doc.splitTextToSize(termsText, 164);
  doc.text(lines, 23, bottomY + 8);

  bottomY += 27;

  // Signatures sign-off block
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.4);

  // Left Line (Client)
  doc.line(20, bottomY + 12, 75, bottomY + 12);
  addText('CLIENT SIGN-OFF', 20, bottomY + 16, 7.5, true, 'secondary');
  addText('Name / Title / Date Signature', 20, bottomY + 19.5, 6.5, false, 'muted');

  // Right Line (Consultant)
  doc.line(135, bottomY + 12, 190, bottomY + 12);
  addText('AUTHORIZED SIGNATURE', 135, bottomY + 16, 7.5, true, 'primary');
  addText(priceConfig.companyName, 135, bottomY + 19.5, 6.5, false, 'muted');

  // Footer Watermark & Security Stamp
  doc.setDrawColor(240, 253, 244);
  doc.line(20, 282, 190, 282);
  addText(`Issued dynamically via ${priceConfig.companyName} Automated Estimate Desk.`, 105, 287, 7, false, 'muted', 'center');

  // Return base64 string
  const base64Pdf = doc.output('datauristring');
  return base64Pdf;
}
