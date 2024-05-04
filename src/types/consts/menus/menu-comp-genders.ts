import { CompetitionGender } from '@/types/enums/competition-gender';
import { MenuItem } from '../../menu-item';

export const menuCompGenders: MenuItem[] = [
  { text: 'Mixed', value: CompetitionGender.MIXED },
  { text: 'Female', value: CompetitionGender.FEMALE },
  { text: 'Male', value: CompetitionGender.MALE },
];
