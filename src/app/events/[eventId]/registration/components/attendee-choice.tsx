'use client';

import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EventType } from '@/domain/enums/event-type';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { UserType } from '@/domain/enums/user-type';
import { useTranslations } from 'next-intl';

const registrationTypes = Object.values(EventRegistrationType);

interface IAttendeeChoiceList {
  participantFee: number;
  vistorFee: number;
  currency: CurrencyCode;
  eventType: EventType;
  userType: UserType;
  disabled?: boolean[];
  checked?: EventRegistrationType;
  selectable?: boolean;
  hideVisitorOption?: boolean;
  onCheckedChange?: (registrationType: EventRegistrationType) => void;
}

export const AttendeeChoice = ({
  participantFee,
  vistorFee,
  currency,
  eventType,
  userType,
  disabled = [false, false],
  checked,
  selectable = false,
  hideVisitorOption = false,
  onCheckedChange,
}: IAttendeeChoiceList) => {
  const t = useTranslations('global/components/attendee-choice');

  const availableRegistrationTypes = registrationTypes.filter(regType => {
    let addChoice = true;

    // remove type visitor
    if (hideVisitorOption && regType === EventRegistrationType.VISITOR) {
      addChoice = false;
    }

    // remove type visitor when event is an online competition
    if (eventType === EventType.COMPETITION_ONLINE && regType === EventRegistrationType.VISITOR) {
      addChoice = false;
    }

    // remove type participant when user is visitor
    if (userType === UserType.FAN && regType === EventRegistrationType.PARTICIPANT) {
      addChoice = false;
    }

    if (addChoice) {
      return regType;
    }
  });

  return (
    <RadioGroup>
      <table className={`border-secondary-dark bg-secondary-light gap-x-4 p-2 w-full`}>
        {/* todo: color code for head bg*/}
        <thead className="bg-gray-200 text-primary uppercase text-sm leading-normal">
          <tr className="text-left whitespace-nowrap">
            <th className="py-3 px-3 rounded-l-lg">{t('columnTitleAttendeeType')}</th>
            <th className={`py-3 px-3 ${selectable ? '' : 'rounded-r-lg'}`}>{t('columnTitleFee')}</th>
            {selectable && <th className="py-3 px-3 rounded-r-lg">{t('columnTitleSelection')}</th>}
          </tr>
        </thead>
        <tbody className="text-primary text-sm">
          {availableRegistrationTypes.map((regType, i) => (
            <tr key={i} className={`${i < availableRegistrationTypes.length - 1 ? 'border-b border-secondary-dark' : ''} hover:bg-secondary-light`}>
              <td className="py-3 px-3 capitalize">{regType}</td>
              <td className="py-3 px-3 text-right capitalize whitespace-nowrap">
                {`${convertCurrencyIntegerToDecimal(regType === EventRegistrationType.PARTICIPANT ? participantFee : vistorFee, currency).toFixed(2)} ${getCurrencySymbol(currency)}`.replace('.', ',')}
              </td>
              {selectable && (
                <td className="py-3 px-3 text-center">
                  <RadioGroupItem
                    value={regType}
                    id={`option-${regType}`}
                    checked={checked === regType}
                    disabled={disabled[i]}
                    onClick={() => {
                      if (onCheckedChange) onCheckedChange(regType);
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
