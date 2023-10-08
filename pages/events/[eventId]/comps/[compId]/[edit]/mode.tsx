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
import RoundOptions from '@/components/comp/RoundOptions';
import { Round } from '@/types/round';
import { Match } from '@/types/match';

const ModeEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [numParticipants, setParticipants] = useState<number>(25);

  const minMatchSize = 2;
  const minPassingPerMatch = 1;
  const minPassingExtra = 0;

  const [rounds, setRounds] = useState<Round[]>([]);
  const [roundOptionsLocked, setRoundOptionsLocked] = useState<boolean[]>([false]);

  if (!session) {
    router.push(routeLogin);
  }

  const fetchRounds = async (compId: string): Promise<Round[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/competition/${compId}/rounds`);
    const rnds: Round[] = await response.json();

    const rounds: Round[] = rnds.map(rnd => {
      const round = new Round(rnd.roundIndex, rnd.name, rnd.numberPlayers);
      round.passingExtra = rnd.passingExtra;
      round.passingPerMatch = rnd.passingPerMatch;
      console.log(`${rnd.roundIndex} ${rnd.passingExtra}`);
      round.matches = rnd.matches.sort((a, b) => (a.matchIndex > b.matchIndex ? 1 : -1)); // override auto generated matches (TODO: geht besser)
      return round;
    });

    return rounds;
  };

  const handleSaveClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/competition/rounds`, {
      method: 'POST',
      body: JSON.stringify({
        competitionId: compId,
        rounds: rounds,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    if (response.status == 201) {
      // router.replace(`/events/${eventId}/comps`);
      // TODO
    }
  };

  const handleDeleteClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/events/competition/rounds`, {
      method: 'DELETE',
      body: JSON.stringify({
        competitionId: compId,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    if (response.status == 200) {
      // router.replace(`/events/${eventId}/comps`);
      // TODO
    }
  };

  useEffect(() => {
    if (compId) {
      // @ts-ignore: next-line
      fetchRounds(compId).then(rounds => {
        if (rounds.length === 0) {
          const initRound = new Round(0, 'Round 1', numParticipants);
          setRounds([initRound]);
        } else {
          setRounds(rounds);
        }
      });
    }
  }, []);

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
    let optionLocks = Array.from(roundOptionsLocked);

    const lastRound = getLastRound();

    if (lastRound.advancingTotal > 1) {
      const newRound = new Round(rnds.length, `Round ${rounds.length + 1}`, lastRound.advancingTotal);
      rnds.push(newRound);
      setRounds(rnds);

      // manage UI locking
      optionLocks = optionLocks.map(() => true);
      optionLocks.push(newRound.numberPlayers === 2 ? true : false);
      setRoundOptionsLocked(optionLocks);
    }
  };

  const removeLastRound = () => {
    const rnds = Array.from(rounds);
    const optionLocks = Array.from(roundOptionsLocked);

    if (rnds.length > 1) {
      rnds.pop();
      setRounds(rnds);

      // manage UI locking
      optionLocks.pop();
      optionLocks[optionLocks.length - 1] = false;
      setRoundOptionsLocked(optionLocks);
    }
  };

  const getParentRound = (roundId: number): Round => {
    return rounds[roundId - 1];
  };

  const getLastRound = (): Round => {
    return rounds[rounds.length - 1];
  };

  const changeMaxMatchSize = (roundId: number, maxMatchSize: number) => {
    const rnds = Array.from(rounds);

    const parentRound = getParentRound(roundId);
    const maxVal = roundId === 0 ? numParticipants : parentRound.matches.length * parentRound.passingPerMatch + parentRound.passingExtra;

    if (+maxMatchSize >= minMatchSize && +maxMatchSize <= maxVal) {
      rnds[roundId].maxMatchSize = +maxMatchSize;
      rnds[roundId].matches = rnds[roundId].createMatches();
      setRounds(rnds);
    }
  };

  const changePassingPerMatch = (roundId: number, passingPerMatch: number) => {
    const rnds = Array.from(rounds);

    if (+passingPerMatch >= minPassingPerMatch && +passingPerMatch <= rnds[roundId].maxMatchSize) {
      rnds[roundId].passingPerMatch = +passingPerMatch;
      setRounds(rnds);
    }
  };

  const changePassingExtra = (roundId: number, passingExtra: number) => {
    const rnds = Array.from(rounds);

    if (+passingExtra >= minPassingExtra && +passingExtra <= rnds[roundId].maxPossibleAdvancingExtra) {
      rnds[roundId].passingExtra = +passingExtra;
      setRounds(rnds);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className={`m-2 justify-center overflow-hidden overflow-y-auto`}>
        <div className={'flex flex-col items-center'}>
          <h1 className="mt-2 text-xl">Edit Mode</h1>

          <div className="mt-2 flex gap-2">
            <ActionButton action={Action.ADD} onClick={addRound} />
            <ActionButton action={Action.REMOVE} onClick={removeLastRound} />
          </div>
        </div>

        <div className={'mt-2 flex justify-center '}>
          {rounds.map((round: Round, i: number) => {
            return (
              <div key={`rnd-${i}`} className="mx-1">
                <div className="w-52 rounded-lg border border-primary bg-secondary-light p-1">
                  <div className="my-1 text-center">{round.name}</div>

                  <hr />

                  <RoundOptions
                    round={round}
                    minMatchSize={minMatchSize}
                    numParticipants={numParticipants}
                    minPassingPerMatch={minPassingPerMatch}
                    minPassingExtra={minPassingExtra}
                    lockUi={roundOptionsLocked[i]}
                    onChangeMaxMatchSize={(val: number): void => {
                      changeMaxMatchSize(i, val);
                    }}
                    onChangePassingPerMatch={(val: number): void => {
                      changePassingPerMatch(i, val);
                    }}
                    onChangePassingExtra={(val: number): void => {
                      changePassingExtra(i, val);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className={'mt-2 flex flex-col items-center'}>
          <div className="flex gap-2">
            <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />
            <ActionButton action={Action.SAVE} onClick={handleSaveClicked} />
          </div>
        </div>

        <div className={'mt-2 flex justify-center'}>
          {rounds.map((round: Round, i: number) => {
            return (
              <div key={`rnd-${i}`} className="mx-1">
                <div className="w-52">
                  {round.matches.map((match, j) => {
                    return (
                      /* TODO: my-1 nicht bei top und bottom */
                      <div key={`match-${j}`} className="my-1">
                        <MatchCard match={match} />
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
