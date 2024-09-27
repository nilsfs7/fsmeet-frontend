import { Gender } from '@/domain/enums/gender';
import { MenuItem } from '../../menu-item';

export const menuGender: MenuItem[] = [
  { text: 'Female', value: Gender.FEMALE },
  { text: 'Male', value: Gender.MALE },
];

export const menuGenderWithUnspecified: MenuItem[] = [
  { text: 'not specified', value: '--' },
  { text: 'Female', value: Gender.FEMALE },
  { text: 'Male', value: Gender.MALE },
];
