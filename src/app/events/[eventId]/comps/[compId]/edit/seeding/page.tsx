'use client';

import { useEffect, useState } from 'react';
import { routeEvents } from '@/domain/constants/routes';
import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import Navigation from '@/components/Navigation';
import { Round } from '@/domain/classes/round';
import BattleGrid from '@/components/comp/BattleGrid';
import Link from 'next/link';
import { Toaster, toast } from 'sonner';
import PageTitle from '@/components/PageTitle';
import { User } from '@/types/user';
import { UserType } from '@/domain/enums/user-type';
import { getCompetitionParticipants, getRounds, updateMatchSlots } from '@/infrastructure/clients/competition.client';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

export default function Seeding({ params }: { params: { eventId: string; compId: string } }) {
  const t = useTranslations('/events/eventid/comps/compid/edit/seeding');

  const { data: session } = useSession();

  const [competitionParticipants, setCompetitionParticipants] = useState<User[]>([]);

  const [rounds, setRounds] = useState<Round[]>([]);

  const handleSlotUpdated = async (roundIndex: number, matchId: string, slotIndex: number, username: string, result: number) => {
    const rnds = Array.from(rounds);
    const match = rnds[roundIndex].matches.filter(match => {
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

    try {
      await updateMatchSlots(params.eventId, params.compId, matchId, slotIndex, username, result, session);
      toast.success('Slot updated');
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    getCompetitionParticipants(params.compId).then(participants => {
      const users: User[] = [];
      participants.map(participant => {
        users.push({ username: participant.username, type: UserType.FREESTYLER, firstName: participant.firstName, lastName: participant.lastName });
      });
      setCompetitionParticipants(users);
      getRounds(params.compId).then(rounds => {
        setRounds(rounds);
      });
    });
  }, []);

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <PageTitle title={t('pageTitle')} />

        <div className={`mx-2 flex flex-col overflow-y-auto`}>
          <div className={'my-2 flex justify-center'}>
            {rounds.length === 0 && <div>{t('textNoGameMode')}</div>}

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
          <Link href={`${routeEvents}/${params.eventId}/comps`}>
            <ActionButton action={Action.BACK} />
          </Link>
        </Navigation>
      </div>
    </>
  );
}
