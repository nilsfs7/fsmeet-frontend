'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * Parses a value that may be ISO string, "HH:mm", or other date string
 * and returns "HH:mm" for the native time input, or empty string if invalid.
 */
function toTimeValue(value: string | null | undefined): string {
  if (value == null || value === '') return '';
  const trimmed = value.trim();
  // Already HH:mm or H:mm
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) return trimmed;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return '';
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
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
  const timeValue = toTimeValue(value ?? null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange?.(v === '' ? null : v);
  };

  return (
    <Input
      type="time"
      id={id}
      value={timeValue}
      onChange={handleChange}
      disabled={disabled}
      className={cn('min-w-[100px]', className)}
    />
  );
}
