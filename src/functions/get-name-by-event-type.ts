import { EventType } from '../domain/enums/event-type';

export function getNameByEventType(type: EventType): string {
  let eventTypeName: string = '';

  switch (type) {
    case EventType.COMPETITION:
      eventTypeName = 'Competition';
      break;
    case EventType.COMPETITION_ONLINE:
      eventTypeName = 'Online Competition';
      break;
    case EventType.MEETING:
      eventTypeName = 'Meeting';
      break;
  }

  return eventTypeName;
}
