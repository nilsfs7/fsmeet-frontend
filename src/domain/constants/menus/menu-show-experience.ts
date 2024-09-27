import { ShowExperience } from '@/domain/enums/show-experience';
import { MenuItem } from '@/types/menu-item';

export const menuShowExperience: MenuItem[] = [
  { text: '0', value: ShowExperience.NONE },
  { text: '1 - 5', value: ShowExperience.FEW },
  { text: '6 - 20', value: ShowExperience.MANY },
  { text: '20+', value: ShowExperience.EXPERIENCED },
];
