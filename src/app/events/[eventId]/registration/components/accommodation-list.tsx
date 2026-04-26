'use client';

import { CurrencyCode } from '@/domain/enums/currency-code';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { Accommodation } from '@/domain/types/accommodation';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';

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
    <table className={`border-secondary-dark bg-secondary-light gap-x-4 p-2 w-full`}>
      {/* todo: color code for head bg*/}
      <thead className="bg-gray-200 text-primary uppercase text-sm leading-normal">
        <tr className="text-left whitespace-nowrap">
          <th className="py-3 px-3 rounded-l-lg">{t('columnTitleDescription')}</th>
          <th className={`py-3 px-3 ${selectable ? '' : 'rounded-r-lg'}`}>{t('columnTitleCost')}</th>
          {selectable && <th className="py-3 px-3 rounded-r-lg">{t('columnTitleSelection')}</th>}
        </tr>
      </thead>
      <tbody className="text-primary text-sm">
        {accommodations.map((acc, i) => (
          <tr key={i} className={`${i < accommodations.length - 1 ? 'border-b border-secondary-dark' : ''} hover:bg-secondary-light`}>
            <td className="py-3 px-3">{acc.description}</td>
            <td className="py-3 px-3 text-right capitalize whitespace-nowrap">
              {`${paymentFeeCover ? convertCurrencyIntegerToDecimal(acc.costIncPaymentCosts, currency).toFixed(2) : convertCurrencyIntegerToDecimal(acc.cost, currency).toFixed(2)} ${getCurrencySymbol(currency)}`.replace(
                '.',
                ','
              )}
            </td>
            {selectable && (
              <td className="py-3 px-3 text-center">
                <div className="flex justify-center">
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
  );
};
