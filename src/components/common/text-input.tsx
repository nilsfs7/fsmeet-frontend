'use client';

import type * as React from 'react';
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
  /** Inline validation message shown under the input (marks it invalid). */
  error?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
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
  error,
  onBlur,
  onChange,
  onKeyDown,
}: ITextInput) => {
  const inputClass = cn('w-full', readOnly && 'bg-muted', error && 'border-critical focus-visible:ring-critical/30');
  const errorId = `${id}-error`;

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
      onBlur={onBlur}
      aria-label={labelTooltip ? label : undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
    />
  );

  const errorHint = error ? (
    <p id={errorId} className="text-xs font-medium text-critical" role="alert">
      {error}
    </p>
  ) : null;

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
          {errorHint}
          {lengthHint}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel id={id} label={label} tooltip={labelTooltip} className="text-sm font-medium leading-none" />
      {input}
      {errorHint}
      {lengthHint}
    </div>
  );
};

export default TextInput;
