import { Moment } from 'moment';
import { EventType } from './enums/event-type';
import { EventRegistration } from './event-registration';
import { EventCompetition } from './event-competition';

export type Event = {
  id: string | undefined;
  name: string;
  dateFrom: Moment;
  dateTo: Moment;
  participationFee: number | undefined;
  registrationDeadline: Moment;
  description: string;
  venueHouseNo: string;
  venueStreet: string;
  venueCity: string;
  venuePostCode: string;
  venueCountry: string;
  type: EventType;
  autoApproveRegistrations: boolean;
  eventRegistrations: EventRegistration[];
  eventCompetitions: EventCompetition[];
};
