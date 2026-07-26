import { JobProfileListingState } from '@/domain/enums/job-profile-listing-state';
import { MenuItem } from '@/domain/types/menu-item';

export const menuJobProfileListingStates: MenuItem[] = [
  { text: 'APPROVED', value: JobProfileListingState.APPROVED },
  { text: 'DENIED', value: JobProfileListingState.DENIED },
  { text: 'NOT_LISTED', value: JobProfileListingState.NOT_LISTED },
  { text: 'PENDING', value: JobProfileListingState.PENDING },
];
