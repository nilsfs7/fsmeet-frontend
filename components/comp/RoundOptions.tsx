import { Round } from '@/types/round';

interface IRoundOptionsProps {
  round: Round;
  roundIndex: number;
  minMatchSize: number;
  numParticipants: number;
  minPassingPerMatch: number;
  minPassingExtra: number;
  onChangeMaxMatchSize: (val: number) => void;
  onChangePassingPerMatch: (val: number) => void;
  onChangePassingExtra: (val: number) => void;
}

const RoundOptions = ({
  round,
  roundIndex,
  minMatchSize,
  numParticipants,
  minPassingPerMatch,
  minPassingExtra,
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
    <div className="flex gap-2 p-1">
      <div>
        <div className="">Num Players</div>
        {/* {round.numberPlayers > 2 && (
                      <> */}
        <div className="">Max Match Size</div>
        <div className="">Num Matches</div>
        <div className="">Passing Per Match</div>
        <div className="">Num Passing Round</div>
        <div className="">Passing Extra</div>
        <div className="">Num Passing Total</div>
        {/* </>
                    )} */}
      </div>

      <div>
        <div className="text-end">{round.numberPlayers}</div>

        {/* {round.numberPlayers > 2 && (
                      <> */}
        <div className="text-end">
          <input
            id={`input-max-match-size-${roundIndex}`}
            type="number"
            min={minMatchSize}
            max={numParticipants}
            defaultValue={minMatchSize}
            onChange={e => {
              changeMaxMatchSize(e.currentTarget.value);
            }}
          />
        </div>

        <div className="text-end">{round.matches.length}</div>

        <div className="text-end">
          <input
            id={`input-max-passing-${roundIndex}`}
            type="number"
            min={minPassingPerMatch}
            defaultValue={minPassingPerMatch}
            onChange={e => {
              changePassingPerMatch(e.currentTarget.value);
            }}
          />
        </div>

        <div className="text-end">{round.matches.length * round.passingPerMatch}</div>

        <div className="text-end">
          <input
            id={`input-passing-extra-${roundIndex}`}
            className="text-end"
            type="number"
            min={minPassingExtra}
            defaultValue={minPassingExtra}
            onChange={e => {
              changePassingExtra(e.currentTarget.value);
            }}
          />
        </div>

        <div className="text-end">{round.advancingTotal}</div>
        {/* </>
                    )} */}
      </div>
    </div>
  );
};

export default RoundOptions;
