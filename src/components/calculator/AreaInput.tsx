import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AreaInputProps {
  onAdd: (area: number) => void;
  label: string;
  icon?: ReactNode;
  compact?: boolean;
}

export const AreaInput = ({ onAdd, label, icon, compact = false }: AreaInputProps) => {
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
      className={`p-4 rounded-2xl bg-muted/30 border border-border/50 ${compact ? 'w-full sm:w-fit' : ''}`}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="hidden sm:block">{icon}</div>}
        <div className={compact ? "w-[120px]" : "flex-1 min-w-[120px] max-w-[180px]"}>
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
        <span className="text-sm text-muted-foreground">m²</span>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleAdd}
            disabled={!area || parseFloat(area) <= 0}
            className="h-11 px-5 rounded-xl gap-2"
          >
            <Plus className="h-4 w-4" />
            {label}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
