import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { LinearItem, WorkTypeUnit } from '@/types/calculator';

interface LinearItemListProps {
  items: LinearItem[];
  onDelete: (id: string) => void;
  label: string;
  emptyMessage: string;
  unit?: WorkTypeUnit;
}

export const LinearItemList = ({ items, onDelete, label, emptyMessage, unit = 'mb' }: LinearItemListProps) => {
  const unitLabel = unit === 'm2' ? 'm²' : unit === 'mb' ? 'mb' : 'szt.';
  
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-3">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border/50 shadow-sm"
          >
            <span className="text-xs text-muted-foreground">#{index + 1}</span>
            <span className="font-semibold">{item.length.toFixed(2)} {unitLabel}</span>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(item.id)}
              className="ml-1 p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};