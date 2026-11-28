import { EventComment } from '@/domain/types/event-comment';
import { Session } from 'next-auth';
import { Event } from '@/domain/types/event';
import { MapEvent } from '@/domain/types/map-event';
import { EventType } from '@/domain/enums/event-type';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { EventState } from '@/domain/enums/event-state';
import { CreateEventRegistrationBodyDto } from './dtos/event/registration/create-event-registration.body.dto';
import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { CreateVisaInvitationRequestBodyDto } from './dtos/event/create-visa-invitation-request.body.dto';
import { VisaInvitationRequestApprovalState } from '@/domain/enums/visa-request-approval-state';
import { UpdateVisaInvitationRequestStateBodyDto } from './dtos/event/update-visa-invitation-request-state.body.dto';
import { ReadVisaInvitationRequestResponseDto } from './dtos/event/read-visa-invitation-request.response.dto';
import { ReadEventRegistrationResponseDto } from './dtos/event/registration/read-event-registration.response.dto';
import { ReadStripeCheckoutResponseDto } from './dtos/event/read-stripe-checkout.response.dto';
import type { ReadLicenseInfoResponseDto } from './dtos/event/read-license-info.response.dto';
import { CreateEventBodyDto } from './dtos/event/create-event.body.dto';
import { CreateEventMaintainerBodyDto } from './dtos/event/create-event-maintainer.body.dto';
import { CreatePaymentMethodCashBodyDto } from './dtos/event/payment/create-payment-method-cash.body.dto';
import { CreatePaymentMethodSepaBodyDto } from './dtos/event/payment/create-payment-method-sepa.body.dto';
import { CreatePaymentMethodStripeBodyDto } from './dtos/event/payment/create-payment-method-stripe.body.dto';
import { toDate } from '@/lib/date';
import { UpdateEventBodyDto } from './dtos/event/update-event.body.dto';
import { UpdateEventMaintainerBodyDto } from './dtos/event/update-event-maintainer.body.dto';
import { UpdatePaymentMethodCashBodyDto } from './dtos/event/payment/update-payment-method-cash.body.dto';
import { UpdatePaymentMethodSepaBodyDto } from './dtos/event/payment/update-payment-method-sepa.body.dto';
import { UpdatePaymentMethodStripeBodyDto } from './dtos/event/payment/update-payment-method-stripe.body.dto';
import { CreateEventResponseDto } from './dtos/event/create-event.response.dto';
import { defaultHeaders } from './default-headers';
import { ReadEventFeedbackResponseDto } from './dtos/event/read-event-feedback.response.dto';
import { DeleteEventCommentBodyDto } from './dtos/event/delete-comment.body.dto';
import { DeleteEventSubCommentBodyDto } from './dtos/event/delete-sub-comment.body.dto';
import { TShirtSize } from '../../domain/enums/t-shirt-size';
import { PutArenaScreenBodyDto } from './dtos/event/put-arena-screen.body.dto';
import { ReadArenaScreenResponseDto } from './dtos/event/read-arena-screen.response.dto';
import { Platform } from '@/domain/enums/platform';
import { CreateEventRegistrationOnBehalfBodyDto } from './dtos/event/registration/create-event-registration-on-behalf.body.dto';

