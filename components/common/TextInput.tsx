interface ITextInput {
  id: string;
  label: string;
  placeholder?: string;
  defValue?: string;
  onChanged?: (event: any) => void;
}

const TextInput = ({ id, label, placeholder, defValue, onChanged }: ITextInput) => {
  return (
    <div className="m-2 grid grid-cols-2">
      <div className="p-2">{label}</div>
      <input id={id} className="rounded-lg p-2" placeholder={placeholder} onChange={onChanged} defaultValue={defValue} />
    </div>
  );
};

export default TextInput;
