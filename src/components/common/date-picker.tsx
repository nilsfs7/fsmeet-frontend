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
  onChange?: (date: Moment) => void;
  className?: string;
}

export const DatePicker = ({ date, fromDate, toDate, onChange }: IDatePicker) => {
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
        <Calendar mode="single" captionLayout="dropdown-buttons" selected={date?.toDate()} onSelect={handleValueChanged} fromDate={fromDate.toDate()} toDate={toDate.toDate()} />
      </PopoverContent>
    </Popover>
  );
};
