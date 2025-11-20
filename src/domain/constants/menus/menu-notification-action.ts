import { MenuItem } from '@/domain/types/menu-item';
import { NotificationAction } from '../../enums/notification-action';

export const menuNotificationActions: MenuItem[] = [
  { text: 'Competition', value: NotificationAction.COMPETITION },
  { text: 'Event', value: NotificationAction.EVENT },
  { text: 'Event Comment', value: NotificationAction.EVENT_COMMENT },
  { text: 'Home', value: NotificationAction.HOME },
  { text: 'Map', value: NotificationAction.MAP },
  { text: 'User', value: NotificationAction.USER },
];
