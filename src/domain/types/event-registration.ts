import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { EventRegistrationType } from './event-registration-type';
import { User } from './user';
import { Moment } from 'moment';
import { TShirtSize } from '../enums/t-shirt-size';

export type EventRegistration = {
  user: User;
  type: EventRegistrationType;
  status: EventRegistrationStatus;
  arrivalDate?: Moment | null;
  departureDate?: Moment | null;
  competitionSignUps: string[];
  accommodationOrders: string[];
  offeringOrders: string[];
  offeringTShirtSize: TShirtSize | null;
  phoneCountryCode?: number;
  phoneNumber?: string;
};
