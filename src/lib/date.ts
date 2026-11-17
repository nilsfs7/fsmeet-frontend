import { formatISO } from 'date-fns';

/** Anything `toDate` accepts: a Date, a date or ISO string, a timestamp, or nothing. */
export type DateLike = Date | string | number | null | undefined;

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Converts a Date, string or timestamp into a new Date (invalid input gives an Invalid Date):
 * - date-only strings (`2026-11-30`) are local midnight
 * - full ISO strings are parsed as-is
 */
export function toDate(value: DateLike): Date {
  if (value === null || value === undefined || value === '') return new Date(NaN);
  if (value instanceof Date) return new Date(value.getTime());
  if (typeof value === 'number') return new Date(value);

  const dateOnly = DATE_ONLY.exec(value);
  if (dateOnly) return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));

  return new Date(value);
}

export function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

/** Local time with offset, e.g. `2026-11-17T08:22:00+01:00`. */
export function toLocalIso(value: DateLike): string {
  const date = toDate(value);
  return isValidDate(date) ? formatISO(date) : '';
}

/** UTC without milliseconds, e.g. `2026-11-17T07:22:00Z`. */
export function toUtcIso(value: DateLike): string {
  const date = toDate(value);
  return isValidDate(date) ? date.toISOString().replace(/\.\d{3}Z$/, 'Z') : '';
}

/** UTC clock time, e.g. `14:30`. */
export function toUtcTime(value: DateLike): string {
  const date = toDate(value);
  return isValidDate(date) ? date.toISOString().slice(11, 16) : '';
}

/** `YYYY-MM` or `YYYY-MM-DD` as a local date (`YYYY-MM` means the 1st). Null when the string does not match. */
export function parseYearMonth(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value);
  if (!match) return null;
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  const date = new Date(Number(match[1]), month - 1, Number(match[3] ?? 1));
  return isValidDate(date) ? date : null;
}
