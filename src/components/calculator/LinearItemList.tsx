import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { LinearItem } from '@/types/calculator';
import { Button } from '@/components/ui/button';

interface LinearItemListProps {
  items: LinearItem[];
  onDelete: (id: string) => void;
  label: string;
  emptyMessage: string;
}

export const LinearItemList = ({ items, onDelete, label, emptyMessage }: LinearItemListProps) => {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-2">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-between gap-2 p-3 rounded-lg bg-muted/50 border border-border/30"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">#{index + 1}</span>
              <span className="font-medium">{item.length.toFixed(2)} mb</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};