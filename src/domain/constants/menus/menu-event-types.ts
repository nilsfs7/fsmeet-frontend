import { MenuItem } from '@/domain/types/menu-item';
import { EventType } from '@/domain/enums/event-type';

export const menuEventTypes: MenuItem[] = [
  { text: 'Competition', value: EventType.COMPETITION },
  { text: 'Competition (online)', value: EventType.COMPETITION_ONLINE },
  { text: 'Meeting', value: EventType.MEETING },
];
