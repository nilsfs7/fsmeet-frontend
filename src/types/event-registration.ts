import { EventRegistrationStatus } from '../domain/enums/event-registration-status';
import { User } from './user';

export type EventRegistration = {
  user: User;
  status: EventRegistrationStatus;
};
