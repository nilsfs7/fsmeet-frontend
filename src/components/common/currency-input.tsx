'use client';

import { useEffect, useMemo, useState } from 'react';
import CurrencyInput, { CurrencyInputOnChangeValues } from 'react-currency-input-field';
import { useLocale } from 'next-intl';

/** App locales are country codes (gb, de, …); expand to a BCP 47 tag via likely subtags. */
function toIntlLocale(appLocale: string): string {
  const region = appLocale.trim().toUpperCase();
  try {
    return new Intl.Locale(`und-${region}`).maximize().toString();
  } catch {
    return 'en-GB';
  }
}

function getCurrencySeparators(appLocale: string): { decimalSeparator: string; groupSeparator: string } {
  const intlLocale = toIntlLocale(appLocale);
  const parts = new Intl.NumberFormat(intlLocale, { numberingSystem: 'latn' }).formatToParts(12345.6);
  const decimalSeparator = parts.find(part => part.type === 'decimal')?.value ?? '.';
  let groupSeparator = parts.find(part => part.type === 'group')?.value ?? '';
  if (!groupSeparator || groupSeparator === decimalSeparator) {
    groupSeparator = decimalSeparator === '.' ? ',' : '.';
  }
  return { decimalSeparator, groupSeparator };
}

interface ICurrencyInput {
  id: string;
  label: string;
  labelOnTop?: boolean;
  placeholder?: string;
  defValue?: number;
  value?: string | number;
  onValueChange?: ((value: string | undefined, name?: string | undefined, values?: CurrencyInputOnChangeValues | undefined) => void) | undefined;
  onKeyDown?: (event: any) => void;
}

function formatNumericValue(value: number, decimalSeparator: string): string {
  return String(value).replace('.', decimalSeparator);
}

function parseDisplayValue(display: string, decimalSeparator: string, groupSeparator: string): number | null {
  if (!display) {
    return null;
  }
  const normalized = display.replaceAll(groupSeparator, '').replace(decimalSeparator, '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function isIncompleteDecimal(display: string, decimalSeparator: string): boolean {
  return display.endsWith(decimalSeparator);
}

function toInitialDisplay(value: string | number | undefined, decimalSeparator: string): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return formatNumericValue(value, decimalSeparator);
  }
  if (typeof value === 'string') {
    return value;
  }
  return '';
}

const CurInput = ({ id, label, labelOnTop = true, placeholder, defValue, value, onValueChange, onKeyDown }: ICurrencyInput) => {
  const locale = useLocale();
  const { decimalSeparator, groupSeparator } = useMemo(() => getCurrencySeparators(locale), [locale]);
  const [display, setDisplay] = useState(() => toInitialDisplay(value, decimalSeparator));

  // Keep a local string so typing "15," is not wiped when the parent re-renders with a rounded number.
  useEffect(() => {
    if (typeof value === 'string') {
      setDisplay(prev => (prev === value ? prev : value));
      return;
    }
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return;
    }
    setDisplay(prev => {
      if (isIncompleteDecimal(prev, decimalSeparator)) {
        return prev;
      }
      const parsed = parseDisplayValue(prev, decimalSeparator, groupSeparator);
      if (parsed === value) {
        return prev;
      }
      return formatNumericValue(value, decimalSeparator);
    });
  }, [value, decimalSeparator, groupSeparator]);

  const handleValueChange = (next: string | undefined, name?: string, values?: CurrencyInputOnChangeValues) => {
    setDisplay(next ?? '');
    onValueChange?.(next, name, values);
  };

  const input = (
    <CurrencyInput
      id={id}
      className={labelOnTop ? 'h-full w-full rounded-lg border border-secondary-dark p-1' : 'h-full w-full rounded-lg p-1'}
      placeholder={placeholder}
      defaultValue={defValue}
      value={display}
      decimalsLimit={2}
      decimalSeparator={decimalSeparator}
      groupSeparator={groupSeparator}
      onValueChange={handleValueChange}
      onKeyDown={onKeyDown}
    />
  );

  if (labelOnTop) {
    return (
      <div className="flex h-[100%] flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-medium leading-none">
          {label}
        </label>
        <div className="flex h-full min-w-0">{input}</div>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-2 items-start gap-x-2 gap-y-1">
      <label htmlFor={id} className="pt-2 text-sm font-medium leading-none">
        {label}
      </label>
      {input}
    </div>
  );
};

export default CurInput;
