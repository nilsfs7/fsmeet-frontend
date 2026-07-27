import { FreestyleActsBookingRequestState } from '@/domain/enums/freestyleacts-booking-request-state';
import { JobPreferredTravelMethod } from '@/domain/enums/job-preferred-travel-method';
import { BookingRequestReferenceType, BookingRequestService, BookingRequestVenue } from '@/domain/types/booking-request';

export class ReadBookingRequestResponseDto {
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

  constructor(
    id: string,
    referenceType: BookingRequestReferenceType,
    referenceLabel: string,
    referenceLatitude: number,
    referenceLongitude: number,
    distanceKm: number | null,
    clientName: string,
    email: string,
    phone: string,
    service: BookingRequestService,
    venue: BookingRequestVenue,
    area: string,
    preferredDate: string | null,
    message: string,
    state: FreestyleActsBookingRequestState,
    proposedArtistFee: number,
    artistFee: number,
    proposedTravelMethod: JobPreferredTravelMethod | null,
    travelFee: number | null,
    createdAt: string,
  ) {
    this.id = id;
    this.referenceType = referenceType;
    this.referenceLabel = referenceLabel;
    this.referenceLatitude = referenceLatitude;
    this.referenceLongitude = referenceLongitude;
    this.distanceKm = distanceKm;
    this.clientName = clientName;
    this.email = email;
    this.phone = phone;
    this.service = service;
    this.venue = venue;
    this.area = area;
    this.preferredDate = preferredDate;
    this.message = message;
    this.state = state;
    this.proposedArtistFee = proposedArtistFee;
    this.artistFee = artistFee;
    this.proposedTravelMethod = proposedTravelMethod;
    this.travelFee = travelFee;
    this.createdAt = createdAt;
  }
}
