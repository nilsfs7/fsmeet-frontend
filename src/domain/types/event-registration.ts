import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { EventRegistrationType } from './event-registration-type';
import { User } from './user';
import { Moment } from 'moment';

export type EventRegistration = {
  user: User;
  type: EventRegistrationType;
  status: EventRegistrationStatus;
  arrivalDate?: Moment;
  departureDate?: Moment;
  competitionSignUps: string[];
  accommodationOrders: string[];
  offeringOrders: string[];
  offeringTShirtSize: string;
  phoneCountryCode?: number;
  phoneNumber?: string;
};
