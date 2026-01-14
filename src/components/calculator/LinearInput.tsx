import { useState, ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LinearInputProps {
  onAdd: (length: number) => void;
  label: string;
  icon?: ReactNode;
}

export const LinearInput = ({ onAdd, label, icon }: LinearInputProps) => {
  const [length, setLength] = useState<string>('');

  const handleAdd = () => {
    const l = parseFloat(length);
    if (l > 0) {
      onAdd(l);
      setLength('');
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
      {icon}
      <div className="flex items-center gap-2">
        <Input
          type="number"
          step="0.01"
          min="0"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          placeholder="Długość (m)"
          className="w-28 bg-background/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
          }}
        />
        <span className="text-sm text-muted-foreground">mb</span>
      </div>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleAdd}
        disabled={!length || parseFloat(length) <= 0}
        className="gap-1"
      >
        <Plus className="h-4 w-4" />
        {label}
      </Button>
    </div>
  );
};