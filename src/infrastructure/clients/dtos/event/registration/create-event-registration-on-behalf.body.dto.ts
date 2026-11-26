import { EventRegistrationType } from '@/domain/types/event-registration-type';

export class CreateEventRegistrationOnBehalfBodyDto {
  username: string;
  eventRegistrationType: EventRegistrationType;

  constructor(username: string, eventRegistrationType: EventRegistrationType) {
    this.username = username;
    this.eventRegistrationType = eventRegistrationType;
  }
}
