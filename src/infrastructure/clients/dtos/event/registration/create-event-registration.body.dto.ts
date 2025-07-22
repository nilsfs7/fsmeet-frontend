import { EventRegistrationType } from '@/domain/types/event-registration-type';

export class CreateEventRegistrationBodyDto {
  eventRegistrationType: EventRegistrationType;
  compSignUps: string[];
  accommodationOrders: string[];
  offeringOrders: string[];
  offeringTShirtSize: string;
  phoneCountryCode: number | null;
  phoneNumber: string | null;
  donationAmount?: number | null;

  constructor(
    eventRegistrationType: EventRegistrationType,
    compSignUps: string[],
    accommodationOrders: string[],
    offeringOrders: string[],
    offeringTShirtSize: string,
    phoneCountryCode: number | null,
    phoneNumber: string | null,
    donationAmount: number | null
  ) {
    this.eventRegistrationType = eventRegistrationType;
    this.compSignUps = compSignUps;
    this.accommodationOrders = accommodationOrders;
    this.offeringOrders = offeringOrders;
    this.offeringTShirtSize = offeringTShirtSize;
    this.phoneCountryCode = phoneCountryCode;
    this.phoneNumber = phoneNumber;
    this.donationAmount = donationAmount;
  }
}
