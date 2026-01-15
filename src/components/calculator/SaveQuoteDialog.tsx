import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cloud, Download, Loader2, FileText } from 'lucide-react';

interface SaveQuoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToCloud: (name: string) => Promise<void>;
  onDownloadOnly: (name: string) => void;
  isLoading: boolean;
  defaultName?: string;
}

export const SaveQuoteDialog = ({
  isOpen,
  onClose,
  onSaveToCloud,
  onDownloadOnly,
  isLoading,
  defaultName = '',
}: SaveQuoteDialogProps) => {
  const [quoteName, setQuoteName] = useState(defaultName || `Wycena ${new Date().toLocaleDateString('pl-PL')}`);
  const [selectedAction, setSelectedAction] = useState<'cloud' | 'download' | null>(null);

  const handleSaveToCloud = async () => {
    if (!quoteName.trim()) return;
    setSelectedAction('cloud');
    await onSaveToCloud(quoteName.trim());
    setSelectedAction(null);
  };

  const handleDownloadOnly = () => {
    if (!quoteName.trim()) return;
    setSelectedAction('download');
    onDownloadOnly(quoteName.trim());
    setSelectedAction(null);
    onClose();
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Zapisz wycenę
          </DialogTitle>
          <DialogDescription>
            Nadaj nazwę wycenie i wybierz jak chcesz ją zapisać
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="quote-name" className="text-sm font-medium">
              Nazwa wyceny
            </Label>
            <Input
              id="quote-name"
              value={quoteName}
              onChange={(e) => setQuoteName(e.target.value)}
              placeholder="np. Mieszkanie ul. Kwiatowa 15"
              className="bg-background/50 border-border/50 focus:border-primary/50"
              disabled={isLoading}
              maxLength={100}
            />
          </div>

          <div className="grid gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <Button
                  onClick={handleSaveToCloud}
                  disabled={isLoading || !quoteName.trim()}
                  className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                >
                  {isLoading && selectedAction === 'cloud' ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Cloud className="h-5 w-5 mr-2" />
                  )}
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Zapisz w chmurze i pobierz PDF</span>
                    <span className="text-xs opacity-80">Wycena będzie dostępna na Twoim koncie</span>
                  </div>
                </Button>

                <Button
                  onClick={handleDownloadOnly}
                  disabled={isLoading || !quoteName.trim()}
                  variant="outline"
                  className="w-full h-14 border-border/50 hover:bg-muted/50"
                >
                  {isLoading && selectedAction === 'download' ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5 mr-2" />
                  )}
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Tylko pobierz PDF</span>
                    <span className="text-xs opacity-60">Bez zapisywania w chmurze</span>
                  </div>
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
