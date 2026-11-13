'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ICheckBoxInput {
  id: string;
  label: string;
  value?: boolean;
  disabled?: boolean;
  onChange?: (event: any) => void;
}

/** Checkbox as a full-width tappable row (checkbox first, label next to it). */
const CheckBox = ({ id, label, value, disabled = false, onChange }: ICheckBoxInput) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex min-h-11 w-full min-w-0 items-center gap-3 rounded-xl border px-3 py-2 text-sm font-medium leading-snug transition-colors',
        value ? 'border-brand/40 bg-brand-soft/50 text-foreground' : 'border-border bg-background text-foreground hover:bg-muted/60',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      )}
    >
      <Checkbox id={id} checked={value} disabled={disabled} onCheckedChange={() => onChange?.({})} className="shrink-0" />
      <span className="min-w-0">{label}</span>
    </label>
  );
};

export default CheckBox;
