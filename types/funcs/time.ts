import moment, { Moment } from 'moment';

export const getShortDateString = (timestamp: Moment, appendYear: boolean = true): string => {
  if (appendYear) {
    return moment(timestamp).format('DD.MM.YY');
  } else {
    return moment(timestamp).format('DD.MM.');
  }
};

export const getTimeString = (timestamp: Moment): string => {
  return timestamp.format('HH:mm');
};

export const formatTs = (timestamp: Moment, format: string): string => {
  return moment(timestamp).format(format);
};

export const timeMin = (timestamp: Moment): Moment => {
  return timestamp.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
};

export const timeMax = (timestamp: Moment): Moment => {
  return timestamp.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
};
