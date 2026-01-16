import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileDown, Sparkles, User as UserIcon, Check, Volume2, VolumeX, Save, FolderOpen } from 'lucide-react';
import { useCalculator } from '@/hooks/useCalculator';
import { useAuth } from '@/hooks/useAuth';
import { useQuotes } from '@/hooks/useQuotes';
import { useSounds } from '@/contexts/SoundContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RoomCard } from './RoomCard';
import { exportToPdf, PdfFormat } from '@/utils/pdfExport';
import { UserMenu } from '@/components/UserMenu';
import { AnimatedBackground } from './AnimatedBackground';
import { SaveQuoteDialog } from './SaveQuoteDialog';
import { QuotesManager } from './QuotesManager';
import { PdfFormatDialog } from './PdfFormatDialog';
import { SavedQuote } from '@/types/quote';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export const Calculator = () => {
  const {
    rooms,
    vatRate,
    setVatRate,
    preparedBy,
    setPreparedBy,
    isProfileNameConfirmed,
    confirmProfileName,
    currentQuoteId,
    currentQuoteName,
    loadQuoteData,
    createRoom,
    updateRoomName,
    deleteRoom,
    addWall,
    deleteWall,
    addCeiling,
    deleteCeiling,
    addCorner,
    deleteCorner,
    addGroove,
    deleteGroove,
    addAcrylic,
    deleteAcrylic,
    setFloorProtection,
    updateWorkTypePrice,
    toggleWorkType,
    addCustomWorkType,
    addCustomWorkItem,
    deleteCustomWorkItem,
    deleteWorkType,
    calculateRoomTotal,
    calculateGrandTotal,
    calculateGrossTotal,
    getWorkTypeQuantity,
  } = useCalculator();

  const { authMode, getDisplayName, user } = useAuth();
  const { playSound, isMuted, toggleMute } = useSounds();
  const { saveQuote, updateQuote, isLoading: isSavingQuote } = useQuotes();
  
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const grandTotal = calculateGrandTotal();
  const grossTotal = calculateGrossTotal();

  const profileDisplayName = getDisplayName();
  const showConfirmButton = authMode === 'authenticated' && profileDisplayName && !isProfileNameConfirmed;
  const isLoggedIn = authMode === 'authenticated' && user;

  const handleCreateRoom = () => {
    playSound('success');
    createRoom();
  };

  const handleDeleteRoom = (roomId: string) => {
    playSound('remove');
    deleteRoom(roomId);
  };

  const handleExportClick = () => {
    if (isLoggedIn && rooms.length > 0) {
      setShowSaveDialog(true);
    } else {
      // Guest mode - show format dialog then export
      setShowFormatDialog(true);
    }
  };

  const [showFormatDialog, setShowFormatDialog] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleGuestDownload = async (format: PdfFormat) => {
    setIsGeneratingPdf(true);
    playSound('celebrate');
    await exportToPdf({
      rooms,
      vatRate,
      calculateRoomTotal,
      getWorkTypeQuantity,
      grandTotal,
      grossTotal,
      preparedBy,
      quoteName: `Wycena ${new Date().toLocaleDateString('pl-PL')}`,
      format,
    });
    setIsGeneratingPdf(false);
    setShowFormatDialog(false);
  };

  const handleSaveToCloud = async (name: string, format: PdfFormat) => {
    playSound('celebrate');

    if (currentQuoteId) {
      // Update existing quote
      const success = await updateQuote(currentQuoteId, name, rooms, vatRate, preparedBy);
      if (success) {
        // Also download PDF
        await exportToPdf({
          rooms,
          vatRate,
          calculateRoomTotal,
          getWorkTypeQuantity,
          grandTotal,
          grossTotal,
          preparedBy,
          quoteName: name,
          format,
        });
        setShowSaveDialog(false);
      }
    } else {
      // Create new quote
      const savedQuote = await saveQuote(name, rooms, vatRate, preparedBy);
      if (savedQuote) {
        loadQuoteData(savedQuote.id, savedQuote.name, rooms, vatRate, preparedBy);
        // Also download PDF
        await exportToPdf({
          rooms,
          vatRate,
          calculateRoomTotal,
          getWorkTypeQuantity,
          grandTotal,
          grossTotal,
          preparedBy,
          quoteName: name,
          format,
        });
        setShowSaveDialog(false);
      }
    }
  };

  const handleDownloadOnly = async (name: string, format: PdfFormat) => {
    playSound('celebrate');
    await exportToPdf({
      rooms,
      vatRate,
      calculateRoomTotal,
      getWorkTypeQuantity,
      grandTotal,
      grossTotal,
      preparedBy,
      quoteName: name,
      format,
    });
  };

  const handleLoadQuote = (quote: SavedQuote) => {
    loadQuoteData(quote.id, quote.name, quote.data, quote.vat_rate, quote.prepared_by);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated cartoon background */}
      <AnimatedBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 py-12 max-w-4xl"
      >
        {/* User Menu & Sound Toggle */}
        <motion.div variants={itemVariants} className="flex justify-end items-center gap-2 mb-4">
          {isLoggedIn && (
            <QuotesManager
              onLoadQuote={handleLoadQuote}
              getWorkTypeQuantity={getWorkTypeQuantity}
              calculateRoomTotal={calculateRoomTotal}
            />
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMute}
            className="p-2.5 rounded-xl hover:bg-muted/50 transition-colors"
            title={isMuted ? 'Włącz dźwięki' : 'Wycisz dźwięki'}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Volume2 className="h-5 w-5 text-primary" />
            )}
          </motion.button>
          <UserMenu />
        </motion.div>

        {/* Header - compact version for logged in users */}
        <motion.header variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              <span className="text-foreground/80">Kalkulator</span>
              {' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                prac wykończeniowych
              </span>
            </h1>
          </div>
          {currentQuoteName && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-2">
              <FolderOpen className="h-3 w-3" />
              {currentQuoteName}
            </div>
          )}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Sparkles className="h-3 w-3" />
            Wszystkie ceny netto
          </div>
        </motion.header>

        {/* Prepared By Input */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="max-w-md mx-auto p-4 rounded-2xl glass-card border border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Wycenę przygotował/a</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={preparedBy}
                    onChange={(e) => setPreparedBy(e.target.value)}
                    placeholder="Nazwa firmy lub imię i nazwisko"
                    className="h-10 rounded-xl border-0 bg-muted/30 focus:bg-muted/50 flex-1"
                  />
                  {showConfirmButton && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={confirmProfileName}
                      className="h-10 px-3 rounded-xl gap-1.5 text-xs"
                      title={`Użyj: ${profileDisplayName}`}
                    >
                      <Check className="h-4 w-4" />
                      <span className="hidden sm:inline">Potwierdź</span>
                    </Button>
                  )}
                </div>
                {authMode === 'authenticated' && profileDisplayName && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {isProfileNameConfirmed ? (
                      <span className="text-green-600 dark:text-green-500">
                        ✓ Używasz danych z profilu: {profileDisplayName}
                      </span>
                    ) : (
                      <>
                        Kliknij "Potwierdź" aby użyć: <span className="font-medium">{profileDisplayName}</span>
                      </>
                    )}
                  </p>
                )}
                {authMode === 'guest' && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Tryb gościa - wprowadź dane ręcznie
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add Room Button */}
        <motion.div variants={itemVariants} className="flex justify-center mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleCreateRoom}
              size="lg"
              className="gap-3 h-14 px-8 text-base font-medium rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25 transition-all duration-300"
            >
              <Plus className="h-5 w-5" />
              Dodaj pokój
            </Button>
          </motion.div>
        </motion.div>

        {/* Rooms List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                  delay: index * 0.05,
                }}
              >
                <RoomCard
                  room={room}
                  roomTotal={calculateRoomTotal(room)}
                  onUpdateName={(name) => updateRoomName(room.id, name)}
                  onDelete={() => handleDeleteRoom(room.id)}
                  onAddWall={(area) => addWall(room.id, area)}
                  onDeleteWall={(wallId) => deleteWall(room.id, wallId)}
                  onAddCeiling={(area) => addCeiling(room.id, area)}
                  onDeleteCeiling={(ceilingId) => deleteCeiling(room.id, ceilingId)}
                  onAddCorner={(length) => addCorner(room.id, length)}
                  onDeleteCorner={(cornerId) => deleteCorner(room.id, cornerId)}
                  onAddGroove={(length) => addGroove(room.id, length)}
                  onDeleteGroove={(grooveId) => deleteGroove(room.id, grooveId)}
                  onAddAcrylic={(length) => addAcrylic(room.id, length)}
                  onDeleteAcrylic={(acrylicId) => deleteAcrylic(room.id, acrylicId)}
                  onSetFloorProtection={(area) => setFloorProtection(room.id, area)}
                  onToggleWorkType={(workTypeId) => toggleWorkType(room.id, workTypeId)}
                  onUpdateWorkTypePrice={(workTypeId, price) => updateWorkTypePrice(room.id, workTypeId, price)}
                  onAddCustomWorkType={(name, unit, price) => addCustomWorkType(room.id, name, unit, price)}
                  onAddCustomWorkItem={(workTypeId, value) => addCustomWorkItem(room.id, workTypeId, value)}
                  onDeleteCustomWorkItem={(workTypeId, itemId) => deleteCustomWorkItem(room.id, workTypeId, itemId)}
                  onDeleteWorkType={(workTypeId) => deleteWorkType(room.id, workTypeId)}
                  getWorkTypeQuantity={(workType) => getWorkTypeQuantity(room, workType)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {rooms.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
            >
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-muted to-muted/50 mb-6"
              >
                <Plus className="h-10 w-10 text-muted-foreground" />
              </motion.div>
              <p className="text-xl font-medium text-foreground mb-2">
                Zacznij nową wycenę
              </p>
              <p className="text-muted-foreground">
                Kliknij przycisk powyżej, aby dodać pierwszy pokój
              </p>
            </motion.div>
          )}
        </div>

        {/* Summary */}
        {rooms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="mt-12 p-8 rounded-3xl glass-card border border-border/50"
          >
            <div className="space-y-8">
              {/* VAT Selection */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Stawka VAT</span>
                <div className="flex gap-2">
                  {[8, 23].map((rate) => (
                    <motion.button
                      key={rate}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVatRate(rate as 8 | 23)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        vatRate === rate
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {rate}%
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Totals */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {rooms.length} {rooms.length === 1 ? 'pokój' : rooms.length < 5 ? 'pokoje' : 'pokoi'}
                  </span>
                  <div className="text-right">
                    <motion.span
                      key={grandTotal}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-semibold"
                    >
                      {grandTotal.toFixed(2)} zł
                    </motion.span>
                    <span className="text-sm text-muted-foreground ml-2">netto</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Suma brutto</span>
                  <motion.div
                    key={grossTotal}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-right"
                  >
                    <span className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                      {grossTotal.toFixed(2)} zł
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Export Button */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  onClick={handleExportClick}
                  size="lg"
                  variant="outline"
                  className="w-full h-14 gap-3 rounded-2xl text-base font-medium border-2 hover:bg-muted/50 transition-all duration-300"
                >
                  {isLoggedIn ? (
                    <>
                      <Save className="h-5 w-5" />
                      {currentQuoteId ? 'Zapisz zmiany i pobierz PDF' : 'Zapisz wycenę i pobierz PDF'}
                    </>
                  ) : (
                    <>
                      <FileDown className="h-5 w-5" />
                      Pobierz wycenę PDF
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Kalkulator prac wykończeniowych © 2026
          </p>
          <p className="text-sm font-medium text-foreground/70 mt-1">
            by Wojciech Olszak
          </p>
        </motion.footer>
      </motion.div>

      {/* Save Quote Dialog */}
      <SaveQuoteDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSaveToCloud={handleSaveToCloud}
        onDownloadOnly={handleDownloadOnly}
        isLoading={isSavingQuote}
        defaultName={currentQuoteName || undefined}
      />

      {/* Guest PDF Format Dialog */}
      <PdfFormatDialog
        isOpen={showFormatDialog}
        onClose={() => setShowFormatDialog(false)}
        onSelect={handleGuestDownload}
        isLoading={isGeneratingPdf}
      />
    </div>
  );
};
