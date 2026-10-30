import { Event } from '@/domain/types/event';
import { isPublicEventState } from '@/functions/event-state';

export const UNLISTED_EVENTS_CREATE_MESSAGE = 'Cannot create another event while 2 or more of your events are not listed.';

export function countUnlistedEvents(events: Event[]): number {
  return events.filter(event => !isPublicEventState(event.state)).length;
}

export function isBlockedByUnlistedEvents(events: Event[]): boolean {
  return countUnlistedEvents(events) >= 2;
}
