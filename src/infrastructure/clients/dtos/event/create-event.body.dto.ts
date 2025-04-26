import { EventType } from '@/domain/enums/event-type';
import { Moment } from 'moment';
import { CreateEventMaintainerBodyDto } from './create-event-maintainer.body.dto';
import { CreatePaymentMethodCashBodyDto } from './payment/create-payment-method-cash.body.dto';
import { CreatePaymentMethodPayPalBodyDto } from './payment/create-payment-method-paypal.body.dto';
import { CreatePaymentMethodSepaBodyDto } from './payment/create-payment-method-sepa.body.dto';
import { CreatePaymentMethodStripeBodyDto } from './payment/create-payment-method-stripe.body.dto';

export class CreateEventBodyDto {
  name: string;
  alias: string;
  maintainers: CreateEventMaintainerBodyDto[];
  dateFrom: Moment;
  dateTo: Moment;
  participationFee: number;
  visitorFee: number;
  registrationOpen: Moment;
  registrationDeadline: Moment;
  description: string;
  venueName: string;
  venueHouseNo: string;
  venueStreet: string;
  venuePostCode: string;
  venueCity: string;
  venueCountry: string;
  type: EventType;
  trailerUrl: string;
  livestreamUrl: string;
  messangerInvitationUrl: string;
  paymentMethodCash: CreatePaymentMethodCashBodyDto;
  paymentMethodPayPal: CreatePaymentMethodPayPalBodyDto;
  paymentMethodSepa: CreatePaymentMethodSepaBodyDto;
  paymentMethodStripe: CreatePaymentMethodStripeBodyDto;
  autoApproveRegistrations: boolean;
  notifyOnRegistration: boolean;
  allowComments: boolean;
  notifyOnComment: boolean;
  waiver: string;

  constructor(
    name: string,
    alias: string,
    maintainers: CreateEventMaintainerBodyDto[],
    dateFrom: Moment,
    dateTo: Moment,
    participationFee: number,
    visitorFee: number,
    registrationOpen: Moment,
    registrationDeadline: Moment,
    description: string,
    venueName: string,
    venueHouseNo: string,
    venueStreet: string,
    venuePostCode: string,
    venueCity: string,
    venueCountry: string,
    type: EventType,
    trailerUrl: string,
    livestreamUrl: string,
    messangerInvitationUrl: string,
    paymentMethodCash: CreatePaymentMethodCashBodyDto,
    paymentMethodPayPal: CreatePaymentMethodPayPalBodyDto,
    paymentMethodSepa: CreatePaymentMethodSepaBodyDto,
    paymentMethodStripe: CreatePaymentMethodStripeBodyDto,
    autoApproveRegistrations: boolean,
    notifyOnRegistration: boolean,
    allowComments: boolean,
    notifyOnComment: boolean,
    waiver: string
  ) {
    this.name = name;
    this.alias = alias;
    this.maintainers = maintainers;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.participationFee = participationFee;
    this.visitorFee = visitorFee;
    this.registrationOpen = registrationOpen;
    this.registrationDeadline = registrationDeadline;
    this.description = description;
    this.venueName = venueName;
    this.venueHouseNo = venueHouseNo;
    this.venueStreet = venueStreet;
    this.venuePostCode = venuePostCode;
    this.venueCity = venueCity;
    this.venueCountry = venueCountry;
    this.type = type;
    this.trailerUrl = trailerUrl;
    this.livestreamUrl = livestreamUrl;
    this.messangerInvitationUrl = messangerInvitationUrl;
    this.paymentMethodCash = paymentMethodCash;
    this.paymentMethodSepa = paymentMethodSepa;
    this.paymentMethodStripe = paymentMethodStripe;
    this.paymentMethodPayPal = paymentMethodPayPal;
    this.autoApproveRegistrations = autoApproveRegistrations;
    this.notifyOnRegistration = notifyOnRegistration;
    this.allowComments = allowComments;
    this.notifyOnComment = notifyOnComment;
    this.waiver = waiver;
  }
}