export async function getEvents(admin: string | null, maintainer: string | null, participant: string | null, from: string | null, to: string | null, session?: Session | null): Promise<Event[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events?`;

  if (admin) {
    url += `admin=${admin}`;
  }

  if (maintainer) {
    url += `&maintainer=${maintainer}`;
  }

  if (participant) {
    url += `&participant=${participant}`;
  }

  if (from) {
    url += `&dateFrom=${from}`;
  }

  if (to) {
    url += `&dateTo=${to}`;
  }

  let response;

  if (!session) {
    response = await fetch(url, {
      method: 'GET',
    });
  } else {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}) as { message?: string });
    throw new Error(typeof err?.message === 'string' && err.message.length > 0 ? err.message : `Request failed (${response.status})`);
  }

  return await response.json();
}

export async function getEventsUpcoming(numberOfEventsToFetch: number): Promise<Event[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/upcoming/${numberOfEventsToFetch.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
  });
  return await response.json();
}

export async function getEventsOngoing(numberOfEventsToFetch: number): Promise<Event[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/ongoing/${numberOfEventsToFetch.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
  });
  return await response.json();
}

export async function getEventsRecent(numberOfEventsToFetch: number): Promise<Event[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/recent/${numberOfEventsToFetch.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
  });
  return await response.json();
}

export async function getEventsFeatured(): Promise<Event[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/featured/upcoming`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) {
    console.info('Getting featured events successful');
    return await response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function getEvent(eventId: string, session?: Session | null): Promise<Event> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}`;

  let response;

  if (!session) {
    response = await fetch(url, { method: 'GET' });
  } else {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
  }

  if (response.ok) {
    console.info('Getting event successful');
    return await response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function getEventByAlias(alias: string, session?: Session | null): Promise<Event> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/alias/${alias}`;

  let response;

  if (!session) {
    response = await fetch(url, {
      method: 'GET',
    });
  } else {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
  }

  if (response.ok) {
    console.info('Getting event by alias successful');
    return await response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function getComments(eventId: string): Promise<EventComment[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments`;

  const response = await fetch(url, {
    method: 'GET',
  });

  return await response.json();
}

export async function createEvent(event: Event, session: Session | null): Promise<CreateEventResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`;

  const body = new CreateEventBodyDto(
    event?.name,
    event?.alias,
    event.maintainers.map(maintainer => {
      return new CreateEventMaintainerBodyDto(maintainer.username);
    }),
    event.dateFrom,
    event.dateTo,
    event?.participationFee,
    event?.enableVisitorRegistration,
    event?.visitorFee,
    event.currency,
    event.registrationOpen,
    event.registrationDeadline,
    event?.description,
    event?.venueName,
    event?.venueHouseNo,
    event?.venueStreet,
    event?.venuePostCode,
    event?.venueCity,
    event?.venueCountryCode,
    event?.type,
    event?.category,
    event?.isWffaRanked,
    event?.prizeMoney,
    event?.participantDrinks,
    event?.participantSnacks,
    event?.trailerUrl,
    event?.livestreamUrl,
    event?.messengerInvitationUrl,
    event?.donationUrl,
    new CreatePaymentMethodCashBodyDto(event?.paymentMethodCash.enabled),
    new CreatePaymentMethodSepaBodyDto(
      event?.paymentMethodSepa.enabled,
      event?.paymentMethodSepa.bank,
      event?.paymentMethodSepa.recipient,
      event?.paymentMethodSepa.iban,
      event?.paymentMethodSepa.reference,
    ),
    new CreatePaymentMethodStripeBodyDto(event?.paymentMethodStripe.enabled, event?.paymentMethodStripe.coverProviderFee),
    event?.showUserCountryFlag,
    event?.registrationCollectPhoneNumber,
    event?.autoApproveRegistrations,
    event?.notifyOnRegistration,
    event?.allowComments,
    event?.notifyOnComment,
    event?.waiver,
    event.visaInvitationRequestsEnabled,
  );

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating event successful');
    return await response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function getEventRegistrations(eventId: string, registrationType: EventRegistrationType | null, session?: Session | null): Promise<ReadEventRegistrationResponseDto[]> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations?`;

  if (registrationType) {
    url += `type=${registrationType}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function getEventRegistration(eventId: string, username: string | null, session?: Session | null): Promise<ReadEventRegistrationResponseDto | null> {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations/${username}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.json();
    if (error.statusCode === 404) {
      // 404 means unregistered
      return null;
    }

    throw Error(error.message);
  }
}

export async function createEventRegistration_v1(eventId: string, compSignUps: string[], session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations`;

  const body = new CreateEventRegistrationBodyDto(EventRegistrationType.PARTICIPANT, null, null, compSignUps, [], [], null, null, null, 0);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating event registration successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function createEventRegistrationOnBehalf(eventId: string, username: string, eventRegistrationType: EventRegistrationType, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations/on-behalf`;

  const body = new CreateEventRegistrationOnBehalfBodyDto(username, eventRegistrationType);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating event registration on behalf successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function createEventRegistration_v2(
  eventId: string,
  eventRegistrationType: EventRegistrationType,
  arrivalDate: string | null,
  departureDate: string | null,
  compSignUps: string[],
  accommodationOrders: string[],
  offeringOrders: string[],
  offeringTShirtSize: TShirtSize | null,
  phoneCountryCode: number | null,
  phoneNumber: string | null,
  donationAmount: number | null,
  session: Session | null,
): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/events/${eventId}/registrations`;

  const body = new CreateEventRegistrationBodyDto(
    eventRegistrationType,
    arrivalDate,
    departureDate,
    compSignUps,
    accommodationOrders,
    offeringOrders,
    offeringTShirtSize,
    phoneCountryCode,
    phoneNumber,
    donationAmount,
  );

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating event registration successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function getEventLicenseInfo(eventId: string, session: Session | null): Promise<ReadLicenseInfoResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/license/upgrade`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      ...(session?.user?.accessToken ? { Authorization: `Bearer ${session.user.accessToken}` } : {}),
    },
  });

  if (response.ok) {
    const dto = (await response.json()) as ReadLicenseInfoResponseDto;
    console.info('Fetching event license info successful');
    return dto;
  }
  const error = await response.json();
  throw Error(error.message);
}

