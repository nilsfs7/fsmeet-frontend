import { countries } from 'countries-list';

export function getCountryNameByCode(code: string): string {
  // @ts-ignore: next-line
  const country = countries[code.toUpperCase()];
  return country ? country.name : null;
}
