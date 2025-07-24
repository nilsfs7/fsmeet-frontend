import { MenuItem } from '@/domain/types/menu-item';
import { EventCategory } from '@/domain/enums/event-category';

export const menuEventCategories: MenuItem[] = [
  { text: 'Continental', value: EventCategory.CONTINENTAL },
  { text: 'International', value: EventCategory.INTERNATIONAL },
  { text: 'National', value: EventCategory.NATIONAL },
  { text: 'Pulse', value: EventCategory.PULSE },
  { text: 'RBSS', value: EventCategory.RBSS },
  { text: 'Super Ball', value: EventCategory.SUPERBALL },
  { text: 'WFFC', value: EventCategory.WFFC },
];
