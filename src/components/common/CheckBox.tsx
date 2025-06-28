interface ICheckBoxInput {
  id: string;
  label: string;
  value?: boolean;
  disabled?: boolean;
  onChange?: (event: any) => void;
}

const CheckBox = ({ id, label, value, disabled = false, onChange }: ICheckBoxInput) => {
  return (
    <div className="m-2 grid grid-cols-2 place-items-start items-center gap-2">
      <div className="py-1">{label}</div>
      <input id={id} className="h-4 w-4" type="checkbox" checked={value} disabled={disabled} onChange={onChange} />
    </div>
  );
};

export default CheckBox;
