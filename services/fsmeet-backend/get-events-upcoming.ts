import { Event } from '@/types/event';

export async function getEventsUpcoming(numberOfEventsToFetch: number): Promise<Event[]> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/upcoming/${numberOfEventsToFetch.toString()}`;

  const response = await fetch(url);
  // let events: any = await response.json();

  let events: Event[] = await response.json();

  // events = events.map((e: Event) => {
  // convert moment string into moment object
  // e.registrationOpen = moment(e.registrationOpen);
  // e.registrationDeadline = moment(e.registrationDeadline);
  // e.dateFrom = moment(e.dateFrom);
  // e.dateTo = moment(e.dateTo);

  //  const paymentMehodCash: PaymentMethodCash = { enabled: res.paymentMethodCash.enabled };
  //         const paymentMehodSepa: PaymentMethodSepa = {
  //           enabled: res.paymentMethodSepa.enabled,
  //           bank: res.paymentMethodSepa.bank,
  //           recipient: res.paymentMethodSepa.recipient,
  //           iban: res.paymentMethodSepa.iban,
  //           reference: res.paymentMethodSepa.reference,
  //         };

  //   return e;
  // });

  return events;
}
