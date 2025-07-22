'use client';

import ComboBox from '@/components/common/ComboBox';
import { menuTShirtSizesWithUnspecified } from '@/domain/constants/menus/menu-t-shirt-sizes';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { EventRegistrationType } from '@/domain/types/event-registration-type';
import { Offering } from '@/domain/types/offering';
import { useTranslations } from 'next-intl';

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
    <div className="flex flex-col gap-2">
      <table className={`border-secondary-dark bg-secondary-light gap-x-4 p-2 w-full`}>
        {/* todo: color code for head bg */}
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
              <td className="py-3 px-3 text-right capitalize whitespace-nowrap">
                {`${paymentFeeCover ? convertCurrencyIntegerToDecimal(offering.costIncPaymentCosts, currency).toFixed(2) : convertCurrencyIntegerToDecimal(offering.cost, currency).toFixed(2)} ${getCurrencySymbol(currency)}`.replace(
                  '.',
                  ','
                )}
              </td>
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

      {tShirtSize &&
        offerings.some((off, i) => {
          if (off.includesShirt && checked[i]) {
            return off;
          }
        }) && (
          <div className="p-2">
            <div className="grid grid-cols-2 items-center">
              <div>{t('cbShirtSize')}</div>
              <div className="flex w-full">
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
