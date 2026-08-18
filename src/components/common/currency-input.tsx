'use client';

import { useEffect, useState } from 'react';
import CurrencyInput, { CurrencyInputOnChangeValues } from 'react-currency-input-field';

const DECIMAL_SEPARATOR = ',';
const GROUP_SEPARATOR = '.';

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

function formatNumericValue(value: number): string {
  return String(value).replace('.', DECIMAL_SEPARATOR);
}

function parseDisplayValue(display: string): number | null {
  if (!display) {
    return null;
  }
  const normalized = display.replaceAll(GROUP_SEPARATOR, '').replace(DECIMAL_SEPARATOR, '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function isIncompleteDecimal(display: string): boolean {
  return display.endsWith(DECIMAL_SEPARATOR);
}

function toInitialDisplay(value: string | number | undefined): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return formatNumericValue(value);
  }
  if (typeof value === 'string') {
    return value;
  }
  return '';
}

const CurInput = ({ id, label, labelOnTop = true, placeholder, defValue, value, onValueChange, onKeyDown }: ICurrencyInput) => {
  const [display, setDisplay] = useState(() => toInitialDisplay(value));

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
      if (isIncompleteDecimal(prev)) {
        return prev;
      }
      const parsed = parseDisplayValue(prev);
      if (parsed === value) {
        return prev;
      }
      return formatNumericValue(value);
    });
  }, [value]);

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
      decimalSeparator={DECIMAL_SEPARATOR}
      groupSeparator={GROUP_SEPARATOR}
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
