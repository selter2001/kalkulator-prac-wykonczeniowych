import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileDown, Sparkles } from 'lucide-react';
import { useCalculator } from '@/hooks/useCalculator';
import { Button } from '@/components/ui/button';
import { RoomCard } from './RoomCard';
import { exportToPdf } from '@/utils/pdfExport';

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
    createRoom,
    updateRoomName,
    deleteRoom,
    addWall,
    deleteWall,
    addWindow,
    deleteWindow,
    addCorner,
    deleteCorner,
    addGroove,
    deleteGroove,
    addAcrylic,
    deleteAcrylic,
    setFloorProtection,
    updateWorkTypePrice,
    toggleWorkType,
    calculateRoomTotal,
    calculateGrandTotal,
    calculateGrossTotal,
    getWorkTypeQuantity,
  } = useCalculator();

  const grandTotal = calculateGrandTotal();
  const grossTotal = calculateGrossTotal();

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 py-12 max-w-4xl"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="h-4 w-4" />
            Wszystkie ceny netto
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Kalkulator
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Wycen
            </span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Profesjonalne wyceny prac wykończeniowych w kilka kliknięć
          </p>
        </motion.header>

        {/* Add Room Button */}
        <motion.div variants={itemVariants} className="flex justify-center mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => createRoom()}
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
                  onDelete={() => deleteRoom(room.id)}
                  onAddWall={(w, h) => addWall(room.id, w, h)}
                  onDeleteWall={(wallId) => deleteWall(room.id, wallId)}
                  onAddWindow={(w, h) => addWindow(room.id, w, h)}
                  onDeleteWindow={(windowId) => deleteWindow(room.id, windowId)}
                  onAddCorner={(length) => addCorner(room.id, length)}
                  onDeleteCorner={(cornerId) => deleteCorner(room.id, cornerId)}
                  onAddGroove={(length) => addGroove(room.id, length)}
                  onDeleteGroove={(grooveId) => deleteGroove(room.id, grooveId)}
                  onAddAcrylic={(length) => addAcrylic(room.id, length)}
                  onDeleteAcrylic={(acrylicId) => deleteAcrylic(room.id, acrylicId)}
                  onSetFloorProtection={(area) => setFloorProtection(room.id, area)}
                  onToggleWorkType={(workTypeId) => toggleWorkType(room.id, workTypeId)}
                  onUpdateWorkTypePrice={(workTypeId, price) => updateWorkTypePrice(room.id, workTypeId, price)}
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
                  onClick={() => exportToPdf({
                    rooms,
                    vatRate,
                    calculateRoomTotal,
                    getWorkTypeQuantity,
                    grandTotal,
                    grossTotal,
                  })}
                  size="lg"
                  variant="outline"
                  className="w-full h-14 gap-3 rounded-2xl text-base font-medium border-2 hover:bg-muted/50 transition-all duration-300"
                >
                  <FileDown className="h-5 w-5" />
                  Pobierz wycenę PDF
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
    </div>
  );
};