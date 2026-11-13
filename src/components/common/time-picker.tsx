'use client';

import * as React from 'react';
import { IconClock, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

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

/**
 * Native time input (keyboard + mobile wheel friendly). It deliberately avoids a popover: popovers opened
 * from inside our Radix dialogs lose focus to the dialog's focus trap, which made typing a time impossible.
 * Emits "HH:mm" or null, like the previous implementation.
 */
export function TimePicker({ value, onChange, className, disabled, id }: TimePickerProps) {
  const t = useTranslations('global/ui');
  const parsed = parseTimeValue(value ?? null);
  const inputValue = parsed ? formatTime(parsed.hours, parsed.minutes) : '';

  return (
    <div
      className={cn(
        'relative flex h-10 w-full min-w-[120px] items-center rounded-lg border border-input bg-background shadow-xs focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20',
        disabled && 'opacity-50',
        className,
      )}
    >
      <IconClock className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" stroke={1.75} aria-hidden />
      <input
        id={id}
        type="time"
        step={60}
        value={inputValue}
        disabled={disabled}
        aria-label={t('time')}
        onChange={e => {
          const v = e.currentTarget.value;
          const p = parseTimeValue(v);
          onChange?.(p ? formatTime(p.hours, p.minutes) : null);
        }}
        className="h-full w-full min-w-0 rounded-lg bg-transparent pl-9 pr-9 text-sm text-foreground outline-hidden [&::-webkit-calendar-picker-indicator]:hidden"
      />
      {parsed && !disabled && (
        <button
          type="button"
          onClick={() => onChange?.(null)}
          className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={t('clearTime')}
          title={t('clearTime')}
        >
          <IconX className="h-4 w-4" stroke={1.75} aria-hidden />
        </button>
      )}
    </div>
  );
}
