import { CurrencyCode } from '@/domain/enums/currency-code';
import { MenuItem } from '@/types/menu-item';

const entries = Object.entries(CurrencyCode).map(([key, value]) => {
  return {
    text: key,
    value: value.toString(),
  };
});

export const menuCurrencies: MenuItem[] = entries;
