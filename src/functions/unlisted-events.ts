import { Event } from '@/domain/types/event';
import { isPublicEventState } from '@/functions/event-state';

export function countUnlistedEvents(events: Event[]): number {
  return events.filter(event => !isPublicEventState(event.state)).length;
}

export function isBlockedByUnlistedEvents(events: Event[]): boolean {
  return countUnlistedEvents(events) >= 2;
}
