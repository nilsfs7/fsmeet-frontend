import { User } from '@/domain/types/user';
import type { UserInfoErrors } from '@/functions/validate-user-info';

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

/** Fired by the save button when frontend validation blocks saving; the tabs show the inline errors and jump to the field. */
export const USER_SAVE_BLOCKED_EVENT = 'fsmeet:user-save-blocked';

export function dispatchUserSaveBlocked(errors: UserInfoErrors) {
  window.dispatchEvent(new CustomEvent<UserInfoErrors>(USER_SAVE_BLOCKED_EVENT, { detail: errors }));
}

export function onUserSaveBlocked(listener: (errors: UserInfoErrors) => void): () => void {
  const handler = (e: Event) => listener((e as CustomEvent<UserInfoErrors>).detail);
  window.addEventListener(USER_SAVE_BLOCKED_EVENT, handler);
  return () => window.removeEventListener(USER_SAVE_BLOCKED_EVENT, handler);
}
