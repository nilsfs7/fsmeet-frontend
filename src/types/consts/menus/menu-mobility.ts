import { MenuItem } from '../../menu-item';
import { Mobility } from '@/types/enums/mobility';

export const menuMobility: MenuItem[] = [
  { text: 'Public Transport', value: Mobility.PUBLIC },
  { text: 'Public Transport & Car', value: Mobility.PUBLIC_AND_PRIVATE },
];
