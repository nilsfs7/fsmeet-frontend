interface IMatchProps {
  name: string;
  slots: number;
}

const MatchCard = ({ name, slots }: IMatchProps) => {
  return (
    <div className={`rounded-lg border border-primary ${slots > 1 ? 'bg-secondary-light' : 'bg-attention'}  p-2 hover:bg-primary`}>
      <div className="text-center">{name}</div>
      <hr />
      {[...Array(slots)].map((val: any, i: number) => {
        val = i + 1;
        return <div key={`slot-${i}`}>{`slot ${val}`}</div>;
      })}
    </div>
  );
};

export default MatchCard;
