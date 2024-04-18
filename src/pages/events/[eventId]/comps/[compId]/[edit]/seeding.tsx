/*
  - runden erst erstellen lassen nachdem registrierung zuende
  - dadurch ist die teilnehmeranzahl bekannt
*/

import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { routeEvents, routeLogin } from '@/types/consts/routes';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/types/enums/action';
import Navigation from '@/components/Navigation';
import { Round } from '@/types/round';
import BattleGrid from '@/components/comp/BattleGrid';
import Link from 'next/link';
import { validateSession } from '@/types/funcs/validate-session';
import { getRounds } from '@/services/fsmeet-backend/get-rounds';
import { getCompetitionParticipants } from '@/services/fsmeet-backend/get-competition-participants';
import { updateMatchSlots } from '@/services/fsmeet-backend/update-match-slots';
import { Toaster, toast } from 'sonner';

const Seeding = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [competitionParticipants, setCompetitionParticipants] = useState<{ username: string }[]>([]);

  const [rounds, setRounds] = useState<Round[]>([]);

  const handleSlotUpdated = async (roundIndex: number, matchId: string, slotIndex: number, username: string, result?: number) => {
    const rnds = Array.from(rounds);
    const match = rnds[roundIndex].matches.filter((match) => {
      if (match.id === matchId) {
        return match;
      }
    })[0];

    let nameUpdated = false;
    for (let i = 0; i < match.matchSlots.length; i++) {
      if (match.matchSlots[i].slotIndex === slotIndex) {
        match.matchSlots[i].name = username;
        match.matchSlots[i].result = result;

        nameUpdated = true;
      }
    }
    if (!nameUpdated) {
      match.matchSlots.push({
        id: '',
        slotIndex: slotIndex,
        name: username,
        result: result,
      });
    }

    setRounds(rnds);

    if (eventId && compId) {
      try {
        await updateMatchSlots(eventId?.toString(), compId?.toString(), matchId, slotIndex, username, result, session);
        toast.success('Slot updated');
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (compId) {
      getCompetitionParticipants(compId?.toString()).then((participants) => {
        setCompetitionParticipants(participants);
        getRounds(compId?.toString()).then((rounds) => {
          setRounds(rounds);
        });
      });
    }
  }, []);

  return (
    <>
      <Toaster richColors />

      <div className="absolute inset-0 flex flex-col">
        <div className={`m-2 flex flex-col overflow-hidden`}>
          <div className={'flex flex-col items-center'}>
            <h1 className="mt-2 text-xl">{`Seeding & Results`}</h1>
          </div>

          <div className={'my-2 flex justify-center overflow-y-auto'}>
            {rounds.length === 0 && <div>{`You have not configured a game mode, yet.`}</div>}

            <BattleGrid
              rounds={rounds}
              seedingEnabled={true}
              seedingList={competitionParticipants}
              onUpdateSlot={(roundIndex: number, matchId: string, slotIndex: number, username: string, result?: number) => {
                handleSlotUpdated(roundIndex, matchId, slotIndex, username, result);
              }}
            />
          </div>
        </div>

        <Navigation>
          <Link href={`${routeEvents}/${eventId}/comps`}>
            <ActionButton action={Action.BACK} />
          </Link>
        </Navigation>
      </div>
    </>
  );
};

export default Seeding;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
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
