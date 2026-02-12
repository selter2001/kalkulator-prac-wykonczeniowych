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
import { useSounds } from '@/contexts/SoundContext';

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
  onAddCustomWorkItem: (workTypeId: string, value: number) => void;
  onDeleteCustomWorkItem: (workTypeId: string, itemId: string) => void;
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
  onAddCustomWorkItem,
  onDeleteCustomWorkItem,
  onDeleteWorkType,
  getWorkTypeQuantity,
}: RoomCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(room.name);
  const { playSound } = useSounds();

  const handleSaveName = () => {
    onUpdateName(editName);
    setIsEditing(false);
    playSound('pop');
  };

  const handleCancelEdit = () => {
    setEditName(room.name);
    setIsEditing(false);
  };

  // Wrapped handlers with sounds
  const handleAddWall = (area: number) => { playSound('pop'); onAddWall(area); };
  const handleDeleteWall = (id: string) => { playSound('remove'); onDeleteWall(id); };
  const handleAddCeiling = (area: number) => { playSound('pop'); onAddCeiling(area); };
  const handleDeleteCeiling = (id: string) => { playSound('remove'); onDeleteCeiling(id); };
  const handleAddCorner = (length: number) => { playSound('pop'); onAddCorner(length); };
  const handleDeleteCorner = (id: string) => { playSound('remove'); onDeleteCorner(id); };
  const handleAddGroove = (length: number) => { playSound('pop'); onAddGroove(length); };
  const handleDeleteGroove = (id: string) => { playSound('remove'); onDeleteGroove(id); };
  const handleAddAcrylic = (length: number) => { playSound('pop'); onAddAcrylic(length); };
  const handleDeleteAcrylic = (id: string) => { playSound('remove'); onDeleteAcrylic(id); };
  const handleToggleWorkType = (id: string) => { playSound('toggle'); onToggleWorkType(id); };
  const handleAddCustomWorkType = (name: string, unit: WorkTypeUnit, price: number) => { playSound('success'); onAddCustomWorkType(name, unit, price); };
  const handleAddCustomWorkItem = (workTypeId: string, value: number) => { playSound('pop'); onAddCustomWorkItem(workTypeId, value); };
  const handleDeleteCustomWorkItem = (workTypeId: string, itemId: string) => { playSound('remove'); onDeleteCustomWorkItem(workTypeId, itemId); };
  const handleDeleteWorkType = (id: string) => { playSound('remove'); onDeleteWorkType(id); };

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
                <AreaInput onAdd={handleAddWall} label="Dodaj ścianę" />
                <AreaItemList
                  items={room.walls}
                  onDelete={handleDeleteWall}
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
                <AreaInput onAdd={handleAddCeiling} label="Dodaj sufit" />
                <AreaItemList
                  items={room.ceilings}
                  onDelete={handleDeleteCeiling}
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
                <LinearInput onAdd={handleAddCorner} label="Dodaj" placeholder="Długość" />
                <LinearItemList
                  items={room.corners}
                  onDelete={handleDeleteCorner}
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
                <LinearInput onAdd={handleAddGroove} label="Dodaj" placeholder="Długość" />
                <LinearItemList
                  items={room.grooves}
                  onDelete={handleDeleteGroove}
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
                <LinearInput onAdd={handleAddAcrylic} label="Dodaj" placeholder="Długość" />
                <LinearItemList
                  items={room.acrylic}
                  onDelete={handleDeleteAcrylic}
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
                <AreaInput 
                  onAdd={(value) => {
                    playSound('pop');
                    onSetFloorProtection(room.floorProtection + value);
                  }} 
                  label="Dodaj"
                  compact
                />
                {room.floorProtection > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Aktualna wartość:</span>
                    <span className="font-semibold">{room.floorProtection.toFixed(2)} m²</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        playSound('remove');
                        onSetFloorProtection(0);
                      }}
                      className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </Section>

              {/* Custom Work Items Sections - display after Floor Protection */}
              {room.workTypes
                .filter(wt => wt.isCustom && wt.enabled)
                .map(workType => {
                  const total = (workType.customItems || []).reduce((sum, item) => sum + item.value, 0);
                  const unitLabel = workType.unit === 'm2' ? 'm²' : workType.unit === 'mb' ? 'mb' : 'szt.';
                  
                  return (
                    <Section
                      key={workType.id}
                      icon={<Paintbrush className="h-5 w-5 text-accent" />}
                      title={workType.name}
                      value={total.toFixed(2)}
                      unit={unitLabel}
                    >
                      {workType.unit === 'm2' ? (
                        <>
                          <AreaInput 
                            compact
                            onAdd={(value) => handleAddCustomWorkItem(workType.id, value)} 
                            label="Dodaj" 
                          />
                          <AreaItemList
                            items={(workType.customItems || []).map(item => ({ id: item.id, area: item.value }))}
                            onDelete={(itemId) => handleDeleteCustomWorkItem(workType.id, itemId)}
                            label={workType.name}
                            emptyMessage={`Dodaj pierwszy element`}
                          />
                        </>
                      ) : (
                        <>
                          <LinearInput
                            onAdd={(value) => handleAddCustomWorkItem(workType.id, value)}
                            label="Dodaj"
                            placeholder={workType.unit === 'szt' ? 'Ilość' : 'Długość'}
                            unit={workType.unit}
                          />
                          <LinearItemList
                            items={(workType.customItems || []).map(item => ({ id: item.id, length: item.value }))}
                            onDelete={(itemId) => handleDeleteCustomWorkItem(workType.id, itemId)}
                            label={workType.name}
                            emptyMessage={`Dodaj pierwszy element`}
                            unit={workType.unit}
                          />
                        </>
                      )}
                    </Section>
                  );
                })}

              {/* Work Types - at the end */}
              <Section
                icon={<Paintbrush className="h-5 w-5 text-orange-500" />}
                title="Rodzaje prac"
                value=""
                unit=""
              >
                <WorkTypesList
                  workTypes={room.workTypes}
                  getQuantity={getWorkTypeQuantity}
                  onToggle={handleToggleWorkType}
                  onPriceChange={onUpdateWorkTypePrice}
                  onAddCustom={handleAddCustomWorkType}
                  onDelete={handleDeleteWorkType}
                />
              </Section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