export async function createEventLicenseCheckout(eventId: string, session: Session | null): Promise<ReadStripeCheckoutResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/license/checkout`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    const dto = (await response.json()) as ReadStripeCheckoutResponseDto;
    console.info('Creating Pro license checkout successful');
    return dto;
  }
  const error = await response.json();
  throw Error(error.message);
}

export async function createEventRegistrationCheckout(eventId: string, session: Session | null): Promise<ReadStripeCheckoutResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations/checkout`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    const dto = (await response.json()) as ReadStripeCheckoutResponseDto;
    console.info('Creating stripe payment intent for event registration successful');
    return dto;
  }

  const error = await response.json();
  throw Error(error.message);
}

/** Creates a root comment and returns its id. */
export async function createComment(eventId: string, message: string, session: Session | null): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments`;

  const body = JSON.stringify({
    eventId: eventId,
    message: message,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating comment successful');
    const { id } = (await response.json()) as { id: string };
    return id;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

/** Creates a sub comment (reply) and returns its id. */
export async function createSubComment(eventId: string, rootCommentId: string, message: string, session: Session | null): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments/subs`;

  const body = JSON.stringify({
    rootCommentId: rootCommentId,
    message: message,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating sub comment successful');
    const { id } = (await response.json()) as { id: string };
    return id;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteComment(eventId: string, commentId: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments`;

  const body = new DeleteEventCommentBodyDto(commentId);

  const response = await fetch(url, {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting comment successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteSubComment(eventId: string, subCommentId: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments/subs`;

  const body = new DeleteEventSubCommentBodyDto(subCommentId);

  const response = await fetch(url, {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting sub comment successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function createEventFeedback(eventId: string, message: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/feedback`;

  const body = JSON.stringify({
    message: message,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating event feedback successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function getEventFeedbacks(eventId: string, session: Session | null): Promise<ReadEventFeedbackResponseDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/feedback`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateEvent(event: Event, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${event?.id}`;

  const body = new UpdateEventBodyDto(
    event?.name,
    event?.alias,
    event.maintainers.map(maintainer => {
      return new UpdateEventMaintainerBodyDto(maintainer.username);
    }),
    event.dateFrom,
    event.dateTo,
    event?.participationFee,
    event?.enableVisitorRegistration,
    event?.visitorFee,
    event.currency,
    event.registrationOpen,
    event.registrationDeadline,
    event?.description,
    event?.venueName,
    event?.venueHouseNo,
    event?.venueStreet,
    event?.venuePostCode,
    event?.venueCity,
    event?.venueCountryCode,
    event?.category,
    event?.isWffaRanked,
    event?.prizeMoney,
    event?.participantDrinks,
    event?.participantSnacks,
    event?.trailerUrl,
    event?.livestreamUrl,
    event?.messengerInvitationUrl,
    event?.donationUrl,
    new UpdatePaymentMethodCashBodyDto(event?.paymentMethodCash.enabled),
    new UpdatePaymentMethodSepaBodyDto(
      event?.paymentMethodSepa.enabled,
      event?.paymentMethodSepa.bank,
      event?.paymentMethodSepa.recipient,
      event?.paymentMethodSepa.iban,
      event?.paymentMethodSepa.reference,
    ),
    new UpdatePaymentMethodStripeBodyDto(event?.paymentMethodStripe.enabled, event?.paymentMethodStripe.coverProviderFee),
    event?.showUserCountryFlag,
    event?.registrationCollectPhoneNumber,
    event?.autoApproveRegistrations,
    event?.notifyOnRegistration,
    event?.allowComments,
    event?.notifyOnComment,
    event?.waiver,
    event.visaInvitationRequestsEnabled,
  );

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Editing event successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateEventRegistrationStatus(eventId: string, username: string, status: EventRegistrationStatus, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations/status`;

  const body = JSON.stringify({
    username: `${username}`,
    status: status,
  });

  const response = await fetch(url, {
    method: 'PATCH',
    body: body,
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting event registration successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateEventState(session: Session | null, eventId: string, state: EventState): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/state`;

  const body = JSON.stringify({
    state,
  });

  const response = await fetch(url, {
    method: 'PATCH',
    body: body,
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating event state successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateEventPoster(eventId: string, image: File, session: Session | null): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/poster`;

  const body = new FormData();
  body.append('file', image);

  const response = await fetch(url, {
    method: 'PUT',
    body: body,
    headers: {
      'x-platform': Platform.WEB,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating event poster successful');

    const resBody = await response.json();
    return resBody.imageUrl;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteEventPoster(eventId: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/poster`;

  const body = JSON.stringify({
    id: eventId,
  });

  const response = await fetch(url, {
    method: 'DELETE',
    body: body,
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting event successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteEvent(eventId: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting event successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function deleteEventRegistration(eventId: string, username: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations`;

  const body = JSON.stringify({
    username: `${username}`,
  });

  const response = await fetch(url, {
    method: 'DELETE',
    body: body,
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Deleting event registration successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function getVisaInvitationRequests(eventId: string | null, session: Session | null): Promise<ReadVisaInvitationRequestResponseDto[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/visa`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function createVisaInvitationRequest(eventId: string, firstName: string, lastName: string, countryCode: string, passportNumber: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/visa`;

  const body = new CreateVisaInvitationRequestBodyDto(firstName, lastName, countryCode, passportNumber);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating invitation request successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateVisaInvitationRequest(id: string, state: VisaInvitationRequestApprovalState, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/0000/visa`;

  const body = new UpdateVisaInvitationRequestStateBodyDto(id, state);

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating invitation request successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function getArenaScreen(eventId: string): Promise<ReadArenaScreenResponseDto> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/arena-screen`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function upsertArenaScreen(
  eventId: string,
  activeMatchId: string | null,
  backgroundOverlayOpacity: number | null,
  showPositions: boolean,
  reversePositionLabels: boolean,
  showFlags: boolean,
  showLastName: boolean,
  session: Session | null,
): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/arena-screen`;

  const body = new PutArenaScreenBodyDto(activeMatchId, backgroundOverlayOpacity, showPositions, reversePositionLabels, showFlags, showLastName);

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating arena screen successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function updateArenaScreenBackgroundImage(eventId: string, image: File, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/arena-screen/image`;

  const body = new FormData();
  body.append('file', image);

  const response = await fetch(url, {
    method: 'PUT',
    body: body,
    headers: {
      'x-platform': Platform.WEB,
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Updating arena screen background image successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

/** Days back from today for the map query: `dateFrom` filters on an event's start, so ongoing multi-day events need some slack. */
const MAP_EVENTS_LOOKBACK_DAYS = 14;

/**
 * Public events with a venue position for the freestyler map, trimmed to the map fields.
 * Interim until the backend offers a light map endpoint: GET /v1/events?dateFrom=<today-14d>, then drop
 * online events, events without coordinates and anything that isn't approved. Whether an event is still
 * ongoing/upcoming is decided on the client (user's clock), so a cached response stays correct.
 * Cached for 5 minutes; failures yield an empty list so the map still renders.
 */
/** coordinates may arrive as numbers or numeric strings; null/empty means "no position" */
function hasCoordinate(v: unknown) {
  return v !== null && v !== undefined && v !== '' && Number.isFinite(Number(v));
}

export async function getMapEvents(): Promise<MapEvent[]> {
  const now = new Date();
  // UTC midnight, MAP_EVENTS_LOOKBACK_DAYS ago; toISOString yields `YYYY-MM-DDTHH:mm:ss.SSSZ`
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - MAP_EVENTS_LOOKBACK_DAYS));
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events?dateFrom=${from.toISOString()}`;

  try {
    const response = await fetch(url, { method: 'GET', next: { revalidate: 300 } });
    if (!response.ok) return [];
    const events: Event[] = await response.json();

    return events
      .filter(
        e =>
          e.id &&
          e.state === EventState.APPROVED &&
          e.type !== EventType.COMPETITION_ONLINE &&
          hasCoordinate(e.venueLatitude) &&
          hasCoordinate(e.venueLongitude) &&
          toDate(e.dateTo).getTime() >= from.getTime(),
      )
      .map(e => ({
        id: e.id as string,
        alias: e.alias || null,
        name: e.name,
        type: e.type,
        category: e.category,
        isWffaRanked: e.isWffaRanked,
        dateFrom: e.dateFrom,
        dateTo: e.dateTo,
        registrationOpen: e.registrationOpen,
        registrationDeadline: e.registrationDeadline,
        venueName: e.venueName,
        venueCity: e.venueCity,
        venueCountryCode: e.venueCountryCode,
        lat: Number(e.venueLatitude),
        lng: Number(e.venueLongitude),
        imageUrlPoster: e.imageUrlPoster || null,
      }));
  } catch {
    return [];
  }
}
