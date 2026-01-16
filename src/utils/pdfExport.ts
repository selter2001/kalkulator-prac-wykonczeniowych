import jsPDF from 'jspdf';
import { Room, WorkType, VatRate, WorkTypeUnit } from '@/types/calculator';

export type PdfFormat = 'standard' | 'table';

interface ExportData {
  rooms: Room[];
  vatRate: VatRate | number;
  calculateRoomTotal: (room: Room) => number;
  getWorkTypeQuantity: (room: Room, workType: WorkType) => number;
  grandTotal: number;
  grossTotal: number;
  preparedBy?: string;
  quoteName?: string;
  format?: PdfFormat;
}

const FONT_REGULAR_URL = '/fonts/NotoSans-Regular.ttf';
const FONT_BOLD_URL = '/fonts/NotoSans-Bold.ttf';

type PdfFonts = {
  regular: string;
  bold: string;
};

let fontsPromise: Promise<PdfFonts> | null = null;

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 2048;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const sub = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...Array.from(sub));
  }

  return btoa(binary);
};

const loadFonts = async (): Promise<PdfFonts> => {
  if (fontsPromise) return fontsPromise;

  fontsPromise = (async () => {
    const [regularRes, boldRes] = await Promise.all([
      fetch(FONT_REGULAR_URL),
      fetch(FONT_BOLD_URL),
    ]);

    if (!regularRes.ok || !boldRes.ok) {
      throw new Error('Nie udało się pobrać czcionek do eksportu PDF.');
    }

    const [regularBuf, boldBuf] = await Promise.all([
      regularRes.arrayBuffer(),
      boldRes.arrayBuffer(),
    ]);

    return {
      regular: arrayBufferToBase64(regularBuf),
      bold: arrayBufferToBase64(boldBuf),
    };
  })();

  return fontsPromise;
};

const applyFonts = async (doc: jsPDF) => {
  const { regular, bold } = await loadFonts();
  const anyDoc = doc as any;

  anyDoc.addFileToVFS('NotoSans-Regular.ttf', regular);
  anyDoc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');

  anyDoc.addFileToVFS('NotoSans-Bold.ttf', bold);
  anyDoc.addFont('NotoSans-Bold.ttf', 'NotoSans', 'bold');

  doc.setFont('NotoSans', 'normal');
};

const formatUnit = (unit: WorkTypeUnit) =>
  unit === 'm2' ? 'm²' : unit === 'szt' ? 'szt.' : 'mb';

const formatPriceUnit = (unit: WorkTypeUnit) =>
  unit === 'm2' ? 'zł/m²' : unit === 'szt' ? 'zł/szt.' : 'zł/mb';

// ================== STANDARD FORMAT ==================

