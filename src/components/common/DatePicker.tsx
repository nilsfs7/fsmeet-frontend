'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Moment } from 'moment';
import moment from 'moment';

interface IDatePicker {
  date: Moment;
  onChange?: (date: Moment) => void;
  className?: string;
}

export const DatePicker = ({ date, onChange }: IDatePicker) => {
  const handleValueChanged = (date: any) => {
    if (date) {
      onChange && onChange(moment(date));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className={cn('w-[140px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date && date.isValid() ? format(date.toDate(), 'PP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date.toDate()} onSelect={handleValueChanged} initialFocus />
      </PopoverContent>
    </Popover>
  );
};
