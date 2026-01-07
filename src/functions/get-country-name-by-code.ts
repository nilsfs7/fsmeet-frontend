import { countries } from 'countries-list';

export function getCountryNameByCode(countryCode: string): string {
  // @ts-ignore: next-line
  const country = countries[countryCode.toUpperCase()];
  return country ? country.name : '';
}
