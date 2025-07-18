interface INumberInput {
  id: string;
  label: string;
  labelOnTop?: boolean;
  placeholder?: string;
  defValue?: number;
  value?: number;
  step?: string;
  onChange?: (event: any) => void;
  onKeyDown?: (event: any) => void;
}

const NumberInput = ({ id, label, labelOnTop = true, placeholder, defValue, value, step, onChange, onKeyDown }: INumberInput) => {
  return (
    <>
      {labelOnTop && (
        <div className="m-2 flex h-[100%] flex-col">
          <div>{label}</div>

          <div className="flex h-full">
            <input
              id={id}
              className="h-full w-full rounded-lg border border-secondary-dark p-1"
              type="number"
              placeholder={placeholder}
              defaultValue={defValue}
              value={value}
              step={step}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>
      )}

      {!labelOnTop && (
        <div className="m-2 grid h-[100%] grid-cols-2">
          <div>{label}</div>
          <input id={id} className="h-full w-full rounded-lg p-1" type="number" placeholder={placeholder} defaultValue={defValue} value={value} step={step} onChange={onChange} onKeyDown={onKeyDown} />
        </div>
      )}
    </>
  );
};

export default NumberInput;
