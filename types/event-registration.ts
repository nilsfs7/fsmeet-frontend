import { EventRegistrationStatus } from './enums/event-registration-status';

export type EventRegistration = {
  username: string;
  status: EventRegistrationStatus;
  imageUrl?: string;
};
