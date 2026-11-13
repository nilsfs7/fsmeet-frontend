import { User } from '@/domain/types/user';

/**
 * The save button lives outside the settings tabs (in the bottom navigation), so the tabs learn about
 * server-derived values of a successful save (e.g. the geocoded location of the city) through this window event.
 */
export const USER_SAVED_EVENT = 'fsmeet:user-saved';

export function dispatchUserSaved(user: User) {
  window.dispatchEvent(new CustomEvent<User>(USER_SAVED_EVENT, { detail: user }));
}

export function onUserSaved(listener: (user: User) => void): () => void {
  const handler = (e: Event) => listener((e as CustomEvent<User>).detail);
  window.addEventListener(USER_SAVED_EVENT, handler);
  return () => window.removeEventListener(USER_SAVED_EVENT, handler);
}
