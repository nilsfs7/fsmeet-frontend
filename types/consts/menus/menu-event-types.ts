import { EventType } from '../../enums/event-type';
import { MenuItem } from '../../menu-item';

export const menuEventTypes: MenuItem[] = [
  { text: 'Competition', value: EventType.COMPETITION },
  { text: 'Meeting', value: EventType.MEETING },
];
