'use client';

import { EventRegistrationType } from '@/types/event-registration-type';
import { Event } from '@/types/event';

interface IPaymentDetails {
  event: Event;
  registrationType: EventRegistrationType;
  compSignUps: string[];
}

export const PaymentDetails = ({ event, registrationType, compSignUps }: IPaymentDetails) => {
  return (
    <div>
      <div className="m-2">{`Payment details:`}</div>

      <div className="m-2 flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <div>{`Event fee`}</div>
          <div>{event.participationFee.toString().replace('.', ',')} €</div>
        </div>

        {registrationType === EventRegistrationType.PARTICIPANT && (
          <div className="flex justify-between">
            <div>{`Competition fee(s)`}</div>
            <div>
              {event.competitions
                .filter(c => c.id && compSignUps.includes(c.id))
                .reduce((acc, c) => acc + c.participationFee, 0)
                .toString()
                .replace('.', ',')}{' '}
              €
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <div>{`Total`}</div>
          <div>{(event.participationFee + event.competitions.filter(c => c.id && compSignUps.includes(c.id)).reduce((acc, c) => acc + c.participationFee, 0)).toString().replace('.', ',')} €</div>
        </div>
      </div>
    </div>
  );
};
