import { EventType } from '../../../domain/enums/event-type';
import { MenuItem } from '../../menu-item';

export const menuEventTypes: MenuItem[] = [
  { text: 'Competition', value: EventType.COMPETITION },
  { text: 'Competition (online)', value: EventType.COMPETITION_ONLINE },
  { text: 'Meeting', value: EventType.MEETING },
];
