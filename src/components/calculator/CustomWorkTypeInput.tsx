import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkTypeUnit } from '@/types/calculator';

interface CustomWorkTypeInputProps {
  onAdd: (name: string, unit: WorkTypeUnit, price: number) => void;
}

export const CustomWorkTypeInput = ({ onAdd }: CustomWorkTypeInputProps) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<WorkTypeUnit>('m2');
  const [price, setPrice] = useState('');

  const handleAdd = () => {
    if (name.trim() && parseFloat(price) >= 0) {
      onAdd(name.trim(), unit, parseFloat(price) || 0);
      setName('');
      setPrice('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-accent/5 border border-accent/20"
    >
      <p className="text-sm font-medium text-accent mb-3">Dodaj własną pracę</p>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[150px]">
          <label className="text-xs text-muted-foreground mb-1.5 block">Nazwa usługi</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. Gładź gipsowa"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="min-w-[100px]">
          <label className="text-xs text-muted-foreground mb-1.5 block">Jednostka</label>
          <Select value={unit} onValueChange={(v) => setUnit(v as WorkTypeUnit)}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="m2">m² (kwadratowe)</SelectItem>
              <SelectItem value="mb">mb (bieżące)</SelectItem>
              <SelectItem value="szt">szt. (sztuki)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[100px]">
          <label className="text-xs text-muted-foreground mb-1.5 block">Cena</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="h-11 rounded-xl w-20"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              zł/{unit === 'm2' ? 'm²' : unit === 'mb' ? 'mb' : 'szt.'}
            </span>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="h-11 px-5 rounded-xl gap-2 bg-accent hover:bg-accent/90"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Dodaj</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
