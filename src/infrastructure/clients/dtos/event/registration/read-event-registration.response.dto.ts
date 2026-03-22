import { ReadPartialUser3ResponseDto } from '../../user/read-partial-user-3.response.dto';
import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { Moment } from 'moment';

export class ReadEventRegistrationResponseDto {
  user: ReadPartialUser3ResponseDto;
  type: EventRegistrationType;
  status: EventRegistrationStatus;
  arrivalDate: Moment | null;
  departureDate: Moment | null;
  competitionSignUps: string[];
  accommodationOrders: string[];
  offeringOrders: string[];
  offeringTShirtSize: string;
  phoneCountryCode?: number;
  phoneNumber?: string;

  constructor(
    user: ReadPartialUser3ResponseDto,
    type: EventRegistrationType,
    status: EventRegistrationStatus,
    arrivalDate: Moment | null,
    departureDate: Moment | null,
    competitionSignUps: string[],
    accommodationOrders: string[],
    offeringOrders: string[],
    offeringTShirtSize: string,
    phoneCountryCode?: number,
    phoneNumber?: string,
  ) {
    this.user = user;
    this.type = type;
    this.status = status;
    this.arrivalDate = arrivalDate;
    this.departureDate = departureDate;
    this.competitionSignUps = competitionSignUps;
    this.accommodationOrders = accommodationOrders;
    this.offeringOrders = offeringOrders;
    this.offeringTShirtSize = offeringTShirtSize;
    this.phoneCountryCode = phoneCountryCode;
    this.phoneNumber = phoneNumber;
  }
}
