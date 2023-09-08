/*
- runden erst erstellen lassen nachdem registrierung zuende
  - dadurch ist die teilnehmeranzahl bekannt

*/

import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { routeLogin } from '@/types/consts/routes';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import Navigation from '@/components/Navigation';
import MatchCard from '@/components/comp/MatchCard';

export type Match = {
  name: string;
  slots: number;
};

export class Round {
  public name: string;
  public numberPlayers: number;
  public maxMatchSize: number = 2;
  public matches: Match[] = [];
  public passingPerMatch: number = 1;
  public passingExtra: number = 0;

  constructor(name: string, numberPlayers: number) {
    this.name = name;
    this.numberPlayers = numberPlayers;

    this.matches = this.createMatches();
  }

  public get advancingTotal(): number {
    const advancing = this.matches.length * this.passingPerMatch + this.passingExtra;

    if (advancing > this.numberPlayers) {
      return this.numberPlayers;
    }

    return advancing;
  }

  public get maxPossibleAdvancingExtra(): number {
    const maxAdvancingExtra = this.numberPlayers - this.matches.length * this.passingPerMatch;

    if (maxAdvancingExtra < 0) {
      return 0;
    }

    return maxAdvancingExtra;
  }

  public createMatches = (): Match[] => {
    const getInitialMatchSize = (numPlayers: number, numMatches: number, maxMatchSize: number): number => {
      while (numMatches * maxMatchSize > numPlayers) {
        maxMatchSize -= 1;
      }

      return maxMatchSize;
    };

    let matches: Match[] = [];

    const numMatches: number = Math.ceil(this.numberPlayers / this.maxMatchSize);

    const modulo = this.numberPlayers % this.maxMatchSize;
    if (modulo === 0) {
      for (let i = 0; i < numMatches; i++) {
        matches.push({ name: `match ${i}`, slots: this.maxMatchSize });
      }
    } else {
      let initialSlots = getInitialMatchSize(this.numberPlayers, numMatches, this.maxMatchSize);
      let distributedSlots = 0;

      // distribute save (initial) slots
      for (let i = 0; i < numMatches; i++) {
        matches.push({ name: `match ${i}`, slots: initialSlots });
        distributedSlots += initialSlots;
      }

      // distribute leftover slots
      const slotsLeft = this.numberPlayers - distributedSlots;
      for (let i = 0; i < slotsLeft; i++) {
        matches[i].slots += 1;
      }
    }

    return matches;
  };
}

const ModeEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [numParticipants, setParticipants] = useState<number>(25);

  const minMatchSize = 2;
  const minPassingPerMatch = 1;
  const minPassingExtra = 0;

  const initRound = new Round('Round 1', numParticipants);

  const [rounds, setRounds] = useState<Round[]>([initRound]);

  if (!session) {
    router.push(routeLogin);
  }

  const handleSaveClicked = async () => {
    // const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/competition`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({
    //     id: compId,
    //     eventId: eventId,
    //     name: comp?.name.trim(),
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${session.user.accessToken}`,
    //   },
    // });
    // if (response.status == 200) {
    //   router.replace(`/events/${eventId}/comps`);
    // }
  };

  useEffect(() => {
    rounds.map((rnd, i) => {
      // update input "max-match-size"
      const inputMaxMatchSize = document.getElementById(`input-max-match-size-${i}`);
      if (inputMaxMatchSize) {
        const maxMatchSize = i === 0 ? numParticipants : getParentRound(i).advancingTotal;
        inputMaxMatchSize.setAttribute('max', maxMatchSize.toString());
      }

      // update input "max-passing"
      const inputMaxPassing = document.getElementById(`input-max-passing-${i}`);
      if (inputMaxPassing) {
        const maxPassing = rnd.maxMatchSize;
        inputMaxPassing.setAttribute('max', maxPassing.toString());
      }

      // update input "passing-extra"
      const inputPassingExtra = document.getElementById(`input-passing-extra-${i}`);
      if (inputPassingExtra) {
        inputPassingExtra.setAttribute('max', rnd.maxPossibleAdvancingExtra.toString());
      }
    });
  }, [rounds]);

  const addRound = () => {
    const rnds = Array.from(rounds);

    const lastRound = getLastRound();

    const newRound = new Round(`Round ${rounds.length + 1}`, lastRound.advancingTotal);
    rnds.push(newRound);
    setRounds(rnds);
  };

  const removeLastRound = () => {
    const rnds = Array.from(rounds);
    rnds.pop();
    setRounds(rnds);
  };

  const getParentRound = (roundId: number): Round => {
    return rounds[roundId - 1];
  };

  const getLastRound = (): Round => {
    return rounds[rounds.length - 1];
  };

  const changeMatchSize = (roundId: number, maxMatchSize: string) => {
    const rnds = Array.from(rounds);

    const parentRound = getParentRound(roundId);
    const maxVal = roundId === 0 ? numParticipants : parentRound.matches.length * parentRound.passingPerMatch + parentRound.passingExtra;

    if (+maxMatchSize >= minMatchSize && +maxMatchSize <= maxVal) {
      rnds[roundId].maxMatchSize = +maxMatchSize;
      rnds[roundId].matches = rnds[roundId].createMatches();
      setRounds(rnds);
    }
  };

  const changePassingPerMatch = (roundId: number, passingPerMatch: string) => {
    const rnds = Array.from(rounds);

    if (+passingPerMatch >= minPassingPerMatch && +passingPerMatch <= rnds[roundId].maxMatchSize) {
      rnds[roundId].passingPerMatch = +passingPerMatch;
      setRounds(rnds);
    }
  };

  const changePassingExtra = (roundId: number, passingExtra: string) => {
    const rnds = Array.from(rounds);

    if (+passingExtra >= minPassingExtra && +passingExtra <= rnds[roundId].maxPossibleAdvancingExtra) {
      rnds[roundId].passingExtra = +passingExtra;
      setRounds(rnds);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div className={'flex flex-col items-center'}>
        <h1 className="m-2 text-xl">Edit Mode</h1>

        <div className="my-2 flex">
          <div className="pr-1">
            <div className="flex h-full items-center">Add round</div>
          </div>
          <div className="pl-1">
            <ActionButton action={Action.ADD} onClick={addRound} />
          </div>
        </div>

        <div className="my-2 flex">
          <div className="pr-1">
            <div className="flex h-full items-center">Remove round</div>
          </div>
          <div className="pl-1">
            <ActionButton action={Action.CANCEL} onClick={removeLastRound} />
          </div>
        </div>
      </div>

      <div className={`m-2 flex justify-center overflow-y-auto `}>
        <div className={'grid grid-flow-col overflow-x-auto'}>
          {rounds.map((round: Round, i: number) => {
            return (
              <div key={`rnd-${i}`} className="m-1 rounded-lg border border-black bg-primary-light p-1">
                <div className="my-1 text-center">{round.name}</div>

                <hr />

                <div className="flex gap-2 p-1">
                  <div>
                    <div className="">Num Players</div>
                    <div className="">Max Match Size</div>
                    <div className="">Num Matches</div>
                    <div className="">Passing Per Match</div>
                    <div className="">Num Passing Round</div>
                    <div className="">Passing Extra</div>
                    <div className="">Num Passing Total</div>
                  </div>

                  <div>
                    <div className="text-end">{round.numberPlayers}</div>

                    <div className="text-end">
                      <input
                        id={`input-max-match-size-${i}`}
                        type="number"
                        min={minMatchSize}
                        max={numParticipants}
                        defaultValue={minMatchSize}
                        onChange={e => {
                          changeMatchSize(i, e.currentTarget.value);
                        }}
                      />
                    </div>

                    <div className="text-end">{round.matches.length}</div>

                    <div className="text-end">
                      <input
                        id={`input-max-passing-${i}`}
                        type="number"
                        min={minPassingPerMatch}
                        defaultValue={minPassingPerMatch}
                        onChange={e => {
                          changePassingPerMatch(i, e.currentTarget.value);
                        }}
                      />
                    </div>

                    <div className="text-end">{round.matches.length * round.passingPerMatch}</div>

                    <div className="text-end">
                      <input
                        id={`input-passing-extra-${i}`}
                        className="text-end"
                        type="number"
                        min={minPassingExtra}
                        defaultValue={minPassingExtra}
                        onChange={e => {
                          changePassingExtra(i, e.currentTarget.value);
                        }}
                      />
                    </div>

                    <div className="text-end">{round.advancingTotal}</div>
                  </div>
                </div>

                <div className="mt-4">
                  {round.matches.map((match, j) => {
                    return (
                      <div key={`match-${j}`} className="my-1">
                        <MatchCard name={`Match ${j + 1}`} slots={match.slots} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Navigation>
        <ActionButton action={Action.CANCEL} onClick={() => router.back()} />
        <ActionButton action={Action.SAVE} onClick={handleSaveClicked} />
      </Navigation>
    </div>
  );
};

export default ModeEditing;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
