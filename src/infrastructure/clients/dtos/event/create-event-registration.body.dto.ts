import { EventRegistrationType } from '@/types/event-registration-type';

export class CreateEventRegistrationBodyDto {
  eventRegistrationType: EventRegistrationType;
  compSignUps: string[];

  constructor(eventRegistrationType: EventRegistrationType, compSignUps: string[]) {
    this.eventRegistrationType = eventRegistrationType;
    this.compSignUps = compSignUps;
  }
}
