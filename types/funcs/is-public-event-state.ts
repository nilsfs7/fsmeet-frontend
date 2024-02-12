import { EventState } from '../enums/event-state';

export function isPublicEventState(eventState: EventState): boolean {
  switch (eventState) {
    case EventState.APPROVED:
      return true;
    case EventState.ARCHIVED_HIDDEN:
      return false;
    case EventState.ARCHIVED_PUBLIC:
      return true;
    case EventState.CREATED:
      return false;
    case EventState.DENIED:
      return false;
    case EventState.WAITING_FOR_APPROVAL:
      return false;
  }
}
