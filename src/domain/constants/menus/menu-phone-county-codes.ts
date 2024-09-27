import { MenuItem } from '../../menu-item';
import type { ICountry } from 'countries-list';
import { countries } from 'countries-list';

const entries = Object.values(countries).map((country: ICountry) => {
  return {
    text: `${country.name} (+${country.phone.toString()})`,
    value: country.phone.toString(),
  };
});

export const menuPhoneCountryCodesWithUnspecified: MenuItem[] = [{ text: 'not specified', value: '--' }].concat(entries);
