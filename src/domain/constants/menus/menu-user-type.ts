import { MenuItem } from '@/domain/types/menu-item';
import { UserType } from '@/domain/enums/user-type';

export const menuUserType: MenuItem[] = [
  { text: 'Freestyler', value: UserType.FREESTYLER },
  { text: 'Association', value: UserType.ASSOCIATION },
  { text: 'Brand', value: UserType.BRAND },
  { text: 'DJ', value: UserType.DJ },
  { text: 'MC', value: UserType.MC },
  { text: 'Media', value: UserType.MEDIA },
  { text: 'Event Organizer', value: UserType.EVENT_ORGANIZER },
  { text: 'Fan / Family Member / Supporter', value: UserType.FAN },
];
