import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WorkTypeUnit } from '@/types/calculator';

interface LinearInputProps {
  onAdd: (length: number) => void;
  label: string;
  icon?: ReactNode;
  placeholder?: string;
  unit?: WorkTypeUnit;
}

export const LinearInput = ({
  onAdd,
  label,
  icon,
  placeholder = 'Długość (m)',
  unit = 'mb',
}: LinearInputProps) => {
  const [length, setLength] = useState<string>('');

  const unitLabel = unit === 'm2' ? 'm²' : unit === 'szt' ? 'szt.' : 'mb';
  const step = unit === 'szt' ? 1 : 0.01;

  const handleAdd = () => {
    const l = parseFloat(length);
    if (l > 0) {
      onAdd(l);
      setLength('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50"
    >
      {icon}
      <div className="flex items-center gap-3">
        <Input
          type="number"
          step={step}
          min="0"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          placeholder={placeholder}
          className="w-32 h-11 rounded-xl"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
          }}
        />
        <span className="text-sm text-muted-foreground">{unitLabel}</span>
      </div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={!length || parseFloat(length) <= 0}
          className="gap-2 h-10 px-4 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          {label}
        </Button>
      </motion.div>
    </motion.div>
  );
};
