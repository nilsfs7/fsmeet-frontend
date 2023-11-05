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
import { Round } from '@/types/round';
import BattleGrid from '@/components/comp/BattleGrid';

const Seeding = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [competitionParticipants, setCompetitionParticipants] = useState<{ username: string }[]>([]);

  const [rounds, setRounds] = useState<Round[]>([]);

  if (!session) {
    router.push(routeLogin);
  }

  const fetchCompetitionParticipants = async (compId: string): Promise<number> => {
    const url: string = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/participants`;
    const response = await fetch(url);
    const participants = await response.json();
    setCompetitionParticipants(participants);
    return participants.length;
  };

  const fetchRounds = async (compId: string): Promise<Round[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`);
    const rnds: Round[] = await response.json();

    const rounds: Round[] = rnds.map(rnd => {
      const round = new Round(rnd.roundIndex, rnd.name, rnd.numberPlayers);
      round.passingExtra = rnd.passingExtra;
      round.passingPerMatch = rnd.passingPerMatch;
      round.matches = rnd.matches.sort((a, b) => (a.matchIndex > b.matchIndex ? 1 : -1)); // override auto generated matches (TODO: geht besser)
      return round;
    });

    return rounds;
  };

  const handleSlotUpdated = async (roundIndex: number, matchId: string, slotIndex: number, username: string) => {
    const rnds = Array.from(rounds);
    const match = rnds[roundIndex].matches.filter(match => {
      if (match.id === matchId) {
        return match;
      }
    })[0];

    let nameUpdated = false;
    for (let i = 0; i < match.matchSlots.length; i++) {
      if (match.matchSlots[i].slotIndex === slotIndex) {
        match.matchSlots[i].name = username;

        nameUpdated = true;
      }
    }
    if (!nameUpdated) {
      match.matchSlots.push({ id: '', slotIndex: slotIndex, name: username });
    }

    setRounds(rnds);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/matches/${matchId}/slots`, {
      method: 'PUT',
      body: JSON.stringify({
        eventId: eventId,
        slotIndex: slotIndex,
        name: username,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (response.status == 201) {
      console.info(`match ${matchId} updated. new name: ${name}`);
    }
  };

  useEffect(() => {
    if (compId) {
      // @ts-ignore: next-line
      fetchCompetitionParticipants(compId).then(numParticipants => {
        // @ts-ignore: next-line
        fetchRounds(compId).then(rounds => {
          if (rounds.length === 0) {
            const initRound = new Round(0, 'Round 1', numParticipants);
            setRounds([initRound]);
          } else {
            setRounds(rounds);
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

  const getParentRound = (roundId: number): Round => {
    return rounds[roundId - 1];
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className={`m-2 justify-center overflow-hidden overflow-y-auto`}>
        <div className={'flex flex-col items-center'}>
          <h1 className="mt-2 text-xl">Seeding</h1>
        </div>

        <div className={'mt-2 flex justify-center'}>
          <div className="flex overflow-x-auto">
            <BattleGrid
              rounds={rounds}
              seedingEnabled={true}
              seedingList={competitionParticipants}
              onUpdateSlot={(roundIndex: number, matchId: string, slotIndex: number, username: string) => {
                handleSlotUpdated(roundIndex, matchId, slotIndex, username);
              }}
            />
          </div>
        </div>
      </div>

      <Navigation>
        <ActionButton action={Action.BACK} onClick={() => router.replace(`/events/${eventId}/comps/${compId}/edit`)} />
      </Navigation>
    </div>
  );
};

export default Seeding;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
};
