'use client';

import { EventRegistrationType } from '@/types/event-registration-type';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EventType } from '@/domain/enums/event-type';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';

const registrationTypes = Object.values(EventRegistrationType);

interface IAttendeeChoiceList {
  fees: number[];
  eventType: EventType;
  disabled?: boolean[];
  checked?: EventRegistrationType;
  selectable?: boolean;
  onCheckedChange?: (registrationType: EventRegistrationType) => void;
}

export const AttendeeChoice = ({ fees, eventType, disabled = [false, false], checked, selectable = false, onCheckedChange }: IAttendeeChoiceList) => {
  const availableRegistrationTypes = registrationTypes.filter(regType => {
    // remove type visitor when event is an online competition
    if (!(eventType === EventType.COMPETITION_ONLINE && regType === EventRegistrationType.VISITOR)) {
      return regType;
    }
  });

  return (
    <RadioGroup>
      <table className={`border-secondary-dark bg-secondary-light gap-x-4 p-2 w-full`}>
        {/* todo: color code for head bg*/}
        <thead className="bg-gray-200 text-primary uppercase text-sm leading-normal">
          <tr className="text-left whitespace-nowrap">
            <th className="py-3 px-3 rounded-l-lg">{`Type`}</th>
            <th className={`py-3 px-3 ${selectable ? '' : 'rounded-r-lg'}`}>{`Fee`}</th>
            {selectable && <th className="py-3 px-3 rounded-r-lg">{`Select`}</th>}
          </tr>
        </thead>
        <tbody className="text-primary text-sm">
          {availableRegistrationTypes.map((regType, i) => (
            <tr key={i} className={`${i < availableRegistrationTypes.length - 1 ? 'border-b border-secondary-dark' : ''} hover:bg-secondary-light`}>
              <td className="py-3 px-3 capitalize">{regType}</td>
              <td className="py-3 px-3 text-right capitalize whitespace-nowrap">{`${convertCurrencyIntegerToDecimal(fees[i], 'EUR')} €`.replace('.', ',')}</td>
              {selectable && (
                <td className="py-3 px-3 text-center">
                  <RadioGroupItem
                    value={regType}
                    id={`option-${regType}`}
                    checked={checked === regType}
                    disabled={disabled[i]}
                    onClick={e => {
                      if (onCheckedChange && regType) onCheckedChange(Object.values(EventRegistrationType)[i]);
                    }}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </RadioGroup>
  );
};
