'use client';

import ComboBox from '@/components/common/combo-box';
import { menuTShirtSizesWithUnspecified } from '@/domain/constants/menus/menu-t-shirt-sizes';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { Offering } from '@/domain/types/offering';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { registrationListScrollClass, registrationListShellClass } from './registration-list-layout';

interface IOfferingList {
  offerings: Offering[];
  paymentFeeCover: boolean;
  currency: CurrencyCode;
  registrationType?: EventRegistrationType;
  tShirtSize?: string;
  disabled?: boolean[];
  checked?: boolean[];
  selectable?: boolean;
  onCheckedChange?: (selected: boolean, offeringId: string) => void;
  onShirtSizeChange?: (tShirtSize: string) => void;
}

export const OfferingList = ({
  offerings,
  paymentFeeCover,
  currency,
  registrationType,
  tShirtSize,
  disabled = [],
  checked = [],
  selectable = false,
  onCheckedChange,
  onShirtSizeChange,
}: IOfferingList) => {
  const t = useTranslations('global/components/offering-list');

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className={registrationListShellClass}>
        <div className={registrationListScrollClass}>
          <table className="w-full min-w-0 text-sm text-foreground">
            <thead className="bg-muted/80 text-foreground/90">
              <tr className="text-left text-xs font-medium uppercase leading-normal tracking-wide">
                <th className="min-w-0 max-w-[min(100%,_12rem)] py-2.5 pl-3 pr-1 sm:max-w-none sm:pr-2 sm:py-3 sm:pl-3">
                  {t('columnTitleDescription')}
                </th>
                <th
                  className={cn('w-[1%] whitespace-nowrap py-2.5 pl-1 pr-3 text-right tabular-nums sm:pl-2 sm:pr-3 sm:py-3', !selectable && 'rounded-tr-xl')}
                >
                  {t('columnTitleCost')}
                </th>
                {selectable && (
                  <th className="w-12 min-w-12 py-2.5 pl-1 pr-3 text-center sm:pl-0 sm:pr-3 sm:py-3 rounded-tr-xl">
                    {t('columnTitleSelection')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {offerings.map((offering, i) => {
                const isMandatory = registrationType === EventRegistrationType.PARTICIPANT && offering.mandatoryForParticipant;
                return (
                  <tr key={i} className="border-b border-border/50 last:border-b-0 hover:bg-muted/25 dark:hover:bg-muted/20">
                    <td className="min-w-0 max-w-[12rem] break-words py-2.5 pl-3 pr-1 sm:max-w-none sm:pr-2 sm:py-3 sm:pl-3">
                      {offering.description}
                    </td>
                    <td className="w-[1%] whitespace-nowrap py-2.5 pl-1 pr-3 text-right tabular-nums sm:pl-2 sm:pr-3 sm:py-3">
                      {`${paymentFeeCover ? convertCurrencyIntegerToDecimal(offering.costIncPaymentCosts, currency).toFixed(2) : convertCurrencyIntegerToDecimal(offering.cost, currency).toFixed(2)} ${getCurrencySymbol(currency)}`.replace(
                        '.',
                        ',',
                      )}
                    </td>
                    {selectable && (
                      <td className="w-12 min-w-12 p-0 text-center sm:pl-0">
                        <div className="flex min-h-10 w-full items-center justify-center sm:min-h-12">
                          <Checkbox
                            id={`input-offering-${i}`}
                            checked={!!checked[i] || isMandatory}
                            disabled={!!disabled[i] || isMandatory}
                            onCheckedChange={v => {
                              if (onCheckedChange && offering.id) onCheckedChange(v === true, offering.id);
                            }}
                            className="shrink-0"
                          />
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

      {tShirtSize &&
        offerings.some((off, i) => {
          if (off.includesShirt && checked[i]) {
            return off;
          }
        }) && (
          <div
            className={cn(
              'w-full min-w-0 rounded-lg border border-border/50 bg-secondary-light/50 p-2.5',
              'dark:border-border/40 dark:bg-background/30',
            )}
          >
            <div className="grid min-w-0 grid-cols-1 items-center gap-2 sm:grid-cols-2 sm:gap-3">
              <div className="min-w-0 text-sm font-medium leading-none">{t('cbShirtSize')}</div>
              <div className="flex w-full min-w-0">
                <ComboBox
                  menus={menuTShirtSizesWithUnspecified}
                  value={tShirtSize || menuTShirtSizesWithUnspecified[0].value}
                  onChange={value => {
                    if (onShirtSizeChange) onShirtSizeChange(value);
                  }}
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
