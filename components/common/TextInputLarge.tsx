interface ITextInput {
  id: string;
  label: string;
  placeholder?: string;
  defValue?: string;
  value?: string;
  onChange?: (event: any) => void;
  onKeyDown?: (event: any) => void;
}

const TextInputLarge = ({ id, label, placeholder, defValue, value, onChange, onKeyDown }: ITextInput) => {
  return (
    <div className="flex h-[100%] flex-col p-2">
      <div className="py-1">
        <div className="pl-1">{label}</div>
      </div>

      <div className="flex h-full  py-1">
        <textarea id={id} className="h-full w-full resize-none rounded-lg p-2" placeholder={placeholder} defaultValue={defValue} value={value} onChange={onChange} onKeyDown={onKeyDown} />
      </div>
    </div>
  );
};

export default TextInputLarge;
