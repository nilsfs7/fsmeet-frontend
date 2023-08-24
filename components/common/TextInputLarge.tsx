interface ITextInput {
  id: string;
  label: string;
  labelOnTop?: boolean;
  placeholder?: string;
  defValue?: string;
  value?: string;
  resizable?: boolean;
  onChange?: (event: any) => void;
  onKeyDown?: (event: any) => void;
}

const TextInputLarge = ({ id, label, labelOnTop = true, placeholder, defValue, value, resizable = false, onChange, onKeyDown }: ITextInput) => {
  return (
    <>
      {labelOnTop && (
        <div className="m-2 flex h-[100%] flex-col">
          <div>{label}</div>

          <div className="flex h-full">
            <textarea
              id={id}
              className={`h-full w-full rounded-lg p-1 ${resizable ? 'resize-y' : 'resize-none'}`}
              placeholder={placeholder}
              defaultValue={defValue}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>
      )}

      {!labelOnTop && (
        <div className="m-2 grid h-[100%] grid-cols-2">
          <div>{label}</div>
          <textarea
            id={id}
            className={`h-full w-full resize-none rounded-lg p-1 ${resizable ? 'resize-y' : 'resize-none'}`}
            placeholder={placeholder}
            defaultValue={defValue}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
        </div>
      )}
    </>
  );
};

export default TextInputLarge;
