import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Item {
  id: string;
  width: number;
  height: number;
  area: number;
}

interface ItemListProps {
  items: Item[];
  onDelete: (id: string) => void;
  label: string;
  emptyMessage: string;
}

export const ItemList = ({ items, onDelete, label, emptyMessage }: ItemListProps) => {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic text-center py-2">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-3 rounded-lg bg-accent/30 border border-border/30"
          >
            <span className="text-sm font-medium">
              {label} #{index + 1}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                {item.width}m × {item.height}m
              </span>
              <span className="font-semibold text-primary">
                {item.area.toFixed(2)} m²
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
