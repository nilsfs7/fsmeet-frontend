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
import { User } from '@/domain/types/user';
import { getCompetitionParticipants, getRounds, updateMatchSlots } from '@/infrastructure/clients/competition.client';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { getEvent } from '@/infrastructure/clients/event.client';
import { Event } from '@/domain/types/event';

export default function Seeding({ params }: { params: { eventId: string; compId: string } }) {
  const t = useTranslations('/events/eventid/comps/compid/edit/seeding');

  const { data: session } = useSession();

  const [event, setEvent] = useState<Event>();
  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map<string, User>());
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
    getEvent(params.eventId).then(event => {
      setEvent(event);
    });

    getCompetitionParticipants(params.compId).then(participants => {
      const usersMap = new Map();
      participants.map(participant => {
        usersMap.set(participant.username, participant);
      });

      setUsersMap(usersMap);
    });

    getRounds(params.compId).then(rounds => {
      setRounds(rounds);
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
              usersMap={usersMap}
              seedingEnabled={true}
              showUserCountryFlag={event?.showUserCountryFlag}
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
