/**
 * Routes for organizers / owners that require a session. Logged-out visitors are sent to the login page
 * (with a callbackUrl back to the requested page) by the `authorized` callback in `src/auth.ts`.
 *
 * Public on purpose: event details (/events/[eventId]), competition pages (/events/[eventId]/comps/[compId]),
 * registration pages and the arena display screen (/events/[eventId]/arena-screen/preview, opened on
 * separate display devices and served by a public endpoint).
 */
const eventManagementSubroutes: RegExp[] = [
  /^\/edit$/,
  /^\/attendees$/,
  /^\/stats$/,
  /^\/feedback$/,
  /^\/pro(\/.*)?$/,
  /^\/arena-screen$/,
  /^\/comps$/,
  /^\/comps\/create$/,
  /^\/comps\/[^/]+\/edit(\/.*)?$/,
  /^\/(accommodations|offerings|attachments|sponsors)(\/.*)?$/,
];

export function isManagementRoute(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  if (path === '/ads' || path.startsWith('/ads/')) return true;

  const eventMatch = path.match(/^\/events\/[^/]+(\/.*)$/);
  if (eventMatch) {
    return eventManagementSubroutes.some(route => route.test(eventMatch[1]));
  }

  return false;
}
