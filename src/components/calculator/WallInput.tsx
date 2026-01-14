import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WallInputProps {
  onAdd: (width: number, height: number) => void;
  label: string;
  icon?: ReactNode;
}

export const WallInput = ({ onAdd, label, icon }: WallInputProps) => {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  const handleAdd = () => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (w > 0 && h > 0) {
      onAdd(w, h);
      setWidth('');
      setHeight('');
    }
  };

  const area = (parseFloat(width) || 0) * (parseFloat(height) || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-muted/30 border border-border/50"
    >
      <div className="flex flex-wrap items-end gap-3">
        {icon && <div className="hidden sm:block">{icon}</div>}
        <div className="flex-1 min-w-[100px]">
          <label className="text-xs text-muted-foreground mb-1.5 block">Szerokość</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="0.00"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="flex-1 min-w-[100px]">
          <label className="text-xs text-muted-foreground mb-1.5 block">Wysokość</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="0.00"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="flex-1 min-w-[80px]">
          <label className="text-xs text-muted-foreground mb-1.5 block">Powierzchnia</label>
          <div className="h-11 flex items-center px-4 rounded-xl bg-primary/5 border border-primary/20 font-semibold text-primary">
            {area.toFixed(2)} m²
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleAdd}
            disabled={!width || !height || parseFloat(width) <= 0 || parseFloat(height) <= 0}
            className="h-11 px-5 rounded-xl gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};