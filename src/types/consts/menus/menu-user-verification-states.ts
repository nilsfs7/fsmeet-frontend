import { UserVerificationState } from '@/types/enums/user-verification-state';
import { MenuItem } from '../../menu-item';

export const menuUserVerificationStates: MenuItem[] = [
  { text: 'DENIED', value: UserVerificationState.DENIED },
  { text: 'NOT_VERIFIED', value: UserVerificationState.NOT_VERIFIED },
  { text: 'VERIFICATION_PENDING', value: UserVerificationState.VERIFICATION_PENDING },
  { text: 'VERIFIED', value: UserVerificationState.VERIFIED },
];
