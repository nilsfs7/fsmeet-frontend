import { MenuItem } from '@/domain/types/menu-item';
import { EventCategory } from '@/domain/enums/event-category';

export const menuEventCategories = (showWffaOptions: boolean): MenuItem[] => {
  const base = [
    { text: 'Continental', value: EventCategory.CONTINENTAL },
    { text: 'International Open', value: EventCategory.INTERNATIONAL },
    { text: 'National', value: EventCategory.NATIONAL },
  ];

  const wffaSpecific = [
    { text: 'Pulse', value: EventCategory.PULSE },
    { text: 'Super Ball', value: EventCategory.SUPERBALL },
    { text: 'WFFC', value: EventCategory.WFFC },
  ];

  return showWffaOptions ? base.concat(wffaSpecific) : base;
};
