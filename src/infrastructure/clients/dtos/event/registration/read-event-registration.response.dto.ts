import { ReadPartialUser2ResponseDto } from '../../user/read-partial-user-2.response.dto';
import { EventRegistrationType } from '@/types/event-registration-type';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';

export class ReadEventRegistrationResponseDto {
  user: ReadPartialUser2ResponseDto;
  type: EventRegistrationType;
  status: EventRegistrationStatus;
  competitionSignUps: string[];
  accommodationOrders: string[];
  offeringOrders: string[];
  offeringTShirtSize: string;
  phoneCountryCode?: number;
  phoneNumber?: string;

  constructor(
    user: ReadPartialUser2ResponseDto,
    type: EventRegistrationType,
    status: EventRegistrationStatus,
    competitionSignUps: string[],
    accommodationOrders: string[],
    offeringOrders: string[],
    offeringTShirtSize: string,
    phoneCountryCode?: number,
    phoneNumber?: string
  ) {
    this.user = user;
    this.type = type;
    this.status = status;
    this.competitionSignUps = competitionSignUps;
    this.accommodationOrders = accommodationOrders;
    this.offeringOrders = offeringOrders;
    this.offeringTShirtSize = offeringTShirtSize;
    this.phoneCountryCode = phoneCountryCode;
    this.phoneNumber = phoneNumber;
  }
}
