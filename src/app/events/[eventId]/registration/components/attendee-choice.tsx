'use client';

import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EventType } from '@/domain/enums/event-type';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { UserType } from '@/domain/enums/user-type';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { registrationListScrollClass, registrationListShellClass } from './registration-list-layout';

const registrationTypes = Object.values(EventRegistrationType);

interface IAttendeeChoiceList {
  participantFee: number;
  visitorFee: number;
  currency: CurrencyCode;
  eventType: EventType;
  userType: UserType;
  /** [participantDisabled, visitorDisabled] */
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

  const isTypeDisabled = (regType: EventRegistrationType): boolean => {
    if (regType === EventRegistrationType.PARTICIPANT) return !!disabled[0];
    if (regType === EventRegistrationType.VISITOR) return !!disabled[1];
    return false;
  };

  const getSelectionHint = (regType: EventRegistrationType): string | undefined => {
    if (regType === EventRegistrationType.PARTICIPANT && disabled[0]) {
      return t('hintRegistrationPeriodEnded');
    }
    return undefined;
  };

  return (
    <TooltipProvider delayDuration={200}>
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
                  <th className="min-w-0 max-w-[min(100%,10rem)] py-2.5 pl-3 pr-1 sm:max-w-none sm:pr-2 sm:py-3 sm:pl-3">
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
                {availableRegistrationTypes.map(regType => {
                  const typeDisabled = isTypeDisabled(regType);
                  const selectionHint = getSelectionHint(regType);
                  const radio = (
                    <RadioGroupItem value={regType} id={`option-${regType}`} disabled={typeDisabled} className="shrink-0" />
                  );

                  return (
                    <tr key={regType} className="border-b border-border/50 last:border-b-0 hover:bg-muted/25 dark:hover:bg-muted/20">
                      <td className="min-w-0 max-w-40 wrap-break-word py-2.5 pl-3 pr-1 capitalize sm:max-w-none sm:pr-2 sm:py-3 sm:pl-3">
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
                            {selectionHint ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex">{radio}</span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs text-left">
                                  <p>{selectionHint}</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              radio
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </RadioGroup>
    </TooltipProvider>
  );
};
