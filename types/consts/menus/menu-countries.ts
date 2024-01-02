import { MenuItem } from '../../menu-item';
import type { ICountry } from 'countries-list';
import { countries, getCountryCode } from 'countries-list';

export const menuCountries: MenuItem[] = Object.values(countries).map((country: ICountry) => {
  return {
    text: country.name,
    value: getCountryCode(country.name) as string,
  };
});
