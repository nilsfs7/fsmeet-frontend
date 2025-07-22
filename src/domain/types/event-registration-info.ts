import { EventRegistrationType } from './event-registration-type';

export type EventRegistrationInfo = {
  eventId?: string;
  registrationType?: EventRegistrationType;
  compSignUps: string[];
  accommodationOrders: string[];
  offeringOrders: string[];
  offeringTShirtSize: string;
};
