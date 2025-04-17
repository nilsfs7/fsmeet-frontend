import { EventRegistrationType } from '@/types/event-registration-type';

export class CreateEventRegistrationBodyDto {
  eventRegistrationType: EventRegistrationType;
  compSignUps: string[];
  accommodationOrders: string[];
  offeringOrders: string[];
  offeringTShirtSize: string;

  constructor(eventRegistrationType: EventRegistrationType, compSignUps: string[], accommodationOrders: string[], offeringOrders: string[], offeringTShirtSize: string) {
    this.eventRegistrationType = eventRegistrationType;
    this.compSignUps = compSignUps;
    this.accommodationOrders = accommodationOrders;
    this.offeringOrders = offeringOrders;
    this.offeringTShirtSize = offeringTShirtSize;
  }
}
