import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  FolderOpen,
  FileText,
  Trash2,
  Edit,
  Eye,
  Loader2,
  Cloud,
  Calendar,
  Download,
} from 'lucide-react';
import { useQuotes } from '@/hooks/useQuotes';
import { SavedQuote } from '@/types/quote';
import { exportToPdf, generatePdfBlobUrl } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';
import { PdfPreviewDialog } from './PdfPreviewDialog';

interface QuotesManagerProps {
  onLoadQuote: (quote: SavedQuote) => void;
  getWorkTypeQuantity: (room: any, workType: any) => number;
  calculateRoomTotal: (room: any) => number;
}

export const QuotesManager = ({
  onLoadQuote,
  getWorkTypeQuantity,
  calculateRoomTotal,
}: QuotesManagerProps) => {
  const { quotes, isLoading, fetchQuotes, deleteQuote } = useQuotes();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<SavedQuote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // PDF Preview state
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewQuote, setPreviewQuote] = useState<SavedQuote | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchQuotes();
    }
  }, [isOpen, fetchQuotes]);

  const handleLoadQuote = (quote: SavedQuote) => {
    onLoadQuote(quote);
    setIsOpen(false);
    toast({
      title: 'Wycena załadowana',
      description: `Załadowano wycenę: ${quote.name}`,
    });
  };

  const getQuotePdfData = (quote: SavedQuote) => {
    // Create local calculation functions that work with quote.data directly
    // This avoids closure issues with the Calculator's current state
    const localGetWorkTypeQuantity = (room: any, workType: any): number => {
      if (workType.isCustom) {
        return (workType.customItems || []).reduce((sum: number, item: any) => sum + item.value, 0);
      }
      
      if (workType.unit === 'm2') {
        if (workType.name.includes('Oklejanie')) {
          return room.floorProtection || 0;
        }
        return room.netArea || 0;
      } else {
        // mb - metry bieżące
        if (workType.name.includes('Narożniki') || workType.name.includes('Narozniki')) return room.totalCorners || 0;
        if (workType.name.includes('bruzd')) return room.totalGrooves || 0;
        if (workType.name.includes('Akrylowanie')) return room.totalAcrylic || 0;
        return 0;
      }
    };

    const localCalculateRoomTotal = (room: any): number => {
      return (room.workTypes || [])
        .filter((wt: any) => wt.enabled)
        .reduce((sum: number, wt: any) => {
          const quantity = localGetWorkTypeQuantity(room, wt);
          return sum + (quantity * (wt.pricePerMeter || 0));
        }, 0);
    };

    const grandTotal = quote.data.reduce((sum, room) => {
      return sum + localCalculateRoomTotal(room);
    }, 0);
    
    const vatAmount = grandTotal * (quote.vat_rate / 100);
    const grossTotal = grandTotal + vatAmount;

    return {
      rooms: quote.data,
      vatRate: quote.vat_rate as 8 | 23,
      getWorkTypeQuantity: localGetWorkTypeQuantity,
      calculateRoomTotal: localCalculateRoomTotal,
      grandTotal,
      grossTotal,
      preparedBy: quote.prepared_by || '',
      quoteName: quote.name,
    };
  };

  const handlePreviewQuote = async (quote: SavedQuote) => {
    const pdfData = getQuotePdfData(quote);

    // Open dialog immediately and show loader while PDF is generating
    setPreviewPdfUrl(null);
    setPreviewQuote(quote);
    setPreviewDialogOpen(true);

    const blobUrl = await generatePdfBlobUrl(pdfData);
    setPreviewPdfUrl(blobUrl);
  };

  const handleDownloadQuote = async (quote: SavedQuote) => {
    const pdfData = getQuotePdfData(quote);
    await exportToPdf(pdfData);
  };

  const handleClosePreview = () => {
    if (previewPdfUrl) {
      URL.revokeObjectURL(previewPdfUrl);
    }
    setPreviewPdfUrl(null);
    setPreviewQuote(null);
    setPreviewDialogOpen(false);
  };

  const handleDeleteClick = (quote: SavedQuote) => {
    setQuoteToDelete(quote);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!quoteToDelete) return;
    
    setIsDeleting(true);
    await deleteQuote(quoteToDelete.id);
    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setQuoteToDelete(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border/50 hover:bg-muted/50"
          >
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Moje wyceny</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg bg-card/95 backdrop-blur-xl border-border/50">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              Zapisane wyceny
            </SheetTitle>
            <SheetDescription>
              Twoje wyceny zapisane w chmurze. Możesz je edytować, podglądać lub usuwać.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-180px)] mt-6 pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : quotes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Brak zapisanych wycen</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Utwórz wycenę i zapisz ją w chmurze
                </p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                <AnimatePresence>
                  {quotes.map((quote) => (
                    <motion.div
                      key={quote.id}
                      variants={itemVariants}
                      layout
                      className="p-4 rounded-xl bg-background/50 border border-border/30 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">
                            {quote.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(new Date(quote.created_at), 'dd MMM yyyy, HH:mm', {
                                locale: pl,
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {quote.data.length} {quote.data.length === 1 ? 'pomieszczenie' : 
                                quote.data.length < 5 ? 'pomieszczenia' : 'pomieszczeń'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              VAT {quote.vat_rate}%
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => handleLoadQuote(quote)}
                          className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edytuj
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            void handlePreviewQuote(quote);
                          }}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Podgląd
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            void handleDownloadQuote(quote);
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClick(quote)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć wycenę?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć wycenę "{quoteToDelete?.name}"? 
              Ta operacja jest nieodwracalna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* PDF Preview Dialog */}
      <PdfPreviewDialog
        isOpen={previewDialogOpen}
        onClose={handleClosePreview}
        pdfUrl={previewPdfUrl}
        quoteName={previewQuote?.name || ''}
        onDownload={() => {
          if (previewQuote) void handleDownloadQuote(previewQuote);
        }}
      />
    </>
  );
};
