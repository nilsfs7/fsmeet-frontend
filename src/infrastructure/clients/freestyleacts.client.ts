import { Session } from 'next-auth';
import { BookingRequest } from '@/domain/types/booking-request';
import { FreestyleActsBookingRequestState } from '@/domain/enums/freestyleacts-booking-request-state';
import { defaultHeaders } from './default-headers';
import { ReadBookingRequestResponseDto } from './dtos/freestyleacts/read-booking-request.response.dto';
import { PatchBookingRequestBodyDto } from './dtos/freestyleacts/patch-booking-request.body.dto';

function mapBookingRequest(dto: ReadBookingRequestResponseDto): BookingRequest {
  return {
    id: dto.id,
    referenceType: dto.referenceType,
    referenceLabel: dto.referenceLabel,
    referenceLatitude: dto.referenceLatitude,
    referenceLongitude: dto.referenceLongitude,
    distanceKm: dto.distanceKm,
    clientName: dto.clientName,
    email: dto.email,
    phone: dto.phone,
    service: dto.service,
    venue: dto.venue,
    area: dto.area,
    preferredDate: dto.preferredDate,
    message: dto.message,
    state: dto.state,
    proposedArtistFee: dto.proposedArtistFee,
    artistFee: dto.artistFee,
    createdAt: dto.createdAt,
  };
}

export async function getBookingRequests(session: Session | null): Promise<BookingRequest[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/freestyleacts/booking-requests`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    const data: ReadBookingRequestResponseDto[] = await response.json();
    return data.map(mapBookingRequest);
  }

  throw Error('Error fetching booking requests.');
}

export async function updateBookingRequest(
  bookingRequestId: string,
  state: FreestyleActsBookingRequestState.OFFER_PENDING | FreestyleActsBookingRequestState.REJECTED_BY_ARTIST,
  session: Session | null,
  artistFee?: number,
): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/freestyleacts/booking-requests/${bookingRequestId}`;
  const body = new PatchBookingRequestBodyDto(state, artistFee);

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    return;
  }

  const error = await response.json().catch(() => null);
  throw Error(error?.message ?? 'Error updating booking request.');
}
