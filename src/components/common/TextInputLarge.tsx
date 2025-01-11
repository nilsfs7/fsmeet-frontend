interface ITextInput {
  id: string;
  label: string;
  labelOnTop?: boolean;
  placeholder?: string;
  defValue?: string;
  value?: string;
  maxInputLength?: number;
  resizable?: boolean;
  onChange?: (event: any) => void;
  onKeyDown?: (event: any) => void;
}

const TextInputLarge = ({ id, label, labelOnTop = true, placeholder, defValue, value, maxInputLength, resizable = false, onChange, onKeyDown }: ITextInput) => {
  return (
    <>
      {labelOnTop && (
        <div className="flex h-[100%] flex-col p-2">
          <div>{label}</div>
          <div className="flex h-full">
            <textarea
              id={id}
              className={`h-full w-full rounded-lg border border-secondary-dark p-1 ${resizable ? 'resize-y' : 'resize-none'}`}
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
        <div className="grid h-[100%] grid-cols-2 p-2">
          <div>{label}</div>

          <textarea
            id={id}
            className={`h-full w-full resize-none rounded-lg border border-secondary-dark p-1 ${resizable ? 'resize-y' : 'resize-none'}`}
            placeholder={placeholder}
            defaultValue={defValue}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />

          <div></div>
          {maxInputLength && <div className="flex justify-end p-1 text-xs">{`(${value?.length || 0}/${maxInputLength})`}</div>}
        </div>
      )}
    </>
  );
};

export default TextInputLarge;
