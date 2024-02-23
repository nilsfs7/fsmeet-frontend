import moment, { Moment } from 'moment';

export function getShortDateString(timestamp: Moment, appendYear: boolean = true): string {
  if (appendYear) {
    return moment(timestamp).format('DD.MM.YY');
  } else {
    return moment(timestamp).format('DD.MM.');
  }
}

export function getTimeString(timestamp: Moment): string {
  return timestamp.format('HH:mm');
}

export function formatTs(timestamp: Moment, format: string): string {
  return moment(timestamp).format(format);
}

export function timeMin(timestamp: Moment): Moment {
  return timestamp.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
}

export function timeMid(timestamp: Moment): Moment {
  return timestamp.set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
}

export function timeMax(timestamp: Moment): Moment {
  return timestamp.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
}
