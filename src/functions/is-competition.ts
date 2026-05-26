import { EventType } from '@/domain/enums/event-type';

export function isCompetition(eventType: EventType): boolean {
  switch (eventType) {
    case EventType.COMPETITION:
      return true;
    case EventType.COMPETITION_ONLINE:
      return true;
    default:
      return false;
  }
}
