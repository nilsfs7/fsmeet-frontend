import { EventComment } from '@/domain/types/event-comment';
import { Session } from 'next-auth';
import { Event } from '@/domain/types/event';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { EventState } from '@/domain/enums/event-state';
import { CreateEventRegistrationBodyDto } from './dtos/event/registration/create-event-registration.body.dto';
import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { CreateVisaInvitationRequestBodyDto } from './dtos/event/create-visa-invitation-request.body.dto';
import { VisaInvitationRequestApprovalState } from '@/domain/enums/visa-request-approval-state';
import { UpdateVisaInvitationRequestStateBodyDto } from './dtos/event/update-visa-invitation-request-state.body.dto';
import { ReadVisaInvitationRequestResponseDto } from './dtos/event/read-visa-invitation-request.response.dto';
import { ReadEventRegistrationResponseDto } from './dtos/event/registration/read-event-registration.response.dto';
import { CreateStripeCheckoutLinkBodyDto } from './dtos/event/create-stripe-checkout-link.body.dto';
import { ReadStripeCheckoutLinkResponseDto } from './dtos/event/read-stripe-checkout-link.response.dto';
import { CreateEventBodyDto } from './dtos/event/create-event.body.dto';
import { CreateEventMaintainerBodyDto } from './dtos/event/create-event-maintainer.body.dto';
import { CreatePaymentMethodCashBodyDto } from './dtos/event/payment/create-payment-method-cash.body.dto';
import { CreatePaymentMethodPayPalBodyDto } from './dtos/event/payment/create-payment-method-paypal.body.dto';
import { CreatePaymentMethodSepaBodyDto } from './dtos/event/payment/create-payment-method-sepa.body.dto';
import { CreatePaymentMethodStripeBodyDto } from './dtos/event/payment/create-payment-method-stripe.body.dto';
import moment from 'moment';
import { UpdateEventBodyDto } from './dtos/event/update-event.body.dto';
import { UpdateEventMaintainerBodyDto } from './dtos/event/update-event-maintainer.body.dto';
import { UpdatePaymentMethodCashBodyDto } from './dtos/event/payment/update-payment-method-cash.body.dto';
import { UpdatePaymentMethodPayPalBodyDto } from './dtos/event/payment/update-payment-method-paypal.body.dto';
import { UpdatePaymentMethodSepaBodyDto } from './dtos/event/payment/update-payment-method-sepa.body.dto';
import { UpdatePaymentMethodStripeBodyDto } from './dtos/event/payment/update-payment-method-stripe.body.dto';
import { PatchEventPosterBodyDto } from './dtos/event/patch-event-poster.body.dto';
import { CreateEventResponseDto } from './dtos/event/create-event.response.dto';

