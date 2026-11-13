/** Appends `callbackUrl` (as received in the query, i.e. already decoded once) to an internal route, if present. */
export function withCallbackUrl(route: string, callbackUrl?: string | null): string {
  if (!callbackUrl) return route;
  return `${route}${route.includes('?') ? '&' : '?'}callbackUrl=${encodeURIComponent(callbackUrl)}`;
}
