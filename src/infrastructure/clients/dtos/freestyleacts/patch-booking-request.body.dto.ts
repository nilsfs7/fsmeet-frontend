import { FreestyleActsBookingRequestState } from '@/domain/enums/freestyleacts-booking-request-state';

export type PatchBookingRequestState =
  | FreestyleActsBookingRequestState.OFFER_PENDING
  | FreestyleActsBookingRequestState.REJECTED_BY_ARTIST;

export class PatchBookingRequestBodyDto {
  state: PatchBookingRequestState;
  artistFee?: number;

  constructor(state: PatchBookingRequestState, artistFee?: number) {
    this.state = state;
    if (artistFee !== undefined) {
      this.artistFee = artistFee;
    }
  }
}
