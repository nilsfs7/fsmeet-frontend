import { Event } from '@/types/event';
import { validateSession } from './validate-session';

export function isEventAdmin(event: Event | undefined, session: any): boolean {
  if (!event || !validateSession(session)) {
    return false;
  }

  if (event.admin === session?.user?.username) {
    return true;
  }

  return false;
}
