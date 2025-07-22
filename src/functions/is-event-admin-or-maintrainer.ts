import { Event } from '@/domain/types/event';
import { validateSession } from './validate-session';

export function isEventAdminOrMaintainer(event: Event | undefined, session: any): boolean {
  if (!event || !validateSession(session)) {
    return false;
  }

  if (event.admin === session?.user?.username) {
    return true;
  }

  if (
    event.maintainers.filter(maintainer => {
      return session?.user?.username === maintainer.username;
    }).length === 1
  ) {
    return true;
  }

  return false;
}
