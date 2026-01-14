import { motion } from 'framer-motion';
import { WorkType } from '@/types/calculator';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface WorkTypesListProps {
  workTypes: WorkType[];
  netArea: number;
  onToggle: (id: string) => void;
  onPriceChange: (id: string, price: number) => void;
}

export const WorkTypesList = ({ workTypes, netArea, onToggle, onPriceChange }: WorkTypesListProps) => {
  return (
    <div className="space-y-3">
      {workTypes.map((workType, index) => {
        const total = workType.enabled ? netArea * workType.pricePerMeter : 0;
        
        return (
          <motion.div
            key={workType.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              workType.enabled 
                ? 'bg-primary/5 border-primary/30 shadow-sm' 
                : 'bg-muted/30 border-border/30'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Switch
                  checked={workType.enabled}
                  onCheckedChange={() => onToggle(workType.id)}
                />
                <Label className={`font-medium transition-colors ${
                  workType.enabled ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {workType.name}
                </Label>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">
                    zł/m²
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={workType.pricePerMeter}
                    onChange={(e) => onPriceChange(workType.id, parseFloat(e.target.value) || 0)}
                    className="w-20 h-8 text-center bg-background/50"
                  />
                </div>
                
                {workType.enabled && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="min-w-24 text-right"
                  >
                    <span className="font-bold text-primary">
                      {total.toFixed(2)} zł
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
