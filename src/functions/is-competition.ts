import { EventType } from '@/domain/enums/event-type';

export function isCompetition(eventRegistrationType: EventType): boolean {
  switch (eventRegistrationType) {
    case EventType.COMPETITION:
      return true;
    case EventType.COMPETITION_ONLINE:
      return true;
    default:
      return false;
  }
}