const generateStandardPdf = async (data: ExportData): Promise<jsPDF> => {
  const {
    rooms,
    vatRate,
    calculateRoomTotal,
    getWorkTypeQuantity,
    grandTotal,
    grossTotal,
    preparedBy,
    quoteName,
  } = data;

  const doc = new jsPDF();
  await applyFonts(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const checkPageBreak = (requiredSpace: number) => {
    if (y + requiredSpace > 280) {
      doc.addPage();
      y = 20;
    }
  };

  // Header
  doc.setFontSize(20);
  doc.setFont('NotoSans', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('WYCENA PRAC WYKOŃCZENIOWYCH', pageWidth / 2, y, { align: 'center' });

  if (quoteName) {
    y += 8;
    doc.setFontSize(12);
    doc.setFont('NotoSans', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(quoteName, pageWidth / 2, y, { align: 'center' });
  }

  y += 10;
  doc.setFontSize(10);
  doc.setFont('NotoSans', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Data: ${new Date().toLocaleDateString('pl-PL')}`, pageWidth / 2, y, { align: 'center' });

  if (preparedBy) {
    y += 6;
    doc.text(preparedBy, pageWidth / 2, y, { align: 'center' });
  }

  y += 8;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, y, pageWidth - 15, y);
  y += 12;

  // Rooms
  rooms.forEach((room, roomIndex) => {
    checkPageBreak(60);

    doc.setFontSize(14);
    doc.setFont('NotoSans', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text(`${roomIndex + 1}. ${room.name}`, 15, y);
    y += 7;

    doc.setFontSize(10);
    doc.setFont('NotoSans', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Powierzchnia netto: ${room.netArea.toFixed(2)} m²`, 20, y);
    y += 5;

    if (room.totalCorners > 0) {
      doc.text(`Narożniki: ${room.totalCorners.toFixed(2)} mb`, 20, y);
      y += 5;
    }
    if (room.totalGrooves > 0) {
      doc.text(`Bruzdy: ${room.totalGrooves.toFixed(2)} mb`, 20, y);
      y += 5;
    }
    if (room.totalAcrylic > 0) {
      doc.text(`Akrylowanie: ${room.totalAcrylic.toFixed(2)} mb`, 20, y);
      y += 5;
    }
    if (room.floorProtection > 0) {
      doc.text(`Oklejanie posadzki: ${room.floorProtection.toFixed(2)} m²`, 20, y);
      y += 5;
    }

    y += 4;

    // Work types header
    doc.setFontSize(9);
    doc.setFont('NotoSans', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('Rodzaj pracy', 20, y);
    doc.text('Ilość', 105, y);
    doc.text('Cena', 135, y);
    doc.text('Wartość', 165, y);
    y += 3;
    doc.setDrawColor(180, 180, 180);
    doc.line(20, y, pageWidth - 20, y);
    y += 6;

    const enabledWorkTypes = room.workTypes.filter((wt) => wt.enabled);
    doc.setFont('NotoSans', 'normal');
    doc.setTextColor(60, 60, 60);

    enabledWorkTypes.forEach((wt) => {
      checkPageBreak(8);
      const quantity = getWorkTypeQuantity(room, wt);
      const total = quantity * wt.pricePerMeter;

      doc.text(wt.name, 20, y);
      doc.text(`${quantity.toFixed(2)} ${formatUnit(wt.unit)}`, 105, y);
      doc.text(`${wt.pricePerMeter.toFixed(2)} ${formatPriceUnit(wt.unit)}`, 135, y);
      doc.text(`${total.toFixed(2)} zł`, 165, y);
      y += 6;
    });

    y += 4;

    const roomTotal = calculateRoomTotal(room);
    doc.setFont('NotoSans', 'bold');
    doc.setTextColor(0, 120, 0);
    doc.text(`Suma pokoju: ${roomTotal.toFixed(2)} zł netto`, pageWidth - 20, y, { align: 'right' });
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y, pageWidth - 15, y);
    y += 12;
  });

  // Grand totals
  checkPageBreak(50);
  y += 5;

  doc.setFillColor(240, 250, 240);
  doc.rect(15, y - 5, pageWidth - 30, 40, 'F');

  doc.setFontSize(13);
  doc.setFont('NotoSans', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('PODSUMOWANIE', 20, y + 5);
  y += 15;

  doc.setFontSize(11);
  doc.setFont('NotoSans', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`Liczba pokoi: ${rooms.length}`, 20, y);
  y += 8;

  doc.text('Suma netto:', 20, y);
  doc.setFont('NotoSans', 'bold');
  doc.text(`${grandTotal.toFixed(2)} zł`, pageWidth - 20, y, { align: 'right' });
  y += 8;

  doc.setFont('NotoSans', 'normal');
  doc.text(`VAT ${vatRate}%:`, 20, y);
  const vatAmount = grossTotal - grandTotal;
  doc.text(`${vatAmount.toFixed(2)} zł`, pageWidth - 20, y, { align: 'right' });
  y += 8;

  doc.setFontSize(14);
  doc.setFont('NotoSans', 'bold');
  doc.setTextColor(0, 120, 0);
  doc.text('SUMA BRUTTO:', 20, y);
  doc.text(`${grossTotal.toFixed(2)} zł`, pageWidth - 20, y, { align: 'right' });

  // Footer
  doc.setFontSize(8);
  doc.setFont('NotoSans', 'normal');
  doc.setTextColor(130, 130, 130);
  doc.text(
    'Wycena została wykonana automatycznie przez Kalkulator Wykończeniowy by Wojciech Olszak',
    pageWidth / 2,
    285,
    { align: 'center' },
  );

  return doc;
};

// ================== TABLE FORMAT ==================

const generateTablePdf = async (data: ExportData): Promise<jsPDF> => {
  const {
    rooms,
    vatRate,
    calculateRoomTotal,
    getWorkTypeQuantity,
    grandTotal,
    grossTotal,
    preparedBy,
    quoteName,
  } = data;

  const doc = new jsPDF();
  await applyFonts(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const tableWidth = pageWidth - margin * 2;
  let y = 20;

  // Column widths for main table
  const colWidths = {
    lp: 10,
    name: 65,
    quantity: 25,
    unit: 20,
    price: 25,
    value: 25,
  };

  const rowHeight = 7;

  const checkPageBreak = (requiredSpace: number) => {
    if (y + requiredSpace > 280) {
      doc.addPage();
      y = 20;
    }
  };

  const drawCell = (
    x: number,
    cellY: number,
    width: number,
    height: number,
    text: string,
    options?: { align?: 'left' | 'center' | 'right'; bold?: boolean; fill?: boolean },
  ) => {
    const { align = 'left', bold = false, fill = false } = options || {};

    if (fill) {
      doc.setFillColor(245, 245, 245);
      doc.rect(x, cellY, width, height, 'F');
    }

    doc.setDrawColor(180, 180, 180);
    doc.rect(x, cellY, width, height, 'S');

    doc.setFont('NotoSans', bold ? 'bold' : 'normal');

    let textX = x + 2;
    if (align === 'center') {
      textX = x + width / 2;
    } else if (align === 'right') {
      textX = x + width - 2;
    }

    doc.text(text, textX, cellY + height - 2, { align });
  };

  // Header
  doc.setFontSize(18);
  doc.setFont('NotoSans', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('WYCENA PRAC WYKOŃCZENIOWYCH', pageWidth / 2, y, { align: 'center' });

  if (quoteName) {
    y += 7;
    doc.setFontSize(11);
    doc.setFont('NotoSans', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(quoteName, pageWidth / 2, y, { align: 'center' });
  }

  y += 8;
  doc.setFontSize(9);
  doc.setFont('NotoSans', 'normal');
  doc.setTextColor(100, 100, 100);

  const dateText = `Data: ${new Date().toLocaleDateString('pl-PL')}`;
  const byText = preparedBy ? `Przygotował: ${preparedBy}` : '';

  doc.text(dateText, margin, y);
  if (byText) {
    doc.text(byText, pageWidth - margin, y, { align: 'right' });
  }

  y += 10;

  // Draw rooms as tables
  rooms.forEach((room, roomIndex) => {
    checkPageBreak(50);

    // Room header bar
    doc.setFillColor(70, 130, 180);
    doc.rect(margin, y, tableWidth, 8, 'F');
    doc.setFont('NotoSans', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`${roomIndex + 1}. ${room.name}`, margin + 3, y + 6);

    const roomTotal = calculateRoomTotal(room);
    doc.text(`${roomTotal.toFixed(2)} zł`, pageWidth - margin - 3, y + 6, { align: 'right' });
    y += 8;

    // Room info row
    doc.setFillColor(240, 248, 255);
    doc.rect(margin, y, tableWidth, 6, 'F');
    doc.setDrawColor(180, 180, 180);
    doc.rect(margin, y, tableWidth, 6, 'S');
    doc.setFont('NotoSans', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);

    const infoItems = [`Pow. netto: ${room.netArea.toFixed(2)} m²`];
    if (room.totalCorners > 0) infoItems.push(`Narożniki: ${room.totalCorners.toFixed(2)} mb`);
    if (room.totalGrooves > 0) infoItems.push(`Bruzdy: ${room.totalGrooves.toFixed(2)} mb`);
    if (room.totalAcrylic > 0) infoItems.push(`Akrylowanie: ${room.totalAcrylic.toFixed(2)} mb`);
    if (room.floorProtection > 0) infoItems.push(`Oklejanie: ${room.floorProtection.toFixed(2)} m²`);

    doc.text(infoItems.join('   |   '), margin + 3, y + 4.5);
    y += 6;

    // Table header
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    let x = margin;

    drawCell(x, y, colWidths.lp, rowHeight, 'Lp.', { align: 'center', bold: true, fill: true });
    x += colWidths.lp;
    drawCell(x, y, colWidths.name, rowHeight, 'Rodzaj pracy', { bold: true, fill: true });
    x += colWidths.name;
    drawCell(x, y, colWidths.quantity, rowHeight, 'Ilość', { align: 'center', bold: true, fill: true });
    x += colWidths.quantity;
    drawCell(x, y, colWidths.unit, rowHeight, 'Jedn.', { align: 'center', bold: true, fill: true });
    x += colWidths.unit;
    drawCell(x, y, colWidths.price, rowHeight, 'Cena', { align: 'center', bold: true, fill: true });
    x += colWidths.price;
    drawCell(x, y, colWidths.value, rowHeight, 'Wartość', { align: 'center', bold: true, fill: true });
    y += rowHeight;

    // Work types rows
    const enabledWorkTypes = room.workTypes.filter((wt) => wt.enabled);

    enabledWorkTypes.forEach((wt, idx) => {
      checkPageBreak(rowHeight + 5);

      const quantity = getWorkTypeQuantity(room, wt);
      const total = quantity * wt.pricePerMeter;

      x = margin;
      drawCell(x, y, colWidths.lp, rowHeight, `${idx + 1}`, { align: 'center' });
      x += colWidths.lp;
      drawCell(x, y, colWidths.name, rowHeight, wt.name);
      x += colWidths.name;
      drawCell(x, y, colWidths.quantity, rowHeight, quantity.toFixed(2), { align: 'right' });
      x += colWidths.quantity;
      drawCell(x, y, colWidths.unit, rowHeight, formatUnit(wt.unit), { align: 'center' });
      x += colWidths.unit;
      drawCell(x, y, colWidths.price, rowHeight, `${wt.pricePerMeter.toFixed(2)}`, { align: 'right' });
      x += colWidths.price;
      drawCell(x, y, colWidths.value, rowHeight, `${total.toFixed(2)}`, { align: 'right' });
      y += rowHeight;
    });

    // Room total row
    doc.setFillColor(230, 255, 230);
    x = margin;
    const totalRowWidth = colWidths.lp + colWidths.name + colWidths.quantity + colWidths.unit + colWidths.price;
    drawCell(x, y, totalRowWidth, rowHeight, 'SUMA POKOJU (netto):', { align: 'right', bold: true, fill: true });
    x += totalRowWidth;
    doc.setFillColor(230, 255, 230);
    doc.rect(x, y, colWidths.value, rowHeight, 'F');
    doc.setDrawColor(180, 180, 180);
    doc.rect(x, y, colWidths.value, rowHeight, 'S');
    doc.setFont('NotoSans', 'bold');
    doc.setTextColor(0, 120, 0);
    doc.text(`${roomTotal.toFixed(2)}`, x + colWidths.value - 2, y + rowHeight - 2, { align: 'right' });

    y += rowHeight + 10;
  });

  // Grand total table
  checkPageBreak(40);
  y += 5;

  const summaryWidth = 100;
  const summaryX = pageWidth - margin - summaryWidth;
  const labelWidth = 60;
  const valueWidth = 40;

  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  // Netto
  drawCell(summaryX, y, labelWidth, rowHeight, 'Suma netto:', { align: 'right', fill: true });
  drawCell(summaryX + labelWidth, y, valueWidth, rowHeight, `${grandTotal.toFixed(2)} zł`, { align: 'right' });
  y += rowHeight;

  // VAT
  drawCell(summaryX, y, labelWidth, rowHeight, `VAT ${vatRate}%:`, { align: 'right', fill: true });
  const vatAmount = grossTotal - grandTotal;
  drawCell(summaryX + labelWidth, y, valueWidth, rowHeight, `${vatAmount.toFixed(2)} zł`, { align: 'right' });
  y += rowHeight;

  // Brutto
  doc.setFillColor(220, 250, 220);
  doc.rect(summaryX, y, labelWidth, rowHeight + 2, 'F');
  doc.setDrawColor(0, 150, 0);
  doc.rect(summaryX, y, labelWidth, rowHeight + 2, 'S');
  doc.setFont('NotoSans', 'bold');
  doc.setTextColor(0, 100, 0);
  doc.text('SUMA BRUTTO:', summaryX + labelWidth - 2, y + rowHeight - 1, { align: 'right' });

  doc.setFillColor(220, 250, 220);
  doc.rect(summaryX + labelWidth, y, valueWidth, rowHeight + 2, 'F');
  doc.setDrawColor(0, 150, 0);
  doc.rect(summaryX + labelWidth, y, valueWidth, rowHeight + 2, 'S');
  doc.text(`${grossTotal.toFixed(2)} zł`, summaryX + labelWidth + valueWidth - 2, y + rowHeight - 1, { align: 'right' });

  // Footer
  doc.setFontSize(8);
  doc.setFont('NotoSans', 'normal');
  doc.setTextColor(130, 130, 130);
  doc.text(
    'Wycena została wykonana automatycznie przez Kalkulator Wykończeniowy by Wojciech Olszak',
    pageWidth / 2,
    285,
    { align: 'center' },
  );

  return doc;
};

// ================== EXPORTS ==================

const generatePdfDocument = async (data: ExportData): Promise<jsPDF> => {
  const format = data.format || 'standard';
  return format === 'table' ? generateTablePdf(data) : generateStandardPdf(data);
};

const sanitizeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]/g, '').replace(/\s+/g, '_');

export const exportToPdf = async (data: ExportData) => {
  const doc = await generatePdfDocument(data);

  const sanitizedName = data.quoteName ? sanitizeFileName(data.quoteName) : '';
  const formatSuffix = data.format === 'table' ? '_tabela' : '';
  const fileName = data.quoteName
    ? `${sanitizedName}${formatSuffix}_${new Date().toISOString().split('T')[0]}.pdf`
    : `wycena${formatSuffix}_${new Date().toISOString().split('T')[0]}.pdf`;

  doc.save(fileName);
};

export const generatePdfBlobUrl = async (data: ExportData): Promise<string> => {
  const doc = await generatePdfDocument(data);
  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
};

