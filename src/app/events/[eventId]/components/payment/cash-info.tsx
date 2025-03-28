interface ICashInfo {
  participationFee: number;
}

export const CashInfo = ({ participationFee }: ICashInfo) => {
  return (
    <div className="grid grid-cols-1 justify-between">
      <div className="underline">Cash (pay on arrival)</div>

      <div className="grid grid-cols-2 justify-between">
        <div>{`Amount`}</div>
        <div className="select-text">{participationFee.toString().replace('.', ',')}€</div>
      </div>
    </div>
  );
};
