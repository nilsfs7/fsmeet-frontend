import { EventCompetition } from '@/types/event-competition';
import { EventRegistration } from '@/types/event-registration';
import { PaymentMethodCash } from '@/types/payment-method-cash';
import { PaymentMethodSepa } from '@/types/payment-method-sepa';

export interface IEvent {
  id: string;
  name: string;
  alias: string;
  admin: string;
  dateFrom: number;
  dateTo: number;
  participationFee: number;
  registrationOpen: number;
  registrationDeadline: number;
  description: string;
  venueHouseNo: string;
  venueStreet: string;
  venueCity: string;
  venuePostCode: string;
  venueCountry: string;
  type: string;
  livestreamUrl: string;
  paymentMethodCash: PaymentMethodCash;
  paymentMethodSepa: PaymentMethodSepa;
  autoApproveRegistrations: boolean;
  eventRegistrations: EventRegistration[];
  eventCompetitions: EventCompetition[];
  published: boolean;
}
