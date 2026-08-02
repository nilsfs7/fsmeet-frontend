/** Absolute site origin from NEXTAUTH_URL (no trailing slash). */
export function getSiteUrl(): string {
  const raw = process.env.NEXTAUTH_URL || 'https://fsmeet.com';
  return raw.replace(/\/$/, '');
}

/** Resolve relative paths against the site origin; leave absolute URLs unchanged. */
export function toAbsoluteUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${getSiteUrl()}${url}`;
  return url;
}

export function truncateMetaDescription(text: string, maxLength = 160): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`;
}
