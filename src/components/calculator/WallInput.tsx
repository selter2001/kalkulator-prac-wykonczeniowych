import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WallInputProps {
  onAdd: (width: number, height: number) => void;
  label: string;
  icon: React.ReactNode;
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <Label className="text-sm font-medium">{label}</Label>
      </div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">Szerokość (m)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="0.00"
            className="bg-background/50"
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">Wysokość (m)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="0.00"
            className="bg-background/50"
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">m²</Label>
          <div className="h-10 flex items-center px-3 rounded-md bg-accent/50 font-semibold">
            {area.toFixed(2)}
          </div>
        </div>
        <Button
          onClick={handleAdd}
          size="icon"
          className="bg-primary hover:bg-primary/90"
          disabled={!width || !height || parseFloat(width) <= 0 || parseFloat(height) <= 0}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};
