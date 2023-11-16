interface ISepaInfo {
  participationFee: number;
}

const CashInfo = ({ participationFee }: ISepaInfo) => {
  return (
    <div className="grid grid-cols-1 justify-between">
      <div className="">Cash (pay on arrival)</div>

      <div className="grid grid-cols-2 justify-between">
        <div>Amount</div>
        <div className="select-text">{participationFee.toString().replace('.', ',')}€</div>
      </div>
    </div>
  );
};

export default CashInfo;
