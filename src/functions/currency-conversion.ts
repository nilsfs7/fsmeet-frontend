import { CurrencyCode } from '@/domain/enums/currency-code';

/*
  docs: https://docs.stripe.com/currencies#minor-units
*/
export function getConversionRate(currencyCode: CurrencyCode): number {
  switch (currencyCode) {
    case CurrencyCode.AUD:
      return 100;
    case CurrencyCode.CAD:
      return 100;
    case CurrencyCode.CHF:
      return 100;
    case CurrencyCode.EUR:
      return 100;
    case CurrencyCode.GBP:
      return 100;
    case CurrencyCode.JPY:
      return 1;
    case CurrencyCode.USD:
      return 100;
    default:
      throw new Error(`Unsupported currency ${currencyCode}.`);
  }
}

export function convertCurrencyDecimalToInteger(value: number, currencyCode: CurrencyCode): number {
  const factor = getConversionRate(currencyCode);
  const result = value * factor;
  return +result.toFixed(0);
}

export function convertCurrencyIntegerToDecimal(value: number, currencyCode: CurrencyCode): number {
  const factor = getConversionRate(currencyCode);
  const result = value / factor;
  return +result.toFixed(2);
}
