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
  venueHouseNo: string;
  venueStreet: string;
  venueCity: string;
  venuePostCode: string;
  venueCountry: string;
  type: string;
  eventRegistrations: EventRegistration[];
}
