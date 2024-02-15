import { EventState } from '@/types/enums/event-state';
import { MenuItem } from '../../menu-item';

export const menuEventStates: MenuItem[] = [
  { text: 'APPROVED', value: EventState.APPROVED },
  { text: 'ARCHIVED_HIDDEN', value: EventState.ARCHIVED_HIDDEN },
  { text: 'ARCHIVED_PUBLIC', value: EventState.ARCHIVED_PUBLIC },
  { text: 'CREATED', value: EventState.CREATED },
  { text: 'DENIED', value: EventState.DENIED },
  { text: 'WAITING_FOR_AP...', value: EventState.WAITING_FOR_APPROVAL },
];
