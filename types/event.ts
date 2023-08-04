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
  location: string | undefined;
  type: EventType;
  autoApproveRegistrations: boolean;
};
