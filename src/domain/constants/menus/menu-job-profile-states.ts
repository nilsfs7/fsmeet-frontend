import { JobProfileState } from '@/domain/enums/job-profile-state';
import { MenuItem } from '@/domain/types/menu-item';

export const menuJobProfileStates: MenuItem[] = [
  { text: 'APPROVED', value: JobProfileState.APPROVED },
  { text: 'DENIED', value: JobProfileState.DENIED },
  { text: 'NOT_APPROVED', value: JobProfileState.NOT_APPROVED },
  { text: 'PENDING', value: JobProfileState.PENDING },
];
