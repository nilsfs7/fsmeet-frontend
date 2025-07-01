import { EventState } from '@/domain/enums/event-state';

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

export function isArchivedEventState(eventState: EventState): boolean {
  switch (eventState) {
    case EventState.ARCHIVED_HIDDEN:
      return true;
    case EventState.ARCHIVED_PUBLIC:
      return true;
    default:
      return false;
  }
}
