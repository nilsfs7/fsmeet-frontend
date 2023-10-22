import { EventRegistrationStatus } from './enums/event-registration-status';

export type EventRegistration = {
  username: string;
  imageUrl?: string;
  status: EventRegistrationStatus;
};
