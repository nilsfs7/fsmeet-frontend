'use client';

import { EventRegistrationType } from '@/types/event-registration-type';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const registrationTypes = Object.keys(EventRegistrationType);

interface IAttendeeChoiceList {
  fees: number[];
  disabled?: boolean[];
  checked?: EventRegistrationType;
  selectable?: boolean;
  onCheckedChange?: (registrationType: EventRegistrationType) => void;
}

export const AttendeeChoice = ({ fees, disabled = [false, false], checked, selectable = false, onCheckedChange }: IAttendeeChoiceList) => {
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
          {registrationTypes.map((registrationType, i) => (
            <tr key={i} className={`${i < registrationTypes.length - 1 ? 'border-b border-secondary-dark' : ''} hover:bg-secondary-light`}>
              <td className="py-3 px-3 capitalize">{registrationType.toLowerCase()}</td>
              <td className="py-3 px-3 text-right capitalize whitespace-nowrap">{`${fees[i]} €`}</td>
              {selectable && (
                <td className="py-3 px-3 text-center">
                  <RadioGroupItem
                    value={Object.values(EventRegistrationType)[i]}
                    id={`option-${Object.values(EventRegistrationType)[i]}`}
                    checked={checked === Object.values(EventRegistrationType)[i]}
                    disabled={disabled[i]}
                    onClick={e => {
                      if (onCheckedChange && registrationType) onCheckedChange(Object.values(EventRegistrationType)[i]);
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
