'use client';

import { CurrencyCode } from '@/domain/enums/currency-code';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { Accommodation } from '@/domain/types/accommodation';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { registrationListScrollClass, registrationListShellClass } from './registration-list-layout';

interface IAccommodationList {
  accommodations: Accommodation[];
  paymentFeeCover: boolean;
  currency: CurrencyCode;
  disabled?: boolean[];
  checked?: boolean[];
  selectable?: boolean;
  onCheckedChange?: (selected: boolean, accommodationId: string) => void;
}

export const AccommodationList = ({ accommodations, paymentFeeCover, currency, disabled = [], checked = [], selectable = false, onCheckedChange }: IAccommodationList) => {
  const t = useTranslations('global/components/accommodation-list');

  return (
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
            {accommodations.map((acc, i) => (
              <tr key={i} className="border-b border-border/50 last:border-b-0 hover:bg-muted/25 dark:hover:bg-muted/20">
                <td className="min-w-0 max-w-[12rem] break-words py-2.5 pl-3 pr-1 sm:max-w-none sm:pr-2 sm:py-3 sm:pl-3">{acc.description}</td>
                <td className="w-[1%] whitespace-nowrap py-2.5 pl-1 pr-3 text-right tabular-nums sm:pl-2 sm:pr-3 sm:py-3">
                  {`${paymentFeeCover ? convertCurrencyIntegerToDecimal(acc.costIncPaymentCosts, currency).toFixed(2) : convertCurrencyIntegerToDecimal(acc.cost, currency).toFixed(2)} ${getCurrencySymbol(currency)}`.replace(
                    '.',
                    ',',
                  )}
                </td>
                {selectable && (
                  <td className="w-12 min-w-12 p-0 text-center sm:pl-0">
                    <div className="flex min-h-10 w-full items-center justify-center sm:min-h-12">
                      <Checkbox
                        id={`input-accommodation-${i}`}
                        checked={!!checked[i]}
                        disabled={!!disabled[i]}
                        onCheckedChange={v => {
                          if (onCheckedChange && acc.id) onCheckedChange(v === true, acc.id);
                        }}
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
  );
};
