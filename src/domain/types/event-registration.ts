import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { EventRegistrationType } from './event-registration-type';
import { User } from './user';

export type EventRegistration = {
  user: User;
  type: EventRegistrationType;
  status: EventRegistrationStatus;
  competitionSignUps: string[];
  accommodationOrders: string[];
  offeringOrders: string[];
  offeringTShirtSize: string;
  phoneCountryCode?: number;
  phoneNumber?: string;
};
