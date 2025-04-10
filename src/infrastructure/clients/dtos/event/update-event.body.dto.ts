import { Moment } from 'moment';
import { UpdateEventMaintainerBodyDto } from './update-event-maintainer.body.dto';
import { UpdatePaymentMethodCashBodyDto } from './payment/update-payment-method-cash.body.dto';
import { UpdatePaymentMethodPayPalBodyDto } from './payment/update-payment-method-paypal.body.dto';
import { UpdatePaymentMethodSepaBodyDto } from './payment/update-payment-method-sepa.body.dto';
import { UpdatePaymentMethodStripeBodyDto } from './payment/update-payment-method-stripe.body.dto';

export class UpdateEventBodyDto {
  id: string;
  name: string;
  alias: string;
  maintainers: UpdateEventMaintainerBodyDto[];
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
  trailerUrl: string;
  livestreamUrl: string;
  messangerInvitationUrl: string;
  paymentMethodCash: UpdatePaymentMethodCashBodyDto;
  paymentMethodPayPal: UpdatePaymentMethodPayPalBodyDto;
  paymentMethodSepa: UpdatePaymentMethodSepaBodyDto;
  paymentMethodStripe: UpdatePaymentMethodStripeBodyDto;
  autoApproveRegistrations: boolean;
  notifyOnRegistration: boolean;
  allowComments: boolean;
  notifyOnComment: boolean;

  constructor(
    id: string,
    name: string,
    alias: string,
    maintainers: UpdateEventMaintainerBodyDto[],
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
    trailerUrl: string,
    livestreamUrl: string,
    messangerInvitationUrl: string,
    paymentMethodCash: UpdatePaymentMethodCashBodyDto,
    paymentMethodPayPal: UpdatePaymentMethodPayPalBodyDto,
    paymentMethodSepa: UpdatePaymentMethodSepaBodyDto,
    paymentMethodStripe: UpdatePaymentMethodStripeBodyDto,
    autoApproveRegistrations: boolean,
    notifyOnRegistration: boolean,
    allowComments: boolean,
    notifyOnComment: boolean
  ) {
    this.id = id;
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
    this.trailerUrl = trailerUrl;
    this.livestreamUrl = livestreamUrl;
    this.messangerInvitationUrl = messangerInvitationUrl;
    this.paymentMethodCash = paymentMethodCash;
    this.paymentMethodPayPal = paymentMethodPayPal;
    this.paymentMethodSepa = paymentMethodSepa;
    this.paymentMethodStripe = paymentMethodStripe;
    this.autoApproveRegistrations = autoApproveRegistrations;
    this.notifyOnRegistration = notifyOnRegistration;
    this.allowComments = allowComments;
    this.notifyOnComment = notifyOnComment;
  }
}
