import { Gender } from '@/domain/enums/gender';
import { MenuItem } from '@/domain/types/menu-item';

export const menuGender: MenuItem[] = [
  { text: 'Female', value: Gender.FEMALE },
  { text: 'Male', value: Gender.MALE },
];
