import { MenuItem } from '../../menu-item';
import { UserType } from '@/types/enums/user-type';

export const menuUserType: MenuItem[] = [
  { text: 'Freestyler', value: UserType.FREESTYLER },
  { text: 'Association', value: UserType.ASSOCIATION },
  { text: 'Brand', value: UserType.BRAND },
  { text: 'DJ', value: UserType.DJ },
  { text: 'MC', value: UserType.MC },
  { text: 'Media', value: UserType.MEDIA },
];
