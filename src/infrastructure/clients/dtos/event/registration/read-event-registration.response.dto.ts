import { ReadPartialUser2ResponseDto } from '../../user/read-partial-user-2.response.dto';
import { EventRegistrationType } from '@/types/event-registration-type';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';

export class ReadEventRegistrationResponseDto {
  user: ReadPartialUser2ResponseDto;
  type: EventRegistrationType;
  status: EventRegistrationStatus;
  accommodationOrders: string[];
  offeringOrders: string[];
  offeringTShirtSize: string;
  phoneCountryCode?: number;
  phoneNumber?: number;

  constructor(
    user: ReadPartialUser2ResponseDto,
    type: EventRegistrationType,
    status: EventRegistrationStatus,
    accommodationOrders: string[],
    offeringOrders: string[],
    offeringTShirtSize: string,
    phoneCountryCode?: number,
    phoneNumber?: number
  ) {
    this.user = user;
    this.type = type;
    this.status = status;
    this.accommodationOrders = accommodationOrders;
    this.offeringOrders = offeringOrders;
    this.offeringTShirtSize = offeringTShirtSize;
    this.phoneCountryCode = phoneCountryCode;
    this.phoneNumber = phoneNumber;
  }
}
