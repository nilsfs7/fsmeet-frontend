'use client';

import type { ChangeEvent, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FieldLabel } from '@/components/common/field-label';

interface ITextInput {
  id: string;
  label: string;
  /** Optional help: hover on desktop, tap label to toggle on touch. */
  labelTooltip?: string;
  labelOnTop?: boolean;
  placeholder?: string;
  defValue?: string;
  value?: string;
  maxInputLength?: number;
  type?: string;
  readOnly?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

const TextInput = ({
  id,
  label,
  labelTooltip,
  labelOnTop = true,
  placeholder,
  defValue,
  value,
  maxInputLength,
  type,
  readOnly = false,
  onChange,
  onKeyDown,
}: ITextInput) => {
  const inputClass = cn('w-full', readOnly && 'bg-secondary-light');

  const input = (
    <Input
      id={id}
      className={inputClass}
      type={type}
      placeholder={placeholder}
      defaultValue={defValue}
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      onKeyDown={onKeyDown}
      aria-label={labelTooltip ? label : undefined}
    />
  );

  const lengthHint =
    maxInputLength != null ? (
      <p className="text-end text-xs text-muted-foreground">{`(${value?.length ?? 0}/${maxInputLength})`}</p>
    ) : null;

  if (!labelOnTop) {
    return (
      <div className="grid grid-cols-2 items-start gap-x-2 gap-y-1">
        <FieldLabel
          id={id}
          label={label}
          tooltip={labelTooltip}
          className="pt-2 text-sm font-medium leading-none"
        />
        <div className="flex min-w-0 flex-col gap-1">
          {input}
          {lengthHint}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel id={id} label={label} tooltip={labelTooltip} className="text-sm font-medium leading-none" />
      {input}
      {lengthHint}
    </div>
  );
};

export default TextInput;
