import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Table, Download, Loader2 } from 'lucide-react';

export type PdfFormat = 'standard' | 'table';

interface PdfFormatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (format: PdfFormat) => void;
  isLoading?: boolean;
}

export const PdfFormatDialog = ({
  isOpen,
  onClose,
  onSelect,
  isLoading = false,
}: PdfFormatDialogProps) => {
  const [selectedFormat, setSelectedFormat] = useState<PdfFormat>('standard');

  const handleConfirm = () => {
    onSelect(selectedFormat);
  };

  const formats: { value: PdfFormat; label: string; description: string; icon: React.ReactNode }[] = [
    {
      value: 'standard',
      label: 'Standardowy',
      description: 'Prosty układ tekstowy, czytelny i elegancki',
      icon: <FileText className="h-6 w-6" />,
    },
    {
      value: 'table',
      label: 'Tabelkowy (Excel)',
      description: 'Układ z tabelami i ramkami, jak arkusz kalkulacyjny',
      icon: <Table className="h-6 w-6" />,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Wybierz format PDF
          </DialogTitle>
          <DialogDescription>
            Wybierz styl wyceny do pobrania
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {formats.map((format) => (
            <motion.button
              key={format.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedFormat(format.value)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selectedFormat === format.value
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border/50 hover:border-border hover:bg-muted/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-xl transition-colors ${
                    selectedFormat === format.value
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {format.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        selectedFormat === format.value ? 'text-foreground' : 'text-foreground/80'
                      }`}
                    >
                      {format.label}
                    </span>
                    {selectedFormat === format.value && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{format.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
            Anuluj
          </Button>
          <Button onClick={handleConfirm} className="flex-1 gap-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generowanie...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Pobierz PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
