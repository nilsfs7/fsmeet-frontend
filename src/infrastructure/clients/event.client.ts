import { EventComment } from '@/types/event-comment';
import { Session } from 'next-auth';
import { Event } from '@/types/event';
import { EventRegistration } from '@/types/event-registration';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { EventState } from '@/domain/enums/event-state';

export async function getEvents(admin: string | null, participant: string | null, from: moment.Moment | null, to: moment.Moment | null, session?: Session | null): Promise<Event[]> {
  const format = 'YYYY-MM-DDTHH:mm:ss.SSS';
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events?`;

  if (admin) {
    url = url + `admin=${admin}`;
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
      cache: 'no-store',
    });
  } else {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      cache: 'no-store',
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

export async function getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/registrations`;

  const response = await fetch(url, {
    method: 'GET',
  });
  return await response.json();
}

export async function getComments(eventId: string): Promise<EventComment[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/comments`;

  const response = await fetch(url, {
    method: 'GET',
  });

  return await response.json();
}

export async function createEvent(event: Event, session: Session | null): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events`;

  const body = JSON.stringify({
    name: event?.name.trim(),
    alias: event?.alias,
    description: event?.description.trim(),
    dateFrom: event?.dateFrom,
    dateTo: event?.dateTo,
    registrationOpen: event?.registrationOpen,
    registrationDeadline: event?.registrationDeadline,
    venueHouseNo: event?.venueHouseNo.trim(),
    venueStreet: event?.venueStreet.trim(),
    venueCity: event?.venueCity.trim(),
    venuePostCode: event?.venuePostCode.trim(),
    venueCountry: event?.venueCountry.trim(),
    participationFee: event?.participationFee,
    type: event?.type,
    livestreamUrl: event?.livestreamUrl,
    messangerInvitationUrl: event?.messangerInvitationUrl,
    paymentMethodCash: { enabled: event?.paymentMethodCash.enabled },
    paymentMethodPayPal: {
      enabled: event?.paymentMethodPayPal.enabled,
      payPalHandle: event?.paymentMethodPayPal.payPalHandle,
    },
    paymentMethodSepa: {
      enabled: event?.paymentMethodSepa.enabled,
      bank: event?.paymentMethodSepa.bank,
      recipient: event?.paymentMethodSepa.recipient,
      iban: event?.paymentMethodSepa.iban,
      reference: event?.paymentMethodSepa.reference,
    },
    autoApproveRegistrations: event?.autoApproveRegistrations,
    notifyOnRegistration: event?.notifyOnRegistration,
    allowComments: event?.allowComments,
    notifyOnComment: event?.notifyOnComment,
    state: event?.state,
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
    console.info('Creating event successful');
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

  const body = JSON.stringify({
    id: event.id,
    name: event?.name.trim(),
    alias: event?.alias,
    description: event?.description.trim(),
    dateFrom: event?.dateFrom,
    dateTo: event?.dateTo,
    registrationOpen: event?.registrationOpen,
    registrationDeadline: event?.registrationDeadline,
    venueHouseNo: event?.venueHouseNo.trim(),
    venueStreet: event?.venueStreet.trim(),
    venuePostCode: event?.venuePostCode.trim(),
    venueCity: event?.venueCity.trim(),
    venueCountry: event?.venueCountry.trim(),
    participationFee: event?.participationFee,
    livestreamUrl: event?.livestreamUrl,
    messangerInvitationUrl: event?.messangerInvitationUrl,
    paymentMethodCash: { enabled: event?.paymentMethodCash.enabled },
    paymentMethodPayPal: {
      enabled: event?.paymentMethodPayPal.enabled,
      payPalHandle: event?.paymentMethodPayPal.payPalHandle,
    },
    paymentMethodSepa: {
      enabled: event?.paymentMethodSepa.enabled,
      bank: event?.paymentMethodSepa.bank,
      recipient: event?.paymentMethodSepa.recipient,
      iban: event?.paymentMethodSepa.iban,
      reference: event?.paymentMethodSepa.reference,
    },
    autoApproveRegistrations: event?.autoApproveRegistrations,
    notifyOnRegistration: event?.notifyOnRegistration,
    allowComments: event?.allowComments,
    notifyOnComment: event?.notifyOnComment,
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
