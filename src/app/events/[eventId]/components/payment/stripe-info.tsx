interface IStripeInfo {
  participationFee: number;
}

export const StripeInfo = ({ participationFee }: IStripeInfo) => {
  return (
    <div className="grid grid-cols-1 justify-between">
      <div className="underline">{`Stripe (pay online)`}</div>

      <div className="grid grid-cols-2 justify-between">
        <div>{`Amount`}</div>
        <div className="select-text">{participationFee.toString().replace('.', ',')}€</div>
      </div>
    </div>
  );
};
