import { Gender } from '@/domain/enums/gender';
import { MenuItem } from '@/domain/types/menu-item';

export const menuGender: MenuItem[] = [
  { text: 'Female', value: Gender.FEMALE },
  { text: 'Male', value: Gender.MALE },
];

// TODO: remove menuGenderWithUnspecified. Only here until every user has a gender set
export const menuGenderWithUnspecified: MenuItem[] = [
  { text: 'not specified', value: '--' },
  { text: 'Female', value: Gender.FEMALE },
  { text: 'Male', value: Gender.MALE },
];
