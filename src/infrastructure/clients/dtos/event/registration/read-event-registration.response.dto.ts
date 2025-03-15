import { ReadPartialUser2ResponseDto } from '../../user/read-partial-user-2.response.dto';
import { EventRegistrationType } from '@/types/event-registration-type';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';

export class ReadEventRegistrationResponseDto {
  user: ReadPartialUser2ResponseDto;
  type: EventRegistrationType;
  status: EventRegistrationStatus;

  constructor(user: ReadPartialUser2ResponseDto, type: EventRegistrationType, status: EventRegistrationStatus) {
    this.user = user;
    this.type = type;
    this.status = status;
  }
}
