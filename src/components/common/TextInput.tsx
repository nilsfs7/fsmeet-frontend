interface ITextInput {
  id: string;
  label: string;
  labelOnTop?: boolean;
  placeholder?: string;
  defValue?: string;
  value?: string;
  maxInputLength?: number;
  type?: string;
  onChange?: (event: any) => void;
  onKeyDown?: (event: any) => void;
}

const TextInput = ({ id, label, labelOnTop = true, placeholder, defValue, value, maxInputLength, type, onChange, onKeyDown }: ITextInput) => {
  return (
    <>
      {labelOnTop && (
        <div className="m-2 flex h-[100%] flex-col">
          <div>{label}</div>
          <div className="flex h-full">
            <input
              id={id}
              className="h-full w-full rounded-lg border border-secondary-dark p-1"
              type={type}
              placeholder={placeholder}
              defaultValue={defValue}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
          </div>

          {maxInputLength && <div className="flex justify-end p-1 text-xs">{`(${value?.length || 0}/${maxInputLength})`}</div>}
        </div>
      )}

      {!labelOnTop && (
        <div className="m-2 grid h-[100%] grid-cols-2">
          <div>{label}</div>
          <input id={id} className="h-full w-full rounded-lg p-1" type={type} placeholder={placeholder} defaultValue={defValue} value={value} onChange={onChange} onKeyDown={onKeyDown} />

          <div></div>
          {maxInputLength && <div className="flex justify-end p-1 text-xs">{`(${value?.length || 0}/${maxInputLength})`}</div>}
        </div>
      )}
    </>
  );
};

export default TextInput;
