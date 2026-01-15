import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  Grid3X3,
  Paintbrush,
  CornerDownRight,
  Ruler,
  Droplets,
  Shield,
  Square
} from 'lucide-react';
import { Room, WorkType, WorkTypeUnit } from '@/types/calculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AreaInput } from './AreaInput';
import { AreaItemList } from './AreaItemList';
import { WorkTypesList } from './WorkTypesList';
import { LinearInput } from './LinearInput';
import { LinearItemList } from './LinearItemList';

interface RoomCardProps {
  room: Room;
  roomTotal: number;
  onUpdateName: (name: string) => void;
  onDelete: () => void;
  onAddWall: (area: number) => void;
  onDeleteWall: (wallId: string) => void;
  onAddCeiling: (area: number) => void;
  onDeleteCeiling: (ceilingId: string) => void;
  onAddCorner: (length: number) => void;
  onDeleteCorner: (cornerId: string) => void;
  onAddGroove: (length: number) => void;
  onDeleteGroove: (grooveId: string) => void;
  onAddAcrylic: (length: number) => void;
  onDeleteAcrylic: (acrylicId: string) => void;
  onSetFloorProtection: (area: number) => void;
  onToggleWorkType: (workTypeId: string) => void;
  onUpdateWorkTypePrice: (workTypeId: string, price: number) => void;
  onAddCustomWorkType: (name: string, unit: WorkTypeUnit, price: number) => void;
  onDeleteWorkType: (workTypeId: string) => void;
  getWorkTypeQuantity: (workType: WorkType) => number;
}

const Section = ({ 
  icon, 
  title, 
  value, 
  unit, 
  children,
  color = "primary"
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string;
  unit: string;
  children: React.ReactNode;
  color?: string;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-${color}/10`}>
          {icon}
        </div>
        <span className="font-medium">{title}</span>
      </div>
      <span className="text-sm text-muted-foreground font-medium">
        {value} {unit}
      </span>
    </div>
    {children}
  </div>
);

export const RoomCard = ({
  room,
  roomTotal,
  onUpdateName,
  onDelete,
  onAddWall,
  onDeleteWall,
  onAddCeiling,
  onDeleteCeiling,
  onAddCorner,
  onDeleteCorner,
  onAddGroove,
  onDeleteGroove,
  onAddAcrylic,
  onDeleteAcrylic,
  onSetFloorProtection,
  onToggleWorkType,
  onUpdateWorkTypePrice,
  onAddCustomWorkType,
  onDeleteWorkType,
  getWorkTypeQuantity,
}: RoomCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(room.name);

  const handleSaveName = () => {
    onUpdateName(editName);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(room.name);
    setIsEditing(false);
  };

  return (
    <div className="rounded-3xl glass-card border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="max-w-[200px] h-10 rounded-xl"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
              <Button size="icon" variant="ghost" onClick={handleSaveName} className="h-10 w-10 rounded-xl">
                <Check className="h-4 w-4 text-accent" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleCancelEdit} className="h-10 w-10 rounded-xl">
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <h3 className="text-xl font-semibold truncate">{room.name}</h3>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg shrink-0"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground mb-1">Powierzchnia</p>
            <p className="text-lg font-semibold text-primary">{room.netArea.toFixed(2)} m²</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Suma</p>
            <p className="text-lg font-bold text-accent">{roomTotal.toFixed(2)} zł</p>
          </div>
          <div className="flex gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDelete}
              className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-8 border-t border-border/50 pt-6">
              {/* Walls */}
              <Section
                icon={<Grid3X3 className="h-5 w-5 text-primary" />}
                title="Ściany"
                value={room.totalWallArea.toFixed(2)}
                unit="m²"
              >
                <AreaInput onAdd={onAddWall} label="Dodaj ścianę" />
                <AreaItemList
                  items={room.walls}
                  onDelete={onDeleteWall}
                  label="Ściana"
                  emptyMessage="Dodaj pierwszą ścianę"
                />
              </Section>

              {/* Ceilings */}
              <Section
                icon={<Square className="h-5 w-5 text-indigo-500" />}
                title="Sufity"
                value={room.totalCeilingArea.toFixed(2)}
                unit="m²"
              >
                <AreaInput onAdd={onAddCeiling} label="Dodaj sufit" />
                <AreaItemList
                  items={room.ceilings}
                  onDelete={onDeleteCeiling}
                  label="Sufit"
                  emptyMessage="Brak sufitów"
                />
              </Section>

              {/* Corners */}
              <Section
                icon={<CornerDownRight className="h-5 w-5 text-purple-500" />}
                title="Narożniki"
                value={room.totalCorners.toFixed(2)}
                unit="mb"
              >
                <LinearInput onAdd={onAddCorner} label="Dodaj" placeholder="Długość" />
                <LinearItemList
                  items={room.corners}
                  onDelete={onDeleteCorner}
                  label="Narożnik"
                  emptyMessage="Brak narożników"
                />
              </Section>

              {/* Grooves */}
              <Section
                icon={<Ruler className="h-5 w-5 text-amber-500" />}
                title="Bruzdy"
                value={room.totalGrooves.toFixed(2)}
                unit="mb"
              >
                <LinearInput onAdd={onAddGroove} label="Dodaj" placeholder="Długość" />
                <LinearItemList
                  items={room.grooves}
                  onDelete={onDeleteGroove}
                  label="Bruzda"
                  emptyMessage="Brak bruzd"
                />
              </Section>

              {/* Acrylic */}
              <Section
                icon={<Droplets className="h-5 w-5 text-cyan-500" />}
                title="Akrylowanie"
                value={room.totalAcrylic.toFixed(2)}
                unit="mb"
              >
                <LinearInput onAdd={onAddAcrylic} label="Dodaj" placeholder="Długość" />
                <LinearItemList
                  items={room.acrylic}
                  onDelete={onDeleteAcrylic}
                  label="Akryl"
                  emptyMessage="Brak akrylowania"
                />
              </Section>

              {/* Floor Protection */}
              <Section
                icon={<Shield className="h-5 w-5 text-emerald-500" />}
                title="Oklejanie posadzki"
                value={room.floorProtection.toFixed(2)}
                unit="m²"
              >
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={room.floorProtection || ''}
                    onChange={(e) => onSetFloorProtection(parseFloat(e.target.value) || 0)}
                    placeholder="Powierzchnia"
                    className="max-w-[200px] h-11 rounded-xl"
                  />
                  <span className="text-sm text-muted-foreground">m²</span>
                </div>
              </Section>

              {/* Work Types */}
              <Section
                icon={<Paintbrush className="h-5 w-5 text-orange-500" />}
                title="Rodzaje prac"
                value=""
                unit=""
              >
                <WorkTypesList
                  workTypes={room.workTypes}
                  getQuantity={getWorkTypeQuantity}
                  onToggle={onToggleWorkType}
                  onPriceChange={onUpdateWorkTypePrice}
                  onAddCustom={onAddCustomWorkType}
                  onDelete={onDeleteWorkType}
                />
              </Section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
