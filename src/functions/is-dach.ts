export function isDACH(country: string): boolean {
  country = country.toUpperCase();
  if (country === 'AT' || country === 'CH' || country === 'DE') return true;
  return false;
}