export async function getEvents(
  admin: string | null,
  maintainer: string | null,
  participant: string | null,
  from: moment.Moment | null,
  to: moment.Moment | null,
  session?: Session | null
): Promise<Event[]> {
  const format = 'YYYY-MM-DDTHH:mm:ss.SSS';
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events?`;

  if (admin) {
    url = url + `admin=${admin}`;
  }

  if (maintainer) {
    url = url + `&maintainer=${maintainer}`;
  }

  if (participant) {
    url = url + `&participant=${participant}`;
  }

  if (from) {
    const fromString = `${from.format(format)}Z`;
    url = url + `&dateFrom=${fromString}`;
  }

  if (to) {
    const toString = `${to.format(format)}Z`;
    url = url + `&dateTo=${toString}`;
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
    event?.name.trim(),
    event?.alias,
    event.maintainers.map(maintainer => {
      return new CreateEventMaintainerBodyDto(maintainer.username);
    }),
    moment(event?.dateFrom),
    moment(event?.dateTo),
    event?.participationFee,
    event?.visitorFee,
    event.currency,
    moment(event?.registrationOpen),
    moment(event?.registrationDeadline),
    event?.description.trim(),
    event?.venueName.trim(),
    event?.venueHouseNo.trim(),
    event?.venueStreet.trim(),
    event?.venuePostCode.trim(),
    event?.venueCity.trim(),
    event?.venueCountry.trim(),
    event?.type,
    event?.trailerUrl,
    event?.livestreamUrl,
    event?.messangerInvitationUrl,
    new CreatePaymentMethodCashBodyDto(event?.paymentMethodCash.enabled),
    new CreatePaymentMethodPayPalBodyDto(event?.paymentMethodPayPal.enabled, event?.paymentMethodPayPal.payPalHandle),
    new CreatePaymentMethodSepaBodyDto(
      event?.paymentMethodSepa.enabled,
      event?.paymentMethodSepa.bank,
      event?.paymentMethodSepa.recipient,
      event?.paymentMethodSepa.iban,
      event?.paymentMethodSepa.reference
    ),
    new CreatePaymentMethodStripeBodyDto(event?.paymentMethodStripe.enabled, event?.paymentMethodStripe.coverProviderFee),
    event?.showUserCountryFlag,
    event?.autoApproveRegistrations,
    event?.notifyOnRegistration,
    event?.allowComments,
    event?.notifyOnComment,
    event?.waiver,
    event.visaInvitationRequestsEnabled
  );

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
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
    url = url + `type=${registrationType}`;
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

export async function createEventRegistration(eventId: string, username: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations`;

  const body = JSON.stringify({
    username: `${username}`,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
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

export async function createEventRegistration_v2(
  eventId: string,
  eventRegistrationType: EventRegistrationType,
  compSignUps: string[],
  accommodationOrders: string[],
  offeringOrders: string[],
  offeringTShirtSize: string,
  phoneCountryCode: number | null,
  phoneNumber: string | null,
  donationAmount: number | null,
  session: Session | null
): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/events/${eventId}/registrations`;

  const body = new CreateEventRegistrationBodyDto(eventRegistrationType, compSignUps, accommodationOrders, offeringOrders, offeringTShirtSize, phoneCountryCode, phoneNumber, donationAmount);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
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

export async function createEventRegistrationCheckoutLink(eventId: string, successUrl: string, session: Session | null): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/stripe/checkout`;

  const body = new CreateStripeCheckoutLinkBodyDto(successUrl);

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    const dto: ReadStripeCheckoutLinkResponseDto = await response.json();
    console.info('Creating stripe checkout link for event registration successful');
    return dto.url;
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function createComment(eventId: string, message: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments`;

  const body = JSON.stringify({
    eventId: eventId,
    message: message,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating comment successful');
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

export async function createSubComment(eventId: string, rootCommentId: string, message: string, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments/subs`;

  const body = JSON.stringify({
    rootCommentId: rootCommentId,
    message: message,
  });

  const response = await fetch(url, {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.ok) {
    console.info('Creating sub comment successful');
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
      'Content-Type': 'application/json',
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

export async function updateEvent(event: Event, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`;

  const body = new UpdateEventBodyDto(
    event?.id || '',
    event?.name.trim(),
    event?.alias,
    event.maintainers.map(maintainer => {
      return new UpdateEventMaintainerBodyDto(maintainer.username);
    }),
    moment(event?.dateFrom),
    moment(event?.dateTo),
    event?.participationFee,
    event?.visitorFee,
    event.currency,
    moment(event?.registrationOpen),
    moment(event?.registrationDeadline),
    event?.description.trim(),
    event?.venueName.trim(),
    event?.venueHouseNo.trim(),
    event?.venueStreet.trim(),
    event?.venuePostCode.trim(),
    event?.venueCity.trim(),
    event?.venueCountry.trim(),
    event?.trailerUrl,
    event?.livestreamUrl,
    event?.messangerInvitationUrl,
    new UpdatePaymentMethodCashBodyDto(event?.paymentMethodCash.enabled),
    new UpdatePaymentMethodPayPalBodyDto(event?.paymentMethodPayPal.enabled, event?.paymentMethodPayPal.payPalHandle),

    new UpdatePaymentMethodSepaBodyDto(
      event?.paymentMethodSepa.enabled,
      event?.paymentMethodSepa.bank,
      event?.paymentMethodSepa.recipient,
      event?.paymentMethodSepa.iban,
      event?.paymentMethodSepa.reference
    ),
    new UpdatePaymentMethodStripeBodyDto(event?.paymentMethodStripe.enabled, event?.paymentMethodStripe.coverProviderFee),
    event?.showUserCountryFlag,
    event?.autoApproveRegistrations,
    event?.notifyOnRegistration,
    event?.allowComments,
    event?.notifyOnComment,
    event?.waiver,
    event.visaInvitationRequestsEnabled
  );

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
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
      'Content-Type': 'application/json',
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
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/state`;

  const body = JSON.stringify({
    id: eventId,
    state: state,
  });

  const response = await fetch(url, {
    method: 'PATCH',
    body: body,
    headers: {
      'Content-Type': 'application/json',
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

export async function updateEventPoster(eventId: string, imageBase64: string, session: Session | null): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/poster`;

  const body = new PatchEventPosterBodyDto(imageBase64);

  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
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
      'Content-Type': 'application/json',
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
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`;

  const body = JSON.stringify({
    id: eventId,
  });

  const response = await fetch(url, {
    method: 'DELETE',
    body: body,
    headers: {
      'Content-Type': 'application/json',
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
      'Content-Type': 'application/json',
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
      'Content-Type': 'application/json',
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
      'Content-Type': 'application/json',
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
