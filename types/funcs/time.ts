import moment from 'moment';

export const shortDateString = (unixTs: number, appendYear: boolean = true): string => {
  const date = moment.unix(unixTs);

  if (appendYear) {
    return moment(date).format('DD.MM.YY');
  } else {
    return moment(date).format('DD.MM.');
  }
};

export const formatTs = (unixTs: number, format: string): string => {
  const date = moment.unix(unixTs);

  return moment(date).format(format);
};
