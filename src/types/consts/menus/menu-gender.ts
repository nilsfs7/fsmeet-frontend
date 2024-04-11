import { Gender } from '@/types/enums/gender';
import { MenuItem } from '../../menu-item';

export const menuGender: MenuItem[] = [
  { text: 'not specified', value: '--' },
  { text: 'Female', value: Gender.FEMALE },
  { text: 'Male', value: Gender.MALE },
];

export const menuGenderWithBoth: MenuItem[] = [
  { text: 'Female & Male', value: '--' },
  { text: 'Female', value: Gender.FEMALE },
  { text: 'Male', value: Gender.MALE },
];
