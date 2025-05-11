export function convertCurrencyDecimalToInteger(value: number, currencyCode: string): number {
  let factor = 1;

  switch (currencyCode) {
    case 'EUR':
      factor = 100;
      break;
    default:
      throw new Error(`Unsupported currency ${currencyCode}.`);
  }

  const result = value * factor;
  return +result.toFixed(0);
}

export function convertCurrencyIntegerToDecimal(value: number, currencyCode: string): number {
  let factor = 1;

  switch (currencyCode) {
    case 'EUR':
      factor = 100;
      break;
    default:
      throw new Error(`Unsupported currency ${currencyCode}.`);
  }

  const result = value / factor;
  return +result.toFixed(2);
}
