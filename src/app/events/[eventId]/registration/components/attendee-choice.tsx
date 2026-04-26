'use client';

import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EventType } from '@/domain/enums/event-type';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { UserType } from '@/domain/enums/user-type';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { registrationListScrollClass, registrationListShellClass } from './registration-list-layout';

const registrationTypes = Object.values(EventRegistrationType);

interface IAttendeeChoiceList {
  participantFee: number;
  visitorFee: number;
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
  visitorFee,
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

    if (hideVisitorOption && regType === EventRegistrationType.VISITOR) {
      addChoice = false;
    }

    if (eventType === EventType.COMPETITION_ONLINE && regType === EventRegistrationType.VISITOR) {
      addChoice = false;
    }

    if (userType === UserType.FAN && regType === EventRegistrationType.PARTICIPANT) {
      addChoice = false;
    }

    if (addChoice) {
      return regType;
    }
  });

  return (
    <RadioGroup
      className="w-full min-w-0"
      value={checked}
      onValueChange={v => {
        if (v && onCheckedChange) onCheckedChange(v as EventRegistrationType);
      }}
    >
      <div className={registrationListShellClass}>
        <div className={registrationListScrollClass}>
          <table className="w-full min-w-0 text-sm text-foreground">
            <thead className="bg-muted/80 text-foreground/90">
              <tr className="text-left text-xs font-medium uppercase leading-normal tracking-wide">
                <th className="min-w-0 max-w-[min(100%,_10rem)] py-2.5 pl-3 pr-1 sm:max-w-none sm:pr-2 sm:py-3 sm:pl-3">
                  {t('columnTitleAttendeeType')}
                </th>
                <th
                  className={cn('w-[1%] whitespace-nowrap py-2.5 pl-1 pr-3 text-right tabular-nums sm:pl-2 sm:pr-3 sm:py-3', !selectable && 'rounded-tr-xl')}
                >
                  {t('columnTitleFee')}
                </th>
                {selectable && (
                  <th className="w-12 min-w-12 py-2.5 pl-1 pr-3 text-center sm:pl-0 sm:pr-3 sm:py-3 rounded-tr-xl">
                    {t('columnTitleSelection')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {availableRegistrationTypes.map((regType, i) => (
                <tr
                  key={i}
                  className="border-b border-border/50 last:border-b-0 hover:bg-muted/25 dark:hover:bg-muted/20"
                >
                  <td className="min-w-0 max-w-[10rem] break-words py-2.5 pl-3 pr-1 capitalize sm:max-w-none sm:pr-2 sm:py-3 sm:pl-3">
                    {regType}
                  </td>
                  <td className="w-[1%] whitespace-nowrap py-2.5 pl-1 pr-3 text-right tabular-nums sm:pl-2 sm:pr-3 sm:py-3">
                    {`${convertCurrencyIntegerToDecimal(regType === EventRegistrationType.PARTICIPANT ? participantFee : visitorFee, currency).toFixed(2)} ${getCurrencySymbol(currency)}`.replace(
                      '.',
                      ',',
                    )}
                  </td>
                  {selectable && (
                    <td className="w-12 min-w-12 p-0 text-center sm:pl-0">
                      <div className="flex min-h-10 w-full items-center justify-center sm:min-h-12">
                        <RadioGroupItem
                          value={regType}
                          id={`option-${regType}`}
                          disabled={!!disabled[i]}
                          className="shrink-0"
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RadioGroup>
  );
};
