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
import RoundOptions from '@/components/comp/RoundOptions';
import { Round } from '@/types/round';
import BattleGrid from '@/components/comp/BattleGrid';
import Link from 'next/link';
import { Moment } from 'moment';
import { getRounds } from '@/services/fsmeet-backend/get-rounds';
import { validateSession } from '@/types/funcs/validate-session';

const ModeEditing = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [competitionParticipants, setCompetitionParticipants] = useState<{ username: string }[]>([]);

  const minMatchSize = 2;
  const minPassingPerMatch = 1;
  const minPassingExtra = 0;

  const [gameModeApplied, setGameModeApplied] = useState<boolean>(false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [roundOptionsLocked, setRoundOptionsLocked] = useState<boolean[]>([false]);

  const fetchCompetitionParticipants = async (compId: string): Promise<number> => {
    const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/participants`;
    const response = await fetch(url);
    const participants = await response.json();
    setCompetitionParticipants(participants);
    return participants.length;
  };

  const handleSaveClicked = async () => {
    const body = JSON.stringify({
      rounds: rounds,
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    if (response.status == 201) {
      router.reload();
    } else {
      const error = await response.json();
      console.error(error.message);
    }
  };

  const handleDeleteClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    if (response.status == 200) {
      router.reload();
    } else {
      const error = await response.json();
      console.error(error.message);
    }
  };

  const handleMatchRenamed = async (roundIndex: number, matchIndex: number, matchId: string, name: string) => {
    const rnds = Array.from(rounds);
    rnds[roundIndex].matches[matchIndex].name = name;
    setRounds(rnds);

    if (name) {
      const body = JSON.stringify({
        matchId: matchId,
        name: name,
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/matches`, {
        method: 'PATCH',
        body: body,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      if (response.status == 200) {
        console.info(`match ${matchId} updated. new name: ${name}`);
      }
    } else {
      console.warn('empty match name');
    }
  };

  const handleTimeUpdated = async (roundIndex: number, matchIndex: number, matchId: string, time: Moment | null) => {
    const rnds = Array.from(rounds);
    rnds[roundIndex].matches[matchIndex].time = time ? time.format() : undefined;
    setRounds(rnds);

    const body = JSON.stringify({
      matchId: matchId,
      time: time,
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/matches`, {
      method: 'PATCH',
      body: body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 200) {
      console.info(`match ${matchId} updated. new time: ${time}`);
    }
  };

  useEffect(() => {
    if (compId) {
      // @ts-ignore: next-line
      fetchCompetitionParticipants(compId).then(numParticipants => {
        // @ts-ignore: next-line
        getRounds(compId).then(rounds => {
          if (rounds.length === 0) {
            const initRound = new Round(0, 'Round 1', numParticipants);
            setRounds([initRound]);
            setGameModeApplied(false);
          } else {
            setRounds(rounds);
            setGameModeApplied(true);
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    if (compId) {
      rounds.map((rnd, i) => {
        // update input "max-match-size"
        const inputMaxMatchSize = document.getElementById(`input-max-match-size-${i}`);
        if (inputMaxMatchSize) {
          const maxMatchSize = i === 0 ? competitionParticipants.length : getParentRound(i).advancingTotal;
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
    }
  }, [rounds]);

  const addRound = () => {
    const rnds = Array.from(rounds);
    let optionLocks = Array.from(roundOptionsLocked);

    const lastRound = getLastRound();

    if (lastRound.advancingTotal > 1) {
      const newRound = new Round(rnds.length, `Round ${rounds.length + 1}`, lastRound.advancingTotal, lastRound.cumulatedMatchStartingIndex);
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
    const maxVal = roundId === 0 ? competitionParticipants.length : parentRound.matches.length * parentRound.passingPerMatch + parentRound.passingExtra;
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
        </div>

        <div className={'mt-2 flex justify-center'}>
          <div className={'flex overflow-x-auto'}>
            {rounds.map((round: Round, i: number) => {
              return (
                <div key={`rnd-${i}`} className="mx-1">
                  <div className="w-52 rounded-lg border border-primary bg-secondary-light p-1">
                    <div className="my-1 text-center">{round.name}</div>

                    <hr />

                    <RoundOptions
                      round={round}
                      minMatchSize={minMatchSize}
                      numParticipants={competitionParticipants.length}
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
        </div>

        <div className={'mt-2 flex flex-col items-center'}>
          {!gameModeApplied && (
            <div className="mt-2 flex gap-2">
              <>
                {getLastRound() && getLastRound().numberPlayers > 2 && <ActionButton action={Action.ADD} onClick={addRound} />}
                {rounds.length > 1 && <ActionButton action={Action.REMOVE} onClick={removeLastRound} />}
              </>
            </div>
          )}

          <div className="mt-2 flex gap-2">
            {gameModeApplied && <ActionButton action={Action.DELETE} onClick={handleDeleteClicked} />}
            {!gameModeApplied && getLastRound() && (getLastRound().numberPlayers < 3 || getLastRound().advancingTotal === 1) && <ActionButton action={Action.SAVE} onClick={handleSaveClicked} />}
          </div>

          <h1 className="mt-8 text-xl">Preview</h1>
        </div>

        <div className={'mt-2 flex justify-center'}>
          <div className="flex overflow-x-auto">
            <BattleGrid
              rounds={rounds}
              editingEnabled={true}
              onRenameMatch={(roundIndex, matchIndex, matchId, name) => {
                handleMatchRenamed(roundIndex, matchIndex, matchId, name);
              }}
              onUpdateTime={(roundIndex, matchIndex, matchId, time) => {
                handleTimeUpdated(roundIndex, matchIndex, matchId, time);
              }}
            />
          </div>
        </div>
      </div>

      <Navigation>
        <Link href={`/events/${eventId}/comps`}>
          <ActionButton action={Action.BACK} onClick={() => router.replace(`/events/${eventId}/comps`)} />
        </Link>
      </Navigation>
    </div>
  );
};

export default ModeEditing;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  if (!validateSession(session)) {
    return {
      redirect: {
        permanent: false,
        destination: routeLogin,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};
