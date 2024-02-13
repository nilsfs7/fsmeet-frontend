import moment from 'moment';
import { Event } from '@/types/event';

export async function getEvents(from: moment.Moment, to: moment.Moment): Promise<Event[]> {
  const format = 'YYYY-MM-DDTHH:mm:ss.SSS';

  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events?`;

  if (from) {
    const fromString = `${from.format(format)}Z`;
    url = url + `dateFrom=${fromString}`;
  }

  if (to) {
    const toString = `${to.format(format)}Z`;
    url = url + `&dateTo=${toString}`;
  }

  const response = await fetch(url);
  return await response.json();

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

  // return e;
  // });
}
