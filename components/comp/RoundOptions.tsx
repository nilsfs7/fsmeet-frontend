import { Round } from '@/types/round';

interface IRoundOptionsProps {
  round: Round;
  minMatchSize: number;
  numParticipants: number;
  minPassingPerMatch: number;
  minPassingExtra: number;
  lockUi: boolean;
  onChangeMaxMatchSize: (val: number) => void;
  onChangePassingPerMatch: (val: number) => void;
  onChangePassingExtra: (val: number) => void;
}

const RoundOptions = ({
  round,
  minMatchSize,
  numParticipants,
  minPassingPerMatch,
  minPassingExtra,
  lockUi,
  onChangeMaxMatchSize,
  onChangePassingPerMatch,
  onChangePassingExtra,
}: IRoundOptionsProps) => {
  const changeMaxMatchSize = (maxMatchSize: string) => {
    if (maxMatchSize) {
      onChangeMaxMatchSize(+maxMatchSize);
    }
  };

  const changePassingPerMatch = (passingPerMatch: string) => {
    if (passingPerMatch) {
      onChangePassingPerMatch(+passingPerMatch);
    }
  };

  const changePassingExtra = (passingExtra: string) => {
    if (passingExtra) {
      onChangePassingExtra(+passingExtra);
    }
  };

  return (
    <div className="flex flex-col p-1">
      <div className="flex items-end justify-between gap-2">
        <div className="">Num Players</div>
        <div className="text-end">{round.numberPlayers}</div>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="">Max Match Size</div>
        <div className="text-end">
          <input
            id={`input-max-match-size-${round.roundIndex}`}
            type="number"
            min={minMatchSize}
            max={numParticipants}
            defaultValue={minMatchSize}
            disabled={lockUi}
            onChange={e => {
              changeMaxMatchSize(e.currentTarget.value);
            }}
          />
        </div>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="">Num Matches</div>
        <div className="text-end">{round.matches.length}</div>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="">Passing Per Match</div>
        <div className="text-end">
          <input
            id={`input-max-passing-${round.roundIndex}`}
            type="number"
            min={minPassingPerMatch}
            defaultValue={minPassingPerMatch}
            disabled={lockUi}
            onChange={e => {
              changePassingPerMatch(e.currentTarget.value);
            }}
          />
        </div>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="">Num Passing Round</div>
        <div className="text-end">{round.matches.length * round.passingPerMatch}</div>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="">Passing Extra</div>
        <div className="text-end">
          <input
            id={`input-passing-extra-${round.roundIndex}`}
            className="text-end"
            type="number"
            min={minPassingExtra}
            defaultValue={round.passingExtra}
            disabled={lockUi}
            onChange={e => {
              changePassingExtra(e.currentTarget.value);
            }}
          />
        </div>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="">Num Passing Total</div>
        <div className="text-end">{round.advancingTotal}</div>
      </div>
    </div>
  );
};

export default RoundOptions;
