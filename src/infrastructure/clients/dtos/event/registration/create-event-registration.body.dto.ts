import { EventRegistrationType } from '@/types/event-registration-type';

export class CreateEventRegistrationBodyDto {
  eventRegistrationType: EventRegistrationType;
  compSignUps: string[];
  accommodationOrders: string[];
  offeringOrders: string[];

  constructor(eventRegistrationType: EventRegistrationType, compSignUps: string[], accommodationOrders: string[], offeringOrders: string[]) {
    this.eventRegistrationType = eventRegistrationType;
    this.compSignUps = compSignUps;
    this.accommodationOrders = accommodationOrders;
    this.offeringOrders = offeringOrders;
  }
}
