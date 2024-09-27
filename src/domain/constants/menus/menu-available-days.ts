import moment from 'moment';
import { MenuItem } from '../../menu-item';
import { Moment } from 'moment';

function enumerateDaysBetweenDates(startDate: Moment, endDate: Moment) {
  const dates: Moment[] = [];
  let date: Moment = startDate.clone();

  while (date.isSameOrBefore(endDate)) {
    dates.push(date.clone());
    date.add(1, 'days');
  }

  return dates;
}

export function getMenuAvailableDays(dateFrom: string, dateTo: string): MenuItem[] {
  return enumerateDaysBetweenDates(moment(dateFrom), moment(dateTo)).map((date) => {
    return { text: date.format('MM/DD'), value: date.format('YYYY-MM-DD') };
  });
}
