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
