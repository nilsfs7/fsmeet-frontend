'use client';

import { EventRegistrationType } from '@/types/event-registration-type';
import { Event } from '@/types/event';
import { isCompetition } from '@/functions/is-competition';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';

interface IPaymentDetails {
  event: Event;
  registrationType: EventRegistrationType;
  compSignUps: string[];
  accommodationOrders: string[];
  offeringOrders: string[];
  paymentFeeCover: boolean;
}

export const PaymentDetails = ({ event, registrationType, compSignUps, accommodationOrders, offeringOrders, paymentFeeCover }: IPaymentDetails) => {
  let eventFee = registrationType === EventRegistrationType.PARTICIPANT ? event.participationFee : event.visitorFee;
  if (paymentFeeCover) {
    eventFee = registrationType === EventRegistrationType.PARTICIPANT ? event.participationFeeIncPaymentCosts : event.visitorFeeIncPaymentCosts;
  }

  return (
    <div>
      <div className="m-2 text-lg">{`Payment details`}</div>

      <div className="m-2 flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <div>{`Event fee`}</div>
          <div>{`${convertCurrencyIntegerToDecimal(eventFee, event.currency).toFixed(2).replace('.', ',')} ${getCurrencySymbol(event.currency)}`}</div>
        </div>

        {registrationType === EventRegistrationType.PARTICIPANT && isCompetition(event.type) && (
          <div className="flex justify-between">
            <div>{`Competition fee(s)`}</div>
            <div>
              {`${event.competitions
                .filter(c => c.id && compSignUps.includes(c.id))
                .reduce(
                  (acc, c) =>
                    acc + (paymentFeeCover ? convertCurrencyIntegerToDecimal(c.participationFeeIncPaymentCosts, event.currency) : convertCurrencyIntegerToDecimal(c.participationFee, event.currency)),
                  0
                )
                .toFixed(2)
                .replace('.', ',')} ${getCurrencySymbol(event.currency)}`}
            </div>
          </div>
        )}

        {offeringOrders.length > 0 && (
          <div className="flex justify-between">
            <div>{`Offering fee(s)`}</div>
            <div>
              {`${event.offerings
                .filter(a => a.id && offeringOrders.includes(a.id))
                .reduce((off, o) => off + (paymentFeeCover ? convertCurrencyIntegerToDecimal(o.costIncPaymentCosts, event.currency) : convertCurrencyIntegerToDecimal(o.cost, event.currency)), 0)
                .toFixed(2)
                .replace('.', ',')} ${getCurrencySymbol(event.currency)}`}
            </div>
          </div>
        )}

        {accommodationOrders.length > 0 && (
          <div className="flex justify-between">
            <div>{`Accommodation fee(s)`}</div>
            <div>
              {`${event.accommodations
                .filter(a => a.id && accommodationOrders.includes(a.id))
                .reduce((acc, a) => acc + (paymentFeeCover ? convertCurrencyIntegerToDecimal(a.costIncPaymentCosts, event.currency) : convertCurrencyIntegerToDecimal(a.cost, event.currency)), 0)
                .toFixed(2)
                .replace('.', ',')} ${getCurrencySymbol(event.currency)}`}
            </div>
          </div>
        )}

        <div className="flex justify-between text-lg">
          <div>{`Total`}</div>
          <div>
            {`${convertCurrencyIntegerToDecimal(
              eventFee +
                event.competitions.filter(c => c.id && compSignUps.includes(c.id)).reduce((acc, c) => acc + (paymentFeeCover ? c.participationFeeIncPaymentCosts : c.participationFee), 0) +
                event.accommodations.filter(a => a.id && accommodationOrders.includes(a.id)).reduce((acc, a) => acc + (paymentFeeCover ? a.costIncPaymentCosts : a.cost), 0) +
                event.offerings.filter(o => o.id && offeringOrders.includes(o.id)).reduce((off, o) => off + (paymentFeeCover ? o.costIncPaymentCosts : o.cost), 0),
              event.currency
            )
              .toFixed(2)
              .replace('.', ',')} ${getCurrencySymbol(event.currency)}`}
          </div>
        </div>
      </div>
    </div>
  );
};
