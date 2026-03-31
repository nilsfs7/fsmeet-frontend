import { Moment } from 'moment';
import { EventRegistrationType } from './event-registration-type';
import { TShirtSize } from '../enums/t-shirt-size';

export type EventRegistrationInfo = {
  eventId?: string;
  registrationType?: EventRegistrationType;
  arrivalDate: Moment | undefined;
  departureDate: Moment | undefined;
  compSignUps: string[];
  accommodationOrders: string[];
  offeringOrders: string[];
  offeringTShirtSize: TShirtSize | null;
};
