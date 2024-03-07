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
