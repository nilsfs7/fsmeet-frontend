import { User } from '@/domain/types/user';
import { UserType } from '@/domain/enums/user-type';

/** Field-level problems that block saving the account settings. */
export type UserInfoErrors = Partial<Record<'website' | 'city', 'invalid' | 'required'>>;

const HOSTNAME = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

/**
 * Normalizes a website: trims, prefixes bare domains with https:// and drops a trailing slash.
 * Returns '' for empty input and `null` when it isn't a valid http(s) URL.
 */
export function normalizeWebsite(raw: string | undefined | null): string | null {
  const value = (raw ?? '').trim();
  if (!value) return '';
  if (/\s/.test(value)) return null;

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value);
  const candidate = hasScheme ? value : `https://${value.replace(/^\/+/, '')}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (!HOSTNAME.test(url.hostname) || url.username || url.password) return null;

  let normalized = hasScheme ? value : candidate;
  if (normalized.endsWith('/')) normalized = normalized.slice(0, -1);
  return normalized;
}

/** Frontend checks before PATCHing the user (the backend accepts both cases silently). */
export function validateUserInfo(user: Partial<User>): UserInfoErrors {
  const errors: UserInfoErrors = {};
  if (normalizeWebsite(user.website) === null) errors.website = 'invalid';
  // the pin is geocoded from the city on save; without one it would end up without a location
  if (user.type !== UserType.FAN && user.exposeLocation && !(user.city ?? '').trim()) errors.city = 'required';
  return errors;
}
