import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AreaInputProps {
  onAdd: (area: number) => void;
  label: string;
  icon?: ReactNode;
}

export const AreaInput = ({ onAdd, label, icon }: AreaInputProps) => {
  const [area, setArea] = useState('');

  const handleAdd = () => {
    const a = parseFloat(area);
    if (a > 0) {
      onAdd(a);
      setArea('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-muted/30 border border-border/50"
    >
      <div className="flex flex-wrap items-end gap-3">
        {icon && <div className="hidden sm:block">{icon}</div>}
        <div className="flex-1 min-w-[150px]">
          <label className="text-xs text-muted-foreground mb-1.5 block">Powierzchnia (m²)</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="0.00"
            className="h-11 rounded-xl"
          />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleAdd}
            disabled={!area || parseFloat(area) <= 0}
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
