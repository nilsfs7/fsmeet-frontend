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
        <div className="m-2 flex h-[100%] flex-col">
          <div>{label}</div>

          <div className="flex h-full">
            <CurrencyInput
              id={id}
              className="h-full w-full rounded-lg border border-secondary-dark p-1"
              placeholder={placeholder}
              defaultValue={defValue}
              value={value?.toString().replace('.', ',')}
              decimalsLimit={2}
              decimalSeparator=","
              groupSeparator="."
              suffix=" €"
              onValueChange={onValueChange}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>
      )}

      {!labelOnTop && (
        <div className="m-2 grid h-[100%] grid-cols-2">
          <div>{label}</div>
          <CurrencyInput
            id={id}
            className="h-full w-full rounded-lg p-1"
            placeholder={placeholder}
            defaultValue={defValue}
            value={value?.toString().replace('.', ',')}
            decimalsLimit={2}
            decimalSeparator=","
            groupSeparator="."
            suffix=" €"
            onValueChange={onValueChange}
            onKeyDown={onKeyDown}
          />
        </div>
      )}
    </>
  );
};

export default CurInput;
