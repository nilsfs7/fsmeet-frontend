import CurrencyInput, { CurrencyInputOnChangeValues } from 'react-currency-input-field';

interface ICurrencyInput {
  id: string;
  label: string;
  labelOnTop?: boolean;
  placeholder?: string;
  defValue?: number;
  value?: number;
  onValueChange?: ((value: string | undefined, name?: string | undefined, values?: CurrencyInputOnChangeValues | undefined) => void) | undefined;
  onKeyDown?: (event: any) => void;
}

const CurInput = ({ id, label, labelOnTop = true, placeholder, defValue, value, onValueChange, onKeyDown }: ICurrencyInput) => {
  return (
    <>
      {labelOnTop && (
        <div className="m-2 flex h-[100%] flex-col gap-1.5">
          <label htmlFor={id} className="text-sm font-medium leading-none">
            {label}
          </label>

          <div className="flex h-full min-w-0">
            <CurrencyInput
              id={id}
              className="h-full w-full rounded-lg border border-secondary-dark p-1"
              placeholder={placeholder}
              defaultValue={defValue}
              value={value}
              decimalsLimit={2}
              decimalSeparator=","
              groupSeparator="."
              onValueChange={onValueChange}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>
      )}

      {!labelOnTop && (
        <div className="m-2 grid h-[100%] grid-cols-2 items-start gap-x-2 gap-y-1">
          <label htmlFor={id} className="pt-2 text-sm font-medium leading-none">
            {label}
          </label>
          <CurrencyInput
            id={id}
            className="h-full w-full rounded-lg p-1"
            placeholder={placeholder}
            defaultValue={defValue}
            value={value}
            decimalsLimit={2}
            decimalSeparator=","
            groupSeparator="."
            onValueChange={onValueChange}
            onKeyDown={onKeyDown}
          />
        </div>
      )}
    </>
  );
};

export default CurInput;
