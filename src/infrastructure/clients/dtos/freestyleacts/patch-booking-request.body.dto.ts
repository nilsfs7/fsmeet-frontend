import { FreestyleActsBookingRequestState } from '@/domain/enums/freestyleacts-booking-request-state';
import { JobPreferredTravelMethod } from '@/domain/enums/job-preferred-travel-method';

export type PatchBookingRequestState =
  | FreestyleActsBookingRequestState.OFFER_PENDING
  | FreestyleActsBookingRequestState.REJECTED_BY_ARTIST;

export class PatchBookingRequestBodyDto {
  state: PatchBookingRequestState;
  artistFee?: number;
  proposedTravelMethod?: JobPreferredTravelMethod;
  travelFee?: number;

  constructor(
    state: PatchBookingRequestState,
    artistFee?: number,
    proposedTravelMethod?: JobPreferredTravelMethod,
    travelFee?: number,
  ) {
    this.state = state;
    if (artistFee !== undefined) {
      this.artistFee = artistFee;
    }
    if (proposedTravelMethod !== undefined) {
      this.proposedTravelMethod = proposedTravelMethod;
    }
    if (travelFee !== undefined) {
      this.travelFee = travelFee;
    }
  }
}
