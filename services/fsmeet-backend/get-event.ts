import { Event } from '@/types/event';

export async function getEvent(eventId: string, needsAuthorization?: boolean, session?: any): Promise<Event> {
  let response;

  if (!needsAuthorization) {
    response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}`);
  } else {
    response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/${eventId}/manage`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
  }

  const event: Event = await response.json();

  // convert moment string into moment object
  // event.registrationOpen = moment(event.registrationOpen);
  // event.registrationDeadline = moment(event.registrationDeadline);
  // event.dateFrom = moment(event.dateFrom);
  // event.dateTo = moment(event.dateTo);

  //  const paymentMehodCash: PaymentMethodCash = { enabled: res.paymentMethodCash.enabled };
  //         const paymentMehodSepa: PaymentMethodSepa = {
  //           enabled: res.paymentMethodSepa.enabled,
  //           bank: res.paymentMethodSepa.bank,
  //           recipient: res.paymentMethodSepa.recipient,
  //           iban: res.paymentMethodSepa.iban,
  //           reference: res.paymentMethodSepa.reference,
  //         };

  return event;
}
