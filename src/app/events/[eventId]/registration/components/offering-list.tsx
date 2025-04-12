'use client';

import { EventRegistrationType } from '@/types/event-registration-type';
import { Offering } from '@/types/offering';

interface IOfferingList {
  offerings: Offering[];
  paymentFeeCover: boolean;
  registrationType?: EventRegistrationType;
  disabled?: boolean[];
  checked?: boolean[];
  selectable?: boolean;
  onCheckedChange?: (selected: boolean, offeringId: string) => void;
}

export const OfferingList = ({ offerings, paymentFeeCover, registrationType, disabled = [], checked = [], selectable = false, onCheckedChange }: IOfferingList) => {
  return (
    <table className={`border-secondary-dark bg-secondary-light gap-x-4 p-2 w-full`}>
      {/* todo: color code for head bg*/}
      <thead className="bg-gray-200 text-primary uppercase text-sm leading-normal">
        <tr className="text-left whitespace-nowrap">
          <th className="py-3 px-3 rounded-l-lg">{`Description`}</th>
          <th className={`py-3 px-3 ${selectable ? '' : 'rounded-r-lg'}`}>{`Cost`}</th>
          {selectable && <th className="py-3 px-3 rounded-r-lg">{`Select`}</th>}
        </tr>
      </thead>
      <tbody className="text-primary text-sm">
        {offerings.map((offering, i) => (
          <tr key={i} className={`${i < offerings.length - 1 ? 'border-b border-secondary-dark' : ''} hover:bg-secondary-light`}>
            <td className="py-3 px-3">{offering.description}</td>
            <td className="py-3 px-3 text-right capitalize whitespace-nowrap">{`${paymentFeeCover ? offering.costIncPaymentCosts : offering.cost} €`.replace('.', ',')}</td>
            {selectable && (
              <td className="py-3 px-3 text-center">
                <input
                  id={`input-${i}`}
                  className="h-4 w-4"
                  type="checkbox"
                  checked={checked[i] || (registrationType === EventRegistrationType.PARTICIPANT && offerings[i].mandatoryForParticipant)}
                  disabled={disabled[i] || (registrationType === EventRegistrationType.PARTICIPANT && offerings[i].mandatoryForParticipant)}
                  onChange={() => {
                    if (onCheckedChange && offering.id) onCheckedChange(!checked, offering.id);
                  }}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
