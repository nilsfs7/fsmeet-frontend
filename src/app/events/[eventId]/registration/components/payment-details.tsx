'use client';

import { EventRegistrationType } from '@/types/event-registration-type';
import { Event } from '@/types/event';

interface IPaymentDetails {
  event: Event;
  registrationType: EventRegistrationType;
  compSignUps: string[];
  accommodationOrders: string[];
}

export const PaymentDetails = ({ event, registrationType, compSignUps, accommodationOrders }: IPaymentDetails) => {
  const eventFee = registrationType === EventRegistrationType.PARTICIPANT ? event.participationFee : event.visitorFee;

  return (
    <div>
      <div className="m-2 text-lg">{`Payment details`}</div>

      <div className="m-2 flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <div>{`Event fee`}</div>
          <div>{`${eventFee.toString().replace('.', ',')} €`}</div>
        </div>

        {registrationType === EventRegistrationType.PARTICIPANT && (
          <div className="flex justify-between">
            <div>{`Competition fee(s)`}</div>
            <div>
              {`${event.competitions
                .filter(c => c.id && compSignUps.includes(c.id))
                .reduce((acc, c) => acc + c.participationFee, 0)
                .toString()
                .replace('.', ',')} €`}
            </div>
          </div>
        )}

        {accommodationOrders.length > 0 && (
          <div className="flex justify-between">
            <div>{`Accommodation fee(s)`}</div>
            <div>
              {`${event.accommodations
                .filter(a => a.id && accommodationOrders.includes(a.id))
                .reduce((acc, a) => acc + a.cost, 0)
                .toString()
                .replace('.', ',')} €`}
            </div>
          </div>
        )}

        <div className="flex justify-between text-lg">
          <div>{`Total`}</div>
          <div>
            {`${(
              eventFee +
              event.competitions.filter(c => c.id && compSignUps.includes(c.id)).reduce((acc, c) => acc + c.participationFee, 0) +
              event.accommodations.filter(a => a.id && accommodationOrders.includes(a.id)).reduce((acc, a) => acc + a.cost, 0)
            )
              .toString()
              .replace('.', ',')} €`}
          </div>
        </div>
      </div>
    </div>
  );
};
