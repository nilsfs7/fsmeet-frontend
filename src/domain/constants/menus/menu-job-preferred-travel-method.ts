import { JobPreferredTravelMethod } from '@/domain/enums/job-preferred-travel-method';
import { MenuItem } from '@/domain/types/menu-item';

export const menuJobPreferredTravelMethod: MenuItem[] = [
  { text: 'Public transport', value: JobPreferredTravelMethod.PUBLIC_TRANSPORT },
  { text: 'Car', value: JobPreferredTravelMethod.CAR },
];
