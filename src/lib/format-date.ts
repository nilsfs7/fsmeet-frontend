import { format } from 'date-fns';
import { DateLike, isValidDate, toDate } from '@/lib/date';

/** App locales are country-style codes (`gb`, `de`, `jp`, …); map them to BCP 47 tags for `Intl`. */
const LOCALE_TAGS: Record<string, string> = {
  gb: 'en-GB',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  jp: 'ja-JP',
  cn: 'zh-CN',
  sa: 'ar-SA-u-ca-gregory',
  in: 'hi-IN',
  my: 'ms-MY',
};

export function toIntlLocale(appLocale: string | undefined): string {
  return LOCALE_TAGS[(appLocale || 'gb').toLowerCase()] || 'en-GB';
}

/** Human date like "Sat, 30 Nov 2026" in the user's language. */
export function formatDateLong(date: Date, appLocale: string | undefined, withWeekday = true): string {
  return new Intl.DateTimeFormat(toIntlLocale(appLocale), { ...(withWeekday ? { weekday: 'short' } : {}), day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

/** Date range like "30 Nov – 1 Dec 2026" (falls back to a single date when both days match). */
export function formatDateRange(from: Date, to: Date, appLocale: string | undefined): string {
  const fmt = new Intl.DateTimeFormat(toIntlLocale(appLocale), { day: 'numeric', month: 'short', year: 'numeric' });
  return fmt.formatRange(from, to);
}

/** Short date like `30.11.26`, or `30.11.` without the year. Empty string for missing or invalid input. */
export function getShortDateString(timestamp: DateLike, appendYear: boolean = true): string {
  const date = toDate(timestamp);
  if (!isValidDate(date)) return '';
  return format(date, appendYear ? 'dd.MM.yy' : 'dd.MM.');
}
