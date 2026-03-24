'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ActionButton from './action-button';
import { Action } from '../../domain/enums/action';

/**
 * Parses a value that may be ISO string, "HH:mm", or other date string
 * and returns { hours: 0-23, minutes: 0-59 } or null.
 */
function parseTimeValue(value: string | null | undefined): { hours: number; minutes: number } | null {
  if (value == null || value.trim() === '') return null;
  const trimmed = value.trim();
  const match = trimmed.match(/^\d{1,2}:(\d{2})$/);
  if (match) {
    const hours = Math.min(23, Math.max(0, parseInt(match[0].split(':')[0], 10)));
    const minutes = Math.min(59, Math.max(0, parseInt(match[1], 10)));
    return { hours, minutes };
  }
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;
  return {
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
  };
}

function formatTime(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export interface TimePickerProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function TimePicker({ value, onChange, className, disabled, id }: TimePickerProps) {
  const parsed = parseTimeValue(value ?? null);
  const [open, setOpen] = React.useState(false);
  const [hours, setHours] = React.useState(parsed?.hours ?? 0);
  const [minutes, setMinutes] = React.useState(parsed?.minutes ?? 0);

  // Sync internal state when value prop changes (e.g. when opening with existing value)
  React.useEffect(() => {
    const p = parseTimeValue(value ?? null);
    if (p) {
      setHours(p.hours);
      setMinutes(p.minutes);
    }
  }, [value, open]);

  const handleHoursChanged = (value: string) => {
    const v = parseInt(value, 10);
    setHours(v);
    onChange?.(formatTime(v, minutes));
  };

  const handleMinutesChanged = (value: string) => {
    const v = parseInt(value, 10);
    setMinutes(v);
    onChange?.(formatTime(hours, v));
  };

  const handleClearTimeClicked = () => {
    onChange?.(null);
    setOpen(false);
  };

  const handleSaveTimeClicked = () => {
    onChange?.(formatTime(hours, minutes));
    setOpen(false);
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const displayLabel = parsed ? formatTime(hours, minutes) : 'Pick time';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'min-w-[100px] justify-start text-left font-normal border-secondary-dark bg-background text-primary hover:border-primary hover:bg-background',
            !parsed && 'text-muted-foreground',
            className,
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3 border-secondary-dark bg-background text-primary" align="start" onOpenAutoFocus={e => e.preventDefault()}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Select value={String(hours).padStart(2, '0')} onValueChange={handleHoursChanged}>
              <SelectTrigger id="time-picker-hours" className="w-16 h-9 border-secondary-dark bg-background text-primary focus:ring-primary focus:ring-offset-0">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent className="border-secondary-dark bg-background text-primary max-h-48">
                {hourOptions.map(h => (
                  <SelectItem key={h} value={h} className="focus:bg-secondary focus:text-primary">
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-primary font-medium">:</span>
            <Select value={String(minutes).padStart(2, '0')} onValueChange={handleMinutesChanged}>
              <SelectTrigger id="time-picker-minutes" className="w-16 h-9 border-secondary-dark bg-background text-primary focus:ring-primary focus:ring-offset-0">
                <SelectValue placeholder="mm" />
              </SelectTrigger>
              <SelectContent className="border-secondary-dark bg-background text-primary max-h-48">
                {minuteOptions.map(m => (
                  <SelectItem key={m} value={m} className="focus:bg-secondary focus:text-primary">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between">
            <ActionButton action={Action.DELETE} disabled={!parsed} onClick={handleClearTimeClicked} />
            <ActionButton action={Action.SAVE} onClick={handleSaveTimeClicked} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
