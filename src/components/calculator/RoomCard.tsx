import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  Square,
  LayoutGrid,
  Paintbrush
} from 'lucide-react';
import { Room } from '@/types/calculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { WallInput } from './WallInput';
import { ItemList } from './ItemList';
import { WorkTypesList } from './WorkTypesList';

interface RoomCardProps {
  room: Room;
  roomTotal: number;
  onUpdateName: (name: string) => void;
  onDelete: () => void;
  onAddWall: (width: number, height: number) => void;
  onDeleteWall: (wallId: string) => void;
  onAddWindow: (width: number, height: number) => void;
  onDeleteWindow: (windowId: string) => void;
  onToggleWorkType: (workTypeId: string) => void;
  onUpdateWorkTypePrice: (workTypeId: string, price: number) => void;
}

export const RoomCard = ({
  room,
  roomTotal,
  onUpdateName,
  onDelete,
  onAddWall,
  onDeleteWall,
  onAddWindow,
  onDeleteWindow,
  onToggleWorkType,
  onUpdateWorkTypePrice,
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="overflow-hidden bg-card/80 backdrop-blur-md border-border/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="max-w-xs bg-background/50"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <Button size="icon" variant="ghost" onClick={handleSaveName}>
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold">{room.name}</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Powierzchnia netto</p>
                <p className="text-lg font-bold text-primary">{room.netArea.toFixed(2)} m²</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Suma</p>
                <p className="text-lg font-bold text-green-600">{roomTotal.toFixed(2)} zł</p>
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={onDelete}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <CardContent className="p-6 space-y-6">
            {/* Walls Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Ściany</h4>
                <span className="text-sm text-muted-foreground ml-auto">
                  Razem: {room.totalWallArea.toFixed(2)} m²
                </span>
              </div>
              <WallInput
                onAdd={onAddWall}
                label="Dodaj ścianę"
                icon={<LayoutGrid className="h-4 w-4 text-primary" />}
              />
              <ItemList
                items={room.walls}
                onDelete={onDeleteWall}
                label="Ściana"
                emptyMessage="Brak ścian - dodaj pierwszą ścianę"
              />
            </div>

            {/* Windows Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Square className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold">Okna / Drzwi (do odjęcia)</h4>
                <span className="text-sm text-muted-foreground ml-auto">
                  Razem: -{room.totalWindowArea.toFixed(2)} m²
                </span>
              </div>
              <WallInput
                onAdd={onAddWindow}
                label="Dodaj okno/drzwi"
                icon={<Square className="h-4 w-4 text-blue-500" />}
              />
              <ItemList
                items={room.windows}
                onDelete={onDeleteWindow}
                label="Okno/Drzwi"
                emptyMessage="Brak okien/drzwi do odjęcia"
              />
            </div>

            {/* Work Types Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Paintbrush className="h-5 w-5 text-orange-500" />
                <h4 className="font-semibold">Rodzaje prac</h4>
              </div>
              <WorkTypesList
                workTypes={room.workTypes}
                netArea={room.netArea}
                onToggle={onToggleWorkType}
                onPriceChange={onUpdateWorkTypePrice}
              />
            </div>
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  );
};
