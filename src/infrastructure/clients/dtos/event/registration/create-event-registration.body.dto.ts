import { EventRegistrationType } from '@/types/event-registration-type';

export class CreateEventRegistrationBodyDto {
  eventRegistrationType: EventRegistrationType;
  compSignUps: string[];
  accommodationOrders: string[];

  constructor(eventRegistrationType: EventRegistrationType, compSignUps: string[], accommodationOrders: string[]) {
    this.eventRegistrationType = eventRegistrationType;
    this.compSignUps = compSignUps;
    this.accommodationOrders = accommodationOrders;
  }
}
