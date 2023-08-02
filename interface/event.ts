import { EventRegistration } from '@/types/event-registration';

export interface IEvent {
  id: string;
  name: string;
  owner: string;
  dateFrom: number;
  dateTo: number;
  participationFee: number;
  registrationDeadline: number;
  description: string;
  location: string;
  type: string;
  eventRegistrations: EventRegistration[];
}
