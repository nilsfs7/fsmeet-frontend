interface ICheckBoxInput {
  id: string;
  label: string;
  value?: boolean;
  onChange?: (event: any) => void;
}

const CheckBox = ({ id, label, value, onChange }: ICheckBoxInput) => {
  return (
    <div className="m-2 grid grid-cols-2 place-items-start items-center">
      <div className="p-2">{label}</div>
      <input id={id} className="h-4 w-4" type="checkbox" checked={value} onChange={onChange} />
    </div>
  );
};

export default CheckBox;
