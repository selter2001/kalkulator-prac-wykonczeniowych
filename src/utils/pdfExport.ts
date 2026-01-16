import jsPDF from 'jspdf';
import { Room, WorkType, VatRate, WorkTypeUnit } from '@/types/calculator';

interface ExportData {
  rooms: Room[];
  vatRate: VatRate | number;
  calculateRoomTotal: (room: Room) => number;
  getWorkTypeQuantity: (room: Room, workType: WorkType) => number;
  grandTotal: number;
  grossTotal: number;
  preparedBy?: string;
  quoteName?: string;
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

const generatePdfDocument = async ({
  rooms,
  vatRate,
  calculateRoomTotal,
  getWorkTypeQuantity,
  grandTotal,
  grossTotal,
  preparedBy,
  quoteName,
}: ExportData): Promise<jsPDF> => {
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

    // Room header
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

    // Work types table header
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

    // Enabled work types
    const enabledWorkTypes = room.workTypes.filter((wt) => wt.enabled);
    doc.setFont('NotoSans', 'normal');
    doc.setTextColor(60, 60, 60);

    enabledWorkTypes.forEach((wt) => {
      checkPageBreak(8);
      const quantity = getWorkTypeQuantity(room, wt);
      const total = quantity * wt.pricePerMeter;

      const unitLabel = formatUnit(wt.unit);
      const priceLabel = formatPriceUnit(wt.unit);

      doc.text(wt.name, 20, y);
      doc.text(`${quantity.toFixed(2)} ${unitLabel}`, 105, y);
      doc.text(`${wt.pricePerMeter.toFixed(2)} ${priceLabel}`, 135, y);
      doc.text(`${total.toFixed(2)} zł`, 165, y);
      y += 6;
    });

    y += 4;

    // Room total
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

const sanitizeFileName = (name: string) =>
  name
    .replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]/g, '')
    .replace(/\s+/g, '_');

export const exportToPdf = async (data: ExportData) => {
  const doc = await generatePdfDocument(data);

  const sanitizedName = data.quoteName ? sanitizeFileName(data.quoteName) : '';
  const fileName = data.quoteName
    ? `${sanitizedName}_${new Date().toISOString().split('T')[0]}.pdf`
    : `wycena_${new Date().toISOString().split('T')[0]}.pdf`;

  doc.save(fileName);
};

export const generatePdfBlobUrl = async (data: ExportData): Promise<string> => {
  const doc = await generatePdfDocument(data);
  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
};
