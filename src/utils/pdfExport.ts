import jsPDF from 'jspdf';
import { Room, WorkType, VatRate } from '@/types/calculator';

interface ExportData {
  rooms: Room[];
  vatRate: VatRate;
  calculateRoomTotal: (room: Room) => number;
  getWorkTypeQuantity: (room: Room, workType: WorkType) => number;
  grandTotal: number;
  grossTotal: number;
}

export const exportToPdf = ({
  rooms,
  vatRate,
  calculateRoomTotal,
  getWorkTypeQuantity,
  grandTotal,
  grossTotal,
}: ExportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Helper functions
  const addText = (text: string, x: number, yPos: number, options?: { fontSize?: number; fontStyle?: 'normal' | 'bold'; color?: [number, number, number] }) => {
    const { fontSize = 10, fontStyle = 'normal', color = [0, 0, 0] } = options || {};
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, x, yPos);
  };

  const addLine = (yPos: number) => {
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, pageWidth - 15, yPos);
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (y + requiredSpace > 280) {
      doc.addPage();
      y = 20;
    }
  };

  // Header
  addText('WYCENA PRAC WYKONCZENIOWYCH', pageWidth / 2, y, { fontSize: 18, fontStyle: 'bold' });
  doc.setFontSize(18);
  const titleWidth = doc.getTextWidth('WYCENA PRAC WYKONCZENIOWYCH');
  doc.text('WYCENA PRAC WYKONCZENIOWYCH', (pageWidth - titleWidth) / 2, y);
  
  y += 8;
  const dateText = `Data: ${new Date().toLocaleDateString('pl-PL')}`;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, (pageWidth - dateWidth) / 2, y);
  
  y += 5;
  addLine(y);
  y += 10;

  // Rooms
  rooms.forEach((room, roomIndex) => {
    checkPageBreak(50);

    // Room header
    addText(`${roomIndex + 1}. ${room.name}`, 15, y, { fontSize: 14, fontStyle: 'bold', color: [50, 50, 50] });
    y += 6;
    
    addText(`Powierzchnia netto: ${room.netArea.toFixed(2)} m2`, 20, y, { fontSize: 10, color: [100, 100, 100] });
    y += 5;

    if (room.totalCorners > 0) {
      addText(`Narozniki: ${room.totalCorners.toFixed(2)} mb`, 20, y, { fontSize: 10, color: [100, 100, 100] });
      y += 5;
    }
    if (room.totalGrooves > 0) {
      addText(`Bruzdy: ${room.totalGrooves.toFixed(2)} mb`, 20, y, { fontSize: 10, color: [100, 100, 100] });
      y += 5;
    }
    if (room.totalAcrylic > 0) {
      addText(`Akrylowanie: ${room.totalAcrylic.toFixed(2)} mb`, 20, y, { fontSize: 10, color: [100, 100, 100] });
      y += 5;
    }
    if (room.floorProtection > 0) {
      addText(`Oklejanie posadzki: ${room.floorProtection.toFixed(2)} m2`, 20, y, { fontSize: 10, color: [100, 100, 100] });
      y += 5;
    }

    y += 3;

    // Work types table header
    addText('Rodzaj pracy', 20, y, { fontSize: 9, fontStyle: 'bold' });
    addText('Ilosc', 100, y, { fontSize: 9, fontStyle: 'bold' });
    addText('Cena', 130, y, { fontSize: 9, fontStyle: 'bold' });
    addText('Wartosc', 160, y, { fontSize: 9, fontStyle: 'bold' });
    y += 2;
    addLine(y);
    y += 5;

    // Enabled work types
    const enabledWorkTypes = room.workTypes.filter(wt => wt.enabled);
    enabledWorkTypes.forEach(wt => {
      checkPageBreak(8);
      const quantity = getWorkTypeQuantity(room, wt);
      const total = quantity * wt.pricePerMeter;
      const unitLabel = wt.unit === 'm2' ? 'm2' : 'mb';
      const priceLabel = wt.unit === 'm2' ? 'zl/m2' : 'zl/mb';

      addText(wt.name, 20, y, { fontSize: 9 });
      addText(`${quantity.toFixed(2)} ${unitLabel}`, 100, y, { fontSize: 9 });
      addText(`${wt.pricePerMeter.toFixed(2)} ${priceLabel}`, 130, y, { fontSize: 9 });
      addText(`${total.toFixed(2)} zl`, 160, y, { fontSize: 9 });
      y += 5;
    });

    y += 3;
    
    // Room total
    const roomTotal = calculateRoomTotal(room);
    addText(`Suma pokoju: ${roomTotal.toFixed(2)} zl netto`, pageWidth - 70, y, { fontSize: 10, fontStyle: 'bold', color: [0, 100, 0] });
    y += 10;
    addLine(y);
    y += 10;
  });

  // Grand totals
  checkPageBreak(40);
  y += 5;
  
  doc.setFillColor(240, 250, 240);
  doc.rect(15, y - 5, pageWidth - 30, 35, 'F');

  addText('PODSUMOWANIE', 20, y + 3, { fontSize: 12, fontStyle: 'bold' });
  y += 12;

  addText(`Liczba pokoi: ${rooms.length}`, 20, y, { fontSize: 10 });
  y += 6;

  addText(`Suma netto:`, 20, y, { fontSize: 11 });
  addText(`${grandTotal.toFixed(2)} zl`, pageWidth - 50, y, { fontSize: 11, fontStyle: 'bold' });
  y += 7;

  addText(`VAT ${vatRate}%:`, 20, y, { fontSize: 11 });
  const vatAmount = grossTotal - grandTotal;
  addText(`${vatAmount.toFixed(2)} zl`, pageWidth - 50, y, { fontSize: 11 });
  y += 7;

  addText(`SUMA BRUTTO:`, 20, y, { fontSize: 13, fontStyle: 'bold', color: [0, 100, 0] });
  addText(`${grossTotal.toFixed(2)} zl`, pageWidth - 50, y, { fontSize: 13, fontStyle: 'bold', color: [0, 100, 0] });

  // Footer
  y = 280;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Wycena wygenerowana automatycznie - Kalkulator Prac Wykonczeniowych', pageWidth / 2, y, { align: 'center' });

  // Save
  const fileName = `wycena_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
