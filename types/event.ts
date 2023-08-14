import { Moment } from 'moment';
import { EventType } from './enums/event-type';

export type Event = {
  id: string | undefined;
  name: string | undefined;
  dateFrom: Moment;
  dateTo: Moment;
  participationFee: number | undefined;
  registrationDeadline: Moment;
  description: string | undefined;
  venueHouseNo: string | undefined;
  venueStreet: string | undefined;
  venueCity: string | undefined;
  venuePostCode: string | undefined;
  venueCountry: string | undefined;
  type: EventType;
  autoApproveRegistrations: boolean;
};
