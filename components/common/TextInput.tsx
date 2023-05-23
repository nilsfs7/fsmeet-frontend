interface ITextInput {
  id: string;
  label: string;
  placeholder?: string;
  defValue?: string;
  value?: string;
  onChange?: (event: any) => void;
  onKeyDown?: (event: any) => void;
}

const TextInput = ({ id, label, placeholder, defValue, value, onChange, onKeyDown }: ITextInput) => {
  return (
    <div className="m-2 grid grid-cols-2">
      <div className="p-2">{label}</div>
      <input id={id} className="rounded-lg p-2" placeholder={placeholder} defaultValue={defValue} value={value} onChange={onChange} onKeyDown={onKeyDown} />
    </div>
  );
};

export default TextInput;
