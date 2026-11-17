import { addDays, format } from 'date-fns';
import { MenuItem } from '@/domain/types/menu-item';
import { toDate } from '@/lib/date';

/** Every local day from `startDate` to `endDate`, both included. */
function enumerateDaysBetweenDates(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    dates.push(date);
  }
  return dates;
}

export function getMenuAvailableDays(dateFrom: string, dateTo: string): MenuItem[] {
  return enumerateDaysBetweenDates(toDate(dateFrom), toDate(dateTo)).map(date => {
    return { text: format(date, 'MM/dd'), value: format(date, 'yyyy-MM-dd') };
  });
}
