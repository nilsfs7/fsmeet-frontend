import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { Moment } from 'moment';
import { TShirtSize } from '../../../../../domain/enums/t-shirt-size';

export class CreateEventRegistrationBodyDto {
  eventRegistrationType: EventRegistrationType;
  arrivalDate: Moment | null;
  departureDate: Moment | null;
  compSignUps: string[];
  accommodationOrders: string[];
  offeringOrders: string[];
  offeringTShirtSize: TShirtSize | null;
  phoneCountryCode: number | null;
  phoneNumber: string | null;
  donationAmount?: number | null;

  constructor(
    eventRegistrationType: EventRegistrationType,
    arrivalDate: Moment | null,
    departureDate: Moment | null,
    compSignUps: string[],
    accommodationOrders: string[],
    offeringOrders: string[],
    offeringTShirtSize: TShirtSize | null,
    phoneCountryCode: number | null,
    phoneNumber: string | null,
    donationAmount: number | null,
  ) {
    this.eventRegistrationType = eventRegistrationType;
    this.arrivalDate = arrivalDate;
    this.departureDate = departureDate;
    this.compSignUps = compSignUps;
    this.accommodationOrders = accommodationOrders;
    this.offeringOrders = offeringOrders;
    this.offeringTShirtSize = offeringTShirtSize;
    this.phoneCountryCode = phoneCountryCode;
    this.phoneNumber = phoneNumber;
    this.donationAmount = donationAmount;
  }
}
