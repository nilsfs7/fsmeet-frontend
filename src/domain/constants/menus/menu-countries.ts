import { MenuItem } from '@/types/menu-item';
import type { ICountry } from 'countries-list';
import { countries, getCountryCode } from 'countries-list';

const entries = Object.values(countries).map((country: ICountry) => {
  return {
    text: country.name,
    value: getCountryCode(country.name) as string,
  };
});

export const menuCountriesWithUnspecified: MenuItem[] = [{ text: 'not specified', value: '--' }].concat(entries);

export const menuCountries: MenuItem[] = entries;
