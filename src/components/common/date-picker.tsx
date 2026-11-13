'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/custom/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Moment } from 'moment';
import moment from 'moment';
import { formatDateLong } from '@/lib/format-date';

interface IDatePicker {
  date: Moment | undefined;
  fromDate: Moment;
  toDate: Moment;
  /** Month the calendar opens at when no date is selected (the selected date wins otherwise). */
  defaultMonth?: Moment;
  onChange?: (date: Moment) => void;
  className?: string;
}

/** Month to open: selected date, else `defaultMonth`, clamped into [fromDate, toDate] (otherwise react-day-picker starts at today/toDate). */
function openingMonth(date: Moment | undefined, defaultMonth: Moment | undefined, fromDate: Moment, toDate: Moment): Date | undefined {
  const base = date && date.isValid() ? date : defaultMonth && defaultMonth.isValid() ? defaultMonth : undefined;
  if (!base) return undefined;
  if (base.isBefore(fromDate)) return fromDate.toDate();
  if (base.isAfter(toDate)) return toDate.toDate();
  return base.toDate();
}

export const DatePicker = ({ date, fromDate, toDate, defaultMonth, onChange }: IDatePicker) => {
  const t = useTranslations('global/components/date-picker');
  const locale = useLocale();

  const handleValueChanged = (date: any) => {
    if (date) {
      onChange && onChange(moment(date));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className={cn('w-[168px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">{date && date.isValid() ? formatDateLong(date.toDate(), locale, false) : t('placeholder')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          defaultMonth={openingMonth(date, defaultMonth, fromDate, toDate)}
          selected={date && date.isValid() ? date.toDate() : undefined}
          onSelect={handleValueChanged}
          fromDate={fromDate.toDate()}
          toDate={toDate.toDate()}
        />
      </PopoverContent>
    </Popover>
  );
};
