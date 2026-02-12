import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Maximize2, Minimize2 } from 'lucide-react';

interface PdfPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  quoteName: string;
  onDownload: () => void;
}

export const PdfPreviewDialog = ({
  isOpen,
  onClose,
  pdfUrl,
  quoteName,
  onDownload,
}: PdfPreviewDialogProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className={`bg-card/95 backdrop-blur-xl border-border/50 p-0 gap-0 flex flex-col ${
          isFullscreen 
            ? 'max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh]' 
            : 'max-w-4xl w-[90vw] h-[85vh] max-h-[85vh]'
        }`}
      >
        <DialogHeader className="p-4 pb-2 border-b border-border/30 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold truncate pr-4">
                {quoteName || 'Podgląd wyceny'}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Podgląd dokumentu PDF wyceny
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 w-8 p-0"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Pobierz
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden min-h-0">
          {pdfUrl ? (
            <motion.embed
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={`${pdfUrl}#view=FitH&toolbar=0&navpanes=0`}
              type="application/pdf"
              className="w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
