import { CurrencyCode } from '@/domain/enums/currency-code';

export function getCurrencySymbol(currencyCode: CurrencyCode): string {
  return currencyCode.toUpperCase();

  // switch (currencyCode) {
  //   case CurrencyCode.CHF:
  //     return '₣';
  //   case CurrencyCode.EUR:
  //     return '€';
  //   default:
  //     throw new Error(`Unsupported currency symbol.`);
  // }
}
