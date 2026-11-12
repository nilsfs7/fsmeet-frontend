import { CompetitionGender } from '@/domain/enums/competition-gender';
import { CompetitionType } from '@/domain/enums/competition-type';
import { MaxAge } from '@/domain/enums/max-age';
import { User } from './user';

export type Competition = {
  id: string | undefined;
  eventId: string | undefined;
  index: number | undefined;
  name: string;
  /** Public alias, unique within the event. Empty/undefined when not set. */
  alias?: string | null;
  type: CompetitionType;
  gender: CompetitionGender;
  maxAge: MaxAge;
  maxAmountParticipants: number;
  isFollowUpCompetition: boolean;
  participationFee: number;
  participationFeeIncPaymentCosts: number;
  description: string;
  rules: string;
  judges: User[];
  registrationEnabled: boolean;
};
