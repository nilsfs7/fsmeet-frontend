/** Public origin of the current request (behind the reverse proxy `request.url` is the internal `localhost:<port>`). */
export function getRequestOrigin(h: Headers): string {
  const host = h.get('x-forwarded-host')?.split(',')[0]?.trim() || h.get('host') || 'fsmeet.com';
  const proto = h.get('x-forwarded-proto')?.split(',')[0]?.trim() || (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${proto}://${host}`;
}
