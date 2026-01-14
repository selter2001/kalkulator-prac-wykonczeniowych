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

  const checkPageBreak = (requiredSpace: number) => {
    if (y + requiredSpace > 280) {
      doc.addPage();
      y = 20;
    }
  };

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('WYCENA PRAC WYKONCZENIOWYCH', pageWidth / 2, y, { align: 'center' });
  
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Data: ${new Date().toLocaleDateString('pl-PL')}`, pageWidth / 2, y, { align: 'center' });
  
  y += 8;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, y, pageWidth - 15, y);
  y += 12;

  // Rooms
  rooms.forEach((room, roomIndex) => {
    checkPageBreak(60);

    // Room header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text(`${roomIndex + 1}. ${room.name}`, 15, y);
    y += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Powierzchnia netto: ${room.netArea.toFixed(2)} m2`, 20, y);
    y += 5;

    if (room.totalCorners > 0) {
      doc.text(`Narozniki: ${room.totalCorners.toFixed(2)} mb`, 20, y);
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
      doc.text(`Oklejanie posadzki: ${room.floorProtection.toFixed(2)} m2`, 20, y);
      y += 5;
    }

    y += 4;

    // Work types table header
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('Rodzaj pracy', 20, y);
    doc.text('Ilosc', 105, y);
    doc.text('Cena', 135, y);
    doc.text('Wartosc', 165, y);
    y += 3;
    doc.setDrawColor(180, 180, 180);
    doc.line(20, y, pageWidth - 20, y);
    y += 6;

    // Enabled work types
    const enabledWorkTypes = room.workTypes.filter(wt => wt.enabled);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    enabledWorkTypes.forEach(wt => {
      checkPageBreak(8);
      const quantity = getWorkTypeQuantity(room, wt);
      const total = quantity * wt.pricePerMeter;
      const unitLabel = wt.unit === 'm2' ? 'm2' : 'mb';
      const priceLabel = wt.unit === 'm2' ? 'zl/m2' : 'zl/mb';

      doc.text(wt.name, 20, y);
      doc.text(`${quantity.toFixed(2)} ${unitLabel}`, 105, y);
      doc.text(`${wt.pricePerMeter.toFixed(2)} ${priceLabel}`, 135, y);
      doc.text(`${total.toFixed(2)} zl`, 165, y);
      y += 6;
    });

    y += 4;
    
    // Room total
    const roomTotal = calculateRoomTotal(room);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 120, 0);
    doc.text(`Suma pokoju: ${roomTotal.toFixed(2)} zl netto`, pageWidth - 20, y, { align: 'right' });
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
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('PODSUMOWANIE', 20, y + 5);
  y += 15;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`Liczba pokoi: ${rooms.length}`, 20, y);
  y += 8;

  doc.text('Suma netto:', 20, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`${grandTotal.toFixed(2)} zl`, pageWidth - 20, y, { align: 'right' });
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.text(`VAT ${vatRate}%:`, 20, y);
  const vatAmount = grossTotal - grandTotal;
  doc.text(`${vatAmount.toFixed(2)} zl`, pageWidth - 20, y, { align: 'right' });
  y += 8;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 120, 0);
  doc.text('SUMA BRUTTO:', 20, y);
  doc.text(`${grossTotal.toFixed(2)} zl`, pageWidth - 20, y, { align: 'right' });

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(130, 130, 130);
  doc.text('Wycena zostala wykonana automatycznie przez Kalkulator Wykonczeniowy by Wojciech Olszak', pageWidth / 2, 285, { align: 'center' });

  // Save
  const fileName = `wycena_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
