'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ServiceCategory } from '@/types';

interface ServiceCategorySelectProps {
  categories: ServiceCategory[];
  selectedId: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export default function ServiceCategorySelect({
  categories,
  selectedId,
  onChange,
  disabled = false,
}: ServiceCategorySelectProps) {
  return (
    <div className="flex items-center gap-3">
      <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        Active Category:
      </Label>
      <Select value={selectedId} onValueChange={(val) => { if (val) onChange(val); }} disabled={disabled}>
        <SelectTrigger className="w-[240px] bg-background border-border rounded-xl h-10">
          <SelectValue placeholder="Select service category" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border rounded-xl">
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id} className="cursor-pointer rounded-lg">
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
