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
import PageTitle from '@/components/PageTitle';
import { User } from '@/types/user';
import { UserType } from '@/types/enums/user-type';

const Seeding = (props: any) => {
  const session = props.session;

  const router = useRouter();
  const { eventId } = router.query;
  const { compId } = router.query;

  const [competitionParticipants, setCompetitionParticipants] = useState<User[]>([]);

  const [rounds, setRounds] = useState<Round[]>([]);

  const handleSlotUpdated = async (roundIndex: number, matchId: string, slotIndex: number, username: string, result: number) => {
    const rnds = Array.from(rounds);
    const match = rnds[roundIndex].matches.filter((match) => {
      if (match.id === matchId) {
        return match;
      }
    })[0];

    let slotIndexFound = false;
    for (let i = 0; i < match.matchSlots.length; i++) {
      if (match.matchSlots[i].slotIndex === slotIndex) {
        match.matchSlots[i].name = username;
        match.matchSlots[i].result = result;

        slotIndexFound = true;
      }
    }

    if (!slotIndexFound) {
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
        const users: User[] = [];
        participants.map((participant) => {
          users.push({ username: participant.username, type: UserType.FREESTYLER });
        });
        setCompetitionParticipants(users);
        getRounds(compId?.toString()).then((rounds) => {
          setRounds(rounds);
        });
      });
    }
  }, []);

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title="Seeding & Results" />

        <div className={`mx-2 flex flex-col overflow-y-auto`}>
          <div className={'my-2 flex justify-center'}>
            {rounds.length === 0 && <div>{`You have not configured a game mode, yet.`}</div>}

            <BattleGrid
              rounds={rounds}
              seedingEnabled={true}
              seedingList={competitionParticipants}
              onUpdateSlot={(roundIndex: number, matchId: string, slotIndex: number, username: string, result: number) => {
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
