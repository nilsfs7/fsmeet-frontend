'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/custom/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateLong } from '@/lib/format-date';
import { isValidDate } from '@/lib/date';

interface IDatePicker {
  date: Date | undefined;
  fromDate: Date;
  toDate: Date;
  /** Month the calendar opens at when no date is selected (the selected date wins otherwise). */
  defaultMonth?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

/** Month to open: selected date, else `defaultMonth`, clamped into [fromDate, toDate] (otherwise react-day-picker starts at today/toDate). */
function openingMonth(date: Date | undefined, defaultMonth: Date | undefined, fromDate: Date, toDate: Date): Date | undefined {
  const base = date && isValidDate(date) ? date : defaultMonth && isValidDate(defaultMonth) ? defaultMonth : undefined;
  if (!base) return undefined;
  if (base < fromDate) return fromDate;
  if (base > toDate) return toDate;
  return base;
}

export const DatePicker = ({ date, fromDate, toDate, defaultMonth, onChange }: IDatePicker) => {
  const t = useTranslations('global/components/date-picker');
  const locale = useLocale();

  const handleValueChanged = (selected: Date | undefined) => {
    if (selected) {
      onChange && onChange(selected);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className={cn('w-[168px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">{date && isValidDate(date) ? formatDateLong(date, locale, false) : t('placeholder')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          defaultMonth={openingMonth(date, defaultMonth, fromDate, toDate)}
          selected={date && isValidDate(date) ? date : undefined}
          onSelect={handleValueChanged}
          fromDate={fromDate}
          toDate={toDate}
        />
      </PopoverContent>
    </Popover>
  );
};
