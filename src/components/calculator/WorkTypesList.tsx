import { motion } from 'framer-motion';
import { WorkType, WorkTypeUnit } from '@/types/calculator';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { CustomWorkTypeInput } from './CustomWorkTypeInput';
import { Trash2 } from 'lucide-react';

interface WorkTypesListProps {
  workTypes: WorkType[];
  getQuantity: (workType: WorkType) => number;
  onToggle: (id: string) => void;
  onPriceChange: (id: string, price: number) => void;
  onAddCustom: (name: string, unit: WorkTypeUnit, price: number) => void;
  onDelete: (id: string) => void;
}

export const WorkTypesList = ({ 
  workTypes, 
  getQuantity, 
  onToggle, 
  onPriceChange,
  onAddCustom,
  onDelete 
}: WorkTypesListProps) => {
  return (
    <div className="space-y-3">
      {workTypes.map((workType, index) => {
        const quantity = getQuantity(workType);
        const total = workType.enabled ? quantity * workType.pricePerMeter : 0;
        const unitLabel = workType.unit === 'm2' ? 'zł/m²' : workType.unit === 'mb' ? 'zł/mb' : 'zł/szt.';
        const quantityLabel = workType.unit === 'm2' ? 'm²' : workType.unit === 'mb' ? 'mb' : 'szt.';
        
        return (
          <motion.div
            key={workType.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, type: 'spring', stiffness: 200, damping: 20 }}
            className={`p-4 rounded-2xl border transition-all duration-300 ${
              workType.enabled 
                ? 'bg-primary/5 border-primary/20 shadow-sm' 
                : 'bg-muted/20 border-border/30'
            }`}
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                <Switch
                  checked={workType.enabled}
                  onCheckedChange={() => onToggle(workType.id)}
                  className="data-[state=checked]:bg-primary"
                />
                <div className="flex flex-col">
                  <span className={`font-medium transition-colors ${
                    workType.enabled ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {workType.name}
                    {workType.isCustom && (
                      <span className="ml-2 text-xs text-accent">(własna)</span>
                    )}
                  </span>
                  {workType.enabled && quantity > 0 && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs text-muted-foreground"
                    >
                      {quantity.toFixed(2)} {quantityLabel}
                    </motion.span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={workType.pricePerMeter || ''}
                    onChange={(e) => onPriceChange(workType.id, parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-20 h-10 text-center rounded-xl"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {unitLabel}
                  </span>
                </div>
                
                {workType.enabled && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="min-w-[100px] text-right"
                  >
                    <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {total.toFixed(2)} zł
                    </span>
                  </motion.div>
                )}

                {workType.isCustom && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(workType.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
      
      <div className="mt-4">
        <CustomWorkTypeInput onAdd={onAddCustom} />
      </div>
    </div>
  );
};
