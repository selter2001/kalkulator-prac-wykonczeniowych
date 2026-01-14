import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calculator as CalcIcon, Home } from 'lucide-react';
import { useCalculator } from '@/hooks/useCalculator';
import { Button } from '@/components/ui/button';
import { RoomCard } from './RoomCard';

export const Calculator = () => {
  const {
    rooms,
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
    getWorkTypeQuantity,
  } = useCalculator();

  const grandTotal = calculateGrandTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-foreground">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-primary/20 backdrop-blur-sm">
              <CalcIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Kalkulator Wycen
            </h1>
          </div>
          <p className="text-slate-400 max-w-xl mx-auto">
            Szybko i łatwo wyceniaj prace wykończeniowe. Dodawaj pokoje, ściany, okna i obliczaj koszty.
          </p>
          <p className="text-amber-400/80 text-sm mt-2 font-medium">
            Wszystkie ceny są kwotami netto
          </p>
        </motion.header>

        {/* Add Room Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <Button
            onClick={() => createRoom()}
            size="lg"
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
          >
            <Home className="h-5 w-5" />
            <Plus className="h-4 w-4" />
            Dodaj nowy pokój
          </Button>
        </motion.div>

        {/* Rooms List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
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
            ))}
          </AnimatePresence>

          {rooms.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 mb-4">
                <Home className="h-10 w-10 text-slate-500" />
              </div>
              <p className="text-slate-400 text-lg">
                Brak pokoi do wyświetlenia
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Kliknij przycisk powyżej, aby dodać pierwszy pokój
              </p>
            </motion.div>
          )}
        </div>

        {/* Grand Total */}
        {rooms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-500/30 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-wide">Suma całkowita (netto)</p>
                <p className="text-sm text-slate-500">
                  {rooms.length} {rooms.length === 1 ? 'pokój' : rooms.length < 5 ? 'pokoje' : 'pokoi'}
                </p>
              </div>
              <motion.div
                key={grandTotal}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-right"
              >
                <p className="text-4xl font-bold text-green-400">
                  {grandTotal.toFixed(2)} zł
                </p>
                <p className="text-xs text-slate-500">netto</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-500 text-sm">
          <p>Kalkulator prac wykończeniowych © 2025</p>
        </footer>
      </div>
    </div>
  );
};
