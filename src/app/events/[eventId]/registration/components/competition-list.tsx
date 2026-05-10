'use client';

import { CurrencyCode } from '@/domain/enums/currency-code';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { Competition } from '@/domain/types/competition';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { registrationListScrollClass, registrationListShellClass } from './registration-list-layout';

interface ICompetitionList {
  competitions: Competition[];
  amountRegistrations: number[];
  paymentFeeCover: boolean;
  currency: CurrencyCode;
  disabled?: boolean[];
  checked?: boolean[];
  selectable?: boolean;
  onCheckedChange?: (selected: boolean, compId: string) => void;
}

export const CompetitionList = ({ competitions, amountRegistrations, paymentFeeCover, currency, disabled = [], checked = [], selectable = false, onCheckedChange }: ICompetitionList) => {
  const t = useTranslations('global/components/competition-list');

  return (
    <div className={registrationListShellClass}>
      <div className={registrationListScrollClass}>
        <table className="w-full min-w-0 text-sm text-foreground">
          <thead className="bg-muted/80 text-foreground/90">
            <tr className="text-left text-xs font-medium uppercase leading-normal tracking-wide">
              <th className="w-[1%] whitespace-nowrap py-2.5 pl-3 pr-1 sm:py-3 sm:pl-3 sm:pr-2">{t('columnTitleCompType')}</th>
              <th className="min-w-0 max-w-[12rem] py-2.5 px-1 sm:max-w-none sm:px-2 sm:py-3">{t('columnTitleName')}</th>
              <th className="w-[1%] whitespace-nowrap px-1 py-2.5 sm:px-2 sm:py-3">{t('columnTitleGender')}</th>
              <th
                className={cn(
                  'w-[1%] whitespace-nowrap py-2.5 pl-1 pr-3 text-right tabular-nums sm:pl-2 sm:pr-3 sm:py-3',
                  !selectable && 'rounded-tr-xl',
                )}
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
            {competitions.map((comp, i) => (
              <tr key={i} className="border-b border-border/50 last:border-b-0 hover:bg-muted/25 dark:hover:bg-muted/20">
                <td className="max-w-32 min-w-0 whitespace-nowrap py-2.5 pl-3 pr-1 capitalize sm:max-w-none sm:py-3 sm:pl-3 sm:pr-2">
                  {comp.type.replaceAll('_', ' ')}
                </td>
                <td className="min-w-0 max-w-48 break-words py-2.5 px-1 sm:max-w-none sm:px-2 sm:py-3">
                  {comp.maxAmountParticipants > 0
                    ? `${comp.name} [${amountRegistrations[i]}/${comp.maxAmountParticipants}]`
                    : `${comp.name}`}
                </td>
                <td className="w-[1%] whitespace-nowrap px-1 py-2.5 capitalize sm:px-2 sm:py-3">{comp.gender}</td>
                <td className="w-[1%] whitespace-nowrap py-2.5 pl-1 pr-3 text-right tabular-nums sm:pl-2 sm:pr-3 sm:py-3">
                  {`${paymentFeeCover ? convertCurrencyIntegerToDecimal(comp.participationFeeIncPaymentCosts, currency).toFixed(2) : convertCurrencyIntegerToDecimal(comp.participationFee, currency).toFixed(2)} ${getCurrencySymbol(currency)}`.replace(
                    '.',
                    ',',
                  )}
                </td>
                {selectable && (
                  <td className="w-12 min-w-12 p-0 text-center sm:pl-0">
                    <div className="flex min-h-10 w-full items-center justify-center sm:min-h-12">
                      <Checkbox
                        id={`input-competition-${i}`}
                        checked={!!checked[i]}
                        disabled={!!disabled[i]}
                        onCheckedChange={v => {
                          if (onCheckedChange && comp.id) onCheckedChange(v === true, comp.id);
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
