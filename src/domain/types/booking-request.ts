import { FreestyleActsBookingRequestState } from '@/domain/enums/freestyleacts-booking-request-state';
import { JobPreferredTravelMethod } from '@/domain/enums/job-preferred-travel-method';

export type BookingRequestReferenceType = 'event' | 'visitor';
export type BookingRequestService = 'show' | 'workshop' | 'walk_act' | 'other';
export type BookingRequestVenue = 'indoor' | 'outdoor' | 'unknown';

export interface BookingRequest {
  id: string;
  referenceType: BookingRequestReferenceType;
  referenceLabel: string;
  referenceLatitude: number;
  referenceLongitude: number;
  distanceKm: number | null;
  clientName: string;
  email: string;
  phone: string;
  service: BookingRequestService;
  venue: BookingRequestVenue;
  area: string;
  preferredDate: string | null;
  message: string;
  state: FreestyleActsBookingRequestState;
  proposedArtistFee: number;
  artistFee: number;
  proposedTravelMethod: JobPreferredTravelMethod | null;
  travelFee: number | null;
  createdAt: string;
}
